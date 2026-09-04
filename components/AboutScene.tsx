"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { site } from "@/src/content/site";
import { createWiggle, hasFinePointer, MOTION_CONFIG, prefersReducedMotion } from "@/src/motion/portfolioMotion";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";
import { DevReferenceOverlay } from "./DevReferenceOverlay";

const roles = [
  ["role-photographer", 103, 629, 216, 170],
  ["role-writer", 381, 631, 200, 190],
  ["role-researcher", 628, 598, 191, 210],
] as const;

export function AboutScene() {
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion() || !hasFinePointer()) return;

    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      const badges = Array.from(stage.querySelectorAll<HTMLElement>('[data-motion="role-badge"]'));
      badges.forEach((badge, index) => {
        cleanups.push(createWiggle(badge, {
          scale: MOTION_CONFIG.badges.scale,
          lift: MOTION_CONFIG.badges.lift,
          rotationAmount: MOTION_CONFIG.badges.rotations[index],
          duration: MOTION_CONFIG.badges.duration,
          hold: true,
          zIndex: 12,
        }));
      });

      const passport = stage.querySelector<HTMLElement>('[data-motion="passport"]');
      if (!passport) return;

      const original = {
        transform: passport.style.transform,
        transformOrigin: passport.style.transformOrigin,
        willChange: passport.style.willChange,
      };
      let rect = passport.getBoundingClientRect();
      const tiltX = gsap.quickTo(passport, "rotationX", { duration: 0.24, ease: "power2.out" });
      const tiltY = gsap.quickTo(passport, "rotationY", { duration: 0.24, ease: "power2.out" });

      const enter = () => {
        rect = passport.getBoundingClientRect();
        passport.style.willChange = "transform";
        gsap.to(passport, {
          scale: MOTION_CONFIG.passport.scale,
          transformPerspective: MOTION_CONFIG.passport.perspective,
          transformOrigin: "50% 50%",
          duration: MOTION_CONFIG.passport.duration,
          ease: "power3.out",
          overwrite: "auto",
        });
      };
      const move = (event: PointerEvent) => {
        const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        tiltY(normalizedX * MOTION_CONFIG.passport.tilt);
        tiltX(-normalizedY * MOTION_CONFIG.passport.tilt);
      };
      const leave = () => {
        gsap.killTweensOf(passport);
        gsap.to(passport, {
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          duration: 0.34,
          ease: "power2.out",
          overwrite: true,
          onComplete: () => {
            passport.style.transform = original.transform;
            passport.style.transformOrigin = original.transformOrigin;
            passport.style.willChange = original.willChange;
          },
        });
      };

      passport.addEventListener("pointerenter", enter);
      passport.addEventListener("pointermove", move);
      passport.addEventListener("pointerleave", leave);
      passport.addEventListener("pointercancel", leave);
      cleanups.push(() => {
        gsap.killTweensOf(passport);
        passport.removeEventListener("pointerenter", enter);
        passport.removeEventListener("pointermove", move);
        passport.removeEventListener("pointerleave", leave);
        passport.removeEventListener("pointercancel", leave);
        passport.style.transform = original.transform;
        passport.style.transformOrigin = original.transformOrigin;
        passport.style.willChange = original.willChange;
      });
    }, stage);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return (
    <ReferenceArtboard className="paper-stage about-stage" stageRef={stageRef}>
      <SiteNav active="about" />
      <section className="about-intro" aria-labelledby="about-heading">
        <h1 id="about-heading">
          Hi, my name is
          <strong>{site.name}.</strong>
        </h1>
        <img src="/assets/about/pronunciation.webp" alt={`pronounced ${site.pronunciation}`} />
      </section>
      <div className="roles-heading" aria-hidden="true">&gt; CURRENT ROLES &gt;&gt;</div>
      {roles.map(([name, left, top, width, height], index) => (
        <img
          key={name}
          className="role-stamp"
          data-motion="role-badge"
          src={`/assets/about/${name}.webp`}
          alt={site.roles[index]}
          style={{ left, top, width, height }}
        />
      ))}
      <img
        className="passport-art"
        data-motion="passport"
        src="/assets/about/passport.webp"
        alt={`Passport-style profile for ${site.name}, based in ${site.location}. ${site.about.practice}.`}
      />
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-09-ABOUT.png" />
    </ReferenceArtboard>
  );
}