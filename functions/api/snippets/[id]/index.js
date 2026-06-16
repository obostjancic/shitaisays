import { read, write, json } from "../../../_kv.js";

// DELETE /api/snippets/:id
export async function onRequestDelete({ params, env }) {
  const items = await read(env);
  const next = items.filter((x) => x.id !== params.id);
  if (next.length === items.length) return json({ error: "not found" }, 404);
  await write(env, next);
  return json({ ok: true });
}
