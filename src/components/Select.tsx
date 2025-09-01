import { ChevronDown } from "lucide-react";
import { useId, type ReactNode, type SelectHTMLAttributes } from "react"


interface SelectOptions {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    icon?: ReactNode
    fullWidth?: boolean
    options: SelectOptions[]
}


const Select = ({ label, error, icon, fullWidth = true, className = '', options, id, ...rest }: SelectProps) => {
    const selectId = useId()
    return (
        <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
            {label && (
                <label className="block text-sm font-medium text-gray-50" htmlFor={selectId}>
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absulute inset-y-0 top-6 left-0 pl-2 flex items-center text-gray-400">{icon}</div>
                )}
                <select className={`block w-full bg-gray-800 py-3 text-gray-50 text-sm pl-10 pr-4 rounded-xl ${error ? 'border-red-500': 'border-gray-700'}
                ${error ? 'focus:border-red-500': 'focus:border-primary-500'} outline-none
                appearence-none
                `} {...rest} id={selectId}>{options.map(i => (
                    <option key={i.value} value={i.value}>
                        {i.label}
                    </option>
                ))}</select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 top-6">
                    <ChevronDown className="h-5 w-5 text-gray-50" />
                </div>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    )
}
export default Select