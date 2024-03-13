import { Prisma, StockLocation } from "@prisma/client";
import { prisma } from "../../prisma/index";
import { Socket } from "socket.io";
import { WithoutFunctions } from "../helpers";

export type ProductStockPrisma = Prisma.ProductStockGetPayload<{}>;
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

  stockLocation?: StockLocationPrisma | null;

  constructor(id: number) {
    this.id = id;
  }

  async init() {
    const productStockPrisma = await prisma.productStock.findUnique({
      where: { id: this.id },
    });
    if (productStockPrisma) {
      this.load(productStockPrisma);
    } else {
      throw "cadastro não encontrado";
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
};
