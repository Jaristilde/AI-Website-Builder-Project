import type { Context } from '@netlify/functions';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getCorsHeaders, handleCorsPreflight } from './_shared/cors';
import { randomBytes } from 'crypto';

// Initialize Firebase Admin (singleton)
if (getApps().length === 0) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();
const SITES_COLLECTION = 'published_sites';

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$/;
const SHORT_SLUG_REGEX = /^[a-z0-9]{1,2}$/;

function isValidSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug) || SHORT_SLUG_REGEX.test(slug);
}

interface PublishRequestBody {
  businessData: Record<string, unknown>;
  slug: string;
  publishToken?: string;
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

  // Validate Firebase config
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    console.error('FIREBASE_SERVICE_ACCOUNT_KEY is not set');
    return Response.json(
      { success: false, error: 'Publishing service is not configured' },
      { status: 500, headers: corsHeaders }
    );
  }

  let body: PublishRequestBody;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400, headers: corsHeaders }
    );
  }

  const { businessData, slug, publishToken } = body;

  // Validate slug
  if (!slug || typeof slug !== 'string' || !isValidSlug(slug)) {
    return Response.json(
      { success: false, error: 'Invalid slug. Use lowercase letters, numbers, and hyphens (3-50 chars).' },
      { status: 400, headers: corsHeaders }
    );
  }

  // Validate businessData
  if (!businessData || typeof businessData !== 'object') {
    return Response.json(
      { success: false, error: 'Business data is required' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const sitesRef = db.collection(SITES_COLLECTION);

    // UPDATE existing site
    if (publishToken) {
      const snapshot = await sitesRef
        .where('slug', '==', slug)
        .where('publishToken', '==', publishToken)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return Response.json(
          { success: false, error: 'Site not found or invalid publish token' },
          { status: 403, headers: corsHeaders }
        );
      }

      const docRef = snapshot.docs[0].ref;
      await docRef.update({
        businessData,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const baseUrl = process.env.URL || 'https://ai-website-builder-joane.netlify.app';

      return Response.json(
        {
          success: true,
          slug,
          url: `${baseUrl}/site/${slug}`,
          publishToken,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // CREATE new site — check slug availability first
    const existing = await sitesRef.where('slug', '==', slug).limit(1).get();
    if (!existing.empty) {
      return Response.json(
        { success: false, error: 'This URL is already taken. Please choose a different one.' },
        { status: 409, headers: corsHeaders }
      );
    }

    const newToken = randomBytes(32).toString('hex');

    await sitesRef.add({
      slug,
      businessData,
      publishToken: newToken,
      ownerEmail: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const baseUrl = process.env.URL || 'https://ai-website-builder-joane.netlify.app';

    return Response.json(
      {
        success: true,
        slug,
        url: `${baseUrl}/site/${slug}`,
        publishToken: newToken,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Publish error:', error);
    return Response.json(
      { success: false, error: 'An error occurred while publishing. Please try again.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
