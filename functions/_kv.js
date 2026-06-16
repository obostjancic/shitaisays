// Shared KV helpers. Files prefixed with "_" are not routed by Pages.
// The whole snippet list is stored as one JSON array under a single key.

const KEY = "snippets";

export async function read(env) {
  const raw = await env.SNIPPETS.get(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function write(env, items) {
  await env.SNIPPETS.put(KEY, JSON.stringify(items));
}

export function json(data, status = 200) {
  return Response.json(data, { status });
}
