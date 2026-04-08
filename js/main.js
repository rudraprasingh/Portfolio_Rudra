    // ── Restore scroll position ──
    if (history.scrollRestoration) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    // ── Lenis ──
    const lenis = new Lenis({
      lerp: 0.05,  // iOS-like buttery smooth inertia
      wheelMultiplier: 1, 
      touchMultiplier: 1.25,
      infinite: false,
      smoothWheel: !isMobile,         // Native scroll on touch = no Lenis overhead
      syncTouch: isMobile,            // Sync touch events on mobile only
      gestureOrientation: 'vertical', // Explicit — prevent horizontal intercept
    });
    
    // ── Auto-scroll performance flag (shared with skew guard) ──
    let isAutoScrolling = false;

    lenis.scrollTo(0, { immediate: true });
    lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);
    
    // 120fps ticker
    gsap.ticker.fps(120);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    // 500ms lag smoothing prevents jank on low-end devices (0 = no smoothing = jank)
    gsap.ticker.lagSmoothing(500, 33);

    // ── Scroll Progress (RAF-batched to avoid layout thrashing) ──
    let _rafProgress = false;
    const _progressBar = document.getElementById('progress-bar');
    lenis.on('scroll', ({ progress }) => {
      if (!_rafProgress) {
        _rafProgress = true;
        requestAnimationFrame(() => {
          _progressBar.style.transform = `scaleX(${progress})`;
          _rafProgress = false;
        });
      }
    });

    // ── Hamburger / Mobile Menu ──
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mmLinks = document.querySelectorAll('.mm-link');

    function openMenu() {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
      // Use lenis.stop() instead of overflow:hidden — avoids iOS scroll bugs
      lenis.stop();
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      lenis.start();
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      if (hamburger.classList.contains('open')) { closeMenu(); } 
      else { openMenu(); }
    });

    mmLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });

    // ── Custom Ink Cursor (desktop only) ──
    if (!isMobile) {
      const cur = document.getElementById('cursor');
      let tx = 0, ty = 0;
      let cx = 0, cy = 0;
      let cursorActive = false;

      let idleTimer;
      const hideCursor = () => cur.classList.add('is-idle');
      const showCursor = () => {
        if (cur.classList.contains('is-idle')) {
          cx = tx; cy = ty;
          cur.style.transform = `translate(${cx}px, ${cy}px)`;
        }
        cur.classList.remove('is-idle');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(hideCursor, 800); 
      };

      window.addEventListener('mousemove', e => {
        tx = e.clientX;
        ty = e.clientY;
        cursorActive = true;
        showCursor();
      }, { passive: true });

      lenis.on('scroll', hideCursor);
      lenis.on('scrollEnd', () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(hideCursor, 250);
      });

      // Click Feedback (Ink Splat)
      window.addEventListener('click', e => {
        const s = document.createElement('div');
        s.className = 'ink-splat';
        const sz = 20 + Math.random() * 40;
        s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${sz}px;height:${sz}px`;
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 700);
      });

      // Reactive States
      window.addEventListener('mouseover', e => {
        showCursor();
        const el = e.target.closest('a, button, .work-card, .srv-row, .stat-num, input, textarea, p, .about-body');
        if (!el) {
          cur.classList.remove('expanded', 'link', 'text-mode');
          return;
        }
        if (el.matches('a, button, .work-card, .srv-row, .stat-num')) cur.classList.add('expanded');
        else cur.classList.remove('expanded');
        if (el.matches('input, textarea, p, .about-body')) cur.classList.add('text-mode');
        else cur.classList.remove('text-mode');
        if (el.matches('a, button')) cur.classList.add('link');
        else cur.classList.remove('link');
      }, { passive: true });

      // Smooth Animation Loop — skip when page hidden to save battery
      let lastTs = 0;
      function loopCursor(ts) {
        if (!document.hidden) {
          const dt = Math.min((ts - lastTs) / 16.67, 3); // Delta time for frame-rate independence
          const lerp = 1 - Math.pow(1 - 0.16, dt);      // Subtler, creamier lerp for high-end feel
          cx += (tx - cx) * lerp;
          cy += (ty - cy) * lerp;
          cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; 
        }
        lastTs = ts;
        requestAnimationFrame(loopCursor);
      }
      requestAnimationFrame(loopCursor);
    }

    // ── Expert Mode Cheat Code ──
    const expertCode = ['r', 'u', 'd', 'r', 'a'];
    let expIdx = 0;
    
    function playExpertTransition() {
      const isExiting = document.body.classList.contains('expert-mode');
      
      if (!isExiting) {
        // ── ENTRANCE: Hacker Matrix (Normal -> Expert) ──
        const bs = document.createElement('div');
        bs.id = "expert-transition";
        bs.style.cssText = "position:fixed;inset:0;background:#000;z-index:999999;display:flex;align-items:center;justify-content:center;overflow:hidden;pointer-events:none;opacity:0;";
        
        const canvas = document.createElement("canvas");
        canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0.3;z-index:1;";
        bs.appendChild(canvas);
        document.body.appendChild(bs);
        
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~".split("");
        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops = Array(columns).fill(0).map(() => Math.random() * -100);

        const matrixInterval = setInterval(() => {
          ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#00ff41"; 
          ctx.font = fontSize + "px 'DM Mono'";
          for (let i = 0; i < drops.length; i++) {
            if (drops[i] > 0) {
              const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
              ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            }
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
          }
        }, 33);

        const tl = gsap.timeline({ onComplete: () => { clearInterval(matrixInterval); bs.remove(); } });
        tl.to(bs, { opacity: 1, duration: 0.35, ease: "power2.out" });
        tl.to(bs, {
          backgroundColor: "#fff",
          scaleY: 0.005,
          duration: 0.35,
          ease: "power3.inOut",
          delay: 0.8,
          onStart: () => { 
            document.body.classList.add('expert-mode'); 
            if (window.toggleExpertAudio) window.toggleExpertAudio(true);
            canvas.style.display = "none"; 
          }
        });
        tl.to(bs, { scaleX: 0, opacity: 0, duration: 0.45, ease: "power4.in" });

      } else {
        // ── EXIT: Smooth Black Frosted Reveal (Expert -> Normal) ──
        const bs = document.createElement('div');
        bs.style.cssText = "position:fixed;inset:0;z-index:999999;display:flex;pointer-events:none;";
        document.body.appendChild(bs);
        
        // Multi-layer masking: Frosted Columns + A Blackout Under-layer
        const mask = document.createElement('div');
        mask.style.cssText = "position:absolute;inset:0;background:#000;opacity:0;z-index:-1;";
        bs.appendChild(mask);

        const count = 10;
        const columns = [];
        for (let i = 0; i < count; i++) {
          const col = document.createElement('div');
          // Removed explicit backdrop filter for performance during grid animations
          col.style.cssText = "flex:1;height:100%;background:rgba(0,0,0,0.95);border-right:1px solid rgba(255,255,255,0.05);transform:scaleY(0);transform-origin:top;";
          bs.appendChild(col);
          columns.push(col);
        }

        const tl = gsap.timeline({ onComplete: () => bs.remove() });

        // Phase 1: Staggered columns enter
        tl.to(columns, { 
          scaleY: 1, 
          duration: 0.8, 
          stagger: 0.05, 
          ease: "expo.inOut" 
        });
        
        // Phase 2: Fade in the blackout mask to cover the jump
        tl.to(mask, { opacity: 1, duration: 0.3 }, "-=0.4");
        
        // Phase 3: Toggle theme hidden behind the mask
        tl.add(() => {
          document.body.classList.remove('expert-mode');
          if (window.toggleExpertAudio) window.toggleExpertAudio(false);
        });

        // Phase 4: Smoothly fade the mask away while columns are still present
        tl.to(mask, { opacity: 0, duration: 1.2, ease: "power2.inOut" }, "+=0.1");

        // Phase 5: Staggered exit
        tl.to(columns, { 
          scaleY: 0, 
          transformOrigin: "bottom", 
          duration: 0.8, 
          stagger: 0.05, 
          ease: "expo.inOut"
        }, "-=1.0"); // Overlap with mask fade for that "gliding" feel
      }
    }
    
    window.addEventListener('keydown', e => {
      // Ignore if modified keys are pressed or if user is interacting with an input
      if (!e.key || e.ctrlKey || e.altKey || e.metaKey || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      
      if (e.key.toLowerCase() === expertCode[expIdx]) {
        expIdx++;
        if (expIdx === expertCode.length) {
          playExpertTransition();
          expIdx = 0;
        }
      } else {
        expIdx = 0;
      }
    });

    // ── Konami Code (Easter Egg) ──
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let kIdx = 0;
    const eMod = document.getElementById('ee');
    const closeEE = () => {
      eMod.classList.remove('active');
      window.removeEventListener('mousemove', closeEE);
      window.removeEventListener('touchmove', closeEE);
      if (typeof lenis !== 'undefined') lenis.off('scroll', closeEE);
    };

    window.addEventListener('keydown', e => {
      // Easter egg close
      if (e.key === 'Escape' && eMod.classList.contains('active')) { 
        closeEE();
        return; 
      }
      // Konami sequence
      if (!eMod.classList.contains('active')) {
        const expectedKey = konami[kIdx];
        const pressedKey = e.key;

        // Compare case-insensitively for letters, exactly for arrows
        const isMatch = (expectedKey.length > 1) 
          ? (pressedKey === expectedKey) // Arrows
          : (pressedKey.toLowerCase() === expectedKey.toLowerCase()); // B, A

        if (isMatch) {
          kIdx++;
          if (kIdx === konami.length) { 
            eMod.classList.add('active'); 
            kIdx = 0; 
            // Add listeners to close on movement after 800ms grace period
            setTimeout(() => {
              window.addEventListener('mousemove', closeEE, { passive: true });
              window.addEventListener('touchmove', closeEE, { passive: true });
              if (typeof lenis !== 'undefined') lenis.on('scroll', closeEE);
            }, 800);
          }
        } else kIdx = 0;
      }
    });

    // Mobile Easter Egg Trigger (5 rapid taps on the Brand Logo)
    let tapCount = 0;
    let tapTimer;
    const blNode = document.getElementById('bl');
    if (blNode) {
      blNode.addEventListener('touchstart', (e) => {
        if (eMod.classList.contains('active')) return;
        tapCount++;
        clearTimeout(tapTimer);
        if (tapCount >= 5) {
          tapCount = 0;
          eMod.classList.add('active');
          setTimeout(() => {
            window.addEventListener('touchmove', closeEE, { passive: true });
            if (typeof lenis !== 'undefined') lenis.on('scroll', closeEE);
          }, 800);
        } else {
          tapTimer = setTimeout(() => { tapCount = 0; }, 450);
        }
      }, { passive: true });
    }

    // Mobile Expert Mode Trigger (5 rapid taps on the Hero Title)
    let expertTapCount = 0;
    let expertTapTimer;
    const heroTitleNode = document.querySelector('#t1 h1');
    if (heroTitleNode) {
      heroTitleNode.addEventListener('touchstart', (e) => {
        expertTapCount++;
        clearTimeout(expertTapTimer);
        if (expertTapCount >= 5) {
          expertTapCount = 0;
          playExpertTransition();
        } else {
          // Slightly increased timer for mobile reliability (600ms)
          expertTapTimer = setTimeout(() => { expertTapCount = 0; }, 600);
        }
      }, { passive: true });
    }

    // ── Canvas ──
    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let FRAMES = 98, ok = 0, bad = 0;
    const imgs = [];
    const loader = document.getElementById('loader');
    const lPct = document.getElementById('l-pct');
    const lFill = document.getElementById('l-fill');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function scrambleEffect(el, duration = 1.4) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ/*-+_&';
      const original = el.innerText;
      let frame = 0, maxFrames = Math.floor(duration * 60);
      function update() {
        if (frame >= maxFrames) { el.innerText = original; return; }
        const pct = frame / maxFrames;
        const revealed = Math.floor(pct * original.length);
        let str = original.slice(0, revealed);
        for (let i = revealed; i < original.length; i++) str += chars[Math.floor(Math.random() * chars.length)];
        el.innerText = str; frame++;
        requestAnimationFrame(update);
      }
      update();
    }



    function splitText(el) {
      const words = [];
      const nodes = Array.from(el.childNodes);
      nodes.forEach(node => {
        if (node.nodeType === 3) {
          const tex = node.textContent.trim();
          if (!tex) return;
          const ws = tex.split(/\s+/);
          const sw = document.createElement('span');
          sw.innerHTML = ws.map(w => `<span class="split-parent"><span class="split-child">${w}</span></span>`).join(' ');
          Array.from(sw.childNodes).forEach(s => {
            if (s.querySelector) words.push(s.querySelector('.split-child'));
            el.insertBefore(s, node);
          });
          el.removeChild(node);
        } else if (node.nodeType === 1 && node.tagName !== 'BR') {
          words.push(...splitText(node));
        }
      });
      return words;
    }

    let drawRequested = false;

    function resize() {
      // Replaced manual math with CSS object-fit: cover for GPU scaling
      updateLayout();
    }

    function updateLayout() {
      if (!imgs.length) return;
      const im = imgs[0]; 
      // Set canvas to original image resolution
      if (canvas.width !== im.width) {
        canvas.width = im.width;
        canvas.height = im.height;
      }
    }
    
    resize();
    let _resizeTimer;
    window.addEventListener('resize', () => { 
      clearTimeout(_resizeTimer);
      _resizeTimer = setTimeout(() => { resize(); requestDraw(); }, 150);
    }, { passive: true });

    function requestDraw() {
      if (drawRequested) return;
      drawRequested = true;
      requestAnimationFrame(() => {
        draw(seq.f);
        drawRequested = false;
      });
    }

    function draw(f) {
      if (document.hidden || !imgs.length) return;
      
      const f1 = Math.max(0, Math.min(Math.floor(f), imgs.length - 1)); // Clamp to ensure valid index
      const im1 = imgs[f1];
      if (!im1 || !im1.complete) return;

      // Draw original frame directly, CSS handles the cover matching
      ctx.drawImage(im1, 0, 0, canvas.width, canvas.height);
    }

    function loadHeroCanvas() {
      const start = 0, end = 97, total = end - start + 1;
      // Fallback: if frames don't load within 8s, show explore button anyway
      const fallbackTimer = setTimeout(() => {
        if (ok + bad < total && ok > 0) {
          const valid = imgs.filter(im => im.complete && im.naturalHeight > 0);
          if (valid.length > 0) { FRAMES = valid.length; imgs.splice(0, imgs.length, ...valid); showExplore(); }
        } else if (ok + bad === 0) {
          // No frames at all — show fallback UI
          showNoFrames();
        }
      }, 8000);

      for (let i = start; i <= end; i++) {
        const img = new Image();
        img.src = `sequence/frame_${i.toString().padStart(2, '0')}_delay-0.041s.webp`;
        img.onload = () => { 
          ok++; 
          tick(total, fallbackTimer);
        };
        img.onerror = () => { bad++; tick(total, fallbackTimer); };
        imgs.push(img);
      }
    }



    function showExplore() {
      const tl = gsap.timeline();
      tl.to('#l-content', { opacity: 0, scale: 0.96, duration: 0.9, ease: 'power2.inOut' })
        .set('#l-content', { display: 'none' })
        .set(['#l-tagline', '#explore-group'], { display: 'block' })
        .to('#l-tagline', { opacity: 1, y: -20, duration: 1.1, ease: 'power3.out' })
        .to('#explore-group', { opacity: 1, y: -10, duration: 0.9, ease: 'power2.out' }, '-=0.6');
      document.getElementById('explore-btn').addEventListener('click', () => {
        const isMutedPref = document.getElementById('music-toggle').classList.contains('muted');
        if (typeof window.toggleMusic === 'function' && !isMutedPref) {
          window.toggleMusic(true); 
        }
        boot(FRAMES); 
      }, { once: true });
    }

    function showNoFrames() {
      // Graceful fallback: skip canvas, show site directly
      document.getElementById('loader').style.display = 'none';
      document.getElementById('hero-canvas').style.opacity = '0';
      document.body.classList.remove('is-loading');
      document.body.classList.add('hero-booted');
      lenis.start();
      gsap.to(['#bl', '#nav'], { opacity: 1, pointerEvents: 'auto', duration: 1.1, ease: 'power2.out', delay: 0.15 });
      if (window.innerWidth <= 900) {
        gsap.to('#hamburger', { opacity: 1, pointerEvents: 'auto', duration: 1, ease: 'power2.out', delay: 0.2 });
      }
    }

    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loadHeroCanvas(), { timeout: 1000 });
      } else {
        setTimeout(loadHeroCanvas, 200);
      }
    });

    function tick(total, fallbackTimer) {
      const done = ok + bad, pct = Math.round(done / total * 100);
      lPct.textContent = pct;
      const offset = 283 - (pct / 100) * 283;
      lFill.style.strokeDashoffset = offset;
      if (done === total) {
        clearTimeout(fallbackTimer);
        const valid = imgs.filter(im => im.complete && im.naturalHeight);
        FRAMES = valid.length;
        if (FRAMES > 0) {
          imgs.splice(0, imgs.length, ...valid);
          setTimeout(showExplore, 400);
        } else {
          showNoFrames();
        }
      }
    }

    let booted = false;
    const seq = { f: 0 };
    function boot(n) {
      if (booted) return;
      booted = true;
      if (prefersReducedMotion) {
        gsap.set(loader, { display: 'none' });
        requestDraw();
        document.body.classList.remove('is-loading');
        document.body.classList.add('hero-booted');
        lenis.start();
        return;
      }
      updateLayout();
      requestDraw();
      
      gsap.to(loader, {
        opacity: 0, duration: .65, ease: 'power2.out',
        onComplete: () => {
          loader.style.display = 'none';
          document.body.classList.remove('is-loading');
          document.body.classList.add('hero-booted');
          lenis.start();
          gsap.to(['#bl', '#nav'], { opacity: 1, pointerEvents: 'auto', duration: 1.1, ease: 'power2.out', delay: 0.15 });
          // Always reveal hamburger (CSS display:none handles desktop hiding)
          gsap.to('#hamburger', { opacity: 1, pointerEvents: 'auto', duration: 1, ease: 'power2.out', delay: 0.2 });
        }
      });
      requestDraw();

      scrambleEffect(document.querySelector('#t1 h1'), 0.7);

      // Hero Mouse Reactivity
      if (!isMobile) {
        window.addEventListener('mousemove', (e) => {
          const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
          const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
          gsap.to('#t1 h1', { x: x * 45, y: y * 45, rotateX: -y * 8, rotateY: x * 8, duration: 0.8, ease: 'power2.out' }); // Tightened duration for better feedback
        });
      }

      const hc = '#hero-container';
      const t1 = document.getElementById('t1');
      const t2 = document.getElementById('t2');
      const t3 = document.getElementById('t3');
      const sc = document.getElementById('scue');

      // ── Scroll Cue Click → Smooth scroll to About ──
      sc.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (!aboutSection) return;

        // Boost rendering for the duration of the programmatic scroll
        isAutoScrolling = true;
        gsap.ticker.fps(120);          // Request 120fps from browser
        gsap.ticker.lagSmoothing(0);   // Zero tolerance — no frame slipping

        lenis.scrollTo(aboutSection, {
          duration: 6.2,
          easing: (() => {
            // Velocity-integral breathing easing — lookup table approach.
            // Velocity = sin(pi*t) bell x Gaussian brakes at T2 (t~0.30) and T3 (t~0.68).
            // C-infinity smooth — no kinks, no micro-stops anywhere.
            const N = 1200;
            const tbl = new Float32Array(N + 1);
            const vel = new Float32Array(N + 1);
            for (let i = 0; i <= N; i++) {
              const t  = i / N;
              const bv = Math.sin(Math.PI * t);
              const d1 = (t - 0.30) / 0.068;
              const d2 = (t - 0.68) / 0.068;
              const g1 = Math.exp(-(d1 * d1));   // T2 brake (Gaussian)
              const g2 = Math.exp(-(d2 * d2));   // T3 brake (Gaussian)
              vel[i]   = bv * (1 - 0.74 * g1) * (1 - 0.74 * g2);
            }
            let total = 0;
            for (let i = 0; i < N; i++) total += (vel[i] + vel[i + 1]) * 0.5 / N;
            let sum = 0;
            tbl[0] = 0;
            for (let i = 1; i <= N; i++) {
              sum   += (vel[i - 1] + vel[i]) * 0.5 / N;
              tbl[i] = sum / total;
            }
            return (t) => {
              const idx = t * N;
              const i   = Math.min(N - 1, idx | 0);
              return tbl[i] + (tbl[i + 1] - tbl[i]) * (idx - i);
            };
          })(),
          lock: false,
          force: true,
          onComplete: () => {
            isAutoScrolling = false;
            gsap.ticker.fps(60);
            gsap.ticker.lagSmoothing(500, 33);
          }
        });
      });

      
      const t2Words = splitText(t2.querySelector('h2'));
      const t3Words = splitText(t3.querySelector('h2'));

      // CONSOLIDATED HERO TIMELINE (Performance: Only 1 ScrollTrigger)
      const firstPartEnd = Math.max(0, n - 6);
      const masterTL = gsap.timeline({
        scrollTrigger: { 
          trigger: hc, 
          start: 'top top', 
          end: 'bottom bottom', 
          scrub: 1.2 // Slight decimal scrub for that iPhone glide/inertia when stopping
        },
        onUpdate: requestDraw
      });

      // 1. Image Sequence (Total duration 1.0)
      masterTL.to(seq, { f: n - 1, duration: 1, ease: 'none' }, 0);

      // Choreography Constants (Total timeline duration is 1.0)
      const d = 0.15; // Standard transition duration

      // 2. T1 & SC (Fade Out early)
      masterTL.to([t1, sc], { opacity: 0, y: -45, duration: d, ease: 'power2.in' }, 0);
      masterTL.to('#bl-hi', { opacity: 0, duration: d, ease: 'none' }, 0);
      masterTL.to('#bl-name', { opacity: 1, duration: d, ease: 'none' }, d);

      // 3. T2 (Appear & Disappear)
      masterTL.fromTo(t2, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: d, ease: 'none' }, 0.2);
      masterTL.fromTo(t2Words, 
        { y: isMobile ? '80%' : '105%', opacity: 0 }, 
        { y: '0%', opacity: 1, duration: d * 1.5, ease: 'power4.out', stagger: 0.05, force3D: true }, 
        0.2
      );
      masterTL.to(t2Words, { 
        y: '-105%', opacity: 0,
        duration: d * 1.2, ease: 'power4.in', stagger: 0.03, force3D: true 
      }, 0.45);
      masterTL.to(t2, { opacity: 0, duration: d, ease: 'none' }, 0.52);

      // 4. T3 (Appear & Disappear)
      masterTL.fromTo(t3, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: d, ease: 'none' }, 0.58);
      masterTL.fromTo(t3Words, 
        { y: isMobile ? '80%' : '105%', opacity: 0 }, 
        { y: '0%', opacity: 1, duration: d * 1.5, ease: 'power4.out', stagger: 0.05, force3D: true }, 
        0.58
      );
      masterTL.to(t3Words, { 
        y: '-105%', opacity: 0,
        duration: d * 1.2, ease: 'power4.in', stagger: 0.03, force3D: true 
      }, 0.82);
      masterTL.to(t3, { opacity: 0, duration: d, ease: 'none' }, 0.9);

      // Magnetic Speed Breaker at end of Hero
      ScrollTrigger.create({
        trigger: ".hero-mq",
        start: "top bottom", // Trigger as soon as the marquee enters at bottom
        end: "top top",      // Until it hits the top
        snap: {
          snapTo: 1,         // Magnetically pull/snap to the end of this boundary
          duration: 0.6,
          delay: 0.1,
          ease: "power3.inOut"
        }
      });

      // INITIALIZE REVEALS: Hide elements immediately to prevent flash during scroll
      gsap.set('.rv, .rv2', { opacity: 0, y: 40 });

      // BATCH REVEALS (Performance & Premium Polish)
      ScrollTrigger.batch('.rv, .rv2', {
        onEnter: batch => gsap.to(batch, {
          opacity: 1, y: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12, overwrite: 'auto', force3D: true
        }),
        once: true, // Only animate once to prevent re-trigger bugs
        start: 'top 92%'
      });

      // Section title split
      document.querySelectorAll('.sec-title').forEach(title => {
        const words = splitText(title);
        gsap.to(words, {
          y: '0%', duration: 1.3, ease: 'expo.out', stagger: .06,
          scrollTrigger: { trigger: title, start: 'top 88%', toggleActions: 'play none none none' }
        });
      });

      // Nav trigger
      ScrollTrigger.create({
        trigger: '#about', start: 'top 80px',
        onEnter: () => document.body.classList.add('nav-active'),
        onLeaveBack: () => document.body.classList.remove('nav-active')
      });

      // Work curtain
      document.querySelectorAll('.work-card').forEach(card => {
        ScrollTrigger.create({
          trigger: card, start: 'top 85%',
          onEnter: () => card.classList.add('in-view'), once: true
        });
      });

      // Work parallax
      document.querySelectorAll('.work-card').forEach(card => {
        const img = card.querySelector('.wc-media img');
        if (img) {
          gsap.fromTo(img, { y: -45 }, {
            y: 45, ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true }
          });
        }
      });

      // Contact headline split
      const ctBig = document.querySelector('.ct-big');
      if (ctBig) {
        const ctWords = splitText(ctBig);
        gsap.set(ctWords, { y: '105%', opacity: 0 });
        gsap.to(ctWords, {
          y: '0%', opacity: 1,
          duration: 1.2, ease: 'power4.out',
          stagger: 0.04,
          scrollTrigger: { trigger: ctBig, start: 'top 90%', toggleActions: 'play none none none' }
        });
      }
      // IMPROVED MAGNETIC (Performance: Cached Rects)
      if (!isMobile) {
        const magneticEls = document.querySelectorAll('.magnetic, #bl');
        magneticEls.forEach(el => {
          let rect;
          el.addEventListener('mouseenter', () => rect = el.getBoundingClientRect());
          el.addEventListener('mousemove', e => {
            if (!rect) rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const strength = el.id === 'bl' ? 0.4 : (el.closest('#nav') ? 0.32 : 0.42);
            
            // Integrate hover effects into magnetic transform to prevent conflicts
            const isP = el.classList.contains('btn-p');
            const isO = el.classList.contains('btn-o');
            const hShift = (isP || isO) ? -3 : 0;
            const hScale = isP ? 1.02 : (isO ? 1.05 : 1);

            gsap.to(el, { 
              x: x * strength, 
              y: (y * strength) + hShift, 
              scale: hScale,
              duration: 0.6, 
              ease: 'power3.out',
              overwrite: 'auto'
            });
          }, { passive: true });
          el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1.2,0.4)', overwrite: 'auto' });
            rect = null;
          });
        });
      }

      // Premium Work 3D tilt (desktop)
      if (!isMobile) {
        document.querySelectorAll('.work-card').forEach(card => {
          let b = null;
          card.addEventListener('mouseenter', () => {
            b = card.getBoundingClientRect();
          });
          card.addEventListener('mousemove', e => {
            if (!b) return;
            const dx = (e.clientX - b.left - b.width / 2) / (b.width / 2);
            const dy = (e.clientY - b.top - b.height / 2) / (b.height / 2);
            gsap.to(card, { rotateY: dx * 7, rotateX: -dy * 7, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
          }, { passive: true });
          card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1.2, ease: 'expo.out', overwrite: 'auto' });
            b = null;
           });
        });
      }

      // Scroll skew
      if (!isMobile) {
        let proxy = { skew: 0 },
          skewSetter = gsap.quickSetter('.skew-el', 'skewY', 'deg'),
          clamp = gsap.utils.clamp(-10, 10);
        ScrollTrigger.create({
          onUpdate: (self) => {
            if (document.hidden || isAutoScrolling) return; // Skip during auto-scroll — prevents tween spam
            let skew = clamp(self.getVelocity() / -300);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, { skew: 0, duration: .8, ease: 'power3', overwrite: true, onUpdate: () => skewSetter(proxy.skew) });
            }
          }
        });
        gsap.set('.skew-el', { transformOrigin: 'left center', force3D: true });
      }

      // Liquid SVG filter (Desktop only)
      if (!isMobile) {
        const svgFilter = `<svg style="visibility:hidden;position:absolute;" width="0" height="0"><filter id="liquid-filter"><feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="3" result="noise" seed="2"><animate attributeName="baseFrequency" values="0.013;0.018;0.013" dur="12s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="noise" scale="22"/></filter></svg>`;
        document.body.insertAdjacentHTML('beforeend', svgFilter);
        document.querySelectorAll('.sec-title').forEach(t => t.classList.add('liquid', 'skew-el'));
        document.querySelectorAll('.ct-big').forEach(t => t.classList.add('skew-el'));
      }

      // Local Time — pauses when tab hidden
      let timeInterval;
      function updateTime() {
        const el = document.getElementById('local-time');
        if (!el) return;
        const now = new Date();
        el.textContent = 'IST ' + now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
      }
      updateTime();
      timeInterval = setInterval(updateTime, 60000);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { clearInterval(timeInterval); }
        else { updateTime(); timeInterval = setInterval(updateTime, 60000); }
      });
    }
