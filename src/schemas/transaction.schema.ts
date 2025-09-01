import { TransactionType } from "@prisma/client";
import { ObjectId } from "mongodb";
import { z } from "zod";


const isValidObjectId = (id: string):Boolean=>ObjectId.isValid(id)

export const createTransactionSchema = z.object({
description: z.string().min(1, "Description is required"),
amount: z.number().positive("Amount must be a positive number"),
date: z.coerce.date({
   error:()=>({message: "Invalid date format."})
    
}),
categoryId: z.string().refine(isValidObjectId, {
    message: "Invalid category ID format."
}),
type: z.enum([TransactionType.expense, TransactionType.income],{
    message: "Invalid transaction type. Must be 'expense' or 'income'."
    })
}
)

export const getTransactionsSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional(),
    type:z.enum([TransactionType.expense, TransactionType.income],{
        message: "Invalid transaction type. Must be 'expense' or 'income'."
    }).optional(),
    categoryId: z.string()
    .refine(isValidObjectId, {
        message: "Invalid category ID format."
    }).optional()
    
})
export const getTransactionSummarySchema = z.object({
     month: z.string({ message: "the month is request."}),
    year: z.string({ message: "the year is request."})
})
export const getHistoricalTransactionSchema = z.object({
     month: z.coerce.number().min(1).max(12),
     year: z.coerce.number().min(2000).max(2100),
      months: z.coerce.number().min(1).max(12).optional(),
})
export const deleteTransactionSchema = z.object({
    id:z.string().refine(isValidObjectId,{
        message:"Invalid ID.",
    }),
})
export type getHistoricalTransactionQuery = z.infer<typeof getHistoricalTransactionSchema>
export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>
export type getTransactionSummaryQuery = z.infer<typeof getTransactionSummarySchema>
export type deleteTransactionParams = z.infer<typeof deleteTransactionSchema>
