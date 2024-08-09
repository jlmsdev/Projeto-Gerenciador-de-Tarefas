import { useState } from 'react';
import Styles from './login.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { auth } from '../../Connection/firebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Footer from '../../components/Footer';


export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const navigate = useNavigate();


    async function autenticarUsuario(e) {
        e.preventDefault();
        
        if(email === '' || senha === '') {
            toast.error('E-mail ou senha em branco!');
            return;
        }

        await signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
            navigate('/tarefas', {replace: true})
            toast.success('Bem Vindo!');
        })
        .catch((err) => {
            toast.error(`E-mail ou senha incorretos!`);
        })
    }

    return(
        <div className={Styles.containerLogin}>
            
            <form onSubmit={autenticarUsuario} className={Styles.form}>

                <div className={Styles.links}>
                    <Link to='/' className={ Styles.linkAtivo }>Login</Link>
                    <Link to='/cadastro' className={Styles}>Cadastre-se</Link>
                </div>

                <div className={Styles.textForm}>
                    <h1>Tasker<span className='brand'>JLMS</span> </h1>
                    <p>Organize suas tarefas de maneira simples.</p>
                </div>

                <div className={Styles.boxForm}>
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

                    <button type='submit'>
                        Entrar
                    </button>
                </div>
            </form>

            <Footer />
        </div>
    );
}