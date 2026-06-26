import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  setSoundVolume,
  sounds,
  sourceForTheme,
  soundThemes,
  type SoundName,
  type SoundThemeName,
} from "@/lib/sounds";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mochi Sounds — 麻薯音效" },
      {
        name: "description",
        content:
          "Mochi Sounds / 麻薯音效 — a cozy, playful UI sound library. Preview, copy and drop adorable clicks, pops and chimes into your app.",
      },
      { property: "og:title", content: "Mochi Sounds — 麻薯音效" },
      {
        property: "og:description",
        content: "Mochi Sounds / 麻薯音效 — cozy, playful UI sounds.",
      },
    ],
  }),
  component: Index,
});

type Language = "zh" | "en";
type SoundCategory =
  | "all"
  | "basic"
  | "form"
  | "navigation"
  | "state"
  | "system"
  | "motion"
  | "reward";
type SoundMeta = {
  id: string;
  names: [SoundName, ...SoundName[]];
  label: string;
  emoji: string;
  hint: string;
  color: "mint" | "pink" | "yellow" | "blue" | "purple" | "green";
};
type StyledSelectOption = { value: string; label: string };

const LIBRARY: SoundMeta[] = [
  { id: "click", names: ["click"], label: "Click", emoji: "👆", hint: "Primary button press", color: "mint" },
  { id: "tap", names: ["tap"], label: "Tap", emoji: "🫳", hint: "Light tap / list row", color: "blue" },
  { id: "pop", names: ["pop"], label: "Pop", emoji: "🫧", hint: "Friendly bouncy press", color: "pink" },
  { id: "hover", names: ["hover"], label: "Hover", emoji: "✨", hint: "Subtle focus tick", color: "yellow" },

  { id: "switch", names: ["toggleOn", "toggleOff"], label: "Switch", emoji: "🟢", hint: "Switch state changes", color: "green" },
  { id: "unlock", names: ["unlock"], label: "Unlock", emoji: "🔓", hint: "Permission granted", color: "yellow" },

  { id: "notification", names: ["notify", "success", "error"], label: "Notification", emoji: "🔔", hint: "Toast notification states", color: "yellow" },
  { id: "message", names: ["message"], label: "Message", emoji: "💌", hint: "New message arrived", color: "purple" },

  { id: "surface", names: ["open", "close"], label: "Modal", emoji: "📂", hint: "Modal or drawer state changes", color: "mint" },
  { id: "whoosh", names: ["whoosh"], label: "Whoosh", emoji: "💨", hint: "Sheet slides in", color: "purple" },
  { id: "bubble", names: ["bubble"], label: "Bubble", emoji: "🐠", hint: "Tooltip appears", color: "blue" },

  { id: "coin", names: ["coin"], label: "Coin", emoji: "🪙", hint: "Reward earned", color: "yellow" },
  { id: "levelUp", names: ["levelUp"], label: "Level Up", emoji: "🌟", hint: "Milestone reached", color: "pink" },
  { id: "chime", names: ["chime"], label: "Chime", emoji: "🎐", hint: "Ambient sparkle", color: "mint" },
  { id: "drop", names: ["drop"], label: "Drop", emoji: "🍃", hint: "Item drops in", color: "green" },
  { id: "type", names: ["type"], label: "Type", emoji: "⌨️", hint: "Keystroke tick", color: "purple" },

  { id: "slider", names: ["slider", "snap"], label: "Slider", emoji: "🎚️", hint: "Range value and step changes", color: "mint" },
  { id: "checkbox", names: ["check", "uncheck"], label: "Checkbox", emoji: "☑️", hint: "Checkbox state changes", color: "green" },
  { id: "radio", names: ["radio"], label: "Radio", emoji: "◉", hint: "Radio option selected", color: "yellow" },
  { id: "tab", names: ["tab"], label: "Tab", emoji: "▣", hint: "Tab view changes", color: "blue" },
  { id: "dropdown", names: ["menuOpen", "select"], label: "Dropdown", emoji: "☰", hint: "Menu opens and option is chosen", color: "purple" },
];

const SOUND_CATEGORY_BY_NAME: Record<SoundName, Exclude<SoundCategory, "all">> = {
  click: "basic",
  tap: "basic",
  pop: "basic",
  hover: "basic",
  type: "basic",
  slider: "form",
  snap: "form",
  check: "form",
  uncheck: "form",
  radio: "form",
  tab: "navigation",
  menuOpen: "navigation",
  select: "navigation",
  toggleOn: "state",
  toggleOff: "state",
  unlock: "state",
  success: "system",
  error: "system",
  notify: "system",
  message: "system",
  open: "motion",
  close: "motion",
  whoosh: "motion",
  bubble: "motion",
  drop: "motion",
  coin: "reward",
  levelUp: "reward",
  chime: "reward",
};

