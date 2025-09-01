import { FastifyReply, FastifyRequest } from "fastify";
import { deleteTransactionParams } from "../../schemas/transaction.schema";
import prisma from "../../config/prisma";


export const deleteTransaction = async(req:FastifyRequest<{Params: deleteTransactionParams}>,rep:FastifyReply):Promise<void>=>{
const userId = req.userId
const {id}= req.params
    if (!userId) {
        rep.status(401).send({ error: "Unauthorized" });
        return
    }
try {
    
const transaction = await prisma.transaction.findFirst({
    where:{
        id, userId,
    }
})

if (!transaction) {
    rep.status(400).send({error: "ID transaction is invalid"})
    return
}

await prisma.transaction.delete({where:{id}})
rep.status(200).send({message: "transaction deleted with success"})
} catch (err) {
    req.log.error({message: "error of delete transaction"})
    rep.status(500).send({error: "error interl serve"})
}
}