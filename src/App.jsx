import { useState, useEffect, useRef } from "react";

const CORE_URL  = "https://core.studox.eu";
const INFO_URL  = "https://studox.info";

/* ─── Particle canvas ──────────────────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const NUM = 120;
    const stars = Array.from({ length: NUM }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      hue: Math.random() > 0.5 ? 270 : 190,
      alpha: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.12 + 0.02,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.y -= s.speed;
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 80%, ${s.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ─── Main ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const [visible, setVisible]   = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [chosen, setChosen]     = useState(null); // "info" | "core"

  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  const handleChoose = (choice) => {
    setChosen(choice);
    setTimeout(() => {
      window.location.href = choice === "core" ? CORE_URL : INFO_URL;
    }, 500);
  };

  return (
    <div style={{
      minHeight: "100dvh", background: "#030310", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif", overflow: "hidden",
      position: "relative", padding: "16px",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030310; }
        html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
        input, textarea, select { font-size: 16px !important; touch-action: manipulation; }
        button, a { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes exit-up {
          from { opacity: 1; transform: scale(1)   translateY(0); }
          to   { opacity: 0; transform: scale(0.95) translateY(-40px); }
        }

        .modal-card {
          animation: modal-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .modal-card.exit {
          animation: exit-up 0.4s ease-in forwards;
        }
        .btn-choice {
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
          outline: none;
          border: none;
          text-align: left;
        }
        .btn-choice:hover  { transform: translateY(-4px) scale(1.02); }
        .btn-choice:active { transform: scale(0.97); }

        .logo-float { animation: float 4s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #c4b5fd, #ffffff, #67e8f9, #ffffff, #c4b5fd);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      <ParticleField />

      {/* Grid overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,92,246,0.08) 0%, transparent 70%)",
      }} />

      {/* Modal */}
      <div
        className={`modal-card${chosen ? " exit" : ""}`}
        style={{
          position: "relative", zIndex: 10,
          width: "min(520px, calc(100vw - 40px))",
          borderRadius: 32,
          background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.14) 0%, rgba(5,5,18,0.98) 65%)",
          border: "1px solid rgba(139,92,246,0.25)",
          boxShadow: "0 0 80px rgba(139,92,246,0.15), 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(139,92,246,0.2)",
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(30px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* Top accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, #8b5cf6, #06b6d4, transparent)",
        }} />

        {/* Orb decorations */}
        <div style={{
          position: "absolute", top: -60, right: -60, width: 200, height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: -40, width: 160, height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ padding: "48px 40px 40px" }}>
          {/* Logo */}
          <div className="logo-float" style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ position: "relative" }}>
              {/* Pulse ring */}
              <div style={{
                position: "absolute", inset: -12, borderRadius: "50%",
                border: "1.5px solid rgba(139,92,246,0.5)",
                animation: "pulse-ring 2.5s ease-out infinite",
              }} />
              <div style={{
                position: "absolute", inset: -24, borderRadius: "50%",
                border: "1px solid rgba(6,182,212,0.3)",
                animation: "pulse-ring 2.5s ease-out 0.8s infinite",
              }} />
              {/* S logo */}
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: "linear-gradient(135deg, #7c3aed, #0891b2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(6,182,212,0.2)",
                fontSize: 36, fontWeight: 900, color: "#fff",
                letterSpacing: -2,
              }}>
                S
              </div>
            </div>
          </div>

          {/* Headline */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1 className="shimmer-text" style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 10 }}>
              StudoX
            </h1>
            <p style={{ color: "#9ca3af", fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>
              Digital Learning. Redefined.
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12,
              padding: "4px 14px", borderRadius: 100,
              background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
              <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, letterSpacing: 0.5 }}>LIVE SYSTEM AKTIV</span>
            </div>
          </div>

          {/* Question */}
          <p style={{ textAlign: "center", color: "#6b7280", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
            Wohin möchtest du?
          </p>

          {/* Choice buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* → Core (System) */}
            <button
              className="btn-choice"
              onMouseEnter={() => setHoveredBtn("core")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={() => handleChoose("core")}
              style={{
                padding: "20px 22px",
                borderRadius: 20,
                background: hoveredBtn === "core"
                  ? "radial-gradient(ellipse at 0% 50%, rgba(139,92,246,0.2) 0%, rgba(6,182,212,0.1) 100%)"
                  : "rgba(255,255,255,0.04)",
                border: hoveredBtn === "core"
                  ? "1px solid rgba(139,92,246,0.5)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: hoveredBtn === "core" ? "0 0 30px rgba(139,92,246,0.15)" : "none",
                display: "flex", alignItems: "center", gap: 18,
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))",
                border: "1px solid rgba(139,92,246,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24,
              }}>🚀</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#e9d5ff", fontWeight: 800, fontSize: 16, marginBottom: 3 }}>Ins System</p>
                <p style={{ color: "#6b7280", fontSize: 13, fontWeight: 500 }}>StudoX Core — starte alle Apps, login & mehr</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={hoveredBtn === "core" ? "#c4b5fd" : "#374151"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>

            {/* → Info */}
            <button
              className="btn-choice"
              onMouseEnter={() => setHoveredBtn("info")}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={() => handleChoose("info")}
              style={{
                padding: "20px 22px",
                borderRadius: 20,
                background: hoveredBtn === "info"
                  ? "radial-gradient(ellipse at 0% 50%, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.08) 100%)"
                  : "rgba(255,255,255,0.04)",
                border: hoveredBtn === "info"
                  ? "1px solid rgba(16,185,129,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                boxShadow: hoveredBtn === "info" ? "0 0 30px rgba(16,185,129,0.1)" : "none",
                display: "flex", alignItems: "center", gap: 18,
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(6,182,212,0.15))",
                border: "1px solid rgba(16,185,129,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24,
              }}>📖</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#a7f3d0", fontWeight: 800, fontSize: 16, marginBottom: 3 }}>Mehr erfahren</p>
                <p style={{ color: "#6b7280", fontSize: 13, fontWeight: 500 }}>Infos für Schulen, Privatpersonen & Institutionen</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={hoveredBtn === "info" ? "#6ee7b7" : "#374151"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 28, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <a href={INFO_URL} style={{ color: "#374151", fontSize: 12, textDecoration: "none", fontWeight: 500 }}>studox.info</a>
            <span style={{ color: "#1f2937" }}>·</span>
            <a href="https://studox.org" style={{ color: "#374151", fontSize: 12, textDecoration: "none", fontWeight: 500 }}>studox.org</a>
            <span style={{ color: "#1f2937" }}>·</span>
            <span style={{ color: "#1f2937", fontSize: 12, fontWeight: 500 }}>© 2026 StudoX</span>
          </div>
        </div>
      </div>
    </div>
  );
}
