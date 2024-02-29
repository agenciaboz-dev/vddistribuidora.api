"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.person = void 0;
const client_1 = require("@prisma/client");
exports.person = client_1.Prisma.validator()({
    addresses: true,
    judiciaryPerson: true,
    physicalPerson: true,
});
