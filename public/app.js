function snippets() {
  return {
    items: [],
    draft: { text: "", model: "" },
    query: "",
    loading: false,
    error: "",
    comboOpen: false,
    models: [
      "claude-sonnet-4-5",
      "claude-sonnet-4-6",
      "claude-opus-4-6",
      "claude-opus-4-7",
      "claude-opus-4-8",
      "gpt-5.4",
      "gpt-5.5",
    ],

    get modelMatches() {
      const q = this.draft.model.trim().toLowerCase();
      if (!q) return this.models;
      return this.models.filter((m) => m.toLowerCase().includes(q));
    },

    get filtered() {
      const q = this.query.trim().toLowerCase();
      if (!q) return this.items;
      return this.items.filter(
        (s) =>
          s.text.toLowerCase().includes(q) ||
          ("@" + s.model).toLowerCase().includes(q)
      );
    },

    // Normalize messy pasted text: collapse runaway whitespace, trim lines.
    cleanText(raw) {
      return raw
        .replace(/\r\n?/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/ *\n */g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    },

    onPaste(e) {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData("text");
      const cleaned = this.cleanText(pasted);
      const el = e.target;
      const start = el.selectionStart ?? this.draft.text.length;
      const end = el.selectionEnd ?? this.draft.text.length;
      this.draft.text =
        this.draft.text.slice(0, start) + cleaned + this.draft.text.slice(end);
    },

    async load() {
      this.loading = true;
      try {
        this.items = await store.list();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async add() {
      const text = this.cleanText(this.draft.text);
      if (!text) return;
      if (text.length > 1000) {
        this.error = "text too long (max 1000)";
        return;
      }
      this.loading = true;
      this.error = "";
      try {
        const snippet = await store.add({ text, model: this.draft.model.trim() });
        this.items.unshift(snippet);
        this.draft.text = "";
        this.draft.model = "";
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async remove(s) {
      if (!confirm("rm this snippet? this cannot be undone.")) return;
      const idx = this.items.findIndex((x) => x.id === s.id);
      const [removed] = this.items.splice(idx, 1);
      try {
        await store.remove(s.id);
      } catch {
        this.items.splice(idx, 0, removed);
        this.error = "failed to delete";
      }
    },

    async vote(s) {
      s.votes += 1; // optimistic
      try {
        const updated = await store.vote(s.id);
        if (updated) s.votes = updated.votes;
      } catch {
        s.votes -= 1;
      }
    },

    ago(ts) {
      const diff = Math.floor((Date.now() - ts) / 1000);
      if (diff < 60) return diff + "s ago";
      if (diff < 3600) return Math.floor(diff / 60) + "m ago";
      if (diff < 86400) return Math.floor(diff / 3600) + "h ago";
      return Math.floor(diff / 86400) + "d ago";
    },
  };
}
