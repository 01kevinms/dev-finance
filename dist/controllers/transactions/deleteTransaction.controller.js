"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const deleteTransaction = async (req, rep) => {
    const userId = req.userId;
    const { id } = req.params;
    if (!userId) {
        rep.status(401).send({ error: "Unauthorized" });
        return;
    }
    try {
        const transaction = await prisma_1.default.transaction.findFirst({
            where: {
                id, userId,
            }
        });
        if (!transaction) {
            rep.status(400).send({ error: "ID transaction is invalid" });
            return;
        }
        await prisma_1.default.transaction.delete({ where: { id } });
        rep.status(200).send({ message: "transaction deleted with success" });
    }
    catch (err) {
        req.log.error({ message: "error of delete transaction" });
        rep.status(500).send({ error: "error interl serve" });
    }
};
exports.deleteTransaction = deleteTransaction;
