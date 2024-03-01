import { Prisma } from "@prisma/client";
import { Person, EntityPrisma } from "./Entity";

export type JudiciaryEntityPrisma = Prisma.JudiciaryEntityGetPayload<{}>;

export class JudiciaryEntity extends Person {
  socialReason: string;
  fantasyName: string;
  headquarters: string;
  foundingDate: string;

  constructor(id: number) {
    super(id);
  }

  load(data: EntityPrisma & JudiciaryEntityPrisma) {
    super.load(data);

    this.socialReason = data.socialReason;
    this.fantasyName = data.fantasyName;
    this.headquarters = data.headquarters;
    this.foundingDate = data.foundingDate;
  }

  //   update(data: Partial<Entity> & Partial<JudiciaryEntity>) {
  //     super.update(data);

  //     if (data.socialReason) {
  //       this.socialReason = data.socialReason;
  //     }
  //   }
}
