"use client";

import { lazy, Suspense } from "react";
import { DevReferenceOverlay } from "./DevReferenceOverlay";
import { ReferenceArtboard } from "./ReferenceArtboard";

const ViscoseCarousel = lazy(() => import("@/vendor/viscose/components/Carousel"));

export function ObserveScene() {
  return (
    <ReferenceArtboard className="paper-stage observe-stage">
      <a className="site-logo" href="/" aria-label="How I See — home"><img src="/assets/shared/logo.webp" alt="how i see" /></a>
      <div className="observe-carousel" aria-label="Observe 2026 photography carousel"><Suspense fallback={null}><ViscoseCarousel /></Suspense></div>
      <DevReferenceOverlay src="/@fs/D:/桌面/erbao/how-i-see/dev-references/REF-07-OBSERVE.png" />
    </ReferenceArtboard>
  );
}
