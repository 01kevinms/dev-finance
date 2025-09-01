import { FastifyReply, FastifyRequest } from "fastify";
import { getTransactionSummaryQuery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/advancedFormat';
import prisma from "../../config/prisma";
import { CategorySymmary } from "../../types/category.types";
import { Transaction, TransactionType } from "@prisma/client";
import { TransactionSummary } from "../../types/transaction.type";
dayjs.extend(utc);

export const getTransactionsSummary = async(req:FastifyRequest<{Querystring:getTransactionSummaryQuery}>, rep:FastifyReply):Promise<void>=>{

const userId = req.userId
    if (!userId) {
        rep.status(401).send({ error: "Unauthorized" });
        return
    }
const {month, year} = req.query;

if (!month || !year) {
    rep.status(400).send({ error: "Month and year are required." });
    return
}
        const startDate = dayjs(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = dayjs(startDate).endOf('month').toDate();

    try {
        const transactions = await prisma.transaction.findMany({
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
     const groupedExpenses = new Map<string, CategorySymmary>();

     for(const transaction of transactions){
        if (transaction.type === TransactionType.expense) {
            
            const existing = groupedExpenses.get(transaction.categoryId) ??{
                categoryId: transaction.categoryId,
                categoryName: transaction.category.name,
                categoryColor: transaction.category.color,
                amount: 0,
                percentage: 0
            }

            existing.amount+= transaction.amount
            groupedExpenses.set(transaction.categoryId, existing);
            
            
            totalExpenses += transaction.amount;
        }else{
            totalIncomes += transaction.amount
            }
     }

const summary: TransactionSummary = {
totalExpenses,
totalIncomes,
balance: Number((totalIncomes - totalExpenses).toFixed(2)),
expensesByCategory:Array.from(groupedExpenses.values()).map((entry)=>({
    ...entry,
    percentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)) || 0
})).sort((a,b)=> a.amount - b.amount)

}


        rep.send(summary);
    } catch (err) {
        req.log.error("Error fetching transactions:");
        rep.status(500).send({ error: "Error fetching transactions" });
    }
}
    

