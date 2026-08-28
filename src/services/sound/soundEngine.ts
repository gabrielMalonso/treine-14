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

function playQueuedSquareTone(
  context: AudioContext,
  output: AudioNode,
  frequency: number,
  durationMs: number
): Promise<void> {
  return new Promise((resolve) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + 0.002;
    const end = start + durationMs / 1_000;
    const envelope = Math.min(0.008, Math.max(0.001, durationMs / 4_000));

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(1, start + envelope);
    gain.gain.setValueAtTime(1, Math.max(start + envelope, end - envelope));
    gain.gain.linearRampToValueAtTime(0, end);

    oscillator.connect(gain);
    gain.connect(output);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
      resolve();
    };
    oscillator.start(start);
    oscillator.stop(end);
  });
}

async function playConfirm(): Promise<void> {
  const context = getContext();
  if (!context) {
    return;
  }

  const output = context.createGain();
  output.gain.value = 0.2;
  output.connect(context.destination);

  try {
    await ensureRunning(context);
    const frequencies = Array.from({ length: 5 }, () => [2_300, 2_200]).flat();
    for (const frequency of frequencies) {
      await playQueuedSquareTone(context, output, frequency, 100);
    }
  } finally {
    output.disconnect();
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

export const soundEngine = {
  key: () => playSample(teclaUrl, keyFallback),
  correct: () => playSample(teclaUrl, keyFallback),
  confirm: playConfirm,
  record: () =>
    playSequence([
      { frequency: 660, durationMs: 90, gain: 0.025 },
      { frequency: 880, durationMs: 100, delayMs: 80, gain: 0.03 },
      { frequency: 1_100, durationMs: 150, delayMs: 170, gain: 0.034 }
    ])
};
