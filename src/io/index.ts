import { Server as SocketIoServer } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Socket } from "socket.io";
import { User, UserForm } from "../../src/class/User";
import { Entity, EntityForm } from "../class/Entity";
import { Packaging, PackagingForm } from "../class/Packaging";
import { LoginForm } from "../types/shared/user/login";
import { PhysicalEntity, PhysicalEntityForm } from "../class/PhysicalEntity";
import { JudiciaryEntity, JudiciaryEntityForm } from "../class/JudiciaryEntity";
import entity_controller from "../Controllers/entity";

let io: SocketIoServer | null = null;

export const initializeIoServer = (server: HttpServer | HttpsServer) => {
  io = new SocketIoServer(server, {
    cors: { origin: "*" },
    maxHttpBufferSize: 1e8,
  });
  return io;
};

export const getIoInstance = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized. Please call initializeIoServer first."
    );
  }
  return io;
};

export const handleSocket = (socket: Socket) => {
  console.log(`new connection: ${socket.id}`);

  socket.on("disconnect", async (reason) => {
    console.log(`disconnected: ${socket.id}`);
  });

  socket.on("user:login", (data: LoginForm) => User.login(socket, data));
  socket.on("user:signup", (data: UserForm) => User.signup(socket, data));
  socket.on("user:list", () => User.list(socket));
  socket.on("user:find", (id: number) => User.find(socket, id));

  // prettier-ignore
  socket.on("entity:register",(data: EntityForm & {physical_data?: PhysicalEntityForm; judiciary_data?: JudiciaryEntityForm; }) => entity_controller.register(socket, data));
  socket.on("entity:list", () => Entity.list(socket));
  socket.on("entity:find", (id: number) => Entity.find(socket, id));
  socket.on("entity:delete", (id: number) => Entity.delete(socket, id));
  socket.on("entity:update", (data) => {
    Entity.update(data, socket);
  });
  socket.on("packaging:create", (data) => Packaging.register(socket, data));
  socket.on("packaging:delete", (id: number) => Packaging.delete(socket, id));
  socket.on("packaging:find", (id: number) => Packaging.find(socket, id));
  socket.on("packaging:list", () => Packaging.list(socket));
  socket.on("packaging:update", (data) => Packaging.update(socket, data));
};

export default { initializeIoServer, getIoInstance, handleSocket };
