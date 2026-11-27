// The landing page's hillside, reused across the app: sky, sun, drifting clouds,
// rolling hills, the oak with mom and child reading, swaying grass, and the butterfly.
import art from "./scene-art.txt?raw";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Sky banner art. "xMaxYMax slice" keeps the tree and readers in view on narrow screens.
export const sceneSvg = (fit = "xMaxYMax slice") =>
  `<svg class="scene" viewBox="0 0 1440 900" preserveAspectRatio="${fit}" aria-hidden="true">${art}</svg>`;

/* ---------- content rises in as it scrolls into view ---------- */
const io = "IntersectionObserver" in window
  ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 })
  : null;

// animate: true when a new screen opens; false for a re-render of the same screen (no replay).
export function reveal(root, animate) {
  const items = [...root.children].filter((el) => !el.matches("nav.bnav, .skyhead"));
  items.forEach((el, i) => {
    el.classList.add("rv");
    el.style.setProperty("--i", Math.min(i, 6));
    if (!animate || reduce || !io) el.classList.add("in");
    else io.observe(el);
  });
}

/* ---------- the butterfly ---------- */
let bf = null, pos = { x: 0.82, y: 0.12 }, from = { ...pos }, to = { ...pos }, t0 = 0, px = 0;
const DUR = 1800;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function startButterfly() {
  if (reduce || bf) return;
  bf = document.createElement("div");
  bf.id = "bfly";
  bf.setAttribute("aria-hidden", "true");
  bf.innerHTML = `<svg viewBox="0 0 64 64"><g class="w wl"><path d="M32 30 C18 6 2 16 14 30 C2 40 18 52 32 36z" fill="#EDB89E"/></g><g class="w wr"><path d="M32 30 C46 6 62 16 50 30 C62 40 46 52 32 36z" fill="#F0D58C"/></g><rect x="30" y="22" width="4" height="22" rx="2" fill="#3B352E"/><path d="M31 22 l-5 -8 M33 22 l5 -8" stroke="#3B352E" stroke-width="1.5" stroke-linecap="round"/></svg>`;
  document.body.appendChild(bf);
  let cur = { ...pos }, last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const p = Math.min(1, (now - t0) / DUR), e = ease(p);
    // fly along a curve that dips mid-flight, then settle
    const g = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e - Math.sin(p * Math.PI) * 0.12 };
    const k = 1 - Math.exp(-dt * 2.4);
    cur.x += (g.x - cur.x) * k; cur.y += (g.y - cur.y) * k; pos = cur;
    const tt = now / 1000;
    const x = cur.x * innerWidth + Math.sin(tt * 1.3) * 14, y = cur.y * innerHeight + Math.sin(tt * 2.1) * 10;
    const vx = x - px; px = x;
    bf.style.transform = `translate(${x - 32}px,${y - 32}px) rotate(${Math.max(-25, Math.min(25, vx * 1.5))}deg)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

// Send the butterfly to a spot, as fractions of the screen.
export function flyTo(x, y) {
  if (Math.abs(to.x - x) < 0.01 && Math.abs(to.y - y) < 0.01) return;
  from = { ...pos }; to = { x, y }; t0 = performance.now();
}

// Each class step has its own resting spot on the banner's hills, away from the text.
const SPOTS = [[0.12, 0.17], [0.55, 0.18], [0.3, 0.19], [0.16, 0.16], [0.6, 0.17], [0.38, 0.18]];
export const spotFor = (i) => SPOTS[((i % SPOTS.length) + SPOTS.length) % SPOTS.length];
