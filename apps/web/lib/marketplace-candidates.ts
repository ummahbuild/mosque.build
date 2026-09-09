import records from "@/data/marketplace-candidates.json";

export type MarketplaceCandidate = (typeof records)[number];

export const marketplaceDataset = {
  title: "mosque.build marketplace candidate catalog",
  provenance: "Curated from the 567-row research dataset supplied by the project owner.",
  sourceRows: 567,
  curatedRows: records.length,
  observedAt: "2026-09-09",
  reviewStatus: "needs_review" as const,
  featureStatus: "specified" as const,
  rights: "Short factual descriptors and outbound links only; source imagery and product copy are not reproduced.",
  notice: "Candidate source only. Confirm the exact product, current availability, price, region, technical evidence and professional suitability before specifying or purchasing."
};

export const marketplaceCandidates = records;
