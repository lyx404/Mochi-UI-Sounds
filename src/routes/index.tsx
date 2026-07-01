import { createFileRoute } from "@tanstack/react-router";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell, CheckSquare, ChevronDown, CircleDot, CloudLightning, CloudRain, Coins, Copy, Hand, Keyboard, Layers,
  Leaf, List, Lock, Mail, MessageCircle, MousePointer, MousePointerClick, Music,
  PanelTopClose, Sigma, SlidersHorizontal, Star, ToggleRight, TrendingUp, Unlock, Volume2, Wind, X, Zap,
} from "lucide-react";
import {
  setSoundVolume,
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
type SoundCategory = "controls" | "ambient";
type InstallStat = {
  value: string;
  label: Record<Language, string>;
};
type SoundMeta = {
  id: string;
  copyId?: string;
  names: [SoundName, ...SoundName[]];
  label: string;
  emoji: string;
  hint: string;
  color: "mint" | "pink" | "yellow" | "blue" | "purple" | "green";
};
type SoundSection = {
  id: string;
  title: Record<Language, string>;
  items: SoundMeta[];
};
type StyledSelectOption = { value: string; label: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SOUND_ICONS: Record<string, React.ComponentType<any>> = {
  trigger: MousePointerClick,
  click: MousePointerClick, tap: Hand, pop: Zap, hover: MousePointer,
  switch: ToggleRight, unlock: Unlock, notification: Bell, message: Mail,
  surface: Layers, bubble: MessageCircle, coin: Coins,
  levelUp: TrendingUp, chime: Music, drop: Leaf, type: Keyboard,
  slider: SlidersHorizontal, checkbox: CheckSquare, radio: CircleDot,
  tab: List, collapse: PanelTopClose, statistic: Sigma, dropdown: ChevronDown, weather: CloudRain,
};

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
  { id: "bubble", names: ["bubble"], label: "Bubble", emoji: "🐠", hint: "Tooltip appears", color: "blue" },

  { id: "coin", names: ["coin"], label: "Coin", emoji: "🪙", hint: "Reward earned", color: "yellow" },
  { id: "levelUp", names: ["levelUp"], label: "Level Up", emoji: "🌟", hint: "Milestone reached", color: "pink" },
  { id: "chime", names: ["chime"], label: "Chime", emoji: "🎐", hint: "Ambient sparkle", color: "mint" },
  { id: "drop", names: ["drop"], label: "Drop", emoji: "🍃", hint: "Item drops in", color: "green" },
  { id: "weather", names: ["rain", "wind", "storm"], label: "Weather", emoji: "🌧️", hint: "Weather white noise loops", color: "blue" },
  { id: "type", names: ["type"], label: "Type", emoji: "⌨️", hint: "Keystroke tick", color: "purple" },

  { id: "slider", names: ["slider", "snap"], label: "Slider", emoji: "🎚️", hint: "Range value and step changes", color: "mint" },
  { id: "checkbox", names: ["check", "uncheck"], label: "Checkbox", emoji: "☑️", hint: "Checkbox state changes", color: "green" },
  { id: "radio", names: ["radio"], label: "Radio", emoji: "◉", hint: "Radio option selected", color: "yellow" },
  { id: "tab", names: ["tab"], label: "Tab", emoji: "▣", hint: "Tab view changes", color: "blue" },
  { id: "collapse", names: ["open", "close"], label: "Collapse", emoji: "▤", hint: "Panel expands or collapses", color: "blue" },
  { id: "statistic", names: ["levelUp"], label: "Statistic", emoji: "123", hint: "Number value changes", color: "blue" },
  { id: "dropdown", names: ["menuOpen", "select"], label: "Dropdown", emoji: "☰", hint: "Menu opens and option is chosen", color: "purple" },
];

const TRIGGER_ENTRY: SoundMeta = {
  id: "trigger",
  names: ["click", "tap", "pop"],
  label: "Trigger feedback",
  emoji: "👆",
  hint: "Click, tap and pop cues",
  color: "mint",
};

function soundEntry(id: string, overrides: Partial<SoundMeta> = {}): SoundMeta {
  const entry = LIBRARY.find((component) => component.id === id);
  if (!entry) throw new Error(`Missing sound entry: ${id}`);
  return { ...entry, ...overrides };
}

const CONTROL_SECTIONS: SoundSection[] = [
  {
    id: "general",
    title: { zh: "通用", en: "General" },
    items: [TRIGGER_ENTRY],
  },
  {
    id: "display",
    title: { zh: "数据展示", en: "Data Display" },
    items: [
      soundEntry("tab"),
      soundEntry("collapse"),
      soundEntry("statistic"),
      soundEntry("bubble", { copyId: "floatingLayer" }),
    ],
  },
  {
    id: "input",
    title: { zh: "数据输入", en: "Data Entry" },
    items: [
      soundEntry("type"),
      soundEntry("checkbox"),
      soundEntry("radio"),
      soundEntry("switch"),
      soundEntry("slider"),
    ],
  },
  {
    id: "feedback",
    title: { zh: "反馈", en: "Feedback" },
    items: [
      soundEntry("notification"),
      soundEntry("message"),
      soundEntry("surface"),
    ],
  },
  {
    id: "navigation",
    title: { zh: "导航", en: "Navigation" },
    items: [soundEntry("dropdown")],
  },
  {
    id: "other",
    title: { zh: "其他", en: "Other" },
    items: [
      soundEntry("hover"),
      soundEntry("unlock"),
    ],
  },
];

const CONTROL_SECTION_COLUMNS: SoundSection[][] = [
  CONTROL_SECTIONS.filter((section) => ["general", "display", "other"].includes(section.id)),
  CONTROL_SECTIONS.filter((section) => ["input"].includes(section.id)),
  CONTROL_SECTIONS.filter((section) => ["feedback", "navigation"].includes(section.id)),
];

const SOUND_GROUPS: Record<SoundCategory, SoundMeta[]> = {
  controls: CONTROL_SECTIONS.flatMap((section) => section.items),
  ambient: [
    soundEntry("bubble", { copyId: "ambientBubble" }),
    soundEntry("weather", { copyId: "ambientWeather" }),
    soundEntry("chime", { copyId: "ambientChime" }),
    soundEntry("drop", { copyId: "ambientDrop" }),
    soundEntry("coin", { copyId: "ambientCoin" }),
    soundEntry("levelUp", { copyId: "ambientLevelUp" }),
    soundEntry("pop", { copyId: "ambientPop" }),
    soundEntry("hover", { copyId: "ambientSparkle" }),
  ],
};

const SOUND_CATEGORIES: Array<{
  value: SoundCategory;
  label: Record<Language, string>;
}> = [
  { value: "controls", label: { zh: "控件", en: "Controls" } },
  { value: "ambient",  label: { zh: "氛围", en: "Ambience" } },
];

const COPY = {
  zh: {
    brandSubtitle: "UI组件音效库",
    languageLabel: "语言选择",
    github: "★ GitHub",
    themeLabel: "音色选择",
    categoryLabel: "音效类型",
    volumeLabel: "音量调整",
    themeCurrent: "柔软反馈",
    heroLine1: "麻薯音效",
    heroLine2: "UI组件音效库",
    soundsLabel: "音效列表",
    playPrefix: "播放",
    preview: "试听",
    playButton: "▶ 播放",
    copied: "✓ 已复制",
    copyCode: "复制代码",
    copyThemeCode: "复制当前音色",
  },
  en: {
    brandSubtitle: "UI SOUND LIBRARY",
    languageLabel: "Language",
    github: "★ GitHub",
    themeLabel: "Sound theme",
    categoryLabel: "Sound type",
    volumeLabel: "Volume",
    themeCurrent: "Soft feedback",
    heroLine1: "Mochi Sounds",
    heroLine2: "UI component sound library",
    soundsLabel: "Sound effects",
    playPrefix: "Play",
    preview: "Preview",
    playButton: "▶ Play",
    copied: "✓ Copied",
    copyCode: "Copy code",
    copyThemeCode: "Copy current sound",
  },
  } satisfies Record<Language, Record<string, string>>;

const SOUND_THEMES: Record<
  SoundThemeName,
  {
    label: { zh: string; en: string };
    description: { zh: string; en: string };
    play: (name: SoundName, step?: number) => void;
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
const AI_INSTALL_COMMAND =
  "npx shadcn@latest add lyx404/Mochi-UI-Sounds/mochi-sounds";
const AI_INSTALL_STATS: InstallStat[] = [
  { value: `${LIBRARY.length}`, label: { zh: "组件音效", en: "component cues" } },
  { value: `${THEME_ORDER.length}`, label: { zh: "音色包", en: "sound packs" } },
];
const COFFEE_ALIPAY_IMAGE = "/coffee-alipay.png";
const GITHUB_REPO_URL = "https://github.com/lyx404/Mochi-UI-Sounds";
const GITHUB_REPO_API_URL = "https://api.github.com/repos/lyx404/Mochi-UI-Sounds";

const COMPONENT_COPY: Record<Language, Record<string, { label: string; hint: string }>> = {
  zh: {
    trigger: { label: "按钮", hint: "点击、轻点与弹跳" },
    click: { label: "点击", hint: "主按钮按下" },
    tap: { label: "轻点", hint: "轻触或列表行" },
    pop: { label: "弹跳", hint: "友好的弹性按压" },
    hover: { label: "悬停", hint: "细微聚焦提示" },
    switch: { label: "开关", hint: "开启与关闭状态" },
    unlock: { label: "解锁", hint: "权限已授予" },
    notification: { label: "提示", hint: "通知、成功与错误提示" },
    message: { label: "消息", hint: "新消息到达" },
    surface: { label: "抽屉", hint: "弹窗或抽屉打开/关闭" },
    floatingLayer: { label: "文字提示", hint: "提示浮层出现" },
    bubble: { label: "气泡", hint: "轻盈冒泡声" },
    coin: { label: "金币", hint: "获得奖励" },
    levelUp: { label: "升级", hint: "达成里程碑" },
    chime: { label: "风铃", hint: "环境闪光音" },
    drop: { label: "落下", hint: "物品掉落" },
    type: { label: "输入", hint: "按键轻响" },
    slider: { label: "滑动条", hint: "拖动与刻度吸附" },
    checkbox: { label: "复选框", hint: "勾选与取消勾选" },
    radio: { label: "单选", hint: "单选项切换" },
    tab: { label: "标签页", hint: "视图切换" },
    collapse: { label: "折叠面板", hint: "展开与收起内容" },
    statistic: { label: "数值显示", hint: "数值变化提示" },
    dropdown: { label: "下拉菜单", hint: "展开与选中选项" },
    ambientBubble: { label: "气泡", hint: "轻盈冒泡声" },
    ambientChime: { label: "风铃", hint: "清亮空气感" },
    ambientDrop: { label: "落叶", hint: "轻柔下落" },
    ambientCoin: { label: "金币", hint: "清脆收集" },
    ambientLevelUp: { label: "星光", hint: "上升完成感" },
    ambientPop: { label: "弹泡", hint: "柔软回弹" },
    ambientSparkle: { label: "闪光", hint: "细小亮点" },
    ambientBell: { label: "铃声", hint: "明亮提示" },
    ambientMessage: { label: "叮咚", hint: "消息轻响" },
    ambientSurface: { label: "空间开合", hint: "展开与收起" },
    ambientWeather: { label: "天气", hint: "雨声、风声与雷雨白噪音" },
  },
  en: {
    ...Object.fromEntries(
      LIBRARY.map((component) => [component.id, { label: component.label, hint: component.hint }]),
    ),
    trigger: { label: "Trigger feedback", hint: "Click, tap and pop cues" },
    floatingLayer: { label: "Floating layer", hint: "Tooltip or helper layer appears" },
    ambientBubble: { label: "Bubble", hint: "Soft bubble accent" },
    ambientChime: { label: "Chime", hint: "Bright airy sparkle" },
    ambientDrop: { label: "Leaf drop", hint: "Soft falling motion" },
    ambientCoin: { label: "Coin", hint: "Crisp collection cue" },
    ambientLevelUp: { label: "Starlift", hint: "Rising completion cue" },
    ambientPop: { label: "Pop", hint: "Soft rebound" },
    ambientSparkle: { label: "Sparkle", hint: "Tiny bright flicker" },
    ambientBell: { label: "Bell", hint: "Clear attention cue" },
    ambientMessage: { label: "Ding", hint: "New message accent" },
    ambientSurface: { label: "Air open", hint: "Space opens or closes" },
    ambientWeather: { label: "Weather", hint: "Rain, wind and storm white noise" },
  },
};

const COMPONENT_TRIGGER_TIMING: Record<Language, Record<string, string>> = {
  zh: {
    trigger: "点击按钮时触发",
    hover: "悬停或聚焦时触发",
    switch: "切换开关状态时触发",
    unlock: "锁定/解锁时触发",
    notification: "提示出现时触发",
    message: "新消息到达时触发",
    surface: "抽屉打开或关闭时触发",
    floatingLayer: "鼠标悬停显示提示时触发",
    bubble: "提示浮层出现时触发",
    coin: "奖励到账时触发",
    levelUp: "等级或进度提升时触发",
    chime: "环境提示出现时触发",
    drop: "物品下落时触发",
    weather: "切换天气白噪音时触发",
    type: "输入字符时触发",
    slider: "拖动滑块或吸附刻度时触发",
    checkbox: "勾选或取消勾选时触发",
    radio: "选择单选项时触发",
    tab: "切换标签页时触发",
    collapse: "展开或收起面板时触发",
    statistic: "数值上升或下降时触发",
    dropdown: "展开菜单或选中选项时触发",
    ambientBubble: "建议使用场景：轻量提示、气泡反馈",
    ambientChime: "建议使用场景：完成提醒、清亮提示",
    ambientDrop: "建议使用场景：掉落动效、轻柔过渡",
    ambientCoin: "建议使用场景：奖励领取、收集反馈",
    ambientLevelUp: "建议使用场景：任务完成、等级提升",
    ambientPop: "建议使用场景：弹性反馈、轻快确认",
    ambientSparkle: "建议使用场景：悬停高亮、细微聚焦",
    ambientWeather: "建议使用场景：天气氛围、白噪音背景",
  },
  en: {
    trigger: "Triggers when a button is pressed",
    hover: "Triggers on hover or focus",
    switch: "Triggers when the switch state changes",
    unlock: "Triggers when unlock completes",
    notification: "Triggers when an alert appears",
    message: "Triggers when a new message arrives",
    surface: "Triggers when the drawer opens or closes",
    floatingLayer: "Triggers when a tooltip appears on hover",
    bubble: "Triggers when a helper bubble appears",
    coin: "Triggers when a reward is collected",
    levelUp: "Triggers when progress increases",
    chime: "Triggers when an ambient cue appears",
    drop: "Triggers when an item drops",
    weather: "Triggers when weather noise changes",
    type: "Triggers while typing characters",
    slider: "Triggers while dragging or snapping the slider",
    checkbox: "Triggers when checking or unchecking",
    radio: "Triggers when choosing a radio option",
    tab: "Triggers when switching tabs",
    collapse: "Triggers when expanding or collapsing",
    statistic: "Triggers when the value rises or falls",
    dropdown: "Triggers when opening or selecting from the menu",
    ambientBubble: "Suggested use: lightweight hints and bubble feedback",
    ambientChime: "Suggested use: completion reminders and bright cues",
    ambientDrop: "Suggested use: falling motion and soft transitions",
    ambientCoin: "Suggested use: reward collection feedback",
    ambientLevelUp: "Suggested use: task completion and level progress",
    ambientPop: "Suggested use: rebound feedback and quick confirmation",
    ambientSparkle: "Suggested use: hover highlight and subtle focus",
    ambientWeather: "Suggested use: weather ambience and white-noise background",
  },
};

const COLOR_MAP: Record<SoundMeta["color"], { bg: string; ring: string; emoji: string }> = {
  mint:   { bg: "bg-[oklch(0.92_0.06_190)]", ring: "ring-[oklch(0.78_0.13_190)]", emoji: "bg-[oklch(0.78_0.13_190)]" },
  pink:   { bg: "bg-[oklch(0.92_0.06_15)]",  ring: "ring-[oklch(0.78_0.12_15)]",  emoji: "bg-[oklch(0.78_0.12_15)]" },
  yellow: { bg: "bg-[oklch(0.95_0.08_85)]",  ring: "ring-[oklch(0.85_0.14_85)]",  emoji: "bg-[oklch(0.85_0.14_85)]" },
  blue:   { bg: "bg-[oklch(0.92_0.05_270)]", ring: "ring-[oklch(0.7_0.13_270)]",  emoji: "bg-[oklch(0.7_0.13_270)]" },
  purple: { bg: "bg-[oklch(0.92_0.06_310)]", ring: "ring-[oklch(0.68_0.18_310)]", emoji: "bg-[oklch(0.68_0.18_310)]" },
  green:  { bg: "bg-[oklch(0.93_0.07_145)]", ring: "ring-[oklch(0.78_0.13_150)]", emoji: "bg-[oklch(0.78_0.13_150)]" },
};

async function writeClipboardText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  }
}

