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

  static async signup(socket: Socket, data: SignupForm) {
    try {
      const user_prisma = await prisma.user.create({
        data: {
          ...data,
        },
      });
      const user = new User(user_prisma.id);
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
    console.log("hello:", user_prisma);
    console.log("bye", data);

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
