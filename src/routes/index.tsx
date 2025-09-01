
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home.tsx';
import Login from '../pages/Login.tsx';
import Dashboard from '../pages/Dashboard.tsx';
import { AuthProvider } from '../context/AuthContext.tsx';
import PrivateRoutes from './PrivateRoutes.tsx';
import AppLayout from '../layout/AppLayout.tsx';
import Transactions from '../pages/Transaction.tsx';
import TransactionForm from '../pages/TransactionForm.tsx';
import { ToastContainer, type ToastContainerProps } from 'react-toastify';


const AppRoutes = () => {

const toastconfig: ToastContainerProps = {
position: 'top-right',
autoClose: 3000,
hideProgressBar:false,
newestOnTop: true,
closeOnClick:true,
draggable:true,
pauseOnHover:true,
theme:'colored'
}

    return (
        <BrowserRouter>
            <AuthProvider>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route element={<PrivateRoutes />}>
                        <Route element={<AppLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/transacoes" element={<Transactions />} />
                            <Route path="/transacoes/nova" element={<TransactionForm />} />

                        </Route>
                    </Route>
                </Routes>
                <ToastContainer {...toastconfig} />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default AppRoutes;