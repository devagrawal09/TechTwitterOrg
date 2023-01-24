import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { Tweet } from "../components/Tweet";
import { getSpaces } from "../server/twitter";
import logoImg from "../assets/logo.gif";
import { For, Show } from "solid-js";

export function routeData() {
  return createServerData$(() => getSpaces());
}

export default function Home() {
  const spacesData = useRouteData<typeof routeData>();

  const ongoingSpaces = () =>
    spacesData()?.data?.filter((space) => space.state === "live") || [];

  const upcomingSpaces = () =>
    spacesData()
      ?.data?.filter((space) => space.state === "scheduled")
      .sort(
        (a, b) =>
          new Date(a.scheduled_start!).getTime() -
          new Date(b.scheduled_start!).getTime()
      ) || [];

  const expansionsData = () => {
    const expansions = spacesData()?.includes;
    return expansions;
  };

  return (
    <main class="bg-black text-white">
      <div class="flex justify-between p-5">
        <div class="flex gap-5">
          <img src={logoImg} alt="logo" class="w-10 h-10 rounded-full" />
          <h1 class="text-3xl">TechTwitter.Org</h1>
          <div class="flex gap-5"></div>
        </div>
      </div>
      <div class="flex p-5 gap-11">
        <div class="flex-1 align-middle">
          <h1 class="text-6xl text-center">Discover Tech Twitter Spaces</h1>
        </div>
      </div>
      <div class="flex p-5 gap-11">
        <div class="flex-1 align-middle">
          <h1 class="text-3xl text-center">Ongoing Spaces</h1>

          <div class="flex flex-wrap gap-5 p-5">
            <Show when={ongoingSpaces()} fallback={<div>Loading...</div>} keyed>
              {(spaces) => (
                <Show
                  when={spaces.length !== 0}
                  fallback={<div>No ongoing spaces</div>}
                >
                  <Show
                    when={expansionsData()}
                    fallback={<div>Failed to fetch data</div>}
                    keyed
                  >
                    {(expansions) => (
                      <For each={spaces}>
                        {(space) => (
                          <Tweet space={space} expansions={expansions} />
                        )}
                      </For>
                    )}
                  </Show>
                </Show>
              )}
            </Show>
          </div>
        </div>
      </div>
      <div class="flex p-5 gap-11">
        <div class="flex-1 align-middle">
          <h1 class="text-3xl text-center">Upcoming Spaces</h1>

          <div class="grid grid-cols-2 gap-5 p-5">
            <Show
              when={upcomingSpaces()}
              fallback={<div>Loading...</div>}
              keyed
            >
              {(spaces) => (
                <Show
                  when={spaces.length !== 0}
                  fallback={<div>No upcoming spaces</div>}
                >
                  <Show
                    when={expansionsData()}
                    fallback={<div>Failed to fetch data</div>}
                    keyed
                  >
                    {(expansions) => (
                      <For each={spaces}>
                        {(space) => (
                          <Tweet space={space} expansions={expansions} />
                        )}
                      </For>
                    )}
                  </Show>
                </Show>
              )}
            </Show>
          </div>
        </div>
      </div>
    </main>
  );
}
