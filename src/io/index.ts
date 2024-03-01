import { Server as SocketIoServer } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Socket } from "socket.io";
import { User, UserForm } from "../../src/class/User";
import { Person } from "../class/Entity";
import { EntityForm } from "../class/Entity";
import { LoginForm } from "../types/shared/user/login";

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

  socket.on("entity:register", (data: EntityForm) =>
    Person.register(socket, data)
  );
  socket.on("entity:list", () => Person.list(socket));
  socket.on("entity:find", (id: number) => Person.find(socket, id));

  // socket.on("entity:update", (data) => Entity.update(data));
};

export default { initializeIoServer, getIoInstance, handleSocket };
