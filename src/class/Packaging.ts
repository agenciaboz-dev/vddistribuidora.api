import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { saveImage } from "../tools/saveImage";
import { WithoutFunctions, ImageUpload } from "./helpers";
import { Socket } from "socket.io";
// import { packaging as include } from "../prisma/include";

// export type PackagingPrisma = Prisma.PackagingGetPayload<{
//   include: typeof include;
// }>;

export type PackagingPrisma = Prisma.PackagingGetPayload<{}>;
export type PackagingForm = Omit<WithoutFunctions<Packaging>, "id">;

export class Packaging {
  id: number;
  name: string;
  description: string;
  image: string;

  constructor(data: PackagingPrisma) {
    this.load(data);
  }

  async init() {
    const packaging_prisma = await prisma.packaging.findUnique({
      where: { id: this.id },
    });
    if (packaging_prisma) {
      this.load(packaging_prisma);
    } else {
      throw "Packaging not found";
    }
  }

  static async register(socket: Socket, data: PackagingForm) {
    try {
      const packaging_prisma = await prisma.packaging.create({
        data: {
          name: data.name,
          description: data.description,
          image: "",
        },
      });

      const packaging = new Packaging(packaging_prisma);
      packaging.load(packaging_prisma);
      if (data.image) {
        // @ts-ignore
        if (data.image?.file) {
          // @ts-ignore
          // prettier-ignore
          const url = saveImage(`entities/${packaging.id}/`, data.image.file as ArrayBuffer, data.image.name);

          // await packaging.update({ image: url });
        }
      }
      packaging.load(packaging_prisma);
      socket.emit("packaging:creation:success", packaging);
    } catch (error) {
      socket.emit("packaging:creation:failure", error);
      console.log(error);
    }
  }

  static async update(
    socket: Socket,
    data: Partial<PackagingPrisma> & { id: number; packaging_id: number }
  ) {
    try {
      const packaging_prisma = await prisma.packaging.findUnique({
        where: { id: data.id },
      });
      if (packaging_prisma) {
        const packaging = new Packaging(packaging_prisma);
        await packaging.update(data, socket);
      } else {
        throw "embalagem não encontrada";
      }
    } catch (error) {
      console.log(error);
      socket.emit("packaging:update:error", error?.toString());
    }
  }

  static async list(socket: Socket) {
    try {
      const packagings = await prisma.packaging.findMany();
      socket.emit("packaging:list:success", packagings);
    } catch (error) {
      socket.emit("packaging:list:failure", error);
      console.log(error);
    }
  }

  static async find(socket: Socket, id: number) {
    const packaging_prisma = await prisma.packaging.findUnique({
      where: { id },
    });
    if (packaging_prisma) {
      const packaging = new Packaging(packaging_prisma);
      packaging.load(packaging_prisma);
      socket.emit("packaging:find:success", packaging);
    } else {
      socket.emit("packaging:find:failure", {
        message: "Packaging not found.",
        id,
      });
      console.log({ message: "Packaging not found.", id });
    }
  }

  static async delete(socket: Socket, id: number) {
    try {
      const deleted = await prisma.packaging.delete({ where: { id } });
      // const packaging = new Packaging(deleted);
      socket.emit("packaging:deletion:success", deleted);
      socket.broadcast.emit("packaging:deleted", deleted);
    } catch (error) {
      console.log(error);
      socket.emit("packaging:deletion:error", error?.toString());
    }
  }

  async update(data: Partial<PackagingPrisma>, socket?: Socket) {
    // @ts-ignore
    if (data.image?.file) {
      // @ts-ignore
      // prettier-ignore
      data.image = saveImage(`categories/${this.id}/`,data.image.file as ArrayBuffer, data.image.name);
    }

    const packaging_prisma = await prisma.packaging.update({
      where: { id: this.id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
      },
    });
    this.load(packaging_prisma);

    if (socket) {
      socket.emit("packaging:update:success", this);
      socket.broadcast.emit("packaging:update", this);
    }
  }

  load(data: PackagingPrisma) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.image = data.image;
  }
}
