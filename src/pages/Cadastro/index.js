import './cadastro.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth } from '../../Connection/firebaseConnection';
import { createUserWithEmailAndPassword,  } from 'firebase/auth';




export default function Cadastro() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const navigate = useNavigate();


    async function autenticarUsuario(e) {
        e.preventDefault();
        
        if(email === '' || senha === '') {
            toast.warn('E-mail ou senha em branco!');
            return;
        }

        await createUserWithEmailAndPassword(auth, email, senha)
        .then(() => {
            navigate('/tarefas', {replace: true})
            toast.success('Registrado com sucesso.');
        })
        .catch((err) => {
            toast.info(`Algo deu errado.`);
        })
    }

    return(
        <div className='containerLogin'>
            
            <form onSubmit={autenticarUsuario} className='boxLogin'>

                <h1>Board Tarefas</h1>
                <h2>Faça seu cadastro rápido e simples.</h2>

                <div className='areaInput'>
                    <input type="text"
                        placeholder='Digite um e-mail válido'
                        value={email}
                        onChange={ (e)=> setEmail(e.target.value) }
                    />

                    <input type="password"
                        placeholder='Crie uma senha, minimo 4 digitos.'
                        value={senha}
                        onChange={ (e)=> setSenha(e.target.value) }
                         />

                    <button className='btnCadastrar'>
                        Cadastrar
                    </button>

                    <span className='msgCad'>
                        Já possui cadastro ?
                        <Link to='/'>
                            Faça login
                        </Link>
                    </span>
                </div>

            </form>

        </div>
    );
}