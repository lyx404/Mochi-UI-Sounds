import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { sounds, sourceFor, type SoundName } from "@/lib/sounds";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nookbeep — Animal Island UI Sound Library" },
      {
        name: "description",
        content:
          "A cozy, playful library of UI sound effects in Animal Island style. Preview, copy and drop adorable clicks, pops and chimes into your app.",
      },
      { property: "og:title", content: "Nookbeep — Animal Island UI Sound Library" },
      {
        property: "og:description",
        content:
          "Cozy, playful UI sounds in Animal Island style — click, pop, chime, level-up.",
      },
    ],
  }),
  component: Index,
});

type Category = "Taps" | "Toggles" | "Feedback" | "Surfaces" | "Delight";
type SoundMeta = {
  name: SoundName;
  label: string;
  emoji: string;
  category: Category;
  hint: string;
  color: "mint" | "pink" | "yellow" | "blue" | "purple" | "green";
};

const LIBRARY: SoundMeta[] = [
  { name: "click", label: "Click", emoji: "👆", category: "Taps", hint: "Primary button press", color: "mint" },
  { name: "tap", label: "Tap", emoji: "🫳", category: "Taps", hint: "Light tap / list row", color: "blue" },
  { name: "pop", label: "Pop", emoji: "🫧", category: "Taps", hint: "Friendly bouncy press", color: "pink" },
  { name: "hover", label: "Hover", emoji: "✨", category: "Taps", hint: "Subtle focus tick", color: "yellow" },

  { name: "toggleOn", label: "Toggle On", emoji: "🟢", category: "Toggles", hint: "Switch flips on", color: "green" },
  { name: "toggleOff", label: "Toggle Off", emoji: "⚪", category: "Toggles", hint: "Switch flips off", color: "blue" },
  { name: "unlock", label: "Unlock", emoji: "🔓", category: "Toggles", hint: "Permission granted", color: "yellow" },

  { name: "success", label: "Success", emoji: "🎉", category: "Feedback", hint: "Task complete chime", color: "green" },
  { name: "error", label: "Error", emoji: "🐛", category: "Feedback", hint: "Gentle warning honk", color: "pink" },
  { name: "notify", label: "Notify", emoji: "🔔", category: "Feedback", hint: "Soft notification", color: "yellow" },
  { name: "message", label: "Message", emoji: "💌", category: "Feedback", hint: "New message arrived", color: "purple" },

  { name: "open", label: "Open", emoji: "📂", category: "Surfaces", hint: "Modal / drawer opens", color: "mint" },
  { name: "close", label: "Close", emoji: "📁", category: "Surfaces", hint: "Modal / drawer closes", color: "blue" },
  { name: "whoosh", label: "Whoosh", emoji: "💨", category: "Surfaces", hint: "Sheet slides in", color: "purple" },
  { name: "bubble", label: "Bubble", emoji: "🐠", category: "Surfaces", hint: "Tooltip appears", color: "blue" },

  { name: "coin", label: "Coin", emoji: "🪙", category: "Delight", hint: "Reward earned", color: "yellow" },
  { name: "levelUp", label: "Level Up", emoji: "🌟", category: "Delight", hint: "Milestone reached", color: "pink" },
  { name: "chime", label: "Chime", emoji: "🎐", category: "Delight", hint: "Ambient sparkle", color: "mint" },
  { name: "drop", label: "Drop", emoji: "🍃", category: "Delight", hint: "Item drops in", color: "green" },
  { name: "type", label: "Type", emoji: "⌨️", category: "Delight", hint: "Keystroke tick", color: "purple" },
];

const CATEGORIES: Category[] = ["Taps", "Toggles", "Feedback", "Surfaces", "Delight"];

const COLOR_MAP: Record<SoundMeta["color"], { bg: string; ring: string; emoji: string }> = {
  mint:   { bg: "bg-[oklch(0.92_0.06_190)]", ring: "ring-[oklch(0.78_0.13_190)]", emoji: "bg-[oklch(0.78_0.13_190)]" },
  pink:   { bg: "bg-[oklch(0.92_0.06_15)]",  ring: "ring-[oklch(0.78_0.12_15)]",  emoji: "bg-[oklch(0.78_0.12_15)]" },
  yellow: { bg: "bg-[oklch(0.95_0.08_85)]",  ring: "ring-[oklch(0.85_0.14_85)]",  emoji: "bg-[oklch(0.85_0.14_85)]" },
  blue:   { bg: "bg-[oklch(0.92_0.05_270)]", ring: "ring-[oklch(0.7_0.13_270)]",  emoji: "bg-[oklch(0.7_0.13_270)]" },
  purple: { bg: "bg-[oklch(0.92_0.06_310)]", ring: "ring-[oklch(0.68_0.18_310)]", emoji: "bg-[oklch(0.68_0.18_310)]" },
  green:  { bg: "bg-[oklch(0.93_0.07_145)]", ring: "ring-[oklch(0.78_0.13_150)]", emoji: "bg-[oklch(0.78_0.13_150)]" },
};

