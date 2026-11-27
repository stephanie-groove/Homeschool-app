import type { ReactNode } from "react";
import {
  ArrowUpRight, Sparkle, Bug, Search, Leaf, Flower2, Sprout, Sun, Droplets, Microscope,
  Ruler, Pencil, Camera, NotebookPen, Binoculars, Shell, TreeDeciduous, FlaskConical,
  type LucideIcon,
} from "lucide-react";
import monarch from "./photos/monarch.jpg";
import ant from "./photos/ant.jpg";
import bee from "./photos/bee.jpg";

const APP = "/app/";

// The eight Bug Lab weeks and their hands-on labs (same as the app's Bug Lab tab).
const WEEKS: [string, string, string][] = [
  ["W1", "What makes an insect?", "Build a bug"],
  ["W2", "Insect or not?", "Sort the critters"],
  ["W3", "Egg to butterfly", "Pasta life cycle"],
  ["W4", "Ants", "Ant picnic"],
  ["W5", "Bees and flowers", "Cheesy pollination"],
  ["W6", "Beetles and ladybugs", "Ladybug spot math"],
  ["W7", "Senses and camouflage", "Camouflage hunt"],
  ["W8", "Building a bug hotel", "Bug hotel"],
];

const KIT_ROW_1: LucideIcon[] = [Bug, Search, Leaf, Flower2, Sprout, Sun, Droplets, Microscope];
const KIT_ROW_2: LucideIcon[] = [Ruler, Pencil, Camera, NotebookPen, Binoculars, Shell, TreeDeciduous, FlaskConical];

