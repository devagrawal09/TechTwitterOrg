import { createMemo, Show, type JSX } from "solid-js";
import type { components } from "twitter-api-sdk/dist/types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

type Space = components["schemas"]["Space"];
type Creator = components["schemas"]["User"];
type Expansions = components["schemas"]["Expansions"];

export function Tweet(props: { space: Space; expansions: Expansions }) {
  const creator = createMemo(() => {
    const user = props.expansions.users?.find(
      (u) => u.id === props.space.creator_id
    );
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  });

  return (
    <div class="border border-gray-400/50 p-4 border-t-0 flex-1">
      <div class="flex items-start">
        <div>
          <img
            class="inline-block h-10 w-10 rounded-full"
            src={creator().profile_image_url}
            alt={`${creator().name} (@${creator().username})`}
          />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-base leading-6 font-medium text-white">
            {creator().name}
            <span class="text-sm leading-5 font-medium text-gray-400 group-hover:text-gray-300 transition ease-in-out duration-150 ml-1">
              @{creator().username}
            </span>
          </p>
          <Show when={props.space.state === "live"}>
            <OngoingSpace>
              <TweetCard creator={creator} space={props.space} />
            </OngoingSpace>
          </Show>
          <Show when={props.space.state === "scheduled"}>
            <UpcomingSpace>
              <TweetCard creator={creator} space={props.space} />
            </UpcomingSpace>
          </Show>
        </div>
      </div>
    </div>
  );
}

function OngoingSpace(props: { children: JSX.Element }) {
  return (
    <div class="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg p-3 mt-3">
      {props.children}
    </div>
  );
}

function UpcomingSpace(props: { children: JSX.Element }) {
  return <div class="bg-blue-500 rounded-lg p-3 mt-3">{props.children}</div>;
}

function TweetCard(props: { creator: () => Creator; space: Space }) {
  return (
    <>
      <div class="flex items-center">
        <div>
          <img
            class="inline-block h-6 w-6 rounded-full border border-white"
            src={props.creator().profile_image_url}
            alt=""
          />
        </div>
        <div class="ml-1">
          <p class="text-base leading-6 text-white">
            {props.creator().name}
            <span class="ml-1 inline-block px-2 py-0.5 text-xs font-medium leading-4 bg-gray-300/75 trans rounded">
              Host
            </span>
          </p>
        </div>
      </div>
      <p class="mt-2 text-2xl font-bold">{props.space.title}</p>
      <div class="flex align-middle mt-2">
        {props.space.state === "live" ? (
          <>{props.space.participant_count} in this space</>
        ) : (
          <>
            {dayjs(props.space.scheduled_start).fromNow()} -{" "}
            {dayjs(props.space.scheduled_start).format("h:mm A")}
          </>
        )}
      </div>
      <a
        class="rounded-full w-full bg-white text-black mt-10 hover:bg-gray-300 transition p-1 block text-center font-semibold"
        href={`https://twitter.com/i/spaces/${props.space.id}/peek`}
        target="_blank"
      >
        {props.space.state === "live" ? `Listen Live` : `Set Reminder`}
      </a>
    </>
  );
}
