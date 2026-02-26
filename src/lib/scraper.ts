import { ScrapeResult } from '../types/builder';

/**
 * Scrape a URL via the Netlify Function endpoint.
 * Returns structured markdown + metadata or an error.
 */
export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  try {
    const endpoint = '/.netlify/functions/scrape';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      return {
        success: false,
        error: errorBody?.error || `Scrape failed with status ${response.status}`,
      };
    }

    const data: ScrapeResult = await response.json();
    return data;
  } catch (error) {
    console.error('Scraper client error:', error);
    return {
      success: false,
      error: 'Network error: could not reach the scraping service.',
    };
  }
}
