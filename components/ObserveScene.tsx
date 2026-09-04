"use client";

import { lazy, Suspense } from "react";

const ViscoseCarousel = lazy(() => import("@/vendor/viscose/components/Carousel"));

export function ObserveScene() {
  return (
    <section className="observe-stage">
      <a className="site-logo" href="/" aria-label="Jinghan — home">jinghan</a>
      <div className="observe-carousel" aria-label="Interactive portfolio carousel">
        <Suspense fallback={null}><ViscoseCarousel /></Suspense>
      </div>
    </section>
  );
}