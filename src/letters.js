// Letters: the meadow path, letter cards, "find the picture", the garden, the parent journal and settings.
// Sound first, shown once. No points, streaks or timers.

export const ORDER = ["s","a","t","p","i","n","m","f","o","c","d","u","b","g","e","k","h","l","r","j","w","y","x","q","v","z"];
export const STEPS = [["s","a","t","p","i"],["n","m","f","o","c"],["d","u","b","g","e"],["k","h","l","r","j"],["w","y","x","q","v","z"]];
const VOWEL = new Set(["a","e","i","o","u"]);
const show = (l) => (l === "q" ? "qu" : l);
const SOUND = { s:"s", a:"a", t:"t", p:"p", i:"i", n:"n", m:"m", f:"f", o:"o", c:"k", d:"d", u:"u", b:"b", g:"g", e:"e", k:"k", h:"h", l:"l", r:"r", j:"j", w:"w", y:"y", x:"ks", q:"kw", v:"v", z:"z" };
// The device voice can't say a pure sound, so stretch the ones that can be stretched and give a cue word for the rest.
const STRETCH = { s:"sssss", m:"mmmmm", f:"fffff", n:"nnnnn", l:"lllll", v:"vvvvv", z:"zzzzz", r:"rrrrr", h:"hhh" };
const CUE = { a:"apple", t:"tap", p:"pan", i:"inchworm", o:"on", c:"cat", d:"duck", u:"up", b:"bed", g:"gate", e:"egg", k:"kite", j:"jam", w:"wet", y:"yes", x:"fox", q:"queen" };
// Original memory tricks that match each picture-letter.
const TRICK = {
  s:"The snake slides in an s shape and hisses: sss.", a:"Bite the apple and say a, a, apple.", t:"The tree stands tall with one branch across: t, t, tree.",
  p:"Steam puffs out of the pan: p, p, p.", i:"The inchworm stretches up and its head is the dot: i, i, inchworm.", n:"Throw the net over the hump: n, n, net.",
  m:"Two mountains side by side, hum while you climb them: mmm.", f:"The flag flaps in the wind: f, f, flag.", o:"An orange is round like o. Open your mouth round: o.",
  c:"The caterpillar curls up into a c: c, c, caterpillar.", d:"The duck has a round body and a tall neck: d, d, duck.", u:"Point up and say u, u, up.",
  b:"The bunny's tall ears come first, then its round tummy: b, b, bunny.", g:"Grapes hang from the bottom of the g: g, g, grapes.", e:"Crack the egg and the yolk sits inside the e: e, e, egg.",
  k:"The kite flies off the side of the k: k, k, kite.", h:"The house has a tall chimney and a door: h, h, house.", l:"A ladder is one tall line you climb: l, l, ladder.",
  r:"The rain cloud sits on the r and drips: r, r, rain.", j:"The jellyfish dips its tail down low: j, j, jellyfish.", w:"Waves go down and up, down and up: w, w, waves.",
  y:"The yo-yo hangs from the tail of the y: y, y, yo-yo.", x:"The fox ends with x. Cross your arms like an x and say ks.", q:"q and u are best friends: qu, qu, queen.",
  v:"The vine grows up both sides of the v: v, v, vine.", z:"Zig, zag, zap! z makes a buzzing zzz."
};
// Picture words for "find the picture" (photos where we have them). x is found at the end of the word.
const PICS = {
  s:["sun","sock"], a:["ant"], t:["top","tree"], p:["pin","pig","pot"], i:[], n:["net","nut","nap"], m:["map","milk","mat"], f:["fox","fan","fish"],
  o:[], c:["cat","cup","cap","crab"], d:["dog","duck","drum"], u:[], b:["bed","bug","box","bee","bell","banana","bat"], g:[], e:["egg"], k:[],
  h:["hen","hat"], l:["log"], r:["rabbit","rat"], j:["jam"], w:["web"], y:[], x:["fox","box"], q:[], v:["van"], z:[]
};

