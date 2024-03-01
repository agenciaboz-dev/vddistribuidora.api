import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/index";
import { Socket } from "socket.io";
import { LoginForm } from "../types/shared/user/login";
import { WithoutFunctions } from "./helpers";

export type UserPrisma = Prisma.UserGetPayload<{}>;
export type UserForm = Omit<WithoutFunctions<User>, "id">;
export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;

  constructor(id: number) {
    this.id = id;
  }

  async init() {
    const user_prisma = await prisma.user.findUnique({
      where: { id: this.id },
    });
    if (user_prisma) {
      this.load(user_prisma);
    } else {
      throw "usuário não encontrado";
    }
  }

  static async signup(socket: Socket, data: UserForm) {
    try {
      const user_prisma = await prisma.user.create({
        data: {
          ...data,
        },
      });
      const user = new User(user_prisma.id);
      socket.emit("user:signup:success", user_prisma);
    } catch (error) {
      socket.emit("user:signup:failure", error);
      console.log(error);
    }
  }

  static async login(socket: Socket, data: LoginForm) {
    const user_prisma = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.login }, { cpf: data.login }],
        password: data.password,
      },
    });

    if (user_prisma) {
      const user = new User(user_prisma.id);
      await user.init();
      socket.emit("user:login:success", user);
      console.log(user);
    } else {
      socket.emit("user:login:failure", "Senha ou Login incorretos");
    }
  }

  static async list(socket: Socket) {
    const users_prisma = await prisma.user.findMany();
    const users = await Promise.all(
      users_prisma.map(async (user_prisma) => {
        const user = new User(user_prisma.id);
        user.load(user_prisma);
        return user;
      })
    );

    socket.emit("user:list:success", users);
  }

  static async find(socket: Socket, id: number) {
    const users_prisma = await prisma.user.findUnique({
      where: { id },
    });
    if (users_prisma !== null) {
      const user = new User(users_prisma.id);
      user.load(users_prisma);
      socket.emit("user:find:success", user);
    } else {
      socket.emit("user:find:failure", { message: "User not found.", id });
    }
  }

  load(data: UserPrisma) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.password = data.password;
    this.phone = data.phone;
    this.cpf = data.cpf;
  }
}

export default User;
