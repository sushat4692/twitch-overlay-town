import express from "express";
import http from "http";
import cors from "cors";
import { ClientCredentialsAuthProvider } from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import { EventSubMiddleware } from "@twurple/eventsub";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { RedisModel, ResidentType } from "./models";

dotenv.config();

const port = process.env.PORT || 3000;
const clientId = process.env.TWITCH_CLIENT_ID || "";
const clientSecret = process.env.TWITCH_CLIENT_SECRET || "";

const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret, [
  "channel:read:redemptions",
]);
const apiClient = new ApiClient({ authProvider });
const secret = process.env.TWITCH_PUBSUB_SECRET || "";

const main = async () => {
  const model = new RedisModel({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || '6379'),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
  });

  await apiClient.eventSub.deleteAllSubscriptions();
  const middleware = new EventSubMiddleware({
    apiClient,
    hostName: `localhost`,
    pathPrefix: "/twitch",
    secret,
    strictHostCheck: false,
  });

  const app = express();
  app.use(cors());

  await middleware.apply(app);

  const server = http.createServer(app);
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("list", async () => {
      console.log("list");
      socket.emit("list", await model.getAll());
    });
  });

  server.listen(port, async () => {
    await middleware.markAsReady();

    // twitch event trigger follow -f {from_id} -t {to_id} -F http://localhost:3000/twitch/event/channel.follow.{to_id} -s channel.follow.{to_id}.{secret}
    // await middleware.subscribeToChannelFollowEvents(process.env.TWITCH_USER_ID || '', (e) => {
    //   console.log(e.userName);
    // });

    // twitch event trigger add-redemption -f {from_id} -t {to_id} -F http://localhost:3000/twitch/event/channel.channel_points_custom_reward_redemption.add.{to_id} -s channel.channel_points_custom_reward_redemption.add.{to_id}.{secret} -i 10ec7ca9-763b-4cb6-948d-55c88f23f063
    middleware.subscribeToChannelRedemptionAddEvents(process.env.TWITCH_USER_ID || '', async (e) => {
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
    });

    console.log(`Example app listening on port ${port}`);
  });
};
main();
