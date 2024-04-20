import './tarefasConcluidas.css';
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import { FcClock } from "react-icons/fc";
import { BiTask } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { toast } from 'react-toastify';

import { useState, useEffect, useMemo } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc, deleteDoc
} from "firebase/firestore";
import { db } from "../../Connection/firebaseConnection";



export default function TarefasConcluidas() {
    const [listaTarefaConcluida, setListaTarefaConcluida] = useState([]);
    const hashValidator = "VCGwgfv6GdOn7KSH1dJWgAHUm9U2";

    useEffect(() => {
        async function carregaTarefasConcluidas() {
          const data = JSON.parse(localStorage.getItem("userDetail"));
          const listaRef = collection(db, "tarefaExcluida");
          const queryBusca = query(
            listaRef,
            orderBy("endTask", "desc"),
            where("uid", "==", data?.uid)
          );
    
          onSnapshot(queryBusca, (snapshot) => {
            let lista = [];
    
            snapshot.forEach((doc) => {
              lista.push({
                id: doc.id,
                tituloTarefa: doc.data()?.tituloTarefa,
                tarefa: doc.data()?.tarefa,
                created: doc.data()?.created,
                endTask: doc.data()?.endTask,
                email: doc.data()?.email,
                uid: doc.data()?.uid,
                emailFormatado: doc.data()?.emailFormatado,
              });
            });
            setListaTarefaConcluida(lista);
          });
        }
        carregaTarefasConcluidas();
      }, []);

      async function excluiTarefaDefinitivo(id) {
        const refDoc = doc(db, "tarefaExcluida", id);
        await deleteDoc(refDoc)
          .then(() => {
            toast.warn("Tarefa excluida com Sucesso");
          })
          .catch((err) => {
            console.log(`Ops algo deu errado ${err}`);
          });
      }

      const totalTarefasConcluidas = useMemo(() => {
        return listaTarefaConcluida.length;
      }, [listaTarefaConcluida]);
    

    return(
        <>
            <Header />
            <div className="containerApp">
                <Sidebar />
                <div className='containerTarefasConcluidas'>
                    <div className="tarefasConcluidas">
                    <h2>Tarefas Concluidas ({totalTarefasConcluidas})</h2>

                    {listaTarefaConcluida.length === 0 && (
                    <span>Não existem tarefas Concluidas.</span>
                    )}

                    <div className="boxTarefasConcluidas">
                    {listaTarefaConcluida.map((item) => (
                        <div className="cardTarefa etiquetaConcluida" key={item.id}>
                        <p className="tituloTarefa">
                            <FaTasks className="iconTask" size={23} />{" "}
                            {item.tituloTarefa}
                        </p>
                        <p className="nomeTarefa">
                            <BiTask size={25} />
                        </p>
                        <p className="nomeTarefa">{item.tarefa}</p>

                        <span className="criacaoTarefaTime">
                            Criado em:
                            <time>{item.created}</time>
                            <FcClock size={20} className="iconClock" />
                        </span>
                        <span className="criacaoTarefaTime">
                            Terminada em:
                            <time>{item.endTask}</time>
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
                            {item.uid === hashValidator && (
                            <button
                                className="btnConcluir excluir"
                                onClick={() => excluiTarefaDefinitivo(item.id)}
                            >
                                Excluir tarefa definitiva
                            </button>
                            )}
                        </div>
                        </div>
                    ))}
                    </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}