"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MOTION_CONFIG, prefersReducedMotion } from "@/src/motion/portfolioMotion";
import { DevReferenceOverlay } from "./DevReferenceOverlay";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";

export function MakeScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const links = [
    ["Video edits", 660, 147, 356, 204], ["Photography", 699, 397, 267, 229],
    ["Visual experiments", 1005, 475, 147, 177], ["Mobile work", 700, 639, 315, 151],
  ] as const;

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const context = gsap.context(() => {
      const newspaper = stage.querySelector<HTMLElement>('[data-motion="make-newspaper"]');
      if (!newspaper) return;
      if (prefersReducedMotion()) {
        newspaper.dataset.motionReady = "true";
        return;
      }

      gsap.fromTo(newspaper, {
        autoAlpha: MOTION_CONFIG.make.startOpacity,
        clipPath: MOTION_CONFIG.make.clipInset,
        scale: MOTION_CONFIG.make.startScale,
        y: MOTION_CONFIG.make.startY,
        transformPerspective: MOTION_CONFIG.make.perspective,
        transformOrigin: "50% 50%",
      }, {
        autoAlpha: 1,
        clipPath: "inset(0 0% 0 0%)",
        scale: 1,
        y: 0,
        duration: MOTION_CONFIG.make.duration,
        ease: "power3.inOut",
        clearProps: "transform,opacity,visibility,clip-path,transform-origin",
        onComplete: () => { newspaper.dataset.motionReady = "true"; },
      });
    }, stage);

    return () => context.revert();
  }, []);

  return (
    <ReferenceArtboard className="paper-stage make-stage" stageRef={stageRef}>
      <SiteNav active="works" />
      <div className="make-newspaper-motion" data-motion="make-newspaper">
        <img className="make-newspaper" src="/assets/make/newspaper.webp" alt="A handmade newspaper held open, presenting selected creative work" />
      </div>
      <div className="make-hotspots" aria-label="Selected work">
        {links.map(([label, left, top, width, height]) => <a key={label} className="art-link" href={`mailto:hello@example.com?subject=${encodeURIComponent(label)}`} aria-label={label} style={{ left, top, width, height }} />)}
      </div>
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-05-MAKE-NEWSPAPER.png" />
    </ReferenceArtboard>
  );
}