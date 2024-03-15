import { Prisma, PrismaClient } from "@prisma/client";
import { product as include } from "../prisma/include";
import { Socket } from "socket.io";
import { ProductReceipt, ReceiptForm } from "./Receipt";
import { ProductStockForm, ProductStock } from "./Stock/StockProduct";
import { WithoutFunctions } from "./helpers";

const prisma = new PrismaClient();

export type ProductPrisma = Prisma.ProductGetPayload<{
  include: typeof include;
}>;
export type ProductReceiptPrisma = Prisma.ProductReceiptGetPayload<{}>;

export class Product {
  id?: number; // Made optional to handle before creation
  name: string;
  description: string;
  image: string;
  drawingModel: string;
  unit: string;
  features: string;
  brand: string | null;
  category: string | null;
  subcategory: string | null;
  unitMeasure: string | null;
  sku: string | null;
  validity: string | null;
  liqWeight: string | null;
  grossWeight: string | null;
  mass: string | null;
  volume: string | null;

  receipt?: ProductReceipt[];
  productStock?: ProductStock[];

  constructor(id: number) {
    this.id = id;
  }

  async init() {
    if (!this.id) throw new Error("Product ID is not set.");
    const productPrisma = await prisma.product.findUnique({
      where: { id: this.id },
      include,
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
            create: data.receipt || [],
          },
          productStock: {
            create: data.productStock || [],
          },
        },
        include: include,
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

  static async delete(socket: Socket, id: number, productId: number) {
    try {
      const deleted = prisma.product.delete({
        where: { id },
        include: include,
      });
      socket.emit("product:deletion:success", deleted);
      socket.broadcast.emit("product:deleted", deleted);
      const product = new Product(productId);
      product.load(await deleted);
    } catch (error) {
      socket.emit("product:deletion:error", error);
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
    this.brand = data.brand;
    this.category = data.category;
    this.subcategory = data.subcategory;
    this.unitMeasure = data.unitMeasure;
    this.sku = data.sku;
    this.validity = data.validity;
    this.liqWeight = data.liqWeight;
    this.grossWeight = data.grossWeight;
    this.mass = data.mass;
    this.volume = data.volume;
  }
}

export type ProductForm = Omit<
  WithoutFunctions<Product>,
  "productStock" | "receipt" | "id"
> & {
  receipt?: ReceiptForm;
  productStock?: ProductStockForm[];

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
