"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_schema_1 = require("../../schemas/transaction.schema");
const prisma_1 = __importDefault(require("../../config/prisma"));
const createTransactionController = async (req, rep) => {
    const userId = req.userId;
    if (!userId) {
        return rep.status(401).send({ error: "Unauthorized" });
    }
    const result = transaction_schema_1.createTransactionSchema.safeParse(req.body);
    if (!result.success) {
        const errorMessage = result.error || "Invalid request data";
        return rep.status(500).send({ errorMessage });
    }
    const transaction = result.data;
    try {
        const category = await prisma_1.default.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type,
            }
        });
        if (!category) {
            return rep.status(404).send({ error: "Category not found or does not match transaction type" });
        }
        const parseDate = new Date(transaction.date);
        const newTransaction = await prisma_1.default.transaction.create({
            data: {
                ...transaction,
                userId,
                date: parseDate
            },
            include: {
                category: true,
            },
        });
        rep.status(201).send(newTransaction);
    }
    catch (err) {
        req.log.error("Error creating transaction:");
        rep.status(500).send({ error: "Error creating transaction" });
    }
};
exports.default = createTransactionController;
