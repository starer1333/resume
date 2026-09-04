"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createWiggle, hasFinePointer, MOTION_CONFIG, prefersReducedMotion } from "@/src/motion/portfolioMotion";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";
import { DevReferenceOverlay } from "./DevReferenceOverlay";

const pieces = [
  ["flowers-top", 340, 86, 146, 206],
  ["collect-note", 479, 128, 130, 160],
  ["window-top", 605, 96, 185, 196],
  ["vase", 792, 93, 160, 188],
  ["portrait-top", 973, 123, 156, 172],
  ["coast", 1114, 142, 146, 122],
  ["fern", 1258, 110, 134, 161],
  ["coffee", 153, 344, 158, 169],
  ["photo-booth", 314, 294, 182, 225],
  ["film", 505, 393, 116, 190],
  ["today-note", 1004, 315, 164, 239],
  ["camera-shelf", 1164, 286, 162, 139],
  ["field-frame", 1314, 259, 176, 149],
  ["friend-strip", 1344, 399, 118, 197],
  ["moment-note", 1414, 404, 146, 188],
  ["little-note", 166, 530, 145, 133],
  ["market", 321, 530, 177, 138],
  ["camera", 277, 657, 122, 93],
  ["botanical-cat", 494, 584, 210, 185],
  ["ticket", 994, 580, 154, 128],
  ["window-frame", 1164, 579, 158, 245],
  ["memory-note", 1306, 638, 164, 193],
  ["embroidery", 372, 713, 171, 202],
  ["stamp", 532, 735, 184, 185],
  ["landscape-wide", 690, 707, 296, 219],
  ["tram", 973, 746, 176, 170],
] as const;

export function HomeScene() {
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      const anchor = stage.querySelector<HTMLElement>('[data-motion="collage-anchor"]');
      const items = Array.from(stage.querySelectorAll<HTMLElement>('[data-motion="collage-item"]'));
      const sloth = stage.querySelector<HTMLElement>('[data-motion="scroll-sloth"]');
      if (!anchor || !sloth) return;

      if (prefersReducedMotion()) {
        items.forEach((item) => { item.dataset.motionReady = "true"; });
        sloth.dataset.motionReady = "true";
        return;
      }

      if (hasFinePointer()) {
        items.forEach((item) => {
          cleanups.push(createWiggle(item, {
            ...MOTION_CONFIG.collageWiggle,
            ready: () => item.dataset.motionReady === "true",
          }));
        });
      }

      const stageRect = stage.getBoundingClientRect();
      const artboardScale = stageRect.width / stage.offsetWidth;
      const anchorRect = anchor.getBoundingClientRect();
      const anchorCenter = {
        x: anchorRect.left + anchorRect.width / 2,
        y: anchorRect.top + anchorRect.height / 2,
      };
      const offsets = items.map((item) => {
        const rect = item.getBoundingClientRect();
        return {
          x: (anchorCenter.x - (rect.left + rect.width / 2)) / artboardScale,
          y: (anchorCenter.y - (rect.top + rect.height / 2)) / artboardScale,
        };
      });

      gsap.timeline()
        .fromTo(anchor, {
          autoAlpha: 0,
          scale: MOTION_CONFIG.collageEntrance.anchorStartScale,
        }, {
          autoAlpha: 1,
          scale: 1,
          duration: MOTION_CONFIG.collageEntrance.anchorDuration,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        })
        .fromTo(items, {
          autoAlpha: 0.15,
          x: (index) => offsets[index].x,
          y: (index) => offsets[index].y,
          scale: MOTION_CONFIG.collageEntrance.itemStartScale,
          rotation: (index) => ((index * 11) % 15) - MOTION_CONFIG.collageEntrance.rotationVariance,
        }, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: MOTION_CONFIG.collageEntrance.itemDuration,
          stagger: MOTION_CONFIG.collageEntrance.stagger,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          onComplete: () => {
            items.forEach((item) => { item.dataset.motionReady = "true"; });
          },
        }, 0.08);

      const shell = stage.closest<HTMLElement>(".artboard-shell") ?? stage;
      gsap.timeline({
        scrollTrigger: {
          trigger: shell,
          start: MOTION_CONFIG.slothExit.start,
          end: MOTION_CONFIG.slothExit.end,
          scrub: MOTION_CONFIG.slothExit.scrub,
        },
      })
        .to(sloth, { duration: MOTION_CONFIG.slothExit.holdProgress })
        .to(sloth, {
          xPercent: MOTION_CONFIG.slothExit.xPercent,
          y: MOTION_CONFIG.slothExit.y,
          rotation: MOTION_CONFIG.slothExit.rotation,
          scale: MOTION_CONFIG.slothExit.scale,
          duration: 1 - MOTION_CONFIG.slothExit.holdProgress,
          ease: "none",
        });
      sloth.dataset.motionReady = "true";
    }, stage);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return (
    <ReferenceArtboard className="paper-stage home-stage" motion="collage-root" stageRef={stageRef}>
      <SiteNav />
      <a className="email-doodle" href="mailto:hello@example.com" aria-label="Email Wang Jinghan">
        <img src="/assets/shared/email.webp" alt="" />
      </a>
      {pieces.map(([name, x, y, width, height]) => (
        <img
          key={name}
          className="collage-piece"
          data-motion="collage-item"
          src={`/assets/home/${name}.webp`}
          alt=""
          aria-hidden="true"
          style={{ left: x, top: y, width, height }}
        />
      ))}
      <img
        className="collage-piece"
        data-motion="collage-anchor"
        src="/assets/home/portrait-wreath.webp"
        alt="Portrait of Wang Jinghan framed with flowers"
        style={{ left: 676, top: 282, width: 326, height: 308 }}
      />
      <div className="home-title">
        <h1>HOW I SEE</h1>
        <p>observing. feeling. remembering.</p>
      </div>
      <img className="scroll-sloth" data-motion="scroll-sloth" src="/assets/shared/sloth.jpg" alt="Scroll down" />
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-01-HOME.png" />
    </ReferenceArtboard>
  );
}