"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/animations/FadeUp";
import { solutions } from "@/data/solutions";

const navigation = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Platform",
    href: "/platform",
    panelHeading: "One platform, lorem ipsum dolor sit",
    columnLabel: "Capabilities",
    items: [
      {
        label: "Lorem Ipsum",
        href: "/platform/lorem-ipsum",
        description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
      },
      {
        label: "Dolor Sit Amet",
        href: "/platform/dolor-sit-amet",
        description: "Sed do eiusmod tempor incididunt ut labore et dolore.",
      },
      {
        label: "Consectetur",
        href: "/platform/consectetur",
        description: "Ut enim ad minim veniam quis nostrud exercitation.",
      },
      {
        label: "Adipiscing Elit",
        href: "/platform/adipiscing-elit",
        description: "Duis aute irure dolor in reprehenderit in voluptate.",
      },
    ],
  },
  {
    label: "Solutions",
    href: "/solutions",
    panelHeading: "Compliance workflows for every industry",
    columnLabel: "Industries",
    items: solutions.map((solution) => ({
      label: solution.shortName,
      href: `/solutions/${solution.slug}`,
      description: solution.description,
    })),
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Resources",
    href: "/resources",
    panelHeading: "Guides, lorem ipsum dolor sit amet",
    columnLabel: "Explore",
    items: [
      {
        label: "Lorem Ipsum",
        href: "/resources/lorem-ipsum",
        description: "Excepteur sint occaecat cupidatat non proident.",
      },
      {
        label: "Dolor Sit Amet",
        href: "/resources/dolor-sit-amet",
        description: "Sunt in culpa qui officia deserunt mollit anim.",
      },
      {
        label: "Consectetur",
        href: "/resources/consectetur",
        description: "Id est laborum et dolorum fuga et harum quidem.",
      },
      {
        label: "Adipiscing Elit",
        href: "/resources/adipiscing-elit",
        description: "Rerum facilis est et expedita distinctio nam libero.",
      },
    ],
  },
  {
    label: "Company",
    href: "/company",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      setScrolled(currentScrollY > 20);

      // Guard widened from 80 to 160: the floating-pill morph starts at
      // 20px and runs for 400ms, so hide-on-scroll-down needs enough room
      // below that to never kick in while the morph is still mid-flight —
      // otherwise the two independent transitions (shape morph vs.
      // translate-away) can overlap and read as two separate steps
      // instead of one continuous motion.
      if (currentScrollY < 160) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transform-gpu transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Floating bar: this wrapper (not the header above) owns the
          background/shadow/rounding, so it can shrink into an inset,
          frosted pill on scroll while the header above just handles the
          hide/show transform independently.
          max-w-[1280px] on the scrolled state matches Container's own
          max-width, so the floating pill lines up with the content edges
          below it (Hero, DomainTiles, etc).
          Position now animates via `transform` (translate-y) instead of
          `margin-top` — same visual result, but transform runs on the
          compositor thread instead of forcing a layout reflow every frame.
          `backdrop-filter` and `box-shadow` are deliberately left OUT of
          the transitioned list (they still change, just instantly with the
          class swap, not eased): they're the two most expensive properties
          a browser can animate, and on this page — which already has a
          continuously-rendering WebGL globe plus GSAP/Lenis scroll work
          competing for the main thread — easing them at the same time as
          everything else was the likely source of the motion feeling like
          it was dropping frames partway through instead of running as one
          clean pass. */}
      <div
        className={`mx-auto border transition-[width,max-width,transform,border-radius,background-color,border-color,padding-left,padding-right] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          scrolled
            ? "translate-y-3 w-[calc(100%-24px)] max-w-[1280px] rounded-2xl border-border bg-white/80 px-6 shadow-[0_18px_40px_-20px_rgba(17,17,17,0.18)] backdrop-blur-xl md:translate-y-4 md:px-8"
            : "translate-y-0 w-full max-w-[2400px] rounded-none border-transparent bg-transparent px-6 shadow-none backdrop-blur-none md:px-10 xl:px-16"
        }`}
      >
        {/* Taller at rest (h-[72px]), easing down to the floating pill's
            h-14 on the same duration/curve as the shell above, so the row
            visibly shrinks in step with the bar instead of staying a fixed
            size inside a bar that just moves around it. This is a pure
            `height` change — no color or blur work involved — so it stays
            smooth regardless of what else is happening on the page.

            The "elements are a little bigger at rest" effect is a small
            scale (1.05) on three SEPARATE, small wrappers below — the
            logo, the nav-links group, and the buttons group — rather than
            one scale on the whole row. Scaling the whole row (what shipped
            last time) grows outward from the row's own center, and since
            the row is already the full 1280px content width, that pushed
            "Book a Demo" straight off the edge of the screen. Each of
            these three groups is small and has real gutter space around
            it, so a modest scale on each individually can't overflow the
            way scaling the entire row did. Each wrapper sits OUTSIDE its
            child's own `[animation:fade-up...]` entrance effect (rather
            than adding the scale to the same element) because that
            page-load animation also drives `transform`, and a transition
            and an animation fighting over the same element's `transform`
            is its own separate bug. */}
        <nav
          aria-label="Main navigation"
          className={`mx-auto flex w-full max-w-[1280px] items-center justify-between transition-[height] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
            scrolled ? "h-14" : "h-[72px]"
          }`}
        >
          <div
            className={`transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              scrolled ? "scale-100" : "scale-105"
            }`}
          >
            <Link
              href="/"
              aria-label="Diligent home"
              className="flex items-center gap-2 opacity-0 [animation:fade-up_0.7s_ease_both]"
            >
              <Image
                src="/assets/company-logo.png"
                alt=""
                width={36}
                height={36}
                priority
                className="h-9 w-9"
              />

              <span className="flex flex-col leading-none">
                <span className="flex w-full justify-between font-display text-xl font-bold text-brand-dark">
                  {"DILIGENT".split("").map((letter, index) => (
                    <span key={index}>{letter}</span>
                  ))}
                </span>

                <span className="mt-0.5 whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.08em] text-text-muted">
                  Customer Due Diligence Platform
                </span>
              </span>
            </Link>
          </div>

          <div
            className={`hidden transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:block ${
              scrolled ? "scale-100" : "scale-105"
            }`}
          >
          <div
            className="hidden items-center gap-6 opacity-0 [animation:fade-up_0.7s_ease_both] [animation-delay:80ms] lg:flex"
          >

            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

              return item.items ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-1.5 font-display text-sm font-medium transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
                      isActive ? "text-brand" : "text-text-muted"
                    }`}
                  >
                    {item.label}

                    <svg
                      aria-hidden="true"
                      viewBox="0 0 10 6"
                      className="h-[6px] w-2.5 fill-none stroke-current stroke-2 transition-transform duration-200 group-hover:-rotate-180"
                    >
                      <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  <div
                    className={[
                      "invisible absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 translate-y-2 opacity-0",
                      "rounded-2xl border border-border bg-white p-2 shadow-xl shadow-black/10",
                      "transition-[visibility,opacity,transform] duration-150",
                      "group-hover:visible group-hover:translate-y-3 group-hover:opacity-100",
                      "group-focus-within:visible group-focus-within:translate-y-3 group-focus-within:opacity-100",
                    ].join(" ")}
                  >
                    <div className="grid grid-cols-[220px_1fr] gap-2">
                      <div className="flex flex-col justify-between rounded-xl bg-surface p-5">
                        <p className="font-display text-lg font-semibold leading-snug text-foreground">
                          {item.panelHeading}
                        </p>

                        <Link
                          href={item.href}
                          className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
                        >
                          See overview
                        </Link>
                      </div>

                      <div className="flex flex-col gap-0.5 p-1">
                        <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
                          {item.columnLabel}
                        </p>

                        {item.items.map((child, index) => (
                          <FadeUp key={child.href} delay={index * 40}>
                            <Link
                              href={child.href}
                              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface hover:text-brand"
                            >
                              {child.label}
                            </Link>
                          </FadeUp>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`font-display text-sm font-medium transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand ${
                    isActive ? "text-brand" : "text-text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          </div>

          <div
            className={`hidden transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:block ${
              scrolled ? "scale-100" : "scale-105"
            }`}
          >
          <div className="hidden items-center gap-2 opacity-0 [animation:fade-up_0.7s_ease_both] [animation-delay:140ms] lg:flex">
            <Button href="/try-free" variant="secondary" size="sm">
              Try Free
            </Button>

            <Button href="/demo" variant="primary" size="sm">
              Book a Demo
            </Button>
          </div>
          </div>

          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded="false"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border opacity-0 [animation:fade-up_0.7s_ease_both] [animation-delay:140ms] lg:hidden"
          >
            <span className="sr-only">Open menu</span>

            <span
              aria-hidden="true"
              className="flex w-5 flex-col gap-1.5"
            >
              <span className="h-px w-full bg-black" />
              <span className="h-px w-full bg-black" />
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
