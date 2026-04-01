"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current.querySelectorAll(".rv");
    el.forEach(item => {
      gsap.fromTo(item, 
        { opacity: 0, y: 48 }, 
        {
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  }, []);

  return (
    <section id="about" className="sec cut-right" ref={sectionRef}>
      <div className="sec-max">
        <div className="row rv">
          <div className="col-l"><span className="mono-label">01 — About</span></div>
          <div style={{ flex: 1 }}>
            <div className="about-grid">
              <p className="about-body">
                I'm a <em>creative developer</em> obsessed with the intersection of
                engineering precision and artistic expression. I design and build
                experiences that feel inevitable — where every detail is considered
                and nothing is wasted.
              </p>
              <div className="about-stats">
                <div>
                  <div className="stat-num">5+</div>
                  <div className="stat-label">Years of experience</div>
                </div>
                <div>
                  <div className="stat-num">30+</div>
                  <div className="stat-label">Projects delivered</div>
                </div>
                <div>
                  <div className="stat-num">∞</div>
                  <div className="stat-label">Iterations per pixel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
