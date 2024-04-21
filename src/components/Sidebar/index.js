import { Link } from 'react-router-dom';
import { GrTask } from "react-icons/gr";
import { TbAlertHexagon } from "react-icons/tb";
import Styles from './sidebar.module.css'




export default function Sidebar() {

    const urlAtual = window.location.href;
    const urlTarefas = urlAtual.endsWith('tarefas');
    const urlConcluido = urlAtual.endsWith('TarefasConcluidas');

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
                </nav>
            </section>
        </>
    )
}