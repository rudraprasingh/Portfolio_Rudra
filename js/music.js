    (function() {
      const music = document.getElementById('bg-music');
      const musicBtn = document.getElementById('music-toggle');
      if (!music || !musicBtn) return;
      
      const MAX_VOL = 0.65;
      const FADE_DUR = 2000;
      
      let audioCtx = null;
      let source = null;
      let distortion = null;
      let filter = null;
      let gainNode = null;
      let glitchInterval = null;

      function initAudioContext() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        source = audioCtx.createMediaElementSource(music);
        
         distortion = audioCtx.createWaveShaper();
        distortion.curve = makeDistortionCurve(0);
        distortion.oversample = '4x';

        filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 22000;

        gainNode = audioCtx.createGain();
        gainNode.gain.value = 1;

        source.connect(distortion);
        distortion.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
      }

      function makeDistortionCurve(amount) {
        let k = typeof amount === 'number' ? amount : 50,
          n_samples = 44100,
          curve = new Float32Array(n_samples),
          deg = Math.PI / 180,
          i = 0,
          x;
        for (; i < n_samples; ++i) {
          x = i * 2 / n_samples - 1;
          curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
      }

      window.toggleExpertAudio = function(isActive) {
        if (!audioCtx) initAudioContext();
        if (glitchInterval) clearInterval(glitchInterval);

        if (isActive) {
          // Minimal distortion
          distortion.curve = makeDistortionCurve(30);
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(400, audioCtx.currentTime);
          
          // Further volume reduction for Expert Mode
          // Dropping to 0.3 gain to ensure it's not overpowering
          gainNode.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 1.0);
          
          // Very rare subtle glitching
          glitchInterval = setInterval(() => {
            if (Math.random() > 0.96) {
              filter.frequency.exponentialRampToValueAtTime(Math.random() * 2000 + 400, audioCtx.currentTime + 0.1);
              // Brief volume dip for stutter, recovering back to 0.3
              gainNode.gain.setValueAtTime(Math.random() * 0.1 + 0.15, audioCtx.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.15);
            }
          }, 400);
        } else {
          // Restore clean audio
          distortion.curve = makeDistortionCurve(0);
          filter.type = 'lowpass';
          filter.frequency.exponentialRampToValueAtTime(22000, audioCtx.currentTime + 0.5);
          // Restore full gain for normal mode
          gainNode.gain.exponentialRampToValueAtTime(1.0, audioCtx.currentTime + 0.5);
          if (glitchInterval) {
            clearInterval(glitchInterval);
            glitchInterval = null;
          }
        }
      };
      
      window.toggleMusic = function(forcePlay = false) {
        if (!music) return;
        
        if (forcePlay || music.paused) {
          if (!audioCtx) initAudioContext();
          if (audioCtx.state === 'suspended') audioCtx.resume();

          music.muted = false;
          music.volume = 0;
          
          music.play().then(() => {
            try {
              if (music.readyState >= 1) music.currentTime = 28.5;
            } catch(e) {}
            musicBtn.classList.remove('muted');
            
            let startNow = null;
            function fadeIn(now) {
              if (!startNow) startNow = now;
              let elapsed = now - startNow;
              let pct = Math.max(0, Math.min(elapsed / FADE_DUR, 1));
              music.volume = pct * MAX_VOL;
              if (pct < 1) requestAnimationFrame(fadeIn);
            }
            requestAnimationFrame(fadeIn);
          }).catch(e => {
            console.error('Audio playback error:', e);
          });
        } else {
          music.pause();
          musicBtn.classList.add('muted');
        }
      };

      musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!document.body.classList.contains('is-loading')) {
           window.toggleMusic();
           return;
        }
        musicBtn.classList.toggle('muted');
      });
    })();
