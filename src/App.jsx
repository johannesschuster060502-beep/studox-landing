/**
 * StudoX — The Landing Page
 * Mysterious. Confident. Makes you need to try it.
 * Scroll-driven marketing experience with immersive reveals.
 */
import { useState, useEffect } from "react";
import ThreeBackground from "./ThreeBackground";

const CORE_URL = "https://core.studox.eu";
const INFO_URL = "https://studox.info";

const WORLDS = [
  { id: "core",   name: "Core",   tag: "Das Zentrum",         color: "#8b5cf6", rgb: "139,92,246",  url: "https://core.studox.eu"   },
  { id: "cinema", name: "Cinema", tag: "Wissen in Bewegung",  color: "#f59e0b", rgb: "245,158,11",  url: "https://cinema.studox.eu" },
  { id: "create", name: "Create", tag: "Erschaffe & teile",   color: "#eab308", rgb: "234,179,8",   url: "https://create.studox.eu" },
  { id: "flow",   name: "Flow",   tag: "Gamifiziertes Lernen",color: "#10b981", rgb: "16,185,129",  url: "https://flow.studox.eu"   },
  { id: "clubs",  name: "Clubs",  tag: "Deine Community",     color: "#f43f5e", rgb: "244,63,94",   url: "https://clubs.studox.eu"  },
  { id: "info",   name: "Info",   tag: "Das große Bild",      color: "#06b6d4", rgb: "6,182,212",   url: "https://studox.info"      },
];

const QUALITIES = [
  {
    title: "Gamifiziert. Bis ins letzte Detail.",
    body: "XP. Quests. Duelle. Level-Ups. Nicht als Gimmick — als Grundprinzip. Jeder Fortschritt wird sichtbar, jeder Schritt zählt.",
  },
  {
    title: "Intelligent. Nicht nur digital.",
    body: "KI die versteht, wie du lernst. Nicht nur was. Ein System das sich anpasst — nicht umgekehrt.",
  },
  {
    title: "Gebaut für eine ganze Generation.",
    body: "Pan-Europäisch. Kostenlos für Schüler. Für Schulen, Institutionen und alle die glauben, dass Bildung keine Frage des Geldbeutels sein darf.",
  },
];

