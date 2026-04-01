"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const curRRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverable = target.closest('a, button, .work-card, .hero-mq');
      if (hoverable) {
        if (hoverable.classList.contains('work-card')) {
          document.body.className = 'c-view';
          curRRef.current?.setAttribute('data-cur-text', 'view');
        } else if (hoverable.classList.contains('hero-mq')) {
          document.body.className = 'c-drag';
          curRRef.current?.setAttribute('data-cur-text', 'scrl');
        } else {
          document.body.className = 'c-link';
        }
      } else {
        document.body.className = '';
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', updateCursor as any);

    const loop = () => {
      const lerp = 0.1;
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
    };
  }, []);

  return (
    <>
      <div ref={curRRef} id="cur-r" />
    </>
  );
}
