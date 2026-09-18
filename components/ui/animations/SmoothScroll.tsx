"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollProps = {
  children: ReactNode;
};

// Drives GSAP's ticker from Lenis (instead of Lenis running its own rAF loop)
// and keeps ScrollTrigger's cached positions in sync with Lenis's smoothed
// scroll value, so scroll-triggered animations elsewhere in the app never
// desync from what the user is actually seeing.
function LenisGsapBridge() {
  const lenis = useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!lenis) return;

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, autoRaf: false }}>
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
