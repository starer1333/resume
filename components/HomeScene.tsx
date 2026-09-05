"use client";

import type { CSSProperties } from "react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroCenterMode, heroFragments, heroIdentity } from "@/src/content/hero";
import { hasFinePointer, MOTION_CONFIG, prefersReducedMotion } from "@/src/motion/portfolioMotion";
import { SiteNav } from "./SiteNav";

type HeroFragment = (typeof heroFragments)[number];

function fragmentStyle(fragment: HeroFragment) {
  return {
    "--hero-left": fragment.desktop.left,
    "--hero-top": fragment.desktop.top,
    "--hero-width": fragment.desktop.width,
    "--hero-ratio": fragment.desktop.ratio,
    "--hero-rotate": `${fragment.desktop.rotate}deg`,
    "--hero-depth": `${fragment.desktop.depth}px`,
    "--hero-mobile-left": fragment.mobile.left,
    "--hero-mobile-top": fragment.mobile.top,
    "--hero-mobile-width": fragment.mobile.width,
    "--hero-mobile-ratio": fragment.mobile.ratio,
    "--hero-mobile-rotate": `${fragment.mobile.rotate}deg`,
  } as CSSProperties;
}

function FragmentContents({ fragment }: { fragment: HeroFragment }) {
  return (
    <div className="hero-fragment__surface" data-motion="hero-fragment-surface">
      <div className="hero-fragment__media">
        {fragment.asset ? (
          <img src={fragment.asset} alt={fragment.alt} />
        ) : (
          <div className={`hero-fragment__graphic hero-fragment__graphic--${fragment.id}`} aria-hidden="true">
            <span>{fragment.id === "guitar" ? "six quiet strings" : fragment.id === "piano" ? "88 keys / one room" : "cut  01:24:08"}</span>
            <i /><i /><i /><i />
          </div>
        )}
      </div>
      <span className="hero-fragment__number">{fragment.number}</span>
      <span className="hero-fragment__title">{fragment.title}</span>
      <span className="hero-fragment__note">{fragment.note}</span>
    </div>
  );
}

function HeroFragmentCard({ fragment }: { fragment: HeroFragment }) {
  const className = `hero-fragment hero-fragment--${fragment.kind} hero-fragment--${fragment.tone}`;
  const props = {
    className,
    style: fragmentStyle(fragment),
    "data-motion": "hero-fragment",
    "data-fragment-id": fragment.id,
  };

  if (fragment.href) {
    return (
      <a {...props} href={fragment.href} aria-label={`${fragment.title}: ${fragment.note}`}>
        <FragmentContents fragment={fragment} />
      </a>
    );
  }

  return (
    <article {...props} aria-label={`${fragment.title}: ${fragment.note}`}>
      <FragmentContents fragment={fragment} />
    </article>
  );
}

