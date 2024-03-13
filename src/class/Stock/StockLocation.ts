import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/index";
import { Socket } from "socket.io";
import { WithoutFunctions } from "../helpers";
import { ProductStockForm, ProductStock } from "./StockProduct";

export type StockLocationPrisma = Prisma.StockLocationGetPayload<{}>;

export class StockLocation {
  id: number;
  name: string;
  cep: string;
  street: string;
  state: string;
  city: string;
  district: string;

  productStock?: ProductStock[];

  constructor(id: number) {
    this.id = id;
  }

  async init() {
    const locationPrisma = await prisma.stockLocation.findUnique({
      where: { id: this.id },
    });
    if (locationPrisma) {
      this.load(locationPrisma);
    } else {
      throw "cadastro não encontrado";
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
export type StockLocationForm = Omit<  WithoutFunctions<StockLocation>,  "productStock" | "id"> & {
  productStock?: ProductStockForm[];

  id?: number;

  //   name: string;
  //   description: string;
  //   image: string;
  //   drawingModel: string;
  //   unit: string;
  //   features: string;
  //   brand: string;
  //   category: string;
  //   subcategory: string;
  //   unitMeasure: string;
  //   sku: string;
  //   validity: string;
  //   liqWeight: string;
  //   grossWeight: string;
  //   mass: string;
  //   volume: string;
};
