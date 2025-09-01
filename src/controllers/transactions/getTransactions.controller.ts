import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.type";
import dayjs from "dayjs";
import prisma from "../../config/prisma";
import utc from 'dayjs/plugin/advancedFormat';
dayjs.extend(utc);

export const getTransactions = async (request: FastifyRequest<{ Querystring: GetTransactionsQuery }>, reply: FastifyReply): Promise<void> => {

   const userId = request.userId
    if (!userId) {
        reply.status(401).send({ error: "Unauthorized" });
        return
    }
    const { month, categoryId, type, year } = request.query;

    const filter: TransactionFilter = { userId };

    if (month && year) {
        const startDate = dayjs(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = dayjs(startDate).endOf('month').toDate();
        filter.date = { gte: startDate, lte: endDate };
    }
    if (type) {
        filter.type = type;
    }
    if (categoryId) {
        filter.categoryId = categoryId;
    }
    try {
        const transactions = await prisma.transaction.findMany({
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
    } catch (err) {
        request.log.error("Error fetching transactions:");
        reply.status(500).send({ error: "Error fetching transactions" });
    }
}