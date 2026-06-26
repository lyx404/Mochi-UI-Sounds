/**
 * Animal Island — UI sound effect library.
 * All sounds are synthesized in the browser with Web Audio API.
 * No audio files needed; copy the play function into your app.
 */

let _ctx: AudioContext | null = null;
export function getCtx(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("AudioContext only available in the browser");
  }
  if (!_ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    _ctx = new Ctor();
  }
  if (_ctx.state === "suspended") void _ctx.resume();
  return _ctx;
}

type Wave = OscillatorType;

function tone(opts: {
  freq: number;
  duration: number;
  type?: Wave;
  gain?: number;
  attack?: number;
  release?: number;
  glideTo?: number;
  delay?: number;
}) {
  const ctx = getCtx();
  const t0 = ctx.currentTime + (opts.delay ?? 0);
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.freq, t0);
  if (opts.glideTo) {
    osc.frequency.exponentialRampToValueAtTime(opts.glideTo, t0 + opts.duration);
  }
  const peak = opts.gain ?? 0.18;
  const a = opts.attack ?? 0.005;
  const r = opts.release ?? 0.08;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(peak, t0 + a);
  g.gain.linearRampToValueAtTime(peak, t0 + opts.duration - r);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + opts.duration + 0.02);
}

function noiseBurst(duration: number, gain = 0.08, lp = 2000) {
  const ctx = getCtx();
  const t0 = ctx.currentTime;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = lp;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  src.connect(filter).connect(g).connect(ctx.destination);
  src.start(t0);
  src.stop(t0 + duration);
}

/* ===== Library ===== */

export const sounds = {
  click: () => tone({ freq: 880, duration: 0.06, type: "triangle", gain: 0.2 }),

  pop: () =>
    tone({ freq: 520, glideTo: 880, duration: 0.12, type: "sine", gain: 0.22 }),

  tap: () => tone({ freq: 1200, duration: 0.04, type: "square", gain: 0.12 }),

  toggleOn: () => {
    tone({ freq: 660, duration: 0.08, type: "triangle", gain: 0.18 });
    tone({ freq: 990, duration: 0.1, type: "triangle", gain: 0.18, delay: 0.06 });
  },

  toggleOff: () => {
    tone({ freq: 660, duration: 0.08, type: "triangle", gain: 0.18 });
    tone({ freq: 440, duration: 0.1, type: "triangle", gain: 0.18, delay: 0.06 });
  },

  hover: () => tone({ freq: 1760, duration: 0.05, type: "sine", gain: 0.08 }),

  success: () => {
    tone({ freq: 523.25, duration: 0.12, type: "triangle", gain: 0.18 }); // C5
    tone({ freq: 659.25, duration: 0.12, type: "triangle", gain: 0.18, delay: 0.1 }); // E5
    tone({ freq: 783.99, duration: 0.2, type: "triangle", gain: 0.2, delay: 0.2 }); // G5
  },

  error: () => {
    tone({ freq: 220, duration: 0.14, type: "sawtooth", gain: 0.16 });
    tone({ freq: 165, duration: 0.18, type: "sawtooth", gain: 0.16, delay: 0.1 });
  },

  notify: () => {
    tone({ freq: 880, duration: 0.18, type: "sine", gain: 0.2 });
    tone({ freq: 1318.5, duration: 0.22, type: "sine", gain: 0.18, delay: 0.12 });
  },

  message: () => {
    tone({ freq: 700, glideTo: 1100, duration: 0.14, type: "triangle", gain: 0.18 });
    tone({ freq: 1100, glideTo: 1400, duration: 0.14, type: "triangle", gain: 0.16, delay: 0.1 });
  },

  coin: () => {
    tone({ freq: 988, duration: 0.07, type: "square", gain: 0.18 });
    tone({ freq: 1319, duration: 0.18, type: "square", gain: 0.18, delay: 0.07 });
  },

  levelUp: () => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) =>
      tone({ freq: f, duration: 0.14, type: "triangle", gain: 0.2, delay: i * 0.09 }),
    );
  },

  whoosh: () => noiseBurst(0.35, 0.1, 1400),

  open: () => {
    tone({ freq: 440, glideTo: 880, duration: 0.18, type: "sine", gain: 0.18 });
    noiseBurst(0.12, 0.05, 3000);
  },

  close: () =>
    tone({ freq: 880, glideTo: 330, duration: 0.18, type: "sine", gain: 0.18 }),

  unlock: () => {
    noiseBurst(0.08, 0.06, 4000);
    tone({ freq: 1318, duration: 0.16, type: "triangle", gain: 0.2, delay: 0.08 });
  },

  type: () => tone({ freq: 1400, duration: 0.025, type: "square", gain: 0.1 }),

  drop: () =>
    tone({ freq: 880, glideTo: 220, duration: 0.22, type: "triangle", gain: 0.2 }),

  bubble: () =>
    tone({ freq: 300, glideTo: 1200, duration: 0.18, type: "sine", gain: 0.18 }),

  chime: () => {
    [1046.5, 1318.5, 1568].forEach((f, i) =>
      tone({ freq: f, duration: 0.6, type: "sine", gain: 0.12, release: 0.5, delay: i * 0.04 }),
    );
  },
} as const;

export type SoundName = keyof typeof sounds;

/** Source snippet used in the "Copy code" action — single sound playable standalone. */
export function sourceFor(name: SoundName): string {
  const fn = sounds[name].toString();
  return `// Animal Island UI sound — ${name}
const ctx = new (window.AudioContext || window.webkitAudioContext)();

function tone(o) {
  const t0 = ctx.currentTime + (o.delay ?? 0);
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(o.freq, t0);
  if (o.glideTo) osc.frequency.exponentialRampToValueAtTime(o.glideTo, t0 + o.duration);
  const peak = o.gain ?? 0.18, a = o.attack ?? 0.005, r = o.release ?? 0.08;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(peak, t0 + a);
  g.gain.linearRampToValueAtTime(peak, t0 + o.duration - r);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.duration);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0); osc.stop(t0 + o.duration + 0.02);
}

function noiseBurst(duration, gain = 0.08, lp = 2000) {
  const t0 = ctx.currentTime;
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(t0); src.stop(t0 + duration);
}

export const play${name[0].toUpperCase() + name.slice(1)} = ${fn};
`;
}
