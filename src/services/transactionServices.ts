import type { createTransactionDTO, MonthlyItem, Transaction, TransactionFilter, TransactionSummary } from "../types/transaction";
import { api } from "./api";

// PARTIAL fala que tudo que vem é opcional
export const getTransactions = async (filter?: Partial<TransactionFilter>): Promise<Transaction[]> => {

    const response = await api.get<Transaction[]>('/transactions', {
        params: filter,
    })
    return response.data;
}

export const getTransactionSummary = async (month: number, year: number): Promise<TransactionSummary> => {

    const response = await api.get<TransactionSummary>('/transactions/summary', {
        params: { month, year },
    })
    return response.data
}
export const getTransactionMonthly = async (
    month: number,
    year: number,
    months?: number): Promise<{ history: MonthlyItem[] }> => {
    const response = await api.get('/transactions/historical',{
        params: {
         month,
         year,
         months,
    },
    });
return response.data;
}

export const deleteTransaction = async (id: string):Promise<void>=>{
    await api.delete(`/transactions/${id}`)
}

export const createTransaction = async (transactionData: createTransactionDTO):Promise<Transaction>=>{
const response = await api.post<Transaction>('/transactions', transactionData)

 return response.data

}