/**
 * StudoX — Cinematic Reveal Experience
 * 60-second immersive reveal with language selection, particle effects,
 * epic sound design, and redirect to studox.info.
 * Converted from standalone HTML to React.
 */
import { useState, useEffect, useRef, useCallback } from "react";

const I18N = {
  de: {
    whisper: "In einer Welt voller Lärm…",
    s2_1: "Lernen wurde",
    s2_2: "vergessen.",
    s2_3: "Bis jetzt.",
    w1: "Wissen.", w2: "Fortschritt.", w3: "Skill.",
    w4: "Ruhm.", w5: "Entfesselt.", w6: "Gamifiziert.",
    pre: "Wir präsentieren",
    tagline: "Lerne. Level up. Führe.",
    f1: "Quests", f2: "Echter Fortschritt", f3: "Wettkampf", f4: "Auszeichnung",
    cta: "Die Zukunft des Lernens beginnt jetzt",
  },
  en: {
    whisper: "In a world of noise…",
    s2_1: "Learning became",
    s2_2: "forgotten.",
    s2_3: "Until now.",
    w1: "Knowledge.", w2: "Progress.", w3: "Skill.",
    w4: "Glory.", w5: "Unleashed.", w6: "Gamified.",
    pre: "Introducing",
    tagline: "Learn. Level Up. Lead.",
    f1: "Quests", f2: "Real Progress", f3: "Compete", f4: "Distinction",
    cta: "The Future of Learning Begins Now",
  },
};

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function App() {
  const [started, setStarted] = useState(false);
  const [lang, setLang] = useState("de");
  const [showReplay, setShowReplay] = useState(false);

  const stageCanvasRef = useRef(null);
  const startCanvasRef = useRef(null);
  const glitchRef = useRef(null);
  const startRunningRef = useRef(true);
  const actxRef = useRef(null);

  const dict = I18N[lang];

  /* ── Start canvas — premium drifting embers ───────────────────────── */
  useEffect(() => {
    const sc = startCanvasRef.current;
    if (!sc) return;
    const sx = sc.getContext("2d");
    let SW = (sc.width = window.innerWidth);
    let SH = (sc.height = window.innerHeight);

    const embers = [];
    const sparks = [];
    for (let i = 0; i < 60; i++)
      embers.push({
        x: Math.random() * SW, y: Math.random() * SH,
        vy: -0.15 - Math.random() * 0.3, vx: (Math.random() - 0.5) * 0.15,
        r: 0.8 + Math.random() * 1.8, a: 0.2 + Math.random() * 0.5,
        ph: Math.random() * Math.PI * 2,
      });
    for (let i = 0; i < 25; i++)
      sparks.push({
        x: Math.random() * SW, y: Math.random() * SH,
        vy: -0.4 - Math.random() * 0.6, vx: (Math.random() - 0.5) * 0.2,
        r: 0.4 + Math.random() * 0.6, a: 0.4 + Math.random() * 0.5,
        life: Math.random(),
      });

    const onResize = () => { SW = sc.width = window.innerWidth; SH = sc.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    let raf;
    const draw = () => {
      if (!startRunningRef.current) return;
      raf = requestAnimationFrame(draw);
      sx.fillStyle = "rgba(3,4,10,.12)";
      sx.fillRect(0, 0, SW, SH);

      embers.forEach((e) => {
        e.y += e.vy;
        e.x += e.vx + Math.sin(e.y * 0.005 + e.ph) * 0.25;
        e.ph += 0.01;
        if (e.y < -10) { e.y = SH + 10; e.x = Math.random() * SW; }
        const pulse = 0.7 + Math.sin(e.ph * 2) * 0.3;
        const grd = sx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 5);
        grd.addColorStop(0, `rgba(245,217,122,${e.a * pulse})`);
        grd.addColorStop(0.4, `rgba(212,175,55,${e.a * pulse * 0.5})`);
        grd.addColorStop(1, "rgba(212,175,55,0)");
        sx.fillStyle = grd;
        sx.beginPath(); sx.arc(e.x, e.y, e.r * 5, 0, 7); sx.fill();
      });

      sparks.forEach((s) => {
        s.y += s.vy; s.x += s.vx; s.life += 0.008;
        if (s.y < 0 || s.life > 1) { s.y = SH + 5; s.x = Math.random() * SW; s.life = 0; }
        const fade = Math.sin(s.life * Math.PI);
        sx.beginPath(); sx.arc(s.x, s.y, s.r, 0, 7);
        sx.fillStyle = `rgba(255,250,230,${s.a * fade})`; sx.fill();
      });
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ── Glitch text scramble on start screen ──────────────────────────── */
  useEffect(() => {
    const originalTitle = "STUDOX";
    const glyphs = "!<>-_/[]=+*?#ΞΩΣΦΨΔΛξ█▓▒░";

    const scramble = () => {
      if (!startRunningRef.current || !glitchRef.current) return;
      let frame = 0;
      const dur = 20;
      const iv = setInterval(() => {
        let out = "";
        for (let i = 0; i < originalTitle.length; i++) {
          if (frame > dur - i * 1.5) out += originalTitle[i];
          else out += glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        if (glitchRef.current) {
          glitchRef.current.textContent = out;
          glitchRef.current.setAttribute("data-text", out);
        }
        frame++;
        if (frame > dur + originalTitle.length) {
          clearInterval(iv);
          if (glitchRef.current) {
            glitchRef.current.textContent = originalTitle;
            glitchRef.current.setAttribute("data-text", originalTitle);
          }
        }
      }, 50);
    };

    const t1 = setTimeout(scramble, 3000);
    const iv = setInterval(scramble, 10000);
    return () => { clearTimeout(t1); clearInterval(iv); };
  }, []);

  /* ── Stage particles ───────────────────────────────────────────────── */
  useEffect(() => {
    if (!started) return;
    const c = stageCanvasRef.current;
    if (!c) return;
    const x = c.getContext("2d");
    let W = (c.width = window.innerWidth);
    let H = (c.height = window.innerHeight);

    const parts = [];
    const dust = [];
    for (let i = 0; i < 120; i++)
      parts.push({
        x: Math.random() * W, y: Math.random() * H,
        vy: -0.1 - Math.random() * 0.4, vx: (Math.random() - 0.5) * 0.1,
        r: Math.random() * 1.8, a: Math.random() * 0.6,
      });
    for (let i = 0; i < 40; i++)
      dust.push({
        x: Math.random() * W, y: Math.random() * H,
        vy: 0.05 + Math.random() * 0.15,
        r: 0.5 + Math.random() * 1, a: Math.random() * 0.3,
      });

    const onResize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    let raf;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      x.fillStyle = "rgba(3,4,10,.18)";
      x.fillRect(0, 0, W, H);

      parts.forEach((p) => {
        p.y += p.vy; p.x += p.vx + Math.sin(p.y * 0.01) * 0.3;
        if (p.y < 0) { p.y = H; p.x = Math.random() * W; }
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7);
        const grd = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grd.addColorStop(0, `rgba(245,217,122,${p.a})`);
        grd.addColorStop(1, "rgba(212,175,55,0)");
        x.fillStyle = grd; x.fill();
      });

      dust.forEach((d) => {
        d.y += d.vy;
        if (d.y > H) { d.y = 0; d.x = Math.random() * W; }
        x.beginPath(); x.arc(d.x, d.y, d.r, 0, 7);
        x.fillStyle = `rgba(255,255,255,${d.a})`; x.fill();
      });
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [started]);

  /* ── Epic sound ─────────────────────────────────────────────────────── */
  const epicSound = useCallback(() => {
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    actxRef.current = actx;
    const t0 = actx.currentTime;
    const master = actx.createGain(); master.gain.value = 0.45;
    const dly = actx.createDelay(2); dly.delayTime.value = 0.18;
    const fb = actx.createGain(); fb.gain.value = 0.35;
    const wet = actx.createGain(); wet.gain.value = 0.25;
    dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(actx.destination);
    master.connect(dly);
    master.connect(actx.destination);

    function drone(freq, start, dur, vol, type = "sawtooth", cutoff = 300) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = freq;
      const f = actx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = cutoff; f.Q.value = 2;
      o.connect(f); f.connect(g); g.connect(master);
      g.gain.setValueAtTime(0, t0 + start);
      g.gain.linearRampToValueAtTime(vol, t0 + start + 2.5);
      g.gain.linearRampToValueAtTime(vol, t0 + start + dur - 3);
      g.gain.linearRampToValueAtTime(0, t0 + start + dur);
      o.start(t0 + start); o.stop(t0 + start + dur + 0.1);
    }
    drone(36.7, 0, 60, 0.35, "sine", 200);
    drone(55, 0, 60, 0.28);
    drone(82.4, 8, 52, 0.22);
    drone(110, 18, 42, 0.18);

    function choirVoice(freq, start, dur, vol, detune = 0) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "triangle"; o.frequency.value = freq; o.detune.value = detune;
      const f = actx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 2000;
      const lfo = actx.createOscillator(), lfoG = actx.createGain();
      lfo.frequency.value = 4.5; lfoG.gain.value = 3;
      lfo.connect(lfoG); lfoG.connect(o.detune);
      o.connect(f); f.connect(g); g.connect(master);
      g.gain.setValueAtTime(0, t0 + start);
      g.gain.linearRampToValueAtTime(vol, t0 + start + 1.5);
      g.gain.linearRampToValueAtTime(vol, t0 + start + dur - 2);
      g.gain.linearRampToValueAtTime(0, t0 + start + dur);
      o.start(t0 + start); o.stop(t0 + start + dur + 0.1);
      lfo.start(t0 + start); lfo.stop(t0 + start + dur + 0.1);
    }

    function riser(start, dur) {
      const buf = actx.createBuffer(1, actx.sampleRate * dur, actx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
      const src = actx.createBufferSource(); src.buffer = buf;
      const f = actx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 2;
      f.frequency.setValueAtTime(200, t0 + start);
      f.frequency.exponentialRampToValueAtTime(8000, t0 + start + dur);
      const g = actx.createGain();
      g.gain.setValueAtTime(0, t0 + start);
      g.gain.linearRampToValueAtTime(0.25, t0 + start + dur * 0.9);
      g.gain.linearRampToValueAtTime(0, t0 + start + dur);
      src.connect(f); f.connect(g); g.connect(master);
      src.start(t0 + start); src.stop(t0 + start + dur);
    }
    riser(22, 8);

    function brass(freq, start, dur, vol) {
      const o1 = actx.createOscillator(), o2 = actx.createOscillator(), g = actx.createGain();
      o1.type = "sawtooth"; o2.type = "sawtooth";
      o1.frequency.value = freq; o2.frequency.value = freq; o2.detune.value = 8;
      const f = actx.createBiquadFilter(); f.type = "lowpass";
      f.frequency.setValueAtTime(300, t0 + start);
      f.frequency.linearRampToValueAtTime(2500, t0 + start + dur * 0.8);
      o1.connect(f); o2.connect(f); f.connect(g); g.connect(master);
      g.gain.setValueAtTime(0, t0 + start);
      g.gain.linearRampToValueAtTime(vol, t0 + start + dur * 0.85);
      g.gain.linearRampToValueAtTime(0, t0 + start + dur);
      o1.start(t0 + start); o1.stop(t0 + start + dur);
      o2.start(t0 + start); o2.stop(t0 + start + dur);
    }
    brass(110, 22, 8, 0.22);
    brass(164.8, 24, 6, 0.2);
    brass(220, 26, 4, 0.18);

    function timpani(time, freq, vol) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, t0 + time);
      o.frequency.exponentialRampToValueAtTime(freq * 0.7, t0 + time + 0.3);
      g.gain.setValueAtTime(vol, t0 + time);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + time + 0.5);
      o.connect(g); g.connect(master);
      o.start(t0 + time); o.stop(t0 + time + 0.5);
    }
    for (let i = 0; i < 12; i++) timpani(28 + i * 0.16, 55, 0.4 - i * 0.02);
    timpani(29.85, 55, 0.6);

    function cymbal(time, vol) {
      const buf = actx.createBuffer(1, actx.sampleRate * 1.5, actx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
      const src = actx.createBufferSource(); src.buffer = buf;
      const f = actx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 4000;
      const g = actx.createGain(); g.gain.value = vol;
      src.connect(f); f.connect(g); g.connect(master);
      src.start(t0 + time);
    }
    cymbal(30, 0.35);

    function hit(time, freq, vol, type = "triangle") {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t0 + time);
      o.frequency.exponentialRampToValueAtTime(freq * 0.5, t0 + time + 1.8);
      g.gain.setValueAtTime(vol, t0 + time);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + time + 2.5);
      o.connect(g); g.connect(master);
      o.start(t0 + time); o.stop(t0 + time + 2.5);
    }
    hit(30, 36.7, 0.7, "sine");
    hit(30, 55, 0.6);
    hit(30, 82.4, 0.5);
    hit(30, 110, 0.4);
    hit(30, 164.8, 0.3, "sawtooth");
    hit(30, 220, 0.25, "sawtooth");

    function kick(time, vol = 0.65) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.frequency.setValueAtTime(180, t0 + time);
      o.frequency.exponentialRampToValueAtTime(35, t0 + time + 0.5);
      g.gain.setValueAtTime(vol, t0 + time);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + time + 1);
      o.connect(g); g.connect(master);
      o.start(t0 + time); o.stop(t0 + time + 1);
    }
    for (let i = 0; i < 14; i++) kick(30 + i * 2);

    const chordStart = 30, chordDur = 30;
    [130.8, 130.8, 261.6].forEach((f, i) => choirVoice(f, chordStart, chordDur, 0.1, (i - 1) * 5));
    [155.6, 155.6, 311.1].forEach((f, i) => choirVoice(f, chordStart + 1, chordDur - 1, 0.09, (i - 1) * 5));
    [196, 196, 392].forEach((f, i) => choirVoice(f, chordStart + 1.5, chordDur - 1.5, 0.09, (i - 1) * 5));
    choirVoice(523.2, 36, 24, 0.07, 0);
    choirVoice(523.2, 36, 24, 0.06, 8);
    choirVoice(659.3, 40, 20, 0.05, 0);

    // Final pad
    const oFinal = actx.createOscillator(), gFinal = actx.createGain();
    oFinal.type = "sine"; oFinal.frequency.value = 783.99;
    gFinal.gain.setValueAtTime(0, t0 + 52);
    gFinal.gain.linearRampToValueAtTime(0.08, t0 + 58);
    gFinal.gain.linearRampToValueAtTime(0, t0 + 60);
    oFinal.connect(gFinal); gFinal.connect(master);
    oFinal.start(t0 + 52); oFinal.stop(t0 + 60);

    hit(55, 55, 0.5, "sine");
    hit(55, 110, 0.35);
    cymbal(55, 0.25);
  }, []);

  /* ── Start reveal ──────────────────────────────────────────────────── */
  const startReveal = useCallback((chosenLang) => {
    setLang(chosenLang);
    startRunningRef.current = false;
    setStarted(true);
    epicSound();
    setTimeout(() => { window.location.href = "https://studox.info"; }, 60000);
    setTimeout(() => setShowReplay(true), 58000);
  }, [epicSound]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@200;300;400;600;800;900&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --gold: #d4af37;
          --gold-bright: #f5d97a;
          --gold-deep: #9a7b1f;
          --ink: #03040a;
          --serif: 'Cormorant Garamond', Georgia, serif;
          --sans: 'Inter', -apple-system, sans-serif;
          --mono: 'Space Mono', monospace;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; background: #000; overflow: hidden; font-family: var(--sans); color: #fff; -webkit-font-smoothing: antialiased; }

        /* ============ STAGE ============ */
        #stage { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; perspective: 1200px; }
        #stageInner { position: absolute; inset: 0; transform-origin: center; }
        canvas#particles { position: absolute; inset: 0; width: 100%; height: 100%; }

        .vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,.92) 100%); pointer-events: none; z-index: 5; }
        .grain { position: absolute; inset: 0; opacity: .07; pointer-events: none; z-index: 6; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"); }

        .scene { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; flex-direction: column; opacity: 0; text-align: center; padding: 0 6vw; z-index: 10; }

        .s1 { animation: fade 8s ease forwards; }
        .s1 .whisper { font-family: var(--serif); font-style: italic; font-size: clamp(18px,2.2vw,28px); letter-spacing: .4em; color: #888; font-weight: 300; opacity: 0; animation: whisper 8s ease forwards; }

        .s2 { animation: fade2 10s ease 8s forwards; }
        .s2 .line { font-family: var(--serif); font-size: clamp(34px,5.5vw,80px); font-weight: 300; letter-spacing: -.01em; line-height: 1.1; opacity: 0; transform: translateY(25px); animation: rise 1.1s cubic-bezier(.2,.8,.2,1) forwards; text-shadow: 0 0 60px rgba(0,0,0,.8); }
        .s2 .line:nth-child(1) { animation-delay: 8.4s; }
        .s2 .line:nth-child(2) { animation-delay: 10s; color: var(--gold); font-style: italic; font-weight: 500; }
        .s2 .line:nth-child(3) { animation-delay: 12s; }

        .s3 { animation: fade3 10s ease 18s forwards; }
        .s3 .word { display: inline-block; font-family: var(--sans); font-size: clamp(22px,3vw,42px); font-weight: 200; margin: .4em .7em; opacity: 0; animation: wordIn .8s ease forwards; color: #ccc; letter-spacing: .05em; }
        .s3 .word:nth-child(1) { animation-delay: 18.3s; }
        .s3 .word:nth-child(2) { animation-delay: 19.1s; }
        .s3 .word:nth-child(3) { animation-delay: 19.9s; }
        .s3 .word:nth-child(4) { animation-delay: 20.7s; color: var(--gold); }
        .s3 .word:nth-child(5) { animation-delay: 21.5s; }
        .s3 .word:nth-child(6) { animation-delay: 22.3s; color: var(--gold-bright); font-weight: 300; }

        .s4 { animation: fade4 14s ease 28s forwards; }
        .s4 .pre { font-family: var(--sans); font-size: clamp(11px,1.2vw,15px); letter-spacing: .7em; text-transform: uppercase; color: #999; opacity: 0; animation: rise 1s ease 28.5s forwards; margin-bottom: 3vh; font-weight: 300; }
        .logo-wrap { position: relative; opacity: 0; animation: logoReveal 2.4s cubic-bezier(.16,.84,.24,1) 30s forwards; }
        .logo { font-family: var(--sans); font-size: clamp(70px,15vw,220px); font-weight: 900; letter-spacing: -.05em; line-height: .9;
          background: linear-gradient(180deg, #fff 0%, #fff 40%, var(--gold-bright) 55%, var(--gold) 75%, var(--gold-deep) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          filter: drop-shadow(0 0 60px rgba(212,175,55,.4)) drop-shadow(0 0 120px rgba(212,175,55,.2));
          position: relative; }
        .logo::after { content: ''; position: absolute; left: 50%; bottom: -16px; width: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); animation: lineExpand 1.8s ease 31s forwards; }
        .tagline { font-family: var(--serif); font-style: italic; font-size: clamp(16px,2vw,26px); letter-spacing: .15em; color: #bbb; font-weight: 400; margin-top: 4vh; opacity: 0; animation: rise 1.2s ease 32.5s forwards; }
        .shockwave { position: absolute; top: 50%; left: 50%; width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--gold); transform: translate(-50%,-50%); opacity: 0; animation: shock 2.2s ease 30s forwards; pointer-events: none; }
        .shockwave.s2w { animation-delay: 30.4s; border-color: var(--gold-bright); }
        .shockwave.s3w { animation-delay: 30.8s; border-color: #fff; }
        .lensflare { position: absolute; top: 50%; left: 50%; width: 80vw; height: 80vw; max-width: 1200px; max-height: 1200px; transform: translate(-50%,-50%); pointer-events: none; opacity: 0;
          background: radial-gradient(circle, rgba(245,217,122,.6) 0%, rgba(212,175,55,.2) 15%, transparent 40%);
          animation: flare 3s ease 30s forwards; mix-blend-mode: screen; z-index: 7; }

        .s5 { animation: fade5 13s ease 42s forwards; }
        .s5 .feats { display: flex; gap: clamp(30px,5vw,80px); flex-wrap: nowrap; justify-content: center; align-items: flex-start; }
        .feat { opacity: 0; transform: translateY(20px); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: clamp(100px,13vw,170px); }
        .feat .num { font-family: var(--serif); font-size: clamp(46px,5.5vw,80px); font-weight: 300; color: var(--gold); line-height: 1; height: clamp(60px,7vw,100px); display: flex; align-items: center; justify-content: center; text-shadow: 0 0 30px rgba(212,175,55,.4); }
        .feat .lbl { font-family: var(--sans); font-size: clamp(10px,1vw,13px); letter-spacing: .3em; text-transform: uppercase; color: #888; margin-top: 18px; font-weight: 300; text-align: center; line-height: 1.4; white-space: nowrap; }
        .feat:nth-child(1) { animation: rise 1s cubic-bezier(.2,.8,.2,1) 42.5s forwards; }
        .feat:nth-child(2) { animation: rise 1s cubic-bezier(.2,.8,.2,1) 43.3s forwards; }
        .feat:nth-child(3) { animation: rise 1s cubic-bezier(.2,.8,.2,1) 44.1s forwards; }
        .feat:nth-child(4) { animation: rise 1s cubic-bezier(.2,.8,.2,1) 44.9s forwards; }

        .s6 { animation: fade6 5s ease 55s forwards; }
        .cta { font-family: var(--serif); font-size: clamp(20px,2.6vw,36px); letter-spacing: .18em; text-transform: uppercase; color: #fff; font-weight: 400; opacity: 0; animation: rise 1.2s ease 55.5s forwards; font-style: italic; max-width: 90vw; }

        .beam { position: absolute; top: 50%; left: 50%; width: 3px; height: 0; background: linear-gradient(180deg, transparent, var(--gold-bright) 30%, #fff 50%, var(--gold-bright) 70%, transparent); transform: translate(-50%,-50%); opacity: 0; z-index: 8; animation: beam 2.5s ease 29.5s forwards; filter: blur(1px) drop-shadow(0 0 20px var(--gold-bright)); }
        .flash { position: absolute; inset: 0; background: radial-gradient(circle at center, #fff 0%, #f5d97a 30%, transparent 70%); opacity: 0; z-index: 9; animation: flash 1.4s ease 30s forwards; pointer-events: none; mix-blend-mode: screen; }

        .running #stageInner { animation: shake 1.2s ease 30s; }

        @keyframes fade { 0%,90% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes fade2 { 0% { opacity: 0; } 10%,80% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes fade3 { 0% { opacity: 0; } 5%,85% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes fade4 { 0% { opacity: 0; } 10%,90% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes fade5 { 0% { opacity: 0; } 5%,90% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes fade6 { 0% { opacity: 0; } 10% { opacity: 1; } 100% { opacity: 1; } }
        @keyframes whisper { 0% { opacity: 0; letter-spacing: .15em; filter: blur(8px); } 30% { opacity: .85; letter-spacing: .4em; filter: blur(0); } 80% { opacity: .85; } 100% { opacity: 0; filter: blur(4px); } }
        @keyframes rise { to { opacity: 1; transform: translateY(0); } }
        @keyframes wordIn { to { opacity: 1; } }
        @keyframes logoReveal { 0% { opacity: 0; transform: scale(.7); filter: blur(30px) brightness(2); } 50% { filter: blur(2px) brightness(1.4); } 100% { opacity: 1; transform: scale(1); filter: blur(0) brightness(1); } }
        @keyframes lineExpand { to { width: 80%; left: 10%; } }
        @keyframes shock { 0% { opacity: 1; width: 20px; height: 20px; border-width: 3px; } 100% { opacity: 0; width: 1600px; height: 1600px; border-width: 1px; } }
        @keyframes beam { 0% { opacity: 0; height: 0; } 30% { opacity: 1; height: 100vh; } 80% { opacity: .8; height: 100vh; } 100% { opacity: 0; height: 100vh; } }
        @keyframes flash { 0% { opacity: 0; transform: scale(.5); } 25% { opacity: 1; transform: scale(1.5); } 100% { opacity: 0; transform: scale(2); } }
        @keyframes flare { 0% { opacity: 0; transform: translate(-50%,-50%) scale(.3); } 30% { opacity: 1; transform: translate(-50%,-50%) scale(1); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(1.4); } }
        @keyframes shake {
          0%,100% { transform: translate(0,0); }
          10% { transform: translate(-8px,4px); }
          20% { transform: translate(6px,-6px); }
          30% { transform: translate(-4px,8px); }
          40% { transform: translate(8px,2px); }
          50% { transform: translate(-6px,-4px); }
          60% { transform: translate(4px,6px); }
          70% { transform: translate(-2px,-2px); }
          80% { transform: translate(3px,3px); }
          90% { transform: translate(-1px,1px); }
        }

        /* ============ TRIPLE A+++ START SCREEN ============ */
        #start { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background: #000; z-index: 100; flex-direction: column; gap: 40px; overflow: hidden; }

        .nebula { position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(212,175,55,.15), transparent 60%),
            radial-gradient(ellipse 70% 50% at 80% 70%, rgba(180,130,255,.08), transparent 60%),
            radial-gradient(ellipse 60% 80% at 50% 50%, rgba(80,160,255,.05), transparent 70%),
            radial-gradient(circle at 50% 50%, #0a0813 0%, #03040a 60%, #000 100%);
          animation: nebulaShift 25s ease infinite; }
        @keyframes nebulaShift {
          0%,100% { background-position: 0% 0%, 100% 100%, 50% 50%, center; }
          50% { background-position: 20% 10%, 80% 90%, 60% 40%, center; }
        }

        .scan { position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: .4;
          background: repeating-linear-gradient(0deg, rgba(255,255,255,.02) 0, rgba(255,255,255,.02) 1px, transparent 1px, transparent 4px); }

        .ring { position: absolute; top: 50%; left: 50%; width: min(80vw,800px); height: min(80vw,800px); transform: translate(-50%,-50%); z-index: 1; pointer-events: none; opacity: .4;
          background: conic-gradient(from 0deg, transparent 0%, rgba(212,175,55,.25) 25%, transparent 50%, rgba(245,217,122,.15) 75%, transparent 100%);
          border-radius: 50%;
          mask: radial-gradient(circle, transparent 45%, #000 47%, #000 49%, transparent 51%);
          -webkit-mask: radial-gradient(circle, transparent 45%, #000 47%, #000 49%, transparent 51%);
          animation: ringRot 30s linear infinite; filter: blur(2px); }
        .ring2 { position: absolute; top: 50%; left: 50%; width: min(60vw,600px); height: min(60vw,600px); transform: translate(-50%,-50%); z-index: 1; pointer-events: none; opacity: .3;
          background: conic-gradient(from 180deg, transparent 0%, rgba(245,217,122,.3) 30%, transparent 60%);
          border-radius: 50%;
          mask: radial-gradient(circle, transparent 48%, #000 49%, #000 50%, transparent 51%);
          -webkit-mask: radial-gradient(circle, transparent 48%, #000 49%, #000 50%, transparent 51%);
          animation: ringRot 45s linear infinite reverse; filter: blur(1px); }
        @keyframes ringRot { to { transform: translate(-50%,-50%) rotate(360deg); } }

        #startCanvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 2; }

        .startVignette { position: absolute; inset: 0; z-index: 3; pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.85) 100%); }

        .status { font-family: var(--mono); font-size: clamp(10px,1vw,12px); color: #5a5a5a; letter-spacing: .25em; text-align: center; z-index: 5; line-height: 2; font-weight: 400; }
        .status .ok { color: var(--gold); }
        .status .blink { animation: blink 1.2s infinite; }
        @keyframes blink { 50% { opacity: 0; } }

        .glitch-title { position: relative; font-family: var(--sans); font-size: clamp(50px,9vw,130px); font-weight: 900; letter-spacing: -.02em; color: #fff; z-index: 5;
          background: linear-gradient(180deg, #fff 0%, #fff 50%, var(--gold-bright) 70%, var(--gold) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          filter: drop-shadow(0 0 40px rgba(212,175,55,.3)); }
        .glitch-title::before, .glitch-title::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: none; -webkit-text-fill-color: initial; }
        .glitch-title::before { color: rgba(255,0,80,.5); animation: glitch1 3.5s infinite linear alternate-reverse; mix-blend-mode: screen; opacity: .6; }
        .glitch-title::after { color: rgba(0,200,255,.5); animation: glitch2 3.2s infinite linear alternate-reverse; mix-blend-mode: screen; opacity: .6; }
        @keyframes glitch1 { 0% { clip-path: inset(20% 0 60% 0); transform: translate(-1px,0); } 20% { clip-path: inset(70% 0 10% 0); transform: translate(1px,0); } 40% { clip-path: inset(30% 0 50% 0); transform: translate(-2px,0); } 60% { clip-path: inset(50% 0 30% 0); transform: translate(1px,0); } 80% { clip-path: inset(10% 0 80% 0); transform: translate(-1px,0); } 100% { clip-path: inset(80% 0 5% 0); transform: translate(1px,0); } }
        @keyframes glitch2 { 0% { clip-path: inset(60% 0 20% 0); transform: translate(1px,0); } 25% { clip-path: inset(15% 0 70% 0); transform: translate(-1px,0); } 50% { clip-path: inset(45% 0 40% 0); transform: translate(2px,0); } 75% { clip-path: inset(25% 0 55% 0); transform: translate(-1px,0); } 100% { clip-path: inset(75% 0 10% 0); transform: translate(1px,0); } }

        .prompt-text { font-family: var(--sans); font-size: clamp(14px,1.6vw,20px); color: #ccc; letter-spacing: .15em; text-transform: uppercase; font-weight: 300; z-index: 5; text-align: center; }
        .prompt-text .gold { color: var(--gold); font-weight: 400; }

        .lang-section { display: flex; flex-direction: column; align-items: center; gap: 18px; z-index: 5; }
        .arrows-row { display: flex; gap: clamp(60px,10vw,160px); justify-content: center; align-items: center; }
        .arrow-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .arrow { font-size: 24px; line-height: 1; animation: bounce 1.4s ease infinite, colorCycle 4s linear infinite; filter: drop-shadow(0 0 8px currentColor); }
        .arrow:nth-child(2) { animation-delay: .15s, 0s; opacity: .5; font-size: 18px; }
        .arrow:nth-child(3) { animation-delay: .3s, 0s; opacity: .25; font-size: 14px; }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes colorCycle {
          0% { color: #d4af37; }
          20% { color: #00f0ff; }
          40% { color: #ff00aa; }
          60% { color: #f5d97a; }
          80% { color: #7affac; }
          100% { color: #d4af37; }
        }

        .lang-wrap { display: flex; gap: clamp(30px,5vw,60px); z-index: 5; justify-content: center; }
        .lang-btn { position: relative; padding: 20px 40px; background: rgba(15,12,5,.7); border: 1px solid rgba(212,175,55,.4); color: #fff; font-family: var(--mono); font-size: 14px; font-weight: 700; letter-spacing: .25em; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; gap: 14px; transition: all .3s cubic-bezier(.2,.8,.2,1); backdrop-filter: blur(8px); overflow: hidden; }
        .lang-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(212,175,55,.2), transparent); transform: translateX(-100%); transition: transform .6s; }
        .lang-btn:hover::before { transform: translateX(100%); }
        .lang-btn:hover { border-color: var(--gold); background: rgba(212,175,55,.15); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(212,175,55,.3), 0 0 0 1px rgba(245,217,122,.4) inset; }
        .flag { font-size: 24px; line-height: 1; }

        .hint { font-family: var(--mono); font-size: 10px; letter-spacing: .3em; color: #3a3a3a; text-transform: uppercase; z-index: 5; }

        #replay { position: fixed; bottom: 20px; right: 20px; color: #666; font-family: var(--mono); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; cursor: pointer; z-index: 50; opacity: 0; transition: opacity .3s; background: none; border: none; }
        #replay.show { opacity: 1; }
        #replay:hover { color: var(--gold); }
      `}</style>

      {/* ============ START SCREEN ============ */}
      {!started && (
        <div id="start">
          <div className="nebula" />
          <div className="ring" />
          <div className="ring2" />
          <canvas id="startCanvas" ref={startCanvasRef} />
          <div className="scan" />
          <div className="startVignette" />

          <div className="status">
            <div>[<span className="ok">OK</span>] SYSTEM_INIT // STUDOX.CORE_v2.5</div>
            <div>[<span className="ok">OK</span>] LOADING REVELATION_PROTOCOL<span className="blink">_</span></div>
          </div>

          <h1 className="glitch-title" ref={glitchRef} data-text="STUDOX">STUDOX</h1>

          <div className="lang-section">
            <div className="prompt-text">▸ Wähle eine <span className="gold">Sprache</span> zum Starten</div>
            <div className="arrows-row">
              <div className="arrow-wrap">
                <div className="arrow">▼</div>
                <div className="arrow">▼</div>
                <div className="arrow">▼</div>
              </div>
              <div className="arrow-wrap">
                <div className="arrow">▼</div>
                <div className="arrow">▼</div>
                <div className="arrow">▼</div>
              </div>
            </div>
            <div className="lang-wrap">
              <button className="lang-btn" onClick={() => startReveal("de")}>
                <span className="flag">🇩🇪</span><span>DEUTSCH</span>
              </button>
              <button className="lang-btn" onClick={() => startReveal("en")}>
                <span className="flag">🇬🇧</span><span>ENGLISH</span>
              </button>
            </div>
          </div>

          <div className="hint">▸ SOUND ON // 60 SECONDS // CINEMATIC EXPERIENCE</div>
        </div>
      )}

      {/* ============ STAGE ============ */}
      {started && (
        <div id="stage" className="running">
          <div id="stageInner">
            <canvas id="particles" ref={stageCanvasRef} />
            <div className="beam" />
            <div className="lensflare" />
            <div className="flash" />

            <div className="scene s1"><div className="whisper">{dict.whisper}</div></div>

            <div className="scene s2">
              <div className="line">{dict.s2_1}</div>
              <div className="line">{dict.s2_2}</div>
              <div className="line">{dict.s2_3}</div>
            </div>

            <div className="scene s3">
              <span className="word">{dict.w1}</span>
              <span className="word">{dict.w2}</span>
              <span className="word">{dict.w3}</span>
              <span className="word">{dict.w4}</span>
              <span className="word">{dict.w5}</span>
              <span className="word">{dict.w6}</span>
            </div>

            <div className="scene s4">
              <div className="pre">{dict.pre}</div>
              <div className="logo-wrap"><div className="logo">StudoX</div></div>
              <div className="shockwave" />
              <div className="shockwave s2w" />
              <div className="shockwave s3w" />
              <div className="tagline">{dict.tagline}</div>
            </div>

            <div className="scene s5">
              <div className="feats">
                <div className="feat"><div className="num">∞</div><div className="lbl">{dict.f1}</div></div>
                <div className="feat"><div className="num">XP</div><div className="lbl">{dict.f2}</div></div>
                <div className="feat"><div className="num">⚔</div><div className="lbl">{dict.f3}</div></div>
                <div className="feat"><div className="num">★</div><div className="lbl">{dict.f4}</div></div>
              </div>
            </div>

            <div className="scene s6"><div className="cta">{dict.cta}</div></div>

            <div className="vignette" />
            <div className="grain" />
          </div>
        </div>
      )}

      {/* Replay button */}
      <button
        id="replay"
        className={showReplay ? "show" : ""}
        onClick={() => window.location.reload()}
      >
        ↻ Replay
      </button>
    </>
  );
}
