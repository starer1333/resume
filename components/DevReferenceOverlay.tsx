"use client";

import { useEffect, useState } from "react";

export function DevReferenceOverlay({ src }: { src: string }) {
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0.5);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r") setVisible((value) => !value);
      if (event.key === "[") setOpacity((value) => Math.max(0.1, value - 0.1));
      if (event.key === "]") setOpacity((value) => Math.min(0.9, value + 0.1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (process.env.NODE_ENV === "production" || !visible) return null;

  return (
    <img
      className="dev-reference-overlay"
      src={src}
      alt=""
      aria-hidden="true"
      style={{ opacity }}
    />
  );
}
