import { Prisma } from "@prisma/client";

export const entity = Prisma.validator<Prisma.EntityInclude>()({
  addresses: true,
  judiciaryEntity: true,
  physicalEntity: true,
});

// export const packaging = Prisma.validator<Prisma.PackagingInclude>()({});
