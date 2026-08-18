import type { PublicEventData } from "@/lib/happily/types";

import { ordered } from "./helpers";
import { SpeakerCard } from "./speaker-card";

type SpeakersGridProps = {
  speakers: PublicEventData["speakers"];
};

export function SpeakersGrid({ speakers }: SpeakersGridProps) {
  return (
    <div className="flex flex-nowrap items-center justify-center gap-4 overflow-x-auto pb-1">
      {ordered(speakers).map((speaker) => (
        <SpeakerCard key={speaker.id} speaker={speaker} />
      ))}
    </div>
  );
}
