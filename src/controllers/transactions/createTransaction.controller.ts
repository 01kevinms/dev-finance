import { FastifyReply, FastifyRequest } from "fastify";
import { createTransactionSchema } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";


const createTransactionController = async (req: FastifyRequest, rep: FastifyReply): Promise<void> => {
const userId = req.userId
if (!userId) {
    return rep.status(401).send({ error: "Unauthorized" });
}
const result = createTransactionSchema.safeParse(req.body)
if (!result.success) {
   const errorMessage = result.error || "Invalid request data";
    return rep.status(500).send({errorMessage});
}
const transaction = result.data;
try {
    
const category = await prisma.category.findFirst({
    where: {
        id: transaction.categoryId,
        type: transaction.type,

    }
})
if (!category) {
   return rep.status(404).send({ error: "Category not found or does not match transaction type" });
}
const parseDate = new Date(transaction.date);

const newTransaction = await prisma.transaction.create({
    data:{
        ...transaction,
        userId,
        date: parseDate
    },
    include:{
        category: true,
    },
})
rep.status(201).send(newTransaction);
} catch (err) {
    req.log.error("Error creating transaction:");
    rep.status(500).send({ error: "Error creating transaction" });
}
}
export default createTransactionController;