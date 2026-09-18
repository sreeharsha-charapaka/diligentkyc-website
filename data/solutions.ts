export type Solution = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  keywords: string[];
};

export const solutions: Solution[] = [
  {
    slug: "banking",
    name: "Banking & Fintech",
    shortName: "Banking",
    description:
      "Digital customer due diligence and compliance infrastructure for banking and financial services.",
    keywords: [
      "banking compliance",
      "customer due diligence",
      "AML compliance",
      "KYC automation",
    ],
  },
  {
    slug: "employee-bgv",
    name: "Employee BGV",
    shortName: "Employee BGV",
    description:
      "Streamline employee background verification with configurable digital workflows.",
    keywords: [
      "employee background verification",
      "employee BGV",
      "background verification",
    ],
  },
  {
    slug: "vendor-onboarding",
    name: "Vendor Onboarding",
    shortName: "Vendor Onboarding",
    description:
      "Digitise vendor onboarding and due diligence with configurable compliance workflows.",
    keywords: [
      "vendor onboarding",
      "vendor due diligence",
      "supplier onboarding",
    ],
  },
  {
    slug: "crypto-digital-assets",
    name: "Crypto & Digital Assets",
    shortName: "Crypto & Digital Assets",
    description:
      "Compliance infrastructure for customer due diligence and risk management in digital assets.",
    keywords: [
      "crypto compliance",
      "digital asset compliance",
      "crypto KYC",
      "crypto AML",
    ],
  },
  {
    slug: "real-estate-aml",
    name: "Real Estate AML",
    shortName: "Real Estate AML",
    description:
      "AML and due diligence workflows designed for real estate businesses.",
    keywords: [
      "real estate AML",
      "real estate compliance",
      "real estate KYC",
    ],
  },
  {
    slug: "insurance",
    name: "Insurance",
    shortName: "Insurance",
    description:
      "Configurable compliance and due diligence workflows for insurance organisations.",
    keywords: [
      "insurance compliance",
      "insurance KYC",
      "insurance due diligence",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    shortName: "Healthcare",
    description:
      "Digital verification and compliance workflows for healthcare organisations.",
    keywords: [
      "healthcare compliance",
      "healthcare verification",
      "healthcare KYC",
    ],
  },
  {
    slug: "student-verification",
    name: "Student Verification",
    shortName: "Student Verification",
    description:
      "Digital verification workflows for student and education-related onboarding.",
    keywords: [
      "student verification",
      "student background verification",
      "education verification",
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}