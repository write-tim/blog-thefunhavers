/** A link shown in the hero and footer.
 *  `icon` is any name from src/components/Icon.astro */
export interface SocialLink {
  url: string;
  label: string;
  icon?:
    | 'github'
    | 'linkedin'
    | 'instagram'
    | 'email'
    | 'rss'
    | 'download'
    | 'arrow-right'
    | 'arrow-left'
    | 'sun'
    | 'moon';
}

/**
 * ─────────────────────────────────────────────────────────────
 *  Site identity — the one file you must edit first.
 *  Everything on the site (titles, meta tags, footer, hero
 *  social links) reads from here.
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  /** Your full name — used for <title> and meta tags */
  title: 'The Funhavers',
  /** Short handle used after the dot in page titles ("About · rowanhale") */
  shortTitle: 'thefunhavers',
  /** Default meta description for pages that don't set their own */
  description:
    "Pictures, or it didn't happen. Adventure is out there... let's go find it.",
  /** Your production URL — no trailing slash. Used for canonical URLs, OG tags, RSS and sitemap */
  url: 'https://blog.thefunhavers.club',
  author: {
    name: 'Timothy M. Johnson',
    email: 'tim@timothyjohnsonwrites.com',
    location: 'United States',
    /** Optional: link to a PDF résumé served from /public */
    resume: '/resume/Resume.pdf',
  },
  /** Shown in the hero and footer. Delete a line to remove it from both places.
   *  `icon` is any name from src/components/Icon.astro */
  socials: {
    github: { url: 'https://github.com/write-tim/blog-thefunhavers', label: 'GitHub', icon: 'github' },
    email: { url: 'mailto:tim@timothyjohnsonwrites.com', label: 'Email', icon: 'email' },
    portfolio: { url: 'https://timothyjohnsonwrites.com', label: 'Portfolio', icon: 'arrow-right' },
    rss: { url: '/rss.xml', label: 'RSS', icon: 'rss' },
  } satisfies Record<string, SocialLink>,
};

export type SocialKey = keyof typeof site.socials;

/**
 * Prefix a root-relative path ("/img/x.jpg") with the configured base
 * path (`base` in astro.config.mjs). Anything else — external URLs,
 * mailto:/tel: links, already-prefixed paths — passes through
 * untouched. Use it for every internal link and public/ asset so the
 * site works at a subpath (e.g. GitHub Pages project sites) as well as
 * at the domain root.
 */
export const withBase = (path: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  if (!path.startsWith('/')) return path;
  if (path.startsWith(`${base}/`)) return path;
  return `${base}${path}`;
};
