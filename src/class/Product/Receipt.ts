import { Prisma } from "@prisma/client";
import { Socket } from "socket.io";
import { WithoutFunctions } from "../helpers";

export type ProductReceiptPrisma = Prisma.ProductReceiptGetPayload<{}>;

export class ProductReceipt {
  id: number;
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

  constructor(data: ProductReceiptPrisma) {
    this.init(data);
  }

  init(data: ProductReceiptPrisma) {
    this.id = data.id;
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
  }
}

export type ReceiptForm = Omit<WithoutFunctions<ProductReceipt>, "id">;
