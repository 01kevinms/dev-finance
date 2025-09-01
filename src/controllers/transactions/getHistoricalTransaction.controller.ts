import { FastifyReply, FastifyRequest } from "fastify";
import { getHistoricalTransactionQuery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import prisma from "../../config/prisma";
import 'dayjs/locale/pt-br'
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.locale('pt-br')

export const getHistoricalTransactions = async(
    req: FastifyRequest<{Querystring: getHistoricalTransactionQuery}>, rep:FastifyReply):Promise<void>=>{
    const userId = req.userId
if (!userId) {
    return rep.status(401).send({ error: "Unauthorized" });
}
const {month, year, months= 6} = req.query

const baseDate= new Date(year, month - 1, 1)

const startDate = dayjs(baseDate).utc().subtract(months - 1, 'month').startOf('month').toDate();
const endDate = dayjs(baseDate).utc().endOf('month').toDate();
try {
    const transaction = await prisma.transaction.findMany({
        where:{
            userId,
            date:{
                gte:startDate,
                lte:endDate,
            }
        }, select:{
            amount: true,
            type:true,
            date:true
        }
    })
const monthlyData = Array.from({length: month}, (_,i)=>{
    const date = dayjs(baseDate).utc().subtract(months - 1 - i, 'month')
    return {
        name: date.format('MMM/YYYY'),
        income: 0,
        expenses: 0,
    }
}) 
transaction.forEach(transaction => {
    const monthKey = dayjs(transaction.date).utc().format('MMM/YYYY')
    const monthData = monthlyData.find(m => m.name === monthKey)

if (monthData) {
    if (transaction.type === 'income') {
        monthData.income += transaction.amount
    }else{
        monthData.expenses+= transaction.amount
    }
}
    })
    rep.send({history: monthlyData})
} catch (err) {
    
}
    }