let C = null; // app context: state, save, render, say, esc, $, alphaSvg, ALPHA, photoOf, skyHead, svg
export function init(ctx) {
  C = ctx;
  const s = C.state;
  s.letters = s.letters || {};
  for (const k of ["phonics", "spelling"]) s.letters[k] = { learned: {}, step: 0, ...(s.letters[k] || {}) };
  s.journal = s.journal || {};
  s.ages = s.ages || { phonics: 4, spelling: 7 };
}

const L = () => C.state.letters[C.state.tab];
export const isLearned = (l) => !!L().learned[l];
export const todayLetter = () => ORDER.slice(STEPS.slice(0, L().step).flat().length).find((l) => !isLearned(l)) || ORDER.find((l) => !isLearned(l)) || null;
const stepOf = (l) => STEPS.findIndex((st) => st.includes(l));
const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);
const tone = (l) => (VOWEL.has(l) ? "vowel" : "cons");

/* ---------- media on this device (voice recordings, walk photos) ---------- */
const DB = () => new Promise((res, rej) => { const r = indexedDB.open("reading-path-media", 1); r.onupgradeneeded = () => r.result.createObjectStore("m"); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const mediaGet = async (k) => { try { const db = await DB(); return await new Promise((res) => { const q = db.transaction("m").objectStore("m").get(k); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); }); } catch { return null; } };
const mediaSet = async (k, v) => { const db = await DB(); return new Promise((res, rej) => { const t = db.transaction("m", "readwrite"); v == null ? t.objectStore("m").delete(k) : t.objectStore("m").put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); }); };
const mediaClear = async () => { try { const db = await DB(); await new Promise((res) => { const t = db.transaction("m", "readwrite"); t.objectStore("m").clear(); t.oncomplete = res; t.onerror = res; }); } catch {} };

export async function hearSound(l) {
  const rec = await mediaGet("voice-" + l);
  if (rec) { const a = new Audio(URL.createObjectURL(rec)); a.play().catch(() => {}); return; }
  C.say(STRETCH[l] || `${show(l)}, as in ${CUE[l]}`, 0.7);
}

/* ---------- picture helpers ---------- */
// The picture-letter art is defined late in app.js; fall back to the plain letter until it's ready.
const pictureLetter = (l, size) => { try { return C.alphaSvg(l, size); } catch { return `<span class="lt-plain">${show(l)}</span>`; } };
const wordFor = (l) => { try { return (C.ALPHA[l] || [""])[0]; } catch { return ""; } };
const pic = (w) => C.photoOf(w);

