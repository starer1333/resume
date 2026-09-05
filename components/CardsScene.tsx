"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/src/content/site";
import { createWiggle, hasFinePointer, MOTION_CONFIG, prefersReducedMotion } from "@/src/motion/portfolioMotion";
import { ReferenceArtboard } from "./ReferenceArtboard";
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
      const heading = stage.querySelector<HTMLElement>('[data-motion="cards-heading"]');
      const cards = Array.from(stage.querySelectorAll<HTMLElement>('[data-motion="playing-card"]'));
      const cardContent = Array.from(stage.querySelectorAll<HTMLElement>('[data-motion="card-content"]'));
      const tail = Array.from(stage.querySelectorAll<HTMLElement>('[data-motion="cards-tail"]'));
      if (!heading || cards.length !== 5 || cardContent.length !== 5) return;

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
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: shell,
          start: MOTION_CONFIG.cardSpread.start,
          end: MOTION_CONFIG.cardSpread.end,
          scrub: MOTION_CONFIG.cardSpread.scrub,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            cards.forEach((card) => { card.dataset.motionReady = self.progress > 0.98 ? "true" : "false"; });
          },
        },
      });

      timeline
        .fromTo(heading, {
          autoAlpha: 1,
          scale: MOTION_CONFIG.cardSpread.headingScale,
          y: MOTION_CONFIG.cardSpread.headingY,
        }, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: MOTION_CONFIG.cardSpread.headingDuration,
          ease: "none",
        })
        .fromTo(cards, {
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
        }, MOTION_CONFIG.cardSpread.cardsAt)
        .fromTo(cardContent, {
          autoAlpha: 0.55,
          y: MOTION_CONFIG.cardSpread.contentY,
          clipPath: "inset(0 0 6% 0)",
        }, {
          autoAlpha: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: MOTION_CONFIG.cardSpread.contentDuration,
          stagger: MOTION_CONFIG.cardSpread.stagger,
          ease: "power2.out",
        }, MOTION_CONFIG.cardSpread.contentAt)
        .fromTo(tail, {
          autoAlpha: 0,
          y: MOTION_CONFIG.cardSpread.finalY,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: MOTION_CONFIG.cardSpread.finalDuration,
          stagger: 0.06,
          ease: "power2.out",
        }, MOTION_CONFIG.cardSpread.tailAt);
    }, stage);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return (
    <ReferenceArtboard className="paper-stage cards-stage" motion="cards-section" stageRef={stageRef}>
      <h2 className="cards-title" data-motion="cards-heading">What do I make of things?</h2>
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
              <img data-motion="card-content" src={`/assets/cards/${card.asset}.webp`} alt="" />
            </a>
          );
        })}
      </div>
      <img className="pick-doodle" data-motion="cards-tail" src="/assets/cards/pick.webp" alt="Pick a card, any card!" />
      <img className="social-strip" data-motion="cards-tail" src="/assets/shared/social.webp" alt="Let's connect" />
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-02-CARDS.png" />
    </ReferenceArtboard>
  );
}
