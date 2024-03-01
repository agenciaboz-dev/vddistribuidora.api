import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/index";
import { Socket } from "socket.io";
import { Address, AddressForm } from "./Address";

import { entity as include } from "../prisma/include";
import { WithoutFunctions } from "./helpers";
import { PhysicalEntity } from "./PhysicalEntity";
import { JudiciaryEntity } from "./JudiciaryEntity";

// import { handlePrismaError, user_errors } from "../prisma/errors"
// import { saveImage } from "../tools/saveImage"
// import { Log } from "./Log"
// import { ImageUpload, WithoutFunctions } from "./methodizer"

export type EntityPrisma = Prisma.EntityGetPayload<{ include: typeof include }>;

export class Person {
  id: number;
  registerDate: string;

  // Optional Data
  image?: string;
  state?: string;
  classification?: string;
  creditLimit?: number;
  commission?: number;
  antt?: string;
  category?: string;
  accountingCategory?: string;
  municipalInscription?: string;
  range?: string;
  suframaInscription?: string;
  route?: string;
  // Optional Boolean Flags
  finalConsumer?: boolean;
  client?: boolean;
  transportCompany?: boolean;
  supplier?: boolean;
  employee?: boolean;
  salesman?: boolean;
  icmsExemption?: boolean;
  icmsContributor?: boolean;
  simpleFederalOptant?: boolean;
  nfeb2b?: boolean;

  address?: Address;

  constructor(id: number) {
    this.id = id;
  }

  async init() {
    const entity_prisma = await prisma.entity.findUnique({
      where: { id: this.id },
      include,
    });
    if (entity_prisma) {
      this.load(entity_prisma);
    } else {
      throw "cadastro não encontrado";
    }
  }

  //   static async update(data: never) {
  //     const user = data.physicalEntity
  //       ? new PessoaFisica()
  //       : new PessoaJuridica();

  //     user.update(data);
  //   }

  static async register(socket: Socket, data: EntityForm) {
    try {
      const registerDate = new Date().getTime().toString();

      const entity_prisma = await prisma.entity.create({
        data: {
          image: data.image,
          state: data.state,
          classification: data.classification,
          creditLimit: data.creditLimit,
          commission: data.commission,
          antt: data.antt,
          category: data.category,
          accountingCategory: data.accountingCategory,
          municipalInscription: data.municipalInscription,
          range: data.range,
          suframaInscription: data.suframaInscription,
          route: data.route,
          finalConsumer: data.finalConsumer,
          client: data.client,
          transportCompany: data.transportCompany,
          supplier: data.supplier,
          employee: data.employee,
          salesman: data.salesman,
          icmsExemption: data.icmsExemption,
          icmsContributor: data.icmsContributor,
          simpleFederalOptant: data.simpleFederalOptant,
          nfeb2b: data.nfeb2b,
          registerDate,
          addresses: data.addresses
            ? {
                create: data.addresses.map((address) => ({
                  cep: address.cep,
                  city: address.city,
                  district: address.district,
                  number: address.number,
                  street: address.street,
                  uf: address.uf,
                })),
              }
            : undefined,
        },
        include,
      });

      const user = data.physical_entity
        ? new PhysicalEntity(entity_prisma.id)
        : new JudiciaryEntity(entity_prisma.id);

      socket.emit("entity:registry:success");
    } catch (error) {
      socket.emit("entity:registry:failure", error);
      console.log(error);
    }
  }

  //   static async update(socket: Socket, data: PersonForm) {
  //     try {
  //       const { id, type } = data;
  //       const person = await prisma.person.findUnique({
  //         where: { id },
  //         include,
  //       });
  //       if (person) {
  //         const updatedPerson = await prisma.person.update({
  //           where: { id },
  //           data: {
  //             image: data.image,
  //             state: data.state,
  //             classification: data.classification,
  //             creditLimit: data.creditLimit,
  //             commission: data.commission,
  //             antt: data.antt,
  //             category: data.category,
  //             accountingCategory: data.accountingCategory,
  //             municipalInscription: data.municipalInscription,
  //             range: data.range,
  //             suframaInscription: data.suframaInscription,
  //             route: data.route,
  //             finalConsumer: data.finalConsumer,
  //             client: data.client,
  //             transportCompany: data.transportCompany,
  //             supplier: data.supplier,
  //             employee: data.employee,
  //             salesman: data.salesman,
  //             icmsExemption: data.icmsExemption,
  //             icmsContributor: data.icmsContributor,
  //             simpleFederalOptant: data.simpleFederalOptant,
  //             nfeb2b: data.nfeb2b,
  //             addresses: data.addresses
  //               ? {
  //                   connect: data.addresses.map((address) => ({
  //                     id: address.id,
  //                   })),
  //                 }
  //               : undefined,
  //           },
  //           include,
  //         });
  //         if (type === "physical") {
  //           await prisma.physicalPerson.update({
  //             where: { personId: id },
  //             data: {
  //               name: data.name,
  //               nickname: data.nickname,
  //               cpf: data.cpf,
  //               rg: data.rg,
  //               gender: data.gender,
  //               birthCity: data.birthCity,
  //               birthDate: data.birthDate,
  //             },
  //           });
  //         } else if (type === "judiciary") {
  //           await prisma.judiciaryPerson.update({
  //             where: { personId: id },
  //             data: {
  //               socialReason: data.socialReason,
  //               fantasyName: data.fantasyName,
  //               headquarters: data.headquarters,
  //               foundingDate: data.foundingDate,
  //             },
  //           });
  //         }
  //         socket.emit("person:update:success", updatedPerson);
  //       }
  //     } catch (error) {
  //       socket.emit("person:update:failure", error);
  //       console.log(error);
  //     }
  //   }

  static async list(socket: Socket) {
    try {
      const entities = await prisma.entity.findMany({
        include,
      });
      socket.emit("entity:list:success", entities);
    } catch (error) {
      socket.emit("entity:list:failure", error);
      console.log(error);
    }
  }

  static async find(socket: Socket, id: number) {
    try {
      const entity = await prisma.entity.findUnique({
        where: { id },
        include,
      });
      if (entity) {
        socket.emit("entity:find:success", entity);
      } else {
        throw "cadastro não encontrado";
      }
    } catch (error) {
      socket.emit("entity:find:failure", error);
      console.log(error);
    }
  }

  load(data: EntityPrisma) {
    this.id = data.id;
    this.registerDate = data.registerDate;
  }

  update(data: Partial<Person>) {
    console.log("pai");
  }
}

export type EntityForm = Omit<WithoutFunctions<Person>, "address" | "id"> & {
  addresses?: AddressForm[];
  id?: number;
  // Fields specific to PhysicalEntity
  name: string;
  nickname: string;
  cpf: string;
  rg: string;
  gender: string;
  birthCity: string;
  birthDate: string;
  // Fields specific to JudiciaryEntity
  socialReason: string;
  fantasyName: string;
  headquarters: string;
  foundingDate: string;

  physical_entity: boolean;
};
