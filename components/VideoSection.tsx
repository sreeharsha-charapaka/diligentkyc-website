"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const START_WIDTH = 320;
const START_RATIO = 0.55;
const INTRO_VIDEO_URL = "https://youtu.be/Wb14HArIM38";

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapperRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  // The background video keeps decoding every frame while it plays, even
  // when it has scrolled out of view. On a large source file that steals
  // enough main-thread/GPU time to make scrolling elsewhere on the page
  // (e.g. the pinned scrub above, or the cards below) feel janky. Pausing
  // it once it's off-screen keeps decode cost limited to when it's visible.
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {});
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(videoEl);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const videoWrapper = videoWrapperRef.current;

    if (!section || !videoWrapper) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        videoWrapper,
        {
          scale: () =>
            Math.min(START_WIDTH, videoWrapper.offsetWidth * START_RATIO) /
            videoWrapper.offsetWidth,
          y: "3vh",
        },
        {
          scale: 1,
          y: "0vh",

          ease: "none",
          force3D: true,

          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handlePointerMove = (event: MouseEvent<HTMLButtonElement>) => {
    const wrapper = videoWrapperRef.current;
    const pill = pillRef.current;
    if (!wrapper || !pill) return;

    const rect = wrapper.getBoundingClientRect();
    gsap.to(pill, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      xPercent: -50,
      yPercent: -50,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[100vh] bg-white"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Expanding video */}
        <button
          type="button"
          onClick={() => window.open(INTRO_VIDEO_URL, "_blank", "noopener,noreferrer")}
          onMouseMove={handlePointerMove}
          onMouseEnter={handlePointerMove}
          aria-label="Play intro video"
          className="group relative block cursor-none overflow-hidden rounded-[20px] bg-black will-change-transform"
          ref={videoWrapperRef}
          style={{
            width: "min(96vw, 163.5vh)",
            aspectRatio: "16 / 9",
            maxHeight: "92vh",
            transformOrigin: "center center",
          }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src="/assets/video/DILIGENT_ID&V_MONITOR.mp4"
            preload="metadata"
            autoPlay
            muted
            loop
            playsInline
          />

          {/* Optional subtle overlay */}
          <div className="pointer-events-none absolute inset-0 bg-black/5" />

          {/* Play intro pill – follows the cursor */}
          <span
            ref={pillRef}
            className="pointer-events-none absolute left-0 top-0 flex items-center gap-3 whitespace-nowrap rounded-full bg-white px-6 py-3 text-base font-medium text-black opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Play intro
          </span>
        </button>
      </div>
    </section>
  );
}