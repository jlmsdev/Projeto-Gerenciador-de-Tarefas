import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { FaTasks } from 'react-icons/fa'
import { BiTask } from 'react-icons/bi'
import { FcClock } from 'react-icons/fc'

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
    const [carregaTask, setCarregaTask] = useState(10);
    const [contadorTarefas, setContadorTarefas] = useState([]);

    useEffect(() => {
        function carregaLogTarefa() {
            const listaRef = collection(db, "tarefaExcluida");
            const queryBusca = query(listaRef);

            onSnapshot(queryBusca, (snapshot) => {
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        email: doc.data()?.email,
                        tarefa: doc.data()?.tarefa,
                        criacao: doc.data()?.created,
                        tituloTarefa: doc.data()?.tituloTarefa,
                        conclusaoTarefa: doc.data()?.dataTarefaConcluida
                        
                    });
                });
                setLog(lista.slice(0, carregaTask));
                setContadorTarefas(lista.length)
                
            })
            
        }

        carregaLogTarefa();
    })

    function carregaTarefa() {
        setCarregaTask(carregaTask + 10);
      }

    return(
        <>
      <Header />

      <div className="containerApp">
        <Sidebar />
        
        <main className="containerBoard roboto-regular">
          <div className="tarefasPendentes">


            <div className="boxTarefasPendentes">
                <h2>Tarefas Pendentes ({log.length}) <span className="ttTarefa">Mostrando {log.length} de {contadorTarefas} Tarefas</span></h2>

              {log.map((item) => (
                <details className="cardTarefa etiquetaPendente" key={item.id}>
                  <summary className="tituloTarefa">
                    <div>
                      {" "}
                      <FaTasks className="iconTask" size={23} />{" "}
                      {item.tituloTarefa}
                    </div>
                    
                    <div>
                      <span className="titleCreate">Criação: {item.criacao}</span>
                    </div>
                  </summary>
                  <p className="nomeTarefa">
                    <BiTask size={25} />
                  </p>
                  <p className="nomeTarefa" > {item.tarefa}</p>

                  <span className="criacaoTarefaTime">
                    Criado em:
                    <time>{item.criacao}</time>
                    <FcClock size={20} className="iconClock" />
                  </span>
                  <span className="criacaoTarefaUser">
                    <p>
                      Criado por:{" "}
                      {item.emailFormatado === undefined
                        ? item.email
                        : item.emailFormatado}
                    </p>
                  </span>


                  <div className="areaButtons">

                    <p className="hashTarefa">
                      <a href="#id">
                        ID tarefa: {item.id}
                      </a>
                    </p>
                  </div>
                </details>
              ))}
                {log.length > 3 && (
                  <button className='btnCarregaTarefa red' onClick={carregaTarefa}>Carregar Mais</button>
                )}
            </div>
          </div>
        </main>
      </div>
    </>
    );
}