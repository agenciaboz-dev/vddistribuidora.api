"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaError = exports.user_errors = void 0;
const library_1 = require("@prisma/client/runtime/library");
exports.user_errors = [
    { key: "username", message: "nome de usuário já cadastrado" },
    { key: "email", message: "e-mail já cadastrado" },
    { key: "cpf", message: "cpf já cadastrado" },
    { key: "google_id", message: "conta google já cadastrada" },
];
const handlePrismaError = (error, socket) => {
    var _a, _b;
    if (error instanceof library_1.PrismaClientKnownRequestError) {
        const target = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target;
        const match = target === null || target === void 0 ? void 0 : target.match(/_(.*?)_/);
        if (match) {
            const key = match[1];
            const message = (_b = exports.user_errors.find((item) => item.key == key)) === null || _b === void 0 ? void 0 : _b.message;
            socket.emit("user:signup:error", message);
            return;
        }
    }
};
exports.handlePrismaError = handlePrismaError;
