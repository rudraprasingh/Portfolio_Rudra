"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Navigation() {
  const [navActive, setNavActive] = useState(false);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: "#about",
      start: "top 80px",
      onEnter: () => setNavActive(true),
      onLeaveBack: () => setNavActive(false),
    });
  }, []);

  useEffect(() => {
    if (navActive) {
      document.body.classList.add("nav-active");
    } else {
      document.body.classList.remove("nav-active");
    }
  }, [navActive]);

  return (
    <>
      {/* Brand logo */}
      <a href="#" id="bl">
        <span id="bl-hi">Hi</span>
        <span id="bl-name">Rudra</span>
      </a>

      {/* Nav */}
      <nav id="nav" aria-label="Main Navigation">
        <a href="#about" className="magnetic" aria-label="About Section">About</a>
        <a href="#services" className="magnetic" aria-label="Services Section">Services</a>
        <a href="#work" className="magnetic" aria-label="Work Section">Work</a>
        <a href="#experience" className="magnetic" aria-label="Career Experience">Experience</a>
        <a href="#contact" className="magnetic" aria-label="Contact Section">Contact</a>
      </nav>
    </>
  );
}
