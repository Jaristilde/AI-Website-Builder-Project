const MAIN_DOMAINS = ['my1stwebsite.com', 'www.my1stwebsite.com'];
const DEV_PARAM = 'site';

export interface SubdomainInfo {
  isSubdomain: boolean;
  slug: string | null;
}

export function detectSubdomain(): SubdomainInfo {
  // Dev mode: check for ?site=slug query parameter
  if (import.meta.env.DEV) {
    const params = new URLSearchParams(window.location.search);
    const devSlug = params.get(DEV_PARAM);
    if (devSlug) {
      return { isSubdomain: true, slug: devSlug };
    }
  }

  const hostname = window.location.hostname;

  // Check if we're on a *.my1stwebsite.com subdomain
  if (hostname.endsWith('.my1stwebsite.com') && !MAIN_DOMAINS.includes(hostname)) {
    const slug = hostname.replace('.my1stwebsite.com', '');
    return { isSubdomain: true, slug };
  }

  return { isSubdomain: false, slug: null };
}

export function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,48}[a-z0-9]$/.test(slug) || /^[a-z0-9]{1,2}$/.test(slug);
}
