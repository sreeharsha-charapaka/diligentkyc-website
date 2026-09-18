import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment =
    align === "center"
      ? "items-center text-center"
      : "items-start text-left";

  return (
    <header className={`flex max-w-3xl flex-col ${alignment}`}>
      {eyebrow && (
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-brand">
          {eyebrow}
        </p>
      )}

      <h2 className="font-display text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-black md:text-5xl lg:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
          {description}
        </p>
      )}
    </header>
  );
}
