"use client";

import { ArrowUpRight, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import type { Solution } from "@/data/solutions";

type DomainTileProps = {
  solution: Solution;
  index: number;
  icon: LucideIcon;
  iconSrc?: string;
  accent: string;
  isOpen: boolean;
  onToggle: () => void;
};

function TypedDescription({
  text,
  speed = 14,
}: {
  text: string;
  speed?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let i = 0;

    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) {
        window.clearInterval(id);
      }
    }, speed);

    return () => window.clearInterval(id);
  }, [text, speed]);

  return (
    <>
      {text.slice(0, count)}
      {count < text.length && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-[0.15em] animate-pulse bg-brand align-middle"
        />
      )}
    </>
  );
}

export function DomainTile({
  solution,
  icon: Icon,
  iconSrc,
  accent,
  isOpen,
  onToggle,
}: DomainTileProps) {
  const href = `/solutions/${solution.slug}`;
  const [isHovered, setIsHovered] = useState(false);

  const tileGlow = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background: `radial-gradient(120% 100% at 0% 0%, ${accent}22 0%, ${accent}00 60%)`,
      }}
    />
  );

  const renderIcon = (size: number) => (
    <span className="relative flex h-full w-full items-center justify-center overflow-hidden [perspective:800px]">
      <span className="relative flex h-full w-full items-center justify-center transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:translateY(-0.75rem)_rotateY(180deg)]">
        {iconSrc ? (
          <Image
            src={iconSrc}
            alt=""
            width={size}
            height={size}
            className="h-full w-full object-contain"
          />
        ) : (
          <Icon
            className="h-full w-full"
            style={{ color: accent }}
            strokeWidth={1.5}
          />
        )}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 -translate-x-[250%] skew-x-[-20deg] bg-white/70 transition-transform duration-700 ease-out group-hover:translate-x-[350%]"
      />
    </span>
  );

  return (
    <>
      {/* Desktop card */}
      <Link
        href={href}
        data-domain-tile
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="group relative hidden md:flex"
      >
        <span className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-8 transition-[transform,border-color,box-shadow] duration-500 ease-out group-hover:z-10 group-hover:-translate-y-1 group-hover:scale-x-[1.06] group-hover:scale-y-[1.02] group-hover:border-brand/30 group-hover:shadow-[0_20px_40px_-24px_rgba(3,83,164,0.25)]">
          {tileGlow}

          <span className="relative flex h-32 w-32 items-center justify-center">
            {renderIcon(128)}
          </span>

          <h3
            data-domain-title
            className="mt-6 font-display text-xl font-semibold tracking-[-0.02em] text-foreground"
          >
            {solution.name}
          </h3>

          <p className="mt-2 min-h-[2.5rem] text-sm leading-5 text-text-muted">
            {isHovered ? (
              <TypedDescription text={solution.description} />
            ) : (
              solution.description
            )}
          </p>

          <span className="mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </span>
      </Link>

      {/* Mobile accordion row */}
      <div className="relative overflow-hidden border-b border-border md:hidden">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="group relative flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          {tileGlow}

          <span className="flex items-center gap-4">
            <span className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              {renderIcon(80)}
            </span>
            <span
              data-domain-title
              className="font-display text-base font-semibold tracking-[-0.01em] text-foreground"
            >
              {solution.name}
            </span>
          </span>

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-foreground">
            {isOpen ? (
              <Minus className="h-4 w-4" strokeWidth={1.75} />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={1.75} />
            )}
          </span>
        </button>

        <div
          className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
        >
          <div className="min-h-0">
            <div className="pb-6 pl-[6rem] pr-10">
              <p className="text-[15px] leading-6 text-text-muted">
                {solution.description}
              </p>

              <Link
                href={href}
                className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-brand"
              >
                Explore
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
