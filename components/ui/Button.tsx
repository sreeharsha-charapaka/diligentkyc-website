import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md";
  className?: string;
};

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-dark",
  secondary:
    "border border-border bg-white text-foreground hover:border-brand hover:text-brand",
  accent:
    "bg-accent text-white hover:opacity-90",
};

const sizes = {
  sm: "min-h-10 px-5 text-sm",
  md: "min-h-12 px-6",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  const classes = [
    "group relative inline-flex items-center justify-center overflow-hidden rounded-full",
    "font-display font-semibold tracking-[-0.01em]",
    "transition-colors duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand",
    sizes[size],
    variants[variant],
    className,
  ].join(" ");

  const shine = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 z-0 w-1/3 -translate-x-[250%] skew-x-[-20deg] bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[350%]"
    />
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {shine}
        <span className="relative z-10 inline-flex items-center gap-[inherit]">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button type="button" className={classes}>
      {shine}
      <span className="relative z-10 inline-flex items-center gap-[inherit]">
        {children}
      </span>
    </button>
  );
}
