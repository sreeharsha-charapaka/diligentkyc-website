"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
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

      if (currentScrollY < 80) {
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
      className={`fixed inset-x-0 top-0 z-50 transform-gpu transition-all duration-500 ease-in-out will-change-transform ${
        scrolled ? "bg-white shadow-sm shadow-black/5" : "bg-transparent"
      } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <Container>
        <nav
          aria-label="Main navigation"
          className="flex h-16 items-center justify-between"
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

          <div className="hidden items-center gap-2 opacity-0 [animation:fade-up_0.7s_ease_both] [animation-delay:140ms] lg:flex">
            <Button href="/try-free" variant="secondary" size="sm">
              Try Free
            </Button>

            <Button href="/demo" variant="primary" size="sm">
              Book a Demo
            </Button>
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
      </Container>
    </header>
  );
}
