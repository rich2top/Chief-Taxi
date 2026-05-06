import { TripLiveView } from "./TripLiveView";

type TripPageProps = {
  params: Promise<{ tripId: string }>;
  searchParams: Promise<{ d?: string }>;
};

export default async function TripPage({ params, searchParams }: TripPageProps) {
  const [{ tripId }, { d }] = await Promise.all([params, searchParams]);

  return <TripLiveView encodedPayload={d ?? null} tripId={tripId} />;
}