export function HomeScene() {
  const stageRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    gsap.registerPlugin(ScrollTrigger);
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('[data-motion="hero-fragment"]'));
    const surfaces = Array.from(stage.querySelectorAll<HTMLElement>('[data-motion="hero-fragment-surface"]'));
    const center = stage.querySelector<HTMLElement>('[data-motion="hero-center"]');
    const slothCue = stage.querySelector<HTMLElement>('[data-motion="scroll-sloth"]');
    if (!center || !slothCue || cards.length !== heroFragments.length) return;

    if (prefersReducedMotion()) {
      stage.dataset.heroState = "expanded";
      cards.forEach((card) => { card.dataset.motionReady = "true"; });
      slothCue.dataset.motionReady = "true";
      return;
    }

    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      let unfold: gsap.core.Timeline | null = null;
      let armed = true;
      const isMobile = window.innerWidth <= 720;

      const finalRotation = (card: HTMLElement) => {
        const value = getComputedStyle(card).getPropertyValue("--hero-rotate");
        return Number.parseFloat(value) || 0;
      };

      const placeAtSeed = (state: "seed" | "rearmed") => {
        unfold?.kill();
        gsap.killTweensOf(cards);
        gsap.set(cards, { clearProps: "transform,opacity,visibility" });
        const centerRect = center.getBoundingClientRect();
        const centerX = centerRect.left + centerRect.width / 2;
        const centerY = centerRect.top + centerRect.height / 2;

        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          card.dataset.motionReady = "false";
          const offset = MOTION_CONFIG.heroUnfold.collapsedOffsets[index];
          gsap.set(card, {
            x: centerX - (rect.left + rect.width / 2) + offset.x,
            y: centerY - (rect.top + rect.height / 2) + offset.y,
            z: MOTION_CONFIG.heroUnfold.collapsedDepth,
            scale: MOTION_CONFIG.heroUnfold.collapsedScale,
            rotation: MOTION_CONFIG.heroUnfold.collapsedRotations[index],
            rotationX: index % 2 === 0 ? -8 : 7,
            rotationY: index % 2 === 0 ? 10 : -10,
            autoAlpha: MOTION_CONFIG.heroUnfold.collapsedOpacity,
            transformPerspective: MOTION_CONFIG.heroUnfold.perspective,
            transformOrigin: "50% 50%",
          });
        });
        stage.dataset.heroState = state;
      };

      const expand = (introduceSeed = false) => {
        if (!armed) return;
        armed = false;
        stage.dataset.heroState = "entering";
        cards.forEach((card) => { card.dataset.motionReady = "false"; });

        unfold = gsap.timeline({
          onComplete: () => {
            stage.dataset.heroState = "expanded";
            cards.forEach((card) => { card.dataset.motionReady = "true"; });
          },
        });
        if (introduceSeed) {
          unfold.fromTo(center, {
            autoAlpha: 0,
            scale: MOTION_CONFIG.heroUnfold.seedScale,
            y: MOTION_CONFIG.heroUnfold.seedY,
          }, {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: MOTION_CONFIG.heroUnfold.seedDuration,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          }, 0);
        }

        unfold
          .to(cards, {
            x: 0,
            y: 0,
            z: 0,
            scale: 1,
            rotation: (_index, target) => finalRotation(target as HTMLElement),
            rotationX: 0,
            rotationY: 0,
            autoAlpha: 1,
            duration: MOTION_CONFIG.heroUnfold.duration,
            stagger: { each: MOTION_CONFIG.heroUnfold.stagger, from: "start" },
            ease: "power3.out",
            clearProps: "transform,opacity,visibility,transform-origin",
          }, introduceSeed ? MOTION_CONFIG.heroUnfold.releaseAt : 0);
      };

      placeAtSeed("seed");
      expand(true);

      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: () => `top+=${isMobile ? MOTION_CONFIG.heroUnfold.mobileTrigger : MOTION_CONFIG.heroUnfold.trigger} top`,
        onEnter: (self) => {
          if (self.direction > 0 && armed) expand();
        },
        onLeaveBack: (self) => {
          if (self.direction < 0) {
            armed = true;
            placeAtSeed("rearmed");
          }
        },
        invalidateOnRefresh: true,
      });
      cleanups.push(() => trigger.kill());

      const slothTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: MOTION_CONFIG.slothExit.start,
          end: MOTION_CONFIG.slothExit.end,
          scrub: MOTION_CONFIG.slothExit.scrub,
          invalidateOnRefresh: true,
        },
      });
      slothTimeline
        .to(slothCue, { duration: MOTION_CONFIG.slothExit.holdProgress })
        .to(slothCue, {
          xPercent: MOTION_CONFIG.slothExit.xPercent,
          y: MOTION_CONFIG.slothExit.y,
          rotation: MOTION_CONFIG.slothExit.rotation,
          scale: MOTION_CONFIG.slothExit.scale,
          ease: "power2.in",
          duration: 1 - MOTION_CONFIG.slothExit.holdProgress,
        });
      slothCue.dataset.motionReady = "true";

      if (hasFinePointer()) {
        surfaces.forEach((surface, index) => {
          const card = cards[index];
          let rect = surface.getBoundingClientRect();
          const rotateXTo = gsap.quickTo(surface, "rotationX", { duration: 0.26, ease: "power2.out" });
          const rotateYTo = gsap.quickTo(surface, "rotationY", { duration: 0.26, ease: "power2.out" });

          const enter = () => {
            if (card.dataset.motionReady !== "true") return;
            rect = surface.getBoundingClientRect();
            surface.dataset.hovered = "true";
            gsap.to(surface, {
              y: MOTION_CONFIG.heroTilt.lift,
              z: MOTION_CONFIG.heroTilt.depth,
              scale: MOTION_CONFIG.heroTilt.scale,
              duration: MOTION_CONFIG.heroTilt.duration,
              ease: "power3.out",
              overwrite: "auto",
            });
          };
          const move = (event: PointerEvent) => {
            if (card.dataset.motionReady !== "true") return;
            const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
            const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
            rotateYTo(x * MOTION_CONFIG.heroTilt.rotateY);
            rotateXTo(-y * MOTION_CONFIG.heroTilt.rotateX);
          };
          const leave = () => {
            delete surface.dataset.hovered;
            gsap.killTweensOf(surface);
            gsap.to(surface, {
              x: 0, y: 0, z: 0, scale: 1, rotationX: 0, rotationY: 0,
              duration: MOTION_CONFIG.heroTilt.resetDuration,
              ease: "power2.out",
              overwrite: true,
              clearProps: "transform",
            });
          };

          surface.addEventListener("pointerenter", enter);
          surface.addEventListener("pointermove", move);
          surface.addEventListener("pointerleave", leave);
          surface.addEventListener("pointercancel", leave);
          cleanups.push(() => {
            gsap.killTweensOf(surface);
            surface.removeEventListener("pointerenter", enter);
            surface.removeEventListener("pointermove", move);
            surface.removeEventListener("pointerleave", leave);
            surface.removeEventListener("pointercancel", leave);
          });
        });
      }
    }, stage);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return (
    <section ref={stageRef} className="home-hero paper-stage" data-motion="hero" data-hero-state="seed">
      <SiteNav />
      <p className="hero-field-note">a personal field note<br />in sound, image &amp; memory</p>

      <div className="hero-center" data-motion="hero-center" data-center-mode={heroCenterMode}>
        <span className="hero-center__eyebrow">{heroIdentity.eyebrow}</span>
        {heroCenterMode === "portrait" ? (
          <img className="hero-center__portrait" src={heroIdentity.portrait} alt="Portrait of Wang Jinghan" />
        ) : (
          <span className="hero-center__mark" aria-hidden="true">{heroIdentity.mark}</span>
        )}
        <h1>{heroIdentity.name}</h1>
        <p>{heroIdentity.tagline}</p>
      </div>

      <div className="hero-fragments" aria-label="Jinghan's creative world">
        {heroFragments.map((fragment) => <HeroFragmentCard key={fragment.id} fragment={fragment} />)}
      </div>

      <div className="hero-scroll-cue" data-motion="scroll-sloth" aria-hidden="true">
        <img className="hero-scroll-cue__ink hero-scroll-cue__ink--text" src="/assets/shared/scroll.webp" alt="" />
        <span className="hero-scroll-cue__animal">
          <img src="/assets/shared/sloth.jpg" alt="" />
        </span>
        <img className="hero-scroll-cue__ink hero-scroll-cue__ink--arrow" src="/assets/shared/scroll.webp" alt="" />
      </div>
    </section>
  );
}
