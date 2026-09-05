"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MOTION_CONFIG, prefersReducedMotion } from "@/src/motion/portfolioMotion";
import { DevReferenceOverlay } from "./DevReferenceOverlay";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";

export function MakeScene() {
  const stageRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const context = gsap.context(() => {
      const newspaper = stage.querySelector<HTMLElement>('[data-motion="make-newspaper"]');
      const base = stage.querySelector<HTMLElement>('[data-motion="make-newspaper-base"]');
      const leftPanel = stage.querySelector<HTMLElement>('[data-motion="make-newspaper-left"]');
      const rightPanel = stage.querySelector<HTMLElement>('[data-motion="make-newspaper-right"]');
      if (!newspaper || !base || !leftPanel || !rightPanel) return;
      if (prefersReducedMotion()) {
        gsap.set([leftPanel, rightPanel], { display: "none" });
        newspaper.dataset.motionReady = "true";
        return;
      }

      gsap.set(base, { autoAlpha: 0 });
      gsap.set(leftPanel, {
        rotationY: MOTION_CONFIG.make.leftRotateY,
        transformPerspective: MOTION_CONFIG.make.perspective,
        transformOrigin: "100% 50%",
      });
      gsap.set(rightPanel, {
        rotationY: MOTION_CONFIG.make.rightRotateY,
        transformPerspective: MOTION_CONFIG.make.perspective,
        transformOrigin: "0% 50%",
      });
      gsap.set(newspaper, {
        y: MOTION_CONFIG.make.startY,
        rotation: MOTION_CONFIG.make.startRotation,
      });

      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(base, { clearProps: "opacity,visibility" });
          gsap.set([leftPanel, rightPanel], { display: "none", clearProps: "transform,opacity,visibility" });
          gsap.set(newspaper, { clearProps: "transform" });
          newspaper.dataset.motionReady = "true";
        },
      });
      timeline
        .to(newspaper, {
          y: 0,
          rotation: 0,
          duration: MOTION_CONFIG.make.duration,
          ease: "power3.out",
        }, 0)
        .to(leftPanel, {
          rotationY: 0,
          duration: MOTION_CONFIG.make.duration,
          ease: "power2.inOut",
        }, 0)
        .to(rightPanel, {
          rotationY: 0,
          duration: MOTION_CONFIG.make.duration,
          ease: "power2.inOut",
        }, MOTION_CONFIG.make.panelStagger)
        .to(base, {
          autoAlpha: 1,
          duration: 0.12,
          ease: "none",
        }, MOTION_CONFIG.make.duration - 0.17)
        .to([leftPanel, rightPanel], {
          autoAlpha: 0,
          duration: 0.12,
          ease: "none",
        }, MOTION_CONFIG.make.duration - 0.11);
    }, stage);

    return () => context.revert();
  }, []);

  return (
    <ReferenceArtboard className="paper-stage make-stage" stageRef={stageRef}>
      <SiteNav active="works" />
      <div className="make-newspaper-motion" data-motion="make-newspaper">
        <img className="make-newspaper make-newspaper--base" data-motion="make-newspaper-base" src="/assets/make/newspaper.webp" alt="A handmade newspaper held open, presenting selected creative work" />
        <span className="make-newspaper-panel make-newspaper-panel--left" data-motion="make-newspaper-left" aria-hidden="true">
          <img src="/assets/make/newspaper.webp" alt="" />
        </span>
        <span className="make-newspaper-panel make-newspaper-panel--right" data-motion="make-newspaper-right" aria-hidden="true">
          <img src="/assets/make/newspaper.webp" alt="" />
        </span>
      </div>
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-05-MAKE-NEWSPAPER.png" />
    </ReferenceArtboard>
  );
}
