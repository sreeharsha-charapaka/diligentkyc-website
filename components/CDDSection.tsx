"use client";

import { FadeDownItem, FadeRightBlink } from "@/components/ui/animations/CDDReveal";

const benefits = [
  {
    number: "01",
    title: "Simplified Customer Journeys",
    description:
      "Streamline customer and employee journeys across the entire client lifecycle.",
  },
  {
    number: "02",
    title: "Zero-Code Configuration",
    description:
      "Configure compliance workflows and policies without writing code.",
  },
  {
    number: "03",
    title: "Reduced Compliance Costs",
    description:
      "Save time and reduce the operational cost of compliance across your organisation.",
  },
  {
    number: "04",
    title: "Always Audit Ready",
    description:
      "System-driven policy execution and version-controlled KYC profiles keep your compliance processes audit ready.",
  },
];

export default function CDDSection() {
  return (
    <section className="relative bg-white px-6 py-32 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">

        {/* Main Statement */}
        <div className="max-w-[1200px]">
          <h2 className="text-[clamp(1.75rem,3.2vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#111827]">
            <FadeRightBlink>
              Simplify customer due diligence across the client lifecycle with
              zero-code configuration, lower compliance costs, and system-driven
              policies that keep every KYC profile audit ready.
            </FadeRightBlink>
          </h2>
        </div>

        {/* Benefits */}
        <div className="mt-24 grid border-t border-neutral-200 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <FadeDownItem
              key={benefit.number}
              index={index}
              className="border-b border-neutral-200 py-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
            >
              <span className="text-sm font-medium text-[#1557D6]">
                {benefit.number}
              </span>

              <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em] text-[#111827]">
                {benefit.title}
              </h3>

              <p className="mt-4 max-w-[280px] text-[15px] leading-6 text-neutral-500">
                {benefit.description}
              </p>
            </FadeDownItem>
          ))}
        </div>

      </div>
    </section>
  );
}