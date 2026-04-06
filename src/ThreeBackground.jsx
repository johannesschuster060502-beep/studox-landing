/**
 * StudoX — Immersive Background  ///  Ground-Up Rebuild
 * ─────────────────────────────────────────────────────────────────────────────
 * Root cause of all previous failures:
 *   alpha:true + transparent clearColor → CSS #030310 bled through, killed
 *   every colour the WebGL scene tried to produce.
 *
 * This version:
 *   ① Solid renderer background (#06021a deep-space indigo) — no CSS bleed
 *   ② Aurora layer: 4 giant Sprite colour-fields that breathe + shift slowly
 *   ③ Visible nebula clouds (6–10× more opaque than before)
 *   ④ Rich 3-class star field with soft circular sprites
 *   ⑤ 3 premium atoms — larger orbit, bigger nucleus glow, lens-flare sats
 *   ⑥ Bloom: 0.65 strength / 0.40 threshold — actually visible
 *   ⑦ ACESFilmic @ 0.78 exposure — colours breathe, not crushed to black
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass }      from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

/* ── Atom Lissajous anchors ─────────────────────────────────────────────── */
const SLOTS = [
  { ax:-0.70, ay: 0.06, wx:0.08, wy:0.16, f1:0.26, f2:0.17, ph:0.00 },
  { ax: 0.70, ay:-0.06, wx:0.08, wy:0.16, f1:0.20, f2:0.28, ph:2.09 },
  { ax: 0.22, ay: 0.74, wx:0.18, wy:0.06, f1:0.15, f2:0.22, ph:4.19 },
];

/* ── Atom visual definitions ────────────────────────────────────────────── */
const CFGS = [
  { coreCol:0xf0e8ff, midCol:0x8b5cf6, outerCol:0x3b0764,
    r1:{col:0xa78bfa, tX:0.40, tZ:0.00,          spd: 0.38},
    r2:{col:0x7c3aed, tX:0.40, tZ:Math.PI*0.60,  spd:-0.26},
    sz:1.20, tumble:[0.00036,0.00062,0.00021] },
  { coreCol:0xcffafe, midCol:0x06b6d4, outerCol:0x0c3d5e,
    r1:{col:0x22d3ee, tX:0.46, tZ:0.00,          spd:-0.32},
    r2:{col:0x0891b2, tX:0.46, tZ:Math.PI*0.58,  spd: 0.21},
    sz:1.05, tumble:[-0.00027,0.00048,0.00036] },
  { coreCol:0xe0e7ff, midCol:0x6366f1, outerCol:0x1e1b4b,
    r1:{col:0x818cf8, tX:0.36, tZ:0.00,          spd: 0.28},
    r2:{col:0x4f46e5, tX:0.36, tZ:Math.PI*0.63,  spd:-0.42},
    sz:0.82, tumble:[0.00052,-0.00030,0.00045] },
];

/* ── Soft radial-gradient texture (reused for everything glowy) ─────────── */
function makeGlowTex(res = 256) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = res;
  const cx = cv.getContext("2d"), h = res / 2;
  const g  = cx.createRadialGradient(h,h,0, h,h,h);
  g.addColorStop(0.00,"rgba(255,255,255,1.00)");
  g.addColorStop(0.10,"rgba(255,255,255,0.88)");
  g.addColorStop(0.30,"rgba(255,255,255,0.40)");
  g.addColorStop(0.60,"rgba(255,255,255,0.10)");
  g.addColorStop(1.00,"rgba(255,255,255,0.00)");
  cx.fillStyle = g; cx.fillRect(0,0,res,res);
  return new THREE.CanvasTexture(cv);
}

/* ── Cross / lens-flare spike texture ──────────────────────────────────── */
function makeFlareTex(res = 256) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = res;
  const cx = cv.getContext("2d"), h = res/2;
  const beam = (x1,y1,x2,y2) => {
    const g = cx.createLinearGradient(x1,y1,x2,y2);
    g.addColorStop(0,"rgba(255,255,255,0)");
    g.addColorStop(.45,"rgba(255,255,255,.55)");
    g.addColorStop(.50,"rgba(255,255,255,1)");
    g.addColorStop(.55,"rgba(255,255,255,.55)");
    g.addColorStop(1,"rgba(255,255,255,0)");
    return g;
  };
  cx.fillStyle = beam(0,h,res,h); cx.fillRect(0,h-3,res,6);
  cx.fillStyle = beam(h,0,h,res); cx.fillRect(h-3,0,6,res);
  return new THREE.CanvasTexture(cv);
}

