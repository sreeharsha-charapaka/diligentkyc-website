import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSolution, solutions } from "@/data/solutions";

type SolutionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return solutions.map((solution) => ({
    slug: solution.slug,
  }));
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);

  if (!solution) {
    return {};
  }

  const canonicalPath = `/solutions/${solution.slug}`;

  return {
    title: `${solution.name} Compliance Solutions`,
    description: solution.description,

    alternates: {
      canonical: canonicalPath,
    },

    openGraph: {
      type: "website",
      title: `${solution.name} Compliance Solutions | Diligent`,
      description: solution.description,
      url: canonicalPath,
      siteName: "Diligent",
    },

    twitter: {
      card: "summary_large_image",
      title: `${solution.name} Compliance Solutions | Diligent`,
      description: solution.description,
    },
  };
}

export default async function SolutionPage({
  params,
}: SolutionPageProps) {
  const { slug } = await params;
  const solution = getSolution(slug);

  if (!solution) {
    notFound();
  }

  return (
    <main>
      <article>
        <header>
          <p>Diligent Solutions</p>

          <h1>{solution.name}</h1>

          <p>{solution.description}</p>
        </header>

        <section aria-labelledby="solution-overview">
          <h2 id="solution-overview">
            Compliance infrastructure for {solution.shortName}
          </h2>

          <p>
            Explore how Diligent can support configurable due diligence and
            compliance workflows.
          </p>
        </section>
      </article>
    </main>
  );
}