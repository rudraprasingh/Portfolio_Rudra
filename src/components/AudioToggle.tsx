"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      if (audioRef.current.currentTime < 28.5) audioRef.current.currentTime = 28.5;
      audioRef.current.play();
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} id="bg-music" src="/audio/bg-music.mp3" loop />
      <button 
        id="music-toggle" 
        className={`music-btn magnetic ${isMuted ? 'muted' : ''}`} 
        aria-label="Toggle Music"
        onClick={toggleAudio}
      >
        <div className="bar-wrap">
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
        <div className="mute-line" />
      </button>
    </>
  );
}
