"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getCategories = async (request, reply) => {
    try {
        const categories = await prisma_1.default.category.findMany({
            orderBy: {
                name: "asc"
            },
        });
        reply.send(categories);
    }
    catch (err) {
        request.log.error("Erro ao buscar categorias:");
        reply.status(500).send({ error: "Erro ao buscar categorias" });
    }
};
exports.getCategories = getCategories;
