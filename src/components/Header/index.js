import './header.css';
import { BiExit } from "react-icons/bi";
import { auth } from '../../Connection/firebaseConnection';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';


export default function Header() {
     const [user, setUser] = useState({});

    useEffect(() => {
        setUser(
            JSON.parse(localStorage.getItem('userDetail'))
        );
    }, [])

    async function sairApp() {
        await signOut(auth)
        .then(() => {
            toast.info('Até Logo !!')
        })
        .catch((err) => {
            console.log(`Algo deu errado ${err}`);
        })
    }

    return(
        <header className='containerHeader'>
            <div className='headerInfo'>
                <span className='appName'>BoardTarefas</span> <span className='brand'>JLMS</span>
            </div>

            <div className='areaUser'>
                <span className='userName'>{user.email}</span>
                <button className='btnSair' onClick={sairApp}>
                    <BiExit size={35} color='#FFF' className='iconLogout'/>
                </button>
            </div>
            
        </header>
    );
}
