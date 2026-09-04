"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/src/content/site";
import { createWiggle, hasFinePointer, MOTION_CONFIG, prefersReducedMotion } from "@/src/motion/portfolioMotion";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";
import { DevReferenceOverlay } from "./DevReferenceOverlay";

const cardPositions = [
  [128, 271, 264, 412],
  [434, 279, 255, 408],
  [727, 279, 255, 409],
  [1028, 279, 258, 414],
  [1325, 280, 259, 415],
] as const;

export function CardsScene() {
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      const cards = Array.from(stage.querySelectorAll<HTMLElement>('[data-motion="playing-card"]'));
      if (cards.length !== 5) return;

      if (prefersReducedMotion()) {
        cards.forEach((card) => { card.dataset.motionReady = "true"; });
        return;
      }

      if (hasFinePointer()) {
        cards.forEach((card) => {
          cleanups.push(createWiggle(card, {
            ...MOTION_CONFIG.cardHover,
            hold: true,
            zIndex: 20,
            ready: () => card.dataset.motionReady === "true",
          }));
        });
      }

      const stageRect = stage.getBoundingClientRect();
      const artboardScale = stageRect.width / stage.offsetWidth;
      const centers = cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return rect.left + rect.width / 2;
      });
      const groupCenter = centers.reduce((sum, center) => sum + center, 0) / centers.length;
      const offsets = centers.map((center) => (groupCenter - center) / artboardScale);
      const shell = stage.closest<HTMLElement>(".artboard-shell") ?? stage;

      gsap.timeline({
        scrollTrigger: {
          trigger: shell,
          start: MOTION_CONFIG.cardSpread.start,
          once: true,
        },
      }).fromTo(cards, {
        autoAlpha: MOTION_CONFIG.cardSpread.startOpacity,
        x: (index) => offsets[index],
        scale: MOTION_CONFIG.cardSpread.startScale,
        rotation: (index) => MOTION_CONFIG.cardSpread.rotationOffsets[index],
      }, {
        autoAlpha: 1,
        x: 0,
        scale: 1,
        rotation: 0,
        duration: MOTION_CONFIG.cardSpread.duration,
        stagger: MOTION_CONFIG.cardSpread.stagger,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
        onComplete: () => {
          cards.forEach((card) => { card.dataset.motionReady = "true"; });
        },
      });
    }, stage);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return (
    <ReferenceArtboard className="paper-stage cards-stage" motion="cards-section" stageRef={stageRef}>
      <SiteNav hideNotes />
      <a className="email-doodle" href={site.email} aria-label="Email Wang Jinghan">
        <img src="/assets/shared/email.webp" alt="" />
      </a>
      <h2 className="cards-title">What&apos;s in the cards for us?</h2>
      <div className="playing-cards">
        {site.cards.map((card, index) => {
          const [left, top, width, height] = cardPositions[index];
          return (
            <a
              key={card.href}
              className="playing-card"
              data-motion="playing-card"
              href={card.href}
              aria-label={`${card.number} ${card.title}`}
              style={{ left, top, width, height }}
            >
              <img src={`/assets/cards/${card.asset}.webp`} alt="" />
            </a>
          );
        })}
      </div>
      <img className="pick-doodle" src="/assets/cards/pick.webp" alt="Pick a card, any card!" />
      <img className="social-strip" src="/assets/shared/social.webp" alt="Let's connect" />
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-02-CARDS.png" />
    </ReferenceArtboard>
  );
}