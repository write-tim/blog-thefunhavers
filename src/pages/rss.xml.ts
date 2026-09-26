import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import { site, withBase } from '../data/site';

export async function GET(context: APIContext) {
  const headerFooterEntry = await getEntry('pages', 'header-footer');
  const siteTitle = headerFooterEntry?.data?.siteTitle || site.title;
  const siteDescription = headerFooterEntry?.data?.siteDescription || site.description;

  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.subtitle ?? post.data.description ?? '',
      pubDate: post.data.date,
      link: withBase(`/blog/${post.id}/`),
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
