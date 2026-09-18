"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";

const footerLinks = {
  platform: [
    { label: "Lorem Ipsum", href: "/platform/lorem-ipsum" },
    { label: "Dolor Sit Amet", href: "/platform/dolor-sit-amet" },
    { label: "Consectetur", href: "/platform/consectetur" },
    { label: "Adipiscing Elit", href: "/platform/adipiscing-elit" },
  ],
  solutions: [
    { label: "Banking", href: "/solutions/banking" },
    { label: "Crypto", href: "/solutions/crypto" },
    { label: "Fintech", href: "/solutions/fintech" },
    { label: "Marketplaces", href: "/solutions/marketplaces" },
  ],
  resources: [
    { label: "Lorem Ipsum", href: "/resources/lorem-ipsum" },
    { label: "Dolor Sit Amet", href: "/resources/dolor-sit-amet" },
    { label: "Consectetur", href: "/resources/consectetur" },
    { label: "Adipiscing Elit", href: "/resources/adipiscing-elit" },
  ],
  company: [
    { label: "About Us", href: "/company/about" },
    { label: "Careers", href: "/company/careers" },
    { label: "Contact", href: "/company/contact" },
    { label: "Pricing", href: "/pricing" },
  ],
};

export function Footer() {
  const textRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <footer className="relative mt-16 flex flex-col overflow-hidden bg-[#0A0D14] pt-16 sm:pt-20">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 top-0 m-auto h-[500px] w-[1000px] -translate-y-1/2 rounded-full bg-brand/10 opacity-50 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff14_1px,transparent_1px),linear-gradient(to_bottom,#ffffff14_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Top Row: Clean Brand & Links Grid */}
      <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-10 xl:px-16 pb-4 lg:pb-6">
        <div className="flex flex-col justify-between gap-16 lg:flex-row lg:gap-16">
          
          {/* Left Column: Clean Brand */}
          <div className="flex w-full flex-col relative z-10 lg:w-1/3">
            <Link href="/" aria-label="Diligent home" className="flex items-center gap-3">
              <Image
                src="/assets/company-logo.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="flex flex-col leading-none">
                <span className="flex w-full justify-between font-display text-2xl font-bold text-white tracking-wide">
                  {"DILIGENT".split("").map((letter, index) => (
                    <span key={index}>{letter}</span>
                  ))}
                </span>
                <span className="mt-1 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.1em] text-brand/80">
                  Customer Due Diligence Platform
                </span>
              </span>
            </Link>
            
            <p className="mt-8 text-sm leading-relaxed text-slate-400 font-medium sm:pr-12 lg:pr-8">
              The Universal Compliance Platform building trust across the internet. Automate due diligence, risk assessment, and continuous monitoring with ease.
            </p>
          </div>

          {/* Right Column: Links Grid */}
          <div className="relative z-10 grid w-full grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4 lg:w-2/3 lg:pl-8 xl:pl-16">
            {Object.entries(footerLinks).map(([key, links]) => (
              <div key={key}>
                <h3 className="font-display text-xs font-semibold tracking-widest uppercase text-white">
                  {key}
                </h3>
                <ul className="mt-6 flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm font-medium text-slate-400 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Row: Massive Interactive Branding */}
      <div className="relative mx-auto w-full max-w-[1280px] px-6 md:px-10 xl:px-16 mt-0 pb-6">
        <div 
          ref={textRef}
          onMouseMove={handleMouseMove}
          className="group relative flex w-full justify-between select-none leading-none overflow-hidden cursor-default"
        >
          {/* Background Dim Text */}
          <div className="flex w-full justify-between">
            {"DILIGENT".split("").map((letter, i) => (
              <span key={i} className="font-display text-[15vw] xl:text-[230px] font-bold uppercase text-white/[0.03]">
                {letter}
              </span>
            ))}
          </div>

          {/* Spotlight Text Overlay */}
          <div 
            className="absolute inset-0 flex w-full justify-between pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              WebkitMaskImage: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
              maskImage: `radial-gradient(circle 400px at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
            }}
          >
            {"DILIGENT".split("").map((letter, i) => (
              <span key={i} className="font-display text-[15vw] xl:text-[230px] font-bold uppercase text-brand/60">
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Legal Bar & Socials */}
      <div className="relative z-20 w-full bg-[#0A0D14] border-t border-white/5 py-6">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 px-6 md:px-10 xl:px-16 sm:flex-row">
          <p className="order-3 sm:order-1 text-xs font-medium text-slate-500 text-center sm:text-left">
            © {new Date().getFullYear()} Diligent. All rights reserved.
          </p>
          <div className="order-2 sm:order-2 flex gap-6 text-xs font-medium text-slate-500">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
          <div className="order-1 sm:order-3 flex flex-wrap justify-center gap-3">
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-brand/20 hover:text-brand">
              <span className="sr-only">X (Twitter)</span>
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
            </a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-brand/20 hover:text-brand">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition-colors hover:bg-brand/20 hover:text-brand">
              <span className="sr-only">GitHub</span>
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
