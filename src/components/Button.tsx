import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "success";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
children: ReactNode;
variant?: ButtonVariant;
fullWidth?: boolean;
isLoading?: boolean;
}

const Button = ({
children,
variant = "primary",
fullWidth = false,
isLoading = false,
className,
disabled = false,
...rest
}: ButtonProps) => {
const variantClasses ={
    primary: "bg-primary-500 text-[#051626] font-semibold hover:bg-primary-600 active:translate-y-0",
    outline: "border border-primary-500 text-primary-500 hover:bg-primary-500-50",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    success: "bg-green-500 text-[#051626] hover:bg-brightness-90",
    danger: "bg-red-500 text-white hover:bg-brightness-90",
}

const renderLoading = () => {
  return (
    <div className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
        <title>Loading spinner</title>
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.73 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {children}
    </div>
  );
}

    return(
<div>
    <button type="button" className={`cursor-pointer px-5 ý2.5 rounded-xl font-medium transition-all items-center justify-center
        ${variantClasses[variant]}
        ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : '' }
            ${className}
            ${fullWidth ? 'w-full' : ''}`
}
            disabled={isLoading || disabled}
            {...rest} // aqui coloco o q vier alem, desde q esteja dentro do htmlatrributes, tipo, onclick, onchange...
            >
            {isLoading ? renderLoading() : children}
            </button>
</div>
    )
}
export default Button