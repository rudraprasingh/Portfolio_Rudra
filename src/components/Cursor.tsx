"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const curRRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let hideTimer: NodeJS.Timeout;
    const idleTime = 800;

    const showCursor = () => {
      document.body.classList.remove('c-hidden');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        document.body.classList.add('c-hidden');
        document.body.classList.remove('c-scrolling');
      }, idleTime);
    };

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      document.body.classList.remove('c-scrolling');
      showCursor();
    };

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverable = target.closest('a, button, .work-card, .hero-mq');
      
      let nextState = '';
      let nextText = '';

      if (hoverable) {
        if (hoverable.classList.contains('work-card')) {
          nextState = 'c-view';
          nextText = 'view';
        } else if (hoverable.classList.contains('hero-mq')) {
          nextState = 'c-drag';
          nextText = 'scrl';
        } else {
          nextState = 'c-link';
        }
      }

      if (!document.body.classList.contains(nextState)) {
        document.body.classList.remove('c-view', 'c-drag', 'c-link');
        if (nextState) document.body.classList.add(nextState);
        if (nextText) curRRef.current?.setAttribute('data-cur-text', nextText);
      }
    };

    // Magnetic Logic
    const initMagnetic = () => {
        const items = document.querySelectorAll('.magnetic');
        items.forEach(item => {
            (item as any)._mag = true;
            item.addEventListener('mousemove', (e: any) => {
                const bounds = item.getBoundingClientRect();
                const x = e.clientX - bounds.left - bounds.width / 2;
                const y = e.clientY - bounds.top - bounds.height / 2;
                gsap.to(item, { x: x * 0.4, y: y * 0.4, duration: 0.6, ease: 'power2.out' });
            });
            item.addEventListener('mouseleave', () => {
                gsap.to(item, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
            });
        });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', updateCursor as any, { passive: true });
    document.addEventListener('mouseleave', () => document.body.classList.add('c-hidden'), { passive: true });
    document.addEventListener('mouseenter', () => document.body.classList.remove('c-hidden'), { passive: true });

    initMagnetic();
    // Re-init magnetic for dynamic content
    const observer = new MutationObserver(initMagnetic);
    observer.observe(document.body, { childList: true, subtree: true });

    const loop = () => {
      const lerp = 0.15;
      rx += (mx - rx) * lerp;
      ry += (my - ry) * lerp;
      if (curRef.current) curRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%,-50%)`;
      if (curRRef.current) curRRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    const raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', updateCursor as any);
      cancelAnimationFrame(raf);
      observer.disconnect();
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      <div ref={curRef} id="cur" />
      <div ref={curRRef} id="cur-r" />
    </>
  );
}
