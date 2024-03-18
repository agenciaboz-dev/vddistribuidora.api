import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/index";
import { Socket } from "socket.io";
import { Address, AddressForm } from "../Address";

import { entity as include } from "../../prisma/include";
import { ImageUpload, WithoutFunctions } from "../helpers";
import entity from "../../Controllers/entity";

import { handlePrismaError, user_errors } from "../../prisma/errors";
import { saveImage } from "../../tools/saveImage";
// import { Log } from "./Log"

export type EntityPrisma = Prisma.EntityGetPayload<{ include: typeof include }>;
export type JudiciaryEntityPrisma = Prisma.JudiciaryEntityGetPayload<{}>;
export type PhysicalEntityPrisma = Prisma.PhysicalEntityGetPayload<{}>;

export class Entity {
  id: number;
  registerDate: string;

  // Optional Data
  image?: string | null | ImageUpload;
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

  judiciaryEntity?: JudiciaryEntityPrisma | null;
  physicalEntity?: PhysicalEntityPrisma | null;

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

  static async update(
    data: Partial<EntityPrisma> & { id: number },
    socket: Socket,
    entity_id?: number
  ) {
    const entity = new Entity(data.id);
    await entity.init();
    await entity.update(data, socket);
  }

  static async register(data: EntityForm) {
    const entity_prisma = await prisma.entity.create({
      data: {
        image: "",
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
        registerDate: new Date().getTime().toString(),
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

    const entity = new Entity(entity_prisma.id);
    entity.load(entity_prisma);
    if (data.image) {
      // @ts-ignore
      if (data.image?.file) {
        // @ts-ignore
        // prettier-ignore
        const url = saveImage(`entities/${this.id}/`, data.image.file as ArrayBuffer, data.image.name);
        await entity.update({ image: url });
      }
    }

    return entity_prisma;
  }

  static async delete(socket: Socket, id: number) {
    try {
      const deleted = await prisma.entity.delete({ where: { id }, include });
      socket.emit("entity:deletion:success", deleted);
      socket.broadcast.emit("entity:deleted", deleted);
    } catch (error) {
      console.log(error);
      socket.emit("entity:deletion:error", error?.toString());
    }
  }

  static async list(socket: Socket) {
    try {
      const entities = await prisma.entity.findMany({ include });
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

  async update(data: Partial<EntityPrisma>, socket?: Socket) {
    // @ts-ignore
    if (data.image?.file) {
      // @ts-ignore
      // prettier-ignore
      data.image = saveImage(`entities/${this.id}/`, data.image.file as ArrayBuffer, data.image.name);
    }

    try {
      const updatePromises = [];

      const existingAddresses = data.addresses?.filter((a) => a.id) || [];
      const newAddresses = data.addresses?.filter((a) => !a.id) || [];

      // Update existing addresses
      existingAddresses.forEach((address) => {
        if (address.id) {
          updatePromises.push(
            prisma.address.update({
              where: { id: address.id },
              data: {
                cep: address.cep,
                city: address.city,
                district: address.district,
                number: address.number,
                street: address.street,
                uf: address.uf,
              },
            })
          );
        }
      });

      // Create new addresses
      if (newAddresses.length > 0) {
        updatePromises.push(
          prisma.address.createMany({
            data: newAddresses.map(({ id, ...rest }) => ({
              ...rest,
              entityId: this.id, // Assume entityId is how addresses are linked to the entity
            })),
          })
        );
      }

      // Update the entity itself (excluding address-related data here)
      updatePromises.push(
        prisma.entity.update({
          where: { id: this.id },
          data: {
            // Include other entity fields from `data` as needed
          },
        })
      );

      try {
        // Execute all updates as a transaction
        await prisma.$transaction(updatePromises);

        if (socket) {
          // Emit success event; consider reloading entity data to send back updated data
          socket.emit("entity:update:success", {
            id: this.id /*, Reloaded data*/,
          });
        }
      } catch (error) {
        console.error("Failed to update entity and addresses:", error);
        if (socket) {
          socket.emit(
            "entity:update:error",
            error || "Failed to update entity and addresses"
          );
        }
      }
    } catch (error) {
      console.log(error);
      if (socket) {
        socket.emit("entity:update:error", error?.toString());
      }
    }
  }
}

export type EntityForm = Omit<WithoutFunctions<Entity>, "address" | "id"> & {
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
  cnpj: string;
  fantasyName: string;
  headquarters: string;
  foundingDate: string;
};
