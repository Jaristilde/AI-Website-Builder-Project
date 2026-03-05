import { BusinessData } from '../types/builder';

export interface PublishResult {
  success: boolean;
  slug?: string;
  url?: string;
  publishToken?: string;
  error?: string;
}

export interface SlugCheckResult {
  available: boolean;
  slug: string;
  error?: string;
}

export async function publishSite(
  businessData: BusinessData,
  slug: string,
  publishToken?: string,
  userId?: string
): Promise<PublishResult> {
  try {
    const response = await fetch('/.netlify/functions/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessData, slug, publishToken, userId }),
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error. Please check your connection and try again.' };
  }
}

export async function checkSlugAvailability(slug: string): Promise<SlugCheckResult> {
  try {
    const response = await fetch(`/.netlify/functions/check-slug?slug=${encodeURIComponent(slug)}`);
    return await response.json();
  } catch (error) {
    return { available: false, slug, error: 'Network error' };
  }
}
