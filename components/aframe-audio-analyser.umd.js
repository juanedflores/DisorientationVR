!(function (t) {
  'function' == typeof define && define.amd ? define(t) : t();
})(function () {
  if ('undefined' == typeof AFRAME)
    throw new Error(
      'Component attempted to register before AFRAME was available.'
    );
  var t,
    e = {};
  AFRAME.registerComponent('audioanalyser', {
    schema: {
      loop: { type: 'boolean' },
      volume: { type: 'int', default: 1 },
      distance: { type: 'int', default: 8 },
      fade: { type: 'int', default: 5000 },

      buffer: { default: !1 },
      beatStartCutoff: { default: 0.8 },
      beatEndCutoff: { default: 0.75 },
      cache: { default: !1 },
      enabled: { default: !0 },
      enableBeatDetection: { default: !0 },
      enableLevels: { default: !0 },
      enableWaveform: { default: !0 },
      enableVolume: { default: !0 },
      fftSize: { default: 2048 },
      smoothingTimeConstant: { default: 0.8 },
      src: {
        parse: function (t) {
          return t.constructor !== String
            ? t
            : t.startsWith('#') || t.startsWith('.')
            ? document.querySelector(t)
            : t;
        },
      },
      unique: { default: !1 },
    },
    init: function () {
      (this.audioEl = null),
        (this.levels = null),
        (this.waveform = null),
        (this.volume = 0),
        (this.xhr = null),
        (this.beat_low = !1),
        (this.beat_mid = !1),
        (this.beat_high = !1),
        (this.beat_low_max = 20),
        (this.beat_mid_max = 20),
        (this.beat_high_max = 20),
        this.initContext();

      this.sound = new Howl({
        src: [this.data.src],
        loop: this.data.loop,
        volume: this.data.volume,
      });

      this.camera = document.getElementById('rig');
    },
    update: function (t) {
      var e = this.analyser,
        i = this.data;
      (t.fftSize === i.fftSize &&
        t.smoothingTimeConstant === i.smoothingTimeConstant) ||
        ((e.fftSize = i.fftSize),
        (e.smoothingTimeConstant = i.smoothingTimeConstant),
        (this.levels = new Uint8Array(e.frequencyBinCount)),
        (this.waveform = new Uint8Array(e.fftSize))),
        i.src && this.refreshSource();
    },
    tick: function () {
      var t = this.data;
      if (t.enabled) {
        if (
          ((t.enableLevels || t.enableVolume) &&
            this.analyser.getByteFrequencyData(this.levels),
          t.enableWaveform &&
            this.analyser.getByteTimeDomainData(this.waveform),
          t.enableVolume || t.enableBeatDetection)
        ) {
          for (var e = 0, i = 0; i < this.levels.length; i++)
            e += this.levels[i];
          this.volume = e / this.levels.length;
        }
        if (t.enableBeatDetection) {
          var n = this.beatInRange(
            1,
            350,
            this.beat_low,
            this.beat_low_max,
            'audioanalyser-beat-low'
          );
          (this.beat_low = n[0]),
            (this.beat_low_max = n[1]),
            (n = this.beatInRange(
              500,
              2e3,
              this.beat_mid,
              this.beat_mid_max,
              'audioanalyser-beat-mid'
            )),
            (this.beat_mid = n[0]),
            (this.beat_mid_max = n[1]),
            (n = this.beatInRange(
              4e3,
              1e4,
              this.beat_high,
              this.beat_high_max,
              'audioanalyser-beat-high'
            )),
            (this.beat_high = n[0]),
            (this.beat_high_max = n[1]);
        }
      }

      const objPos = this.el.object3D.position;
      const camPos = this.camera.object3D.position;
      const distance = objPos.distanceTo(camPos);

      if (!this.audioId && distance < this.data.distance) {
        this.audioId = this.sound.play();
        this.sound.fade(0, 1, this.data.fade, this.audioId);
      } else if (this.audioId && distance >= this.data.distance) {
        this.sound.fade(1, 0, this.data.fade, this.audioId);
        this.audioId = null;
      }
    },
    beatInRange: function (t, e, i, n, a) {
      var s = this.levels.length,
        o = Math.floor((t / 23600) * s),
        r = Math.floor((e / 23600) * s),
        h = this.levels.slice(o, r),
        u =
          h.reduce(function (t, e) {
            return t + e;
          }) / h.length;
      return u >= (n = Math.max(u, n)) * this.data.beatStartCutoff && 0 == i
        ? (this.el.emit(a, null, !1), [!0, n])
        : u < n * this.data.beatEndCutoff && 1 == i
        ? [!1, n]
        : [i, n];
    },
    initContext: function () {
      var t = this.data;
      this.context = new (window.webkitAudioContext || window.AudioContext)();
      var e = (this.analyser = this.context.createAnalyser());
      (this.gainNode = this.context.createGain()).connect(e),
        e.connect(this.context.destination),
        (e.fftSize = t.fftSize),
        (e.smoothingTimeConstant = t.smoothingTimeConstant),
        (this.levels = new Uint8Array(e.frequencyBinCount)),
        (this.waveform = new Uint8Array(e.fftSize));
    },
    refreshSource: function () {
      var t = this,
        e = this.data;
      e.buffer && e.src.constructor === String
        ? this.getBufferSource().then(function (e) {
            (t.source = e), t.source.connect(t.gainNode);
          })
        : ((this.source = this.getMediaSource()),
          this.source.connect(this.gainNode));
    },
    suspendContext: function () {
      this.context.suspend();
    },
    resumeContext: function () {
      this.context.resume();
    },
    fetchAudioBuffer: function (t) {
      var i = this;
      return e[t]
        ? e[t].constructor === Promise
          ? e[t]
          : Promise.resolve(e[t])
        : (this.data.cache ||
            Object.keys(e).forEach(function (t) {
              delete e[t];
            }),
          (e[t] = new Promise(function (n) {
            var a = (i.xhr = new XMLHttpRequest());
            a.open('GET', t),
              (a.responseType = 'arraybuffer'),
              a.addEventListener('load', function () {
                function s(i) {
                  (e[t] = i), n(i);
                }
                var o = i.context.decodeAudioData(a.response, s);
                o &&
                  o.constructor === Promise &&
                  o.then(s).catch(console.error);
              }),
              a.send();
          })),
          e[t]);
    },
    getBufferSource: function () {
      var t = this,
        i = this.data;
      return this.fetchAudioBuffer(i.src)
        .then(function () {
          var n = t.context.createBufferSource();
          return (
            (n.buffer = e[i.src]),
            t.el.emit('audioanalyserbuffersource', n, !1),
            n
          );
        })
        .catch(console.error);
    },
    getMediaSource:
      ((t = {}),
      function () {
        var e =
          this.data.src.constructor === String
            ? this.data.src
            : this.data.src.src;
        if (t[e]) return t[e];
        this.data.src.constructor === String
          ? ((this.audio = document.createElement('audio')),
            (this.audio.crossOrigin = 'anonymous'),
            this.audio.setAttribute('src', this.data.src))
          : (this.audio = this.data.src);
        var i = this.context.createMediaElementSource(this.audio);
        return (t[e] = i), i;
      }),
  });
});
//# sourceMappingURL=aframe-audio-analyser.umd.js.map
