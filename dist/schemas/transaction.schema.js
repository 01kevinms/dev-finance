"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransactionSchema = exports.getHistoricalTransactionSchema = exports.getTransactionSummarySchema = exports.getTransactionsSchema = exports.createTransactionSchema = void 0;
const client_1 = require("@prisma/client");
const mongodb_1 = require("mongodb");
const zod_1 = require("zod");
const isValidObjectId = (id) => mongodb_1.ObjectId.isValid(id);
exports.createTransactionSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, "Description is required"),
    amount: zod_1.z.number().positive("Amount must be a positive number"),
    date: zod_1.z.coerce.date({
        error: () => ({ message: "Invalid date format." })
    }),
    categoryId: zod_1.z.string().refine(isValidObjectId, {
        message: "Invalid category ID format."
    }),
    type: zod_1.z.enum([client_1.TransactionType.expense, client_1.TransactionType.income], {
        message: "Invalid transaction type. Must be 'expense' or 'income'."
    })
});
exports.getTransactionsSchema = zod_1.z.object({
    month: zod_1.z.string().optional(),
    year: zod_1.z.string().optional(),
    type: zod_1.z.enum([client_1.TransactionType.expense, client_1.TransactionType.income], {
        message: "Invalid transaction type. Must be 'expense' or 'income'."
    }).optional(),
    categoryId: zod_1.z.string()
        .refine(isValidObjectId, {
        message: "Invalid category ID format."
    }).optional()
});
exports.getTransactionSummarySchema = zod_1.z.object({
    month: zod_1.z.string({ message: "the month is request." }),
    year: zod_1.z.string({ message: "the year is request." })
});
exports.getHistoricalTransactionSchema = zod_1.z.object({
    month: zod_1.z.coerce.number().min(1).max(12),
    year: zod_1.z.coerce.number().min(2000).max(2100),
    months: zod_1.z.coerce.number().min(1).max(12).optional(),
});
exports.deleteTransactionSchema = zod_1.z.object({
    id: zod_1.z.string().refine(isValidObjectId, {
        message: "Invalid ID.",
    }),
});
