import { notFound } from "next/navigation";
import { featureLoaders } from "@/shell/feature-registry.generated";

// One route renders any prototype feature by slug. Adding a feature touches
// no shared file — the registry is regenerated from src/features/*.
export default async function LabFeaturePage({
  params,
}: {
  params: Promise<{ feature: string }>;
}) {
  const { feature } = await params;
  const load = featureLoaders[feature];

  if (!load) {
    notFound();
  }

  const mod = await load();
  const Feature = mod.default;
  return <Feature />;
}
