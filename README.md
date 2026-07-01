# Mochi UI Sounds

Mochi UI Sounds is a tiny Web Audio UI sound library packaged as a Codex skill.
It helps Codex add soft, playful interaction sounds to buttons, forms, menus,
toasts, modals, and other product states.

The sound module uses the browser Web Audio API. It does not ship audio files
and does not require a runtime package dependency.

## Install the Codex Skill

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

## What Gets Installed

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

## Manual Install

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

## Usage

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

## Good Interaction Patterns

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

## Local Development

Install dependencies and run the preview site:

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Repository Notes

This repository also contains a shadcn registry experiment, but the recommended
distribution path is the Codex skill:

```bash
npx skills add lyx404/Mochi-UI-Sounds --skill mochi-ui-sounds --global -y --full-depth
```
