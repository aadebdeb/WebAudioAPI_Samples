(function() {
  class WhiteNoise {
    constructor(audioCtx) {
      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.node = audioCtx.createBufferSource();
      this.node.buffer = noiseBuffer;
      this.node.loop = true;
    }

    start() {
      this.node.start(0);
    }

    stop() {
      this.node.stop();
    }

    connect(toNode) {
      return this.node.connect(toNode);
    }
  }

  class FilteredNoise extends WhiteNoise {
    constructor(audioCtx, params) {
      super(audioCtx);

      params = params || {};
      this.filter = audioCtx.createBiquadFilter();
      this.filter.type = params.type || 'lowpass';
      this.filter.frequency.value = params.frequency || 350;
      this.filter.Q.value = params.Q || 1.0;
      this.node.connect(this.filter);

    }

    connect(toNode) {
      return this.filter.connect(toNode);
    }

  }

  class BlueNoise extends FilteredNoise {
    constructor(audioCtx) {
      super(audioCtx, {
        type: 'highpass',
        frequency: 10000,
        Q: 10.0
      });
    }
  }

  window.WhiteNoise = WhiteNoise;
  window.BlueNoise = BlueNoise;
}());
