"use client";

import { useEffect, useRef } from "react";
import styles from "./CupidGame.module.css";

export interface CupidGameProps {
  requiredHits: number
  targetPhotoUrl?: string | null
  couplePhotoUrls: string[]
  hitMessages: string[]
  missMessages: string[]
  finalQuestion: string
  finalSub: string
  acceptedTitle: string
  acceptedSub: string
  showWatermark?: boolean

  onShare?: () => void
}

const FALLBACK_COUPLE_EMOJIS = ["💞", "🥰", "😍", "👩‍❤️‍👨", "💑", "🌹", "✨", "💫"];
const FALLBACK_HIT_MESSAGES = ["cada acerto é um pouco mais de você"];
const FALLBACK_MISS_MESSAGES = ["quase! 💔"];

/**
 * Jogo "Flecha do Cupido". Toda a mecânica (mira por arraste, física simplificada
 * do voo da flecha, explosão de corações, telas de proposta/aceite) roda em
 * DOM puro dentro de `rootRef`, igual ao protótipo HTML original — só trocamos
 * `document.getElementById` por refs/queries dentro do container do componente,
 * e o `CONFIG` fixo virou as props abaixo.
 */
export default function CupidGame({
  requiredHits,
  targetPhotoUrl,
  couplePhotoUrls,
  hitMessages,
  missMessages,
  finalQuestion,
  finalSub,
  acceptedTitle,
  acceptedSub,
  showWatermark = false,
  onShare
}: CupidGameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const onShareRef = useRef(onShare);

  useEffect(() => {
    onShareRef.current = onShare;
  }, [onShare]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const $ = <T extends Element = Element>(sel: string) => root.querySelector<T>(sel);

    const startOverlay = $<HTMLDivElement>(".js-start-overlay")!;
    const proposalOverlay = $<HTMLDivElement>(".js-proposal-overlay")!;
    const acceptedOverlay = $<HTMLDivElement>(".js-accepted-overlay")!;
    const startBtn = $<HTMLButtonElement>(".js-start-btn")!;
    const acceptBtn = $<HTMLButtonElement>(".js-accept-btn")!;
    const restartBtn = $<HTMLButtonElement>(".js-restart-btn")!;
    const hitsCounter = $<HTMLDivElement>(".js-hits-counter")!;
    const missesCounter = $<HTMLDivElement>(".js-misses-counter")!;
    const target = $<HTMLDivElement>(".js-target")!;
    const targetPhoto = $<HTMLDivElement>(".js-target-photo")!;
    const caption = $<HTMLDivElement>(".js-caption")!;
    const bow = $<SVGSVGElement>(".js-bow")!;
    const aimLineSvg = $<SVGSVGElement>(".js-aim-line")!;
    const heartsBurst = $<HTMLDivElement>(".js-hearts-burst")!;
    const missToast = $<HTMLDivElement>(".js-miss-toast")!;
    const collage = $<HTMLDivElement>(".js-collage")!;
    const proposalTitle = $<HTMLHeadingElement>(".js-proposal-title")!;
    const proposalSub = $<HTMLParagraphElement>(".js-proposal-sub")!;
    const acceptedTitleEl = $<HTMLHeadingElement>(".js-accepted-title")!;
    const acceptedSubEl = $<HTMLParagraphElement>(".js-accepted-sub")!;
    const scene = root;

    const couplePhotos = couplePhotoUrls.length > 0 ? couplePhotoUrls : FALLBACK_COUPLE_EMOJIS;
    const isUrl = couplePhotoUrls.length > 0;
    const captions = hitMessages.length > 0 ? hitMessages : FALLBACK_HIT_MESSAGES;
    const missTexts = missMessages.length > 0 ? missMessages : FALLBACK_MISS_MESSAGES;

    const shareBtn = $<HTMLButtonElement>(".js-share-btn")!;

    let hits = 0,
      misses = 0;
    let dragging = false;
    let bowTip = { x: 0, y: 0 };
    let aimAngle = -90;
    let sceneRect: DOMRect;
    let hitCollageItems: { url?: string; emoji?: string }[] = [];

    function rectUpdate() {
      sceneRect = scene.getBoundingClientRect();
    }

    if (targetPhotoUrl) {
      targetPhoto.innerHTML = `<img src="${targetPhotoUrl}" alt="foto">`;
    }

    function randomTargetX() {
      const min = 22,
        max = 78;
      return (min + Math.random() * (max - min)).toFixed(1) + "%";
    }
    target.style.left = randomTargetX();

    function repositionTarget() {
      target.style.left = randomTargetX();
    }

    function updateBowTip() {
      const bowRect = bow.getBoundingClientRect();
      bowTip.x = bowRect.left + bowRect.width / 2 - sceneRect.left;
      bowTip.y = bowRect.top + 10 - sceneRect.top;
    }

    function getTargetCenter() {
      const r = target.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - sceneRect.left,
        y: r.top + r.height / 2 - sceneRect.top,
        radius: (r.width / 2) * 0.85
      };
    }

    function pointerPos(e: PointerEvent | TouchEvent) {
      const p = "touches" in e ? e.touches[0] : e;
      return { x: p.clientX - sceneRect.left, y: p.clientY - sceneRect.top };
    }

    function onDragStart(e: Event) {
      rectUpdate();
      updateBowTip();
      dragging = true;
      onDragMove(e as PointerEvent);
    }

    function onDragMove(e: Event) {
      if (!dragging) return;
      const p = pointerPos(e as PointerEvent);
      const dx = p.x - bowTip.x;
      const dy = p.y - bowTip.y;
      aimAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      bow.style.transform = "rotate(" + (aimAngle - 90) + "deg)";
      drawAimLine(p);
    }

    function drawAimLine(_p: { x: number; y: number }) {
      const len = 900;
      const rad = (aimAngle * Math.PI) / 180;
      const x2 = bowTip.x + Math.cos(rad) * len;
      const y2 = bowTip.y + Math.sin(rad) * len;
      aimLineSvg.innerHTML =
        '<line x1="' + bowTip.x + '" y1="' + bowTip.y + '" x2="' + x2 + '" y2="' + y2 + '" ' +
        'stroke="rgba(232,179,78,.35)" stroke-width="2" stroke-dasharray="6 8"/>';
    }

    function onDragEnd() {
      if (!dragging) return;
      dragging = false;
      aimLineSvg.innerHTML = "";
      shootArrow();
      aimAngle = -90;
      bow.style.transform = "rotate(" + (aimAngle - 90) + "deg)";
    }

    function shootArrow() {
      updateBowTip();
      const tc = getTargetCenter();
      const rad = (aimAngle * Math.PI) / 180;

      let endX: number, endY: number;
      if (Math.sin(rad) < -0.05) {
        const t = (tc.y - bowTip.y) / Math.sin(rad);
        endX = bowTip.x + Math.cos(rad) * t;
        endY = tc.y;
      } else {
        endX = bowTip.x + Math.cos(rad) * 700;
        endY = bowTip.y + Math.sin(rad) * 700;
      }

      const arrow = document.createElement("div");
      arrow.className = styles.flyingArrow;
      arrow.innerHTML =
        '<svg width="18" height="46" viewBox="0 0 18 46">' +
        '<line x1="9" y1="15" x2="9" y2="46" stroke="url(#flyArrowGrad)" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M9 1 L0 17 L18 17 Z" fill="#f3d38a" stroke="#a9721f" stroke-width="0.6" stroke-linejoin="round"/>' +
        '<defs><linearGradient id="flyArrowGrad" x1="0" y1="1" x2="0" y2="0">' +
        '<stop offset="0%" stop-color="#a9721f"/><stop offset="100%" stop-color="#f3d38a"/>' +
        "</linearGradient></defs>" +
        "</svg>";
      arrow.style.left = bowTip.x + "px";
      arrow.style.top = bowTip.y + "px";
      const flightAngle = aimAngle - 90;
      arrow.style.transform = "translate(-50%,-100%) rotate(" + flightAngle + "deg)";
      scene.appendChild(arrow);

      const startTime = performance.now();
      const duration = 420;
      const startX = bowTip.x,
        startY = bowTip.y;
      const midX = (startX + endX) / 2 + (Math.random() * 40 - 20);
      const midY = (startY + endY) / 2;

      const trail = document.createElementNS("http://www.w3.org/2000/svg", "path");
      trail.setAttribute("d", "M " + startX + " " + startY + " Q " + midX + " " + midY + " " + endX + " " + endY);
      trail.setAttribute("fill", "none");
      trail.setAttribute("stroke", "rgba(232,179,78,.6)");
      trail.setAttribute("stroke-width", "2.5");
      trail.setAttribute("stroke-linecap", "round");
      aimLineSvg.appendChild(trail);
      const trailLen = trail.getTotalLength();
      trail.style.strokeDasharray = String(trailLen);
      trail.style.strokeDashoffset = String(trailLen);
      trail.style.transition = "stroke-dashoffset " + duration + "ms ease-out";
      requestAnimationFrame(() => {
        trail.style.strokeDashoffset = "0";
      });

      function frame(now: number) {
        const t = Math.min(1, (now - startTime) / duration);
        const it = 1 - t;
        const x = it * it * startX + 2 * it * t * midX + t * t * endX;
        const y = it * it * startY + 2 * it * t * midY + t * t * endY;
        const scale = 1 - t * 0.35;
        arrow.style.left = x + "px";
        arrow.style.top = y + "px";
        arrow.style.transform =
          "translate(-50%,-100%) rotate(" + flightAngle + "deg) scale(" + scale + ")";
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          checkHit(endX, endY, arrow);
          trail.style.transition = "opacity .45s ease";
          trail.style.opacity = "0";
          setTimeout(() => trail.remove(), 450);
        }
      }
      requestAnimationFrame(frame);
    }

    function checkHit(x: number, y: number, arrowEl: HTMLDivElement) {
      const tc = getTargetCenter();
      const dist = Math.hypot(x - tc.x, y - tc.y);
      if (dist <= tc.radius + 18) {
        registerHit();
        arrowEl.style.transition = "opacity .25s ease";
        arrowEl.style.opacity = "0";
        setTimeout(() => arrowEl.remove(), 250);
      } else {
        arrowEl.style.transition = "transform .4s ease, opacity .4s ease";
        arrowEl.style.transform += " translateY(30px)";
        arrowEl.style.opacity = "0";
        showMiss();
        setTimeout(() => arrowEl.remove(), 400);
      }
    }

    function showMiss() {
      misses++;
      missesCounter.textContent = "erros: " + misses;
      const text = missTexts[(misses - 1) % missTexts.length];
      missToast.textContent = text;
      missToast.classList.add(styles.show);
      setTimeout(() => missToast.classList.remove(styles.show), 700);
    }

    function registerHit() {
      hits++;
      hitsCounter.textContent = "💘 " + hits + " / " + requiredHits;

      target.classList.add(styles.hitFlash);
      setTimeout(() => target.classList.remove(styles.hitFlash), 400);

      const idx = (hits - 1) % couplePhotos.length;
      if (isUrl) {
        targetPhoto.innerHTML = `<img src="${couplePhotos[idx]}" alt="foto do casal">`;
        hitCollageItems.push({ url: couplePhotos[idx] });
      } else {
        targetPhoto.innerHTML = `<span style="font-size:44px;">${couplePhotos[idx]}</span><span class="${styles.phLabel}">FOTO PLACEHOLDER</span>`;
        hitCollageItems.push({ emoji: couplePhotos[idx] });
      }

      const capText = captions[(hits - 1) % captions.length];
      caption.textContent = capText;
      caption.classList.add(styles.show);
      setTimeout(() => caption.classList.remove(styles.show), 1400);

      smallHeartPop();

      if (hits >= requiredHits) {
        setTimeout(triggerFinale, 500);
      } else {
        repositionTarget();
      }
    }

    function smallHeartPop() {
      const tc = getTargetCenter();
      for (let i = 0; i < 6; i++) spawnHeart(tc.x, tc.y, 16, 0.7, 60);
    }

    function spawnHeart(cx: number, cy: number, size: number, dur: number, spread: number) {
      const h = document.createElement("div");
      h.className = styles.heartParticle;
      h.textContent = ["💛", "💗", "💖", "✨"][Math.floor(Math.random() * 4)];
      const tx = (Math.random() * 2 - 1) * spread;
      const ty = -Math.abs(Math.random() * spread + 30);
      h.style.setProperty("--sz", size + "px");
      h.style.setProperty("--dur", dur + "s");
      h.style.setProperty("--tx", tx + "px");
      h.style.setProperty("--ty", ty + "px");
      h.style.setProperty("--sc", (0.8 + Math.random() * 0.8).toFixed(2));
      h.style.setProperty("--rot", Math.random() * 90 - 45 + "deg");
      h.style.left = cx + "px";
      h.style.top = cy + "px";
      heartsBurst.appendChild(h);
      setTimeout(() => h.remove(), dur * 1000 + 200);
    }

    function triggerFinale() {
      rectUpdate();
      const cx = sceneRect.width / 2,
        cy = sceneRect.height * 0.42;
      for (let i = 0; i < 40; i++) {
        setTimeout(() => {
          spawnHeart(cx, cy, 18 + Math.random() * 22, 1 + Math.random() * 0.6, 120 + Math.random() * 140);
        }, i * 30);
      }
      setTimeout(showProposal, 1300);
    }

    function buildCollage() {
      collage.innerHTML = "";
      hitCollageItems.forEach((item) => {
        const mini = document.createElement("div");
        mini.className = styles.mini;
        mini.style.setProperty("--r", Math.random() * 16 - 8 + "deg");
        mini.innerHTML = item.url
          ? `<img src="${item.url}" alt="momento">`
          : `<span>${item.emoji}</span>`;
        collage.appendChild(mini);
      });
    }

    function startFallingHearts(container: HTMLDivElement, count: number) {
      container.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const s = document.createElement("span");
        s.className = styles.fallingHeart;
        s.textContent = ["💛", "💗", "✨", "💖"][Math.floor(Math.random() * 4)];
        s.style.left = Math.random() * 100 + "%";
        s.style.fontSize = 14 + Math.random() * 14 + "px";
        s.style.animationDuration = 4 + Math.random() * 4 + "s";
        s.style.animationDelay = Math.random() * 4 + "s";
        container.appendChild(s);
      }
    }

    function showProposal() {
      proposalTitle.textContent = finalQuestion;
      proposalSub.textContent = finalSub;
      buildCollage();
      startFallingHearts(
        root!.querySelector(".js-falling-hearts-proposal") as HTMLDivElement,
        14
      );
      proposalOverlay.classList.remove(styles.hidden);
    }

    function showAccepted() {
      acceptedTitleEl.textContent = acceptedTitle;
      acceptedSubEl.textContent = acceptedSub;
      startFallingHearts(root!.querySelector(".js-falling-hearts-final") as HTMLDivElement, 22);
      proposalOverlay.classList.add(styles.hidden);
      acceptedOverlay.classList.remove(styles.hidden);
    }

    function resetGame() {
      hits = 0;
      misses = 0;
      hitCollageItems = [];
      hitsCounter.textContent = "💘 0 / " + requiredHits;
      missesCounter.textContent = "erros: 0";
      if (targetPhotoUrl) {
        targetPhoto.innerHTML = `<img src="${targetPhotoUrl}" alt="foto">`;
      } else {
        targetPhoto.innerHTML = `<span>💗</span><span class="${styles.phLabel}">FOTO PLACEHOLDER</span>`;
      }
      repositionTarget();
      acceptedOverlay.classList.add(styles.hidden);
      startOverlay.classList.remove(styles.hidden);
    }

    const onShareClick = () => onShareRef.current?.();
    shareBtn.addEventListener("click", onShareClick);

    scene.addEventListener("pointerdown", onDragStart);
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragEnd);
    scene.addEventListener("touchstart", onDragStart, { passive: true });
    window.addEventListener("touchmove", onDragMove, { passive: true });
    window.addEventListener("touchend", onDragEnd);

    const onStart = () => {
      startOverlay.classList.add(styles.hidden);
      rectUpdate();
    };
    startBtn.addEventListener("click", onStart);
    acceptBtn.addEventListener("click", showAccepted);
    restartBtn.addEventListener("click", resetGame);
    window.addEventListener("resize", rectUpdate);

    rectUpdate();
    bow.style.transform = "rotate(" + (aimAngle - 90) + "deg)";

    return () => {
      scene.removeEventListener("pointerdown", onDragStart);
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onDragEnd);
      scene.removeEventListener("touchstart", onDragStart);
      window.removeEventListener("touchmove", onDragMove);
      window.removeEventListener("touchend", onDragEnd);
      startBtn.removeEventListener("click", onStart);
      acceptBtn.removeEventListener("click", showAccepted);
      restartBtn.removeEventListener("click", resetGame);
      window.removeEventListener("resize", rectUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className={styles.phoneFrame}>
      <div className={styles.skyDecor} />

      {showWatermark && <div className={styles.watermark}>Feito com Momozin</div>}

      <div className={styles.hud}>
        <div className={`${styles.hitsCounter} js-hits-counter`}>💘 0 / {requiredHits}</div>
        <div className={`${styles.missesCounter} js-misses-counter`}>erros: 0</div>
      </div>

      <div className={styles.targetLayer}>
        <div className={`${styles.target} js-target`}>
          <div className={styles.targetRing}>
            <div className={`${styles.targetPhoto} js-target-photo`}>
              <span>💗</span>
              <span className={styles.phLabel}>FOTO PLACEHOLDER</span>
            </div>
          </div>
        </div>
        <div className={`${styles.caption} js-caption`} />
      </div>

      <svg className={`${styles.aimLine} js-aim-line`} />

      <div className={styles.bowLayer}>
        <svg className={`${styles.bow} js-bow`} viewBox="0 0 118 100">
          <path d="M0 65 Q59 83 118 65" fill="none" stroke="url(#bowGrad)" strokeWidth={6} strokeLinecap="round" />
          <line x1={2} y1={65} x2={116} y2={65} stroke="#e9dcc9" strokeWidth={1.6} />
          <line x1={59} y1={63} x2={59} y2={26} stroke="url(#arrowGrad)" strokeWidth={3} strokeLinecap="round" />
          <path d="M59 20 L50 34 L68 34 Z" fill="#f3d38a" stroke="#a9721f" strokeWidth={0.6} strokeLinejoin="round" />
          <defs>
            <linearGradient id="bowGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a9721f" />
              <stop offset="50%" stopColor="#f3d38a" />
              <stop offset="100%" stopColor="#a9721f" />
            </linearGradient>
            <linearGradient id="arrowGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#a9721f" />
              <stop offset="100%" stopColor="#f3d38a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className={`${styles.missToast} js-miss-toast`}>quase! 💔</div>

      <div className={`${styles.heartsBurst} js-hearts-burst`} />

      <div className={`${styles.overlay} js-start-overlay`}>
        <div className={styles.cupidIcon}>🏹</div>
        <h1>Flecha do Cupido</h1>
        <p className={styles.sub}>
          Acerte a foto com a flecha do Cupido e desbloqueie
          <br />
          uma surpresa especial no final...
        </p>
        <div className={styles.instructions}>
          Toque e <b>arraste</b> a partir do arco pra mirar,
          <br />
          depois <b>solte</b> pra atirar a flecha na foto. 💘
        </div>
        <button className={`${styles.btn} js-start-btn`}>Começar</button>
      </div>

      <div className={`${styles.overlay} ${styles.hidden} js-proposal-overlay`}>
        <div className="js-falling-hearts-proposal" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }} />
        <div className={`${styles.collage} js-collage`} />
        <h1 className="js-proposal-title">{finalQuestion}</h1>
        <p className={`${styles.sub} js-proposal-sub`}>{finalSub}</p>
        <button className={`${styles.btn} js-accept-btn`}>Sim, eu aceito 💍</button>
      </div>

      <div className={`${styles.overlay} ${styles.hidden} js-accepted-overlay`}>
        <div className="js-falling-hearts-final" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }} />
        <div className={styles.finalPhoto}>
          <span style={{ fontSize: 44 }}>🥰</span>
        </div>
        <h1 className="js-accepted-title">{acceptedTitle}</h1>
        <p className={`${styles.sub} js-accepted-sub`}>{acceptedSub}</p>
        <button className={`${styles.btn} js-share-btn`}>Compartilhar 💌</button>
        <button className={`${styles.btn} ${styles.ghost} js-restart-btn`}>Jogar de novo</button>
      </div>
    </div>
  );
}
