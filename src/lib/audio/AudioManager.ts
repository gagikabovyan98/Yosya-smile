import { audioManifest, type AudioCategory, type AudioCueId } from "@/content/audio";

type ActiveSound = { source: AudioBufferSourceNode; gain: GainNode };

class AudioManager {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private categories = new Map<AudioCategory, GainNode>();
  private active = new Map<string, ActiveSound>();
  private buffers = new Map<string, AudioBuffer>();
  private music: HTMLAudioElement | null = null;
  private musicId: "musicEarly" | "musicMiddle" | "musicFinale" | null = null;
  private musicFadeFrame: number | null = null;
  private muted = false;
  private masterVolume = 0.72;

  async activate() {
    if (typeof window === "undefined") return;
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.muted ? 0 : this.masterVolume;
      this.master.connect(this.context.destination);
      (["MUSIC", "TRANSITION", "HORROR_STING", "TEXTURE", "OBJECT", "FINALE"] as AudioCategory[]).forEach((category) => {
        const gain = this.context!.createGain();
        gain.gain.value = 1;
        gain.connect(this.master!);
        this.categories.set(category, gain);
      });
    }
    if (this.context.state === "suspended") await this.context.resume();
    if (this.music?.paused) void this.music.play().catch(() => undefined);
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.context) this.master.gain.setTargetAtTime(muted ? 0 : this.masterVolume, this.context.currentTime, .04);
    if (this.music) this.music.muted = muted;
  }

  toggleMuted() { this.setMuted(!this.muted); return this.muted; }

  async play(id: AudioCueId, options: { volume?: number; loop?: boolean; key?: string } = {}) {
    await this.activate();
    const cue = audioManifest[id];
    if (!this.context || !this.master) return;
    const key = options.key ?? id;
    if (this.active.has(key)) this.stop(key, .1);
    try {
      const buffer = await this.load(cue.src);
      const source = this.context.createBufferSource();
      const gain = this.context.createGain();
      source.buffer = buffer;
      source.loop = options.loop ?? ("loop" in cue ? cue.loop : false);
      gain.gain.value = options.volume ?? cue.volume;
      source.connect(gain);
      gain.connect(this.categories.get(cue.category) ?? this.master);
      source.onended = () => this.active.delete(key);
      source.start();
      this.active.set(key, { source, gain });
    } catch {
      // The visual path remains usable if a browser cannot decode an optional format.
    }
  }

  stop(key: string, fadeSeconds = .35) {
    const sound = this.active.get(key);
    if (!sound || !this.context) return;
    const now = this.context.currentTime;
    sound.gain.gain.cancelScheduledValues(now);
    sound.gain.gain.setValueAtTime(sound.gain.gain.value, now);
    sound.gain.gain.linearRampToValueAtTime(0, now + fadeSeconds);
    sound.source.stop(now + fadeSeconds + .03);
    this.active.delete(key);
  }

  fade(key: string, volume: number, seconds: number) {
    const sound = this.active.get(key);
    if (!sound || !this.context) return;
    const now = this.context.currentTime;
    sound.gain.gain.cancelScheduledValues(now);
    sound.gain.gain.setValueAtTime(sound.gain.gain.value, now);
    sound.gain.gain.linearRampToValueAtTime(Math.max(0, volume), now + seconds);
  }

  async setMusic(id: "musicEarly" | "musicMiddle" | "musicFinale", targetVolume?: number) {
    await this.activate();
    const volume = targetVolume ?? audioManifest[id].volume;
    if (this.musicId === id && this.music) {
      this.fadeMusic(volume, 1.2);
      return;
    }
    const previous = this.music;
    const next = new Audio(audioManifest[id].src);
    next.loop = true;
    next.preload = "metadata";
    next.volume = 0;
    next.muted = this.muted;
    this.music = next;
    this.musicId = id;
    if (previous) this.fadeElement(previous, 0, 1.5, () => { previous.pause(); previous.removeAttribute("src"); previous.load(); });
    await next.play().catch(() => undefined);
    this.fadeMusic(volume, 2.2);
  }

  enterScene(scene: string) {
    if (scene === "intro" || scene === "identification" || scene === "paper") void this.setMusic("musicEarly");
    else if (scene === "framedArtwork" || scene === "detailReveal" || scene === "journey") void this.setMusic("musicMiddle");
    else if (scene === "photoReveal") void this.setMusic("musicMiddle", .075);
    else if (scene === "emptyHorror") this.duckMusic(.02, 2.2);
    else if (scene === "systemFailure") this.fadeOutMusic(2.8);
    else if (scene === "finale") void this.setMusic("musicFinale", .2);
  }

  duckMusic(volume = .04, seconds = .8) {
    this.fadeMusic(volume, seconds);
  }

  fadeOutMusic(seconds = 2.2) {
    this.fadeMusic(0, seconds);
  }

  private fadeMusic(volume: number, seconds: number) {
    if (this.music) this.fadeElement(this.music, volume, seconds);
  }

  private fadeElement(element: HTMLAudioElement, target: number, seconds: number, done?: () => void) {
    if (this.musicFadeFrame !== null && element === this.music) cancelAnimationFrame(this.musicFadeFrame);
    const start = performance.now();
    const initial = element.volume;
    const tick = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - start) / Math.max(1, seconds * 1000)));
      element.volume = initial + (target - initial) * progress;
      if (progress < 1) {
        const frame = requestAnimationFrame(tick);
        if (element === this.music) this.musicFadeFrame = frame;
      } else {
        if (element === this.music) this.musicFadeFrame = null;
        done?.();
      }
    };
    tick(start);
  }

  private async load(src: string) {
    const cached = this.buffers.get(src);
    if (cached) return cached;
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Audio unavailable: ${src}`);
    const buffer = await this.context!.decodeAudioData(await response.arrayBuffer());
    this.buffers.set(src, buffer);
    return buffer;
  }
}

export const audioManager = new AudioManager();
