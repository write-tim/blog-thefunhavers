---
title: "The Hybrid Engine: Implementing Sveltia CMS for a Docs-as-Code 'Meta' Site"
subtitle: "How to get the ergonomics of a visual CMS without sacrificing Git purity, zero-cost static hosting, or Markdown autonomy."
description: "A comprehensive guide to pairing Astro with Sveltia CMS for a modern Docs-as-Code meta site, including architecture, schema contracts, and real-world gotchas like GitHub's GraphQL payload limits."
date: 2026-09-25
category: tech
author: Timothy Johnson
tags:
  - docs-as-code
  - sveltia-cms
  - astro
  - web-dev
  - architecture
draft: false
---

There is a quiet philosophical war in modern web publishing. 

On one side stand the **Docs-as-Code purists**: developers who believe everything belongs in Git. Your posts are Markdown files, your taxonomy is YAML frontmatter, your peer review is a GitHub Pull Request, and your deploy pipeline is a GitHub Action. It is robust, completely free of vendor lock-in, and costs exactly \$0 on static hosts.

On the other side stand **content creators and mobile writers**: people who just want to write a thought on an iPad, upload a photo from their phone, or fix a typo without pulling a branch, installing npm packages, running a local dev server, and pushing commits.

For years, the middle ground was Netlify CMS (later Decap CMS). But Decap aged into a heavy, brittle React artifact with slow startup times and lagging maintenance.

Enter **Sveltia CMS**—a lightweight, Svelte-powered, client-side CMS that bridges this divide. Here is how I architected a Docs-as-Code "meta" site powered by Astro and Sveltia CMS, along with the hard-won lessons from the trenches.

---

## 1. What is a "Meta" Site?

A **meta site** is a digital garden that doubles as its own living documentation. It doesn't just present content; it documents the architecture, workflows, and tools that keep it running.

In a Docs-as-Code meta site:
- **Code and Content Share the Same Tree**: Posts, travel stories, project portfolios, and site navigation config live alongside Astro templates and CSS.
- **Git is the Database**: There is no PostgreSQL, DynamoDB, or headless CMS database. A commit *is* an update; `git revert` *is* your rollback.
- **Every Change is Audited**: Whether saved from VS Code or a mobile browser via Sveltia CMS, each save generates a real Git commit attributed to an author.

```
├── .github/workflows/deploy.yml   # CI/CD: Automated builds on push
├── public/
│   └── admin/
│       ├── config.yml             # Schema contract for Sveltia CMS
│       └── index.html             # Client-side CMS Single-Page App
├── src/
│   ├── content.config.ts          # Astro Content Collections (Zod schemas)
│   └── content/
│       ├── blog/                  # Markdown posts
│       ├── trips/                 # Travel stories + photo galleries
│       └── pages/                 # Header, footer, and page copy
```

---

## 2. Why Sveltia CMS?

Unlike traditional headless CMS platforms (Contentful, Sanity, Strapi), Sveltia CMS requires **no backend server**. It is a single static HTML file (`/admin/index.html`) pulling a small JavaScript bundle from a CDN.

When you visit `/admin`:
1. It reads your site's `config.yml` to understand the collections and schema.
2. It authenticates with GitHub via a tiny OAuth gatekeeper.
3. It queries GitHub's REST and GraphQL APIs directly from your browser.
4. When you hit **Save**, it constructs a Git commit and pushes it straight to your `main` branch.

Your static site generator (in our case, Astro) detects the push, rebuilds the site via GitHub Pages Actions, and deploys it in under a minute.

---

## 3. The Two-Way Schema Contract

The secret to a rock-solid Docs-as-Code setup is keeping your CMS schema in sync with your site builder's validation schema.

### In Astro (`src/content.config.ts`)
Astro uses Zod to enforce type safety at build time:

```typescript
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    category: z.string().default('tech'),
    draft: z.boolean().default(false),
  }),
});
```

