import type { Context } from '@netlify/functions';
import FirecrawlApp from '@mendable/firecrawl-js';

interface ScrapeRequestBody {
  url: string;
}

interface ScrapeResponseBody {
  success: boolean;
  markdown?: string;
  metadata?: {
    title?: string;
    description?: string;
    sourceUrl?: string;
    [key: string]: unknown;
  };
  error?: string;
}

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8888',
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin =
    origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.netlify.app'))
      ? origin
      : '';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function isValidUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default async function handler(req: Request, _context: Context): Promise<Response> {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return Response.json(
      { success: false, error: 'Method not allowed' } satisfies ScrapeResponseBody,
      { status: 405, headers: corsHeaders }
    );
  }

  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlKey) {
    console.error('FIRECRAWL_API_KEY is not set in environment');
    return Response.json(
      { success: false, error: 'Scraping service is not configured' } satisfies ScrapeResponseBody,
      { status: 500, headers: corsHeaders }
    );
  }

  let body: ScrapeRequestBody;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { success: false, error: 'Invalid JSON body' } satisfies ScrapeResponseBody,
      { status: 400, headers: corsHeaders }
    );
  }

  const { url } = body;
  if (!url || typeof url !== 'string' || !isValidUrl(url)) {
    return Response.json(
      { success: false, error: 'A valid URL is required (http or https)' } satisfies ScrapeResponseBody,
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const app = new FirecrawlApp({ apiKey: firecrawlKey });
    const doc = await app.scrape(url, {
      formats: ['markdown'],
      onlyMainContent: true,
      waitFor: 2000,
      timeout: 30000,
    });

    if (!doc.markdown) {
      return Response.json(
        { success: false, error: 'Failed to scrape the URL. The page may be inaccessible.' } satisfies ScrapeResponseBody,
        { status: 422, headers: corsHeaders }
      );
    }

    const response: ScrapeResponseBody = {
      success: true,
      markdown: doc.markdown,
      metadata: {
        title: doc.metadata?.title,
        description: doc.metadata?.description,
        sourceUrl: url,
      },
    };

    return Response.json(response, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('Firecrawl scrape error:', error);
    return Response.json(
      { success: false, error: 'An error occurred while scraping. Please try again.' } satisfies ScrapeResponseBody,
      { status: 500, headers: corsHeaders }
    );
  }
}
