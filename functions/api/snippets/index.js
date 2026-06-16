import { read, write, json } from "../../_kv.js";

// GET /api/snippets — list, newest first
export async function onRequestGet({ env }) {
  const items = await read(env);
  items.sort((a, b) => b.createdAt - a.createdAt);
  return json(items);
}

// POST /api/snippets — add a snippet
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid JSON" }, 400);
  }

  const text = (body.text ?? "").toString().trim();
  const model = (body.model ?? "").toString().trim().slice(0, 60);

  if (!text) return json({ error: "text is required" }, 400);
  if (text.length > 1000) return json({ error: "text too long (max 1000)" }, 400);

  const snippet = {
    id: crypto.randomUUID(),
    text,
    model: model || "unknown-model",
    votes: 0,
    createdAt: Date.now(),
  };

  const items = await read(env);
  items.push(snippet);
  await write(env, items);
  return json(snippet, 201);
}
