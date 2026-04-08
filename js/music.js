    (function() {
      const music = document.getElementById('bg-music');
      const musicBtn = document.getElementById('music-toggle');
      if (!music || !musicBtn) return;
      
      const MAX_VOL = 0.4;
      const FADE_DUR = 2000; // 2 seconds fade
      
      window.toggleMusic = function(forcePlay = false) {
        if (!music) return;
        if (forcePlay || music.paused) {
          music.muted = false;
          music.volume = 0; // Start at 0 for fade-in
          
          music.play().then(() => {
            try {
              if (music.readyState >= 1) music.currentTime = 28.5;
            } catch(e) {}
            musicBtn.classList.remove('muted');
            
            // Fade in volume safely
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
        
        // If the page has already launched, the button acts as a normal play/pause toggle
        if (!document.body.classList.contains('is-loading')) {
           window.toggleMusic();
           return;
        }

        // While still in the loader, we only toggle the visual 'muted' state 
        // to decide the preference for when the hero launching happens
        musicBtn.classList.toggle('muted');
      });
    })();
