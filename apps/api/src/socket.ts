import { Express } from "express";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { model } from "./models";

export const useSocket = (app: Express, server: HttpServer) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    socket.on("list", async () => {
      socket.emit("list", await model.getAll());
    });
  });

  return io;
};
