"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FadeRightBlinkProps = {
  children: ReactNode;
  className?: string;
};

// Heading reveal: fades in while sliding in from the right, then leaves a
// blinking text-cursor style marker at the end, like a selection caret.
export function FadeRightBlink({ children, className = "" }: FadeRightBlinkProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;

    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          once: true,
        },
      });

      tl.fromTo(
        container,
        { opacity: 0, x: 56 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
      );

      if (cursor) {
        tl.fromTo(
          cursor,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
          "-=0.2"
        ).call(() => {
          gsap.to(cursor, {
            opacity: 0,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: "steps(1)",
          });
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {children}
      <span
        ref={cursorRef}
        aria-hidden="true"
        className="ml-1 inline-block h-[0.8em] w-[3px] translate-y-[0.1em] bg-[#1557D6] align-middle opacity-0"
      />
    </span>
  );
}

type FadeDownItemProps = {
  children: ReactNode;
  index?: number;
  className?: string;
};

// Benefit card reveal: drops down into place (like it's falling) and fades
// in, staggered by index, once it scrolls into view.
export function FadeDownItem({ children, index = 0, className = "" }: FadeDownItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: -36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={itemRef} className={className}>
      {children}
    </div>
  );
}