const SOUND_CATEGORIES: Array<{
  value: SoundCategory;
  label: Record<Language, string>;
}> = [
  { value: "all", label: { zh: "全部组件", en: "All components" } },
  { value: "basic", label: { zh: "基础反馈", en: "Basic feedback" } },
  { value: "form", label: { zh: "表单控件", en: "Form controls" } },
  { value: "navigation", label: { zh: "导航菜单", en: "Navigation menus" } },
  { value: "state", label: { zh: "开关状态", en: "Switch states" } },
  { value: "system", label: { zh: "系统提示", en: "System prompts" } },
  { value: "motion", label: { zh: "界面动效", en: "Interface motion" } },
  { value: "reward", label: { zh: "奖励反馈", en: "Reward feedback" } },
];

const COPY = {
  zh: {
    brandSubtitle: "UI组件音效库",
    languageLabel: "语言选择",
    github: "★ GitHub",
    themeLabel: "音色选择",
    categoryLabel: "组件分类",
    volumeLabel: "音量调整",
    themeCurrent: "柔软反馈",
    heroLine1: "轻快友好的",
    heroLine2: "界面音色库",
    heroBody: "点击任意叶片试听，复制代码片段，把一点岛屿气息放进按钮、开关和提示里。",
    soundsLabel: "音效列表",
    playPrefix: "播放",
    playButton: "▶ 播放",
    copied: "✓ 已复制",
    copyCode: "复制代码",
    copyThemeCode: "复制当前音色",
    footerTitle: "在安静的小岛上，用薄荷茶完成。",
    footerBody: "视觉风格 inspired by animal-island-ui。声音由 Web Audio 实时合成。",
  },
  en: {
    brandSubtitle: "UI SOUND LIBRARY",
    languageLabel: "Language",
    github: "★ GitHub",
    themeLabel: "Sound theme",
    categoryLabel: "Component category",
    volumeLabel: "Volume",
    themeCurrent: "Soft feedback",
    heroLine1: "A cozy sound library",
    heroLine2: "for friendly interfaces.",
    heroBody:
      "Click any leaf to hear it. Copy the snippet and paste a little bit of island life into your buttons, toggles and toasts.",
    soundsLabel: "Sound effects",
    playPrefix: "Play",
    playButton: "▶ Play",
    copied: "✓ Copied",
    copyCode: "Copy code",
    copyThemeCode: "Copy current sound",
    footerTitle: "Made with mint tea on a quiet island.",
    footerBody: "Visual style inspired by animal-island-ui. Sounds synthesized live with Web Audio.",
  },
  } satisfies Record<Language, Record<string, string>>;

const SOUND_THEMES: Record<
  SoundThemeName,
  {
    label: { zh: string; en: string };
    description: { zh: string; en: string };
    play: (name: SoundName) => void;
    source: () => string;
  }
> = {
  softFeedback: {
    label: { zh: "柔软反馈", en: "Soft feedback" },
    description: { zh: "轻、软、圆润", en: "Light, soft, rounded" },
    play: soundThemes.softFeedback.play,
    source: () => sourceForTheme("softFeedback"),
  },
  pixel: {
    label: { zh: "像素音", en: "Pixel sound" },
    description: { zh: "短促、颗粒感、更像游戏", en: "Short, crisp, game-like" },
    play: soundThemes.pixel.play,
    source: () => sourceForTheme("pixel"),
  },
  clearChime: {
    label: { zh: "清亮风铃声", en: "Clear chime" },
    description: { zh: "通透、延展、带一点空气感", en: "Bright, ringing, airy" },
    play: soundThemes.clearChime.play,
    source: () => sourceForTheme("clearChime"),
  },
};

const THEME_ORDER: SoundThemeName[] = ["softFeedback", "pixel", "clearChime"];

