import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/index";
import { Entity, EntityPrisma } from "./Entity";
import { Socket } from "socket.io";
// import { entity as include } from "../prisma/include";
import { WithoutFunctions } from "./helpers";
import { entity } from "../prisma/include";

export type JudiciaryEntityPrisma = Prisma.JudiciaryEntityGetPayload<{}>;

export class JudiciaryEntity extends Entity {
  socialReason: string;
  fantasyName: string;
  cnpj: string;
  headquarters: string;
  foundingDate: string;

  constructor(id: number) {
    super(id);
  }

  load(data: EntityPrisma & JudiciaryEntityPrisma) {
    super.load(data);

    this.socialReason = data.socialReason;
    this.fantasyName = data.fantasyName;
    this.cnpj = data.cnpj;
    this.headquarters = data.headquarters;
    this.foundingDate = data.foundingDate;
  }

  async register(data: JudiciaryEntityForm) {
    const entity_prisma = await prisma.entity.update({
      where: { id: this.id },
      data: {
        judiciaryEntity: {
          create: {
            cnpj: data.cnpj,
            socialReason: data.socialReason,
            fantasyName: data.fantasyName,
            headquarters: data.headquarters,
            foundingDate: data.foundingDate,
          },
        },
      },
      include: entity,
    });

    this.load({ ...entity_prisma, ...entity_prisma.judiciaryEntity! });
    // Esse return eu coloquei aqui, mas foge do OOP, falar com Fernando depois
    return entity_prisma;
  }
}

export type JudiciaryEntityForm = Omit<WithoutFunctions<Entity>, "id"> & {
  id?: number;

  socialReason: string;
  fantasyName: string;
  cnpj: string;
  headquarters: string;
  foundingDate: string;
};
