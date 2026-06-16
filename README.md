# shitaisays

A terminal-styled wall of funny AI-generated text snippets. Paste what the model
said, tag the model, and upvote the most unhinged outputs.

## Stack

- [Alpine.js](https://alpinejs.dev/) (CDN) for the UI — no build step
- **Cloudflare Pages** for static hosting
- **Pages Functions** (`functions/api/...`) for the API
- **Workers KV** for shared storage — secrets stay server-side, nothing
  sensitive is exposed to the browser

```
public/                 static site (served by Pages)
functions/api/snippets/ API: list / add / vote / delete  (Pages Functions)
wrangler.toml           project + KV binding config
```

## Setup

1. Create a KV namespace and copy the ids into `wrangler.toml`:
   ```bash
   npx wrangler kv namespace create SNIPPETS
   npx wrangler kv namespace create SNIPPETS --preview
   ```
2. Seed it with an empty list (optional — the API treats missing as `[]`):
   ```bash
   npx wrangler kv key put --binding SNIPPETS snippets '[]'
   ```

## Run locally

```bash
npx wrangler pages dev   # serves public/ + functions/, with KV
```

## Deploy

Either connect the GitHub repo in the **Cloudflare dashboard → Pages**
(build output dir `public/`, bind the `SNIPPETS` KV namespace), or:

```bash
npx wrangler pages deploy
```
