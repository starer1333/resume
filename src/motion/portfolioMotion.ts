"use client";

import gsap from "gsap";

export const MOTION_CONFIG = {
  heroUnfold: {
    trigger: 72,
    mobileTrigger: 42,
    seedDuration: 0.56,
    seedScale: 0.87,
    seedY: 12,
    releaseAt: 0.48,
    duration: 0.96,
    stagger: 0.065,
    collapsedScale: 0.64,
    collapsedOpacity: 0,
    collapsedDepth: -70,
    collapsedOffsets: [
      { x: -20, y: -12 }, { x: 18, y: -14 },
      { x: -24, y: 2 }, { x: 23, y: 4 },
      { x: -16, y: 16 }, { x: 18, y: 18 },
    ],
    collapsedRotations: [-5, 4, -3, 5, 3, -4],
    perspective: 1400,
  },
  heroTilt: {
    rotateX: 3.4,
    rotateY: 4.6,
    lift: -7,
    depth: 22,
    scale: 1.022,
    duration: 0.32,
    resetDuration: 0.28,
  },
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
  slothExit: {
    holdProgress: 0.42,
    xPercent: -150,
    y: 20,
    rotation: -9,
    scale: 0.97,
    scrub: 0.8,
    start: "top top",
    end: "bottom top",
  },
  cardSpread: {
    headingScale: 2.3,
    headingY: 220,
    headingDuration: 1,
    cardsAt: 0.28,
    duration: 0.55,
    stagger: 0.065,
    startScale: 0.94,
    startOpacity: 0.45,
    rotationOffsets: [-7, -3, 0, 3, 7],
    contentAt: 0.5,
    contentDuration: 0.32,
    contentY: 8,
    tailAt: 0.78,
    finalDuration: 0.22,
    finalY: 8,
    start: "top bottom",
    end: "top top",
    scrub: 0.8,
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
  question: {
    rotationAmount: 1.5,
    scale: 1.024,
    duration: 0.34,
    maxX: 3,
    maxY: 2,
    maxRotation: 1,
  },
  make: {
    leftRotateY: 18,
    rightRotateY: -18,
    startY: 18,
    startRotation: -0.6,
    duration: 1.45,
    panelStagger: 0.06,
    perspective: 1200,
  },
  notes: {
    titleDuration: 0.58,
    titleY: 12,
    frameDuration: 0.86,
    frameStagger: 0.1,
    startOpacity: 0.22,
    startScale: 0.78,
    startY: 24,
    rotations: [-4, 3, -3, 4],
    captionDuration: 0.42,
    captionY: 10,
    hoverRotation: 0.9,
    hoverScale: 1.02,
    hoverLift: -4,
    hoverDuration: 0.34,
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

type PointerMicroMotionOptions = {
  rotationAmount: number;
  scale: number;
  duration: number;
  maxX: number;
  maxY: number;
  maxRotation: number;
};

export function createPointerMicroMotion(element: HTMLElement, options: PointerMicroMotionOptions) {
  const original = {
    transform: element.style.transform,
    willChange: element.style.willChange,
  };
  let rect: DOMRect | null = null;
  let xTo: ReturnType<typeof gsap.quickTo> | null = null;
  let yTo: ReturnType<typeof gsap.quickTo> | null = null;
  let rotationTo: ReturnType<typeof gsap.quickTo> | null = null;

  const restoreInlineState = () => {
    element.style.transform = original.transform;
    element.style.willChange = original.willChange;
  };

  const enter = () => {
    rect = element.getBoundingClientRect();
    element.style.willChange = "transform";
    xTo = gsap.quickTo(element, "x", { duration: 0.2, ease: "power2.out" });
    yTo = gsap.quickTo(element, "y", { duration: 0.2, ease: "power2.out" });
    rotationTo = gsap.quickTo(element, "rotation", { duration: 0.2, ease: "power2.out" });
    gsap.timeline({ defaults: { overwrite: "auto" } })
      .to(element, {
        rotation: options.rotationAmount,
        scale: options.scale,
        duration: options.duration * 0.45,
        ease: "power2.out",
      })
      .to(element, {
        rotation: -options.rotationAmount * 0.65,
        duration: options.duration * 0.3,
        ease: "sine.inOut",
      })
      .to(element, {
        rotation: 0,
        duration: options.duration * 0.25,
        ease: "sine.out",
      });
  };

  const move = (event: PointerEvent) => {
    if (!rect || !xTo || !yTo || !rotationTo) return;
    const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
    xTo(nx * options.maxX);
    yTo(ny * options.maxY);
    rotationTo(nx * options.maxRotation);
  };

  const leave = () => {
    rect = null;
    gsap.killTweensOf(element);
    gsap.to(element, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 0.25,
      ease: "power2.out",
      overwrite: true,
      onComplete: restoreInlineState,
    });
  };

  element.addEventListener("pointerenter", enter);
  element.addEventListener("pointermove", move);
  element.addEventListener("pointerleave", leave);
  element.addEventListener("pointercancel", leave);

  return () => {
    gsap.killTweensOf(element);
    element.removeEventListener("pointerenter", enter);
    element.removeEventListener("pointermove", move);
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
