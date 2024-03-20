import { Prisma } from "@prisma/client";
import { productStock as include, productStock } from "../../prisma/include";
import { prisma } from "../../prisma/index";
import { Socket } from "socket.io";
import { WithoutFunctions } from "../helpers";
import { StockLocation } from "./StockLocation";
import { Product } from "../Product/Product";

export type ProductStockPrisma = Prisma.ProductStockGetPayload<{
  include: typeof include;
}>;

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

  stockLocation: StockLocation;
  stockLocationId: number;

  product: Product;
  productId: number;

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

          stockLocation: {
            connect: { id: data.stockLocationId },
          },

          product: {
            connect: { id: data.productId },
          },
        },
        include: include,
      });

      const productStock = new ProductStock(productStockPrisma);
      productStock.load(productStockPrisma);
      socket.emit("productStock:creation:success", productStock);
    } catch (error: any) {
      if (error.code === "P2025") {
        socket.emit("productStock:creation:failure", `${error.meta.cause}`);
      } else {
        socket.emit("productStock:creation:failure", error);
      }
      console.error(error);
    }
  }

  static async find(socket: Socket, id: number) {
    try {
      const productStockPrisma = await prisma.productStock.findUnique({
        where: { id },
        include: include,
      });
      console.log(productStockPrisma);
      if (productStockPrisma) {
        const productStock = new ProductStock(productStockPrisma);
        console.log(productStock);
        socket.emit("productStock:find:success", productStock);
      } else {
        socket.emit(
          "productStock:find:failure",
          `ProductStock with ID ${id} not found.`
        );
      }
    } catch (error) {
      console.log(error);
      socket.emit("productStock:find:failure", error);
    }
  }

  static async list(socket: Socket) {
    const productStocksPrisma = await prisma.productStock.findMany({
      include: include,
    });
    const productStocks = productStocksPrisma.map(
      (productStockPrisma) => new ProductStock(productStockPrisma)
    );
    socket.emit("productStock:list:success", productStocks);
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

    this.stockLocation = new StockLocation(data.stockLocation);
    this.product = new Product(data.product);
  }
}

export type ProductStockForm = Omit<WithoutFunctions<ProductStock>, "id"> & {
  id?: number;
  stockLocationId: number;
  productId: number;
};
