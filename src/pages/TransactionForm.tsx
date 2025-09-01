import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from "react"
import { TransactionType, type createTransactionDTO } from "../types/transaction"
import { getCategories } from "../services/categoryServices"
import type { Category } from "../types/category"
import Card from "../components/card"
import TransactionTypeSelector from "../components/TransactionTypeSelector"
import Input from "../components/Input"
import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react"
import Select from "../components/Select"
import Button from "../components/Button"
import { useNavigate } from "react-router"
import { createTransaction } from "../services/transactionServices"
import { toast } from "react-toastify"


interface FormData {
    description: string
    amount: number
    date: string
    categoryId: string
    type: TransactionType

}
const initialFormData = {
    description: '',
    amount: 0,
    date: '',
    categoryId: '',
    type: TransactionType.EXPENSE,

}


const TransactionForm = () => {
    const formId = useId()
    const [formdata, setFormdata] = useState<FormData>(initialFormData)
    const [categories, setCategories] = useState<Category[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchCategories = async (): Promise<void> => {

            const response = await getCategories()
            setCategories(response)
        }
        fetchCategories()
    }, [])

    const filteredCategories = categories.filter((category) => category.type === formdata.type)

    const validateForm = (): Boolean => {
        if (!formdata.description || !formdata.amount || !formdata.date || !formdata.categoryId) {
            setError('preencha todos os dados')
            return false
        }
        if (formdata.amount <= 0) {
            setError('o valor deve ser maior que zero')
            return false
        }
        return true
    }

    const handleTransactionType = (itemType: TransactionType): void => {
        setFormdata((prev) => ({ ...prev, type: itemType }))

    }
    // const handleTransaction = () => { }

    const handleSubmit = async (e: FormEvent):Promise<void> => {
e.preventDefault() // nao da reload na tela
setLoading(true)
setError(null)
        try {
    if (!validateForm()) {
        return;
    }
    const transactionData: createTransactionDTO={
        description:formdata.description,
        amount:formdata.amount,
        categoryId: formdata.categoryId,
        type:formdata.type,
        date: `${formdata.date}T12:00:00.000Z`,
    }
await createTransaction(transactionData)
toast.success('transacao adicionada com sucesso')
navigate('/transacoes')
} catch (err) {
toast.error('falha ao adicionar transação')}finally{setLoading(false)}
}
const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
  const { name, value } = e.target;
  setFormdata((prev) => ({
    ...prev,
    [name]: name === "amount" ? value === "" ? "" : parseFloat(value)
      : value,
  }));
};

const handleCancel = () => {
    navigate('/transacoes')

}

return (
    <div className="container-app py-8">
        <div className="max-w-2xl max-auto">
            <h1 className="text-xl mb-6 font-bold">Nova Transação</h1>
            <Card>
{error && (
    <div className=" flex items-center bg-red-300 border border-red-700 rounded-xl p-4 mb-6 gap-2">
        
    <AlertCircle className="w-5 h-5 text-red-700" />
    <p className="text-red-700">{error}</p>
    </div>
)}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex gap-2 flex-col">
                        <label htmlFor={formId}>Tipo de Transação</label>
                        <TransactionTypeSelector id={formId} value={formdata.type} onChange={handleTransactionType} />
                    </div>

                    <Input 
                    label='Descricao'
                    name='description' 
                    value={formdata.description}
                    onChange={handleChange} 
                    placeholder="EX; SUPERMERCADO" 
                    />
                    <Input label='valor'
                        name='amount'
                        value={formdata.amount ?? ""}
                        type="number"
                        step='0.01'
                       
                        onChange={handleChange}
                        placeholder="R$ 0,00"
                        icon={<DollarSign className="w-4 h-4" />}
                        required
                    />
                    <Input label='Data'
                        name='date'
                        type="date"
                        value={formdata.date}
                        onChange={handleChange}
                        icon={<Calendar className="w-4 h-4" />}
                       
                    />
                    <Select
                        label="Categoria"
                        name="categoryId"
                        value={formdata.categoryId}
                        onChange={handleChange}
                        icon={<Tag className="w-4 h-4" />}
                        options={[
                            { value: '', label: 'selecione uma categoria' },
                            ...filteredCategories.map((category) => ({
                                value: category.id,
                                label: category.name,
                            })),
                        ]}
                    />

                    <div className="flex justify-end space-x-3">
                        <Button type="button" onClick={handleCancel} variant="outline" disabled={loading}>
                            cancelar
                        </Button>
                        <Button disabled={loading} variant={formdata.type === TransactionType.EXPENSE ? 'danger' : 'success'} type="submit">
                          {loading ?( <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-4 border-gray-700 border-t-transparent rounded-full animate-s " />
                    </div>):(
                        <Save className='w-4 h-4 mr-2' />
                    )}
                            salvar
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    </div>
)
}
export default TransactionForm