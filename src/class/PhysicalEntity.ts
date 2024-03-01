import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/index";
import { Person, EntityPrisma } from "./Entity";
import { Socket } from "socket.io";
// import { entity as include } from "../prisma/include";
import { WithoutFunctions } from "./helpers";

export type PhysicalEntityPrisma = Prisma.PhysicalEntityGetPayload<{}>;

export class PhysicalEntity extends Person {
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

  static async register(socket: Socket, data: PhysicalEntityForm) {
    try {
      const entity_prisma = await prisma.physicalEntity.create({
        data: {
          name: data.name,
          nickname: data.nickname,
          cpf: data.cpf,
          rg: data.rg,
          gender: data.gender,
          birthCity: data.birthCity,
          birthDate: data.birthDate,
          entity: {
            connect: {
              id: data.id,
            },
          },
        },
      });

      socket.emit("entity:registry:success", entity_prisma);
    } catch (error) {
      socket.emit("entity:registry:failure", error);
      console.log(error);
    }
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

  //   update(data: Partial<Entity> & Partial<PhysicalEntity>) {
  //     super.update(data);
  //   }
}

export type PhysicalEntityForm = Omit<WithoutFunctions<Person>, "id"> & {
  id?: number;

  name: string;
  nickname: string;
  cpf: string;
  rg: string;
  gender: string;
  birthCity: string;
  birthDate: string;
};
