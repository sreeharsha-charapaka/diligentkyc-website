"use client";

import {
  Building2,
  Database,
  FileStack,
  GraduationCap,
  HeartPulse,
  Landmark,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { solutions } from "@/data/solutions";
import { DomainTile } from "@/components/sections/DomainTile";

gsap.registerPlugin(ScrollTrigger);

const DOMAIN_META: Record<
  string,
  { icon: LucideIcon; iconSrc?: string; accent: string }
> = {
  banking: {
    icon: Landmark,
    iconSrc: "/assets/icons/banking-fintech.png",
    accent: "#0353A4",
  },
  "employee-bgv": {
    icon: Users,
    iconSrc: "/assets/icons/employeebgv.png",
    accent: "#0F9D6A",
  },
  "vendor-onboarding": {
    icon: FileStack,
    iconSrc: "/assets/icons/vendoronboarding.png",
    accent: "#F05A3C",
  },
  "crypto-digital-assets": {
    icon: Database,
    iconSrc: "/assets/icons/crypto-assets.png",
    accent: "#6D4FE0",
  },
  "real-estate-aml": {
    icon: Building2,
    iconSrc: "/assets/icons/real-estate.png",
    accent: "#D63F5C",
  },
  insurance: {
    icon: Shield,
    iconSrc: "/assets/icons/insurance.png",
    accent: "#0B84D6",
  },
  healthcare: {
    icon: HeartPulse,
    iconSrc: "/assets/icons/healthcare.png",
    accent: "#159C7A",
  },
  "student-verification": {
    icon: GraduationCap,
    iconSrc: "/assets/icons/student-verification.png",
    accent: "#C98A1F",
  },
};

export default function DomainTiles() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!section || !heading || !grid) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll("[data-domain-tile]");
      const titles = grid.querySelectorAll("[data-domain-title]");

      gsap.fromTo(
        heading,
        { opacity: 0, y: 12, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: grid,
            start: "top 90%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        titles,
        { opacity: 0, x: 32, color: "#c7ccd4" },
        {
          opacity: 1,
          x: 0,
          color: "#111111",
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.2,
          scrollTrigger: {
            trigger: grid,
            start: "top 90%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="domain-tiles-heading"
      className="bg-white px-6 py-24 md:px-10 md:py-32 xl:px-16"
    >
      <Container className="!px-0">
        <div ref={headingRef}>
          <SectionHeading
            eyebrow="Industries"
            title={
              <span id="domain-tiles-heading">
                Compliance infrastructure across{" "}
                <span className="relative inline-block px-1">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[0.2em] bottom-[0.08em] -z-10 rounded-lg bg-gradient-to-r from-brand/25 via-brand-light/25 to-transparent"
                  />
                  <span className="text-brand">8 domains</span>
                </span>
              </span>
            }
            description="One configurable platform built to support due diligence, verification and compliance workflows across multiple industries."
          />
        </div>

        <div ref={gridRef} className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution, index) => {
            const meta = DOMAIN_META[solution.slug];

            return (
              <DomainTile
                key={solution.slug}
                solution={solution}
                index={index}
                icon={meta.icon}
                iconSrc={meta.iconSrc}
                accent={meta.accent}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
