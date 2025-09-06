"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaConnect = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const prismaConnect = async () => {
    try {
        await prisma.$connect();
        console.log("Prisma connected successfully");
    }
    catch (err) {
        console.error("Error connecting to Prisma:");
    }
};
exports.prismaConnect = prismaConnect;
exports.default = prisma;
