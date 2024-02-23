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
    constructor(id, user_prisma) {
        var _a, _b, _c, _d, _e;
        this.id = id;
        this.name = (_a = user_prisma === null || user_prisma === void 0 ? void 0 : user_prisma.name) !== null && _a !== void 0 ? _a : "";
        this.email = (_b = user_prisma === null || user_prisma === void 0 ? void 0 : user_prisma.email) !== null && _b !== void 0 ? _b : "";
        this.password = (_c = user_prisma === null || user_prisma === void 0 ? void 0 : user_prisma.password) !== null && _c !== void 0 ? _c : "1234";
        this.phone = (_d = user_prisma === null || user_prisma === void 0 ? void 0 : user_prisma.phone) !== null && _d !== void 0 ? _d : "";
        this.cpf = (_e = user_prisma === null || user_prisma === void 0 ? void 0 : user_prisma.cpf) !== null && _e !== void 0 ? _e : "";
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
                const user = new User(user_prisma.id, user_prisma);
                socket.emit("user:signup:success", user);
            }
            catch (error) {
                socket.emit("user:signup:failure", error);
                console.log(error);
            }
        });
    }
    static login(socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            const user_prisma = yield index_1.prisma.user.findFirst({
                where: {
                    OR: [{ email: data.login }, { cpf: data.login }],
                    password: data.password,
                },
            });
            console.log(user_prisma);
            console.log(data);
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
