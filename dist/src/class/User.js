"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const index_1 = require("../prisma/index");
class User {
    constructor(id) {
        this.id = id;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const user_prisma = yield index_1.prisma.user.findUnique({
                where: { id: this.id },
            });
            if (user_prisma) {
                this.load(user_prisma);
            }
            else {
                throw "usuário não encontrado";
            }
        });
    }
    static signup(socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_prisma = yield index_1.prisma.user.create({
                    data: Object.assign({}, data),
                });
                const user = new User(user_prisma.id);
                socket.emit("user:signup:success", user_prisma);
            }
            catch (error) {
                socket.emit("user:signup:failure", error);
                console.log(error);
            }
        });
    }
    static login(socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_prisma = yield index_1.prisma.user.findFirst({
                where: {
                    OR: [{ email: data.login }, { cpf: data.login }],
                    password: data.password,
                },
            });
            if (user_prisma) {
                const user = new User(user_prisma.id);
                yield user.init();
                socket.emit("user:login:success", user);
                console.log(user);
            }
            else {
                socket.emit("user:login:failure", "Senha ou Login incorretos");
            }
        });
    }
    static list(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const users_prisma = yield index_1.prisma.user.findMany();
            const users = yield Promise.all(users_prisma.map((user_prisma) => __awaiter(this, void 0, void 0, function* () {
                const user = new User(user_prisma.id);
                user.load(user_prisma);
                return user;
            })));
            socket.emit("user:list:success", users);
        });
    }
    static find(socket, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const users_prisma = yield index_1.prisma.user.findUnique({
                where: { id },
            });
            if (users_prisma !== null) {
                const user = new User(users_prisma.id);
                user.load(users_prisma);
                socket.emit("user:find:success", user);
            }
            else {
                socket.emit("user:find:failure", { message: "User not found.", id });
            }
        });
    }
    load(data) {
        this.id = data.id;
        this.email = data.email;
        this.name = data.name;
        this.password = data.password;
        this.phone = data.phone;
        this.cpf = data.cpf;
    }
}
exports.User = User;
exports.default = User;
