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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const viacep_1 = __importDefault(require("../api/viacep"));
class Address {
    constructor(data) {
        this.init(data);
    }
    static searchCep(cep, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield viacep_1.default.search(cep.replace(/\D/g, ""));
                const address = response.data;
                if (socket) {
                    socket.emit(address.erro ? "cep:search:error" : "cep:search", address);
                }
            }
            catch (error) {
                console.log(error);
                socket === null || socket === void 0 ? void 0 : socket.emit("cep:search:error", error === null || error === void 0 ? void 0 : error.toString());
            }
        });
    }
    init(data) {
        this.id = data.id;
        this.cep = data.cep;
        this.city = data.city;
        this.district = data.district;
        this.number = data.number;
        this.street = data.street;
        this.uf = data.uf;
        this.personId = data.personId;
    }
}
exports.Address = Address;
