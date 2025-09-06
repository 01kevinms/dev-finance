"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const advancedFormat_1 = __importDefault(require("dayjs/plugin/advancedFormat"));
dayjs_1.default.extend(advancedFormat_1.default);
const getTransactions = async (request, reply) => {
    const userId = request.userId;
    if (!userId) {
        reply.status(401).send({ error: "Unauthorized" });
        return;
    }
    const { month, categoryId, type, year } = request.query;
    const filter = { userId };
    if (month && year) {
        const startDate = (0, dayjs_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = (0, dayjs_1.default)(startDate).endOf('month').toDate();
        filter.date = { gte: startDate, lte: endDate };
    }
    if (type) {
        filter.type = type;
    }
    if (categoryId) {
        filter.categoryId = categoryId;
    }
    try {
        const transactions = await prisma_1.default.transaction.findMany({
            where: filter,
            orderBy: { date: 'desc' },
            include: {
                category: {
                    select: {
                        name: true,
                        type: true,
                        color: true,
                    },
                },
            },
        });
        reply.send(transactions);
    }
    catch (err) {
        request.log.error("Error fetching transactions:");
        reply.status(500).send({ error: "Error fetching transactions" });
    }
};
exports.getTransactions = getTransactions;
