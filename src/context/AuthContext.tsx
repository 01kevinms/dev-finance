import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthState } from "../types/Auth";
import { signInWithPopup, onAuthStateChanged, signOut as firebaseSignout } from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "../config/firebase";

interface AuthContextProps {
    authState: AuthState,
    signWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        error: null,
        loading: false
    })

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(firebaseAuth, (user) => {
    
            if (user) {
                setAuthState({
                    user: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    error: null,
                    loading: false,
                })
            } else {
                setAuthState({
                    user: null,
                    error: null,
                    loading: false

                })
            }
        }, (error) => {
            console.error('error na autenticacao');
            setAuthState({
                user: null,
                error: error.message,
                loading: false
            })
        })
        return () => unSubscribe()
    }, [])

    const signWithGoogle = async (): Promise<void> => {
        setAuthState((prev) => ({ ...prev, loading: true }))

        try {

            await signInWithPopup(firebaseAuth, googleAuthProvider)



        } catch (err) {
            console.error(err)
            // confirmando oque o error é
            const message = err instanceof Error ? err.message : 'error de login'
            setAuthState((prev) => ({ ...prev, loading: false, error: message }))
        }
    }

    const signOut = async (): Promise<void> => {
        setAuthState((prev) => ({ ...prev, loading: true }))

        try {
            await firebaseSignout(firebaseAuth)


        } catch (err) {
            const message = err instanceof Error ? err.message : 'error de login'
            setAuthState((prev) => ({ ...prev, loading: false, error: message }))
        }
    }


return <AuthContext.Provider value={{ authState, signWithGoogle, signOut }}>{children}</AuthContext.Provider>

}
export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('USE AUTH MUST BE USED INSIDE IN AUTHPROVIDER')
    }
    return context
}