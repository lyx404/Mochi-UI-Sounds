---
name: mochi-ui-sounds
description: Install and integrate the Mochi UI Sounds Web Audio library into frontend projects. Use when a user asks to add playful UI interaction sounds, install Mochi sounds, wire sound feedback into buttons/forms/navigation/toasts, or copy this UI sound library into an app without relying on shadcn/npm registry installation.
---

# Mochi UI Sounds

## Overview

Use this skill to add a small browser-only Web Audio sound module to a frontend app and wire it into meaningful user interactions. The bundled library has no audio files and no runtime package dependencies.

## Quick Install

Run the installer from the skill directory:

```bash
python3 scripts/install_mochi_sounds.py --project <project-root>
```

Default output:

```text
<project-root>/src/lib/sounds.ts
```

Use `--target` when the project uses a different structure:

```bash
python3 scripts/install_mochi_sounds.py --project <project-root> --target app/lib/sounds.ts
```

The script refuses to overwrite an existing file unless `--overwrite` is passed.

## Integration Workflow

1. Inspect the target project briefly: framework, source root, alias conventions, and existing sound/interaction patterns.
2. Install `assets/sounds.ts` with the script. Prefer `src/lib/sounds.ts` for Vite, Next, TanStack Start, and similar React projects unless local conventions point elsewhere.
3. Import only what the interaction needs:

```ts
import { soundThemes, setSoundVolume } from "@/lib/sounds";
```

4. Play sounds only from user gestures or state changes. Do not autoplay on page load.
5. Keep sound feedback subtle: clicks, toggles, tab switches, dropdown opens, form checks, success/error notifications, modal open/close, reward/progress events, and typing ticks.
6. Respect product context. Operational tools should use sparse cues; playful apps can use richer cues.

## API

Core exports:

```ts
setSoundVolume(0.8);
soundThemes.softFeedback.play("click");
soundThemes.pixel.play("select");
soundThemes.clearChime.play("success");
```

Useful sound names:

```text
click, tap, pop, hover, toggleOn, toggleOff, success, error, notify,
message, open, close, unlock, type, slider, snap, check, uncheck,
radio, tab, menuOpen, select, coin, levelUp, bubble, chime, drop,
rain, wind, storm
```

For typing sounds, pass a step:

```ts
soundThemes.softFeedback.play("type", index % 8);
```

## Wiring Patterns

Buttons:

```tsx
<button onClick={() => soundThemes.softFeedback.play("click")}>
  Save
</button>
```

Toggle:

```ts
soundThemes.softFeedback.play(nextChecked ? "toggleOn" : "toggleOff");
```

Toast:

```ts
soundThemes.clearChime.play(result.ok ? "success" : "error");
```

Modal or drawer:

```ts
soundThemes.softFeedback.play(open ? "open" : "close");
```

## Validation

After integration, run the project typecheck/build if available. In the browser, verify sounds only play after a user gesture, volume can be adjusted with `setSoundVolume`, and no SSR path touches `AudioContext` before the browser.
