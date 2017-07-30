(function() {
  class VisualizerBase {
    constructor(audioCtx, params) {
      params = params || {};
      this.audioCtx = audioCtx;
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = params.fftSize || 2048;
      this.canvas = params.canvas || document.createElement('canvas');
      this.canvasCtx = this.canvas.getContext('2d');
      this.requestId = null;
      this.renderBackground();
    }

    setAudioNode(node) {
      node.connect(this.analyser);
    }

    getCanvasElement() {
      return this.canvas;
    }

    start() {
      const that = this;
      (function _render() {
        that.requestId = window.requestAnimationFrame(_render);
        that.render();
      }());
    }

    stop() {
      window.requestAnimationFrame(this.requestId);
    }

    render() {

    }

    renderBackground() {
      this.canvasCtx.fillStyle = 'rgba(0, 0, 0, 1)';
      this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderLine(vertices, options) {
      options = options || {};

      this.canvasCtx.beginPath();
      vertices.forEach((v, i) => {
        if (i === 0) {
          this.canvasCtx.moveTo(v.x, v.y);
        } else {
          this.canvasCtx.lineTo(v.x, v.y);
        }
      });

      this.canvasCtx.strokeStyle = options.strokeStyle || 'rgba(255, 160, 90, 1)';
      this.canvasCtx.lineWidth = options.lineWidth || 1;
      this.canvasCtx.lineCap = options.lineCap || 'round';
      this.canvasCtx.lineJoin = options.lineJoin || 'miter';
      this.canvasCtx.stroke();
    }
  }

  class WaveVisualizer extends VisualizerBase {
    render() {
      this.renderBackground();

      const times = new Uint8Array(this.analyser.fftSize);
      this.analyser.getByteTimeDomainData(times);

      const vertices = [];
      for (let i = 0, len = times.length; i < len; i++) {
        const x = (i / len) * this.canvas.width;
        const y = (1 - times[i] / 255) * this.canvas.height;
        vertices.push({x: x, y: y});
      }

      this.renderLine(vertices);
    }
  }
  window.WaveVisualizer = WaveVisualizer;


  class SpectrumVisualizer extends VisualizerBase {
    render() {
      this.renderBackground();

      const spectrums = new Uint8Array(this.analyser.frequencyBinCount);
      this.analyser.getByteFrequencyData(spectrums);

      const vertices = [];
      for (let i = 0, len = spectrums.length; i < len; i++) {
        const x = (i / len) * this.canvas.width;
        const y = (1 - (spectrums[i] / 255)) * this.canvas.height;
        vertices.push({x: x, y: y});
      }
      this.renderLine(vertices);
    }
  }
  window.SpectrumVisualizer = SpectrumVisualizer;

}());
