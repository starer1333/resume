"use client";

import gsap from "gsap";

export const MOTION_CONFIG = {
  collageEntrance: {
    anchorDuration: 0.52,
    itemDuration: 1.05,
    stagger: 0.038,
    anchorStartScale: 0.88,
    itemStartScale: 0.45,
    rotationVariance: 7,
  },
  collageWiggle: {
    rotationAmount: 1.6,
    scale: 1.025,
    lift: -2,
    duration: 0.38,
  },
  dogExit: {
    xPercent: -160,
    y: 22,
    rotation: -10,
    scale: 0.97,
    scrub: 0.75,
    start: "top 93%",
    end: "top 60%",
  },
  cardSpread: {
    duration: 0.78,
    stagger: 0.075,
    startScale: 0.95,
    startOpacity: 0.55,
    rotationOffsets: [-8, -4, 0, 4, 8],
    start: "top 83%",
  },
  cardHover: {
    rotationAmount: 3,
    scale: 1.035,
    lift: -6,
    duration: 0.4,
  },
  passport: {
    scale: 1.075,
    tilt: 2,
    duration: 0.42,
    perspective: 1400,
  },
  badges: {
    scale: 1.045,
    lift: -4,
    rotations: [1.8, -1.8, 1.2],
    duration: 0.38,
  },
} as const;

type WiggleOptions = {
  rotationAmount: number;
  scale: number;
  lift: number;
  duration: number;
  hold?: boolean;
  zIndex?: number;
  ready?: () => boolean;
};

const numeric = (value: unknown, fallback: number) => {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function createWiggle(element: HTMLElement, options: WiggleOptions) {
  const original = {
    transform: element.style.transform,
    zIndex: element.style.zIndex,
    willChange: element.style.willChange,
  };
  const base = {
    x: numeric(gsap.getProperty(element, "x"), 0),
    y: numeric(gsap.getProperty(element, "y"), 0),
    rotation: numeric(gsap.getProperty(element, "rotation"), 0),
    scaleX: numeric(gsap.getProperty(element, "scaleX"), 1),
    scaleY: numeric(gsap.getProperty(element, "scaleY"), 1),
  };

  let timeline: gsap.core.Timeline | null = null;

  const restoreInlineState = () => {
    element.style.transform = original.transform;
    element.style.zIndex = original.zIndex;
    element.style.willChange = original.willChange;
  };

  const enter = () => {
    if (options.ready && !options.ready()) return;
    timeline?.kill();
    gsap.killTweensOf(element);
    element.style.willChange = "transform";
    if (options.zIndex !== undefined) element.style.zIndex = String(options.zIndex);

    const segment = options.duration / 4;
    timeline = gsap
      .timeline({ defaults: { overwrite: "auto" } })
      .to(element, {
        x: base.x,
        y: base.y + options.lift,
        rotation: base.rotation + options.rotationAmount,
        scaleX: options.scale,
        scaleY: options.scale,
        duration: segment,
        ease: "power2.out",
      })
      .to(element, {
        rotation: base.rotation - options.rotationAmount * 0.68,
        duration: segment,
        ease: "sine.inOut",
      })
      .to(element, {
        rotation: base.rotation + options.rotationAmount * 0.34,
        duration: segment,
        ease: "sine.inOut",
      })
      .to(element, {
        x: base.x,
        y: options.hold ? base.y + options.lift : base.y,
        rotation: base.rotation,
        scaleX: options.hold ? options.scale : base.scaleX,
        scaleY: options.hold ? options.scale : base.scaleY,
        duration: segment,
        ease: "power2.out",
        onComplete: options.hold ? undefined : restoreInlineState,
      });
  };

  const leave = () => {
    timeline?.kill();
    gsap.killTweensOf(element);
    gsap.to(element, {
      ...base,
      duration: 0.24,
      ease: "power2.out",
      overwrite: true,
      onComplete: restoreInlineState,
    });
  };

  element.addEventListener("pointerenter", enter);
  element.addEventListener("pointerleave", leave);
  element.addEventListener("pointercancel", leave);

  return () => {
    timeline?.kill();
    gsap.killTweensOf(element);
    element.removeEventListener("pointerenter", enter);
    element.removeEventListener("pointerleave", leave);
    element.removeEventListener("pointercancel", leave);
    restoreInlineState();
  };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
