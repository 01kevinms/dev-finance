import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/AuthContext"

const PrivateRoutes = ()=>{
const {authState}= useAuth()

// redireciona para a tela de login caso tente acessar sem esta logado
if (!authState.user) {
    return <Navigate to='/Login' replace/>
}
    // redenriza a tela se estar logado
    return <Outlet />
}

export default PrivateRoutes