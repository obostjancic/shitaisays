// Storage client. Talks to the Cloudflare Pages Functions API on the same
// origin (/api/...). The data lives in Workers KV, server-side — no keys or
// secrets are ever exposed to the browser.

const store = {
  async list() {
    const res = await fetch("/api/snippets");
    if (!res.ok) throw new Error("failed to load");
    return res.json();
  },

  async add(body) {
    const res = await fetch("/api/snippets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "failed to add");
    return data;
  },

  async vote(id) {
    const res = await fetch(`/api/snippets/${id}/vote`, { method: "POST" });
    if (!res.ok) throw new Error("failed to vote");
    return res.json();
  },

  async remove(id) {
    const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("failed to delete");
  },
};