/* ---------- Meadow path ---------- */
export function pathHtml() {
  const s = C.state, t = todayLetter(), n = Object.keys(L().learned).length;
  const kids = `<div class="kids" role="tablist" aria-label="Child">${["phonics","spelling"].map((k) => `<button role="tab" data-ltab="${k}" aria-selected="${s.tab===k}">${C.esc(s.names[k])}</button>`).join("")}</div>`;
  let h = C.skyHead({ kicker: `${n} of 26 letters`, title: "Meadow path", extra: kids });
  h += `<nav class="lchips" aria-label="Letters"><button data-view="garden">${C.svg('<path d="M12 21v-8M12 13c-4 0-6-3-6-6 3 0 6 2 6 6zM12 13c4 0 6-3 6-6-3 0-6 2-6 6z"/>')}Garden</button><button data-view="journal">${C.svg('<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z"/><path d="M5 17a3 3 0 013-3h11"/>')}Journal</button><button data-view="lsettings">${C.svg('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>')}Settings</button></nav>`;
  if (t) h += `<section class="box ltoday"><div class="lt-pic ${tone(t)}">${pictureLetter(t, 74)}</div><div class="lt-txt"><p class="kicker2">Today's letter · Step ${stepOf(t) + 1}</p><h2 class="fr"><span class="al">${show(t)}</span></h2><p class="muted">About 5 minutes. Say the sound, meet the word, find the picture.</p></div><button class="btn" data-letter="${t}">Start</button></section>`;
  else h += `<section class="box ltoday"><div class="lt-txt"><h2 class="fr">Every letter is learned</h2><p class="muted">Lovely work. Visit any stone to review it.</p></div></section>`;
  // stepping stones on a winding path
  const pts = ORDER.map((_, i) => ({ x: 50 + Math.sin(i * 0.85) * 30, y: 46 + i * 74 }));
  const H = pts[pts.length - 1].y + 60;
  let d = `M ${pts[0].x * 3.6} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], my = (a.y + b.y) / 2; d += ` C ${a.x * 3.6} ${my}, ${b.x * 3.6} ${my}, ${b.x * 3.6} ${b.y}`; }
  h += `<section class="meadow" style="height:${H}px" aria-label="Letter path">
    <svg class="mpath" viewBox="0 0 360 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="#E8DCC0" stroke-width="30" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#F3EAD3" stroke-width="20" stroke-linecap="round"/></svg>
    ${STEPS.map((st, k) => { const i = ORDER.indexOf(st[0]); return `<span class="steplab" style="top:${pts[i].y - 36}px;${pts[i].x > 50 ? "left:12px" : "right:12px"}">Step ${k + 1}</span>`; }).join("")}
    ${ORDER.map((l, i) => { const done = isLearned(l), now = l === t;
      return `<button class="stone ${tone(l)}${done ? " done" : ""}${now ? " now" : ""}" style="left:calc(${pts[i].x}% - 30px);top:${pts[i].y - 30}px" data-letter="${l}" aria-label="${show(l)}${done ? ", learned" : now ? ", today's letter" : ""}">
        ${done ? `<svg class="sprout" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22v-8"/><path d="M12 14c-5 0-7-3-7-7 4 0 7 2 7 7z" fill="#8DB78A"/><path d="M12 14c5 0 7-3 7-7-4 0-7 2-7 7z" fill="#5E8F62"/></svg>` : ""}<span>${show(l)}</span></button>`; }).join("")}
  </section>`;
  return h;
}
export function bindPath() {
  document.querySelectorAll("[data-ltab]").forEach((b) => (b.onclick = () => { C.state.tab = b.dataset.ltab; C.save(); C.render(); }));
  document.querySelectorAll("[data-letter]").forEach((b) => (b.onclick = () => openLetter(b.dataset.letter)));
}

/* ---------- Letter card ---------- */
export function openLetter(l) {
  let mode = "sound"; // sound → word → find
  const el = document.createElement("div");
  el.className = "lsheet"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", `Letter ${show(l)}`); el.tabIndex = -1;
  const close = () => { el.remove(); document.body.classList.remove("locked"); C.render(); };
  const next = () => { const i = ORDER.indexOf(l); l = ORDER[(i + 1) % ORDER.length]; mode = "sound"; draw(); };
  const draw = () => {
    const w = wordFor(l), photo = pic(w) || pic((PICS[l] || [])[0]), learned = isLearned(l);
    const shown = photo && pic(w) ? w : photo ? PICS[l][0] : w;
    let body = "";
    if (mode === "find") body = findHtml(l);
    else body = `<div class="flip" id="flip"><div class="lcard ${tone(l)}">
        <div class="lc-face front">${pictureLetter(l, 170)}<p class="lc-sound" aria-label="Sound: ${SOUND[l]}">/${SOUND[l]}/</p>
          ${mode === "word" ? `<div class="lc-word">${photo ? `<img src="${photo}" alt="">` : ""}<b>${C.esc(shown)}</b></div>` : ""}</div>
        <div class="lc-face back"><p class="kicker2">Memory trick</p><p class="lc-trick">${TRICK[l]}</p></div></div></div>`;
    el.innerHTML = `<div class="ls-top"><button class="x" data-a="close" aria-label="Close">×</button><span class="kicker2">Step ${stepOf(l) + 1} · ${VOWEL.has(l) ? "vowel" : "consonant"}</span><button class="lbtn" data-a="hear">${C.svg('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9c1.5 1.8 1.5 4.2 0 6M19 6c3 3.5 3 8.5 0 12"/>')}Hear</button></div>
      <div class="ls-body">${body}</div>
      <div class="ls-actions">${mode === "find" ? `<button class="btn alt" data-a="back">Back to the card</button>` :
        `<button class="btn alt" data-a="flip">Memory trick</button>${mode === "sound" ? `<button class="btn" data-a="word">Meet the word</button>` : `<button class="btn" data-a="find">Find the picture</button>`}`}</div>
      <div class="ls-foot"><button class="btn alt" data-a="learned" aria-pressed="${learned}">${learned ? "Learned" : "Mark as learned"}</button><button class="btn" data-a="next">Next letter</button></div>`;
    if (mode === "find") bindFind(el, l);
  };
  el.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]"); if (!b) return;
    const a = b.dataset.a;
    if (a === "close") close();
    else if (a === "hear") hearSound(l);
    else if (a === "flip") el.querySelector("#flip")?.classList.toggle("flipped");
    else if (a === "word") { mode = "word"; draw(); const w = wordFor(l); C.say(pic(w) || !pic((PICS[l] || [])[0]) ? w : PICS[l][0], 0.8); }
    else if (a === "find") { mode = "find"; draw(); }
    else if (a === "back") { mode = "word"; draw(); }
    else if (a === "learned") { const g = L().learned; if (g[l]) delete g[l]; else g[l] = dayKey(); C.save(); draw(); }
    else if (a === "next") next();
  });
  el.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  draw(); document.body.appendChild(el); document.body.classList.add("locked"); el.focus();
  hearSound(l);
}

/* ---------- Find the picture that starts with the sound ---------- */
function findHtml(l) {
  // Prefer the letter's own picture word (s: snake), then other photo words for the sound.
  const own = wordFor(l);
  const target = pic(own) ? own : (PICS[l] || []).find(pic) || (PICS[l] || [])[0] || own;
  const others = ORDER.filter((x) => x !== l && SOUND[x] !== SOUND[l] && x !== "x").flatMap((x) => [wordFor(x), ...(PICS[x] || [])].filter(pic)).filter((w, i, a) => a.indexOf(w) === i && w !== target && !(l === "x" && /x$/.test(w)));
  const seed = ORDER.indexOf(l) * 7;
  const pick = [others[seed % (others.length || 1)], others[(seed + 5) % (others.length || 1)]].filter(Boolean).filter((w, i, a) => a.indexOf(w) === i);
  const opts = [target, ...pick].sort((a, b) => ((a.charCodeAt(0) * 13 + seed) % 7) - ((b.charCodeAt(0) * 13 + seed) % 7));
  return `<p class="fr find-q">${l === "x" ? `Which one ends with /ks/?` : `Which one starts with /${SOUND[l]}/?`}</p>
    <div class="findgrid">${opts.map((w) => `<button class="fpic" data-w="${C.esc(w)}" data-ok="${w === target}">${pic(w) ? `<img src="${pic(w)}" alt="${C.esc(w)}">` : `<span class="fword">${C.esc(w)}</span>`}<b>${C.esc(w)}</b></button>`).join("")}</div>
    <p class="muted find-msg" id="findMsg" aria-live="polite">Tap a picture. Say each word out loud together.</p>`;
}
function bindFind(el, l) {
  el.querySelectorAll(".fpic").forEach((b) => (b.onclick = () => {
    const w = b.dataset.w, ok = b.dataset.ok === "true", m = el.querySelector("#findMsg");
    C.say(w, 0.8);
    b.classList.remove("no", "yes"); void b.offsetWidth; b.classList.add(ok ? "yes" : "no");
    m.textContent = ok ? (l === "x" ? `Yes! ${w} ends with /ks/.` : `Yes! ${w} starts with /${SOUND[l]}/.`) : `That's ${w}. Listen for /${SOUND[l]}/ and try again.`;
  }));
}

