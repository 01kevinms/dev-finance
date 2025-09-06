"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const createTransaction_controller_1 = __importDefault(require("../controllers/transactions/createTransaction.controller"));
const getTransactions_controller_1 = require("../controllers/transactions/getTransactions.controller");
const getTransactionsSummary_controller_1 = require("../controllers/transactions/getTransactionsSummary.controller");
const transaction_schema_1 = require("../schemas/transaction.schema");
const deleteTransaction_controller_1 = require("../controllers/transactions/deleteTransaction.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const getHistoricalTransaction_controller_1 = require("../controllers/transactions/getHistoricalTransaction.controller");
const transactionRoutes = async (fastify) => {
    try {
        fastify.addHook('preHandler', auth_middleware_1.authMiddleware);
        fastify.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
        fastify.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
        const app = fastify.withTypeProvider();
        // criar array
        app.route({
            method: 'POST',
            url: '/',
            schema: {
                body: transaction_schema_1.createTransactionSchema,
            }, handler: createTransaction_controller_1.default,
        });
        // buscar por filtro
        app.route({
            method: 'GET',
            url: '/',
            schema: {
                querystring: transaction_schema_1.getTransactionsSchema
            },
            handler: getTransactions_controller_1.getTransactions
        });
        // buscar resumo
        app.route({
            method: 'GET',
            url: '/summary',
            schema: {
                querystring: transaction_schema_1.getTransactionSummarySchema
            },
            handler: getTransactionsSummary_controller_1.getTransactionsSummary
        });
        // historico de resumos
        app.route({
            method: 'GET',
            url: '/historical',
            schema: {
                querystring: transaction_schema_1.getHistoricalTransactionSchema
            },
            handler: getHistoricalTransaction_controller_1.getHistoricalTransactions
        });
        app.route({
            method: 'DELETE',
            url: '/:id',
            schema: {
                params: transaction_schema_1.deleteTransactionSchema
            },
            handler: deleteTransaction_controller_1.deleteTransaction
        });
    }
    catch (err) {
        console.error("Error registering transaction routes:", err);
    }
};
exports.default = transactionRoutes;
