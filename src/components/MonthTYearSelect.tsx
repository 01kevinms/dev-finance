import { ChevronLeft, ChevronRight } from "lucide-react"

interface MonthTYearSelectProps {
   month: number;
   year: number;
   onMonthChange: (month: number) => void;
   onYearChange: (year: number) => void;


}
const monthNames: readonly string[] = [
   'janeiro',
   'fevereiro',
   'março',
   'abril',
   'maio',
   'junho',
   'julho',
   'agosto',
   'setembro',
   'outubro',
   'novembro',
   'dezembro'
]

const MonthTYearSelect = ({ month, onMonthChange, year, onYearChange }: MonthTYearSelectProps) => {

   const currentYear = new Date().getFullYear();
   // length 11 posicoes 5 no futuro 5 no passado 1 ano atual
   const Years: number[] = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)


const handleNextMonth = ():void=>{
if (month === 12) {
   onMonthChange(1)
   onYearChange(year + 1)
}else{
   onMonthChange(month + 1)
}
}

const handlePrevMonth = ():void=>{

if (month === 1) {
   onMonthChange(12)
   onYearChange(year - 1)
}else{
   onMonthChange(month - 1)
}

}

   return (
      <div className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-700">
         <button type="button" className="cursor-pointer p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors" 
         aria-label="Proximo mes"
         onClick={handlePrevMonth}>
            <ChevronLeft />
         </button>
         <div className="flex gap-4">
            <label htmlFor="month-select" className="sr-only">meses</label>
            <select 
             onChange={(e)=> onMonthChange(Number(e.target.value))}
            value={month} id="month-select" className="cursor-pointer bg-gray-800 border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
               {monthNames.map((name, index) => (
                  <option key={name} value={index + 1}>{name}</option>
               ))}
            </select>

            <label htmlFor="year-select" className="sr-only">anos</label>
            <select
            onChange={(e)=> onYearChange(Number(e.target.value))} value={year} id="year-select" className="cursor-pointer bg-gray-800 border-gray-700 rounded-md py-1 px-3 text-sm font-medium text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
               {Years.map((name) => (
                  <option key={name} value={name}>{name}</option>
               ))}
            </select>
         </div>
         <button 
         onClick={handleNextMonth}
         type="button" className="cursor-pointer p-2 rounded-full hover:bg-gray-800 hover:text-primary-500 transition-colors" aria-label="mes anterior"
         >
            <ChevronRight />
         </button>

      </div>
   )
}

export default MonthTYearSelect