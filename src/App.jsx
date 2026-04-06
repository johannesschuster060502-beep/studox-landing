/**
 * StudoX — The Immersive Gateway
 * Theatrical spotlight reveal -> World portal selection -> Warp entry
 *
 * Phase system:
 *   0  Black void
 *   1  Spotlight beam appears (tiny circle of light)
 *   2  Spotlight expands, Three.js scene revealed
 *   3  "STUDOX" glitch-assembles with chromatic aberration
 *   4  Tagline materializes
 *   5  Portal cards materialize (staggered)
 *   6  Fully interactive — mouse spotlight, breathing
 *   7  Warp exit into chosen world
 */
import { useState, useEffect, useRef, useCallback } from "react";
import ThreeBackground from "./ThreeBackground";

/* ═══════════════════════════════════════════════════════════════════════════
   ECOSYSTEM WORLDS
   ═══════════════════════════════════════════════════════════════════════════ */
const WORLDS = [
  { id: "core",   name: "Core",   tag: "Das Zentrum",       color: "#8b5cf6", rgb: "139,92,246",  url: "https://core.studox.eu"   },
  { id: "cinema", name: "Cinema", tag: "Entdecke Wissen",   color: "#f59e0b", rgb: "245,158,11",  url: "https://cinema.studox.eu" },
  { id: "create", name: "Create", tag: "Erschaffe Inhalte", color: "#eab308", rgb: "234,179,8",   url: "https://create.studox.eu" },
  { id: "flow",   name: "Flow",   tag: "Lerne smart",       color: "#10b981", rgb: "16,185,129",  url: "https://flow.studox.eu"   },
  { id: "clubs",  name: "Clubs",  tag: "Deine Community",   color: "#f43f5e", rgb: "244,63,94",   url: "https://clubs.studox.eu"  },
  { id: "info",   name: "Info",   tag: "Erfahre mehr",      color: "#06b6d4", rgb: "6,182,212",   url: "https://studox.info"      },
];

/* ═══════════════════════════════════════════════════════════════════════════
   WORLD ICONS — Clean minimal SVGs for each portal
   ═══════════════════════════════════════════════════════════════════════════ */
