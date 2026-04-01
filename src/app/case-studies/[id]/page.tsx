"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";

const projectData: Record<string, any> = {
  "stellar-banking": {
    idx: "01",
    title: "Stellar Banking",
    category: "Product Design",
    year: "2024",
    image: "/images/fintech.webp",
    problem: "Modern banking systems are functionally complete but emotionally distant, leading to user churn and lack of brand loyalty.",
    problemDesc: "Traditional retail banking apps suffer from cognitive overload, cluttered interfaces, and a complete lack of soul. Stellar Banking was born from the desire to make personal finance feel less like a chore and more like a high-end concierge experience.",
    result: "A radical simplification of the transaction pipeline resulted in a 42% increase in user retention over the first six months.",
    metrics: [
      { label: "Retention Increase (%)", value: 42 },
      { label: "Average NPS Score (pts)", value: 18 },
      { label: "M Transaction Volume ($B)", value: 3.5 },
    ],
    next: { id: "nova-os", title: "Nova OS" },
  },
  "nova-os": {
    idx: "02",
    title: "Nova OS",
    category: "Interaction",
    year: "2023",
    image: "/images/dark_os.webp",
    problem: "Desktop interfaces haven't evolved in decades, still relying on paradigms that don't reflect the speed of modern workflows.",
    problemDesc: "Nova OS challenges the status quo with a spatially-aware interface that uses depth and motion to guide the user's attention. Every interaction is designed to feel reactive, intuitive, and weightless.",
    result: "The system reduced average task completion time by 28% while becoming the most-starred OS concept on Dribbble for 2023.",
    metrics: [
      { label: "Efficiency Gain (%)", value: 28 },
      { label: "Design Stars (k)", value: 12 },
      { label: "Load Speed (ms)", value: 450 },
    ],
    next: { id: "stellar-banking", title: "Stellar Banking" },
  }
};

export default function CaseStudyPage() {
  const { id } = useParams();
  const data = projectData[id as string];

  useEffect(() => {
    if (!data) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero Parallax
    gsap.to("#hero-img", {
      yPercent: 30,
      scale: 1.25,
      scrollTrigger: {
        trigger: ".cs-hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Stats Animation
    const stats = document.querySelectorAll(".stat-n");
    stats.forEach((el: any) => {
      const target = parseFloat(el.getAttribute("data-target") || "0");
      gsap.to(el, {
        innerText: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        onUpdate: function () {
          const val = parseFloat(this.targets()[0].innerText);
          el.innerText = Math.ceil(val).toString();
          if (target % 1 !== 0) el.innerText = val.toFixed(1);
        }
      });
    });

    // Browser Image Scroll
    gsap.fromTo(".browser-img", { y: "5%" }, {
      y: "-5%",
      ease: "none",
      scrollTrigger: {
        trigger: "#browser",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, [data]);

  if (!data) return <div className="sec">Project not found.</div>;

  return (
    <main>
      <SmoothScroll />
      <Cursor />
      
      <nav style={{ position: "fixed", top: "2rem", left: "2.5rem", zIndex: 500 }}>
        <Link href="/" className="mono-label" style={{ textDecoration: "none", color: "var(--paper)" }}>
          ← Back to work
        </Link>
      </nav>

      <header className="cs-hero">
        <img src={data.image} alt="Hero background" id="hero-img" />
        <div className="cs-title-wrap">
          <span className="mono-label" style={{ marginBottom: "1.5rem", display: "block" }}>
            {data.idx} — {data.category} — {data.year}
          </span>
          <h1 className="cs-title">{data.title}</h1>
        </div>
      </header>

      <section className="sec">
        <div className="sec-max">
          <div className="row">
            <div className="mono-label">The Problem</div>
            <div>
              <p className="b">{data.problem}</p>
              <p className="p">{data.problemDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec mockup-sec">
        <div className="sec-max">
          <div className="browser-frame" id="browser">
            <div className="browser-top">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
              <div className="browser-url" />
            </div>
            <img src={data.image} alt="Project Screenshot" className="browser-img" />
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="sec-max">
          <div className="row">
            <div className="mono-label">Result & Impact</div>
            <div>
              <p className="b">{data.result}</p>
              <div className="metrics">
                {data.metrics.map((m: any, i: number) => (
                  <div key={i} className="stat">
                    <div className="stat-n" data-target={m.value}>0</div>
                    <div className="stat-l">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="next-proj">
        <Link href={`/case-studies/${data.next.id}`}>
          <span className="next-label">Next Project</span>
          <h2 className="next-title">{data.next.title}</h2>
        </Link>
      </footer>
    </main>
  );
}
