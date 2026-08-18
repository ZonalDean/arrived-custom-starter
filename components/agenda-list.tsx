"use client";

import { useMemo } from "react";

import type { PublicEventData } from "@/lib/happily/types";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FadeInOnScroll } from "./fade-in-on-scroll";
import { eventTimeRange, formatEventDate } from "./helpers";
import { Markdown } from "./markdown";
import { SpeakerCard } from "./speaker-card";

type AgendaListProps = {
  sessions: PublicEventData["sessions"];
  speakers: PublicEventData["speakers"];
  tracks: PublicEventData["tracks"];
  event: PublicEventData["event"];
};

type Speaker = PublicEventData["speakers"][number];
type Session = PublicEventData["sessions"][number];
type Track = PublicEventData["tracks"][number];

function groupByDay(sessions: Session[], timezone: string | null) {
  const groups: [string, Session[]][] = [];
  const map = new Map<string, Session[]>();

  for (const session of sessions) {
    const key = session.start_time
      ? (formatEventDate(session.start_time, timezone, {
          weekday: "long",
          month: "long",
          day: "numeric",
        }) ?? "TBD")
      : "TBD";

    let group = map.get(key);
    if (!group) {
      group = [];
      map.set(key, group);
      groups.push([key, group]);
    }
    group.push(session);
  }

  return groups;
}

function SpeakersList({ speakers }: { speakers: Speaker[] }) {
  return (
    <div className="flex flex-nowrap items-center gap-3 overflow-x-auto pb-1">
      {speakers.map((speaker) => (
        <SpeakerCard key={speaker.id} speaker={speaker} size="sm" />
      ))}
    </div>
  );
}

function SessionBlock({
  session,
  speakerMap,
  trackMap,
  event,
  index,
}: {
  session: Session;
  speakerMap: Map<string, Speaker>;
  trackMap: Map<number, Track>;
  event: PublicEventData["event"];
  index: number;
}) {
  const timeLabel = eventTimeRange({
    ...event,
    start_date: session.start_time,
    end_date: session.end_time,
  });

  const track =
    session.track_id != null ? (trackMap.get(session.track_id) ?? null) : null;

  const sessionSpeakers = session.speakers
    .map((ss) => speakerMap.get(ss.speaker_id))
    .filter((s): s is Speaker => s != null);

  return (
    <FadeInOnScroll delay={index * 80}>
      <article className="group flex flex-col gap-4 rounded-none border border-(--event-base-text)/15 bg-(--event-base-bg) p-6 transition-all duration-300 hover:-translate-y-1 hover:border-(--event-secondary-bg)/50 hover:shadow-lg">
        <p className="font-heading text-sm text-(--event-base-text)/70 md:text-base">
          {timeLabel}
        </p>

        <p className="font-heading text-base font-semibold tracking-wider md:text-lg lg:text-xl">
          {session.name}
        </p>

        {(track || session.location) && (
          <div className="flex flex-wrap gap-2">
            {track && (
              <Badge
                variant="secondary"
                className="cursor-auto rounded-sm font-normal"
              >
                {track.name}
              </Badge>
            )}
            {session.location && (
              <Badge
                variant="secondary"
                className="cursor-auto rounded-sm font-normal"
              >
                {session.location}
              </Badge>
            )}
          </div>
        )}

        {session.description && (
          <div className="text-sm leading-relaxed tracking-wide">
            <Markdown>{session.description}</Markdown>
          </div>
        )}

        {sessionSpeakers.length > 0 && (
          <SpeakersList speakers={sessionSpeakers} />
        )}
      </article>
    </FadeInOnScroll>
  );
}

function SessionList({
  sessions,
  speakerMap,
  trackMap,
  event,
}: {
  sessions: Session[];
  speakerMap: Map<string, Speaker>;
  trackMap: Map<number, Track>;
  event: PublicEventData["event"];
}) {
  return (
    <div className="font-body flex flex-col gap-4">
      {sessions.map((session, index) => (
        <SessionBlock
          key={session.id}
          session={session}
          speakerMap={speakerMap}
          trackMap={trackMap}
          event={event}
          index={index}
        />
      ))}
    </div>
  );
}

export function AgendaList({
  sessions,
  speakers,
  tracks,
  event,
}: AgendaListProps) {
  const sorted = useMemo(
    () =>
      [...sessions].sort((a, b) =>
        String(a.start_time ?? "").localeCompare(String(b.start_time ?? "")),
      ),
    [sessions],
  );

  const speakerMap = useMemo(
    () => new Map(speakers.map((s) => [s.id, s])),
    [speakers],
  );
  const trackMap = useMemo(
    () => new Map(tracks.map((t) => [t.id, t])),
    [tracks],
  );

  const days = useMemo(
    () => groupByDay(sorted, event.timezone),
    [sorted, event.timezone],
  );

  if (days.length <= 1) {
    return (
      <div className="pt-5">
        <SessionList
          sessions={sorted}
          speakerMap={speakerMap}
          trackMap={trackMap}
          event={event}
        />
      </div>
    );
  }

  return (
    <div className="pt-5">
      <Tabs defaultValue={days[0][0]}>
        <TabsList
          variant="line"
          className="size-full justify-start overflow-x-auto"
        >
          {days.map(([dayLabel]) => (
            <TabsTrigger
              key={dayLabel}
              value={dayLabel}
              className="w-full py-1.5 lg:py-1 lg:text-lg"
            >
              {dayLabel}
            </TabsTrigger>
          ))}
        </TabsList>
        {days.map(([dayLabel, daySessions]) => (
          <TabsContent key={dayLabel} value={dayLabel}>
            <SessionList
              sessions={daySessions}
              speakerMap={speakerMap}
              trackMap={trackMap}
              event={event}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