function Index() {
  const [active, setActive] = useState<Category | "All">("All");
  const [playing, setPlaying] = useState<SoundName | null>(null);
  const [copied, setCopied] = useState<SoundName | null>(null);

  const filtered = useMemo(
    () => (active === "All" ? LIBRARY : LIBRARY.filter((s) => s.category === active)),
    [active],
  );

  const handlePlay = (name: SoundName) => {
    sounds[name]();
    setPlaying(name);
    window.setTimeout(() => setPlaying((p) => (p === name ? null : p)), 600);
  };

  const handleCopy = async (name: SoundName) => {
    try {
      await navigator.clipboard.writeText(sourceFor(name));
      setCopied(name);
      sounds.coin();
      window.setTimeout(() => setCopied((c) => (c === name ? null : c)), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen">
      <TopBanner />

      <main className="mx-auto max-w-6xl px-5 pb-24">
        {/* Hero */}
        <section className="relative pt-12 pb-10 text-center">
          <RibbonTitle>Nookbeep</RibbonTitle>
          <h1 className="mt-8 text-5xl md:text-6xl font-black tracking-tight text-[var(--color-ink)]">
            A cozy sound library
            <br />
            <span className="text-[var(--color-primary-active)]">for friendly interfaces.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--color-ink-soft)]">
            Click any leaf to hear it. Copy the snippet and paste a little bit of
            island life into your buttons, toggles and toasts.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <PrimaryButton onClick={() => sounds.levelUp()}>
              🎵 Play sampler
            </PrimaryButton>
            <GhostButton onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}>
              Browse the library →
            </GhostButton>
          </div>

          <FloatingDeco />
        </section>

        {/* Category tabs */}
        <nav
          aria-label="Sound categories"
          className="sticky top-3 z-10 mx-auto mb-8 flex w-fit max-w-full flex-wrap items-center justify-center gap-2 rounded-full border-2 border-[var(--color-border-strong)] bg-[var(--color-card)] p-1.5 shadow-[0_2px_0_0_#bdaea0]"
        >
          {(["All", ...CATEGORIES] as const).map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                onClick={() => {
                  setActive(c);
                  sounds.tap();
                }}
                className={[
                  "rounded-full px-4 py-2 text-sm font-bold tracking-wide transition-all",
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-[0_3px_0_0_#11a89b]"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-primary-soft)]",
                ].join(" ")}
              >
                {c}
              </button>
            );
          })}
        </nav>

        {/* Grid */}
        <section
          aria-label="Sound effects"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((s) => (
            <SoundCard
              key={s.name}
              meta={s}
              isPlaying={playing === s.name}
              isCopied={copied === s.name}
              onPlay={() => handlePlay(s.name)}
              onCopy={() => handleCopy(s.name)}
            />
          ))}
        </section>

        <Footer />
      </main>
    </div>
  );
}

/* ============ Components ============ */

function TopBanner() {
  return (
    <header className="ai-leaf-bg relative overflow-hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-[#2d6a4f] bg-white text-2xl shadow-[0_3px_0_0_#2d6a4f]">
            🐾
          </div>
          <div className="leading-tight">
            <div className="text-base font-black text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.15)]">
              nookbeep
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/80">
              animal island sounds
            </div>
          </div>
        </div>
        <a
          href="https://github.com/guokaigdg/animal-island-ui"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => sounds.hover()}
          onClick={() => sounds.click()}
          className="ai-pill bg-white px-4 py-2 text-sm text-[var(--color-ink)] ai-press"
        >
          ★ GitHub
        </a>
      </div>
      {/* grass strip */}
      <div className="h-3 w-full bg-[repeating-linear-gradient(90deg,#5fae7a_0_14px,#6fba85_14px_28px)]" />
    </header>
  );
}

function RibbonTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto inline-block">
      <div className="ai-ribbon relative bg-[var(--color-primary)] px-12 py-2.5 text-white shadow-[0_4px_0_0_#11a89b]">
        <span className="text-[11px] font-black uppercase tracking-[0.25em]">
          {children}
        </span>
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => sounds.hover()}
      className="ai-press ai-pill bg-[var(--color-primary)] px-7 py-3 text-base text-white"
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => sounds.hover()}
      className="ai-pill bg-[var(--color-card)] px-7 py-3 text-base text-[var(--color-ink)] shadow-[0_2px_4px_rgba(61,52,40,0.06)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_3px_10px_rgba(61,52,40,0.10)]"
    >
      {children}
    </button>
  );
}

