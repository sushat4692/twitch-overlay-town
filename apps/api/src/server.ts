import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { model } from "./models";
import { configs } from "./lib/config";

export const useServer = async () => {
  const app = express();
  app.use(cors());
  const server = http.createServer(app);

  app.post("/position", async (req, res) => {
    if (
      req.headers.authorization !== `Bearer ${configs.twitch_pubsub_secret}`
    ) {
      return res.json({ error: true, message: `Not matched secret` });
    }

    await model.resetPosition();
    return res.json({ error: false });
  });

  const prepareRequestWithSocket = (io: Server) => {
    app.post("/shuffle", async (req, res) => {
      if (
        req.headers.authorization !== `Bearer ${configs.twitch_pubsub_secret}`
      ) {
        return res.json({ error: true, message: `Not matched secret` });
      }

      await model.shuffle();
      io.emit("list", await model.getAll());
      return res.json({ error: false });
    });

    app.post("/destroy", async (req, res) => {
      if (
        req.headers.authorization !== `Bearer ${configs.twitch_pubsub_secret}`
      ) {
        return res.json({ error: true, message: `Not matched secret` });
      }

      await model.destroy();
      io.emit("list", await model.getAll());
      return res.json({ error: false });
    });
  };

  return { app, server, prepareRequestWithSocket };
};
