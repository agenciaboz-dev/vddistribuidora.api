import { Prisma } from "@prisma/client";

export const entity = Prisma.validator<Prisma.EntityInclude>()({
  addresses: true,
  judiciaryEntity: true,
  physicalEntity: true,
});

export const product = Prisma.validator<Prisma.ProductInclude>()({
    receipt: true,
    productStock: { include: { stockLocation: true } },
})

export const productStock = Prisma.validator<Prisma.ProductStockInclude>()({
  stockLocation: true,
});

// export const packaging = Prisma.validator<Prisma.PackagingInclude>()({});
