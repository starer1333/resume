"use client";

import { lazy, Suspense } from "react";

const ViscoseCarousel = lazy(() => import("@/vendor/viscose/components/Carousel"));

export function ObserveScene() {
  return (
    <section className="observe-stage">
      <a className="site-logo" href="/" aria-label="How I See — home">
        <img src="/assets/shared/logo.webp" alt="how i see" />
      </a>
      <div className="observe-carousel" aria-label="Interactive portfolio carousel">
        <Suspense fallback={null}><ViscoseCarousel /></Suspense>
      </div>
    </section>
  );
}
