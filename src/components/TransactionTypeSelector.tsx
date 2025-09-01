import { TransactionType } from "../types/transaction"


interface TransactionTypeSelectorProps {
    value: TransactionType;
    id?: string;
    onChange: (type:TransactionType)=> void;
}

const TransactionTypeSelector=({id, value, onChange}:TransactionTypeSelectorProps)=>{

const transactionsTypeButton = [
    {type:TransactionType.EXPENSE,
        label:'Despesas',
        activateClasses:'bg-red-500 border-red-500 text-red-700 font-medium',
        inativeClasses: 'bg-transparent border-red-300 text-red-500 hover:bg-red-50'
    },
     {type:TransactionType.INCOME,
        label:'Receitas',
        activateClasses:'bg-green-100 border-green-500 text-green-700 font-medium',
        inativeClasses: 'bg-transparent border-green-300 text-green-500 hover:bg-green-50'
    }
]


    return(
      <fieldset id={id} className="grid grid-cols-2 gap-4">
        {transactionsTypeButton.map(i =>(
            <button key={i.type} type="button" onClick={()=> onChange(i.type)}
            className={`cursor-pointer flex items-center justify-center border rounded-md py-4 px-4 transition-all ${value === i.type ? i.activateClasses: i.inativeClasses}`}
            >
{i.label}
            </button>
        ))}
      </fieldset>
    )
}
export default TransactionTypeSelector