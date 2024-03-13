import { Prisma } from "@prisma/client";
import { Socket } from "socket.io";
import { WithoutFunctions } from "./helpers";

export type ProductStockPrisma = Prisma.ProductStockGetPayload<{}>;

export class ProductStock {
  id: number;

  constructor(data: ProductStockPrisma) {
    this.init(data);
  }

  init(data: ProductStockPrisma) {
    this.id = data.id;
  }
}

export type ReceiptForm = Omit<WithoutFunctions<ProductStock>, "id">;
