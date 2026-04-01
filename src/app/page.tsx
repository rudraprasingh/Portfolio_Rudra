"use client";

import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import AudioToggle from "@/components/AudioToggle";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import Konami from "@/components/Konami";

export default function Home() {
  return (
    <main>
      <SmoothScroll />
      <Cursor />
      <Navigation />
      <AudioToggle />
      <Konami />
      
      <Hero />
      <div className="wrap">
        <About />
        <div className="rule" />
        <Services />
        <Work />
        <div className="rule" />
        <Experience />
        <Contact />
      </div>
    </main>
  );
}
