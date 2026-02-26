const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8888',
];

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith('.netlify.app') ||
    origin.endsWith('.my1stwebsite.com') ||
    origin === 'https://my1stwebsite.com'
  );
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}

export function handleCorsPreflight(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(req.headers.get('origin')),
    });
  }
  return null;
}
