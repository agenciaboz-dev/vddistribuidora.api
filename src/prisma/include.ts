import { Prisma } from "@prisma/client";

export const entity = Prisma.validator<Prisma.EntityInclude>()({
  addresses: true,
  judiciaryEntity: true,
  physicalEntity: true,
});

export const product = Prisma.validator<Prisma.ProductInclude>()({
  receipt: true,
  productStock: { include: { stockLocation: true } },
});

export const stockLocation = Prisma.validator<Prisma.StockLocationInclude>()({
  productStock: { include: { product: true } },
});

export const productStock = Prisma.validator<Prisma.ProductStockInclude>()({
    stockLocation: { include: stockLocation },
    product: { include: product },
})

// export const packaging = Prisma.validator<Prisma.PackagingInclude>()({});
