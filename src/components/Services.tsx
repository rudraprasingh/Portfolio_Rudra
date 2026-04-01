"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll(".srv-row");
    items.forEach(item => {
      gsap.fromTo(item, 
        { opacity: 0, y: 28 }, 
        {
          opacity: 1, 
          y: 0, 
          duration: 0.9, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  }, []);

  return (
    <section id="services" className="sec cut-left" ref={sectionRef}>
      <div className="sec-max">
        <div className="row rv">
          <div className="col-l"><span className="mono-label">02 — Services</span></div>
          <div style={{ flex: 1 }}>
            <h2 className="sec-title">What I do</h2>
            <div className="srv-list" style={{ marginTop: "3rem" }}>
              <div className="srv-row">
                <span className="srv-n">01</span>
                <span className="srv-name">Full-Stack Architecture</span>
                <div className="srv-tags">
                  <span className="srv-tag">Next.js</span>
                  <span className="srv-tag">Node</span>
                  <span className="srv-tag">PostgreSQL</span>
                </div>
              </div>
              <div className="srv-row">
                <span className="srv-n">02</span>
                <span className="srv-name">Creative Development</span>
                <div className="srv-tags">
                  <span className="srv-tag">WebGL</span>
                  <span className="srv-tag">Three.js</span>
                  <span className="srv-tag">GSAP</span>
                </div>
              </div>
              <div className="srv-row">
                <span className="srv-n">03</span>
                <span className="srv-name">UI / UX Design</span>
                <div className="srv-tags">
                  <span className="srv-tag">Figma</span>
                  <span className="srv-tag">Framer</span>
                </div>
              </div>
              <div className="srv-row">
                <span className="srv-n">04</span>
                <span className="srv-name">Performance &amp; SEO</span>
                <div className="srv-tags">
                  <span className="srv-tag">Lighthouse</span>
                  <span className="srv-tag">SSR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Marquee */}
      <div className="mq">
        <div className="mq-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex' }}>
              <span>JavaScript</span><span>TypeScript</span><span>React</span><span>Next.js</span>
              <span>GSAP</span><span>Three.js</span><span>WebGL</span><span>Figma</span>
              <span>Node.js</span><span>PostgreSQL</span><span>Tailwind</span><span>Framer</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
