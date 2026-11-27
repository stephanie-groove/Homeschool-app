// Reminder cards for For Mom: each reminder is real text set on a small hand-painted scene
// (soft sky, layered clouds, rolling hills) with gentle motion. Tap a card to open it full screen.

export const SCENES = {
  dawn:   { label: "Dawn",          sky: ["#F4C9A8", "#FBEBD3"], glow: "#FFF1C9", sun: [300, 300, 46], hills: ["#D2C79A", "#B4B884", "#93A56F"], cloud: "#FFF7EC", shade: "#F1D6C2", fx: "motes",  ink: "dark" },
  meadow: { label: "Sunny meadow",  sky: ["#86BEDF", "#E2F1EE"], glow: "#FFF8DA", sun: [320, 90, 34],  hills: ["#B5D39A", "#93BE78", "#6F9F5B"], cloud: "#FFFFFF", shade: "#DCE8F0", fx: "seeds",  ink: "dark" },
  rain:   { label: "Rainy window",  sky: ["#9FB0BE", "#DCE2E3"], glow: "#EEF2F2", sun: null,           hills: ["#A3B39C", "#86A081", "#6B8869"], cloud: "#EEF1F3", shade: "#C2CCD3", fx: "rain",   ink: "dark" },
  dusk:   { label: "Dusk",          sky: ["#A796C2", "#F4C5A2"], glow: "#FFE2C2", sun: [110, 330, 52], hills: ["#9C8FA9", "#7E7896", "#615E7D"], cloud: "#FBE3D6", shade: "#D9B9C4", fx: "flies",  ink: "light" },
  night:  { label: "Starry night",  sky: ["#18243F", "#3A4C70"], glow: "#F3EBC8", sun: [338, 58, 20],  hills: ["#2B3D5E", "#22324F", "#18243C"], cloud: "#53658A", shade: "#3F5176", fx: "stars",  ink: "light" },
  spring: { label: "Spring petals", sky: ["#BCDDE7", "#F4F1DA"], glow: "#FFF6DA", sun: [90, 110, 30],  hills: ["#C3DBA6", "#A2C88A", "#82B26E"], cloud: "#FFFFFF", shade: "#E4EBEA", fx: "petals", ink: "dark" },
};
export const THEME_SCENE = { faith: "dawn", joy: "meadow", enough: "rain", patience: "dusk", growth: "spring", rest: "night", mine: "spring" };

// Small seeded random so every card's particles stay put between renders.
const rnd = (seed) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

function particles(fx, seed) {
  const r = rnd(seed), out = [];
  const n = { motes: 12, seeds: 9, rain: 26, flies: 10, stars: 26, petals: 12 }[fx] || 0;
  for (let i = 0; i < n; i++) {
    const x = Math.round(r() * 400), y = Math.round(r() * 300), d = (r() * 8).toFixed(2), s = (0.7 + r() * 0.8).toFixed(2);
    const st = `style="--d:-${d}s;--s:${s}"`;
    if (fx === "stars") out.push(`<circle class="p-star" ${st} cx="${x}" cy="${Math.round(y * 0.75)}" r="${(0.8 + r() * 1.6).toFixed(1)}" fill="#FFF7D6"/>`);
    else if (fx === "rain") out.push(`<path class="p-rain" ${st} d="M${x} ${y - 60} l-6 18" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="1.4" stroke-linecap="round"/>`);
    else if (fx === "flies") out.push(`<circle class="p-fly" ${st} cx="${x}" cy="${300 + Math.round(r() * 160)}" r="2.4" fill="#FFE9A6"/>`);
    else if (fx === "motes") out.push(`<circle class="p-mote" ${st} cx="${x}" cy="${200 + Math.round(r() * 260)}" r="${(1 + r() * 1.8).toFixed(1)}" fill="#FFF3C4"/>`);
    else if (fx === "petals") out.push(`<path class="p-petal" ${st} transform="translate(${x} ${Math.round(y * 0.3)})" d="M0 0c4-5 10-4 10 1s-6 6-10-1z" fill="#F3BFCB"/>`);
    else if (fx === "seeds") out.push(`<g class="p-seed" ${st} transform="translate(${x} ${300 + Math.round(r() * 150)})"><path d="M0 0v-9" stroke="#FFFFFF" stroke-width="1"/><circle cy="-11" r="4" fill="none" stroke="#FFFFFF" stroke-width=".9" stroke-dasharray="1.2 1.4"/></g>`);
  }
  return out.join("");
}

// A Ghibli-like layered cloud: soft bumps with a flat, shaded underside.
const cloud = (x, y, k, c, shade, cls) =>
  `<g class="${cls}" transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="12" rx="78" ry="16" fill="${shade}"/><circle cx="-40" cy="0" r="24" fill="${c}"/><circle cx="-8" cy="-14" r="34" fill="${c}"/><circle cx="30" cy="-4" r="26" fill="${c}"/><circle cx="56" cy="6" r="16" fill="${c}"/><rect x="-66" y="2" width="134" height="14" rx="7" fill="${c}"/></g>`;

