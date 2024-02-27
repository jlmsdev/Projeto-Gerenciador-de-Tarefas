import './erro.css';

import { Link } from 'react-router-dom';
import { FcEngineering } from "react-icons/fc";



export default function Erro() {
    return(
        <div className="containerErro">
            <h1>
                404
                
            </h1>
            <h2>
                Ops... esta página não existe.
            </h2>
            <FcEngineering size={150}/>

            <Link to='/tarefas'>
                Voltar para Tarefas
            </Link>
        </div>
    )
}