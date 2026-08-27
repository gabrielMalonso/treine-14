import pililiUrl from "@/assets/sounds/pilili.mp3";
import teclaUrl from "@/assets/sounds/tecla.mp3";

type Tone = {
  frequency: number;
  durationMs: number;
  delayMs?: number;
  gain?: number;
  type?: OscillatorType;
};

let audioContext: AudioContext | null = null;
const sampleBuffers = new Map<string, Promise<AudioBuffer | null>>();

function getContext(): AudioContext | null {
  const AudioContextConstructor =
    window.AudioContext ??
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  audioContext ??= new AudioContextConstructor();
  void loadSample(teclaUrl);
  void loadSample(pililiUrl);
  return audioContext;
}

async function ensureRunning(context: AudioContext): Promise<void> {
  if (context.state === "suspended") {
    await context.resume();
  }
}

function scheduleTone(context: AudioContext, tone: Tone): void {
  const start = context.currentTime + (tone.delayMs ?? 0) / 1_000;
  const end = start + tone.durationMs / 1_000;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = tone.type ?? "sine";
  oscillator.frequency.setValueAtTime(tone.frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(tone.gain ?? 0.035, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.01);
}

async function playSequence(tones: Tone[]): Promise<void> {
  const context = getContext();
  if (!context) {
    return;
  }

  try {
    await ensureRunning(context);
    tones.forEach((tone) => scheduleTone(context, tone));
  } catch {
    // Áudio é aprimoramento; falhas do navegador não interrompem o jogo.
  }
}

function loadSample(url: string): Promise<AudioBuffer | null> {
  const cached = sampleBuffers.get(url);
  if (cached) {
    return cached;
  }

  const pending = (async () => {
    const context = getContext();
    if (!context) {
      return null;
    }

    try {
      const response = await fetch(url);
      const data = await response.arrayBuffer();
      return await context.decodeAudioData(data);
    } catch {
      return null;
    }
  })();

  sampleBuffers.set(url, pending);
  return pending;
}

async function playSample(url: string, fallback: Tone[]): Promise<void> {
  const context = getContext();
  if (!context) {
    return;
  }

  try {
    await ensureRunning(context);
    const buffer = await loadSample(url);
    if (!buffer) {
      await playSequence(fallback);
      return;
    }

    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(0.85, context.currentTime);
    source.connect(gain);
    gain.connect(context.destination);
    source.start();
  } catch {
    await playSequence(fallback);
  }
}

const keyFallback: Tone[] = [{ frequency: 250, durationMs: 38, gain: 0.026, type: "square" }];
const confirmFallback: Tone[] = [
  { frequency: 2_200, durationMs: 110, gain: 0.05, type: "sine" },
  { frequency: 2_200, durationMs: 110, delayMs: 150, gain: 0.05, type: "sine" },
  { frequency: 2_200, durationMs: 110, delayMs: 300, gain: 0.05, type: "sine" },
  { frequency: 2_200, durationMs: 180, delayMs: 450, gain: 0.055, type: "sine" }
];

export const soundEngine = {
  key: () => playSample(teclaUrl, keyFallback),
  correct: () => playSample(teclaUrl, keyFallback),
  confirm: () => playSample(pililiUrl, confirmFallback),
  record: () =>
    playSequence([
      { frequency: 660, durationMs: 90, gain: 0.025 },
      { frequency: 880, durationMs: 100, delayMs: 80, gain: 0.03 },
      { frequency: 1_100, durationMs: 150, delayMs: 170, gain: 0.034 }
    ])
};
