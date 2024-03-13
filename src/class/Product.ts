import { Prisma, PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";
import { ProductReceipt } from "./Receipt";
import { ReceiptForm } from "./Receipt";
// import { ProductStockForm } from "./Stock";
import { WithoutFunctions } from "./helpers";

const prisma = new PrismaClient();

export type ProductPrisma = Prisma.ProductGetPayload<{}>;
export type ProductReceiptPrisma = Prisma.ProductReceiptGetPayload<{}>;

export class Product {
  id?: number; // Made optional to handle before creation
  name: string;
  description: string;
  image: string;
  drawingModel: string;
  unit: string;
  features: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  unitMeasure?: string;
  sku?: string;
  validity?: string;
  liqWeight?: string;
  grossWeight?: string;
  mass?: string;
  volume?: string;

  receipt?: ProductReceipt[]; // Made optional to handle cases where it's not yet set

  constructor(id: number) {
    this.id = id;
  }

  async init() {
    if (!this.id) throw new Error("Product ID is not set.");
    const productPrisma = await prisma.product.findUnique({
      where: { id: this.id },
    });
    if (productPrisma) {
      this.load(productPrisma);
    } else {
      throw new Error("Product not found.");
    }
  }

  static async create(socket: Socket, data: ProductForm) {
    try {
      const productPrisma = await prisma.product.create({
        data: {
          ...data,
          receipt: {
            create: data.receipt,
          },
          //   productStock: {
          //     create: data.productStock,
          //   },
        },
        include: { receipt: true },
      });

      const product = new Product(productPrisma.id);
      product.load(productPrisma);
      socket.emit("product:creation:success", product);
    } catch (error) {
      socket.emit("product:creation:failure", error);
      console.error(error);
      throw error;
    }
  }

  load(data: ProductPrisma) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.image = data.image;
    this.drawingModel = data.drawingModel;
    this.unit = data.unit;
    this.features = data.features;
    this.brand = data.brand || undefined;
    this.category = data.category || undefined;
    this.subcategory = data.subcategory || undefined;
    this.unitMeasure = data.unitMeasure || undefined;
    this.sku = data.sku || undefined;
    this.validity = data.validity || undefined;
    this.liqWeight = data.liqWeight || undefined;
    this.grossWeight = data.grossWeight || undefined;
    this.mass = data.mass || undefined;
    this.volume = data.volume || undefined;
  }
}

export type ProductForm = Omit<WithoutFunctions<Product>, "receipt" | "id"> & {
  receipt?: ReceiptForm[];
  //   productStock?: ProductStockForm[];

  id?: number;

  name: string;
  description: string;
  image: string;
  drawingModel: string;
  unit: string;
  features: string;
  brand: string;
  category: string;
  subcategory: string;
  unitMeasure: string;
  sku: string;
  validity: string;
  liqWeight: string;
  grossWeight: string;
  mass: string;
  volume: string;
};
