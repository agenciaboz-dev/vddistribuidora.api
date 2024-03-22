import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/index";
import { Socket } from "socket.io";
import { WithoutFunctions } from "../helpers";
import { stockLocation as include } from "../../prisma/include";
import { ProductStockForm, ProductStock } from "./StockProduct";

export type StockLocationPrisma = Prisma.StockLocationGetPayload<{
  include: typeof include;
}>;

export class StockLocation {
  id: number;
  name: string;
  cep: string;
  street: string;
  state: string;
  city: string;
  district: string;

  productStock?: ProductStock[];

  constructor(data: StockLocationPrisma) {
    this.load(data);
  }

  async init() {
    const stockLocationPrisma = await prisma.stockLocation.findUnique({
      where: { id: this.id },
      include: include,
    });
    if (stockLocationPrisma) {
      this.load(stockLocationPrisma);
    } else {
      throw "cadastro não encontrado";
    }
  }

  static async create(socket: Socket, data: StockLocationForm) {
    try {
      const stockLocationPrisma = await prisma.stockLocation.create({
        data: {
          name: data.name,
          cep: data.cep,
          street: data.street,
          state: data.state,
          city: data.city,
          district: data.district,
        },
        include: include,
      });

      const stockLocation = new StockLocation(stockLocationPrisma);
      stockLocation.load(stockLocationPrisma);
      socket.emit("stockLocation:creation:success", stockLocation);
    } catch (error) {
      socket.emit("stockLocation:creation:failure", error);
      console.error(error);
      throw error;
    }
  }

  static async update(socket: Socket, data: StockLocationForm) {
    try {
      const { ...updateData } = data;

      const productLocationPrisma = await prisma.stockLocation.update({
        where: { id: data.id },
        data: {
          ...updateData,
          productStock: {
            connect: data.productStock?.map((productStock) => ({
              id: productStock.id,
            })),
          },
        },
        include: include,
      });
      const stockLocation = new StockLocation(productLocationPrisma);
      stockLocation.load(productLocationPrisma);
      socket.emit("stockLocation:update:success", stockLocation);
    } catch (error) {
      socket.emit("stockLocation:update:failure", error);
      console.error(error);
      throw error;
    }
  }

  static async list(socket: Socket) {
    const stockLocations = await prisma.stockLocation.findMany({
      include: include,
    });
    socket.emit("stockLocation:list:success", stockLocations);
  }

  static async find(socket: Socket, id: number) {
    try {
      const stockLocationPrisma = await prisma.stockLocation.findUnique({
        where: { id },
        include: include,
      });
      if (stockLocationPrisma) {
        const stockLocation = new StockLocation(stockLocationPrisma);
        stockLocation.load(stockLocationPrisma);
        socket.emit("stockLocation:creation:success", stockLocation);
      } else {
        throw `cadastro de ID:${id} não encontrado`;
      }
    } catch (error) {
      socket.emit("stockLocation:find:failure", error);
    }
  }

  static async delete(socket: Socket, id: number) {
    try {
      const stockLocationPrisma = await prisma.stockLocation.delete({
        where: { id },
        include: include,
      });
      socket.emit("stockLocation:deletion:success", stockLocationPrisma);
    } catch (error) {
      socket.emit(
        "stockLocation:find:failure",
        `cadastro de ID:${id} não encontrado`
      );
    }
  }

  load(data: StockLocationPrisma) {
    this.id = data.id;
    this.name = data.name;
    this.cep = data.cep;
    this.street = data.street;
    this.state = data.state;
    this.city = data.city;
    this.district = data.district;
  }
}

// prettier-ignore
export type StockLocationForm = Omit<  WithoutFunctions<StockLocation>, "id"> & {
  productStock?: ProductStockForm[];

  id?: number;
name: string;
cep: string;
street: string;
state: string;
city: string;
district: string;

};
