import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/index";
import { Entity, EntityPrisma } from "./Entity";
import { Socket } from "socket.io";
// import { entity as include } from "../prisma/include";
import { WithoutFunctions } from "../helpers";
import { entity } from "../../prisma/include";

export type PhysicalEntityPrisma = Prisma.PhysicalEntityGetPayload<{}>;

export class PhysicalEntity extends Entity {
  name: string;
  nickname: string;
  cpf: string;
  rg: string;
  gender: string;
  birthCity: string;
  birthDate: string;

  constructor(id: number) {
    super(id);
  }

  load(data: EntityPrisma & PhysicalEntityPrisma) {
    super.load(data);

    this.name = data.name;
    this.nickname = data.nickname;
    this.cpf = data.cpf;
    this.rg = data.rg;
    this.gender = data.gender;
    this.birthCity = data.birthCity;
    this.birthDate = data.birthDate;
  }

  async register(data: PhysicalEntityForm) {
    const entity_prisma = await prisma.entity.update({
      where: { id: this.id },
      data: {
        physicalEntity: {
          create: {
            name: data.name,
            nickname: data.nickname,
            cpf: data.cpf,
            rg: data.rg,
            gender: data.gender,
            birthCity: data.birthCity,
            birthDate: data.birthDate,
          },
        },
      },
      include: entity,
    });

    this.load({ ...entity_prisma, ...entity_prisma.physicalEntity! });
    // Esse return eu coloquei aqui, mas foge do OOP, falar com Fernando depois
    return entity_prisma;
  }
}

export type PhysicalEntityForm = Omit<WithoutFunctions<Entity>, "id"> & {
  id?: number;

  name: string;
  nickname: string;
  cpf: string;
  rg: string;
  gender: string;
  birthCity: string;
  birthDate: string;
};