const COMPONENT_COPY: Record<Language, Record<string, { label: string; hint: string }>> = {
  zh: {
    click: { label: "点击", hint: "主按钮按下" },
    tap: { label: "轻点", hint: "轻触或列表行" },
    pop: { label: "弹跳", hint: "友好的弹性按压" },
    hover: { label: "悬停", hint: "细微聚焦提示" },
    switch: { label: "开关", hint: "开启与关闭状态" },
    unlock: { label: "解锁", hint: "权限已授予" },
    notification: { label: "通知", hint: "通知、成功与错误提示" },
    message: { label: "消息", hint: "新消息到达" },
    surface: { label: "弹层", hint: "弹窗或抽屉打开/关闭" },
    whoosh: { label: "掠过", hint: "面板滑入" },
    bubble: { label: "气泡", hint: "提示浮层出现" },
    coin: { label: "金币", hint: "获得奖励" },
    levelUp: { label: "升级", hint: "达成里程碑" },
    chime: { label: "风铃", hint: "环境闪光音" },
    drop: { label: "落下", hint: "物品掉落" },
    type: { label: "输入", hint: "按键轻响" },
    slider: { label: "滑动条", hint: "拖动与刻度吸附" },
    checkbox: { label: "复选框", hint: "勾选与取消勾选" },
    radio: { label: "单选", hint: "单选项切换" },
    tab: { label: "标签页", hint: "视图切换" },
    dropdown: { label: "下拉菜单", hint: "展开与选中选项" },
  },
  en: Object.fromEntries(
    LIBRARY.map((component) => [component.id, { label: component.label, hint: component.hint }]),
  ),
};

const COLOR_MAP: Record<SoundMeta["color"], { bg: string; ring: string; emoji: string }> = {
  mint:   { bg: "bg-[oklch(0.92_0.06_190)]", ring: "ring-[oklch(0.78_0.13_190)]", emoji: "bg-[oklch(0.78_0.13_190)]" },
  pink:   { bg: "bg-[oklch(0.92_0.06_15)]",  ring: "ring-[oklch(0.78_0.12_15)]",  emoji: "bg-[oklch(0.78_0.12_15)]" },
  yellow: { bg: "bg-[oklch(0.95_0.08_85)]",  ring: "ring-[oklch(0.85_0.14_85)]",  emoji: "bg-[oklch(0.85_0.14_85)]" },
  blue:   { bg: "bg-[oklch(0.92_0.05_270)]", ring: "ring-[oklch(0.7_0.13_270)]",  emoji: "bg-[oklch(0.7_0.13_270)]" },
  purple: { bg: "bg-[oklch(0.92_0.06_310)]", ring: "ring-[oklch(0.68_0.18_310)]", emoji: "bg-[oklch(0.68_0.18_310)]" },
  green:  { bg: "bg-[oklch(0.93_0.07_145)]", ring: "ring-[oklch(0.78_0.13_150)]", emoji: "bg-[oklch(0.78_0.13_150)]" },
};

function Index() {
  const [language, setLanguage] = useState<Language>("zh");
  const [theme, setTheme] = useState<SoundThemeName>("softFeedback");
  const [category, setCategory] = useState<SoundCategory>("all");
  const [volume, setVolume] = useState(80);
  const [playing, setPlaying] = useState<SoundName | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const copy = COPY[language];
  const filteredSounds = useMemo(
    () =>
      category === "all"
        ? LIBRARY
        : LIBRARY.filter((component) =>
            component.names.some((name) => SOUND_CATEGORY_BY_NAME[name] === category),
          ),
    [category],
  );

  useEffect(() => {
    setSoundVolume(volume / 100);
  }, [volume]);

  const handlePlay = (name: SoundName) => {
    SOUND_THEMES[theme].play(name);
    setPlaying(name);
    window.setTimeout(() => setPlaying((p) => (p === name ? null : p)), 600);
  };

  const handleCopy = async (name: SoundName, copiedKey: string = name) => {
    SOUND_THEMES[theme].play(name);
    try {
      await navigator.clipboard.writeText(SOUND_THEMES[theme].source());
      setCopied(copiedKey);
      window.setTimeout(() => setCopied((c) => (c === copiedKey ? null : c)), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen">
      <TopBanner language={language} onLanguageChange={setLanguage} copy={copy} />

      <main className="mx-auto max-w-6xl px-5 pb-24">
        {/* Hero */}
        <section className="relative pt-12 pb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[var(--color-ink)]">
            {copy.heroLine1}
            <br />
            <span className="text-[var(--color-primary-active)]">{copy.heroLine2}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--color-ink-soft)]">
            {copy.heroBody}
          </p>

          <FloatingDeco />
        </section>

        <SoundControls
          copy={copy}
          language={language}
          theme={theme}
          category={category}
          volume={volume}
          onChange={setTheme}
          onCategoryChange={setCategory}
          onVolumeChange={setVolume}
        />

        {/* Grid */}
        <section
          aria-label={copy.soundsLabel}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredSounds.map((s) => (
            <SoundCard
              key={s.id}
              meta={s}
              playing={playing}
              isCopied={copied === s.id}
              language={language}
              copy={copy}
              onPlay={handlePlay}
              onCopy={(name) => handleCopy(name, s.id)}
            />
          ))}
        </section>

        <Footer copy={copy} />
      </main>
    </div>
  );
}

