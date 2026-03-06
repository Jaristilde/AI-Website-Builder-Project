import type { Context } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getCorsHeaders, handleCorsPreflight } from './_shared/cors';

const SITES_COLLECTION = 'published_sites';

function getDb() {
  if (getApps().length === 0) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!key) throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not set');
    try {
      const parsed = JSON.parse(key);
      if (!parsed.project_id) throw new Error('Missing project_id in service account key');
      initializeApp({ credential: cert(parsed) });
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
      throw e;
    }
  }
  return getFirestore();
}

export default async function handler(req: Request, _context: Context): Promise<Response> {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  const preflight = handleCorsPreflight(req);
  if (preflight) return preflight;

  if (req.method !== 'GET') {
    return Response.json(
      { available: false, error: 'Method not allowed' },
      { status: 405, headers: corsHeaders }
    );
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
    return Response.json(
      { available: false, error: 'Slug parameter is required' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const db = getDb();
    const snapshot = await db
      .collection(SITES_COLLECTION)
      .where('slug', '==', slug.toLowerCase())
      .limit(1)
      .get();

    return Response.json(
      { available: snapshot.empty, slug: slug.toLowerCase() },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Slug check error:', error);
    return Response.json(
      { available: false, error: 'An error occurred. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
