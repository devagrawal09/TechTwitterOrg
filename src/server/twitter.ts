import { Client } from "twitter-api-sdk";
import { prisma } from "./db/client";

const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;

if (!twitterBearerToken) {
  throw new Error("Missing Twitter Bearer Token");
}

const client = new Client(twitterBearerToken);

export const getSpaces = async () => {
  const hosts = await prisma.host.findMany();
  const user_ids = hosts.map((host) => host.twitterId);
  console.log(hosts);
  const spaces = await client.spaces.findSpacesByCreatorIds({
    user_ids,
    "space.fields": [
      `host_ids`,
      `created_at`,
      `creator_id`,
      `id`,
      `lang`,
      `invited_user_ids`,
      `participant_count`,
      `speaker_ids`,
      `started_at`,
      `ended_at`,
      `subscriber_count`,
      `topic_ids`,
      `state`,
      `title`,
      `scheduled_start`,
    ],
    expansions: ["creator_id", "topic_ids"],
    "user.fields": [
      "entities",
      "id",
      "name",
      "profile_image_url",
      "url",
      "username",
    ],
  });

  return spaces;
};

export const addHost = async (username: string) => {
  const user = await client.users.findUserByUsername(username);

  if (!user.data) {
    throw new Error(`User ${username} not found`);
  }

  return prisma.host.create({
    data: {
      twitterId: user.data.id,
      username: user.data.username,
      name: user.data.name,
    },
  });
};
