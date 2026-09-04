"use client";

import { CSSProperties, ReactNode, Ref, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  height?: number;
  motion?: string;
  stageRef?: Ref<HTMLDivElement>;
};

export function ReferenceArtboard({ children, className = "", height = 941, motion, stageRef }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const resize = () => {
      const width = host.current?.clientWidth ?? 1672;
      setScale(width / 1672);
    };
    resize();
    const observer = new ResizeObserver(resize);
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  const hostStyle = { height: height * scale } as CSSProperties;
  const stageStyle = { transform: `scale(${scale})`, height } as CSSProperties;

  return (
    <div ref={host} className="artboard-shell" style={hostStyle}>
      <div ref={stageRef} className={`reference-artboard ${className}`} style={stageStyle} data-motion={motion}>
        {children}
      </div>
    </div>
  );
}
