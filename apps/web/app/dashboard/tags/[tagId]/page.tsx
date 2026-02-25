import { TagDetailDashboard } from "../../../../components/TagDetailDashboard";

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ tagId: string }>;
}) {
  const { tagId } = await params;

  return <TagDetailDashboard tagId={tagId} />;
}
