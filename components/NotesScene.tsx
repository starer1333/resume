"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { site } from "@/src/content/site";
import { createWiggle, hasFinePointer, MOTION_CONFIG, prefersReducedMotion } from "@/src/motion/portfolioMotion";
import { DevReferenceOverlay } from "./DevReferenceOverlay";
import { ReferenceArtboard } from "./ReferenceArtboard";
import { SiteNav } from "./SiteNav";

const positions = [
  [90, 221, 368, 435, 142, 681, 232, 150], [454, 224, 346, 433, 516, 691, 226, 148],
  [830, 222, 304, 398, 882, 637, 242, 154], [1182, 226, 400, 437, 1238, 688, 286, 151],
] as const;

export function NotesScene() {
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const cleanups: Array<() => void> = [];
    const context = gsap.context(() => {
      const title = stage.querySelector<HTMLElement>('[data-motion="notes-title"]');
      const frames = Array.from(stage.querySelectorAll<HTMLElement>('[data-motion="note-frame"]'));
      const captions = Array.from(stage.querySelectorAll<HTMLElement>('[data-motion="note-caption"]'));
      if (!title || frames.length !== 4 || captions.length !== 4) return;

      if (prefersReducedMotion()) {
        frames.forEach((frame) => { frame.dataset.motionReady = "true"; });
        return;
      }

      const stageRect = stage.getBoundingClientRect();
      const stageCenter = {
        x: stageRect.left + stageRect.width / 2,
        y: stageRect.top + stageRect.height / 2,
      };
      const ordered = frames
        .map((frame, index) => {
          const rect = frame.getBoundingClientRect();
          return {
            frame,
            caption: captions[index],
            index,
            distance: Math.hypot(rect.left + rect.width / 2 - stageCenter.x, rect.top + rect.height / 2 - stageCenter.y),
          };
        })
        .sort((a, b) => a.distance - b.distance);

      const timeline = gsap.timeline();
      timeline.fromTo(title, {
        autoAlpha: 0,
        y: MOTION_CONFIG.notes.titleY,
      }, {
        autoAlpha: 1,
        y: 0,
        duration: MOTION_CONFIG.notes.titleDuration,
        ease: "power3.out",
        clearProps: "transform,opacity,visibility",
      });

      ordered.forEach(({ frame, caption, index }, order) => {
        frame.dataset.motionOrder = String(order);
        const frameStart = 0.1 + order * MOTION_CONFIG.notes.frameStagger;
        timeline.fromTo(frame, {
          autoAlpha: MOTION_CONFIG.notes.startOpacity,
          scale: MOTION_CONFIG.notes.startScale,
          y: MOTION_CONFIG.notes.startY,
          rotation: MOTION_CONFIG.notes.rotations[index],
        }, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          rotation: 0,
          duration: MOTION_CONFIG.notes.frameDuration,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          onComplete: () => { frame.dataset.motionReady = "true"; },
        }, frameStart);
        timeline.fromTo(caption, {
          autoAlpha: 0,
          y: MOTION_CONFIG.notes.captionY,
        }, {
          autoAlpha: 1,
          y: 0,
          duration: MOTION_CONFIG.notes.captionDuration,
          ease: "power2.out",
          clearProps: "transform,opacity,visibility",
          onComplete: () => { caption.dataset.motionReady = "true"; },
        }, frameStart + MOTION_CONFIG.notes.frameDuration * 0.82);
      });

      timeline.call(() => {
        if (!hasFinePointer()) return;
        frames.forEach((frame, index) => {
          cleanups.push(createWiggle(frame, {
            rotationAmount: index % 2 === 0 ? MOTION_CONFIG.notes.hoverRotation : -MOTION_CONFIG.notes.hoverRotation,
            scale: MOTION_CONFIG.notes.hoverScale,
            lift: MOTION_CONFIG.notes.hoverLift,
            duration: MOTION_CONFIG.notes.hoverDuration,
            hold: true,
            zIndex: 12,
            ready: () => frame.dataset.motionReady === "true",
          }));
        });
      });
    }, stage);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    };
  }, []);

  return (
    <ReferenceArtboard className="paper-stage notes-stage" stageRef={stageRef}>
      <SiteNav active="notes" />
      <h1 className="notes-title" data-motion="notes-title">Notes</h1>
      {site.notes.map((note, index) => {
        const [left, top, width, height, labelLeft, labelTop, labelWidth, labelHeight] = positions[index];
        return <article key={note.title}>
          <div className="note-frame art-link" data-motion="note-frame" data-motion-index={index} style={{ left, top, width, height }}><img src={`/assets/notes/${note.asset}.webp`} alt={note.title} /></div>
          <div className="museum-label" data-motion="note-caption" style={{ left: labelLeft, top: labelTop, width: labelWidth, height: labelHeight }}><strong>{note.title}</strong><span>{note.date}</span><small>{note.kind}</small></div>
        </article>;
      })}
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-04-NOTES.png" />
    </ReferenceArtboard>
  );
}