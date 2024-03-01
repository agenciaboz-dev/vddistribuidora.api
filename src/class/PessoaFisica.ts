import { Prisma } from "@prisma/client"
import { Person, PersonPrisma } from "./Person"

export type PhysicalPersonPrisma = Prisma.PhysicalPersonGetPayload<{}>

export class PessoaFisica extends Person {
    name: string
    nickname: string
    cpf: string
    rg: string
    gender: string
    birthCity: string
    birthDate: string

    constructor(id: number) {
        super(id)
    }

    load(data: PersonPrisma & PhysicalPersonPrisma) {
        super.load(data)

        this.name = data.name
        this.nickname = data.nickname
        this.cpf = data.cpf
        this.rg = data.rg
        this.gender = data.gender
        this.birthCity = data.birthCity
        this.birthDate = data.birthDate
    }

    update(data: Partial<Person> & Partial<PessoaFisica>) {
        super.update(data)

        console.log("filho")
    }
}

const teste = new PessoaFisica(1)

teste.update()
