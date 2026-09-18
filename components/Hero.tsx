"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Globe from "@/components/3d/Globe";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isMobile;
}

const OFFICE_MARKER_CONFIG = {
  markers: [
    { lat: 14.0583, lng: 108.2772, name: "Vietnam" },
    { lat: 1.3521, lng: 103.8198, name: "Singapore" },
    { lat: 26.0667, lng: 50.5577, name: "Bahrain" },
  ],
  color: "#F05A3C",
  size: 45,
};

export default function Hero() {
  const isMobile = useIsMobile();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-background lg:min-h-screen"
    >
      {/* country pills */}

      {/* Globe */}
      <div className="pointer-events-auto absolute inset-0">
        <Globe
          speed={3.5}
          smoothing={8}
          fill="dots"
          dots={{
            color: "#1557D6",
            size: 5,
            density: 7,
            allDots: false,
          }}
          scale={9}
          stopOnHover
          markerConfig={OFFICE_MARKER_CONFIG}
          direction="left"
          initialLatitude={23}
          initialLongitude={-23}
          oceanColor="#ffffff"
          outlineColor={isMobile ? "rgba(21,87,214,0.85)" : "rgba(21,87,214,0.75)"}
          graticuleColor={isMobile ? "rgba(21,87,214,0.3)" : "rgba(21,87,214,0.22)"}
          showOutline
          showGrid
        />
      </div>

      {/* Hero content */}
      <Container className="relative z-10 pointer-events-none">
        <div className="grid grid-cols-1 items-center gap-10 py-24 lg:min-h-screen lg:grid-cols-2 lg:py-32">
          {/* left: heading + subtitle, vertically centered */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">
              Diligent
            </p>

            <h1
              id="hero-heading"
              className="mt-4 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-foreground md:text-6xl lg:text-7xl"
            >
              The Universal Compliance Platform
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-text-muted">
              Banking, BGV, Vendor, Crypto and more.
            </p>
          </div>

          {/* right: explanation text, then CTA row below */}
          <div className="flex flex-col items-start gap-8 lg:items-end lg:text-right">
            <div className="max-w-md lg:ml-auto lg:text-right">
              <h2 className="font-display text-2xl font-semibold leading-snug tracking-[-0.02em] text-foreground">
                Simplifies Customer and employee journeys across client
                lifecycle
              </h2>

              <p className="mt-4 text-base leading-7 text-text-muted">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            <div className="pointer-events-auto flex flex-wrap items-center gap-4 lg:justify-end">
              <Button href="/try-free" variant="primary" className="gap-3">
                Try Free — No Credit Card
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/15 transition-colors duration-300 group-hover:bg-white">
                  <ArrowUpRight className="h-4 w-4 text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                </span>
              </Button>

              <Button href="/demo" variant="secondary" className="gap-3">
                Book a Demo
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-brand transition-colors duration-300 group-hover:bg-brand-dark">
                  <ArrowUpRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Button>

              <Link
                href="/pricing"
                className="inline-flex min-h-10 items-center justify-center px-2 font-display text-sm font-semibold text-foreground transition-colors hover:text-brand"
              >
                See Pricing
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
