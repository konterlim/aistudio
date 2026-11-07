/**
 * Audio streaming utilities for Gemini Live API
 * Input: 16kHz PCM mono 16-bit little-endian
 * Output: 24kHz PCM mono 16-bit little-endian gapless scheduling
 */

export class LiveAudioPlayer {
  private outputCtx: AudioContext | null = null;
  private nextStartTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialize to comply with browser autoplay policies
  }

  public async init() {
    if (!this.outputCtx || this.outputCtx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.outputCtx = new AudioCtx({ sampleRate: 24000 });
    }
    if (this.outputCtx.state === 'suspended') {
      await this.outputCtx.resume();
    }
    this.nextStartTime = this.outputCtx.currentTime;
  }

  public playChunk(base64Audio: string) {
    if (this.isMuted) return;
    if (!this.outputCtx) return;

    try {
      const binaryString = window.atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert 16-bit PCM little-endian to Float32
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = this.outputCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.copyToChannel(float32Array, 0);

      const source = this.outputCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputCtx.destination);

      // Gapless scheduling
      const currentTime = this.outputCtx.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
      }

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;

      this.activeSources.push(source);
      source.onended = () => {
        const index = this.activeSources.indexOf(source);
        if (index !== -1) {
          this.activeSources.splice(index, 1);
        }
      };
    } catch (err) {
      console.error('Erro ao reproduzir chunk de áudio:', err);
    }
  }

  public stopAll() {
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // source may have already ended
      }
    }
    this.activeSources = [];
    if (this.outputCtx) {
      this.nextStartTime = this.outputCtx.currentTime;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  public close() {
    this.stopAll();
    if (this.outputCtx) {
      this.outputCtx.close();
      this.outputCtx = null;
    }
  }
}

export class LiveAudioRecorder {
  private inputCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private onAudioChunk: (base64Audio: string) => void;
  private isMuted: boolean = false;

  constructor(onAudioChunk: (base64Audio: string) => void) {
    this.onAudioChunk = onAudioChunk;
  }

  public async start(): Promise<void> {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.inputCtx = new AudioCtx({ sampleRate: 16000 });
    if (this.inputCtx.state === 'suspended') {
      await this.inputCtx.resume();
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 16000,
      },
    });

    this.source = this.inputCtx.createMediaStreamSource(this.mediaStream);
    // Buffer size 4096 gives approx 256ms latency chunks at 16kHz
    this.processor = this.inputCtx.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      if (this.isMuted) return;

      const inputData = e.inputBuffer.getChannelData(0);
      // Convert Float32 to 16-bit PCM
      const pcm16 = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      // Encode to binary string -> Base64
      const uint8 = new Uint8Array(pcm16.buffer);
      let binary = '';
      const len = uint8.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8[i]);
      }
      const base64 = window.btoa(binary);
      this.onAudioChunk(base64);
    };

    this.source.connect(this.processor);
    this.processor.connect(this.inputCtx.destination);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public stop() {
    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
      this.processor = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.inputCtx) {
      this.inputCtx.close();
      this.inputCtx = null;
    }
  }
}