/* ============ Components ============ */

function TopBanner({
  language,
  onLanguageChange,
  copy,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  copy: typeof COPY[Language];
}) {
  return (
    <header className="ai-leaf-bg relative z-20 overflow-visible">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border-2 border-[#2d6a4f] bg-white text-2xl shadow-[0_3px_0_0_#2d6a4f]">
            🐾
          </div>
          <div className="leading-tight">
            <div className="text-base font-black text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.15)]">
              {language === "zh" ? "麻薯音效" : "Mochi Sounds"}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/80">
              {copy.brandSubtitle}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StyledSelect
            value={language}
            ariaLabel={copy.languageLabel}
            align="right"
            className="min-w-28"
            options={[
              { value: "zh", label: "中文" },
              { value: "en", label: "English" },
            ]}
            onChange={(value) => {
              onLanguageChange(value as Language);
              sounds.tap();
            }}
          />
          <a
            href="https://github.com/lyx404/Game-UI-Sounds"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.click()}
            className="ai-pill flex h-11 min-w-28 items-center justify-center bg-white px-4 text-sm text-[var(--color-ink)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
          >
            {copy.github}
          </a>
        </div>
      </div>
      {/* grass strip */}
      <div className="h-3 w-full bg-[repeating-linear-gradient(90deg,#5fae7a_0_14px,#6fba85_14px_28px)]" />
    </header>
  );
}