function WorldIcon({ id, color = "#fff", size = 28 }) {
  const p = { width: size, height: size, viewBox: "0 0 32 32", fill: "none" };
  switch (id) {
    case "core":
      return (
        <svg {...p}>
          <circle cx="16" cy="16" r="3.5" fill={color} />
          <ellipse cx="16" cy="16" rx="13" ry="5" stroke={color} strokeWidth="1.2" opacity=".65" />
          <ellipse cx="16" cy="16" rx="13" ry="5" stroke={color} strokeWidth="1" opacity=".45" transform="rotate(60 16 16)" />
          <ellipse cx="16" cy="16" rx="13" ry="5" stroke={color} strokeWidth="1" opacity=".45" transform="rotate(-60 16 16)" />
        </svg>
      );
    case "cinema":
      return (
        <svg {...p}>
          <rect x="4" y="6" width="24" height="16" rx="2.5" stroke={color} strokeWidth="1.3" />
          <polygon points="13,10 22,14 13,18" fill={color} />
          <line x1="10" y1="26" x2="22" y2="26" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".45" />
        </svg>
      );
    case "create":
      return (
        <svg {...p}>
          <path d="M16,3 C17,11 21,15 29,16 C21,17 17,21 16,29 C15,21 11,17 3,16 C11,15 15,11 16,3Z" fill={color} />
        </svg>
      );
    case "flow":
      return (
        <svg {...p}>
          <path d="M18,4 L12,14 H20 L14,28" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "clubs":
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="3.5" fill={color} opacity=".65" />
          <circle cx="21" cy="11" r="3.5" fill={color} />
          <path d="M4,28 C4,22 7,18 11,18 C13,18 15,19 16,20.5 C17,19 19,18 21,18 C25,18 28,22 28,28" fill={color} opacity=".3" />
        </svg>
      );
    case "info":
      return (
        <svg {...p}>
          <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="1.3" />
          <circle cx="16" cy="10.5" r="1.5" fill={color} />
          <line x1="16" y1="15" x2="16" y2="23" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PORTAL CARD — Glass morphism + 3D perspective tilt + colored glow
   ═══════════════════════════════════════════════════════════════════════════ */
function PortalCard({ world, visible, delay, onSelect, warping }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(false);

  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.04)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  }, []);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "";
    setHover(false);
  }, []);

  const isChosen = warping?.id === world.id;

  return (
    <button
      ref={ref}
      className="sx-card"
      onClick={() => onSelect(world)}
      onMouseEnter={() => setHover(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        width: "100%",
        borderRadius: 20,
        background: hover
          ? `radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(${world.rgb},0.12) 0%, rgba(255,255,255,0.035) 70%)`
          : "rgba(255,255,255,0.025)",
        border: `1px solid rgba(${world.rgb}, ${hover ? 0.45 : 0.1})`,
        boxShadow: isChosen
          ? `0 0 60px rgba(${world.rgb},0.5), 0 0 120px rgba(${world.rgb},0.2)`
          : hover
            ? `0 0 40px rgba(${world.rgb},0.15), 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`
            : "0 4px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        cursor: "pointer",
        outline: "none",
        color: "#fff",
        fontFamily: "inherit",
        overflow: "hidden",
        opacity: visible ? (warping ? (isChosen ? 1 : 0.3) : 1) : 0,
        transition: warping
          ? "opacity 0.4s ease, border-color 0.35s, box-shadow 0.35s, background 0.35s, transform 0.12s"
          : `border-color 0.35s, box-shadow 0.35s, background 0.35s, opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.12s`,
      }}
    >
      {/* Hover inner glow */}
      {hover && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 20,
            pointerEvents: "none",
            background: `radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(${world.rgb},0.07) 0%, transparent 55%)`,
          }}
        />
      )}

      {/* Icon container */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `rgba(${world.rgb}, 0.1)`,
          border: `1px solid rgba(${world.rgb}, 0.2)`,
          boxShadow: hover ? `0 0 24px rgba(${world.rgb}, 0.25)` : "none",
          transition: "box-shadow 0.35s",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <WorldIcon id={world.id} color={world.color} size={26} />
      </div>

      {/* Name + tagline */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            marginBottom: 3,
            color: hover ? world.color : "#e5e7eb",
            transition: "color 0.3s",
          }}
        >
          {world.name}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(156,163,175,0.6)",
            letterSpacing: "0.02em",
          }}
        >
          {world.tag}
        </div>
      </div>

      {/* Entry hint — visible on hover only */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 10,
          fontWeight: 700,
          color: hover ? `rgba(${world.rgb},0.8)` : "transparent",
          transition: "color 0.3s, transform 0.3s",
          transform: hover ? "translateY(0)" : "translateY(4px)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        Eintauchen
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOGIN GATE — "Bereit für den Sprung?" auth overlay
   ═══════════════════════════════════════════════════════════════════════════ */
function LoginGate({ world, onSkip, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(3,3,16,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        animation: "sx-fade-in 0.25s ease",
        overflowY: "auto",
        padding: "24px 16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(400px, 100%)",
          padding: "36px 28px 28px",
          borderRadius: 24,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid rgba(${world.rgb}, 0.2)`,
          boxShadow: `0 0 80px rgba(${world.rgb}, 0.1), 0 40px 80px rgba(0,0,0,0.5)`,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          textAlign: "center",
          position: "relative",
          animation: "sx-modal-in 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 30,
            height: 30,
            borderRadius: 9,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#6b7280",
            fontFamily: "inherit",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* World icon */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 17,
            margin: "0 auto 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `rgba(${world.rgb}, 0.1)`,
            border: `1px solid rgba(${world.rgb}, 0.22)`,
            boxShadow: `0 0 30px rgba(${world.rgb}, 0.15)`,
          }}
        >
          <WorldIcon id={world.id} color={world.color} size={28} />
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 5, color: "#fff", fontFamily: "inherit" }}>
          StudoX {world.name}
        </h2>
        <p style={{ fontSize: 13, color: "rgba(156,163,175,0.65)", marginBottom: 26, lineHeight: 1.5 }}>
          Melde dich an, um dein Erlebnis
          <br />
          zu personalisieren und zu speichern.
        </p>

        {/* Login CTA */}
        <button
          onClick={() => {
            window.location.href = `https://core.studox.eu?redirect=${encodeURIComponent(world.url)}`;
          }}
          style={{
            width: "100%",
            padding: "13px 20px",
            borderRadius: 13,
            background: `linear-gradient(135deg, ${world.color}, ${world.color}cc)`,
            color: "#fff",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: `0 8px 28px rgba(${world.rgb}, 0.3)`,
            marginBottom: 14,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `0 12px 36px rgba(${world.rgb}, 0.4)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = `0 8px 28px rgba(${world.rgb}, 0.3)`;
          }}
        >
          Anmelden / Registrieren
        </button>

        {/* Skip */}
        <button
          onClick={onSkip}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(156,163,175,0.5)",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            transition: "color 0.2s",
            padding: "6px 0",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#9ca3af")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(156,163,175,0.5)")}
        >
          Ohne Anmeldung fortfahren
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN APP — Theatrical orchestrator
   ═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [phase, setPhase] = useState(0);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [gate, setGate] = useState(null);
  const [warping, setWarping] = useState(null);

  /* ── Phase timeline ──────────────────────────────────────────── */
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 150),   // spotlight beam
      setTimeout(() => setPhase(2), 700),   // spotlight expands
      setTimeout(() => setPhase(3), 1500),  // STUDOX glitch-assembles
      setTimeout(() => setPhase(4), 2400),  // tagline
      setTimeout(() => setPhase(5), 3000),  // portals materialize
      setTimeout(() => setPhase(6), 4000),  // fully interactive
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  /* ── Mouse tracking for ambient spotlight ────────────────────── */
  useEffect(() => {
    const h = (e) =>
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  /* ── Portal selection ────────────────────────────────────────── */
  const selectWorld = useCallback((world) => {
    if (world.id === "info") {
      doWarp(world);
    } else {
      setGate(world);
    }
  }, []);

  /* ── Warp into chosen world ──────────────────────────────────── */
  const doWarp = useCallback((world) => {
    setGate(null);
    setWarping(world);
    setPhase(7);
    setTimeout(() => {
      window.location.href = world.url;
    }, 1400);
  }, []);

  /* ── Spotlight scale: 0 -> tiny beam -> expand -> fully open ── */
  const spotScale =
    phase === 0 ? 0 : phase === 1 ? 0.03 : phase === 2 ? 0.28 : 1.15;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#030310",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── STYLES ───────────────────────────────────────────────── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030310; color: #fff; }
        button { cursor: pointer; border: none; outline: none; background: none; }
        a { color: inherit; text-decoration: none; }

        /* Glitch-in: chromatic aberration letter assembly */
        @keyframes sx-glitch-in {
          0%   { opacity: 0; transform: translateX(10px) skewX(15deg);
                 text-shadow: -4px 0 #ff003c, 4px 0 #00d4ff; filter: blur(4px); }
          18%  { opacity: 1; transform: translateX(-5px) skewX(-8deg);
                 text-shadow: 3px 0 #ff003c, -3px 0 #00d4ff; filter: blur(1px); }
          38%  { transform: translateX(3px) skewX(4deg);
                 text-shadow: -2px 0 #ff003c, 2px 0 #00d4ff; }
          58%  { transform: translateX(-1px) skewX(-1deg);
                 text-shadow: 1px 0 #ff003c, -1px 0 #00d4ff; filter: blur(0); }
          78%  { transform: translateX(0.5px); text-shadow: 0 0 transparent; }
          100% { opacity: 1; transform: none; text-shadow: none; filter: none; }
        }

        /* Shimmer sweep after assembly */
        @keyframes sx-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .sx-shimmer {
          background: linear-gradient(90deg,
            #c4b5fd 0%, #e9d5ff 18%, #fff 42%,
            #67e8f9 58%, #e9d5ff 80%, #c4b5fd 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: sx-shimmer 5s linear infinite;
        }

        /* Subtle breathing */
        @keyframes sx-breathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.012); }
        }

        /* Utilities */
        @keyframes sx-fade-in  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sx-modal-in {
          from { opacity: 0; transform: scale(0.93) translateY(16px); }
          to   { opacity: 1; transform: none; }
        }

        /* Warp exit */
        .sx-warp-out { animation: sx-warp-content 1.4s ease-in forwards !important; }
        @keyframes sx-warp-content {
          0%   { filter: blur(0) brightness(1); transform: scale(1); opacity: 1; }
          35%  { filter: blur(4px) brightness(1.4); transform: scale(1.02); }
          65%  { filter: blur(10px) brightness(1.8); transform: scale(1.05); opacity: 0.6; }
          100% { filter: blur(24px) brightness(2.5); transform: scale(1.12); opacity: 0; }
        }
        @keyframes sx-warp-flash {
          0%   { opacity: 0; }
          70%  { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes sx-warp-glow {
          0%   { opacity: 0; transform: scale(0.8); }
          50%  { opacity: 0.6; transform: scale(1.2); }
          100% { opacity: 0.9; transform: scale(2); }
        }

        /* Responsive portal grid */
        .sx-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          width: 100%;
          max-width: 680px;
        }
        .sx-card { padding: 28px 16px 20px; }
        .sx-card:focus-visible {
          outline: 2px solid rgba(139,92,246,0.5);
          outline-offset: 2px;
        }
        @media (max-width: 720px) {
          .sx-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; max-width: 400px; }
          .sx-card { padding: 22px 12px 16px; }
        }
        @media (max-width: 380px) {
          .sx-grid { gap: 8px; }
          .sx-card { padding: 18px 10px 14px; }
        }
      `}</style>

      {/* ── THREE.JS BACKGROUND ──────────────────────────────────── */}
      <ThreeBackground phase={phase} warp={phase >= 7} />

      {/* ── SPOTLIGHT REVEAL — expanding circle that unveils the scene */}
      <div
        style={{
          position: "fixed",
          top: "45%",
          left: "50%",
          width: "150vmax",
          height: "150vmax",
          borderRadius: "50%",
          background: "transparent",
          boxShadow: "0 0 80px 9999px #030310",
          transform: `translate(-50%, -50%) scale(${spotScale})`,
          transition:
            phase <= 1
              ? "transform 0.6s cubic-bezier(0.16,1,0.3,1)"
              : "transform 1.6s cubic-bezier(0.16,1,0.3,1)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />

      {/* ── MOUSE SPOTLIGHT — subtle ambient tracking ────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
          background: `radial-gradient(650px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(139,92,246,0.04) 0%, rgba(6,182,212,0.012) 40%, transparent 70%)`,
          opacity: phase >= 6 && !warping ? 1 : 0,
          transition: "opacity 1.2s ease",
        }}
      />

      {/* ── VIGNETTE ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 5,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(3,3,16,0.55) 100%)",
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />

      {/* ── TOP ACCENT LINE ──────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          zIndex: 6,
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.5) 30%, rgba(6,182,212,0.5) 70%, transparent)",
          boxShadow: "0 0 18px rgba(139,92,246,0.35)",
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 0.8s ease 0.2s",
        }}
      />

      {/* ── BOTTOM ACCENT LINE ───────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          zIndex: 6,
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.3) 30%, rgba(6,182,212,0.3) 70%, transparent)",
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 0.8s ease 0.4s",
        }}
      />

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div
        className={warping ? "sx-warp-out" : ""}
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100dvh",
          width: "100%",
          padding: "32px 20px",
        }}
      >
        {/* ── STUDOX wordmark ──────────────────────────────────── */}
        <div
          style={{
            marginBottom: 8,
            textAlign: "center",
            animation:
              phase >= 5
                ? "sx-breathe 4.5s ease-in-out infinite"
                : "none",
          }}
        >
          {"STUDOX".split("").map((ch, i) => (
            <span
              key={i}
              className={phase >= 4 ? "sx-shimmer" : ""}
              style={{
                display: "inline-block",
                fontSize: "clamp(44px, 9vw, 76px)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                opacity: phase >= 3 ? 1 : 0,
                animation:
                  phase >= 3
                    ? `sx-glitch-in 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 65 + 80}ms both`
                    : "none",
                color: "#fff",
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* ── Tagline ──────────────────────────────────────────── */}
        <p
          style={{
            fontSize: "clamp(12px, 2.6vw, 16px)",
            fontWeight: 500,
            color: "rgba(196,181,253,0.55)",
            marginBottom: 44,
            textAlign: "center",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          Wähle deine Welt
        </p>

        {/* ── Portal grid ──────────────────────────────────────── */}
        <div className="sx-grid" style={{ marginBottom: 40 }}>
          {WORLDS.map((w, i) => (
            <PortalCard
              key={w.id}
              world={w}
              visible={phase >= 5}
              delay={i * 100}
              onSelect={selectWorld}
              warping={warping}
            />
          ))}
        </div>

        {/* ── Status + footer ──────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            opacity: phase >= 6 ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}
        >
          {/* Live pulse */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 8px #10b981",
                animation: "sx-breathe 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(52,211,153,0.55)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              System Live
            </span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {[
              { label: "studox.info", href: "https://studox.info" },
              { label: "studox.org", href: "https://studox.org" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#374151",
                  letterSpacing: "0.03em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#9ca3af")}
                onMouseLeave={(e) => (e.target.style.color = "#374151")}
              >
                {label}
              </a>
            ))}
            <span style={{ color: "#1f2937", fontSize: 10 }}>© 2026 StudoX</span>
          </div>
        </div>
      </div>

      {/* ── LOGIN GATE ───────────────────────────────────────────── */}
      {gate && (
        <LoginGate
          world={gate}
          onSkip={() => doWarp(gate)}
          onClose={() => setGate(null)}
        />
      )}

      {/* ── WARP OVERLAY ─────────────────────────────────────────── */}
      {warping && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            pointerEvents: "none",
          }}
        >
          {/* Radial color burst */}
          <div
            style={{
              position: "absolute",
              inset: "-50%",
              background: `radial-gradient(circle at 50% 50%, rgba(${warping.rgb},0.4) 0%, transparent 55%)`,
              animation: "sx-warp-glow 1.4s ease-in forwards",
            }}
          />
          {/* White flash */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#fff",
              animation: "sx-warp-flash 1.4s ease-in forwards",
            }}
          />
        </div>
      )}
    </div>
  );
}
