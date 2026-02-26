import type { Context } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';
import { getCorsHeaders, handleCorsPreflight } from './_shared/cors';

const VALID_BUSINESS_TYPES = [
  'barbershop', 'salon', 'restaurant', 'consultant',
  'store', 'mechanic', 'tutor', 'church', 'other',
];

const VALID_DESIGN_STYLES = [
  'modern', 'luxury', 'minimal', 'bold', 'dark', 'warm',
];

function buildExtractionPrompt(
  markdown: string,
  metadata?: { title?: string; description?: string }
): string {
  const metaContext = metadata
    ? `\nPage title: ${metadata.title || 'N/A'}\nPage description: ${metadata.description || 'N/A'}\n`
    : '';

  return `You are a business data extraction assistant. Analyze the following website content and extract structured business information.
${metaContext}
Website content:
---
${markdown.slice(0, 12000)}
---

Extract the following fields and return ONLY a valid JSON object (no markdown fences, no explanation):

{
  "businessType": one of [${VALID_BUSINESS_TYPES.map(t => `"${t}"`).join(', ')}],
  "businessName": "the business name",
  "services": [
    { "name": "service name", "price": "$XX or null", "description": "brief description", "category": "category or null" }
  ],
  "phone": "phone number or null",
  "email": "email address or null",
  "city": "city or null",
  "state": "US state abbreviation or null",
  "tagline": "a short tagline or slogan extracted or generated from the content",
  "designStyle": one of [${VALID_DESIGN_STYLES.map(s => `"${s}"`).join(', ')}] - pick the style that best matches the business vibe,
  "brandColor": "a hex color code that fits the business branding (e.g. #7C3AED)",
  "confidence": a number from 0 to 1 indicating how confident you are in the overall extraction
}

Rules:
- For businessType, pick the closest match. Use "other" only if nothing else fits.
- Extract up to 10 services maximum. Each service MUST have at least a "name" field.
- For phone/email/city/state, extract only if clearly present on the page. Use null otherwise.
- For tagline, prefer text explicitly on the page. If none exists, create a short one from context.
- For designStyle, infer from the business type and tone of the content.
- For brandColor, extract from any color mentions or infer a suitable brand color.
- Return ONLY the JSON object. No other text.`;
}

interface ExtractRequestBody {
  markdownContent: string;
  metadata?: { title?: string; description?: string };
}

export default async function handler(req: Request, _context: Context): Promise<Response> {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'POST') {
    return Response.json(
      { success: false, error: 'Method not allowed' },
      { status: 405, headers: corsHeaders }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment');
    return Response.json(
      { success: false, error: 'AI extraction service is not configured' },
      { status: 500, headers: corsHeaders }
    );
  }

  let body: ExtractRequestBody;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400, headers: corsHeaders }
    );
  }

  const { markdownContent, metadata } = body;

  if (!markdownContent || typeof markdownContent !== 'string') {
    return Response.json(
      { success: false, error: 'markdownContent is required' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildExtractionPrompt(markdownContent, metadata);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (!text) {
      return Response.json(
        { success: false, error: 'AI returned an empty response' },
        { status: 502, headers: corsHeaders }
      );
    }

    // Strip markdown fences if the model adds them
    const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');

    // Validate it's parseable JSON before returning
    try {
      JSON.parse(cleaned);
    } catch {
      console.error('Gemini returned invalid JSON:', text);
      return Response.json(
        { success: false, error: 'AI returned an invalid response format' },
        { status: 502, headers: corsHeaders }
      );
    }

    return Response.json(
      { success: true, rawJson: cleaned },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Gemini extraction error:', error);
    return Response.json(
      { success: false, error: 'AI extraction failed. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
