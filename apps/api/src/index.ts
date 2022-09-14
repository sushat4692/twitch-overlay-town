import dotenv from "dotenv";
dotenv.config();

import { useSocket } from "./socket";
import { prepareMiddleware, useTwitchPubSub } from "./twitch";
import { configs } from "./lib/config";
import { useServer } from "./server";

const main = async () => {
  const middleware = await prepareMiddleware();
  const { app, server, prepareRequestWithSocket } = await useServer();

  await middleware.apply(app);
  const io = useSocket(app, server);
  prepareRequestWithSocket(io);

  server.listen(configs.port, async () => {
    useTwitchPubSub(middleware, io);

    console.log(`Example app listening on port ${configs.port}`);
  });
};
main();
