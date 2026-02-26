import { GoogleGenAI } from '@google/genai';
import {
  BusinessData,
  BusinessType,
  DesignStyle,
  ServiceItem,
  AIExtractionResult,
} from '../types/builder';

const VALID_BUSINESS_TYPES: BusinessType[] = [
  'barbershop', 'salon', 'restaurant', 'consultant',
  'store', 'mechanic', 'tutor', 'church', 'other',
];

const VALID_DESIGN_STYLES: DesignStyle[] = [
  'modern', 'luxury', 'minimal', 'bold', 'dark', 'warm',
];

const id = () => Math.random().toString(36).slice(2, 9);

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

function normalizeExtraction(raw: Record<string, unknown>): Partial<BusinessData> {
  const result: Partial<BusinessData> = {};

  const rawType = raw.businessType as string;
  if (rawType && VALID_BUSINESS_TYPES.includes(rawType as BusinessType)) {
    result.businessType = rawType as BusinessType;
  }

  if (typeof raw.businessName === 'string' && raw.businessName.trim()) {
    result.businessName = raw.businessName.trim();
  }

  if (Array.isArray(raw.services)) {
    result.services = raw.services
      .filter(
        (s: unknown) =>
          typeof s === 'object' &&
          s !== null &&
          typeof (s as Record<string, unknown>).name === 'string'
      )
      .slice(0, 10)
      .map((s: unknown) => {
        const svc = s as Record<string, unknown>;
        const item: ServiceItem = {
          id: id(),
          name: String(svc.name).trim(),
        };
        if (typeof svc.price === 'string' && svc.price.trim()) item.price = svc.price.trim();
        if (typeof svc.description === 'string' && svc.description.trim())
          item.description = svc.description.trim();
        if (typeof svc.category === 'string' && svc.category.trim())
          item.category = svc.category.trim();
        return item;
      });
  }

  if (typeof raw.phone === 'string' && raw.phone.trim()) result.phone = raw.phone.trim();
  if (typeof raw.email === 'string' && raw.email.trim()) result.email = raw.email.trim();
  if (typeof raw.city === 'string' && raw.city.trim()) result.city = raw.city.trim();
  if (typeof raw.state === 'string' && raw.state.trim()) result.state = raw.state.trim();
  if (typeof raw.tagline === 'string' && raw.tagline.trim()) result.tagline = raw.tagline.trim();

  const rawStyle = raw.designStyle as string;
  if (rawStyle && VALID_DESIGN_STYLES.includes(rawStyle as DesignStyle)) {
    result.designStyle = rawStyle as DesignStyle;
  }

  if (typeof raw.brandColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(raw.brandColor)) {
    result.brandColor = raw.brandColor;
  }

  return result;
}

/**
 * Extract structured business data from scraped markdown using Google Gemini.
 */
export async function extractBusinessData(
  markdown: string,
  metadata?: { title?: string; description?: string }
): Promise<AIExtractionResult> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { success: false, message: 'Gemini API key is not configured.' };
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildExtractionPrompt(markdown, metadata);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (!text) {
      return { success: false, message: 'Gemini returned an empty response.' };
    }

    // Strip markdown fences if the model adds them despite instructions
    const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse Gemini response as JSON:', text);
      return { success: false, message: 'AI returned an invalid response format.' };
    }

    const data = normalizeExtraction(parsed);
    const confidence =
      typeof parsed.confidence === 'number'
        ? Math.max(0, Math.min(1, parsed.confidence))
        : undefined;

    return {
      success: true,
      data,
      confidence,
      message: 'Business data extracted successfully.',
    };
  } catch (error) {
    console.error('AI extraction error:', error);
    return { success: false, message: 'Failed to extract business data. Please try again.' };
  }
}
