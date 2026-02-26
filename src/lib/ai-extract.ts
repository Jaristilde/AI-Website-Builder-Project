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
 * Extract structured business data from scraped markdown using the
 * server-side Gemini extraction function (API key is never exposed to the browser).
 */
export async function extractBusinessData(
  markdown: string,
  metadata?: { title?: string; description?: string }
): Promise<AIExtractionResult> {
  try {
    const response = await fetch('/.netlify/functions/gemini-extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markdownContent: markdown, metadata }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.error || `Extraction failed with status ${response.status}`;
      return { success: false, message };
    }

    const result = await response.json();

    if (!result.success || !result.rawJson) {
      return { success: false, message: result.error || 'AI returned an invalid response.' };
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(result.rawJson);
    } catch {
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