/* ---------- Garden ---------- */
const flower = (l) => { const c = VOWEL.has(l) ? "#8DB7DD" : "#E9A5B1";
  return `<svg viewBox="0 0 60 70" aria-hidden="true"><path class="stem" d="M30 68V34" stroke="#5E8F62" stroke-width="3"/><path d="M30 52c-8 0-12-5-12-10 6 0 12 4 12 10z" fill="#8DB78A"/><g class="bloom">${[0,72,144,216,288].map((r) => `<ellipse cx="30" cy="20" rx="7" ry="11" fill="${c}" transform="rotate(${r} 30 30)"/>`).join("")}<circle cx="30" cy="30" r="6" fill="#F3D27A"/></g></svg>`; };
const sprout = `<svg viewBox="0 0 60 70" aria-hidden="true"><path d="M30 68V46" stroke="#5E8F62" stroke-width="3"/><path class="bloom" d="M30 50c-8 0-11-5-11-10 6 0 11 4 11 10zM30 50c8 0 11-5 11-10-6 0-11 4-11 10z" fill="#8DB78A"/></svg>`;
const seed = `<svg viewBox="0 0 60 70" aria-hidden="true"><ellipse cx="30" cy="64" rx="18" ry="5" fill="#C9B48E"/><ellipse cx="30" cy="59" rx="4" ry="6" fill="#9C7E57"/></svg>`;
export function gardenHtml() {
  const t = todayLetter(), n = Object.keys(L().learned).length;
  let h = C.skyHead({ kicker: `${C.esc(C.state.names[C.state.tab])}'s garden`, title: "The garden", back: true });
  h += `<p class="muted gintro">A flower grows for every letter ${C.esc(C.state.names[C.state.tab])} learns. ${n ? `${n} so far.` : "The first one blooms after today's letter."}</p>
    <section class="garden">${ORDER.map((l) => { const st = isLearned(l) ? "bloomed" : l === t ? "growing" : "resting";
      return `<button class="plot ${st}" data-letter="${l}" aria-label="${show(l)}: ${st === "bloomed" ? "learned" : st === "growing" ? "today's letter" : "not yet"}">${st === "bloomed" ? flower(l) : st === "growing" ? sprout : seed}<span class="${tone(l)}">${show(l)}</span></button>`; }).join("")}</section>`;
  return h;
}
export const bindGarden = () => document.querySelectorAll(".plot[data-letter]").forEach((b) => (b.onclick = () => openLetter(b.dataset.letter)));

