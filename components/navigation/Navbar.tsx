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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  const wrapperStyle = scrolled || mobileMenuOpen
    ? {
        marginLeft: "max(16px, calc((100% - 1280px) / 2))",
        marginRight: "max(16px, calc((100% - 1280px) / 2))",
        marginTop: "16px",
      }
    : {
        marginLeft: "0px",
        marginRight: "0px",
        marginTop: "0px",
      };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transform-gpu transition-transform duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${
        hidden ? "-translate-y-[150%]" : "translate-y-0"
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
        style={wrapperStyle}
        className={`border transition-all duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          scrolled || mobileMenuOpen
            ? "rounded-2xl border-border bg-white/95 px-5 shadow-[0_24px_48px_-12px_rgba(17,17,17,0.18)] backdrop-blur-xl md:px-8"
            : "rounded-none border-transparent bg-transparent px-6 shadow-none backdrop-blur-none md:px-10 xl:px-16"
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
          className={`mx-auto flex w-full max-w-[1280px] items-center justify-between transition-[height] duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
            scrolled ? "h-16" : "h-[76px]"
          }`}
        >
          <div
            className={`transition-transform duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
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

                <span className="mt-0.5 hidden whitespace-nowrap text-[8px] font-medium uppercase tracking-[0.08em] text-text-muted sm:block">
                  Customer Due Diligence Platform
                </span>
              </span>
            </Link>
          </div>

          <div
            className={`hidden transition-transform duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:block ${
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
                      "invisible absolute left-1/2 top-full z-50 w-[600px] -translate-x-1/2 pt-6",
                      "opacity-0 translate-y-0 transition-[visibility,opacity,transform] duration-150",
                      "group-hover:visible group-hover:translate-y-1 group-hover:opacity-100",
                      "group-focus-within:visible group-focus-within:translate-y-1 group-focus-within:opacity-100",
                    ].join(" ")}
                  >
                    <div className="rounded-[24px] border border-border bg-white/95 p-2 shadow-[0_24px_48px_-12px_rgba(17,17,17,0.18)] backdrop-blur-xl">
                      <div className="grid grid-cols-[220px_1fr] gap-2">
                        <div className="flex flex-col justify-between rounded-[16px] bg-surface p-5">
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
                                className="group/link block rounded-[12px] px-3 py-2.5 transition-colors hover:bg-surface"
                              >
                                <div className="text-sm font-medium text-foreground transition-colors group-hover/link:text-brand">{child.label}</div>
                                {child.description && (
                                  <div className="mt-0.5 text-xs text-text-muted line-clamp-1">{child.description}</div>
                                )}
                              </Link>
                            </FadeUp>
                          ))}
                        </div>
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
            className={`hidden transition-transform duration-[500ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:block ${
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/50 opacity-0 transition-colors hover:bg-surface [animation:fade-up_0.7s_ease_both] [animation-delay:140ms] lg:hidden"
          >
            <span className="sr-only">Open menu</span>
            <span aria-hidden="true" className="relative h-[10px] w-5">
              <span className={`absolute left-0 top-0 h-px w-full bg-black transition-transform duration-300 ${mobileMenuOpen ? 'translate-y-[4.5px] rotate-45' : ''}`} />
              <span className={`absolute left-0 bottom-0 h-px w-full bg-black transition-transform duration-300 ${mobileMenuOpen ? '-translate-y-[4.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`grid transition-all duration-300 ease-in-out lg:hidden ${
            mobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex flex-col gap-1 pb-6 pt-2">
              {navigation.map((item) => (
                <div key={item.href} className="flex flex-col">
                  <Link
                    href={item.href}
                    className="py-2 font-display text-lg font-medium text-foreground transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                  {item.items && (
                    <div className="mb-2 ml-2 mt-1 flex flex-col gap-2 border-l-2 border-border/50 pl-4">
                      {item.items.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="py-1.5 text-sm font-medium text-text-muted transition-colors hover:text-brand"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href="/try-free" variant="secondary" className="w-full justify-center">
                  Try Free
                </Button>
                <Button href="/demo" variant="primary" className="w-full justify-center">
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
