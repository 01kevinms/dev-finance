"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoricalTransactions = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const prisma_1 = __importDefault(require("../../config/prisma"));
require("dayjs/locale/pt-br");
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.locale('pt-br');
const getHistoricalTransactions = async (req, rep) => {
    const userId = req.userId;
    if (!userId) {
        return rep.status(401).send({ error: "Unauthorized" });
    }
    const { month, year, months = 6 } = req.query;
    const baseDate = new Date(year, month - 1, 1);
    const startDate = (0, dayjs_1.default)(baseDate).utc().subtract(months - 1, 'month').startOf('month').toDate();
    const endDate = (0, dayjs_1.default)(baseDate).utc().endOf('month').toDate();
    try {
        const transaction = await prisma_1.default.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                }
            }, select: {
                amount: true,
                type: true,
                date: true
            }
        });
        const monthlyData = Array.from({ length: month }, (_, i) => {
            const date = (0, dayjs_1.default)(baseDate).utc().subtract(months - 1 - i, 'month');
            return {
                name: date.format('MMM/YYYY'),
                income: 0,
                expenses: 0,
            };
        });
        transaction.forEach(transaction => {
            const monthKey = (0, dayjs_1.default)(transaction.date).utc().format('MMM/YYYY');
            const monthData = monthlyData.find(m => m.name === monthKey);
            if (monthData) {
                if (transaction.type === 'income') {
                    monthData.income += transaction.amount;
                }
                else {
                    monthData.expenses += transaction.amount;
                }
            }
        });
        rep.send({ history: monthlyData });
    }
    catch (err) {
    }
};
exports.getHistoricalTransactions = getHistoricalTransactions;
