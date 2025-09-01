import { useEffect, useState } from "react"
import MonthTYearSelect from "../components/MonthTYearSelect"
import { getTransactionMonthly, getTransactionSummary } from "../services/transactionServices"
import type { MonthlyItem, TransactionSummary } from "../types/transaction"
import Card from "../components/card"
import { ArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react"
import { formatCurrency } from "../utils/formatter"
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar } from 'recharts';

const inicitialSummary: TransactionSummary = {
    balance: 0,
    totalExpenses: 0,
    totalIncomes: 0,
    expensesByCategory: []
}

// interface chartLabelProps {
//     categoryName: string
//     percent: number
// }

const Dashboard = () => {
    const currendate = new Date()
    const [year, setYear] = useState<number>(currendate.getFullYear());
    //    + 1 no month porque sempre comeca no mes 0
    const [month, setMonth] = useState(currendate.getMonth() + 1);
    const [summary, setSummary] = useState<TransactionSummary>(inicitialSummary);
    const [monthlyitemData, setMonthlyitemData] = useState<MonthlyItem[]>([]);

    useEffect(() => {
        async function loadTransactionsSummary() {
            const response = await getTransactionSummary(month, year)
            setSummary(response)
        }
        loadTransactionsSummary()
    }, [month, year])

    useEffect(() => {
        async function loadTransactionsMonthly() {
            const response = await getTransactionMonthly(month, year, 4)
            setMonthlyitemData(response.history)
        }
        loadTransactionsMonthly()
    }, [month, year])


    const renderPieChartLabel = (entry: any): string => {
  const name = entry.categoryName;
  const pct = entry.percent; // valor vai de 0 a 1
  return `${name}: ${(pct * 100).toFixed(1)}%`;
};

    const formatTooTipValue = (value: number | string): string => {
        return formatCurrency(typeof value === 'number' ? value : 0)
    }

    return (
        <div className="container-app py-6">
            <div className="flex flex-cols md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className=" text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
                <MonthTYearSelect month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
            </div>

            <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">

                <Card
                    icon={<Wallet size={20}
                        className="text-primary-500" />}
                    title='saldo'
                    hover
                    glowEffect={summary.balance > 0}
                >
                    <p className={`text-2xl font-semibold mt-2
            ${summary.balance > 0 ? 'text-primary-500' : 'text-red-300'}`}
                    >

                        {formatCurrency(summary.balance)}
                    </p>
                </Card>

                <Card
                    icon={<ArrowUp size={20}
                        className="text-primary-500" />}
                    title='Receitas'
                    hover
                >
                    <p className='text-2xl text-primary-500 font-semibold mt-2'
                    >

                        {formatCurrency(summary.totalIncomes)}
                    </p>
                </Card>

                <Card
                    icon={<Wallet size={20}
                        className="text-red-500" />}
                    title='Depesas'
                    hover
                >
                    <p className='text-2xl font-semibold mt-2 text-red-600'>
                        {formatCurrency(summary.totalExpenses)}
                    </p>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mn-6 mt-3">
                <Card icon={<TrendingUp size={20} className="text-primary-500" />}
                    title='Despesas por Categoria'
                    className="min-h-80"
                >
                    {summary.expensesByCategory.length > 0 ? (

                        <div className="h-72 mt-4">

                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={summary.expensesByCategory}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey='amount'
                                        nameKey='categoryName'
                                        label={renderPieChartLabel}>

                                        {summary.expensesByCategory.map(entry => (
                                            <Cell key={entry.categoryId}
                                                fill={entry.categoryColor}>

                                            </Cell>
                                        ))}

                                    </Pie>
                                    <Tooltip formatter={formatTooTipValue} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className=" flex items-center justify-center h-64 text-gray-500">
                            sem despesas nesse periodo
                        </div>
                    )
                    }
                </Card>
                <Card icon={<Calendar size={20} className="text-primary-500" />}
                    title='Historico Mensal'
                    className="min-h-80 p-2.5"
                >
                    <div className="h-72 mt-4">
                        {monthlyitemData.length > 0 ? (

                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={monthlyitemData} margin={{left: 40}}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)"/>
                                    <XAxis dataKey="name" stroke="#94a3bb" tick={{style:{textTransform:'capitalize' }}} />
                                    <YAxis stroke="#94a3bb" tickFormatter={formatCurrency} tick={{style:{fontSize: 14 }}} />
                                    <Tooltip formatter={formatCurrency}
                                    contentStyle={{backgroundColor: '#1a1a1a',
                                        borderColor: '#2a2a2a'
                                    }} labelStyle={{color: '#f8f8f8'}}/>
                                    <Legend />
                                    <Bar dataKey="expenses" fill="#ff6384"  />
                                    <Bar dataKey="income" fill="#37e259"  />
                                </BarChart>
                            </ResponsiveContainer>

                        ) : (<div className=" flex items-center justify-center h-64 text-gray-500">
                            sem despesas nesse periodo
                        </div>)}
                    </div>
                </Card>
            </div>
        </div>
    )
}
export default Dashboard