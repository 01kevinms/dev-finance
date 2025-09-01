import { Link, useLocation } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { Activity, LogIn, LogOut, Menu, X } from "lucide-react"

interface NavLink {
    name: string
    path: string

}

const Header = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { authState, signOut } = useAuth()
    const { pathname } = useLocation()

    const isAuthenticated: boolean = !!authState.user // duas esclaamaçao transforma em um boolean

    const navlink: NavLink[] = [
        { name: 'Dashboard', path: 'dashboard' },
        { name: 'transações', path: 'transacoes' }
    ]
    const handlesignout=():void=>{
        setIsOpen(false)
        signOut()
    }
    const changemenu = ():void=>{
        setIsOpen(isOpen)
    }
    const renderavatar = () => {
        if (!authState.user) return null
        if (authState.user.photoURL) {
            return <img src="authState.user.photoURL" alt={`foto de perfil do(a) ${authState.user.displayName}`} className="w-8 h-8 rounded-full border border-gray-700" />
        }
        return (
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">{authState.user.displayName?.charAt(0)}</div>
        )
    }
    return (
        <header className="bg-gray-900 border border-b border-gray-700">
            <div className="container-app">
                <div className="flex justify-between items-center py-4">
                    {isAuthenticated && (
                        <nav className="hidden md:flex space-x-3">
                            {navlink.map(i => (
                                <Link key={i.path} to={i.path}
                                    // verifica em qual tela estou mudando a cor
                                    className={pathname === i.path ? 'text-primary-500 bg-primary500/10 rounded-md h-10 -px-3 py-2'
                                        : 'text-gray-400 h-10px-3 py-2 hover:text-primary-500 hover:bg-primary-500/5 rounded-md'
                                    }
                                >{i.name}</Link>
                            ))}
                            <Link to='/' className="flex gap-2 text-xl items-center text-primary-500 font-bold"><Activity className="h-6 w-6" /></Link>
                            { }
                        </nav>
                    )}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    {renderavatar()}
                                    <span className="text-sm font-medium">{authState.user?.displayName}</span>
                                </div>
                                <button type="button"
                                onClick={handlesignout}
                                className="hover:text-red-300hover:bg-red-500 p-2 rounded-full transition-colors cursor-pointer"
                                >
                                    <LogOut className="text-gray-200"/>
                                </button>
                            </div>
                        ) : (<Link to='/login'>
                            <LogIn className="bg-primary-500 text-gray-900 font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center hover:bg=primary-500 transition-all" />
                        </Link>)}
                    </div>

<div className="md:hidden flex items-center">
    <button
    type="button"
    className="text-gray-400 p-2 rounded-lg hover:bg-gray-800 transition-colors"
    onClick={changemenu}
    >
     {isOpen ? <X size={24}/> : <Menu size={24}/>}   
    </button>
</div>

                </div>
            </div>


{isOpen &&(

<div>
    <div>
        {isAuthenticated ? (
            <>
            <nav className="space-y-1">
{navlink.map(i=>(
    <Link to={i.path} 
    key={i.path}
    className={`block p-5 rounded-lg 
        ${pathname === i.path ? 'bg-gray-800 text-primary-500 font-medium'
            :'text-gray-400 hover:bg-gray-800 hover:text-primary-500'}`}
    onClick={()=>setIsOpen(false)}
    >{i.name}</Link>
))}
            </nav>

            <div className="flex items-center justify-between p-4 border-t border-gray-700
            ">
                <div className="flex items-center space-x-2">
{renderavatar()}
<span>{authState.user?.displayName}</span>
                </div>
                <button className="cursor-pointer text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-200 transition-colors"
                 type="button" onClick={handlesignout} >
                    <LogOut size={20} />
                </button>
            </div>
            </>
        ): (<Link className="bg-primary-500 text-gray-800 font-semibold px-5 py-2.5 flex items-center justify-center hover:bg-primary-600" 
        onClick={()=> setIsOpen(false)}
        to={'/login'}>entrar</Link>) }
    </div>
</div>

)}
            
        </header >

    )
}
export default Header