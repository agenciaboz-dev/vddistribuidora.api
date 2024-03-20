import { Server as SocketIoServer } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Socket } from "socket.io";

import { LoginForm } from "../types/shared/user/login";

import { User, UserForm } from "../../src/class/User";

import { Packaging, PackagingForm } from "../class/Packaging";
import { Product, ProductForm } from "../class/Product/Product";
import { StockLocation, StockLocationForm } from "../class/Stock/StockLocation";
import { ProductStock, ProductStockForm } from "../class/Stock/StockProduct";

import { Entity, EntityForm } from "../class/Entity/Entity";
import {
  PhysicalEntity,
  PhysicalEntityForm,
} from "../class/Entity/PhysicalEntity";
import {
  JudiciaryEntity,
  JudiciaryEntityForm,
} from "../class/Entity/JudiciaryEntity";
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
  // USER OPRTATIONS
  socket.on("user:login", (data: LoginForm) => User.login(socket, data));
  socket.on("user:signup", (data: UserForm) => User.signup(socket, data));
  socket.on("user:list", () => User.list(socket));
  socket.on("user:find", (id: number) => User.find(socket, id));
  // ENTITY OPRTATIONS
  // prettier-ignore
  socket.on("entity:register",(data: EntityForm & {physical_data?: PhysicalEntityForm; judiciary_data?: JudiciaryEntityForm; }) => entity_controller.register(socket, data));
  socket.on("entity:list", () => Entity.list(socket));
  socket.on("entity:find", (id: number) => Entity.find(socket, id));
  socket.on("entity:delete", (id: number) => Entity.delete(socket, id));
  socket.on("entity:update", (data) => {
    Entity.update(data, socket);
  });
  // PACKAGING OPRTATIONS
  socket.on("packaging:create", (data: PackagingForm) =>
    Packaging.register(socket, data)
  );
  socket.on("packaging:delete", (id: number) => Packaging.delete(socket, id));
  socket.on("packaging:find", (id: number) => Packaging.find(socket, id));
  socket.on("packaging:list", () => Packaging.list(socket));
  socket.on("packaging:update", (data) => Packaging.update(socket, data));
  // PRODUCT OPERTATIONS
  socket.on("product:create", (data: ProductForm) =>
    Product.create(socket, data)
  );
  socket.on("product:delete", (id: number) => Product.delete(socket, id));

  socket.on("product:find", (id: number) => Product.find(socket, id));
  socket.on("product:list", () => Product.list(socket));

  // STOCKLOCATION OPRTATIONS
  socket.on("stockLocation:create", (data: StockLocationForm) => {
    StockLocation.create(socket, data);
  });

  socket.on("stockLocation:find", (id: number) => {
    StockLocation.find(socket, id);
  });

  socket.on("stockLocation:list", () => StockLocation.list(socket));

  socket.on("stockLocation:delete", (id: number) => {
    StockLocation.delete(socket, id);
  });

  // PRODUCTSTOCK OPRTATIONS
  socket.on("productStock:create", (data: ProductStockForm) => {
    ProductStock.create(socket, data);
  });

  socket.on("productStock:find", (id: number) => {
    ProductStock.find(socket, id);
  });
  socket.on("productStock:list", () => ProductStock.list(socket));

  socket.on("productStock:delete", (id: number) => {
    ProductStock.delete(socket, id);
  });
};

export default { initializeIoServer, getIoInstance, handleSocket };
