"use client";

import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import {
  aiIntro,
  aiSequence,
  aiStages,
  getAiFrameSrc,
} from "@/data/aiExperience";

gsap.registerPlugin(ScrollTrigger);

// Share of the pinned timeline spent scrubbing the sequence. The rest is the
// exit: content fades out and the background returns to white before the pin
// releases, so the next section picks up on a white page.
const SEQUENCE_SHARE = 0.88;

// Pinned scroll distance, in viewport heights.
const PIN_LENGTH = { desktop: 4.5, mobile: 3 };

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

const isLoaded = (img: HTMLImageElement) => img.complete && img.naturalWidth > 0;

const pad = (n: number) => String(n).padStart(2, "0");

export default function AiScrollExperience() {
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    // The hook reports the server value (false) on the first client render,
    // so read the query directly — never set up the pin if motion is reduced.
    if (reducedMotion || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    const backdrop = backdropRef.current;
    const curtain = curtainRef.current;
    const visual = visualRef.current;
    const content = contentRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!section || !pin || !stage || !backdrop || !curtain || !visual || !content || !canvas || !context) return;

    // --- Image sequence ----------------------------------------------------
    // Frames are drawn to a canvas rather than swapped as <img> sources, so
    // scrubbing never waits on layout or decode of a new element.
    let currentFrame = 0;
    let drawnFrame = -1;
    let width = 0;
    let height = 0;

    const nearestLoaded = (index: number) => {
      for (let offset = 0; offset < images.length; offset++) {
        const before = images[index - offset];
        if (before && isLoaded(before)) return { img: before, index: index - offset };
        const after = images[index + offset];
        if (after && isLoaded(after)) return { img: after, index: index + offset };
      }
      return null;
    };

    const render = () => {
      if (!width || !height) return;
      const found = nearestLoaded(currentFrame);
      if (!found) return;

      const { img } = found;
      const ratio = img.naturalWidth / img.naturalHeight || aiSequence.aspectRatio;
      let drawWidth = width;
      let drawHeight = width / ratio;
      if (drawHeight > height) {
        drawHeight = height;
        drawWidth = height * ratio;
      }

      context.clearRect(0, 0, width, height);
      context.drawImage(
        img,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight
      );
      drawnFrame = found.index;
    };

    const images = Array.from({ length: aiSequence.frameCount }, (_, index) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (index === currentFrame || drawnFrame !== currentFrame) render();
      };
      img.src = getAiFrameSrc(index);
      return img;
    });

    const resizeObserver = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    });
    resizeObserver.observe(canvas);

    // --- Scroll choreography -----------------------------------------------
    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: "(min-width: 1024px)", isMobile: "(max-width: 1023px)" },
      (ctx) => {
        const { isDesktop } = ctx.conditions as { isDesktop: boolean };
        const stageEls = gsap.utils.toArray<HTMLElement>("[data-ai-stage]", content);
        const bars = gsap.utils.toArray<HTMLElement>("[data-ai-bar]", content);
        const playhead = { frame: 0 };
        let activeStage = 0;

        gsap.set(stageEls.slice(1), { autoAlpha: 0 });
        gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(curtain, { autoAlpha: 0 });

        // Stage copy crossfades on a short timed tween when the sequence
        // crosses a stage's `at` point, rather than being scrubbed — text
        // never sits half-faded, and it stays in sync with the frame shown.
        // Wrapped in ctx.add so these later tweens are reverted with the
        // context when the breakpoint changes.
        ctx.add("showStage", (next: number) => {
          if (next === activeStage) return;
          const direction = next > activeStage ? 1 : -1;
          const outgoing = stageEls[activeStage];
          const incoming = stageEls[next];
          activeStage = next;

          gsap.to(outgoing, {
            autoAlpha: 0,
            y: -20 * direction,
            duration: 0.3,
            ease: "power2.in",
            overwrite: true,
          });

          gsap.killTweensOf(incoming);
          gsap.set(incoming, { autoAlpha: 1, y: 0 });
          gsap.fromTo(
            incoming.children,
            { opacity: 0, y: 24 * direction },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: 0.2,
              stagger: 0.06,
              ease: "power3.out",
              overwrite: true,
            }
          );
        });

        // Entry: a dark backdrop fades in as the section arrives (timed, so
        // it reads as a lighting change rather than a grey block scrolling
        // up), and the visual and first stage rise in toward the pin.
        const backdropFade = gsap.fromTo(
          backdrop,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.9, ease: "power2.inOut", paused: true }
        );

        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          onEnter: () => backdropFade.play(),
          onLeaveBack: () => backdropFade.reverse(),
        });

        gsap.fromTo(
          [visual, content],
          { autoAlpha: 0, y: 48 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: section,
              start: "top 50%",
              end: "top top",
              scrub: true,
            },
          }
        );

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () =>
              `+=${window.innerHeight * (isDesktop ? PIN_LENGTH.desktop : PIN_LENGTH.mobile)}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to(
          playhead,
          {
            frame: aiSequence.frameCount - 1,
            duration: SEQUENCE_SHARE,
            onUpdate: () => {
              currentFrame = Math.round(playhead.frame);
              if (currentFrame !== drawnFrame) render();

              const progress = playhead.frame / (aiSequence.frameCount - 1);
              let stageIndex = 0;
              aiStages.forEach((item, index) => {
                if (progress >= item.at) stageIndex = index;
              });
              ctx.showStage(stageIndex);
            },
          },
          0
        );

        aiStages.forEach((item, index) => {
          const start = item.at * SEQUENCE_SHARE;
          const end = (aiStages[index + 1]?.at ?? 1) * SEQUENCE_SHARE;
          tl.to(bars[index], { scaleX: 1, duration: end - start }, start);
        });

        // Exit: clear the stage, then a white curtain inside the pinned frame
        // hands the page back to white before the pin releases.
        const exitStart = SEQUENCE_SHARE + 0.02;
        tl.to(
          stage,
          { autoAlpha: 0, y: -32, duration: 0.05, ease: "power1.in" },
          exitStart
        ).to(curtain, { autoAlpha: 1, duration: 1 - exitStart - 0.02 }, exitStart + 0.02);
      }
    );

    return () => {
      mm.revert();
      resizeObserver.disconnect();
      images.forEach((img) => {
        img.onload = null;
      });
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      // Distinct keys make React replace the whole section when switching
      // layouts, instead of diffing into DOM that GSAP has re-parented into
      // its pin-spacer.
      <section
        key="static"
        data-hide-nav
        aria-labelledby="ai-experience-heading"
        className="bg-[var(--color-black)] text-white"
      >
        <Container className="grid gap-12 py-24 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-32">
          <div className="mx-auto w-full max-w-[560px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- static poster frame from the sequence */}
            <img
              src={getAiFrameSrc(aiSequence.posterFrame)}
              alt=""
              className="h-auto w-full"
              style={{ aspectRatio: aiSequence.aspectRatio }}
            />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-light">
              {aiIntro.eyebrow}
            </p>
            <h2
              id="ai-experience-heading"
              className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] md:text-5xl"
            >
              {aiIntro.heading}
            </h2>

            <ol className="mt-12 space-y-8 border-t border-white/15 pt-8">
              {aiStages.map((stage, index) => (
                <li key={stage.id}>
                  <p className="font-display text-sm font-medium tabular-nums text-brand-light">
                    {pad(index + 1)} · {stage.label}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.02em]">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-6 text-white/65">
                    {stage.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      key="scroll"
      ref={sectionRef}
      data-hide-nav
      aria-labelledby="ai-experience-heading"
      className="relative isolate bg-white text-white"
    >
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="invisible absolute inset-0 -z-10 bg-[var(--color-black)] opacity-0"
      />

      <div ref={pinRef} className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
        <div
          ref={curtainRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute inset-0 z-10 bg-white opacity-0"
        />

        <div
          ref={stageRef}
          className="mx-auto grid h-full w-full max-w-[1280px] grid-rows-[minmax(0,1fr)_auto] gap-6 px-6 pb-10 pt-24 md:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-rows-1 lg:items-center lg:gap-16 lg:py-24 xl:px-16">
          <div ref={visualRef} className="relative min-h-0 lg:h-full lg:max-h-[640px]">
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <div ref={contentRef} className="lg:max-w-[520px]">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-light">
              {aiIntro.eyebrow}
            </p>
            <h2 id="ai-experience-heading" className="sr-only">
              {aiIntro.heading}
            </h2>

            <ol aria-hidden="true" className="mt-5 grid grid-cols-4 gap-2">
              {aiStages.map((stage) => (
                <li key={stage.id}>
                  <span className="block h-px overflow-hidden bg-white/15">
                    <span data-ai-bar className="block h-full bg-brand-light" />
                  </span>
                  <span className="mt-3 hidden text-xs text-white/45 lg:block">
                    {stage.label}
                  </span>
                </li>
              ))}
            </ol>

            {/* Stages share one grid cell so the box sizes to the tallest. */}
            <div className="mt-6 grid lg:mt-12">
              {aiStages.map((stage, index) => (
                <article key={stage.id} data-ai-stage className="[grid-area:1/1]">
                  <p className="font-display text-sm font-medium tabular-nums text-brand-light">
                    {pad(index + 1)}
                    <span className="text-white/35"> / {pad(aiStages.length)}</span>
                    <span className="ml-3 text-white/60 lg:hidden">{stage.label}</span>
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.625rem,3.6vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white lg:mt-5">
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-6 text-white/65 lg:mt-6 lg:text-lg lg:leading-8">
                    {stage.description}
                  </p>
                  <ul className="mt-8 hidden flex-wrap gap-2 md:flex">
                    {stage.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/80"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
