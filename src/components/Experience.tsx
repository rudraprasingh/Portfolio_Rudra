"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const items = sectionRef.current.querySelectorAll(".rv");
    items.forEach(item => {
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
    <section id="experience" className="sec cut-left" ref={sectionRef}>
      <div className="sec-max">
        <div className="row rv" style={{ marginBottom: "4rem" }}>
          <div className="col-l"><span className="mono-label">04 — Experience</span></div>
          <h2 className="sec-title">Career</h2>
        </div>
        <div style={{ maxWidth: "780px", marginLeft: "auto" }}>
          <div className="exp-timeline">
            <div className="exp-item rv">
              <div className="exp-head">
                <div>
                  <div className="exp-role">Senior Creative Developer</div>
                  <div className="exp-co">Acme Agency</div>
                </div>
                <span className="exp-date">2022 — Present</span>
              </div>
              <ul className="exp-pts">
                <li>Led teams building award-winning web experiences and immersive interactions.</li>
                <li>Elevated core web vitals via custom GSAP pipelines and canvas rendering.</li>
              </ul>
            </div>
            <div className="exp-item rv">
              <div className="exp-head">
                <div>
                  <div className="exp-role">Frontend Engineer</div>
                  <div className="exp-co">TechNova</div>
                </div>
                <span className="exp-date">2018 — 2021</span>
              </div>
              <ul className="exp-pts">
                <li>Spearheaded scrollytelling features, 2D animations, and dynamic states.</li>
                <li>Built modular component systems adopted across the entire framework team.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
