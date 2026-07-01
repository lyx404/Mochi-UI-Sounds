# Mochi UI Sounds

[中文](#中文) | [English](#english)

## 中文

Mochi UI Sounds 是一个轻量的 Web Audio UI 音效库，并打包成了 Codex
skill。安装后，你可以让 Codex 把柔软、轻快的交互音效接入按钮、表单、菜单、
提示、弹窗和其他产品状态。

音效模块直接使用浏览器 Web Audio API，不包含音频文件，也不需要额外的运行时
npm 依赖。

### 安装 Codex Skill

从 GitHub 安装：

```bash
npx skills add lyx404/Mochi-UI-Sounds --skill mochi-ui-sounds --global -y --full-depth
```

安装完成后，重启 Codex，让新的 skill 生效。

然后你可以对 Codex 说：

```text
Use $mochi-ui-sounds to add playful UI interaction sounds to this app.
```

Codex 会把内置的 `sounds.ts` 模块安装到你的项目中，并根据项目里的交互场景
接入合适的音效。

如果安装器提示：

```text
PromptScript does not support global skill installation
```

使用 Codex 时可以忽略。只要下面的命令能看到 `mochi-ui-sounds`，就说明
skill 已经可用：

```bash
npx skills list --global
```

### 安装后包含什么

skill 目录结构：

```text
skills/mochi-ui-sounds/
├── SKILL.md
├── agents/openai.yaml
├── assets/sounds.ts
└── scripts/install_mochi_sounds.py
```

默认情况下，安装脚本会把音效模块复制到目标项目的：

```text
src/lib/sounds.ts
```

### 手动安装

如果你想手动复制音效模块，可以在已安装的 skill 目录中运行：

```bash
python3 scripts/install_mochi_sounds.py --project /path/to/your-project
```

指定自定义目标路径：

```bash
python3 scripts/install_mochi_sounds.py \
  --project /path/to/your-project \
  --target app/lib/sounds.ts
```

只有在确认要替换已有文件时，才使用 `--overwrite`：

```bash
python3 scripts/install_mochi_sounds.py --project /path/to/your-project --overwrite
```

### 使用方式

在应用中导入音效主题：

```ts
import { setSoundVolume, soundThemes } from "@/lib/sounds";
```

设置音量：

```ts
setSoundVolume(0.8);
```

在用户交互中播放音效：

```tsx
<button onClick={() => soundThemes.softFeedback.play("click")}>
  Save
</button>
```

切换不同音色：

```ts
soundThemes.softFeedback.play("success");
soundThemes.pixel.play("select");
soundThemes.clearChime.play("notify");
```

常用音效名称：

```text
click, tap, pop, hover, toggleOn, toggleOff, success, error, notify,
message, open, close, unlock, type, slider, snap, check, uncheck,
radio, tab, menuOpen, select, coin, levelUp, bubble, chime, drop,
rain, wind, storm
```

输入音效可以传入变化的 step 值：

```ts
soundThemes.softFeedback.play("type", index % 8);
```

### 适合接入的交互

建议只在用户手势或有意义的状态变化后播放音效。

适合添加音效的地方：

- 主按钮点击
- 开关状态切换
- 复选框和单选项选择
- 标签页和菜单切换
- 弹窗或抽屉打开/关闭
- 成功和错误反馈
- 奖励、升级、进度完成
- 偏 playful 的输入轻响

避免：

- 页面加载时自动播放
- 后台轮询时反复播放
- 在高密度效率工具里加入过强音效
- 每次 render 或被动状态更新都播放声音

### 本地开发

安装依赖并启动预览站点：

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

### 仓库说明

这个仓库里也保留了 shadcn registry 实验，但推荐的分发方式是 Codex skill：

```bash
npx skills add lyx404/Mochi-UI-Sounds --skill mochi-ui-sounds --global -y --full-depth
```

## English

Mochi UI Sounds is a tiny Web Audio UI sound library packaged as a Codex skill.
It helps Codex add soft, playful interaction sounds to buttons, forms, menus,
toasts, modals, and other product states.

The sound module uses the browser Web Audio API. It does not ship audio files
and does not require a runtime package dependency.

### Install the Codex Skill

Install from GitHub:

```bash
npx skills add lyx404/Mochi-UI-Sounds --skill mochi-ui-sounds --global -y --full-depth
```

Restart Codex after installation so the new skill is picked up.

Then ask Codex:

```text
Use $mochi-ui-sounds to add playful UI interaction sounds to this app.
```

Codex will install the bundled `sounds.ts` module into your project and wire it
into appropriate interactions.

If the installer reports:

```text
PromptScript does not support global skill installation
```

you can ignore it when using Codex. The skill is available as long as this
command lists `mochi-ui-sounds`:

```bash
npx skills list --global
```

### What Gets Installed

The skill includes:

```text
skills/mochi-ui-sounds/
├── SKILL.md
├── agents/openai.yaml
├── assets/sounds.ts
└── scripts/install_mochi_sounds.py
```

By default, the installer copies the sound module to:

```text
src/lib/sounds.ts
```

### Manual Install

If you want to copy the sound module yourself, run this from the installed skill
directory:

```bash
python3 scripts/install_mochi_sounds.py --project /path/to/your-project
```

Use a custom target path:

```bash
python3 scripts/install_mochi_sounds.py \
  --project /path/to/your-project \
  --target app/lib/sounds.ts
```

Overwrite an existing file only when intentional:

```bash
python3 scripts/install_mochi_sounds.py --project /path/to/your-project --overwrite
```

### Usage

Import the sound theme in your app:

```ts
import { setSoundVolume, soundThemes } from "@/lib/sounds";
```

Set volume:

```ts
setSoundVolume(0.8);
```

Play a sound from a user interaction:

```tsx
<button onClick={() => soundThemes.softFeedback.play("click")}>
  Save
</button>
```

Use different themes:

```ts
soundThemes.softFeedback.play("success");
soundThemes.pixel.play("select");
soundThemes.clearChime.play("notify");
```

Common sound names:

```text
click, tap, pop, hover, toggleOn, toggleOff, success, error, notify,
message, open, close, unlock, type, slider, snap, check, uncheck,
radio, tab, menuOpen, select, coin, levelUp, bubble, chime, drop,
rain, wind, storm
```

For typing sounds, pass a changing step value:

```ts
soundThemes.softFeedback.play("type", index % 8);
```

### Good Interaction Patterns

Use sounds sparingly and only after user gestures or meaningful state changes.

Good places to add sound:

- Primary button clicks
- Toggle on/off changes
- Checkbox and radio selection
- Tab and menu changes
- Modal or drawer open/close
- Success and error feedback
- Reward, level-up, or progress moments
- Lightweight typing ticks in playful interfaces

Avoid:

- Autoplay on page load
- Repeating sounds during background polling
- Loud feedback in dense productivity tools
- Playing sounds for every render or passive state update

### Local Development

Install dependencies and run the preview site:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

### Repository Notes

This repository also contains a shadcn registry experiment, but the recommended
distribution path is the Codex skill:

```bash
npx skills add lyx404/Mochi-UI-Sounds --skill mochi-ui-sounds --global -y --full-depth
```