export function sceneSvg(key, seed = 7) {
  const s = SCENES[key] || SCENES.meadow, id = `rs-${key}`;
  const [h1, h2, h3] = s.hills;
  const sun = s.sun ? `<circle cx="${s.sun[0]}" cy="${s.sun[1]}" r="${s.sun[2] * 3}" fill="url(#${id}-g)"/><circle cx="${s.sun[0]}" cy="${s.sun[1]}" r="${s.sun[2]}" fill="${s.glow}"/>` : "";
  const tree = key === "rain" || key === "night" ? "" : `<g class="r-tree" transform="translate(318 392)"><path d="M-4 0c-1-18 0-30-3-44h14c-3 14-2 26-3 44z" fill="#6C5039"/><circle cx="-14" cy="-52" r="22" fill="${h3}"/><circle cx="10" cy="-62" r="26" fill="${h2}"/><circle cx="20" cy="-44" r="18" fill="${h3}"/></g>`;
  return `<svg class="rscene" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="${id}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.sky[0]}"/><stop offset="1" stop-color="${s.sky[1]}"/></linearGradient>
    <radialGradient id="${id}-g"><stop offset="0" stop-color="${s.glow}" stop-opacity=".9"/><stop offset="1" stop-color="${s.glow}" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="500" fill="url(#${id}-s)"/>${sun}
    ${cloud(90, 120, 0.9, s.cloud, s.shade, "r-cloud a")}${cloud(300, 190, 0.6, s.cloud, s.shade, "r-cloud b")}
    <path d="M0 360 Q100 320 210 352 T400 338 V500 H0z" fill="${h1}"/>
    <path d="M0 410 Q140 370 260 404 T400 396 V500 H0z" fill="${h2}"/>${tree}
    <path d="M0 452 Q160 420 300 450 T400 446 V500 H0z" fill="${h3}"/>
    <g class="fx">${particles(s.fx, seed)}</g></svg>`;
}

const hash = (t) => { let h = 7; for (const c of t) h = (h * 31 + c.charCodeAt(0)) % 9973; return h; };

export function cardHtml(text, sceneKey, tag, attrs = "") {
  const s = SCENES[sceneKey] || SCENES.meadow;
  return `<div class="rcard ink-${s.ink}" ${attrs}>${sceneSvg(sceneKey, hash(text))}<span class="rtext">${text}</span>${tag ? `<span class="rtag">${tag}</span>` : ""}</div>`;
}

/* only animate cards that are on screen */
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("live", e.isIntersecting)), { rootMargin: "80px" })
  : null;
export function liveCards(root) {
  root.querySelectorAll(".rcard").forEach((c) => (io ? io.observe(c) : c.classList.add("live")));
}

/* ---------- full-screen viewer ---------- */
// items: [{text, scene, tag}] · hooks: {isFav(i), toggleFav(i), say(text)}
export function openViewer(items, start, hooks) {
  let i = start;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const el = document.createElement("div");
  el.className = "rview";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-label", "Reminder");
  el.tabIndex = -1;
  const draw = (dir = 0) => {
    const it = items[i], fav = hooks.isFav(i);
    el.innerHTML = `<div class="rv-stage${dir ? (dir > 0 ? " from-r" : " from-l") : ""}">${cardHtml(esc(it.text), it.scene, esc(it.tag), 'aria-live="polite"')}</div>
      <button class="x glass rv-close" aria-label="Close">×</button>
      <div class="rv-bar">
        <button class="rv-b" data-a="prev" aria-label="Previous reminder"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
        <button class="rv-b" data-a="say" aria-label="Read aloud"><svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9c1.5 1.8 1.5 4.2 0 6M19 6c3 3.5 3 8.5 0 12"/></svg></button>
        <button class="rv-b" data-a="fav" aria-pressed="${fav}" aria-label="${fav ? "Saved to favorites" : "Save to favorites"}"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/></svg></button>
        <button class="rv-b" data-a="next" aria-label="Next reminder"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
      </div><p class="rv-count">${i + 1} of ${items.length}</p>`;
    el.querySelector(".rcard").classList.add("live", "big");
  };
  const go = (d) => { i = (i + d + items.length) % items.length; draw(d); };
  const close = () => { el.remove(); document.body.classList.remove("locked"); };
  el.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.classList.contains("rv-close")) return close();
    const a = b.dataset.a;
    if (a === "prev") go(-1); else if (a === "next") go(1);
    else if (a === "say") hooks.say(items[i].text);
    else if (a === "fav") { hooks.toggleFav(i); draw(); }
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close(); else if (e.key === "ArrowRight") go(1); else if (e.key === "ArrowLeft") go(-1);
  });
  let x0 = null;
  el.addEventListener("pointerdown", (e) => { if (!e.target.closest("button")) x0 = e.clientX; });
  el.addEventListener("pointerup", (e) => { if (x0 != null && Math.abs(e.clientX - x0) > 50) go(e.clientX < x0 ? 1 : -1); x0 = null; });
  draw();
  document.body.appendChild(el);
  document.body.classList.add("locked");
  el.focus();
}
