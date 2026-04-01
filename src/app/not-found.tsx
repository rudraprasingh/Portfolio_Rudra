import Link from "next/link";
import Cursor from "@/components/Cursor";

export default function NotFound() {
  return (
    <main style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Cursor />
      <div id="grain" />
      <div className="c" style={{ textAlign: "center", position: "relative", zIndex: 10, padding: "2rem" }}>
        <div 
          className="e404" 
          style={{ 
            fontFamily: "var(--serif)", 
            fontWeight: 300, 
            fontStyle: "italic", 
            fontSize: "clamp(8rem, 25vw, 20rem)", 
            lineHeight: 0.8, 
            letterSpacing: "-0.05em", 
            marginBottom: "2rem",
            color: "var(--paper)"
          }}
        >
          404
        </div>
        <p className="p" style={{ fontFamily: "var(--serif)", fontSize: "1.25rem", fontStyle: "italic", color: "var(--dim)", maxWidth: "400px", margin: "0 auto 3rem", lineHeight: 1.6 }}>
          Even the most structured paths have their deviations.
        </p>
        <Link href="/" className="btn-p" style={{ padding: "1.2rem 2.8rem" }}>
          Back Home 
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </div>
      
      <style>{`
        .e404 { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
      `}</style>
    </main>
  );
}

export const metadata = {
  title: "404 — Lost in Space",
};
