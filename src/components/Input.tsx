import { useId, type InputHTMLAttributes, type ReactNode } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
fullWidth?: boolean;
icon?:ReactNode;
label?: string;
error?:string;
id?: string;
}


const Input= ({icon, fullWidth, label, id, error, className,...rest}:InputProps)=>{
const generatedId =useId()
const InputId = id || generatedId
    return(
        <div className={`${fullWidth ? 'w-full':''} mb-4`}>
            {label && (
<label htmlFor={InputId} className="block text-sm font-medium text-gray-50 mb-2">
    {label}
</label>
            )}
            <div className="relative">
{icon &&(
    <div className="absolute bottom-0 top-5 left-0 pl-3 felx items-center cursor-pointer text-gray-400">
    {icon}
    </div>
)}
            </div>
                <input 
                id={InputId}
                className={` block w-full rounded-xl border ${error ? ' broder-red-500' : 'bg-gray-700'}
                px-4 py-3 text-sm text-gray-50 transition-all focus:outline-none focus:ring-2
                ${error ? 'focus:border-red-500 focus:ring-red-500/2': 'focus:border-primary-500 focus:ring_primary-500'}
                ${icon ? ' pl-10': ''}
                ${className}
                `}
                {...rest}
                />
        {error &&(
            <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        </div>
    )
}
export default Input