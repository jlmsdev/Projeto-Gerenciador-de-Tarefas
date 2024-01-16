import { useEffect, useState } from "react";
import { auth } from '../Connection/firebaseConnection';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';


export default function Private({ children }) {
    const [loading, setLoading] = useState(true);
    const [logado, setLogado] = useState(false);

    useEffect(() => {
        async function checkLogin() {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    const userData = {
                        uid: user.uid,
                        email: user.email
                    };
                    

                    localStorage.setItem('userDetail', JSON.stringify(userData));
                    setLoading(false);
                    setLogado(true);
                }else {
                    setLoading(false);
                    setLogado(false);
                }
            });

        }
        checkLogin()

    }, [])

    if(loading) {
        return(
            <div></div>
        )
    }

    if(!logado) {
        return <Navigate to='/'/>
    }



    return children;

}