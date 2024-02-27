import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../../Connection/firebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';

import './login.css';


export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const navigate = useNavigate();


    async function autenticarUsuario(e) {
        e.preventDefault();
        
        if(email === '' || senha === '') {
            toast.warn('E-mail ou senha em branco!');
            return;
        }

        await signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
            navigate('/tarefas', {replace: true})
            toast.success('Bem Vindo!');
        })
        .catch((err) => {
            toast.info(`E-mail ou senha incorretos!`);
        })
    }

    return(
        <div className='containerLogin'>
            
            <form onSubmit={autenticarUsuario} className='boxLogin'>

                <h1>Board Tarefas</h1>
                <small>Organizador de Tarefas</small>

                <div className='areaInput'>
                    <input type="text"
                        placeholder='E-mail'
                        value={email}
                        onChange={ (e)=> setEmail(e.target.value) }
                    />

                    <input type="password"
                        placeholder='******'
                        value={senha}
                        onChange={ (e)=> setSenha(e.target.value) }
                         />

                    <button className='btnLogar'>
                        Logar
                    </button>
                </div>

            </form>

        </div>
    );
}