import { Server as SocketIoServer } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Socket } from "socket.io";
import { User } from "../../src/class/User";
import { Person } from "../../src/class/Person";
import { PersonForm } from "../class/Person";
import { LoginForm } from "../types/shared/user/login";
import { SignupForm } from "../types/shared/user/signup";

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
  socket.on("user:signup", (data: SignupForm) => User.signup(socket, data));

  socket.on("person:register", (data: PersonForm) =>
    Person.register(socket, data)
  );
  socket.on("person:list", () => Person.list(socket));
  socket.on("person:find", (id: number) => Person.find(socket, id));
};

export default { initializeIoServer, getIoInstance, handleSocket };