### In Sveltia CMS (`public/admin/config.yml`)
The CMS configuration maps 1:1 to Astro's Zod schema:

```yaml
backend:
  name: github
  repo: write-tim/timothyjohnsonwrites
  branch: main
  base_url: https://sveltia-gatekeeper.onrender.com
  auth_endpoint: auth

media_folder: "public/assets"
public_folder: "/assets"

collections:
  - name: "blog"
    label: "Blog"
    folder: "src/content/blog"
    create: true
    slug: "{{slug}}"
    format: "yaml-frontmatter"
    extension: "md"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Description", name: "description", widget: "string", required: false }
      - { label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD" }
      - { label: "Draft / Hide Post", name: "draft", widget: "boolean", default: false, required: false }
      - { label: "Body", name: "body", widget: "markdown" }
```

When you update either side, you ensure your visual editor and your static build pipeline speak the exact same language.

---

## 4. Battles Won: Real-World Gotchas

Setting up this workflow revealed three subtle, critical technical pitfalls that every Docs-as-Code architect should know:

### 1. The Strict YAML Trap
Sveltia uses a modern, strict YAML parser. Unlike forgiving human eyes, strict parsers differentiate between *flow mapping* (`{ a: 1, b: 2 }`) and *block mapping*:

```yaml
# ❌ INVALID: Causes "Unexpected scalar at node end" & CMS load failure!
hint: "Where to automatically nest this page in the site menu.",

# ✅ VALID: Block-style lines must never have trailing commas
hint: "Where to automatically nest this page in the site menu."
```
A single stray trailing comma on a block scalar will crash Sveltia's configuration loader on startup. Validate your `config.yml` with a linter before pushing!

### 2. The 4 MB GitHub GraphQL Payload Ceiling
This is the single biggest trap for media-heavy content like travel galleries.

When you click **Save** in Sveltia CMS, it commits your markdown text and any newly uploaded binary images using GitHub's GraphQL `createCommitOnBranch` mutation.
- Photos are base64-encoded, which inflates file size by **33%**.
- GitHub's GraphQL API enforces a strict request payload limit of **~4 MB**.
- If you upload a raw 8 MB smartphone photo, the payload exceeds the limit. GitHub terminates the connection immediately without CORS headers, causing the browser to throw an opaque:
  ```
  TypeError: Failed to fetch
  Access to fetch has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
  ```
**The Solution**: Optimize photos before uploading. Web images should rarely exceed 1920px wide or 500 KB to 1 MB in size. A quick resize in macOS Preview or TinyPNG keeps uploads well within GitHub's GraphQL ceiling.

### 3. Repository Renames & IndexedDB Stale State
When renaming your GitHub repository (e.g. from `blog-thefunhavers` to `timothyjohnsonwrites`), updating `config.yml` is only half the battle.

Sveltia CMS caches repository metadata and tokens in browser `IndexedDB` and `localStorage`. If an open browser tab tries to save an entry after the remote repo was renamed, it sends API calls targeting the old repository slug, resulting in:
```
Could not resolve to a Repository with the name 'write-tim/blog-thefunhavers'
```
Always do a hard reload (**`Cmd` + `Shift` + `R`**) or log out and back into the CMS after changing remote repository names to flush the browser's client cache.

---

## 5. The Verdict: The Ultimate Indie Web Stack

Implementing Sveltia CMS on top of Astro delivers the holy grail of modern personal publishing:

1. **Zero Recurring Server Costs**: Hosted 100% on GitHub Pages with free CI/CD.
2. **True Git Freedom**: You can write in Neovim, VS Code, or Sveltia CMS on an iPhone in an airport terminal.
3. **Complete Content Portability**: Your posts are plain Markdown files on your hard drive. If Sveltia disappears tomorrow, your site continues building without changing a single line of code.

Docs-as-Code isn't just for software manuals. For indie bloggers, technical writers, and digital gardeners, it is the most resilient, future-proof publishing system available today.
