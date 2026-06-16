import { read, write, json } from "../../../_kv.js";

// POST /api/snippets/:id/vote
export async function onRequestPost({ params, env }) {
  const items = await read(env);
  const s = items.find((x) => x.id === params.id);
  if (!s) return json({ error: "not found" }, 404);
  s.votes += 1;
  await write(env, items);
  return json(s);
}
