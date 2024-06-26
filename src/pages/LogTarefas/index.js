import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Styles from './logs.module.css';
import { useEffect, useState } from 'react';
import { db } from '../../Connection/firebaseConnection';
import { 
    collection,
    onSnapshot,
    orderBy,
    query
} from 'firebase/firestore';


export default function LogTarefas() {
    const [log, setLog] = useState([]);

    useEffect(() => {
        function carregaLogTarefa() {
            const listaRef = collection(db, "tarefaExcluida");
            const queryBusca = query(listaRef, orderBy('created', 'desc'));

            onSnapshot(queryBusca, (snapshot) => {
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        email: doc.data()?.email,
                        tarefa: doc.data()?.tarefa,
                        criacao: doc.data()?.created
                    });
                });
                setLog(lista.slice(0, 10));
            })
        }

        carregaLogTarefa();
    })

    return(
        <>
           <Header />
            <main className={Styles.mainLog}>
                <Sidebar />
                
                <div className={Styles.listaLogs}>
                {log.map((item) => (
                    <article key={item.id} className={Styles.item}>
                            <p>ID_LOG: {item.id}</p>
                            <p>EMAIL_LOG: {item.email}</p>
                            <p>TAREFA_CRIADA: {item.tarefa}</p>
                            <p>CREATED: {item.criacao}</p>

                    </article>
                ))}
                </div>
            </main>
           
        </>
    );
}