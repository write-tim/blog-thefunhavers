import fs from "node:fs";
import path from "node:path";
import type { AstroIntegration } from "astro";
import { visit } from "unist-util-visit";
import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import config from "./astro-paper.config";

function slugifyStr(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateArticlesManifest() {
  const postsDir = path.resolve("./src/content/posts");
  const pagesDir = path.resolve("./src/content/pages");
  const targetFile = path.resolve("./public/admin/articles.json");

  function getFiles(dir: string): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else if (file.endsWith(".mdx") || file.endsWith(".md")) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const postFiles = getFiles(postsDir);
  const pageFiles = getFiles(pagesDir);

  const articles: Array<{
    title: string;
    route: string;
    desc: string;
    category: string;
    file?: string;
  }> = [];

  // Base pages
  articles.push({
    title: config.site.title || "The Funhavers",
    route: "/",
    desc: config.site.description || "A blog by The Funhavers.",
    category: "Home",
  });
  articles.push({
    title: "Archives",
    route: "/archives/",
    desc: "All archived blog posts.",
    category: "Pages",
  });
  articles.push({
    title: "Search",
    route: "/search/",
    desc: "Search blog posts.",
    category: "Pages",
  });
  articles.push({
    title: "Tags",
    route: "/tags/",
    desc: "Browse posts by tag.",
    category: "Pages",
  });

  // Custom pages
  for (const file of pageFiles) {
    const content = fs.readFileSync(file, "utf8");
    const rel = path.relative(pagesDir, file);
    const titleMatch = content.match(/^title:\s*["'`]?(.*?)["'`]?$/m);
    const descMatch = content.match(/^description:\s*["'`]?(.*?)["'`]?$/m);
    const title = titleMatch
      ? titleMatch[1].trim()
      : path.basename(file, path.extname(file));
    const desc = descMatch ? descMatch[1].trim() : "";
    const slug = rel.replace(/\.(mdx|md)$/, "");
    if (slug === "home" || slug === "index") {
      const homeArt = articles.find(a => a.route === "/");
      if (homeArt) {
        if (title) homeArt.title = title;
        if (desc) homeArt.desc = desc;
        homeArt.file = `pages/${rel}`;
      }
      continue;
    }
    const route = `/${slug}/`;
    articles.push({
      title,
      route,
      desc,
      category: "Pages",
      file: `pages/${rel}`,
    });
  }

  // Posts
  for (const file of postFiles) {
    const content = fs.readFileSync(file, "utf8");
    const rel = path.relative(postsDir, file);
    const titleMatch = content.match(/^title:\s*["'`]?(.*?)["'`]?$/m);
    const descMatch = content.match(/^description:\s*["'`]?(.*?)["'`]?$/m);
    const title = titleMatch
      ? titleMatch[1].trim()
      : path.basename(file, path.extname(file));
    const desc = descMatch ? descMatch[1].trim() : "";

    const segments = rel
      .split(path.sep)
      .filter(p => p !== "")
      .filter(p => !p.startsWith("_"))
      .slice(0, -1)
      .map(slugifyStr);

    const baseName = path.basename(file, path.extname(file));
    const slugPath =
      segments.length > 0 ? [...segments, baseName].join("/") : baseName;
    const route = `/posts/${slugPath}/`;

    let category = "Blog Posts";
    const parts = rel.split(path.sep);
    if (parts.length > 1) {
      const folder = parts[0];
      if (folder === "examples") category = "Examples";
      else if (folder === "_releases") category = "Releases";
      else if (folder === "_color-schemes") category = "Color Schemes";
      else
        category = folder
          .replace(/^_+/, "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, c => c.toUpperCase());
    }

    articles.push({
      title,
      route,
      desc,
      category,
      file: `posts/${rel}`,
    });
  }

  articles.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.title.localeCompare(b.title);
  });

  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, JSON.stringify(articles, null, 2), "utf8");
}

const articleManifestIntegration = (): AstroIntegration => ({
  name: "article-manifest-generator",
  hooks: {
    "astro:config:setup": () => {
      generateArticlesManifest();
    },
    "astro:server:setup": () => {
      generateArticlesManifest();
    },
    "astro:build:start": () => {
      generateArticlesManifest();
    },
  },
});

function rehypeLinkTarget() {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (node.tagName === "a" && node.properties && node.properties.href) {
        let href = String(node.properties.href);
        const hasBlankHash =
          href.endsWith("#_blank") ||
          href.includes("#_blank?") ||
          href.includes("#_blank#");
        const hasBlankQuery =
          href.includes("target=_blank") || href.includes("_blank=1");
        const isExternal = /^(https?:)?\/\//i.test(href);
        const hasExplicitSelf =
          href.endsWith("#_self") || href.includes("target=_self");

        if ((hasBlankHash || hasBlankQuery || isExternal) && !hasExplicitSelf) {
          node.properties.target = "_blank";
          node.properties.rel = "noopener noreferrer";
          node.properties.href = href
            .replace(/#_blank$/, "")
            .replace(/#_blank\?/, "?")
            .replace(/#_blank#/, "#")
            .replace(/([?&])target=_blank&?/, "$1")
            .replace(/[?&]$/, "");
        } else if (hasExplicitSelf) {
          node.properties.target = "_self";
          node.properties.href = href
            .replace(/#_self$/, "")
            .replace(/([?&])target=_self&?/, "$1")
            .replace(/[?&]$/, "");
        }
      }
    });
  };
}

export default defineConfig({
  site: config.site.url,
  integrations: [
    articleManifestIntegration(),
    mdx(),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeLinkTarget as any],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
