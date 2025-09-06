"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGlobalCategories = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../config/prisma"));
const globalCategories = [
    // Despesas
    { name: "Alimentação", color: "#FF5733", type: client_1.TransactionType.expense },
    { name: "Transporte", color: "#33A8FF", type: client_1.TransactionType.expense },
    { name: "Moradia", color: "#33FF57", type: client_1.TransactionType.expense },
    { name: "Saúde", color: "#F033FF", type: client_1.TransactionType.expense },
    { name: "Educação", color: "#FF3366", type: client_1.TransactionType.expense },
    { name: "Lazer", color: "#FFBA33", type: client_1.TransactionType.expense },
    { name: "Compras", color: "#33FFF6", type: client_1.TransactionType.expense },
    { name: "Outros", color: "#B033FF", type: client_1.TransactionType.expense },
    // Receitas
    { name: "Salário", color: "#33FF57", type: client_1.TransactionType.income },
    { name: "Freelance", color: "#33A8FF", type: client_1.TransactionType.income },
    { name: "Investimentos", color: "#FFBA33", type: client_1.TransactionType.income },
    { name: "Outros", color: "#B033FF", type: client_1.TransactionType.income },
];
const initializeGlobalCategories = async () => {
    const createdCategories = [];
    for (const category of globalCategories) {
        try {
            const existing = await prisma_1.default.category.findFirst({
                where: {
                    name: category.name,
                    type: category.type
                }
            });
            if (!existing) {
                const newcategory = await prisma_1.default.category.create({ data: category });
                console.log(`Categoria criada: ${newcategory.name}`);
                createdCategories.push(newcategory);
            }
            else {
                createdCategories.push(existing);
            }
        }
        catch (err) {
            console.error(`Erro ao criar categoria ${category.name}:`, err);
        }
    }
    console.log("Todas as categorias globais foram inicializadas");
    return createdCategories;
};
exports.initializeGlobalCategories = initializeGlobalCategories;
