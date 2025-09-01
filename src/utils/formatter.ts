export const formatCurrency = (value:number):string=>{
return new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency'
}).format(value)
}
export const formatedate = (date: Date | string):string =>{
    const dateobj = date instanceof Date ? date: new Date(date)
return new Intl.DateTimeFormat('pt-BR').format(dateobj)
}