function formatStars(stars: number) {
  return new Intl.NumberFormat("en-US", {
    notation: stars >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(stars);
}

function componentPrompt(meta: SoundMeta, componentCopy: { label: string; hint: string }) {
  const apiNames = meta.names
    .map((name) => `play${name[0].toUpperCase()}${name.slice(1)}()`)
    .join(", ");

  return `为「${componentCopy.label}」组件接入 Mochi UI Sounds 音效。适合场景：${componentCopy.hint}。可用音效函数：${apiNames}。请只在对应用户交互或状态变化时播放音效，避免影响其他组件。`;
}

function stepForTypedText(nextValue: string, previousValue: string) {
  if (nextValue.length <= previousValue.length) return 0;

  const char = nextValue.slice(previousValue.length).at(-1) ?? nextValue.at(-1) ?? "";
  const code = char.codePointAt(0) ?? 0;
  return code % 8;
}

function Index() {
  const [language, setLanguage] = useState<Language>("zh");
  const [theme, setTheme] = useState<SoundThemeName>("softFeedback");
  const [category, setCategory] = useState<SoundCategory>("controls");
  const [volume, setVolume] = useState(80);
  const [playing, setPlaying] = useState<SoundName | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [installCopied, setInstallCopied] = useState(false);
  const copy = COPY[language];
  const filteredSounds = useMemo(
    () => SOUND_GROUPS[category],
    [category],
  );

  useEffect(() => {
    setSoundVolume(volume / 100);
  }, [volume]);

  const handlePlay = (name: SoundName, step?: number) => {
    SOUND_THEMES[theme].play(name, step);
    setPlaying(name);
    window.setTimeout(() => setPlaying((p) => (p === name ? null : p)), 600);
  };

  const handleCopy = async (name: SoundName, copiedKey: string = name) => {
    if (await writeClipboardText(SOUND_THEMES[theme].source())) {
      setCopied(copiedKey);
      window.setTimeout(() => setCopied((c) => (c === copiedKey ? null : c)), 1500);
    }
  };

  const handleInstallCopy = async () => {
    if (await writeClipboardText(AI_INSTALL_COMMAND)) {
      setInstallCopied(true);
      window.setTimeout(() => setInstallCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-5 pb-10">
        {/* Hero */}
        <section className="relative pt-12 pb-8 text-center">
          <HeroActions
            language={language}
            onLanguageChange={setLanguage}
            copy={copy}
          />
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-[var(--color-ink)]">
            {copy.heroLine1}
            <br />
            <span className="text-[var(--color-primary-active)]">{copy.heroLine2}</span>
          </h1>
          <HeroInstallEntry
            language={language}
            copied={installCopied}
            onCopy={handleInstallCopy}
          />

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
          className={category === "controls" ? "grid gap-5 lg:grid-cols-3" : "columns-1 gap-5 sm:columns-2 lg:columns-3"}
        >
          {category === "controls"
            ? CONTROL_SECTION_COLUMNS.map((sections, index) => (
              <div key={index} className="grid content-start gap-5">
                {sections.map((section) => (
                  <SoundSectionGroup
                    key={section.id}
                    section={section}
                    language={language}
                    category={category}
                    playing={playing}
                    onPlay={handlePlay}
                    onCopy={handleCopy}
                  />
                ))}
              </div>
            ))
            : filteredSounds.map((s) => {
              const copiedKey = `${category}-${s.id}`;
              return (
                <SoundCard
                  key={copiedKey}
                  meta={s}
                  category={category}
                  playing={playing}
                  language={language}
                  onPlay={handlePlay}
                  onCopy={(name) => handleCopy(name, copiedKey)}
                />
              );
            })}
        </section>

        <Footer language={language} />
      </main>
    </div>
  );
}

/* ============ Components ============ */

function HeroInstallEntry({
  language,
  copied,
  onCopy,
}: {
  language: Language;
  copied: boolean;
  onCopy: () => void;
}) {
  const text = {
    zh: {
      body: "一套即装即用的 UI 音效库，为按钮、表单和反馈状态补上轻盈、统一的交互声音。",
      copy: copied ? "已复制" : "复制",
      aria: "复制 AI 工具安装命令",
    },
    en: {
      body: "A ready-to-use UI sound kit that adds light, consistent feedback to buttons, forms and product states.",
      copy: copied ? "Copied" : "Copy",
      aria: "Copy AI tool install command",
    },
  }[language];

  return (
    <div className="mx-auto mt-8 max-w-4xl text-left">
      <div className="rounded-[28px] bg-[var(--color-card)] px-5 py-5 shadow-[0_14px_34px_rgba(114,93,66,0.10)] sm:px-6">
        <div className="grid gap-5">
          <div className="grid gap-3">
            <p className="max-w-[68ch] text-sm font-bold leading-relaxed text-[var(--color-ink-soft)]">
              {text.body}
            </p>
            <div className="flex min-w-0 flex-col gap-2 rounded-2xl bg-white/70 p-2 sm:flex-row sm:items-center">
              <code className="min-w-0 flex-1 whitespace-pre-wrap break-all px-3 py-2.5 font-mono text-sm font-black text-[var(--color-ink)] sm:overflow-x-auto sm:whitespace-nowrap sm:break-normal">
                <span className="mr-2 text-[var(--color-ink-muted)]">$</span>
                {AI_INSTALL_COMMAND}
              </code>
              <button
                type="button"
                onClick={onCopy}
                aria-label={text.aria}
                className="flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary-soft)] px-4 text-sm font-black text-[var(--color-primary-active)] transition-colors hover:bg-white sm:w-auto"
              >
                {copied ? "✓" : <Copy size={16} strokeWidth={2.5} />}
                <span>{text.copy}</span>
              </button>
            </div>
          </div>
          <dl className="flex flex-wrap gap-3">
            {AI_INSTALL_STATS.map((stat) => (
              <div
                key={`${stat.value}-${stat.label.en}`}
                className="flex items-baseline gap-2 rounded-full bg-white/55 px-4 py-2"
              >
                <dt className="text-lg font-black text-[var(--color-ink)]">{stat.value}</dt>
                <dd className="text-xs font-bold text-[var(--color-ink-muted)]">
                  {stat.label[language]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

function HeroActions({
  language,
  onLanguageChange,
  copy,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  copy: typeof COPY[Language];
}) {
  return (
    <div className="mb-8 flex justify-center gap-2 lg:absolute lg:right-0 lg:top-12 lg:mb-0">
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
        }}
      />
      <a
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="ai-pill flex h-11 min-w-28 items-center justify-center gap-2 bg-white px-4 text-sm font-black text-[var(--color-ink)] shadow-none outline-none transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-press-hover)] active:translate-y-0.5 active:shadow-[var(--shadow-press-active)] focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/30"
        aria-label={copy.github}
      >
        <GitHubMark />
        <GitHubStars />
      </a>
    </div>
  );
}

function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(GITHUB_REPO_API_URL, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((repo: { stargazers_count?: number }) => {
        if (typeof repo.stargazers_count === "number") setStars(repo.stargazers_count);
      })
      .catch(() => {
        if (!controller.signal.aborted) setStars(null);
      });

    return () => controller.abort();
  }, []);

  return (
    <span className="flex items-center gap-1.5 tabular-nums text-[var(--color-ink-muted)]">
      <span>{stars === null ? "—" : formatStars(stars)}</span>
      <Star size={16} strokeWidth={2.3} fill="currentColor" />
    </span>
  );
}

function GitHubMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5 shrink-0 text-[var(--color-ink)]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.86 8.35 6.84 9.7.5.1.68-.22.68-.5v-1.75c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.33 9.33 0 0 1 12 6.9c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .28.18.6.69.5A10.04 10.04 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function SoundSectionGroup({
  section,
  language,
  category,
  playing,
  onPlay,
  onCopy,
}: {
  section: SoundSection;
  language: Language;
  category: SoundCategory;
  playing: SoundName | null;
  onPlay: (name: SoundName, step?: number) => void;
  onCopy: (name: SoundName, copiedKey?: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-3 px-1 text-sm font-black text-[var(--color-ink-muted)]">
        {section.title[language]}
      </h2>
      {section.items.map((s) => {
        const copiedKey = `${category}-${s.id}`;
        return (
          <SoundCard
            key={copiedKey}
            meta={s}
            category={category}
            playing={playing}
            language={language}
            onPlay={onPlay}
            onCopy={(name) => onCopy(name, copiedKey)}
          />
        );
      })}
    </div>
  );
}

function SoundCard({
  meta,
  category,
  playing,
  language,
  onPlay,
  onCopy,
}: {
  meta: SoundMeta;
  category: SoundCategory;
  playing: SoundName | null;
  language: Language;
  onPlay: (name: SoundName) => void;
  onCopy: (name: SoundName) => void;
}) {
  const c = COLOR_MAP[meta.color];
  const primaryName = meta.names[0];
  const componentCopy = COMPONENT_COPY[language][meta.copyId ?? meta.id];
  const triggerTiming = COMPONENT_TRIGGER_TIMING[language][meta.copyId ?? meta.id] ?? componentCopy.hint;
  const componentIsPlaying = playing ? meta.names.includes(playing) : false;
  const [promptCopied, setPromptCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const handlePreviewPlay = (name: SoundName, step?: number) => onPlay(name, step);
  const handlePromptCopy = async () => {
    if (await writeClipboardText(componentPrompt(meta, componentCopy))) {
      setPromptCopied(true);
      window.setTimeout(() => setPromptCopied(false), 1500);
    }
  };
  const handleCodeCopy = (name: SoundName) => {
    onCopy(name);
    setCodeCopied(true);
    window.setTimeout(() => setCodeCopied(false), 1500);
  };

  return (
    <article
      className={[
        "ai-card group relative isolate mb-5 break-inside-avoid p-5",
        c.bg,
      ].join(" ")}
    >
      {/* Compact header: icon + title + copy button in one row */}
      <div className="flex min-h-7 items-center gap-2">
        <span
          aria-label={componentCopy.label}
          className={[
            "relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-lg",
            c.emoji,
          ].join(" ")}
        >
          <SoundIcon id={meta.id} />
          {componentIsPlaying && <Ripples />}
        </span>

        <h3 className="flex min-w-0 flex-1 self-stretch items-center text-base font-black leading-none text-[var(--color-ink)]">{componentCopy.label}</h3>

        <div className="relative z-10 flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={handlePromptCopy}
            className="inline-flex h-7 items-center rounded-full bg-white/80 px-2.5 text-xs font-black leading-none text-[var(--color-ink)] transition-transform hover:-translate-y-0.5 hover:bg-white"
          >
            {promptCopied ? (language === "zh" ? "已复制" : "Copied") : (language === "zh" ? "复制 prompt" : "Prompt")}
          </button>
          <button
            type="button"
            onClick={() => handleCodeCopy(primaryName)}
            className="inline-flex h-7 items-center rounded-full bg-white/80 px-2.5 text-xs font-black leading-none text-[var(--color-ink)] transition-transform hover:-translate-y-0.5 hover:bg-white"
          >
            {codeCopied ? (language === "zh" ? "已复制" : "Copied") : (language === "zh" ? "复制代码" : "Code")}
          </button>
        </div>
      </div>

      {/* Secondary info */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {category !== "ambient" && (
          <span className="break-all font-mono text-[10px] font-bold uppercase text-[var(--color-ink-muted)]">
            {meta.names
              .map((name) => `play${name[0].toUpperCase()}${name.slice(1)}()`)
              .join(" / ")}
          </span>
        )}
        <p className="text-xs text-[var(--color-ink-soft)]">{triggerTiming}</p>
      </div>

      {/* Trigger area with minimum height */}
      <div className="mt-4">
        {category === "ambient" ? (
          <button
            type="button"
            onClick={() => handlePreviewPlay(primaryName)}
            className="flex w-full items-center justify-center rounded-2xl bg-white py-3 text-sm font-black text-[var(--color-ink)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {language === "zh" ? "播放" : "Play"}
          </button>
        ) : (
          <ComponentPreview
            id={meta.id}
            language={language}
            playing={componentIsPlaying}
            onPlay={handlePreviewPlay}
          />
        )}
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
  onPlay: (name: SoundName, step?: number) => void;
}) {
  const [sliderValue, setSliderValue] = useState(35);
  const lastSliderCueAt = useRef(0);
  const statAnimationFrame = useRef<number | null>(null);
  const [checkboxValues, setCheckboxValues] = useState({
    option1: true,
    option2: false,
    option3: true,
  });
  const [switchValues, setSwitchValues] = useState({
    round: false,
    square: false,
    line: false,
  });
  const [radioValue, setRadioValue] = useState("a");
  const [activeTab, setActiveTab] = useState("a");
  const [activeCollapse, setActiveCollapse] = useState<string | null>("1");
  const [menuOpen, setMenuOpen] = useState(false);
  const [surfaceOpen, setSurfaceOpen] = useState(false);
  const [popPressed, setPopPressed] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [statValue, setStatValue] = useState(50.32);
  const [coinCount, setCoinCount] = useState(12);
  const [level, setLevel] = useState(3);
  const [dropped, setDropped] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [selected, setSelected] = useState(language === "zh" ? "柔软反馈" : "Soft");
  const playSliderDragCue = () => {
    const now = window.performance.now();
    if (now - lastSliderCueAt.current < 90) return;
    lastSliderCueAt.current = now;
    onPlay("slider");
  };
  const playSliderReleaseCue = () => {
    lastSliderCueAt.current = 0;
    onPlay("snap");
  };
  const animateStatistic = (
    from: number,
    to: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    if (statAnimationFrame.current !== null) {
      window.cancelAnimationFrame(statAnimationFrame.current);
    }

    const startAt = window.performance.now();
    const duration = 700;
    const tick = (now: number) => {
      const progress = Math.min((now - startAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setter(Number((from + (to - from) * eased).toFixed(2)));

      if (progress < 1) {
        statAnimationFrame.current = window.requestAnimationFrame(tick);
      } else {
        statAnimationFrame.current = null;
      }
    };

    statAnimationFrame.current = window.requestAnimationFrame(tick);
  };

  if (id === "slider") {
    return (
      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between text-[11px] font-black uppercase text-[var(--color-ink-muted)]">
          <span>{language === "zh" ? "数值" : "Value"}</span>
          <span className="text-[var(--color-primary-active)]">{sliderValue}</span>
        </div>
        {/* AntD-style custom slider: filled track + thumb */}
        <div className="relative flex h-8 cursor-pointer items-center">
          <div className="pointer-events-none absolute h-1.5 w-full rounded-full bg-[var(--color-border)]" />
          <div
            className="pointer-events-none absolute h-1.5 rounded-full bg-[var(--color-primary)]"
            style={{ width: `${sliderValue}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(event) => {
              const next = Number(event.target.value);
              setSliderValue(next);
              playSliderDragCue();
            }}
            onPointerUp={playSliderReleaseCue}
            onPointerCancel={playSliderReleaseCue}
            onKeyUp={(event) => {
              if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
                playSliderReleaseCue();
              }
            }}
            className="absolute inset-x-0 z-20 h-8 w-full cursor-pointer opacity-0 [touch-action:none]"
            aria-label={language === "zh" ? "滑动条预览" : "Slider preview"}
          />
          <div
            className="pointer-events-none absolute z-10 h-4 w-4 rounded-full border border-[var(--color-border)] bg-white shadow-sm transition-none"
            style={{ left: `calc(${sliderValue}% - 8px)` }}
          />
        </div>
      </div>
    );
  }

  if (id === "checkbox") {
    const checkboxOptions = [
      {
        key: "option1" as const,
        label: language === "zh" ? "选项 1" : "Option 1",
        checked: checkboxValues.option1,
      },
      {
        key: "option2" as const,
        label: language === "zh" ? "选项 2" : "Option 2",
        checked: checkboxValues.option2,
      },
      {
        key: "option3" as const,
        label: language === "zh" ? "选项 3" : "Option 3",
        checked: checkboxValues.option3,
      },
    ];

    return (
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {checkboxOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            role="checkbox"
            aria-checked={option.checked}
            aria-disabled={option.disabled}
            disabled={option.disabled}
            onClick={() => {
              if (option.disabled) return;

              const next = !option.checked;
              setCheckboxValues((current) => ({
                ...current,
                [option.key]: next,
              }));
              onPlay(next ? "check" : "uncheck");
            }}
            className={[
              "flex min-h-7 items-center gap-2.5 rounded-lg px-1 text-left transition",
              option.disabled
                ? "cursor-not-allowed text-[var(--color-ink-muted)]/45"
                : "text-[var(--color-ink)] hover:-translate-y-0.5 hover:bg-white/35",
            ].join(" ")}
          >
            <span
              className={[
                "grid h-5 w-5 shrink-0 place-items-center rounded text-xs font-black transition-colors",
                option.checked
                  ? "bg-[var(--color-primary)] text-white"
                  : option.disabled
                    ? "bg-white/45 text-transparent ring-1 ring-[var(--color-border)]"
                    : "bg-white/80 text-transparent ring-1 ring-[var(--color-border-strong)]",
              ].join(" ")}
            >
              {option.checked ? "✓" : null}
            </span>
            <span className="whitespace-nowrap text-sm font-black leading-none">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (id === "switch") {
    const switches = [
      { key: "square" as const, aria: language === "zh" ? "方形开关" : "Square switch" },
      { key: "line" as const, aria: language === "zh" ? "线性开关" : "Line switch" },
    ];

    return (
      <div className="mt-4 flex items-center justify-center gap-5">
        {switches.map((item) => {
          const checked = switchValues[item.key];
          const handleToggle = () => {
            const next = !checked;
            setSwitchValues((current) => ({ ...current, [item.key]: next }));
            onPlay(next ? "toggleOn" : "toggleOff");
          };

          if (item.key === "line") {
            return (
              <button
                key={item.key}
                type="button"
                aria-pressed={checked}
                aria-label={item.aria}
                onClick={handleToggle}
                className="relative h-7 w-14 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/25"
              >
                <span
                  className={[
                    "absolute left-2 right-2 top-1/2 h-2 -translate-y-1/2 rounded-full transition-colors",
                    checked ? "bg-[var(--color-primary)]/70" : "bg-[var(--color-border-strong)]/70",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0.5 top-0.5 h-6 w-6 rounded-full border bg-white shadow-[0_3px_9px_rgba(61,52,40,0.22)] transition-transform",
                    checked ? "translate-x-7 border-[var(--color-primary-active)]" : "translate-x-0 border-white",
                  ].join(" ")}
                />
              </button>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={checked}
              aria-label={item.aria}
              onClick={handleToggle}
              className={[
                "relative overflow-hidden border transition-colors",
                "hover:shadow-[0_6px_14px_rgba(114,93,66,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/25",
                item.key === "round" ? "h-6 w-12 rounded-full" : "h-7 w-12 rounded-md",
                checked
                  ? "border-[var(--color-primary-active)] bg-[var(--color-primary)]"
                  : "border-[var(--color-border-strong)] bg-[var(--color-ink-muted)]/30",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute bg-white shadow-[0_2px_5px_rgba(61,52,40,0.18)] transition-transform",
                  item.key === "round"
                    ? "left-0.5 top-0.5 h-5 w-5 rounded-full"
                    : "left-1 top-1 h-[18px] w-[18px] rounded-sm",
                  checked ? (item.key === "round" ? "translate-x-6" : "translate-x-[22px]") : "translate-x-0",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    );
  }

  if (id === "notification") {
    const toasts: Array<{
      name: SoundName;
      icon: string;
      zh: string;
      en: string;
      accent: string;
      bg: string;
    }> = [
      {
        name: "notify",
        icon: "i",
        zh: "通知提示",
        en: "Info message",
        accent: "bg-blue-500",
        bg: "bg-blue-50/80",
      },
      {
        name: "success",
        icon: "✓",
        zh: "操作成功",
        en: "Success message",
        accent: "bg-emerald-500",
        bg: "bg-emerald-50/80",
      },
      {
        name: "error",
        icon: "✕",
        zh: "出错了",
        en: "Error message",
        accent: "bg-rose-500",
        bg: "bg-rose-50/80",
      },
    ];

    return (
      <div className="mt-4 grid gap-2">
        {toasts.map((toast) => (
          <button
            key={toast.name}
            type="button"
            onClick={() => onPlay(toast.name)}
            className={[
              "flex min-h-9 w-full items-center gap-3 rounded-lg px-3 text-left transition",
              "hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(114,93,66,0.10)] active:translate-y-0",
              toast.bg,
            ].join(" ")}
          >
            <span
              className={[
                "grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-black leading-none text-white",
                toast.accent,
              ].join(" ")}
            >
              {toast.icon}
            </span>
            <span className="min-w-0 flex-1 text-sm font-black text-[var(--color-ink)]">
              {language === "zh" ? toast.zh : toast.en}
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (id === "surface") {
    const closeSurface = () => {
      setSurfaceOpen(false);
      onPlay("close");
    };

    return (
      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            setSurfaceOpen(true);
            onPlay("open");
          }}
          className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          {language === "zh" ? "打开抽屉" : "Open drawer"}
        </button>

        {surfaceOpen && typeof document !== "undefined" && createPortal(
          <div className="fixed inset-0 z-50" role="presentation">
            <button
              type="button"
              aria-label={language === "zh" ? "关闭抽屉遮罩" : "Close drawer overlay"}
              onClick={closeSurface}
              className="absolute inset-0 cursor-default bg-[rgba(61,52,40,0.18)] backdrop-blur-[1px]"
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="surface-drawer-title"
              className="absolute bottom-0 left-0 top-0 flex w-[min(332px,calc(100vw-32px))] flex-col border-r border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-[18px_0_36px_rgba(61,52,40,0.16)] animate-in slide-in-from-left-6 duration-200"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h4 id="surface-drawer-title" className="text-base font-black text-[var(--color-ink)]">
                    {language === "zh" ? "基础信息" : "Basic Information"}
                  </h4>
                  <p className="mt-1 text-xs font-bold text-[var(--color-ink-muted)]">
                    {language === "zh" ? "设置面板" : "Settings panel"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeSurface}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[var(--color-ink)] transition-transform hover:-translate-y-0.5"
                  aria-label={language === "zh" ? "关闭抽屉" : "Close drawer"}
                >
                  <X size={14} strokeWidth={2.4} />
                </button>
              </div>

              <div className="mt-6 space-y-3 text-sm font-bold text-[var(--color-ink)]">
                <div className="rounded-xl border border-[var(--color-border)] bg-white/70 p-3">
                  {language === "zh" ? "这里是示例内容。" : "Here is an example text."}
                </div>
                <div className="rounded-xl border border-[var(--color-border)] bg-white/70 p-3">
                  {language === "zh" ? "这里是示例内容。" : "Here is an example text."}
                </div>
              </div>

            </aside>
          </div>,
          document.body,
        )}
      </div>
    );
  }

  if (id === "radio") {
    return (
      <div className="mt-4 flex gap-2">
        {["a", "b"].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setRadioValue(value);
              onPlay("radio");
            }}
            className={[
              "flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-black",
              radioValue === value ? "bg-[var(--color-primary)] text-white" : "bg-white/70 text-[var(--color-ink)]",
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
    const tabs = [
      {
        value: "a",
        label: language === "zh" ? "总览" : "Tab 1",
        content: language === "zh" ? "总览内容" : "Content of Tab Panel 1",
      },
      {
        value: "b",
        label: language === "zh" ? "详情" : "Tab 2",
        content: language === "zh" ? "详情内容" : "Content of Tab Panel 2",
      },
      {
        value: "c",
        label: language === "zh" ? "记录" : "Tab 3",
        content: language === "zh" ? "记录内容" : "Content of Tab Panel 3",
      },
    ];
    const activeContent = tabs.find((tab) => tab.value === activeTab)?.content ?? tabs[0].content;

    return (
      <div className="mt-4">
        <div
          role="tablist"
          aria-label={language === "zh" ? "标签页示例" : "Tabs example"}
          className="flex border-b border-[color-mix(in_oklch,var(--color-border-strong)_68%,transparent)]"
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-controls={`tab-panel-${tab.value}`}
              aria-selected={activeTab === tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                onPlay("tab");
              }}
              className={[
                "relative flex h-8 items-center justify-center px-4 text-sm font-black leading-none transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/20",
                activeTab === tab.value
                  ? "text-[var(--color-primary-active)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]",
              ].join(" ")}
            >
              {tab.label}
              {activeTab === tab.value && (
                <span className="absolute bottom-[-1px] left-3 right-3 h-0.5 rounded-full bg-[var(--color-primary-active)]" />
              )}
            </button>
          ))}
        </div>
        <div
          id={`tab-panel-${activeTab}`}
          role="tabpanel"
          className="mt-5 min-h-8 text-center text-sm font-bold text-[var(--color-ink-muted)]"
        >
          {activeContent}
        </div>
      </div>
    );
  }

  if (id === "collapse") {
    const collapseItems = [
      {
        name: "1",
        header: language === "zh" ? "基础信息" : "Basic information",
        content: language === "zh" ? "这里是基础信息内容。" : "Here is the basic information content.",
      },
      {
        name: "2",
        header: language === "zh" ? "账户设置" : "Account settings",
        content: language === "zh" ? "这里是账户设置内容。" : "Here is the account settings content.",
      },
      {
        name: "3",
        header: language === "zh" ? "更多选项" : "More options",
        content: language === "zh" ? "这里是更多选项内容。" : "Here is the more options content.",
      },
    ];

    return (
      <div className="mt-4 space-y-2">
        {collapseItems.map((item) => {
          const open = activeCollapse === item.name;
          return (
            <div key={item.name} className="overflow-hidden rounded-lg bg-white/55">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`collapse-panel-${item.name}`}
                onClick={() => {
                  const next = open ? null : item.name;
                  setActiveCollapse(next);
                  onPlay(next ? "open" : "close");
                }}
                className="flex min-h-9 w-full items-center justify-between gap-3 px-3 text-left text-xs font-black text-[var(--color-ink)] transition-colors hover:bg-white/70"
              >
                <span>{item.header}</span>
                <ChevronDown
                  size={15}
                  strokeWidth={2.4}
                  className={["shrink-0 transition-transform", open ? "rotate-180" : ""].join(" ")}
                />
              </button>
              {open && (
                <div
                  id={`collapse-panel-${item.name}`}
                  className="px-3 pb-3 pt-1 text-xs font-bold leading-5 text-[var(--color-ink-muted)]"
                >
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (id === "statistic") {
    const changeStatistic = (direction: "rise" | "fall") => {
      const delta = direction === "rise" ? 8.88 : -6.18;
      const next = Math.max(0.01, Number((statValue + delta).toFixed(2)));
      animateStatistic(statValue, next, setStatValue);
      onPlay("levelUp");
    };

    return (
      <div className="mt-4 flex items-end justify-between gap-4">
        <span className="flex min-w-0 items-baseline gap-1 text-2xl font-black text-emerald-600 tabular-nums">
          <span className="text-sm leading-none">{statValue >= 50.32 ? "↗" : "↘"}</span>
          {statValue.toFixed(2)}
          <span className="text-xs">%</span>
        </span>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => changeStatistic("rise")}
            className="inline-flex h-7 items-center rounded-full bg-white/70 px-3 text-xs font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5 hover:bg-white"
          >
            {language === "zh" ? "上升" : "Rise"}
          </button>
          <button
            type="button"
            onClick={() => changeStatistic("fall")}
            className="inline-flex h-7 items-center rounded-full bg-white/70 px-3 text-xs font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5 hover:bg-white"
          >
            {language === "zh" ? "下降" : "Fall"}
          </button>
        </div>
      </div>
    );
  }

  if (id === "dropdown") {
    return (
      <div className="relative mt-4">
        <button
          type="button"
          onClick={() => {
            setMenuOpen((current) => !current);
            onPlay("menuOpen");
          }}
          className="flex w-full items-center justify-between rounded-full bg-white px-3 py-1.5 text-xs font-black text-[var(--color-ink)]"
        >
          {selected}
          <span>{menuOpen ? "▲" : "▼"}</span>
        </button>
        {menuOpen && (
          <div className="absolute left-3 right-3 top-[calc(100%-6px)] z-20 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-1 shadow-[0_10px_22px_rgba(114,93,66,0.10)]">
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

  if (id === "trigger") {
    const buttonTypes: Array<{
      label: string;
      sound: SoundName;
      className: string;
      icon?: React.ReactNode;
    }> = [
      {
        label: language === "zh" ? "主按钮" : "Primary",
        sound: "click",
        className: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
      },
      {
        label: language === "zh" ? "次要按钮" : "Secondary",
        sound: "tap",
        className: "border border-[var(--color-border-strong)] bg-white/85 text-[var(--color-ink)] hover:bg-white",
      },
      {
        label: language === "zh" ? "幽灵按钮" : "Ghost",
        sound: "hover",
        className: "border border-dashed border-[var(--color-border-strong)] bg-white/30 text-[var(--color-ink)] hover:bg-white/55",
      },
      {
        label: language === "zh" ? "强调按钮" : "Emphasis",
        sound: "pop",
        icon: <Zap size={14} strokeWidth={2.2} />,
        className: "bg-white text-[var(--color-ink)] hover:bg-white/85",
      },
    ];

    return (
      <div className="mt-4 grid grid-cols-2 gap-2">
        {buttonTypes.map((button) => (
          <button
            key={button.sound}
            type="button"
            onClick={() => {
              if (button.sound === "pop") {
                setPopPressed(true);
                window.setTimeout(() => setPopPressed(false), 180);
              }
              onPlay(button.sound);
            }}
            className={[
              "flex min-h-9 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-black transition-colors",
              button.sound === "pop" && popPressed ? "scale-[1.03]" : "",
              button.className,
            ].join(" ")}
          >
            {button.icon}
            <span>{button.label}</span>
          </button>
        ))}
      </div>
    );
  }

  if (id === "click") {
    return (
      <button
        type="button"
        onClick={() => onPlay("click")}
        className="mt-4 w-full rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-black text-white transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
      >
        {language === "zh" ? "确认操作" : "Confirm"}
      </button>
    );
  }

  if (id === "tap") {
    return (
      <button
        type="button"
        onClick={() => onPlay("tap")}
        className="mt-4 flex w-full items-center justify-between py-2 text-left text-sm font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5"
      >
        <span>{language === "zh" ? "列表项目" : "List item"}</span>
        <span className="text-[var(--color-ink-muted)]">›</span>
      </button>
    );
  }

  if (id === "pop") {
    return (
      <button
        type="button"
        onClick={() => {
          setPopPressed(true);
          onPlay("pop");
          window.setTimeout(() => setPopPressed(false), 180);
        }}
        className={[
          "mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-black text-[var(--color-ink)] transition-transform",
          popPressed ? "scale-[1.03]" : "hover:scale-[1.01]",
        ].join(" ")}
      >
        {language === "zh" ? "播放" : "Play"}
      </button>
    );
  }

  if (id === "hover") {
    return (
      <div
        onMouseEnter={() => onPlay("hover")}
        className="mt-4 rounded-2xl border-2 border-dashed border-[var(--color-border-strong)] px-3 py-3 text-center text-xs font-black text-[var(--color-ink)]"
      >
        {language === "zh" ? "悬停到这里" : "Hover here"}
      </div>
    );
  }

  if (id === "unlock") {
    return (
      <button
        type="button"
        aria-pressed={unlocked}
        onClick={() => {
          setUnlocked((current) => !current);
          onPlay("unlock");
        }}
        className="mt-4 flex min-h-9 w-full items-center justify-center gap-2 rounded-full bg-white/70 px-3 text-sm font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5 hover:bg-white"
      >
        {unlocked ? <Unlock size={14} strokeWidth={2.2} /> : <Lock size={14} strokeWidth={2.2} />}
        <span>
          {unlocked ? (language === "zh" ? "已解锁" : "Unlocked") : (language === "zh" ? "权限锁定" : "Locked")}
        </span>
      </button>
    );
  }

  if (id === "message") {
    return (
      <button
        type="button"
        onClick={() => {
          onPlay("message");
        }}
        className="mt-4 flex w-full items-center gap-3 text-left"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white"><Mail size={16} strokeWidth={2.2} /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-[var(--color-ink)]">
            {language === "zh" ? "新消息" : "New message"}
          </span>
        </span>
      </button>
    );
  }

  if (id === "whoosh") {
    return (
      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            setPanelVisible((current) => !current);
            onPlay("whoosh");
          }}
          className="w-full rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-ink)]"
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
    const showTooltip = () => {
      if (!tooltipVisible) onPlay("bubble");
      setTooltipVisible(true);
    };
    const hideTooltip = () => setTooltipVisible(false);

    return (
      <div className="relative mt-4 text-center">
        <button
          type="button"
          aria-describedby={tooltipVisible ? "bubble-tooltip" : undefined}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onFocus={showTooltip}
          onBlur={hideTooltip}
          className="w-full rounded-full bg-white px-3 py-2 text-sm font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/25"
        >
          {language === "zh" ? "Hover me" : "Hover me"}
        </button>
        {tooltipVisible && (
          <div
            id="bubble-tooltip"
            role="tooltip"
            className="absolute bottom-[calc(100%+10px)] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-ink)] shadow-[0_10px_22px_rgba(114,93,66,0.12)]"
          >
            {language === "zh" ? "这是 Tooltip 内容" : "This is Tooltip content"}
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-[var(--color-border)] bg-white" />
          </div>
        )}
      </div>
    );
  }

  if (id === "coin") {
    return (
      <button
        type="button"
        onClick={() => { setCoinCount((c) => c + 1); onPlay("coin"); }}
        className="mt-4 flex w-full items-center justify-between transition-transform hover:-translate-y-0.5"
      >
        <span className="flex items-center gap-1.5 text-sm font-black text-[var(--color-ink)]"><Coins size={15} strokeWidth={2.2} /> {coinCount}</span>
        <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs font-black text-[var(--color-ink)]">
          {language === "zh" ? "领取" : "Claim"}
        </span>
      </button>
    );
  }

  if (id === "levelUp") {
    return (
      <button
        type="button"
        onClick={() => { setLevel((l) => l + 1); onPlay("levelUp"); }}
        className="mt-4 flex w-full items-center justify-between transition-transform hover:-translate-y-0.5"
      >
        <span className="text-sm font-black text-[var(--color-ink)]">
          {language === "zh" ? `等级 ${level}` : `Level ${level}`}
        </span>
        <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs font-black text-[var(--color-ink)]">
          <Star size={14} strokeWidth={2.2} />
        </span>
      </button>
    );
  }

  if (id === "chime") {
    return (
      <button
        type="button"
        onClick={() => onPlay("chime")}
        className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5"
      >
        <Music size={16} strokeWidth={2.2} /> {language === "zh" ? "轻敲风铃" : "Ring chime"}
      </button>
    );
  }

  if (id === "weather") {
    const weatherOptions: Array<{
      name: SoundName;
      label: string;
      icon: React.ReactNode;
    }> = [
      {
        name: "rain",
        label: language === "zh" ? "雨声" : "Rain",
        icon: <CloudRain size={15} strokeWidth={2.2} />,
      },
      {
        name: "wind",
        label: language === "zh" ? "风声" : "Wind",
        icon: <Wind size={15} strokeWidth={2.2} />,
      },
      {
        name: "storm",
        label: language === "zh" ? "雷雨" : "Storm",
        icon: <CloudLightning size={15} strokeWidth={2.2} />,
      },
    ];

    return (
      <div className="mt-4 grid grid-cols-3 gap-2">
        {weatherOptions.map((option) => (
          <button
            key={option.name}
            type="button"
            onClick={() => onPlay(option.name)}
            className="flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-white/70 px-2 text-xs font-black text-[var(--color-ink)] transition-transform hover:-translate-y-0.5 hover:bg-white"
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    );
  }

  if (id === "drop") {
    return (
      <button
        type="button"
        onClick={() => {
          setDropped((current) => !current);
          onPlay("drop");
        }}
        className="relative mt-4 h-12 w-full rounded-2xl border-2 border-dashed border-[var(--color-border-strong)] bg-white/60"
      >
        <span
          className={[
            "absolute left-1/2 -translate-x-1/2 transition-all",
            dropped ? "top-5" : "top-1",
          ].join(" ")}
        >
          <Leaf size={20} strokeWidth={2.2} />
        </span>
      </button>
    );
  }

  if (id === "type") {
    return (
      <input
        value={typedText}
        onChange={(event) => {
          const nextValue = event.target.value;
          const step = stepForTypedText(nextValue, typedText);
          setTypedText(nextValue);
          onPlay("type", step);
        }}
        placeholder={language === "zh" ? "输入文字..." : "Type here..."}
        className="w-full rounded-2xl bg-white/70 px-3 py-2 text-sm font-black text-[var(--color-ink)] outline-none focus:bg-white"
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
      className="sticky top-3 z-30 mx-auto mb-8 flex w-fit max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-[2rem] bg-[color-mix(in_oklch,var(--color-card)_88%,white_12%)] px-5 py-3 shadow-[0_10px_26px_rgba(114,93,66,0.10)]"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-[var(--color-ink-muted)]">
          {copy.categoryLabel}
        </span>
        <StyledSelect
          value={category}
          ariaLabel={copy.categoryLabel}
          className="min-w-28"
          variant="soft"
          options={SOUND_CATEGORIES.map((item) => ({
            value: item.value,
            label: item.label[language],
          }))}
          onChange={(value) => {
            onCategoryChange(value as SoundCategory);
          }}
        />
      </div>

      {category === "controls" && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[var(--color-ink-muted)]">
            {copy.themeLabel}
          </span>
          <StyledSelect
            value={theme}
            ariaLabel={copy.themeLabel}
            className="min-w-36"
            variant="soft"
            options={THEME_ORDER.map((themeKey) => ({
              value: themeKey,
              label: SOUND_THEMES[themeKey].label[language],
            }))}
            onChange={(value) => {
              onChange(value as SoundThemeName);
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        <label htmlFor="sound-volume" className="text-xs font-black text-[var(--color-ink-muted)]">
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
  variant = "pill",
}: {
  value: string;
  options: StyledSelectOption[];
  ariaLabel: string;
  onChange: (value: string) => void;
  align?: "left" | "right";
  className?: string;
  variant?: "pill" | "soft";
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
        className={variant === "soft"
          ? "flex h-8 w-full items-center justify-between gap-2 rounded-xl px-2 text-sm font-black text-[var(--color-ink)] outline-none transition-colors hover:bg-white/55 focus-visible:bg-white/70 focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/25"
          : [
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
          className={variant === "soft"
            ? [
                "absolute top-[calc(100%+8px)] z-50 min-w-full rounded-2xl bg-[var(--color-card)] p-1.5",
                "shadow-[0_16px_32px_rgba(114,93,66,0.14)]",
                align === "right" ? "right-0" : "left-0",
              ].join(" ")
            : [
                "absolute top-[calc(100%+8px)] z-50 min-w-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-2",
                "shadow-[0_16px_32px_rgba(114,93,66,0.14)]",
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

function SoundIcon({ id }: { id: string }) {
  const Icon = SOUND_ICONS[id];
  return Icon ? <Icon size={14} strokeWidth={2} /> : null;
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

function Footer({ language }: { language: Language }) {
  const [coffeeOpen, setCoffeeOpen] = useState(false);

  useEffect(() => {
    if (!coffeeOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCoffeeOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [coffeeOpen]);

  return (
    <footer className="mt-20 text-center text-sm font-bold text-[var(--color-ink-muted)]">
      <span>{language === "zh" ? "Build by " : "Build by "}</span>
      <a
        href="https://www.xiaohongshu.com/user/profile/63bac95100000000260062bb"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-ink-soft)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:text-[var(--color-primary-active)]"
      >
        多魚
      </a>
      <span>{language === "zh" ? "，帮到你的话可以请我" : ". If this helped, buy me a "}</span>
      <button
        type="button"
        onClick={() => setCoffeeOpen(true)}
        className="text-[var(--color-ink-soft)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:text-[var(--color-primary-active)]"
      >
        {language === "zh" ? "喝杯咖啡" : "coffee"}
      </button>

      {coffeeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={language === "zh" ? "请我喝杯咖啡" : "Buy me a coffee"}
          className="fixed inset-0 z-50 grid place-items-center bg-[rgba(61,52,40,0.32)] px-5 py-8 backdrop-blur-sm"
          onClick={() => setCoffeeOpen(false)}
        >
          <div
            className="relative max-h-full w-full max-w-sm"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setCoffeeOpen(false)}
              aria-label={language === "zh" ? "关闭喝杯咖啡弹窗" : "Close coffee dialog"}
              className="absolute -right-3 -top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-[var(--color-ink)] shadow-[0_10px_24px_rgba(61,52,40,0.18)] transition-transform hover:-translate-y-0.5"
            >
              <X size={17} strokeWidth={2.6} />
            </button>
            <img
              src={COFFEE_ALIPAY_IMAGE}
              alt={language === "zh" ? "支付宝喝杯咖啡图片" : "Alipay coffee support image"}
              className="max-h-[82vh] w-full rounded-[28px] bg-white object-contain shadow-[0_20px_48px_rgba(61,52,40,0.24)]"
            />
          </div>
        </div>
      )}
    </footer>
  );
}
