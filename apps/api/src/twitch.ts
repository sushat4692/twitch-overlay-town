import { EventSubMiddleware } from "@twurple/eventsub";
import { Server } from "socket.io";
import { ClientCredentialsAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

import { model, ResidentType } from './models';
import { configs } from "./lib/config";

export const prepareMiddleware = async () => {
  const authProvider = new ClientCredentialsAuthProvider(configs.twitch_client_id, configs.twitch_client_secret, [
    "channel:read:redemptions",
  ]);
  const apiClient = new ApiClient({ authProvider });

  await apiClient.eventSub.deleteAllSubscriptions();
  return new EventSubMiddleware({
    apiClient,
    hostName: configs.twitch_pubsub_host,
    pathPrefix: "/twitch",
    secret: configs.twitch_pubsub_secret,
    strictHostCheck: false,
  });
}

export const useTwitchPubSub = async (middleware: EventSubMiddleware, io: Server) => {
    await middleware.markAsReady();

    // twitch event trigger follow -f {from_id} -t {to_id} -F http://localhost:3000/twitch/event/channel.follow.{to_id} -s channel.follow.{to_id}.{secret}
    // await middleware.subscribeToChannelFollowEvents(configs.twitch_user_id, (e) => {
    //   console.log(e.userName);
    // });

    // twitch event trigger add-redemption -f {from_id} -t {to_id} -F http://localhost:3000/twitch/event/channel.channel_points_custom_reward_redemption.add.{to_id} -s channel.channel_points_custom_reward_redemption.add.{to_id}.{secret} -i 10ec7ca9-763b-4cb6-948d-55c88f23f063
    middleware.subscribeToChannelRedemptionAddEvents(
      configs.twitch_user_id,
      async (e) => {
        const resident: ResidentType = {
          user_id: e.userId,
          user_name: e.userName,
          user_display_name: e.userDisplayName,
        };

        switch (e.rewardId) {
          case "10ec7ca9-763b-4cb6-948d-55c88f23f063":
            await model.upsertResident(resident);
            const result = await model.upsertBuilding(resident);

            io.sockets.emit("building_updated", result);
            break;
        }
      }
    );
}