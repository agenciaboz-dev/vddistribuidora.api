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
exports.Person = void 0;
const index_1 = require("../prisma/index");
const include_1 = require("../prisma/include");
class Person {
    constructor(id) {
        this.id = id;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const person_prisma = yield index_1.prisma.person.findUnique({
                where: { id: this.id },
                include: include_1.person,
            });
            if (person_prisma) {
                this.load(person_prisma);
            }
            else {
                throw "cadastro não encontrado";
            }
        });
    }
    static register(socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registerDate = new Date().getTime().toString();
                const { type } = data;
                const person_prisma = yield index_1.prisma.person.create({
                    data: {
                        image: data.image,
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
                        registerDate,
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
                    include: include_1.person,
                });
                if (type === "physical") {
                    yield index_1.prisma.physicalPerson.create({
                        data: {
                            name: data.name,
                            nickname: data.nickname,
                            cpf: data.cpf,
                            rg: data.rg,
                            gender: data.gender,
                            birthCity: data.birthCity,
                            birthDate: data.birthDate,
                            personId: person_prisma.id,
                        },
                    });
                }
                else if (type === "judiciary") {
                    yield index_1.prisma.judiciaryPerson.create({
                        data: {
                            socialReason: data.socialReason,
                            fantasyName: data.fantasyName,
                            headquarters: data.headquarters,
                            foundingDate: data.foundingDate,
                            personId: person_prisma.id,
                        },
                    });
                }
                const updatedPerson = yield index_1.prisma.person.findUnique({
                    where: { id: person_prisma.id },
                    include: include_1.person,
                });
                const user = new Person(person_prisma.id);
                socket.emit("person:registry:success", updatedPerson);
            }
            catch (error) {
                socket.emit("person:registry:failure", error);
                console.log(error);
            }
        });
    }
    static list(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const persons = yield index_1.prisma.person.findMany({
                    include: include_1.person,
                });
                socket.emit("person:list:success", persons);
            }
            catch (error) {
                socket.emit("person:list:failure", error);
                console.log(error);
            }
        });
    }
    load(data) {
        this.id = data.id;
        this.registerDate = data.registerDate;
    }
}
exports.Person = Person;
