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

    const onScroll = () => {
      document.body.classList.add('c-scrolling');
      showCursor();
    };

    const onMouseLeave = () => {
      document.body.classList.add('c-hidden');
    };

    const onMouseEnter = () => {
      document.body.classList.remove('c-hidden');
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

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', updateCursor as any, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

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
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(raf);
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
