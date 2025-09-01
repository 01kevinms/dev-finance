import { FastifyInstance } from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";

import createTransaction from "../controllers/transactions/createTransaction.controller";
import { getTransactions } from "../controllers/transactions/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transactions/getTransactionsSummary.controller";

import {
  createTransactionSchema,
  deleteTransactionSchema,
  getHistoricalTransactionSchema,
  getTransactionsSchema,
  getTransactionSummarySchema,
} from "../schemas/transaction.schema";
import { deleteTransaction } from "../controllers/transactions/deleteTransaction.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { getHistoricalTransactions } from "../controllers/transactions/getHistoricalTransaction.controller";

const transactionRoutes = async (fastify: FastifyInstance) => {

  try {
    fastify.addHook('preHandler', authMiddleware)
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);
    const app = fastify.withTypeProvider<ZodTypeProvider>();
    // criar array
    app.route({
      method: 'POST',
      url: '/',
      schema: {
        body: createTransactionSchema,
      }, handler: createTransaction,
    })
    // buscar por filtro
    app.route({
      method: 'GET',
      url: '/',
      schema: {
        querystring: getTransactionsSchema
      },
      handler: getTransactions
    });
    // buscar resumo
    app.route({
      method: 'GET',
      url: '/summary',
      schema: {
        querystring: getTransactionSummarySchema
      },
      handler: getTransactionsSummary
    });
// historico de resumos
    app.route({
      method: 'GET',
      url: '/historical',
      schema: {
        querystring: getHistoricalTransactionSchema
      },
      handler: getHistoricalTransactions
    });

    app.route({
      method: 'DELETE',
      url: '/:id',
      schema: {
        params: deleteTransactionSchema
      },
      handler: deleteTransaction
    });
  } catch (err) {
    console.error("Error registering transaction routes:", err);
  }
}




export default transactionRoutes;
