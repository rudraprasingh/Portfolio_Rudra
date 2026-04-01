"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const seqRef = useRef({ f: 0 });

  function splitText(el: HTMLElement) {
    const words: HTMLElement[] = [];
    const nodes = Array.from(el.childNodes);
    nodes.forEach(node => {
      if (node.nodeType === 3) { // Text node
        const tex = node.textContent?.trim();
        if (!tex) return;
        const ws = tex.split(/\s+/);
        const spanWrapper = document.createElement('span');
        spanWrapper.innerHTML = ws.map(w => `<span class="split-parent"><span class="split-child">${w}</span></span>`).join(' ');
        Array.from(spanWrapper.childNodes).forEach(s => {
          const child = (s as HTMLElement).querySelector?.('.split-child');
          if (child) words.push(child as HTMLElement);
          el.insertBefore(s, node);
        });
        el.removeChild(node);
      } else if (node.nodeType === 1 && (node as HTMLElement).tagName !== 'BR') { // Element node
        words.push(...splitText(node as HTMLElement));
      }
    });
    return words;
  }

  function scrambleEffect(el: HTMLElement, duration = 1.6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ/*-+_&^%$#@!';
    const original = el.textContent || "";
    let frame = 0;
    const maxFrames = Math.floor(duration * 60);

    function update() {
      if (frame >= maxFrames) {
        el.textContent = original;
        return;
      }
      const pct = frame / maxFrames;
      const revealedLength = Math.floor(pct * original.length);
      let str = original.slice(0, revealedLength);
      for (let i = revealedLength; i < original.length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = str;
      frame++;
      requestAnimationFrame(update);
    }
    update();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const TOTAL_FRAMES = 65; // Frames 16-80
    const images: HTMLImageElement[] = [];

    const draw = (i: number) => {
      if (!images.length || !images[i]) return;
      const im = images[i];
      const ir = im.width / im.height;
      const cr = canvas.width / canvas.height;
      let dw, dh, ox, oy;
      
      if (ir > cr) {
        dh = canvas.height;
        dw = dh * ir;
        ox = (canvas.width - dw) / 2;
        oy = 0;
      } else {
        dw = canvas.width;
        dh = dw / ir;
        ox = 0;
        oy = (canvas.height - dh) / 2;
      }

      ctx.fillStyle = "#060606";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.95;
      ctx.drawImage(im, ox, oy, dw, dh);
      ctx.globalAlpha = 1.0;

      // Film edge shadow
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 0.7
      );
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw(Math.round(seqRef.current.f));
    };

    window.addEventListener("resize", resize);
    resize();

    const loadFrames = () => {
      const frameIndices = Array.from({ length: 80 - 16 + 1 }, (_, i) => i + 16);
      let processedFrames = 0;

      frameIndices.forEach(i => {
        const img = new Image();
        img.src = `/sequence/frame_${i.toString().padStart(2, "0")}_delay-0.066s.webp`;
        
        const handleComplete = () => {
          processedFrames++;
          if (img.complete && img.naturalHeight) {
            images[i - 16] = img; // Keep order
          }
          
          const pct = Math.round((processedFrames / frameIndices.length) * 100);
          if (pctRef.current) pctRef.current.textContent = pct.toString();
          if (fillRef.current) fillRef.current.style.width = pct + "%";
          
          if (processedFrames === frameIndices.length) {
            setLoaded(true);
            framesRef.current = images.filter(Boolean);
            animateGate();
          }
        };

        img.onload = handleComplete;
        img.onerror = handleComplete;
      });
    };

    const animateGate = () => {
      const tl = gsap.timeline();
      tl.to("#l-content", { opacity: 0, scale: 0.95, duration: 1, ease: "power2.inOut" })
        .set("#l-content", { display: "none" })
        .set(["#l-tagline", "#explore-group"], { display: "block" })
        .to("#l-tagline", { opacity: 1, y: -20, duration: 1.2, ease: "power3.out" })
        .to("#explore-group", { opacity: 1, y: -10, duration: 1, ease: "power2.out" }, "-=0.6");
    };

    loadFrames();

    return () => {
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleStart = () => {
    const tl = gsap.timeline();
    tl.to(loaderRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => {
        if (loaderRef.current) loaderRef.current.style.display = "none";
        document.body.classList.remove("is-loading");
        document.body.classList.add("hero-booted");
        (window as any).lenis?.start();
        gsap.to(["#bl", "#nav"], { opacity: 1, pointerEvents: "auto", duration: 1.2, ease: "power2.out", delay: 0.2 });
        initScrollytelling();

        // Scramble effect
        const h1 = document.querySelector('#t1 h1') as HTMLElement;
        if (h1) scrambleEffect(h1, 0.8);
      }
    });

    // Play/Resume music if possible
    const audio = document.getElementById("bg-music") as HTMLAudioElement;
    if (audio && audio.paused) {
      if (audio.currentTime < 28.5) audio.currentTime = 28.5;
      audio.play().catch(() => {});
      document.getElementById("music-toggle")?.classList.remove("muted");
    }
  };

  const initScrollytelling = () => {
    const n = framesRef.current.length;
    if (n === 0) return;

    gsap.to(seqRef.current, {
      f: n - 1,
      snap: "f",
      ease: "none",
      scrollTrigger: {
        trigger: "#hero-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: () => {
          const ctx = canvasRef.current?.getContext("2d");
          if (ctx && framesRef.current[Math.round(seqRef.current.f)]) {
            const im = framesRef.current[Math.round(seqRef.current.f)];
            const canvas = canvasRef.current!;
            const ir = im.width / im.height;
            const cr = canvas.width / canvas.height;
            let dw, dh, ox, oy;
            if (ir > cr) { dh = canvas.height; dw = dh * ir; ox = (canvas.width - dw) / 2; oy = 0; }
            else { dw = canvas.width; dh = dw / ir; ox = 0; oy = (canvas.height - dh) / 2; }
            ctx.fillStyle = "#060606";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 0.95;
            ctx.drawImage(im, ox, oy, dw, dh);
            ctx.globalAlpha = 1.0;
            const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/0.7);
            grad.addColorStop(0, "transparent"); grad.addColorStop(1, "rgba(0,0,0,0.4)");
            ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      }
    });

    const hc = "#hero-container";
    
    // Mouse Reactivity
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
        gsap.to('#t1 h1', {
            x: x * 50,
            y: y * 50,
            rotateX: -y * 10,
            rotateY: x * 10,
            duration: 1.5,
            ease: 'power2.out'
        });
    });

    // Brand crossfade
    gsap.to("#bl-hi", {
      opacity: 0, ease: "none",
      scrollTrigger: { trigger: hc, start: "top top", end: "10% top", scrub: true }
    });
    gsap.fromTo("#bl-name", { opacity: 0 }, {
      opacity: 1, ease: "none",
      scrollTrigger: { trigger: hc, start: "14% top", end: "22% top", scrub: true }
    });

    // Content reveals
    const t1 = document.getElementById('t1');
    const t2 = document.getElementById('t2');
    const t3 = document.getElementById('t3');
    const sc = document.getElementById('scue');

    gsap.to([t1, sc], {
        opacity: 0, y: -60, ease: "none", stagger: .015,
        scrollTrigger: { trigger: hc, start: "top top", end: "16% top", scrub: true }
    });

    if (t2) {
        const t2Words = splitText(t2.querySelector('h2') as HTMLElement);
        gsap.fromTo(t2, { opacity: 0, y: 70 }, {
            opacity: 1, y: 0, ease: 'none',
            scrollTrigger: { trigger: hc, start: '20% top', end: '35% top', scrub: true }
        });
        gsap.fromTo(t2Words,
            { y: '120%', opacity: 0, rotateX: 65, filter: 'blur(10px)' },
            {
                y: '0%', opacity: 1, rotateX: 0, filter: 'blur(0px)',
                ease: 'none', stagger: 0.02,
                scrollTrigger: { trigger: hc, start: '20% top', end: '36% top', scrub: true }
            }
        );
        gsap.to(t2Words, {
            y: '-130%', opacity: 0, scale: 0.78, rotateX: -38, filter: 'blur(8px)',
            ease: 'none', stagger: 0.02,
            scrollTrigger: { trigger: hc, start: '42% top', end: '55% top', scrub: true }
        });
        gsap.to(t2, {
            opacity: 0, ease: 'none',
            scrollTrigger: { trigger: hc, start: '50% top', end: '54% top', scrub: true }
        });
    }

    if (t3) {
        const t3Words = splitText(t3.querySelector('h2') as HTMLElement);
        gsap.fromTo(t3, { opacity: 0, y: 70 }, {
            opacity: 1, y: 0, ease: 'none',
            scrollTrigger: { trigger: hc, start: '53% top', end: '68% top', scrub: true }
        });
        gsap.fromTo(t3Words,
            { y: '120%', opacity: 0, rotateX: 65, filter: 'blur(10px)' },
            {
                y: '0%', opacity: 1, rotateX: 0, filter: 'blur(0px)',
                ease: 'none', stagger: 0.02,
                scrollTrigger: { trigger: hc, start: '53% top', end: '69% top', scrub: true }
            }
        );
        gsap.to(t3Words, {
            y: '-130%', opacity: 0, scale: 0.78, rotateX: -38, filter: 'blur(8px)',
            ease: 'none', stagger: 0.02,
            scrollTrigger: { trigger: hc, start: '75% top', end: '88% top', scrub: true }
        });
        gsap.to(t3, {
            opacity: 0, ease: 'none',
            scrollTrigger: { trigger: hc, start: '83% top', end: '87% top', scrub: true }
        });
    }
  };

  return (
    <section id="hero-container">
      <div className="h-sticky">
        <canvas ref={canvasRef} id="hero-canvas" />
        <div className="h-noise" />

        <div ref={loaderRef} id="loader">
          <div id="l-tagline" className="l-tagline" style={{ display: "none", opacity: 0 }}>
            Precision in thought,<br />Art in execution.
          </div>

          <div id="l-content">
            <div className="l-pct" ref={pctRef}>0</div>
            <div className="l-bar"><div className="l-fill" ref={fillRef} /></div>
          </div>

          <div id="explore-group" style={{ display: "none", opacity: 0, marginTop: "1rem" }}>
            <button id="explore-btn" className="btn-p magnetic" onClick={handleStart}>
              Start Experiencing
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
            </button>
            <div className="l-hint">Headphones recommended for full immersion</div>
          </div>
        </div>

        <div id="ho">
          <div id="t1">
            <h1>Rudra</h1>
            <div className="t1-sub">
              <div className="t1-line" />
              <span className="t1-label">Creative Developer &amp; Designer</span>
              <div className="t1-line" />
            </div>
          </div>

          <div className="htb" id="t2">
            <h2>
              <strong>I BUILD DIGITAL</strong>
              <span className="display-line">EXPERIENCES.</span>
            </h2>
          </div>

          <div className="htb" id="t3">
            <h2>
              <strong>BRIDGING ART</strong>
              <span className="display-line">&amp; ENGINEERING.</span>
            </h2>
          </div>

          <div id="scue">
            <div className="sc-l" />
            <span className="sc-tx">Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}