const CREDITS = [
  ["Monarch butterfly", "Rhododendrites", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Monarch_butterfly_male_(52341).jpg"],
  ["Red wood ant", "Richard Bartz", "CC BY-SA 2.5", "https://commons.wikimedia.org/wiki/File:A_Formica_rufa_sideview.jpg"],
  ["Honey bee", "Prasan Shrestha", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Honey_bee_collecting_nectar.jpg"],
];

function SectionLabel({ children, align = "center" }: { children: ReactNode; align?: "center" | "start" }) {
  return (
    <div className={`flex items-center gap-2 ${align === "center" ? "justify-center" : "justify-start"} text-[11px] uppercase tracking-[0.22em] text-white/70`}>
      <Sparkle className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
      <span>{children}</span>
      <Sparkle className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
    </div>
  );
}

function Photo({ src, alt, drift, position = "center", shade = "bg-gradient-to-b from-black/45 via-black/5 to-black/65" }: { src: string; alt: string; drift: "a" | "b"; position?: string; shade?: string }) {
  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${drift === "a" ? "animate-drift-a" : "animate-drift-b"}`}
        style={{ objectPosition: position }}
      />
      <div className={`absolute inset-0 ${shade}`} aria-hidden="true" />
    </>
  );
}

function MarqueeRow({ icons, direction }: { icons: LucideIcon[]; direction: "left" | "right" }) {
  const loop = [...icons, ...icons];
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className={`flex w-max gap-3 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}>
        {loop.map((Icon, i) => (
          <div key={i} className="liquid-glass flex h-14 w-14 shrink-0 items-center justify-center rounded-xl md:h-16 md:w-16" aria-hidden="true">
            <Icon className="h-6 w-6 text-white/90" strokeWidth={1.5} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      <section className="flex flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:gap-8 md:px-10 md:py-10 lg:h-screen lg:px-14">
        {/* header */}
        <header className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <h1 className="text-[28px] font-normal leading-[1.15] tracking-tight sm:text-3xl md:text-4xl lg:text-[44px]">
              Bug Lab: real bugs, real questions.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-[1.6] text-white/60 md:text-[15px]">
              An 8-week nature study for both children together. Each week has a read-aloud, a hands-on lab and a nature
              journal page, with a version for ages 4 and 7. No kits to buy: a jar, a magnifying glass and the backyard are enough.
            </p>
          </div>
          <a
            href={APP}
            className="liquid-glass shrink-0 rounded-full px-5 py-2.5 text-sm text-white transition hover:bg-white/10 sm:px-6 sm:py-3"
          >
            Start Bug Lab today
          </a>
        </header>

        {/* grid */}
        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:min-h-0 lg:grid-cols-3">
          {/* column 1: the eight weeks */}
          <article className="relative flex min-h-[520px] flex-col justify-between overflow-hidden rounded-2xl bg-black p-5 md:p-6 lg:min-h-0">
            <Photo src={monarch} alt="A monarch butterfly drinking from an orange flower" drift="a" position="30% center" shade="bg-gradient-to-b from-black/50 via-black/20 via-40% to-black/90" />
            <div className="relative">
              <SectionLabel>Eight weeks</SectionLabel>
            </div>
            <div className="relative grid grid-cols-[auto_auto_1fr_auto] items-center gap-x-3 gap-y-2.5 text-[12.5px] [text-shadow:0_1px_8px_rgba(0,0,0,0.8)] sm:text-[13px]">
              {WEEKS.map(([wk, topic, lab]) => (
                <div key={wk} className="contents">
                  <span className="font-medium text-white/90">{wk}</span>
                  <Sparkle className="h-3 w-3 text-white/60" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-white/90">{topic}</span>
                  <span className="text-right text-white/65">{lab}</span>
                </div>
              ))}
            </div>
          </article>

          {/* column 2 */}
          <div className="grid gap-4 md:grid-rows-[auto_1fr] md:gap-5 lg:min-h-0">
            <article className="noise-overlay relative overflow-hidden rounded-2xl bg-[#324444] p-5 md:p-6">
              <SectionLabel align="start">Today's question</SectionLabel>
              <p className="mt-4 text-[13px] leading-[1.6] text-white/85 sm:text-[13.5px]">
                "Every insect has 6 legs, 3 body parts and 2 antennae. So is a spider an insect? Count its legs before you
                decide." Ask it at breakfast, then go outside and look.
              </p>
              <p className="mt-4 text-[13px] text-white/70">
                <span className="font-medium text-white">Week 2</span>, Insect or not? · Bug Lab
              </p>
            </article>

            <article className="relative flex min-h-[300px] flex-col items-center justify-end overflow-hidden rounded-2xl bg-black p-5 md:p-6">
              <Photo src={ant} alt="A red wood ant standing on a pine cone among green leaves" drift="b" position="45% center" />
              <div className="relative flex flex-1 items-center justify-center">
                <p className="text-5xl font-light tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] sm:text-6xl md:text-7xl lg:text-[88px]">
                  6 legs
                </p>
              </div>
              <p className="relative text-center text-sm text-white/85">Every insect has six. Count them on this ant.</p>
            </article>
          </div>

          {/* column 3 */}
          <div className="grid gap-4 md:col-span-2 md:grid-cols-2 md:gap-5 lg:col-span-1 lg:min-h-0 lg:grid-cols-1 lg:grid-rows-[1fr_auto]">
            <article className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl bg-black p-5 md:p-6 lg:min-h-0">
              <Photo src={bee} alt="A honey bee with yellow pollen on its legs, holding on to a plant stem" drift="a" position="35% center" />
              <div className="relative">
                <SectionLabel>In your kit</SectionLabel>
              </div>
              <div className="relative flex flex-col gap-3">
                <MarqueeRow icons={KIT_ROW_1} direction="left" />
                <MarqueeRow icons={KIT_ROW_2} direction="right" />
              </div>
            </article>

            <article className="noise-overlay relative overflow-hidden rounded-2xl bg-[#324444] p-5 md:p-6">
              <SectionLabel align="start">Journal prompt</SectionLabel>
              <div className="absolute right-5 top-4 md:right-6">
                <a href={APP} aria-label="Open Bug Lab in the app" className="liquid-glass flex h-9 w-9 items-center justify-center rounded-full">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </a>
              </div>
              <p className="mt-4 text-[15px] text-white">Find a real insect today.</p>
              <p className="mt-1 text-[13.5px] text-white/70">Count its legs before you draw it.</p>
            </article>
          </div>
        </div>
      </section>

      <footer className="px-4 pb-8 pt-2 text-[11.5px] leading-[1.6] text-white/45 sm:px-6 md:px-10 lg:px-14">
        Photos from Wikimedia Commons:{" "}
        {CREDITS.map(([what, who, lic, url], i) => (
          <span key={url}>
            <a href={url} className="underline decoration-white/25 underline-offset-2 hover:text-white/70">{what}</a> by {who} ({lic})
            {i < CREDITS.length - 1 ? "; " : "."}
          </span>
        ))}{" "}
        Reading Path · not medical advice.
      </footer>
    </main>
  );
}
