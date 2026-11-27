// Connects the app to Supabase (sign-in, saved progress, uploads) and to /api/coach (AI coach).
// It provides the same small interface the app already uses: window.claude.use("db" | "user" | "assets" | "sample").
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = "media";
const supabase = url && key ? createClient(url, key) : null;

const blobUrls = {};
window.blobSrc = (path) => blobUrls[path] || "";

let session = null;
let readyResolve;
const ready = new Promise((r) => (readyResolve = r));

/* ---------- sign-in screen ---------- */
function gate(msg) {
  let el = document.getElementById("authGate");
  if (!el) {
    el = document.createElement("div");
    el.id = "authGate";
    el.innerHTML = `
      <div class="panel" style="max-width:420px;margin:auto;border-radius:22px;height:auto">
        <h1 style="margin:0 0 4px">Reading Path</h1>
        <p class="muted" style="margin:0 0 16px">One calm class a day. Sign in to keep your progress safe on every device.</p>
        <form id="authForm">
          <label class="f" for="authEmail">Email</label>
          <input type="email" id="authEmail" required autocomplete="email" placeholder="you@example.com" style="width:100%">
          <button class="btn wide" style="margin-top:12px" type="submit">Email me a sign-in link</button>
        </form>
        <p class="muted" id="authMsg" style="margin:12px 0 0" aria-live="polite"></p>
      </div>`;
    Object.assign(el.style, { position: "fixed", inset: "0", zIndex: "50", background: "var(--bg)", display: "flex", padding: "20px" });
    document.body.appendChild(el);
    el.querySelector("#authForm").onsubmit = async (e) => {
      e.preventDefault();
      const email = el.querySelector("#authEmail").value.trim();
      const m = el.querySelector("#authMsg");
      m.textContent = "Sending…";
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
      m.textContent = error ? `That didn't work: ${error.message}` : "Check your email and tap the link. You can close this tab.";
    };
  }
  if (msg) el.querySelector("#authMsg").textContent = msg;
  el.style.display = "flex";
}
function ungate() {
  const el = document.getElementById("authGate");
  if (el) el.style.display = "none";
}
function signOutLink() {
  if (document.getElementById("signOut")) return;
  const p = document.createElement("p");
  p.style.cssText = "text-align:center;margin:0 0 40px";
  p.innerHTML = `<button id="signOut" class="linkbtn">Sign out (${session.user.email})</button>`;
  document.body.appendChild(p);
  p.querySelector("button").onclick = async () => { await supabase.auth.signOut(); localStorage.removeItem("reading-path"); location.reload(); };
}

async function loadSignedUrls(uid) {
  const { data } = await supabase.storage.from(BUCKET).list(uid, { limit: 1000 });
  if (!data || !data.length) return;
  const paths = data.map((f) => `${uid}/${f.name}`);
  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 24 * 7);
  (signed || []).forEach((s) => { if (s.signedUrl) blobUrls[s.path] = s.signedUrl; });
  if (typeof window.render === "function") window.render();
}

async function onSession(s) {
  session = s;
  if (!s) return gate();
  ungate();
  signOutLink();
  readyResolve();
  loadSignedUrls(s.user.id).catch(() => {});
}

if (!supabase) {
  console.warn("Supabase isn't configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Running in device-only mode.");
} else {
  supabase.auth.getSession().then(({ data }) => onSession(data.session));
  supabase.auth.onAuthStateChange((_e, s) => { if (s && !session) onSession(s); });
}

/* ---------- the interface the app uses ---------- */
const db = {
  doc() {
    return {
      async get() {
        const { data, error } = await supabase.from("family_state").select("state").eq("user_id", session.user.id).maybeSingle();
        if (error) throw error;
        return { exists: !!data, data: () => (data ? { state: JSON.stringify(data.state) } : undefined) };
      },
      async set(doc) {
        const state = typeof doc.state === "string" ? JSON.parse(doc.state) : doc.state;
        const { error } = await supabase.from("family_state").upsert({ user_id: session.user.id, state, updated_at: new Date().toISOString() });
        if (error) throw error;
      },
    };
  },
};
const user = { id: async () => session.user.id, email: async () => session.user.email };
const assets = {
  async upload(file) {
    if (file.size > 50 * 1024 * 1024) { const e = new Error("too big"); e.code = "too_large"; throw e; }
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${session.user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
    if (data) blobUrls[path] = data.signedUrl;
    return { id: path };
  },
};
async function sample(input, opts = {}) {
  const res = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) {
    const e = new Error("coach error");
    e.code = res.status === 429 ? "rate_limited" : "unavailable";
    throw e;
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let text = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    text += dec.decode(value, { stream: true });
    if (opts.onText) opts.onText({ text });
  }
  return { text };
}

window.claude = {
  async use(name) {
    if (!supabase) return null;
    await ready;
    return { db, user, assets, sample }[name] || null;
  },
};
