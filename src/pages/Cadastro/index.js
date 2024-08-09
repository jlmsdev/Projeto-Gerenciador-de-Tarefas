import Styles from './cadastro.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { auth } from '../../Connection/firebaseConnection';
import { createUserWithEmailAndPassword,  } from 'firebase/auth';




export default function Cadastro() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const urlAtual = window.location.href;
    const urlCadastro = urlAtual.endsWith('/cadastro');

    const navigate = useNavigate();


    async function autenticarUsuario(e) {
        e.preventDefault();
        
        if(email === '' || senha === '') {
            toast.error('E-mail ou senha em branco!');
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
        <div className={Styles.containerLogin}>
            
            <form onSubmit={autenticarUsuario} className={Styles.form}>

                <div className={Styles.links}>
                    <Link to='/' className={Styles.login}>Login</Link>
                    <Link to='/cadastro' className={ urlCadastro === true ? Styles.linkAtivo: Styles.loginAtivo}>Cadastre-se</Link>
                </div>

                <div className={Styles.textForm}>
                    <h1>Tasker<span className='brand'>JLMS</span> </h1>
                    <p>Faça seu cadastro rápido e simples.</p>
                </div>
                

                <div className={Styles.boxForm}>
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

                    <button type='submit'>
                        Cadastrar
                    </button>

                </div>

            </form>

        </div>
    );
}