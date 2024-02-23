import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Socket } from "socket.io";

export const user_errors = [
  { key: "username", message: "nome de usuário já cadastrado" },
  { key: "email", message: "e-mail já cadastrado" },
  { key: "cpf", message: "cpf já cadastrado" },
  { key: "google_id", message: "conta google já cadastrada" },
];

export const handlePrismaError = (error: unknown, socket: Socket) => {
  if (error instanceof PrismaClientKnownRequestError) {
    const target = error.meta?.target as string | undefined;
    const match = target?.match(/_(.*?)_/);
    if (match) {
      const key = match[1];
      const message = user_errors.find((item) => item.key == key)?.message;
      socket.emit("user:signup:error", message);
      return;
    }
  }
};