/* ---------- Parent journal ---------- */
export function journalHtml() {
  const s = C.state, t = todayLetter(), k = dayKey(), j = s.journal[k] || {};
  let h = C.skyHead({ kicker: "For you, the parent", title: "Journal", back: true });
  h += `<section class="box"><h2>Progress</h2>${["phonics","spelling"].map((kid) => { const lr = s.letters[kid].learned, n = Object.keys(lr).length;
    return `<div class="jkid"><b>${C.esc(s.names[kid])}</b> <span class="muted">· ${n} of 26 letters</span><div class="jsteps">${STEPS.map((st, i) => { const d = st.filter((l) => lr[l]).length; return `<div><i style="width:${(d / st.length) * 100}%"></i><span>Step ${i + 1}</span></div>`; }).join("")}</div></div>`; }).join("")}</section>`;
  if (t) h += `<section class="box"><h2>Practice together today</h2><p class="muted" style="margin:0 0 8px">Letter ${show(t)} with ${C.esc(s.names[s.tab])}. Three small things, any time today.</p>
    <ol class="jlist"><li>Say /${SOUND[t]}/ together and draw ${show(t)} big in the air with two fingers.</li><li>Find three things at home or outside that ${t === "x" ? "end" : "start"} with /${SOUND[t]}/.${(PICS[t] || []).length ? ` Ideas: ${PICS[t].slice(0, 3).join(", ")}.` : ""}</li><li>Tell the memory trick: ${TRICK[t]}</li></ol></section>`;
  h += `<section class="box"><h2>Today's note</h2><label class="f" for="jnote">What clicked, what was hard, what made you smile</label><textarea id="jnote">${C.esc(j.note || "")}</textarea>
    <p class="f">Photo from today's nature walk</p><div class="jphoto" id="jphoto"><span class="muted">No photo yet.</span></div>
    <label class="upl"><input type="file" accept="image/*" id="jfile">Add a photo</label><p class="muted" style="font-size:.85rem;margin:8px 0 0">Photos stay on this device. Nature only: please no faces.</p></section>`;
  const past = Object.keys(s.journal).filter((d) => d !== k && s.journal[d].note).sort().reverse().slice(0, 7);
  if (past.length) h += `<section class="box"><h2>Earlier notes</h2>${past.map((d) => `<div class="note"><b>${new Date(d + "T12:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</b><br>${C.esc(s.journal[d].note)}</div>`).join("")}</section>`;
  return h;
}
export function bindJournal() {
  const s = C.state, k = dayKey();
  C.$("jnote").oninput = (e) => { (s.journal[k] = s.journal[k] || {}).note = e.target.value; C.save(); };
  const showPhoto = async () => { const b = await mediaGet("walk-" + k); if (b && C.$("jphoto")) C.$("jphoto").innerHTML = `<img src="${URL.createObjectURL(b)}" alt="Today's nature walk">`; };
  showPhoto();
  C.$("jfile").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const img = await createImageBitmap(f), sc = Math.min(1, 1200 / Math.max(img.width, img.height));
    const cv = Object.assign(document.createElement("canvas"), { width: img.width * sc, height: img.height * sc });
    cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
    cv.toBlob(async (b) => { await mediaSet("walk-" + k, b); (s.journal[k] = s.journal[k] || {}).photo = true; C.save(); showPhoto(); }, "image/jpeg", 0.82);
  };
}

/* ---------- Settings (behind a parent check) ---------- */
let gateOpen = false, gateQ = null;
export function settingsHtml() {
  const s = C.state;
  let h = C.skyHead({ kicker: "Parents only", title: "Settings", back: true });
  if (!gateOpen) {
    gateQ = gateQ || [6 + Math.floor(Math.random() * 4), 5 + Math.floor(Math.random() * 4)];
    return h + `<section class="box"><h2>A quick parent check</h2><form id="gate"><label class="f" for="gatea">What is ${gateQ[0]} + ${gateQ[1]}?</label><input type="text" inputmode="numeric" id="gatea" autocomplete="off"><button class="btn wide" style="margin-top:10px">Continue</button><p class="muted" id="gatem" aria-live="polite"></p></form></section>`;
  }
  h += `<section class="box"><h2>Children</h2>${["phonics","spelling"].map((k) => `<div class="kidrow"><label class="f" for="nm-${k}">Name or nickname</label><input type="text" id="nm-${k}" value="${C.esc(s.names[k])}" maxlength="30">
      <label class="f" for="ag-${k}">Age</label><input type="text" inputmode="numeric" id="ag-${k}" value="${s.ages[k] || ""}" maxlength="2">
      <label class="f" for="st-${k}">Letter step</label><select id="st-${k}">${STEPS.map((st, i) => `<option value="${i}" ${s.letters[k].step === i ? "selected" : ""}>Step ${i + 1}: ${st.map(show).join(" ")}</option>`).join("")}</select></div>`).join("")}
    <p class="muted" style="font-size:.85rem">Choosing a later step marks the earlier steps as learned. First names or nicknames only.</p></section>
  <section class="box"><h2>Your voice</h2><p class="muted" style="margin:0 0 10px">Record yourself saying each sound once (the sound, not the letter name). Your recording plays instead of the device voice. Recordings stay on this device.</p>
    <div class="vgrid">${ORDER.map((l) => `<div class="vrow"><span class="vl ${tone(l)}">${show(l)}</span><span class="muted vs">/${SOUND[l]}/</span><button class="btn alt sm" data-rec="${l}">Record</button><button class="btn alt sm" data-play="${l}" aria-label="Play ${show(l)}">Play</button><button class="linkbtn" data-delrec="${l}" aria-label="Delete recording for ${show(l)}">Delete</button></div>`).join("")}</div></section>
  <section class="box"><h2>Print letter cards</h2><p class="muted" style="margin:0 0 10px">All 26 picture-letters with their sound, for screen-free practice. Choose "Save as PDF" in the print window to keep a copy.</p><button class="btn alt wide" id="printCards">Print letter cards</button></section>
  <section class="box"><h2>Your data</h2><p class="muted" style="margin:0 0 10px">Reading Path keeps only first names, ages, progress, notes and photos you add. No ads and no trackers.</p>
    <button class="btn alt wide" id="exportData">Download my data</button><button class="btn alt wide" id="deleteData" style="margin-top:8px;color:#9B3B3B">Delete everything</button></section>`;
  return h;
}
export function bindSettings() {
  const s = C.state;
  if (!gateOpen) {
    C.$("gate").onsubmit = (e) => { e.preventDefault(); if (+C.$("gatea").value === gateQ[0] + gateQ[1]) { gateOpen = true; C.render(); } else C.$("gatem").textContent = "Not quite. Try again."; };
    return;
  }
  for (const k of ["phonics", "spelling"]) {
    C.$("nm-" + k).onchange = (e) => { s.names[k] = e.target.value.trim() || (k === "phonics" ? "Little one" : "Big kid"); C.save(); };
    C.$("ag-" + k).onchange = (e) => { s.ages[k] = parseInt(e.target.value, 10) || ""; C.save(); };
    C.$("st-" + k).onchange = (e) => { const i = +e.target.value, lr = s.letters[k]; lr.step = i; STEPS.slice(0, i).flat().forEach((l) => (lr.learned[l] = lr.learned[l] || dayKey())); C.save(); };
  }
  let rec = null;
  document.querySelectorAll("[data-rec]").forEach((b) => (b.onclick = async () => {
    if (rec) { rec.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }), chunks = [];
      rec = new MediaRecorder(stream); rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = async () => { stream.getTracks().forEach((t) => t.stop()); await mediaSet("voice-" + b.dataset.rec, new Blob(chunks, { type: rec.mimeType })); rec = null; b.textContent = "Saved"; setTimeout(() => (b.textContent = "Record again"), 1200); };
      rec.start(); b.textContent = "Stop"; setTimeout(() => rec && rec.state === "recording" && rec.stop(), 4000);
    } catch { b.textContent = "Mic blocked"; }
  }));
  document.querySelectorAll("[data-play]").forEach((b) => (b.onclick = () => hearSound(b.dataset.play)));
  document.querySelectorAll("[data-delrec]").forEach((b) => (b.onclick = async () => { await mediaSet("voice-" + b.dataset.delrec, null); b.textContent = "Deleted"; }));
  C.$("printCards").onclick = printCards;
  C.$("exportData").onclick = () => { const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([JSON.stringify(s, null, 2)], { type: "application/json" })), download: `reading-path-${dayKey()}.json` }); a.click(); };
  C.$("deleteData").onclick = async () => {
    if (!confirm("Delete all progress, notes, recordings and photos? This can't be undone.")) return;
    await mediaClear(); try { localStorage.removeItem("reading-path"); } catch {}
    if (C.resetAccount) await C.resetAccount();
    location.reload();
  };
}

/* ---------- printable cards ---------- */
function printCards() {
  let box = document.getElementById("printCards-sheet");
  if (!box) { box = document.createElement("div"); box.id = "printCards-sheet"; document.body.appendChild(box); }
  box.innerHTML = ORDER.map((l) => `<div class="pcardx ${tone(l)}">${pictureLetter(l, 150)}<b>/${SOUND[l]}/</b><span>${C.esc(wordFor(l))}</span></div>`).join("");
  document.body.classList.add("print-letters");
  window.print();
  setTimeout(() => document.body.classList.remove("print-letters"), 800);
}

/* ---------- small card for the Today screen ---------- */
export function todayCardHtml() {
  const t = todayLetter(); if (!t) return "";
  return `<section class="box ltoday"><div class="lt-pic ${tone(t)}">${pictureLetter(t, 64)}</div><div class="lt-txt"><p class="kicker2">Today's letter</p><h2 class="fr"><span class="al">${show(t)}</span> <span class="muted lt-snd">/${SOUND[t]}/</span></h2></div><button class="btn sm" data-letter="${t}">Start</button></section>`;
}
