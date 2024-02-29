import { Prisma } from "@prisma/client";

export const person = Prisma.validator<Prisma.PersonInclude>()({
  addresses: true,
  judiciaryPerson: true,
  physicalPerson: true,
});
