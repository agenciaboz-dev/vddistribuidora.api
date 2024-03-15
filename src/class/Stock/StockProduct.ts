import { Prisma } from "@prisma/client";
import { productStock as include } from "../../prisma/include";
import { prisma } from "../../prisma/index";
import { Socket } from "socket.io";
import { WithoutFunctions } from "../helpers";
import { StockLocation } from "./StockLocation";

export type ProductStockPrisma = Prisma.ProductStockGetPayload<{
  include: typeof include;
}>;
export type StockLocationPrisma = Prisma.StockLocationGetPayload<{}>;

export class ProductStock {
  id: number;
  units: string;
  weightCcm3: string;
  massGrams: string;
  volumeCm3: string;
  productionToleranceType: string;
  percentageProductTolerance: string;
  stockConfig: string;
  minQuantity: string;
  baseCostValue: string;
  estimatedCost: string;
  suggestedCost: string;

  constructor(data: ProductStockPrisma) {
    this.load(data);
  }

  async init() {
    const productStockPrisma = await prisma.productStock.findUnique({
      where: { id: this.id },
      include: include,
    });
    if (productStockPrisma) {
      this.load(productStockPrisma);
    } else {
      throw "cadastro não encontrado";
    }
  }

  static async create(socket: Socket, data: ProductStockForm) {
    try {
      const productStockPrisma = await prisma.productStock.create({
        data: {
          units: data.units,
          weightCcm3: data.weightCcm3,
          massGrams: data.massGrams,
          volumeCm3: data.volumeCm3,
          productionToleranceType: data.productionToleranceType,
          percentageProductTolerance: data.percentageProductTolerance,
          stockConfig: data.stockConfig,
          minQuantity: data.minQuantity,
          baseCostValue: data.baseCostValue,
          estimatedCost: data.estimatedCost,
          suggestedCost: data.suggestedCost,

          stockLocation:
            {
              connect: { id: data.stockLocationId },
            } || undefined,

          product:
            {
              connect: { id: data.productId },
            } || undefined,
        },
        include,
      });

      const productStock = new ProductStock(productStockPrisma);
      productStock.load(productStockPrisma);
      socket.emit("productStock:creation:success", productStock);
    } catch (error) {
      socket.emit("productStock:creation:failure", error);
      console.error(error);
      throw error;
    }
  }

  load(data: ProductStockPrisma) {
    this.id = data.id;
    this.units = data.units;
    this.weightCcm3 = data.weightCcm3;
    this.massGrams = data.massGrams;
    this.volumeCm3 = data.volumeCm3;
    this.productionToleranceType = data.productionToleranceType;
    this.percentageProductTolerance = data.percentageProductTolerance;
    this.stockConfig = data.stockConfig;
    this.minQuantity = data.minQuantity;
    this.baseCostValue = data.baseCostValue;
    this.estimatedCost = data.estimatedCost;
    this.suggestedCost = data.suggestedCost;
  }
}

export type ProductStockForm = Omit<WithoutFunctions<ProductStock>, "id"> & {
  id?: number;
  stockLocationId: number;
  productId: number;
};