function SoundCard({
  meta,
  playing,
  isCopied,
  language,
  copy,
  onPlay,
  onCopy,
}: {
  meta: SoundMeta;
  playing: SoundName | null;
  isCopied: boolean;
  language: Language;
  copy: typeof COPY[Language];
  onPlay: (name: SoundName) => void;
  onCopy: (name: SoundName) => void;
}) {
  const c = COLOR_MAP[meta.color];
  const primaryName = meta.names[0];
  const componentCopy = COMPONENT_COPY[language][meta.id];
  const componentIsPlaying = playing ? meta.names.includes(playing) : false;
  const handlePreviewPlay = (name: SoundName) => onPlay(name);
  return (
    <article
      onMouseEnter={meta.names.includes("hover") ? () => onPlay("hover") : undefined}
      className={[
        "ai-card group relative overflow-hidden p-5 pr-14",
        c.bg,
      ].join(" ")}
    >
      <button
        onClick={() => onCopy(primaryName)}
        aria-label={copy.copyThemeCode}
        title={copy.copyThemeCode}
        className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border-2 border-[var(--color-border-strong)] bg-white text-sm font-black text-[var(--color-ink)] shadow-[0_2px_4px_rgba(61,52,40,0.08)] transition-transform hover:-translate-y-0.5"
      >
        {isCopied ? "✓" : "⧉"}
      </button>

      <div className="flex items-start gap-4">
        <button
          onClick={() => onPlay(primaryName)}
          aria-label={`${copy.playPrefix} ${componentCopy.label}`}
          className={[
            "relative grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 border-[var(--color-border-strong)] text-3xl transition-transform hover:-translate-y-0.5 active:translate-y-0.5",
            c.emoji,
          ].join(" ")}
        >
          <span className={componentIsPlaying ? "animate-bounce" : ""}>{meta.emoji}</span>
          {componentIsPlaying && <Ripples />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h3 className="text-lg font-black text-[var(--color-ink)]">{componentCopy.label}</h3>
            <span className="break-all font-mono text-[11px] text-[var(--color-ink-muted)]">
              {meta.names
                .map((name) => `play${name[0].toUpperCase()}${name.slice(1)}()`)
                .join(" / ")}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[var(--color-ink-soft)]">{componentCopy.hint}</p>
          <ComponentPreview
            id={meta.id}
            language={language}
            playing={componentIsPlaying}
            onPlay={handlePreviewPlay}
          />
        </div>
      </div>
    </article>
  );
}

function ComponentPreview({
  id,
  language,
  playing,
  onPlay,
}: {
  id: string;
  language: Language;
  playing: boolean;
  onPlay: (name: SoundName) => void;
}) {
  const [sliderValue, setSliderValue] = useState(35);
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const [radioValue, setRadioValue] = useState("a");
  const [activeTab, setActiveTab] = useState("a");
  const [menuOpen, setMenuOpen] = useState(false);
  const [surfaceOpen, setSurfaceOpen] = useState(false);
  const [popPressed, setPopPressed] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [messageRead, setMessageRead] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [coinCount, setCoinCount] = useState(12);
  const [level, setLevel] = useState(3);
  const [dropped, setDropped] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [selected, setSelected] = useState(language === "zh" ? "柔软反馈" : "Soft");

  if (id === "slider") {
    return (
      <div className="mt-4 rounded-2xl bg-white/35 p-3">
        <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase text-[var(--color-ink-muted)]">
          <span>{language === "zh" ? "数值" : "Value"}</span>
          <span>{sliderValue}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={sliderValue}
          onChange={(event) => {
            const next = Number(event.target.value);
            setSliderValue(next);
            onPlay(next % 10 === 0 ? "snap" : "slider");
          }}
          className="h-2 w-full cursor-pointer accent-[var(--color-primary)]"
          aria-label={language === "zh" ? "滑动条预览" : "Slider preview"}
        />
      </div>
    );
  }

  if (id === "checkbox") {
    return (
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/35 p-3">
        <button
          type="button"
          onClick={() => {
            const next = !checked;
            setChecked(next);
            onPlay(next ? "check" : "uncheck");
          }}
          className="flex items-center gap-3 text-left"
        >
          <span
            className={[
              "grid h-8 w-8 place-items-center rounded-lg border-2 border-[var(--color-border-strong)] bg-white text-lg font-black",
              checked ? "text-[var(--color-primary-active)]" : "text-transparent",
            ].join(" ")}
          >
            ✓
          </span>
          <span className="text-sm font-black text-[var(--color-ink)]">
            {language === "zh" ? "启用提醒" : "Enable alert"}
          </span>
        </button>
        <span className="text-xs font-black text-[var(--color-ink-muted)]">
          {checked ? (language === "zh" ? "已勾选" : "Checked") : (language === "zh" ? "未勾选" : "Clear")}
        </span>
      </div>
    );
  }

  if (id === "switch") {
    return (
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/35 p-3">
        <span className="text-sm font-black text-[var(--color-ink)]">
          {language === "zh" ? "自动播放" : "Auto play"}
        </span>
        <button
          type="button"
          aria-pressed={switchOn}
          onClick={() => {
            const next = !switchOn;
            setSwitchOn(next);
            onPlay(next ? "toggleOn" : "toggleOff");
          }}
          className={[
            "relative h-8 w-14 rounded-full border-2 border-[var(--color-border-strong)] transition-colors",
            switchOn ? "bg-[var(--color-primary)]" : "bg-white",
          ].join(" ")}
        >
          <span
            className={[
              "absolute top-1 h-5 w-5 rounded-full border-2 border-[var(--color-border-strong)] bg-white transition-transform",
              switchOn ? "translate-x-6" : "translate-x-1",
            ].join(" ")}
          />
        </button>
      </div>
    );
  }

  if (id === "notification") {
    const toasts: Array<{
      name: SoundName;
      icon: string;
      zh: string;
      en: string;
      color: string;
    }> = [
      { name: "notify", icon: "i", zh: "通知提示", en: "Info Toast", color: "text-blue-500" },
      { name: "success", icon: "✓", zh: "成功提示", en: "Success Toast", color: "text-emerald-600" },
      { name: "error", icon: "×", zh: "错误提示", en: "Error Toast", color: "text-rose-500" },
    ];

    return (
      <div className="mt-4 space-y-2 rounded-2xl bg-white/35 p-2">
        {toasts.map((toast) => (
          <button
            key={toast.name}
            type="button"
            onClick={() => onPlay(toast.name)}
            className="flex w-full items-center gap-3 rounded-xl border-2 border-white/70 bg-white/75 px-3 py-2 text-left text-xs font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5"
          >
            <span
              className={[
                "grid h-6 w-6 place-items-center rounded-full border-2 bg-white text-sm leading-none",
                toast.color,
              ].join(" ")}
            >
              {toast.icon}
            </span>
            <span>{language === "zh" ? toast.zh : toast.en}</span>
          </button>
        ))}
      </div>
    );
  }

  if (id === "surface") {
    return (
      <div className="mt-4 rounded-2xl bg-white/35 p-3">
        <button
          type="button"
          onClick={() => {
            const next = !surfaceOpen;
            setSurfaceOpen(next);
            onPlay(next ? "open" : "close");
          }}
          className="flex w-full items-center justify-between rounded-full border-2 border-[var(--color-border-strong)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5"
        >
          <span>{surfaceOpen ? (language === "zh" ? "关闭抽屉" : "Close drawer") : (language === "zh" ? "打开抽屉" : "Open drawer")}</span>
          <span>{surfaceOpen ? "−" : "+"}</span>
        </button>

        <div
          className={[
            "mt-3 overflow-hidden rounded-2xl border-2 border-[var(--color-border-strong)] bg-white transition-all duration-200",
            surfaceOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-black text-[var(--color-ink)]">
              {language === "zh" ? "设置面板" : "Settings panel"}
            </span>
            <span className="h-2 w-12 rounded-full bg-[var(--color-primary)]" />
          </div>
        </div>
      </div>
    );
  }

  if (id === "radio") {
    return (
      <div className="mt-4 flex gap-2 rounded-2xl bg-white/35 p-3">
        {["a", "b"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setRadioValue(value);
              onPlay("radio");
            }}
            className={[
              "flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[var(--color-border-strong)] px-3 py-1.5 text-xs font-black",
              radioValue === value ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-ink)]",
            ].join(" ")}
          >
            <span>{radioValue === value ? "◉" : "○"}</span>
            {value === "a" ? "A" : "B"}
          </button>
        ))}
      </div>
    );
  }

  if (id === "tab") {
    return (
      <div className="mt-4 rounded-2xl bg-white/35 p-2">
        <div className="grid grid-cols-2 gap-2">
          {["a", "b"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setActiveTab(value);
                onPlay("tab");
              }}
              className={[
                "rounded-full border-2 border-[var(--color-border-strong)] px-3 py-1.5 text-xs font-black",
                activeTab === value ? "bg-[var(--color-primary)] text-white" : "bg-white text-[var(--color-ink)]",
              ].join(" ")}
            >
              {value === "a" ? (language === "zh" ? "总览" : "Overview") : (language === "zh" ? "详情" : "Details")}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (id === "dropdown") {
    return (
      <div className="relative mt-4 rounded-2xl bg-white/35 p-3">
        <button
          type="button"
          onClick={() => {
            setMenuOpen((current) => !current);
            onPlay("menuOpen");
          }}
          className="flex w-full items-center justify-between rounded-full border-2 border-[var(--color-border-strong)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-ink)]"
        >
          {selected}
          <span>{menuOpen ? "▲" : "▼"}</span>
        </button>
        {menuOpen && (
          <div className="absolute left-3 right-3 top-[calc(100%-6px)] z-20 rounded-2xl border-2 border-[var(--color-border-strong)] bg-[var(--color-card)] p-1 shadow-[0_4px_0_#bdaea0]">
            {[
              language === "zh" ? "柔软反馈" : "Soft",
              language === "zh" ? "像素音" : "Pixel",
            ].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSelected(option);
                  setMenuOpen(false);
                  onPlay("select");
                }}
                className="w-full rounded-xl px-3 py-1.5 text-left text-xs font-black text-[var(--color-ink)] hover:bg-white"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (id === "click") {
    return (
      <div className="mt-4 rounded-2xl bg-white/35 p-3">
        <button
          type="button"
          onClick={() => onPlay("click")}
          className="w-full rounded-full border-2 border-[var(--color-border-strong)] bg-[var(--color-primary)] px-4 py-2 text-sm font-black text-white transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
        >
          {language === "zh" ? "确认操作" : "Confirm"}
        </button>
      </div>
    );
  }

  if (id === "tap") {
    return (
      <button
        type="button"
        onClick={() => onPlay("tap")}
        className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white/45 px-3 py-2 text-left text-sm font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5"
      >
        <span>{language === "zh" ? "列表项目" : "List item"}</span>
        <span className="text-[var(--color-ink-muted)]">›</span>
      </button>
    );
  }

  if (id === "pop") {
    return (
      <div className="mt-4 rounded-2xl bg-white/35 p-3">
        <button
          type="button"
          onClick={() => {
            setPopPressed(true);
            onPlay("pop");
            window.setTimeout(() => setPopPressed(false), 180);
          }}
          className={[
            "mx-auto grid h-12 w-12 place-items-center rounded-2xl border-2 border-[var(--color-border-strong)] bg-white text-2xl transition-transform",
            popPressed ? "scale-110" : "hover:scale-105",
          ].join(" ")}
        >
          🫧
        </button>
      </div>
    );
  }

  if (id === "hover") {
    return (
      <div
        onMouseEnter={() => onPlay("hover")}
        className="mt-4 rounded-2xl border-2 border-dashed border-[var(--color-border-strong)] bg-white/35 px-3 py-3 text-center text-xs font-black text-[var(--color-ink)]"
      >
        {language === "zh" ? "悬停到这里" : "Hover here"}
      </div>
    );
  }

  if (id === "unlock") {
    return (
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/35 p-3">
        <span className="text-sm font-black text-[var(--color-ink)]">
          {unlocked ? (language === "zh" ? "已解锁" : "Unlocked") : (language === "zh" ? "权限锁定" : "Locked")}
        </span>
        <button
          type="button"
          onClick={() => {
            setUnlocked(true);
            onPlay("unlock");
          }}
          className="rounded-full border-2 border-[var(--color-border-strong)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5"
        >
          🔓
        </button>
      </div>
    );
  }

  if (id === "message") {
    return (
      <button
        type="button"
        onClick={() => {
          setMessageRead((current) => !current);
          onPlay("message");
        }}
        className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-white/40 p-3 text-left"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-lg">💌</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-[var(--color-ink)]">
            {language === "zh" ? "新消息" : "New message"}
          </span>
          <span className="block text-xs font-black text-[var(--color-ink-muted)]">
            {messageRead ? (language === "zh" ? "已读" : "Read") : (language === "zh" ? "未读" : "Unread")}
          </span>
        </span>
      </button>
    );
  }

  if (id === "whoosh") {
    return (
      <div className="mt-4 rounded-2xl bg-white/35 p-3">
        <button
          type="button"
          onClick={() => {
            setPanelVisible((current) => !current);
            onPlay("whoosh");
          }}
          className="w-full rounded-full border-2 border-[var(--color-border-strong)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-ink)]"
        >
          {language === "zh" ? "滑入面板" : "Slide panel"}
        </button>
        <div
          className={[
            "mt-3 h-8 rounded-xl bg-[var(--color-primary)] transition-transform",
            panelVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-40",
          ].join(" ")}
        />
      </div>
    );
  }

  if (id === "bubble") {
    return (
      <div className="relative mt-4 rounded-2xl bg-white/35 p-3 text-center">
        <button
          type="button"
          onMouseEnter={() => {
            setTooltipVisible(true);
            onPlay("bubble");
          }}
          onClick={() => {
            setTooltipVisible((current) => !current);
            onPlay("bubble");
          }}
          className="rounded-full border-2 border-[var(--color-border-strong)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-ink)]"
        >
          {language === "zh" ? "提示目标" : "Tooltip target"}
        </button>
        {tooltipVisible && (
          <div className="absolute left-1/2 top-[calc(100%-4px)] z-20 -translate-x-1/2 rounded-full border-2 border-[var(--color-border-strong)] bg-white px-3 py-1 text-xs font-black text-[var(--color-ink)] shadow-[0_4px_0_#bdaea0]">
            {language === "zh" ? "提示浮层" : "Bubble tip"}
          </div>
        )}
      </div>
    );
  }

  if (id === "coin") {
    return (
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/35 p-3">
        <span className="text-sm font-black text-[var(--color-ink)]">🪙 {coinCount}</span>
        <button
          type="button"
          onClick={() => {
            setCoinCount((count) => count + 1);
            onPlay("coin");
          }}
          className="rounded-full border-2 border-[var(--color-border-strong)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-ink)]"
        >
          {language === "zh" ? "领取" : "Claim"}
        </button>
      </div>
    );
  }

  if (id === "levelUp") {
    return (
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/35 p-3">
        <span className="text-sm font-black text-[var(--color-ink)]">
          {language === "zh" ? `等级 ${level}` : `Level ${level}`}
        </span>
        <button
          type="button"
          onClick={() => {
            setLevel((current) => current + 1);
            onPlay("levelUp");
          }}
          className="rounded-full border-2 border-[var(--color-border-strong)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-ink)]"
        >
          ⭐
        </button>
      </div>
    );
  }

  if (id === "chime") {
    return (
      <button
        type="button"
        onClick={() => onPlay("chime")}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/35 px-3 py-3 text-sm font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5"
      >
        🎐 {language === "zh" ? "轻敲风铃" : "Ring chime"}
      </button>
    );
  }

  if (id === "drop") {
    return (
      <div className="mt-4 rounded-2xl bg-white/35 p-3">
        <button
          type="button"
          onClick={() => {
            setDropped((current) => !current);
            onPlay("drop");
          }}
          className="relative h-12 w-full rounded-2xl border-2 border-dashed border-[var(--color-border-strong)] bg-white/60"
        >
          <span
            className={[
              "absolute left-1/2 text-xl transition-all",
              dropped ? "top-5 -translate-x-1/2" : "top-1 -translate-x-1/2",
            ].join(" ")}
          >
            🍃
          </span>
        </button>
      </div>
    );
  }

  if (id === "type") {
    return (
      <input
        value={typedText}
        onChange={(event) => {
          setTypedText(event.target.value);
          onPlay("type");
        }}
        placeholder={language === "zh" ? "输入文字..." : "Type here..."}
        className="mt-4 w-full rounded-2xl border-2 border-[var(--color-border-strong)] bg-white/70 px-3 py-2 text-sm font-black text-[var(--color-ink)] outline-none"
      />
    );
  }

  return <Waveform playing={playing} />;
}

function SoundControls({
  copy,
  language,
  theme,
  category,
  volume,
  onChange,
  onCategoryChange,
  onVolumeChange,
}: {
  copy: typeof COPY[Language];
  language: Language;
  theme: SoundThemeName;
  category: SoundCategory;
  volume: number;
  onChange: (theme: SoundThemeName) => void;
  onCategoryChange: (category: SoundCategory) => void;
  onVolumeChange: (volume: number) => void;
}) {
  return (
    <nav
      aria-label={copy.themeLabel}
      className="sticky top-3 z-10 mx-auto mb-8 flex w-fit max-w-full flex-wrap items-center justify-center gap-3 rounded-[2rem] border-2 border-[var(--color-border-strong)] bg-[var(--color-card)] px-4 py-3 shadow-[0_2px_0_0_#bdaea0]"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-black text-[var(--color-ink)]">
          {copy.themeLabel}
        </span>
        <StyledSelect
          value={theme}
          ariaLabel={copy.themeLabel}
          className="min-w-40"
          options={THEME_ORDER.map((themeKey) => ({
            value: themeKey,
            label: SOUND_THEMES[themeKey].label[language],
          }))}
          onChange={(value) => {
            onChange(value as SoundThemeName);
            sounds.tap();
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-black text-[var(--color-ink)]">
          {copy.categoryLabel}
        </span>
        <StyledSelect
          value={category}
          ariaLabel={copy.categoryLabel}
          className="min-w-36"
          options={SOUND_CATEGORIES.map((item) => ({
            value: item.value,
            label: item.label[language],
          }))}
          onChange={(value) => {
            onCategoryChange(value as SoundCategory);
            sounds.tap();
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sound-volume" className="text-sm font-black text-[var(--color-ink)]">
          {copy.volumeLabel}
        </label>
        <input
          id="sound-volume"
          type="range"
          min="0"
          max="100"
          step="5"
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          className="w-28 accent-[var(--color-primary)]"
          aria-label={copy.volumeLabel}
        />
        <span className="min-w-9 text-right text-xs font-black text-[var(--color-ink-muted)]">
          {volume}%
        </span>
      </div>
    </nav>
  );
}

function StyledSelect({
  value,
  options,
  ariaLabel,
  onChange,
  align = "left",
  className = "min-w-40",
}: {
  value: string;
  options: StyledSelectOption[];
  ariaLabel: string;
  onChange: (value: string) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={["relative", className].join(" ")}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        className={[
          "ai-pill ai-press flex h-11 w-full items-center justify-between gap-3 bg-white px-4 text-sm font-black text-[var(--color-ink)] outline-none",
          "ring-0 transition-shadow focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/30",
        ].join(" ")}
      >
        <span className="truncate">{selected?.label}</span>
        <span className="text-xs text-[var(--color-ink-muted)]" aria-hidden="true">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          className={[
            "absolute top-[calc(100%+8px)] z-50 min-w-full rounded-3xl border-2 border-[var(--color-border-strong)] bg-[var(--color-card)] p-2",
            "shadow-[0_6px_0_0_#bdaea0,0_12px_22px_rgba(61,52,40,0.16)]",
            align === "right" ? "right-0" : "left-0",
          ].join(" ")}
        >
          <div
            role="listbox"
            aria-label={ariaLabel}
            className="max-h-64 overflow-auto rounded-2xl"
          >
            {options.map((option) => {
              const selectedOption = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selectedOption}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 text-left text-sm font-black transition",
                    selectedOption
                      ? "bg-[var(--color-primary)] text-white shadow-[inset_0_-2px_0_rgba(61,52,40,0.18)]"
                      : "text-[var(--color-ink)] hover:bg-white hover:shadow-[inset_0_0_0_2px_var(--color-border)]",
                  ].join(" ")}
                >
                  <span className="whitespace-nowrap">{option.label}</span>
                  {selectedOption && <span aria-hidden="true">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
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

function Footer({ copy }: { copy: typeof COPY[Language] }) {
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
        {copy.footerTitle}
      </p>
      <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
        {copy.footerBody}
      </p>
    </footer>
  );
}
