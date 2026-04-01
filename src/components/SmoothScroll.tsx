"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      infinite: false,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Make lenis accessible globally for any manual scrollTo calls
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove(gsap.ticker.tick);
    };
  }, []);

  return null;
}
