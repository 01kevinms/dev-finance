import type { Category, CategorySymmary } from "./category";

export enum TransactionType {
    EXPENSE= 'expense',
    INCOME='income',
}
export interface Transaction{
    id: string;
    userId: string;
    description: string;
    amount: number;
    date: string | Date;
    categoryId: string;
    category: Category;
    type: TransactionType;
    updateAt: string | Date;
    createdAt: string | Date;
}

export interface TransactionFilter{

    month: number;
    year: number;
    categoryId?: string;
    type?: TransactionType;
}
export interface createTransactionDTO{
    description:string
    amount: number
    date:Date | string 
    categoryId: string
    type:TransactionType

} 

export interface TransactionSummary{
    totalExpenses: number
    totalIncomes: number
    balance: number
    expensesByCategory: CategorySymmary[]
}
export interface MonthlyItem {
    name: string
    expenses: number
    income:number
}