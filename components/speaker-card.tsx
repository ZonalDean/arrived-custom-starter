"use client";

import Image from "next/image";

import type { PublicEventData } from "@/lib/happily/types";

import { SocialIcon } from "react-social-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Markdown } from "@/components/markdown";

type SpeakerCardProps = {
  speaker: PublicEventData["speakers"][number];
  size?: "default" | "sm";
};

function speakerInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function SpeakerDialogContent({
  speaker,
}: {
  speaker: PublicEventData["speakers"][number];
}) {
  return (
    <DialogContent className="max-h-162.5 overflow-y-auto border-none shadow-sm sm:border sm:border-(--event-accent-bg)">
      <DialogDescription className="sr-only">Speaker details</DialogDescription>
      <div className="space-y-3 text-center sm:space-y-4">
        {speaker.image_url ? (
          <div className="mx-auto max-w-62.5">
            <Image
              src={speaker.image_url}
              alt=""
              width={400}
              height={400}
              className="aspect-square rounded-(--event-border-radius) object-cover"
            />
          </div>
        ) : null}

        <DialogTitle className="text-lg font-semibold sm:text-xl">
          {speaker.name}
        </DialogTitle>

        {speaker.title || speaker.company ? (
          <p className="text-lg sm:text-xl">
            {speaker.title && <span>{speaker.title}</span>}
            {speaker.title && speaker.company && <span>, </span>}
            {speaker.company && <span>{speaker.company}</span>}
          </p>
        ) : null}

        {speaker.website_url ? (
          <p>
            <a
              href={speaker.website_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:underline sm:text-base"
            >
              {speaker.website_url.replace(/^https?:\/\//, "")}
            </a>
          </p>
        ) : null}

        {speaker.bio ? (
          <Markdown className="text-sm sm:text-base">{speaker.bio}</Markdown>
        ) : null}

        {speaker.social_urls.length > 0 ? (
          <ul className="flex flex-row justify-center">
            {speaker.social_urls.map((url, index) => (
              <li key={url} className={index === 0 ? "-ml-2" : ""}>
                <SocialIcon
                  style={{ width: 40, height: 40 }}
                  url={url}
                  bgColor="transparent"
                  fgColor={"var(--event-secondary-bg)"}
                  target="_blank"
                  rel="noreferrer"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </DialogContent>
  );
}

export function SpeakerCard({ speaker, size = "default" }: SpeakerCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`View ${speaker.name}`}
          className="shrink-0 cursor-pointer rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--event-secondary-bg) focus-visible:ring-offset-2 focus-visible:ring-offset-(--event-base-bg)"
        >
          <Avatar
            className={
              size === "sm" ? "size-12 sm:size-14" : "size-20 sm:size-24"
            }
          >
            {speaker.image_url ? (
              <AvatarImage src={speaker.image_url} alt={speaker.name} />
            ) : null}
            <AvatarFallback className="text-lg font-semibold">
              {speakerInitials(speaker.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DialogTrigger>

      <SpeakerDialogContent speaker={speaker} />
    </Dialog>
  );
}
