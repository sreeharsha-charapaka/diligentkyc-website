"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useLoaderState } from "@/components/providers/LoaderProvider";

gsap.registerPlugin(MorphSVGPlugin);

// Globe (rounded) -> hexagon (network) -> shield (compliance) -> back to globe.
const SHAPES = [
  "M100,20 C144.18,20 180,55.82 180,100 C180,144.18 144.18,180 100,180 C55.82,180 20,144.18 20,100 C20,55.82 55.82,20 100,20 Z",
  "M100,15 L170,55 L170,145 L100,185 L30,145 L30,55 Z",
  "M100,20 L165,45 L165,100 C165,145 135,175 100,185 C65,175 35,145 35,100 L35,45 Z",
];

const MIN_VISIBLE_MS = 550;

export function Loader() {
  const isLoading = useLoaderState();
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const shapeRef = useRef<SVGPathElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const loopRef = useRef<gsap.core.Timeline | null>(null);
  const shownAtRef = useRef(0);

  // Mount as soon as loading starts (deferred a tick via setTimeout so the
  // bookkeeping/setState lives in a callback, not the effect body itself).
  useEffect(() => {
    if (!isLoading) return;
    const raf = window.setTimeout(() => {
      shownAtRef.current = Date.now();
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(raf);
  }, [isLoading]);

  // Once loading ends, hold the overlay on screen for a minimum duration
  // (so quick loads/transitions never flash it open and shut), then play
  // the exit morph and unmount.
  useEffect(() => {
    if (isLoading || !mounted) return;

    const elapsed = Date.now() - shownAtRef.current;
    const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

    const timeout = window.setTimeout(() => {
      const overlay = overlayRef.current;
      const shape = shapeRef.current;
      loopRef.current?.kill();

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!overlay || prefersReducedMotion) {
        setMounted(false);
        return;
      }

      const tl = gsap.timeline({ onComplete: () => setMounted(false) });
      if (shape) {
        tl.to(
          shape,
          { morphSVG: SHAPES[0], duration: 0.4, ease: "power2.inOut" },
          0
        ).to(
          shape,
          {
            scale: 1.4,
            transformOrigin: "50% 50%",
            duration: 0.4,
            ease: "power2.in",
          },
          0.05
        );
      }
      tl.to(overlay, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, 0.15);
    }, wait);

    return () => window.clearTimeout(timeout);
  }, [isLoading, mounted]);

  // Drive the looping morph + intro fade while the overlay is mounted.
  useEffect(() => {
    if (!mounted) return;
    const overlay = overlayRef.current;
    const shape = shapeRef.current;
    const ring = ringRef.current;
    if (!overlay) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    gsap.fromTo(
      overlay,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3, ease: "power1.out" }
    );

    if (prefersReducedMotion || !shape) {
      return;
    }

    gsap.set(shape, { attr: { d: SHAPES[0] }, scale: 1, transformOrigin: "50% 50%" });

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(shape, { morphSVG: SHAPES[1], duration: 0.9, ease: "power2.inOut" })
      .to(shape, { morphSVG: SHAPES[2], duration: 0.9, ease: "power2.inOut" }, "+=0.1")
      .to(shape, { morphSVG: SHAPES[0], duration: 0.9, ease: "power2.inOut" }, "+=0.1");
    loopRef.current = tl;

    if (ring) {
      gsap.to(ring, {
        rotate: 360,
        transformOrigin: "50% 50%",
        duration: 6,
        ease: "none",
        repeat: -1,
      });
    }

    return () => {
      tl.kill();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="pointer-events-none fixed inset-0 z-[999] flex flex-col items-center justify-center gap-6 bg-brand-dark"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      <div className="relative flex h-24 w-24 items-center justify-center md:h-28 md:w-28">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-40">
          <circle
            ref={ringRef}
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="#b9d6f2"
            strokeWidth="2"
            strokeDasharray="8 14"
          />
        </svg>

        <svg viewBox="0 0 200 200" className="relative h-full w-full">
          <defs>
            <linearGradient id="loader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b9d6f2" />
              <stop offset="55%" stopColor="#0353a4" />
              <stop offset="100%" stopColor="#f05a3c" />
            </linearGradient>
          </defs>
          <path ref={shapeRef} d={SHAPES[0]} fill="url(#loader-gradient)" />
        </svg>
      </div>

      <div className="flex items-center gap-[0.15em]" aria-hidden="true">
        {"DILIGENT".split("").map((letter, index) => (
          <span
            key={index}
            className="font-display text-sm font-semibold tracking-[0.2em] text-white/80"
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
