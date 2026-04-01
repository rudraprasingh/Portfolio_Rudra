"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";

const projects = [
  {
    id: "stellar-banking",
    idx: "01",
    title: "Stellar Banking",
    desc: "Reimagining personal finance as a high-end concierge experience with radical interface simplification.",
    tags: ["Product Design", "React", "Figma"],
    image: "/images/fintech.webp",
    year: "2024",
    link: "/case-studies/stellar-banking",
  },
  {
    id: "nova-os",
    idx: "02",
    title: "Nova OS",
    desc: "A spatially-aware desktop interface that makes compute feel like air through glassmorphic interaction.",
    tags: ["Interaction", "Three.js", "GSAP"],
    image: "/images/dark_os.webp",
    year: "2023",
    link: "/case-studies/nova-os",
  },
  {
    id: "motion-systems",
    idx: "03",
    title: "Motion Systems",
    desc: "A creative development toolkit for scroll-linked animation pipelines and real-time visual systems.",
    tags: ["Creative Dev", "WebGL", "Canvas"],
    image: "/images/dark_os.webp",
    year: "2023",
    link: "#",
  }
];

export default function Work() {
  useEffect(() => {
    document.querySelectorAll('.work-card').forEach(card => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => card.classList.add('in-view'),
        once: true
      });

      // 3D Tilt effect
      (card as HTMLElement).addEventListener('mousemove', (e) => {
        const bounds = card.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        const xc = bounds.width / 2;
        const yc = bounds.height / 2;
        const dx = x - xc;
        const dy = y - yc;
        gsap.to(card, {
          rotateY: (dx / xc) * 8, 
          rotateX: -(dy / yc) * 8,
          duration: 0.1,
          ease: 'none'
        });
      });

      (card as HTMLElement).addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
      });

      // Project Parallax
      const img = card.querySelector('.wc-media img');
      if (img) {
        gsap.fromTo(img, { y: -50 }, {
          y: 50, ease: 'none',
          scrollTrigger: {
            trigger: card, start: 'top bottom', end: 'bottom top', scrub: true
          }
        });
      }
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <section id="work" className="sec cut-right">
      <div className="sec-max">
        <div className="row" style={{ marginBottom: "2rem" }}>
          <div className="col-l rv"><span className="mono-label">03 — Work</span></div>
          <h2 className="sec-title rv">Selected<br /><em style={{ color: "var(--accent)" }}>projects</em></h2>
        </div>

        <div className="work-showcase">
          {projects.map((proj) => (
            <Link key={proj.id} href={proj.link} className="work-card rv" id={`wr${proj.idx}`}>
              <div className="wc-bg"><img src={proj.image} alt="" /></div>
              <div className="wc-inner">
                <span className="wc-idx">{proj.idx}</span>
                <div>
                  <h3 className="wc-title">{proj.title}</h3>
                  <p className="wc-desc">{proj.desc}</p>
                  <div className="wc-tags">
                    {proj.tags.map(tag => <span key={tag} className="wc-tag">{tag}</span>)}
                  </div>
                </div>
                <div>
                  <div className="wc-media skeleton-bg">
                    <img 
                      src={proj.image} 
                      alt={proj.title} 
                      className="lqip loaded" 
                      loading="lazy" 
                      width="1000"
                      height="600"
                    />
                  </div>
                  <div className="wc-meta">
                    <span className="wc-year">{proj.year}</span>
                    <div className="wc-arrow">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
