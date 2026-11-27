import { createClient } from "@supabase/supabase-js";

const SYSTEM = `You are the parent coach and story writer inside Reading Path, a gentle homeschool app for parents of young children.
Be warm, practical and brief. Never diagnose. If something suggests a developmental, medical or mental-health concern, kindly suggest talking with a pediatrician or qualified professional.
If a parent mentions harming themselves or a child, or not feeling safe, respond with care and urge them to contact local emergency services or a crisis line right away.
Stories you write must be gentle and suitable for young children.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Sign in first" });

  const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });
  const { data: auth, error: authErr } = await sb.auth.getUser(token);
  if (authErr || !auth?.user) return res.status(401).json({ error: "Sign in first" });

  const limit = Number(process.env.COACH_DAILY_LIMIT || 60);
  const since = new Date(Date.now() - 864e5).toISOString();
  const { count } = await sb.from("coach_usage").select("id", { count: "exact", head: true }).gte("created_at", since);
  if ((count || 0) >= limit) return res.status(429).json({ code: "rate_limited" });
  await sb.from("coach_usage").insert({ user_id: auth.user.id });

  const input = req.body?.input;
  let messages = typeof input === "string" ? [{ role: "user", content: input }] : Array.isArray(input) ? input : null;
  if (!messages || !messages.length || messages.length > 30) return res.status(400).json({ error: "Bad input" });
  messages = messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 8000) }));
  if (messages[messages.length - 1].role !== "user") return res.status(400).json({ error: "Last message must be from the parent" });

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-haiku-5-5", max_tokens: 900, system: SYSTEM, messages, stream: true }),
  });
  if (!upstream.ok || !upstream.body) return res.status(502).json({ error: "Coach unavailable" });

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const reader = upstream.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const ev = JSON.parse(line.slice(6));
        if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") res.write(ev.delta.text);
      } catch {}
    }
  }
  res.end();
}
