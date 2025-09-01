import { AlertCircle, ArrowUp, Plus, Search, Trash2 } from "lucide-react"
import { Link } from "react-router"
import MonthTYearSelect from "../components/MonthTYearSelect"
import { useEffect, useState, type ChangeEvent } from "react"
import Input from "../components/Input"
import Card from "../components/card"
import { TransactionType, type Transaction } from "../types/transaction"
import { deleteTransaction, getTransactions } from "../services/transactionServices"
import Button from "../components/Button"
import { formatCurrency, formatedate } from "../utils/formatter"
import { toast } from "react-toastify"

const Transactions = () => {
    const currendate = new Date()
    const [year, setYear] = useState<number>(currendate.getFullYear())
    const [month, setMonth] = useState<number>(currendate.getMonth() + 1)
    const [loading, setLoading] = useState<Boolean>(false)
    const [error, setError] = useState<string>('')
    const [transaction, setTransaction] = useState<Transaction[]>([])
    const [deleteid, setDeleteid] = useState<string>('')
    const [searchtext, setSearchtext] = useState<string>('')
    const [filteredTransaction, setFilteredTransaction] = useState<Transaction[]>([])




    const fetchtransactions = async (): Promise<void> => {

        try {
            setLoading(true)
            setError('')
            const data = await getTransactions({ month, year })
            setTransaction(data)
            setFilteredTransaction(data)
        } catch (err) {
            setError('nao foi possivel carregar ')
        }
        finally { setLoading(false) }
    }
    const handledelete = async (id: string): Promise<void> => {
        try {
            setDeleteid(id)
            await deleteTransaction(id)
            toast.success('transacao deletada com sucesso')
            setFilteredTransaction((prev) => prev.filter((t) => t.id !== id))
        } catch (err) {
            console.error(err)
            toast.error('falha ao deletar transacao')
        } finally {
            setDeleteid('')
        }
    }
    const confirmDelete = async (id: string): Promise<void> => {
        if (window.confirm('tem certeza que deseja deletar?')) {
            handledelete(id);

        }
    }
    useEffect(() => {

        fetchtransactions()
    }, [month, year])

    const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchtext(e.target.value)
        setFilteredTransaction(
            // procurando transacoes pelo nome na barra de pesquisa
            transaction.filter((transaction) =>
                transaction.description.toUpperCase().includes(e.target.value.toUpperCase()),
            ),
        );
    };

    return (
        <div className="container-app py-6">
            <div className="flex flex=col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
                <Link to='/transacoes/nova' className="bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg=primary-600 transition-all
                "
                >
                    <Plus className="w-4 h-4 mr-2" />

                    Nova Transações
                </Link>
            </div>
            <Card className="mb-6">
                <MonthTYearSelect month={month} onYearChange={setYear} onMonthChange={setMonth} year={year} />
            </Card>
            <Card className="mb-6">
                <Input placeholder='Buscar transacoes'
                    icon={<Search className="w-4 h-4" />}
                    fullWidth
                    onChange={handleSearch}
                    value={searchtext}
                />
            </Card>

            <Card className="overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-s " />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p>{error}</p>
                        <Button onClick={fetchtransactions} className='mx-auto mt-6'>tentar</Button>
                    </div>
                ) : transaction?.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">
                            nenhuma transacao encontrada
                        </p>
                        <Link to='/transacoes/nova' className="w-fit mx-auto mt-6 bg-primary-500 text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center hover:bg=primary-600 transition-all
                "
                        >
                            <Plus className="w-4 h-4 mr-2" />

                            Nova Transações
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="overflow-x-auto">
                            <table className=" w-full divide-y divide-gray-700 min-h-full">
                                <thead>
                                    <tr>
                                        <th scope="col" className="px-3 py-3 text-left text-sx font-medium text-gray-400 uppercase">
                                            decxricao
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-sx font-medium text-gray-400 uppercase">
                                            Data
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-sx font-medium text-gray-400 uppercase">
                                            Categoria
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-sx font-medium text-gray-400 uppercase">
                                            Valor
                                        </th>
                                        <th scope="col" className="px-3 py-3 text-left text-sx font-medium text-gray-400 uppercase">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredTransaction.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-800">
                                            <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="mr-2">
                                                        {transaction.type === TransactionType.INCOME ? (
                                                            <ArrowUp className="w-4 h-4 text-primary-500" />
                                                        ) : (<ArrowUp className="w-4 h-4 text-red-500" />)}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-50">
                                                        {transaction.description}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4  whitespace-nowrap">
                                                {formatedate(transaction.date)}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 rounded-full mr-2 " style={{ backgroundColor: transaction.category.color }}>
                                                    </div>
                                                    <span>{transaction.category.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span className={`${transaction.type === TransactionType.INCOME ? 'text-primary-500' : 'text-red-500'}`}>{formatCurrency(transaction.amount)}</span>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap cursor-pointer">
                                                <button disabled={deleteid === transaction.id} className="text-red-500 hover:text-red-400 rounded-full " type="button" onClick={() => confirmDelete(transaction.id)}>
                                                    {deleteid === transaction.id ? (
                                                        <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                                                    ) : (<Trash2 className="w-4 h-4" />)}
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </Card>

        </div>
    )
}
export default Transactions