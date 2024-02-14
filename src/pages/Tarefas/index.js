import './tarefas.css';
import Header from '../../components/Header'
import { FcClock } from "react-icons/fc";
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { addDoc, collection, onSnapshot, query, orderBy, doc, deleteDoc, where } from 'firebase/firestore'
import { db } from '../../Connection/firebaseConnection';

export default function Tarefas() {
    const [tarefa, setTarefa] = useState('');
    const [user, setUser] = useState({});
    const [listaTarefaPendente, setListaTarefaPendente] = useState([]);
    const [listaTarefaConcluida, setListaTarefaConcluida] = useState([]);
    const contadorListaPendente = listaTarefaPendente.length;
    const contadorListaConcluido = listaTarefaConcluida.length;

    useEffect(() => {
        setUser(
            JSON.parse(localStorage.getItem('userDetail'))
        );
    }, [])
   



    async function cadastraTarefa(e) {
        e.preventDefault();

        let dataAtual = new Date();
        let dataFormatada = `${dataAtual.toLocaleDateString()} ${dataAtual.toLocaleTimeString()}`;

        if(tarefa === '') {
            toast.info('Preencha com uma tarefa.');
            return;
        }

        await addDoc( collection(db, 'tarefa'), {
            tarefa: tarefa,
            created: new Date(),
            dataFormatada: dataFormatada,
            uid: user?.uid,
            email: user?.email
        })
        .then(() => {
            toast.success('Tarefa registrada.');
            setTarefa('');
        })
        .catch((err) => {
            console.log(`Algo deu errado: ${err}`);
        });
    }

    useEffect(() => {
        async function carregaTarefasPendentes() {
            const data = JSON.parse(localStorage.getItem('userDetail'))
            const listaRef = collection(db, 'tarefa');

            const queryBusca = query(listaRef, orderBy('created', 'asc'), where('uid', '==', data?.uid ) );

    
            onSnapshot(queryBusca, (snapshot) => {
                let lista = [];
    
                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        tarefa: doc.data()?.tarefa,
                        email: doc.data()?.email,
                        uid: doc.data()?.uid,
                        dataFormatada: doc.data()?.dataFormatada
                    })
                })
                setListaTarefaPendente(lista);
            })
        }
        carregaTarefasPendentes();
    }, [])

    useEffect(() => {
        async function carregaTarefasConcluidas() {
            const data = JSON.parse(localStorage.getItem('userDetail'))
            const listaRef = collection(db, 'tarefaExcluida');
            const queryBusca = query(listaRef, orderBy('created', 'desc'), where('uid', '==', data?.uid) );

            onSnapshot(queryBusca, (snapshot) => {
                let lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        tarefa: doc.data()?.tarefa,
                        created: doc.data()?.created,
                        email: doc.data()?.email,
                        uid: doc.data()?.uid
                    })
                })
                setListaTarefaConcluida(lista);
            })
        }
        carregaTarefasConcluidas();
    }, [])

    async function concluiExcluiTarefa(item) {
        /**resgatando as tarefas pelo parametro e gravando elas em outra colecao */

        await addDoc( collection(db, 'tarefaExcluida'), {
            tarefa: item.tarefa,
            created: item.dataFormatada,
            uid: item?.uid,
            email: item?.email
        })
        .then(() => {
            toast.success('Tarefa concluida.');
        })
        .catch((err) => {
            console.log(`Algo deu errado: ${err}`);
        });

        /**capturando id pelo parametro da funcao e excluindo da colecao tarefas */
        const refDoc = doc(db, 'tarefa', item.id);
        await deleteDoc(refDoc);
    }

    async function excluiTarefaDefinitivo(id) {
        const refDoc = doc(db, 'tarefaExcluida', id);
        await deleteDoc(refDoc)
        .then(() => {
            toast.warn('Tarefa excluida com Sucesso');
        })
        .catch((err) => {
            console.log(`Ops algo deu errado ${err}`);
        })
    }


    return(
        <>
            <Header />

            <main className='containerBoard roboto-regular'>

                <div className='tarefasPendentes'>

                    <form onSubmit={cadastraTarefa} className='boxForm'>
                        <textarea 
                            placeholder='Digite sua tarefa.'
                            value={tarefa}
                            onChange={ (e)=> setTarefa(e.target.value) }

                        />
                        <button className='btnCadastraTarefa' type='submit'>
                            Cadastrar tarefa
                        </button>
                    </form>

                    <h2>Tarefas Pendentes ({contadorListaPendente})</h2>

                    {listaTarefaPendente.length === 0 && (<span>Não existem tarefas pendentes.</span>)}

                    {listaTarefaPendente.map((item) => (
                        
                        <div className='cardTarefa' key={item.id}>
                            <p className='nomeTarefa'>{item.tarefa}</p>

                            <span className='criacaoTarefaTime'>
                                Criado em: 
                                <time>{item.dataFormatada}</time>
                                <FcClock size={20} className='iconClock'/>
                            </span>
                            <span className='criacaoTarefaUser'>
                                <p>Criado por: {item.email}</p>
                            </span>

                            <div className='areaButtons'>
                                <button className='btnConcluir' onClick={() => concluiExcluiTarefa(item)}>
                                    Concluir
                                </button>

                                <p className='hashTarefa'>
                                    ID tarefa: {item.id}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>

                <div className='tarefasConcluidas'>
                    <h2>Tarefas Concluidas ({contadorListaConcluido})</h2>

                    {listaTarefaConcluida.length === 0 && (<span>Não existem tarefas Concluidas.</span>)}

                    {listaTarefaConcluida.map((item) => (
                        <div className='cardTarefa' key={item.id}>
                            <p className='nomeTarefa'>{item.tarefa}</p>

                            <span className='criacaoTarefaTime'>
                                Criado em: 
                                <time>{item.created}</time>
                                <FcClock size={20} className='iconClock'/>
                            </span>
                            <span className='criacaoTarefaUser'>
                                <p>Criado por: {item.email}</p>
                            </span>

                            <div className='areaButtons'>
                                <button className='btnConcluir' onClick={ () => excluiTarefaDefinitivo(item.id) }>
                                    Excluir tarefa definitiva
                                </button>

                                <p className='hashTarefa'>
                                    ID Tarefa: {item.id}
                                </p>
                            </div>
                    </div>
                    ))}
                </div>
            </main>
        </>
    );
}
