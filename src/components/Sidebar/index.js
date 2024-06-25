import { Link } from 'react-router-dom';
import { GrTask } from "react-icons/gr";
import { TbAlertHexagon, TbLogs } from "react-icons/tb";
import Styles from './sidebar.module.css';
import { useEffect, useState } from 'react';




export default function Sidebar() {

    const urlAtual = window.location.href;
    const urlTarefas = urlAtual.endsWith('tarefas');
    const urlConcluido = urlAtual.endsWith('TarefasConcluidas');
    const logTarefa = urlAtual.endsWith('logTarefasCriadas');
    const idValid = 'VCGwgfv6GdOn7KSH1dJWgAHUm9U2';
    const [user, setUser] = useState({});

    useEffect(() => {
        setUser(
            JSON.parse(localStorage.getItem('userDetail'))
        )
    }, [])

    return(
        <>
            <section className={Styles.containerSidebar}>
                <nav className={Styles.nav}>
                    <Link to='/tarefas' className={ urlTarefas === true ? Styles.linkAtivo : '' }>
                        <TbAlertHexagon className='iconeTarefa'  size={25} color='#cecece'/>
                        Tarefas Pendentes
                    </Link>
                    <Link to='/tarefas/TarefasConcluidas' className={ urlConcluido === true ? Styles.linkAtivo : '' }>
                        <GrTask className='iconeTarefa'  size={25} color='#cecece'/>
                        Tarefas Concluidas
                    </Link>
                    {user.uid === idValid && (
                        <Link to='/tarefas/logTarefasCriadas' className={ logTarefa === true ? Styles.linkAtivo : '' }>
                            <TbLogs className='iconeTarefa'  size={25} color='#cecece'/>
                            Log Tarefas
                        </Link>
                    )}
                </nav>
            </section>
        </>
    )
}