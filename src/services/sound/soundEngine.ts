type Tone = {
  frequency: number;
  durationMs: number;
  delayMs?: number;
  gain?: number;
  type?: OscillatorType;
};

let audioContext: AudioContext | null = null;

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

export const soundEngine = {
  key: () =>
    playSequence([
      {
        frequency: 250,
        durationMs: 38,
        gain: 0.026,
        type: "square"
      }
    ]),
  correct: () =>
    playSequence([
      {
        frequency: 180,
        durationMs: 70,
        gain: 0.028,
        type: "triangle"
      }
    ]),
  confirm: () =>
    playSequence([
      { frequency: 440, durationMs: 80, gain: 0.032 },
      { frequency: 660, durationMs: 100, delayMs: 70, gain: 0.036 },
      { frequency: 880, durationMs: 130, delayMs: 155, gain: 0.04 }
    ]),
  record: () =>
    playSequence([
      { frequency: 660, durationMs: 90, gain: 0.025 },
      { frequency: 880, durationMs: 100, delayMs: 80, gain: 0.03 },
      { frequency: 1_100, durationMs: 150, delayMs: 170, gain: 0.034 }
    ])
};