/* ── Particle ring (3 size classes for orbital debris feel) ─────────────── */
function makeRing(OR, col, gtex, s) {
  const grp = new THREE.Object3D();
  [[140,0.020*s,0.20],[55,0.036*s,0.26],[18,0.058*s,0.34]].forEach(([n,sz,op])=>{
    const pos = new Float32Array(n*3);
    for(let k=0;k<n;k++){
      const a=(k/n)*Math.PI*2+(Math.random()-.5)*0.05;
      const jr=(Math.random()-.5)*OR*0.06, jy=(Math.random()-.5)*OR*0.03;
      pos[k*3]=(OR+jr)*Math.cos(a); pos[k*3+1]=jy; pos[k*3+2]=(OR+jr)*Math.sin(a);
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute("position",new THREE.BufferAttribute(pos,3));
    grp.add(new THREE.Points(geo,new THREE.PointsMaterial({
      map:gtex, alphaMap:gtex, color:col, size:sz,
      transparent:true, opacity:op,
      blending:THREE.AdditiveBlending, depthWrite:false,
      sizeAttenuation:true, alphaTest:0.001,
    })));
  });
  return grp;
}

export default function ThreeBackground({ phase = 5, warp = false }) {
  const mountRef  = useRef(null);
  const phaseRef  = useRef(phase);
  const warpRef   = useRef(warp);
  const springRef = useRef(SLOTS.map(()=>({x:0,y:0,vx:0,vy:0})));
  const rawMouse  = useRef({x:0,y:0});

  useEffect(()=>{ phaseRef.current=phase; },[phase]);
  useEffect(()=>{ warpRef.current=warp;   },[warp]);

  useEffect(()=>{
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer — SOLID background, no CSS bleed ─────────────────── */
    const renderer = new THREE.WebGLRenderer({
      antialias:true,
      powerPreference:"high-performance",
      // alpha:false intentionally — solid background, no transparency
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x06021a, 1);  // ← rich deep-space indigo
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.78;  // ← colours breathe, not crushed
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 0.1, 600);
    camera.position.set(0,0,12);
    camera.lookAt(0,0,0);

    /* ── Bloom — actually visible this time ─────────────────────────── */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene,camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.65,   // ← strength (was 0.28 — invisible)
      0.55,   // radius
      0.40    // ← threshold (was 0.68 — only hit by nothing)
    );
    composer.addPass(bloomPass);

    const ADD = THREE.AdditiveBlending;
    const glowTex  = makeGlowTex();
    const flareTex = makeFlareTex();

    function spr(size, col, op, z=0) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({
        map:glowTex, color:col, transparent:true, opacity:op,
        blending:ADD, depthWrite:false,
      }));
      s.scale.set(size,size,1);
      s.position.z = z;
      return s;
    }

    /* ════════════════════════════════════════════════════════════════
       ① AURORA LAYER — 4 giant coloured light fields, gently breathing
       These are the main source of background colour and mood.
       ════════════════════════════════════════════════════════════════ */
    const auroraData = [
      { x:-5,  y: 3.5, z:-8,  size:28, col:0x5b21b6, base:0.22, ph:0.00 }, // violet top-left
      { x: 6,  y:-4,   z:-10, size:32, col:0x0e7490, base:0.18, ph:1.57 }, // teal bottom-right
      { x: 1,  y: 0,   z:-14, size:40, col:0x1e1b4b, base:0.28, ph:3.14 }, // indigo centre-back
      { x:-8,  y:-5,   z:-6,  size:20, col:0x312e81, base:0.14, ph:4.71 }, // deep blue bottom-left
    ];
    const auroraSprites = auroraData.map(d => {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map:glowTex, color:d.col, transparent:true, opacity:d.base,
        blending:ADD, depthWrite:false,
      }));
      sp.scale.set(d.size, d.size, 1);
      sp.position.set(d.x, d.y, d.z);
      scene.add(sp);
      return { sp, ...d };
    });

    /* ════════════════════════════════════════════════════════════════
       ② NEBULA — visible cloud shapes (much higher opacity than before)
       ════════════════════════════════════════════════════════════════ */
    [
      {p:[-10, 7,-22], r:22, c:0x4c1d95, o:0.065},
      {p:[ 12,-6,-26], r:26, c:0x0c4a6e, o:0.055},
      {p:[  0, 1,-34], r:32, c:0x2e1065, o:0.060},
      {p:[  6,10,-15], r:14, c:0x6d28d9, o:0.045},
      {p:[ -8,-7,-18], r:17, c:0x0f4c5c, o:0.050},
    ].forEach(({p,r,c,o})=>{
      const m=new THREE.Mesh(
        new THREE.SphereGeometry(r,10,10),
        new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:ADD,side:THREE.BackSide,depthWrite:false})
      );
      m.position.set(...p); scene.add(m);
    });

    /* ════════════════════════════════════════════════════════════════
       ③ STAR FIELD — 3 size classes, soft circular sprites
       ════════════════════════════════════════════════════════════════ */
    function makeStars(n,minR,maxR,dotSz,op){
      const pos=new Float32Array(n*3), col=new Float32Array(n*3);
      const pal=[[.32,.12,.52],[.01,.28,.36],[.20,.07,.48],[.34,.31,.48],[.12,.34,.38],[.48,.48,.58]];
      for(let i=0;i<n;i++){
        const roll=Math.random(); let x,y,z;
        if(roll<.62){
          const arm=(Math.floor(Math.random()*3)/3)*Math.PI*2;
          const rr=14+Math.random()*55, th=arm+rr*.04+(Math.random()-.5)*.9;
          x=rr*Math.cos(th); y=(Math.random()-.5)*(3+rr*.06); z=rr*Math.sin(th);
        } else {
          const rr=minR+Math.random()*(maxR-minR), th=Math.random()*Math.PI*2;
          const ph=Math.acos(2*Math.random()-1);
          x=rr*Math.sin(ph)*Math.cos(th); y=rr*Math.sin(ph)*Math.sin(th); z=rr*Math.cos(ph);
        }
        pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
        const pi=roll>.96?5:Math.floor(Math.random()*5), b=.20+Math.random()*.52;
        col[i*3]=pal[pi][0]*b; col[i*3+1]=pal[pi][1]*b; col[i*3+2]=pal[pi][2]*b;
      }
      const g=new THREE.BufferGeometry();
      g.setAttribute("position",new THREE.BufferAttribute(pos,3));
      g.setAttribute("color",   new THREE.BufferAttribute(col,3));
      return new THREE.Points(g,new THREE.PointsMaterial({
        map:glowTex, alphaMap:glowTex, size:dotSz, vertexColors:true,
        transparent:true, opacity:op, blending:ADD, depthWrite:false,
        sizeAttenuation:true, alphaTest:.001,
      }));
    }
    const starsS = makeStars(3000,10,35,0.048,0.40);
    const starsM = makeStars( 800,10,40,0.085,0.50);
    const starsL = makeStars( 150, 6,20,0.140,0.62);
    scene.add(starsS, starsM, starsL);

    /* ════════════════════════════════════════════════════════════════
       ④ 3 PREMIUM ORBITAL ATOMS
       ════════════════════════════════════════════════════════════════ */
    const atoms = CFGS.map((cfg,i)=>{
      const root = new THREE.Object3D();
      const s    = cfg.sz;
      const OR   = 1.35 * s;  // larger orbit than before

      /* Nucleus: 2-sprite layered glow + solid sphere bloom-anchor */
      root.add(new THREE.Mesh(
        new THREE.SphereGeometry(0.18*s,24,24),
        new THREE.MeshBasicMaterial({color:cfg.midCol, blending:ADD})
      ));
      const outerGlow = new THREE.Sprite(new THREE.SpriteMaterial({
        map:glowTex, color:cfg.midCol, transparent:true, opacity:0.42,
        blending:ADD, depthWrite:false,
      }));
      outerGlow.scale.set(3.2*s, 3.2*s, 1);
      root.add(outerGlow);

      const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
        map:glowTex, color:cfg.coreCol, transparent:true, opacity:0.92,
        blending:ADD, depthWrite:false,
      }));
      coreGlow.scale.set(0.55*s, 0.55*s, 1);
      root.add(coreGlow);

      /* Two particle rings */
      const pivots = [];
      [cfg.r1, cfg.r2].forEach(({col,tX,tZ,spd})=>{
        const orb = new THREE.Object3D();
        orb.rotation.x=tX; orb.rotation.z=tZ;
        orb.add(makeRing(OR, col, glowTex, s));
        root.add(orb);

        const piv = new THREE.Object3D();
        orb.add(piv);

        // Satellite: sphere + glow sprite + flare cross
        const sat = new THREE.Mesh(
          new THREE.SphereGeometry(0.058*s,10,10),
          new THREE.MeshBasicMaterial({color:col,blending:ADD})
        );
        sat.position.set(OR,0,0);
        piv.add(sat);

        const satGlow = new THREE.Sprite(new THREE.SpriteMaterial({
          map:glowTex, color:col, transparent:true, opacity:0.60,
          blending:ADD, depthWrite:false,
        }));
        satGlow.scale.set(0.44*s, 0.44*s, 1);
        sat.add(satGlow);

        const flare = new THREE.Sprite(new THREE.SpriteMaterial({
          map:flareTex, color:col, transparent:true, opacity:0.16,
          blending:ADD, depthWrite:false,
          rotation: Math.PI * 0.25 * i,
        }));
        flare.scale.set(1.3*s, 1.3*s, 1);
        sat.add(flare);

        pivots.push({piv,spd});
      });

      root.position.set(99,99,1.5);
      scene.add(root);
      return {root, pivots, coreGlow, outerGlow, ph:(i/3)*Math.PI*2, cfg};
    });

    /* ── Input ──────────────────────────────────────────────────────── */
    const onMove=(e)=>{
      rawMouse.current.x= (e.clientX/window.innerWidth -.5)*2;
      rawMouse.current.y=-(e.clientY/window.innerHeight-.5)*2;
    };
    const onTouch=(e)=>{
      if(!e.touches[0])return;
      rawMouse.current.x= (e.touches[0].clientX/window.innerWidth -.5)*2;
      rawMouse.current.y=-(e.touches[0].clientY/window.innerHeight-.5)*2;
    };
    window.addEventListener("mousemove",onMove);
    window.addEventListener("touchmove",onTouch,{passive:true});

    const onResize=()=>{
      camera.aspect=window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth,window.innerHeight);
      composer.setSize(window.innerWidth,window.innerHeight);
    };
    window.addEventListener("resize",onResize);

    /* ── Animation loop ─────────────────────────────────────────────── */
    let raf, t=0, warpT=0;

    const animate=()=>{
      raf=requestAnimationFrame(animate);
      t+=0.016;

      warpT+=warpRef.current ? 0.06 : -0.05;
      warpT=Math.max(0,Math.min(1,warpT));

      const halfH=Math.tan((camera.fov/2)*Math.PI/180)*camera.position.z;
      const halfW=halfH*camera.aspect;
      const rm=rawMouse.current, sp=springRef.current;

      /* Aurora breathing */
      auroraData.forEach((d,i)=>{
        const wB = 1 + warpT * 2.5;
        auroraSprites[i].sp.material.opacity = d.base*(0.75+0.25*Math.sin(t*0.28+d.ph)) * wB;
      });

      /* Atoms */
      atoms.forEach(({root,pivots,coreGlow,outerGlow,ph,cfg},i)=>{
        const slot=SLOTS[i];
        const nx=slot.ax+slot.wx*Math.sin(slot.f1*t+slot.ph);
        const ny=slot.ay+slot.wy*Math.cos(slot.f2*t+slot.ph*.6);

        /* Spring mouse lean */
        const mdx=nx-rm.x, mdy=ny-rm.y;
        const md=Math.sqrt(mdx*mdx+mdy*mdy)+.001;
        const zone=Math.max(0,1-md/.80);
        const tx=(mdx/md)*zone*.032, ty=(mdy/md)*zone*.032;
        sp[i].vx+=(tx-sp[i].x)*.018; sp[i].vy+=(ty-sp[i].y)*.018;
        sp[i].vx*=.72; sp[i].vy*=.72;
        sp[i].x+=sp[i].vx; sp[i].y+=sp[i].vy;

        root.position.set((nx+sp[i].x)*halfW,(ny+sp[i].y)*halfH,1.5);

        /* Breath */
        root.scale.setScalar(1+Math.sin(t*.78+ph)*.045);

        /* Self-tumble */
        const wm=1+warpT*3.5;
        const [tx2,ty2,tz2]=cfg.tumble;
        root.rotation.x+=tx2*wm; root.rotation.y+=ty2*wm; root.rotation.z+=tz2*wm;

        /* Orbits */
        pivots.forEach(({piv,spd})=>{ piv.rotation.y+=spd*.016*(1+warpT*5); });

        /* Mouse proximity brightens core */
        coreGlow.material.opacity = .92+zone*.08;
        outerGlow.scale.setScalar((3.2+zone*.8)*cfg.sz);
        outerGlow.material.opacity = .42+zone*.15;
      });

      /* Star drift */
      const sd=1+warpT*35;
      starsS.rotation.y+=.000110*sd; starsS.rotation.x+=.000028;
      starsM.rotation.y+=.000125*sd; starsM.rotation.x+=.000033;
      starsL.rotation.y+=.000145*sd; starsL.rotation.x+=.000038;

      bloomPass.strength=0.65+warpT*1.0;

      /* Camera responds to warp — FOV widens, camera pushes in */
      camera.fov=55+warpT*20;
      camera.position.z=12-warpT*3;
      camera.updateProjectionMatrix();

      composer.render();
    };
    raf=requestAnimationFrame(animate);

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove",onMove);
      window.removeEventListener("touchmove",onTouch);
      window.removeEventListener("resize",onResize);
      glowTex.dispose(); flareTex.dispose();
      if(mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose(); composer.dispose();
    };
  },[]);

  return (
    <div
      ref={mountRef}
      style={{
        position:"fixed", inset:0, zIndex:0,
        opacity: phase>=1 ? 1 : 0,
        transition:"opacity 1s ease",
      }}
    />
  );
}