const STATS = [
  { value: "6+",   label: "Apps im Ökosystem" },
  { value: "EU",   label: "Pan-Europäisch" },
  { value: "100%", label: "Kostenlos für Schüler" },
];

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [bgReady, setBgReady] = useState(false);

  /* Fade in Three.js background */
  useEffect(() => {
    const t = setTimeout(() => setBgReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* Scroll-aware nav */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  /* IntersectionObserver — reveal elements on scroll */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("sx-in");
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".sx-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030310",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      {/* ── STYLES ───────────────────────────────────────────────────── */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030310; scroll-behavior: smooth; }
        button { cursor: pointer; border: none; outline: none; background: none; }
        a { color: inherit; text-decoration: none; }

        /* Hero entrance — staggered fade-up */
        @keyframes sx-hero-in {
          from { opacity: 0; transform: translateY(32px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .hero-badge  { animation: sx-hero-in 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        .hero-title  { animation: sx-hero-in 0.9s cubic-bezier(0.16,1,0.3,1) 0.8s both; }
        .hero-sub    { animation: sx-hero-in 0.8s cubic-bezier(0.16,1,0.3,1) 1.1s both; }
        .hero-cta    { animation: sx-hero-in 0.8s cubic-bezier(0.16,1,0.3,1) 1.4s both; }
        .hero-scroll { animation: sx-hero-in 0.8s cubic-bezier(0.16,1,0.3,1) 2.2s both; }

        /* Scroll reveal system */
        .sx-reveal {
          opacity: 0;
          transform: translateY(44px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1),
                      transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .sx-reveal.sx-in {
          opacity: 1;
          transform: none;
        }
        .sx-d1 { transition-delay: 0.07s; }
        .sx-d2 { transition-delay: 0.14s; }
        .sx-d3 { transition-delay: 0.21s; }
        .sx-d4 { transition-delay: 0.28s; }
        .sx-d5 { transition-delay: 0.35s; }
        .sx-d6 { transition-delay: 0.42s; }

        /* Gradient text */
        .sx-grad {
          background: linear-gradient(135deg, #fff 0%, #c4b5fd 50%, #67e8f9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Scroll indicator bounce */
        @keyframes sx-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%      { transform: translateY(10px); opacity: 0.3; }
        }

        /* Breathing for live dot */
        @keyframes sx-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px #10b981; }
          50%      { opacity: 0.5; box-shadow: 0 0 16px #10b981; }
        }

        /* Responsive grids */
        .sx-worlds-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          max-width: 620px;
          width: 100%;
        }
        .sx-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 540px;
          width: 100%;
        }
        @media (max-width: 640px) {
          .sx-worlds-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        @media (max-width: 480px) {
          .sx-stats-grid { gap: 12px; }
        }
      `}</style>

      {/* ── THREE.JS BACKGROUND (fixed, cosmic) ──────────────────────── */}
      <ThreeBackground phase={bgReady ? 5 : 0} warp={false} />

      {/* ── VIGNETTE ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 25%, transparent 15%, rgba(3,3,16,0.65) 100%)",
        }}
      />

      {/* ── TOP ACCENT LINE ──────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 1, zIndex: 51,
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5) 30%, rgba(6,182,212,0.5) 70%, transparent)",
          boxShadow: "0 0 18px rgba(139,92,246,0.3)",
        }}
      />

      {/* ── NAV BAR ──────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          padding: "14px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: scrolled ? "rgba(3,3,16,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(139,92,246,0.08)" : "1px solid transparent",
          transition: "all 0.35s ease",
        }}
      >
        <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: "-0.03em", color: "#e5e7eb" }}>
          StudoX
        </span>
        <a
          href={CORE_URL}
          style={{
            padding: "7px 18px", borderRadius: 9,
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.2)",
            fontSize: 12, fontWeight: 700, color: "#c4b5fd",
            letterSpacing: "0.01em",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139,92,246,0.2)";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(139,92,246,0.1)";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)";
          }}
        >
          Ins System &rarr;
        </a>
      </nav>

      {/* ── SCROLLABLE CONTENT ───────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 10 }}>

        {/* ════════════════════════════════════════════════════════════
            HERO — Full viewport, transparent over Three.js
            ════════════════════════════════════════════════════════════ */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center",
            padding: "80px 24px 60px",
            position: "relative",
          }}
        >
          {/* Badge */}
          <div
            className="hero-badge"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 100, marginBottom: 28,
              background: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#10b981",
              animation: "sx-pulse 2s ease-in-out infinite",
            }} />
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "rgba(196,181,253,0.8)",
            }}>
              Das nächste Kapitel
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-title sx-grad"
            style={{
              fontSize: "clamp(36px, 8vw, 72px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              marginBottom: 20,
              maxWidth: 700,
            }}
          >
            Vergiss alles, was du
            <br />
            über Lernen weißt.
          </h1>

          {/* Subtitle */}
          <p
            className="hero-sub"
            style={{
              fontSize: "clamp(15px, 2.5vw, 19px)",
              fontWeight: 400,
              color: "rgba(196,181,253,0.55)",
              lineHeight: 1.6,
              maxWidth: 440,
              marginBottom: 36,
            }}
          >
            Ein Ökosystem das Regeln bricht.
            <br />
            Bereit?
          </p>

          {/* CTA */}
          <a
            className="hero-cta"
            href={CORE_URL}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "15px 34px", borderRadius: 13,
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: 15, fontWeight: 800,
              letterSpacing: "-0.01em",
              boxShadow: "0 8px 32px rgba(139,92,246,0.3), 0 0 0 1px rgba(139,92,246,0.3)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 14px 44px rgba(139,92,246,0.4), 0 0 0 1px rgba(139,92,246,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,92,246,0.3), 0 0 0 1px rgba(139,92,246,0.3)";
            }}
          >
            Jetzt erleben
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Scroll indicator */}
          <div
            className="hero-scroll"
            style={{
              position: "absolute", bottom: 32, left: "50%",
              transform: "translateX(-50%)",
              animation: "sx-bounce 2.5s ease-in-out infinite",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(196,181,253,0.35)" strokeWidth="2" strokeLinecap="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </section>

        {/* ── Gradient transition to dark ─────────────────────────── */}
        <div style={{ height: 200, background: "linear-gradient(to bottom, transparent, #030310)" }} />

        {/* ════════════════════════════════════════════════════════════
            STATEMENT — One powerful paragraph
            ════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "#030310",
            padding: "clamp(80px, 12vh, 140px) 24px",
            display: "flex", justifyContent: "center",
          }}
        >
          <p
            className="sx-reveal"
            style={{
              fontSize: "clamp(20px, 3.5vw, 32px)",
              fontWeight: 500,
              lineHeight: 1.55,
              color: "rgba(229,231,235,0.75)",
              maxWidth: 640,
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            Wir haben nicht ein weiteres Tool gebaut.
            <br />
            <span style={{ color: "rgba(196,181,253,0.9)", fontWeight: 600 }}>
              Wir haben ein Universum erschaffen,
            </span>
            <br />
            in dem Lernen keine Pflicht mehr ist
            {" — "}
            <span style={{ color: "rgba(103,232,249,0.8)" }}>
              sondern ein Instinkt.
            </span>
          </p>
        </section>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div style={{
          width: 60, height: 1, margin: "0 auto",
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.25), transparent)",
        }} />

        {/* ════════════════════════════════════════════════════════════
            ECOSYSTEM — Mysterious tease, not explanation
            ════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "#030310",
            padding: "clamp(80px, 12vh, 140px) 24px",
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Section badge */}
          <div
            className="sx-reveal"
            style={{
              display: "inline-flex", padding: "5px 14px", borderRadius: 100,
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.15)",
              fontSize: 10, fontWeight: 700, color: "rgba(196,181,253,0.6)",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Ökosystem
          </div>

          <h2
            className="sx-reveal sx-d1"
            style={{
              fontSize: "clamp(28px, 5.5vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 14,
            }}
          >
            Sechs Welten.
            <br />
            <span className="sx-grad">Ein System.</span>
          </h2>

          <p
            className="sx-reveal sx-d2"
            style={{
              fontSize: "clamp(14px, 2vw, 16px)",
              color: "rgba(156,163,175,0.55)",
              marginBottom: 48,
              maxWidth: 400,
              lineHeight: 1.5,
            }}
          >
            Jede Welt hat ihre eigene Kraft.
            <br />
            Zusammen sind sie unaufhaltbar.
          </p>

          {/* Worlds grid */}
          <div className="sx-worlds-grid" style={{ marginBottom: 40 }}>
            {WORLDS.map((w, i) => (
              <a
                key={w.id}
                href={w.url}
                className={`sx-reveal sx-d${i + 1}`}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", borderRadius: 13,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `rgba(${w.rgb},0.3)`;
                  e.currentTarget.style.background = `rgba(${w.rgb},0.06)`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.transform = "";
                }}
              >
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                  background: w.color,
                  boxShadow: `0 0 10px ${w.color}`,
                }} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e5e7eb" }}>
                    {w.name}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: "rgba(156,163,175,0.5)" }}>
                    {w.tag}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <p
            className="sx-reveal"
            style={{
              fontSize: 13, fontWeight: 500, fontStyle: "italic",
              color: "rgba(156,163,175,0.35)", letterSpacing: "0.02em",
            }}
          >
            Das ist erst der Anfang.
          </p>
        </section>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div style={{
          width: 60, height: 1, margin: "0 auto",
          background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.2), transparent)",
        }} />

        {/* ════════════════════════════════════════════════════════════
            QUALITIES — Three powerful statements
            ════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "#030310",
            padding: "clamp(80px, 10vh, 120px) 24px",
          }}
        >
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            {QUALITIES.map((q, i) => (
              <div
                key={i}
                className="sx-reveal"
                style={{
                  textAlign: "center",
                  marginBottom: i < QUALITIES.length - 1 ? "clamp(64px, 10vh, 100px)" : 0,
                }}
              >
                <h3
                  style={{
                    fontSize: "clamp(22px, 4vw, 32px)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.15,
                    marginBottom: 14,
                    color: "#f0eef5",
                  }}
                >
                  {q.title}
                </h3>
                <p
                  style={{
                    fontSize: "clamp(14px, 2vw, 16px)",
                    fontWeight: 400,
                    color: "rgba(156,163,175,0.55)",
                    lineHeight: 1.6,
                    maxWidth: 440,
                    margin: "0 auto",
                  }}
                >
                  {q.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div style={{
          width: 60, height: 1, margin: "0 auto",
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.2), transparent)",
        }} />

        {/* ════════════════════════════════════════════════════════════
            STATS — Three big numbers
            ════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "#030310",
            padding: "clamp(80px, 12vh, 140px) 24px",
            display: "flex", justifyContent: "center",
          }}
        >
          <div className="sx-stats-grid">
            {STATS.map((s, i) => (
              <div
                key={i}
                className={`sx-reveal sx-d${i + 1}`}
                style={{ textAlign: "center" }}
              >
                <div
                  className="sx-grad"
                  style={{
                    fontSize: "clamp(36px, 7vw, 56px)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 11, fontWeight: 600,
                    color: "rgba(156,163,175,0.45)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            FINAL CTA — The closer
            ════════════════════════════════════════════════════════════ */}
        <section
          style={{
            background: "#030310",
            padding: "clamp(80px, 14vh, 160px) 24px clamp(60px, 10vh, 120px)",
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2
            className="sx-reveal"
            style={{
              fontSize: "clamp(26px, 5vw, 44px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
              marginBottom: 36,
              maxWidth: 520,
              color: "#f0eef5",
            }}
          >
            Die Zukunft der Bildung
            <br />
            ist kein Versprechen.
            <br />
            <span className="sx-grad">Sie ist online.</span>
          </h2>

          <div
            className="sx-reveal sx-d1"
            style={{
              display: "flex", alignItems: "center", gap: 14,
              flexWrap: "wrap", justifyContent: "center",
            }}
          >
            {/* Primary CTA */}
            <a
              href={CORE_URL}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 30px", borderRadius: 13,
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                color: "#fff", fontSize: 15, fontWeight: 800,
                boxShadow: "0 8px 32px rgba(139,92,246,0.3)",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 14px 44px rgba(139,92,246,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(139,92,246,0.3)";
              }}
            >
              Ins System
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            {/* Secondary CTA */}
            <a
              href={INFO_URL}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "14px 26px", borderRadius: 13,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#9ca3af", fontSize: 14, fontWeight: 600,
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "#9ca3af";
              }}
            >
              Mehr erfahren
            </a>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            FOOTER
            ════════════════════════════════════════════════════════════ */}
        <footer
          style={{
            background: "#030310",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            padding: "32px 24px",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 20, flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, color: "#374151", letterSpacing: "-0.02em" }}>
            StudoX
          </span>
          {[
            { label: "studox.info", href: INFO_URL },
            { label: "studox.org", href: "https://studox.org" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: 11, fontWeight: 600, color: "#374151",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#9ca3af")}
              onMouseLeave={(e) => (e.target.style.color = "#374151")}
            >
              {label}
            </a>
          ))}
          <span style={{ fontSize: 10, color: "#1f2937" }}>
            © 2026 StudoX. Made in Europe.
          </span>
        </footer>
      </div>
    </div>
  );
}
