"use client";

import { useEffect, useState } from "react";

const KONAMI_CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function Konami() {
  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (active) {
        if (e.key === "Escape") setActive(false);
        return;
      }
      
      if (e.key === KONAMI_CODE[idx]) {
        const nextIdx = idx + 1;
        if (nextIdx === KONAMI_CODE.length) {
          setActive(true);
          setIdx(0);
        } else {
          setIdx(nextIdx);
        }
      } else {
        setIdx(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [idx, active]);

  useEffect(() => {
    if (active) {
      const handleMove = () => setActive(false);
      window.addEventListener("mousemove", handleMove, { once: true });
      return () => window.removeEventListener("mousemove", handleMove);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div id="ee" className="active">
      <button className="ee-close" onClick={() => setActive(false)}>Close [ESC]</button>
      <div className="ee-c">
        <img src="/images/qr.webp" alt="Donation QR Code" className="ee-qr" />
        <div className="ee-tx">Wannabe A LEGEND<br />Scan the Qr For the Donation</div>
        <div className="ee-sub">UPI ID: contact.rudrapra@oksbi</div>
      </div>
    </div>
  );
}
