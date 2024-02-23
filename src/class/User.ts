import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/index";
import { Socket } from "socket.io";
import { LoginForm } from "../types/shared/user/login";
import { SignupForm } from "../types/shared/user/signup";

export type UserPrisma = Prisma.UserGetPayload<{}>;

export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;

  constructor(id: number, user_prisma?: UserPrisma) {
    this.id = id;
    this.name = user_prisma?.name ?? "";
    this.email = user_prisma?.email ?? "";
    this.password = user_prisma?.password ?? "1234";
    this.phone = user_prisma?.phone ?? "";
    this.cpf = user_prisma?.cpf ?? "";
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

  static async signup(socket: Socket, data: SignupForm) {
    try {
      const user_prisma = await prisma.user.create({
        data: {
          ...data,
        },
      });
      const user = new User(user_prisma.id, user_prisma);
      socket.emit("user:signup:success", user);
    } catch (error) {
      socket.emit("user:signup:failure", error);
      console.log(error);
    }
  }

  static async login(socket: Socket, data: LoginForm) {
    console.log(data);
    const user_prisma = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.login }, { cpf: data.login }],
        password: data.password,
      },
    });
    console.log(user_prisma);
    console.log(data);

    if (user_prisma) {
      const user = new User(user_prisma.id);
      await user.init();
      socket.emit("user:login:success", user);
      console.log(user);
    } else {
      socket.emit("user:login:failure", "Senha ou Login incorretos");
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
