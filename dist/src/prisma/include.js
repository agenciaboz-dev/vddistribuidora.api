"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entity = void 0;
const client_1 = require("@prisma/client");
exports.entity = client_1.Prisma.validator()({
    addresses: true,
    judiciaryEntity: true,
    physicalEntity: true,
});
