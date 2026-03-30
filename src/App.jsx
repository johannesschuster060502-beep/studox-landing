/**
 * StudoX — The Gateway
 * Cinematic entry experience. Immersive, revealing, unforgettable.
 */
import { useState, useEffect, useRef } from "react";
import ThreeBackground from "./ThreeBackground";

const CORE_URL = "https://core.studox.eu";
const INFO_URL = "https://studox.info";

/* ─────────────────────────────────────────────────────────────────────────────
   NEBULA CANVAS — Deep space particle field with depth & color
   ───────────────────────────────────────────────────────────────────────────── */
function NebulaCanvas({ phase }) {
  const canvasRef = useRef(null);
  const starsRef  = useRef([]);
  const rafRef    = useRef(null);
  const phaseRef  = useRef(phase);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    starsRef.current = Array.from({ length: 280 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      hue:   Math.random() < 0.35 ? 270 : Math.random() < 0.5 ? 195 : 240,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let lastT = 0;
    const draw = (t) => {
      rafRef.current = requestAnimationFrame(draw);
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      const p = phaseRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Speed: slow drift normally, fast warp on chosen
      const speed = p >= 5 ? 4.5 : 0.18;

      starsRef.current.forEach((star) => {
        star.twinkle += dt * (0.5 + star.z * 1.5);
        star.z -= speed * dt;
        if (star.z <= 0) {
          star.x = Math.random();
          star.y = Math.random();
          star.z = 1;
        }

        const W = canvas.width, H = canvas.height;
        const sx = (star.x - 0.5) / star.z * W + W * 0.5;
        const sy = (star.y - 0.5) / star.z * H + H * 0.5;
        const r  = Math.max(0.2, (1 - star.z) * 2.8);
        const alpha = Math.min(0.9, (1 - star.z) * 1.6) * (0.7 + Math.sin(star.twinkle) * 0.3);

        if (sx < -5 || sx > W + 5 || sy < -5 || sy > H + 5) return;

        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 80%, 82%, ${alpha})`;
        ctx.fill();

        // Warp streaks
        if (speed > 1.5 && alpha > 0.4) {
          const pz  = star.z + speed * dt;
          const psx = (star.x - 0.5) / pz * W + W * 0.5;
          const psy = (star.y - 0.5) / pz * H + H * 0.5;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(psx, psy);
          ctx.strokeStyle = `hsla(${star.hue}, 80%, 82%, ${alpha * 0.4})`;
          ctx.lineWidth = r * 0.7;
          ctx.stroke();
        }
      });
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        opacity: phase >= 2 ? (phase >= 5 ? 1 : 0.7) : 0,
        transition: "opacity 1.2s ease",
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COREMARK SVG — Orbital hub logo (identical to Core app)
   ───────────────────────────────────────────────────────────────────────────── */
function CoreMark({ size = 80, glow = false, pulse = false }) {
  const s = size / 80;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="lp-orb" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#f5f3ff"/>
          <stop offset="40%" stopColor="#a855f7"/>
          <stop offset="100%" stopColor="#3b0764"/>
        </radialGradient>
        <radialGradient id="lp-na" cx="38%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#cffafe"/>
          <stop offset="100%" stopColor="#0e7490"/>
        </radialGradient>
        <radialGradient id="lp-nb" cx="38%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#ede9fe"/>
          <stop offset="100%" stopColor="#6d28d9"/>
        </radialGradient>
        <radialGradient id="lp-nc" cx="38%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#d1fae5"/>
          <stop offset="100%" stopColor="#065f46"/>
        </radialGradient>
        <linearGradient id="lp-r1" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor="#8b5cf6" stopOpacity="0.15"/>
          <stop offset="30%"  stopColor="#c084fc" stopOpacity="0.9"/>
          <stop offset="70%"  stopColor="#06b6d4" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1"/>
        </linearGradient>
        <linearGradient id="lp-r2" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor="#06b6d4" stopOpacity="0.15"/>
          <stop offset="50%"  stopColor="#8b5cf6" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1"/>
        </linearGradient>
        {glow && (
          <filter id="lp-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={4 * s} result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        )}
      </defs>
      <g filter={glow ? "url(#lp-glow)" : undefined}
         style={pulse ? { animation: "lp-pulse 2.5s ease-in-out infinite" } : {}}>
        <circle cx="40" cy="40" r="37" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth={0.8*s}/>
        <ellipse cx="40" cy="40" rx="37" ry="14"
          fill="none" stroke="url(#lp-r1)" strokeWidth={1.5*s} opacity="0.75"/>
        <ellipse cx="40" cy="40" rx="37" ry="14"
          fill="none" stroke="url(#lp-r2)" strokeWidth={1.2*s} opacity="0.6"
          transform="rotate(60 40 40)"/>
        <ellipse cx="40" cy="40" rx="37" ry="14"
          fill="none" stroke="rgba(192,132,252,0.5)" strokeWidth={s}
          transform="rotate(-60 40 40)"/>
        <line x1="40"   y1="14"   x2="40"   y2="27"
          stroke="rgba(200,160,255,0.55)" strokeWidth={1.2*s} strokeDasharray={`${2.5*s} ${2*s}`}/>
        <line x1="65.5" y1="55.5" x2="52.5" y2="47.8"
          stroke="rgba(139,92,246,0.55)" strokeWidth={1.2*s} strokeDasharray={`${2.5*s} ${2*s}`}/>
        <line x1="14.5" y1="55.5" x2="27.5" y2="47.8"
          stroke="rgba(6,182,212,0.55)" strokeWidth={1.2*s} strokeDasharray={`${2.5*s} ${2*s}`}/>
        <circle cx="40" cy="9" r={6.5*s} fill="url(#lp-na)"/>
        <ellipse cx="38.5" cy="7.2" rx={3*s} ry={1.8*s} fill="white" opacity="0.55" transform="rotate(-15 38.5 7.2)"/>
        <circle cx="68" cy="57" r={5.5*s} fill="url(#lp-nb)"/>
        <ellipse cx="66.5" cy="55.5" rx={2.5*s} ry={1.5*s} fill="white" opacity="0.5" transform="rotate(-15 66.5 55.5)"/>
        <circle cx="12" cy="57" r={5*s} fill="url(#lp-nc)"/>
        <ellipse cx="10.5" cy="55.5" rx={2.2*s} ry={1.3*s} fill="white" opacity="0.45" transform="rotate(-15 10.5 55.5)"/>
        <circle cx="40" cy="40" r={13*s} fill="url(#lp-orb)"/>
        <circle cx="40" cy="40" r={13*s} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.8*s}/>
        <ellipse cx="36" cy="35" rx={5.5*s} ry={3.2*s} fill="white" opacity="0.28" transform="rotate(-20 36 35)"/>
        <circle cx="40" cy="40" r={4.5*s} fill="rgba(255,255,255,0.72)"/>
        <circle cx="40" cy="40" r={2*s}   fill="white"/>
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  // Phase system:
  // 0 = black
  // 1 = grid + nebula fades in
  // 2 = star field activates, logo assembles
  // 3 = headline reveals
  // 4 = subtitle + badge appear
  // 5 = CTAs slide up
  // 6 = "chosen" warp exit
  const [phase, setPhase] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 150);
    const t2 = setTimeout(() => setPhase(2), 700);
    const t3 = setTimeout(() => setPhase(3), 1600);
    const t4 = setTimeout(() => setPhase(4), 2200);
    const t5 = setTimeout(() => setPhase(5), 2800);
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
  }, []);

  const handleChoose = (dest) => {
    setChosen(dest);
    setPhase(6);
    setTimeout(() => {
      window.location.href = dest === "core" ? CORE_URL : INFO_URL;
    }, 900);
  };

  const visible = (p) => phase >= p;

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#030310",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      overflow: "hidden",
      position: "relative",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030310; color: #fff; }

        @keyframes lp-pulse  { 0%,100% { transform: scale(1);   } 50% { transform: scale(1.06); } }
        @keyframes lp-ring   { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes lp-float  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes lp-shine  {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes lp-char-in {
          from { opacity: 0; transform: translateY(8px) scale(0.92); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes lp-slide-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp-warp-out {
          from { opacity: 1; transform: scale(1); filter: blur(0px); }
          to   { opacity: 0; transform: scale(1.08); filter: blur(12px); }
        }
        @keyframes lp-orbit-a {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes lp-orbit-b {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        .lp-shine-text {
          background: linear-gradient(90deg,
            #c4b5fd 0%, #e9d5ff 20%, #ffffff 40%,
            #67e8f9 60%, #e9d5ff 80%, #c4b5fd 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: lp-shine 5s linear infinite;
        }
        .lp-float { animation: lp-float 5s ease-in-out infinite; }
        .lp-warp  { animation: lp-warp-out 0.8s ease-in forwards; }

        button { cursor: pointer; border: none; outline: none; background: none; }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* ── 3D WebGL Background ──────────────────────────────────────────── */}
      <ThreeBackground phase={phase} warp={phase >= 6} />

      {/* Radial vignette — soft edge darkening to keep text readable */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2,
        background: "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(3,3,16,0.55) 100%)",
      }} />

      {/* Top + bottom accent lines */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.7) 30%, rgba(6,182,212,0.7) 70%, transparent 100%)",
        zIndex: 3, boxShadow: "0 0 20px rgba(139,92,246,0.5)",
        opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.8s ease",
      }} />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.4) 30%, rgba(6,182,212,0.4) 70%, transparent 100%)",
        zIndex: 3,
        opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.8s ease 0.3s",
      }} />

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div
        className={chosen ? "lp-warp" : ""}
        style={{
          position: "relative", zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 20px",
          width: "min(620px, 100vw - 40px)",
        }}
      >
        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <div
          className={phase >= 2 ? "lp-float" : ""}
          style={{
            position: "relative",
            marginBottom: 36,
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "scale(1)" : "scale(0.6)",
            transition: "opacity 0.8s cubic-bezier(0.34,1.56,0.64,1), transform 0.9s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Ambient glow rings — pulse outward */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              position: "absolute",
              inset: -(30 + i * 22),
              borderRadius: "50%",
              border: `${1.5 - i * 0.4}px solid ${i === 0 ? "rgba(139,92,246,0.5)" : i === 1 ? "rgba(6,182,212,0.3)" : "rgba(192,132,252,0.15)"}`,
              animation: `lp-ring ${2.2 + i * 0.6}s ease-out ${i * 0.7}s infinite`,
            }} />
          ))}

          {/* Orbiting accent dots */}
          <div style={{
            position: "absolute", inset: -50,
            animation: "lp-orbit-a 8s linear infinite",
          }}>
            <div style={{
              position: "absolute", top: 0, left: "50%",
              width: 6, height: 6, borderRadius: "50%",
              background: "#c084fc", boxShadow: "0 0 10px #c084fc",
              transform: "translateX(-50%)",
            }} />
          </div>
          <div style={{
            position: "absolute", inset: -50,
            animation: "lp-orbit-b 12s linear infinite",
          }}>
            <div style={{
              position: "absolute", bottom: 0, right: 8,
              width: 4, height: 4, borderRadius: "50%",
              background: "#06b6d4", boxShadow: "0 0 8px #06b6d4",
            }} />
          </div>

          {/* The CoreMark logo */}
          <div style={{ filter: "drop-shadow(0 0 40px rgba(139,92,246,0.8)) drop-shadow(0 0 80px rgba(6,182,212,0.4))" }}>
            <CoreMark size={130} glow pulse />
          </div>
        </div>

        {/* ── STUDOX wordmark ───────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          {"STUDOX".split("").map((char, i) => (
            <span
              key={i}
              className={phase >= 3 ? "lp-shine-text" : ""}
              style={{
                display: "inline-block",
                fontSize: "clamp(52px, 12vw, 88px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                opacity: phase >= 3 ? 1 : 0,
                animation: phase >= 3 ? `lp-char-in 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms both` : "none",
                color: "#fff",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* ── Subtitle ──────────────────────────────────────────────────── */}
        <div style={{
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          textAlign: "center",
          marginBottom: 32,
        }}>
          <p style={{
            fontSize: "clamp(14px, 3vw, 18px)",
            fontWeight: 500,
            letterSpacing: "0.01em",
            lineHeight: 1.4,
            color: "rgba(196,181,253,0.8)",
            marginBottom: 14,
          }}>
            Die Zukunft der Bildung.{" "}
            <span style={{ color: "rgba(103,232,249,0.8)" }}>Gamifiziert. Lebendig.</span>
          </p>

          {/* Live status + platform pills */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 14px", borderRadius: 100,
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", animation: "lp-pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#34d399", letterSpacing: "0.08em", textTransform: "uppercase" }}>Live System Aktiv</span>
            </div>
            {[
              { label: "Flow",   color: "#8b5cf6" },
              { label: "Clubs",  color: "#10b981" },
              { label: "Core",   color: "#06b6d4" },
            ].map(({ label, color }) => (
              <span key={label} style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 11px", borderRadius: 100,
                background: `${color}12`, border: `1px solid ${color}28`,
                fontSize: 10, fontWeight: 700, color,
                letterSpacing: "0.05em",
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── CTAs ──────────────────────────────────────────────────────── */}
        <div style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          opacity: phase >= 5 ? 1 : 0,
          transform: phase >= 5 ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
        }}>

          {/* Primary CTA — Ins System */}
          <button
            onMouseEnter={() => setHovered("core")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleChoose("core")}
            style={{
              position: "relative",
              width: "100%",
              padding: "22px 28px",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              gap: 20,
              overflow: "hidden",
              border: "1px solid",
              borderColor: hovered === "core" ? "rgba(139,92,246,0.7)" : "rgba(139,92,246,0.3)",
              background: hovered === "core"
                ? "linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(6,182,212,0.15) 100%)"
                : "rgba(139,92,246,0.08)",
              boxShadow: hovered === "core"
                ? "0 0 50px rgba(139,92,246,0.25), 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(139,92,246,0.3)"
                : "0 8px 32px rgba(0,0,0,0.3)",
              transform: hovered === "core" ? "translateY(-3px) scale(1.01)" : "translateY(0) scale(1)",
              transition: "all 0.28s cubic-bezier(0.34,1.56,0.64,1)",
              cursor: "pointer",
            }}
          >
            {/* Shine overlay */}
            {hovered === "core" && (
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)",
                pointerEvents: "none",
              }} />
            )}

            {/* Icon */}
            <div style={{
              width: 60, height: 60, borderRadius: 18, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(6,182,212,0.2))",
              border: "1px solid rgba(139,92,246,0.4)",
              boxShadow: hovered === "core" ? "0 0 20px rgba(139,92,246,0.4)" : "none",
              transition: "box-shadow 0.3s ease",
            }}>
              <div style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.8))" }}>
                <CoreMark size={32} glow />
              </div>
            </div>

            {/* Text */}
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{
                fontSize: "clamp(16px, 4vw, 20px)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                marginBottom: 4,
                background: hovered === "core"
                  ? "linear-gradient(90deg, #e9d5ff, #c4b5fd)"
                  : "none",
                WebkitBackgroundClip: hovered === "core" ? "text" : "unset",
                WebkitTextFillColor: hovered === "core" ? "transparent" : "#fff",
              }}>
                Ins System
              </p>
              <p style={{ fontSize: 13, color: "rgba(156,163,175,0.8)", fontWeight: 500 }}>
                StudoX Core — Login, Apps & Dashboard
              </p>
            </div>

            {/* Arrow */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke={hovered === "core" ? "#c4b5fd" : "rgba(107,114,128,0.7)"}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transition: "transform 0.3s ease, stroke 0.3s ease",
                transform: hovered === "core" ? "translateX(3px)" : "none" }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          {/* Secondary CTA — Mehr erfahren */}
          <button
            onMouseEnter={() => setHovered("info")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleChoose("info")}
            style={{
              position: "relative",
              width: "100%",
              padding: "18px 28px",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              gap: 20,
              overflow: "hidden",
              border: "1px solid",
              borderColor: hovered === "info" ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.07)",
              background: hovered === "info"
                ? "rgba(16,185,129,0.1)"
                : "rgba(255,255,255,0.03)",
              transform: hovered === "info" ? "translateY(-2px)" : "translateY(0)",
              transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              cursor: "pointer",
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.3)",
              fontSize: 22,
            }}>📖</div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: hovered === "info" ? "#a7f3d0" : "#d1d5db", marginBottom: 3 }}>
                Mehr erfahren
              </p>
              <p style={{ fontSize: 12, color: "rgba(107,114,128,0.8)", fontWeight: 500 }}>
                Für Schulen, Institutionen & Eltern
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke={hovered === "info" ? "#6ee7b7" : "rgba(75,85,99,0.7)"}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, transition: "transform 0.3s ease",
                transform: hovered === "info" ? "translateX(3px)" : "none" }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <div style={{
          marginTop: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          opacity: phase >= 5 ? 0.4 : 0,
          transition: "opacity 0.8s ease 0.4s",
        }}>
          {[
            { label: "studox.info", href: INFO_URL },
            { label: "studox.org",  href: "https://studox.org" },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{ fontSize: 11, fontWeight: 600, color: "#4b5563", letterSpacing: "0.03em",
              transition: "color 0.2s ease" }}
              onMouseEnter={(e) => (e.target.style.color = "#9ca3af")}
              onMouseLeave={(e) => (e.target.style.color = "#4b5563")}
            >{label}</a>
          ))}
          <span style={{ color: "#1f2937", fontSize: 11 }}>© 2026 StudoX</span>
        </div>
      </div>
    </div>
  );
}
