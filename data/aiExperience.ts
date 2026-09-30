// Content and frame config for the AI scroll experience
// (components/sections/AiScrollExperience.tsx).
//
// To swap the visual: drop new frames into `sequence.basePath` (any image
// format the browser can draw — webp/jpg/png/svg), then update `frameCount`,
// `extension`, `padLength` and `aspectRatio` below. Frames are drawn with
// "contain" fitting, so design them on a transparent or black background.

export type AiSequence = {
  basePath: string;
  filePrefix: string;
  extension: string;
  frameCount: number;
  /** Zero-padding of the frame number, e.g. 3 -> frame-001 */
  padLength: number;
  /** First frame number on disk (usually 1) */
  startIndex: number;
  /** Width / height of a frame */
  aspectRatio: number;
  /** Frame shown when motion is reduced (0-based) */
  posterFrame: number;
};

export type AiStage = {
  id: string;
  label: string;
  title: string;
  description: string;
  points: string[];
  /** Scroll progress (0–1) through the sequence at which this stage takes over */
  at: number;
};

export const aiSequence: AiSequence = {
  basePath: "/assets/ai-sequence",
  filePrefix: "frame-",
  extension: "svg",
  frameCount: 96,
  padLength: 3,
  startIndex: 1,
  aspectRatio: 1,
  posterFrame: 71,
};

export const aiIntro = {
  eyebrow: "Diligent AI",
  heading: "AI that does the diligence, end to end",
};

export const aiStages: AiStage[] = [
  {
    id: "extract",
    label: "Document intelligence",
    title: "Reads every document the way an analyst would",
    description:
      "Identity, address and corporate documents are classified, read and cross-checked in seconds, with every extracted field traceable to its source.",
    points: ["Classification & OCR", "Field-level extraction", "Tamper checks"],
    at: 0,
  },
  {
    id: "match",
    label: "Identity match",
    title: "Confirms the person behind the paperwork",
    description:
      "Live capture is matched against the document portrait with liveness checks, so onboarding stays fast without lowering assurance.",
    points: ["Face match", "Liveness detection", "Duplicate detection"],
    at: 0.27,
  },
  {
    id: "screen",
    label: "Risk screening",
    title: "Screens against the lists that matter",
    description:
      "Sanctions, PEP and adverse media are checked continuously. AI clears false positives and routes genuine hits to your team with context.",
    points: ["Sanctions & PEP", "Adverse media", "Ongoing monitoring"],
    at: 0.52,
  },
  {
    id: "decide",
    label: "Decisioning",
    title: "Explains every decision it makes",
    description:
      "Policy-driven risk scoring produces a clear outcome with the reasoning attached, recorded in a version-controlled, audit-ready trail.",
    points: ["Explainable risk scores", "Policy-driven outcomes", "Full audit trail"],
    at: 0.78,
  },
];

export function getAiFrameSrc(index: number, sequence: AiSequence = aiSequence) {
  const number = String(index + sequence.startIndex).padStart(sequence.padLength, "0");
  return `${sequence.basePath}/${sequence.filePrefix}${number}.${sequence.extension}`;
}
