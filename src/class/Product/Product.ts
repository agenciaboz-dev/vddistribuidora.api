import { Prisma, PrismaClient } from "@prisma/client";
import { product as include } from "../../prisma/include";
import { Socket } from "socket.io";
import { ProductReceipt, ReceiptForm } from "./Receipt";
import { ProductStockForm, ProductStock } from "../Stock/StockProduct";
import { WithoutFunctions } from "../helpers";

const prisma = new PrismaClient();

export type ProductPrisma = Prisma.ProductGetPayload<{
  include: typeof include;
}>;

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
  number: string | null;
  productCode: string | null;
  receiptDescription: string | null;
  cfop: string | null;
  ncm: string | null;
  commercialUnit: string | null;
  tributaryUnit: string | null;
  commercialQuantity: string | null;
  tributaryQuantity: string | null;
  commercialUnitValue: string | null;
  tributaryUnitValue: string | null;
  grossValue: string | null;
  icmsOrigin: string | null;
  additionalInfo: string | null;

  productStock?: ProductStock[];

  constructor(data: ProductPrisma) {
    this.load(data);
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
          productStock: {
            create: data.productStock || [],
          },
        },
        include: include,
      });

      const product = new Product(productPrisma);
      product.load(productPrisma);
      socket.emit("product:creation:success", product);
    } catch (error) {
      socket.emit("product:creation:failure", error);
      console.error(error);
      throw error;
    }
  }

  //   static async update(socket: Socket, data: ProductForm) {
  //     try {
  //       const { productStockId, ...rest } = data;
  //       const productPrisma = await prisma.product.update({
  //         where: { id },
  //         data: {
  //           ...rest,
  //           productStock: {
  //             update: data.productStock || [],
  //           },
  //         },
  //         include: include,
  //       });
  //       const product = new Product(productPrisma);
  //       product.load(productPrisma);
  //       socket.emit("product:update:success", product);
  //     } catch (error) {
  //       socket.emit("product:update:failure", error);
  //       console.error(error);
  //     }
  //   }

  static async delete(socket: Socket, id: number) {
    try {
      const deleted = await prisma.product.delete({
        where: { id },
        include: include,
      });
      console.log(deleted);
      socket.emit("product:deletion:success", deleted);
      socket.broadcast.emit("product:deleted", deleted);
    } catch (error) {
      socket.emit("product:deletion:error", error);
      console.error(error);
      throw error;
    }
  }

  static async find(socket: Socket, id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: include,
    });
    if (!product) {
      const error = new Error(`Product with ID ${id} not found.`);
      socket.emit("product:find:failure", error.message);
      console.error(error);
    } else {
      console.log(product);
      socket.emit("product:find:successful", product);
    }
  }

  static async list(socket: Socket) {
    const data = await prisma.product.findMany({ include });
    console.log(data);
    const list = data.map((item) => new Product(item).load(item));
    console.log(list);
    socket.emit("product:list:successful", list);
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
    this.number = data.number;
    this.productCode = data.productCode;
    this.receiptDescription = data.receiptDescription;
    this.cfop = data.cfop;
    this.ncm = data.ncm;
    this.commercialUnit = data.commercialUnit;
    this.tributaryUnit = data.tributaryUnit;
    this.commercialQuantity = data.commercialQuantity;
    this.tributaryQuantity = data.tributaryQuantity;
    this.commercialUnitValue = data.commercialUnitValue;
    this.tributaryUnitValue = data.tributaryUnitValue;
    this.grossValue = data.grossValue;
    this.icmsOrigin = data.icmsOrigin;
    this.additionalInfo = data.additionalInfo;

    return this;
  }
}

export type ProductForm = Omit<
  WithoutFunctions<Product>,
  "productStock" | "receipt" | "id"
> & {
  receipt?: ReceiptForm[];
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
  number: string;
  productCode: string;
  receiptDescription: string;
  cfop: string;
  ncm: string;
  commercialUnit: string;
  tributaryUnit: string;
  commercialQuantity: string;
  tributaryQuantity: string;
  commercialUnitValue: string;
  tributaryUnitValue: string;
  grossValue: string;
  icmsOrigin: string;
  additionalInfo: string;
};
