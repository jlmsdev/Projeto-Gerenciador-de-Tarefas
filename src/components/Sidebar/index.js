import { Link } from 'react-router-dom';
import './sidebar.css';
import { GrTask } from "react-icons/gr";



export default function Sidebar() {
    return(
        <section className="containerSidebar">
            <nav className='nav'>
            <Link to='/tarefas'>
                    <GrTask className='iconeTarefa'  size={40} color='#cecece'/>
                    Tarefas Pendentes
                </Link>
                <Link to='/tarefas/TarefasConcluidas'>
                    <GrTask className='iconeTarefa'  size={40} color='#cecece'/>
                    Tarefas Concluidas
                </Link>
            </nav>
        </section>
    )
}