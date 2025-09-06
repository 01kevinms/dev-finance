"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsSummary = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const advancedFormat_1 = __importDefault(require("dayjs/plugin/advancedFormat"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const client_1 = require("@prisma/client");
dayjs_1.default.extend(advancedFormat_1.default);
const getTransactionsSummary = async (req, rep) => {
    const userId = req.userId;
    if (!userId) {
        rep.status(401).send({ error: "Unauthorized" });
        return;
    }
    const { month, year } = req.query;
    if (!month || !year) {
        rep.status(400).send({ error: "Month and year are required." });
        return;
    }
    const startDate = (0, dayjs_1.default)(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = (0, dayjs_1.default)(startDate).endOf('month').toDate();
    try {
        const transactions = await prisma_1.default.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                category: true,
            },
        });
        let totalExpenses = 0;
        let totalIncomes = 0;
        // const expensesByCategory: Map<string, CategorySymmary> = new Map();
        const groupedExpenses = new Map();
        for (const transaction of transactions) {
            if (transaction.type === client_1.TransactionType.expense) {
                const existing = groupedExpenses.get(transaction.categoryId) ?? {
                    categoryId: transaction.categoryId,
                    categoryName: transaction.category.name,
                    categoryColor: transaction.category.color,
                    amount: 0,
                    percentage: 0
                };
                existing.amount += transaction.amount;
                groupedExpenses.set(transaction.categoryId, existing);
                totalExpenses += transaction.amount;
            }
            else {
                totalIncomes += transaction.amount;
            }
        }
        const summary = {
            totalExpenses,
            totalIncomes,
            balance: Number((totalIncomes - totalExpenses).toFixed(2)),
            expensesByCategory: Array.from(groupedExpenses.values()).map((entry) => ({
                ...entry,
                percentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)) || 0
            })).sort((a, b) => a.amount - b.amount)
        };
        rep.send(summary);
    }
    catch (err) {
        req.log.error("Error fetching transactions:");
        rep.status(500).send({ error: "Error fetching transactions" });
    }
};
exports.getTransactionsSummary = getTransactionsSummary;