function SoundCard({
  meta,
  isPlaying,
  isCopied,
  onPlay,
  onCopy,
}: {
  meta: SoundMeta;
  isPlaying: boolean;
  isCopied: boolean;
  onPlay: () => void;
  onCopy: () => void;
}) {
  const c = COLOR_MAP[meta.color];
  return (
    <article
      className={[
        "ai-card group relative overflow-hidden p-5",
        c.bg,
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={onPlay}
          aria-label={`Play ${meta.label}`}
          className={[
            "ai-press relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 border-[var(--color-border-strong)] text-3xl",
            c.emoji,
          ].join(" ")}
        >
          <span className={isPlaying ? "animate-bounce" : ""}>{meta.emoji}</span>
          {isPlaying && <Ripples />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg font-black text-[var(--color-ink)]">{meta.label}</h3>
            <span className="font-mono text-[11px] text-[var(--color-ink-muted)]">
              play{meta.name[0].toUpperCase()}{meta.name.slice(1)}()
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[var(--color-ink-soft)]">{meta.hint}</p>
          <Waveform playing={isPlaying} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
          {meta.category}
        </span>
        <div className="flex gap-2">
          <button
            onClick={onPlay}
            onMouseEnter={() => sounds.hover()}
            className="ai-press ai-pill bg-[var(--color-primary)] px-4 py-1.5 text-xs text-white"
          >
            ▶ Play
          </button>
          <button
            onClick={onCopy}
            onMouseEnter={() => sounds.hover()}
            className="ai-pill bg-white px-4 py-1.5 text-xs text-[var(--color-ink)] shadow-[0_2px_4px_rgba(61,52,40,0.08)] transition-transform hover:-translate-y-0.5"
          >
            {isCopied ? "✓ Copied" : "Copy code"}
          </button>
        </div>
      </div>
    </article>
  );
}

function Ripples() {
  return (
    <>
      <span className="pointer-events-none absolute inset-0 animate-ping rounded-2xl ring-4 ring-white/60" />
      <span className="pointer-events-none absolute -inset-1 animate-ping rounded-3xl ring-2 ring-white/40 [animation-delay:120ms]" />
    </>
  );
}

function Waveform({ playing }: { playing: boolean }) {
  const bars = 18;
  return (
    <div className="mt-3 flex h-7 items-end gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-[var(--color-ink-muted)]/50"
          style={{
            height: `${(playing ? 30 + Math.sin(i * 0.9) * 20 + Math.random() * 40 : 12 + Math.sin(i * 0.7) * 6)}%`,
            transition: "height 120ms ease",
          }}
        />
      ))}
    </div>
  );
}

function FloatingDeco() {
  const items = [
    { e: "🍃", x: "5%",  y: "8%",  d: "0s",   r: "-12deg" },
    { e: "🌸", x: "92%", y: "12%", d: "0.4s", r: "10deg" },
    { e: "🐚", x: "10%", y: "75%", d: "0.8s", r: "5deg" },
    { e: "🍂", x: "88%", y: "70%", d: "1.2s", r: "-8deg" },
    { e: "🌼", x: "50%", y: "-2%", d: "1.6s", r: "0deg" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute text-3xl opacity-80 [animation:floaty_6s_ease-in-out_infinite]"
          style={{
            left: it.x,
            top: it.y,
            transform: `rotate(${it.r})`,
            animationDelay: it.d,
          }}
        >
          {it.e}
        </span>
      ))}
      <style>{`@keyframes floaty {
        0%,100% { transform: translateY(0) rotate(var(--r,0deg)); }
        50% { transform: translateY(-10px) rotate(var(--r,0deg)); }
      }`}</style>
    </div>
  );
}

function Footer() {
  const beat = useRef(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      beat.current = (beat.current + 1) % 4;
      setTick((t) => t + 1);
    }, 700);
    return () => window.clearInterval(id);
  }, []);
  return (
    <footer className="mt-20 rounded-3xl border-2 border-[var(--color-border-strong)] bg-[var(--color-card)] p-8 text-center shadow-[0_5px_0_0_#bdaea0]">
      <div className="mb-3 flex justify-center gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={[
              "h-2.5 w-2.5 rounded-full transition-transform",
              i === tick % 4 ? "scale-150 bg-[var(--color-primary)]" : "bg-[var(--color-border)]",
            ].join(" ")}
          />
        ))}
      </div>
      <p className="text-sm font-bold text-[var(--color-ink)]">
        Made with mint tea on a quiet island. 🏝️
      </p>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
        Visual style inspired by animal-island-ui. Sounds synthesized live with Web Audio.
      </p>
    </footer>
  );
}
