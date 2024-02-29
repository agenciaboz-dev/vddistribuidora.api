import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/index";
import { Socket } from "socket.io";
import { WithoutFunctions } from "./methodizer";
import { Address, AddressForm } from "./Address";

import { person as include } from "../prisma/include";
// import { handlePrismaError, user_errors } from "../prisma/errors"
// import { saveImage } from "../tools/saveImage"
// import { Log } from "./Log"
// import { ImageUpload, WithoutFunctions } from "./methodizer"

export type PersonPrisma = Prisma.PersonGetPayload<{ include: typeof include }>;

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
    const person_prisma = await prisma.person.findUnique({
      where: { id: this.id },
      include,
    });
    if (person_prisma) {
      this.load(person_prisma);
    } else {
      throw "cadastro não encontrado";
    }
  }

  static async register(socket: Socket, data: PersonForm) {
    try {
      const registerDate = new Date().getTime().toString();
      const { type } = data;

      const person_prisma = await prisma.person.create({
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
      if (type === "physical") {
        await prisma.physicalPerson.create({
          data: {
            name: data.name,
            nickname: data.nickname,
            cpf: data.cpf,
            rg: data.rg,
            gender: data.gender,
            birthCity: data.birthCity,
            birthDate: data.birthDate,
            personId: person_prisma.id,
          },
        });
      } else if (type === "judiciary") {
        await prisma.judiciaryPerson.create({
          data: {
            socialReason: data.socialReason,
            fantasyName: data.fantasyName,
            headquarters: data.headquarters,
            foundingDate: data.foundingDate,
            personId: person_prisma.id,
          },
        });
      }

      const updatedPerson = await prisma.person.findUnique({
        where: { id: person_prisma.id },
        include: include,
      });

      const user = new Person(person_prisma.id);
      socket.emit("person:registry:success", updatedPerson);
    } catch (error) {
      socket.emit("person:registry:failure", error);
      console.log(error);
    }
  }

  static async list(socket: Socket) {
    try {
      const persons = await prisma.person.findMany({
        include,
      });
      socket.emit("person:list:success", persons);
    } catch (error) {
      socket.emit("person:list:failure", error);
      console.log(error);
    }
  }

  static async find(socket: Socket, id: number) {
    const person = await prisma.person.findUnique({
      where: { id },
      include,
    });
    if (person) {
      socket.emit("person:find:success", person);
    } else {
      throw "cadastro não encontrado";
    }
  }

  load(data: PersonPrisma) {
    this.id = data.id;
    this.registerDate = data.registerDate;
  }
}

export type PersonForm = Omit<WithoutFunctions<Person>, "address" | "id"> & {
  type: "physical" | "judiciary";
  addresses?: AddressForm[];
  id?: number;
  // Fields specific to PhysicalPerson
  name: string;
  nickname: string;
  cpf: string;
  rg: string;
  gender: string;
  birthCity: string;
  birthDate: string;
  // Fields specific to JudiciaryPerson
  socialReason: string;
  fantasyName: string;
  headquarters: string;
  foundingDate: string;
};
