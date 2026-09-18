import type { CSSProperties, ReactNode } from "react";

type FadeUpProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function FadeUp({ children, delay = 0, className = "" }: FadeUpProps) {
  return (
    <div
      style={{ animationDelay: `${delay}ms` } as CSSProperties}
      className={`opacity-0 group-hover:[animation:fade-up_0.4s_ease_both] group-focus-within:[animation:fade-up_0.4s_ease_both] ${className}`}
    >
      {children}
    </div>
  );
}
