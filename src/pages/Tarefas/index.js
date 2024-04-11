import './tarefas.css';
import Header from '../../components/Header'

import { FcClock } from "react-icons/fc";
import { CiSearch } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";

import { toast } from 'react-toastify';
import { useState, useEffect, useMemo } from 'react';
import { addDoc, collection, onSnapshot, query, orderBy, doc, deleteDoc, where, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../Connection/firebaseConnection';

export default function Tarefas() {
    const [tarefa, setTarefa] = useState('');
    const [tituloTarefa, setTituloTarefa] = useState('');
    const [user, setUser] = useState({});
    const [listaTarefaPendente, setListaTarefaPendente] = useState([]);
    const [listaTarefaConcluida, setListaTarefaConcluida] = useState([]);
    const [buscaItem, setBuscaItem] = useState('');
    const [inputEdicaoTarefa, setInputEdicaoTarefa] = useState('');
    const [tituloEdicaoTarefa, setTituloEdicaoTarefa] = useState('');
    const contadorCaracter = tarefa.length;
    const contadorPalavras = tarefa.split(' ').length;
    const hashValidator = 'VCGwgfv6GdOn7KSH1dJWgAHUm9U2';



    useEffect(() => {
        setUser(
            JSON.parse(localStorage.getItem('userDetail'))
        );
    }, [user.email])

    


    async function cadastraTarefa(e) {
        e.preventDefault();

        let dataAtual = new Date();
        let dataFormatada = `${dataAtual.toLocaleDateString()} ${dataAtual.toLocaleTimeString()}`;

        if(tarefa === '') {
            toast.info('Preencha com uma tarefa.');
            return;
        }

        await addDoc( collection(db, 'tarefa'), {
            tituloTarefa: tituloTarefa,
            tarefa: tarefa,
            created: new Date(),
            dataFormatada: dataFormatada,
            uid: user?.uid,
            email: user?.email,
            emailFormatado: user?.email.split('@')[0]
        })
        .then(() => {
            toast.success('Tarefa registrada.');
            setTarefa('');
            setTituloTarefa('');
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
                        tituloTarefa: doc.data()?.tituloTarefa,
                        tarefa: doc.data()?.tarefa,
                        email: doc.data()?.email,
                        uid: doc.data()?.uid,
                        dataFormatada: doc.data()?.dataFormatada,
                        emailFormatado: doc.data()?.emailFormatado
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
            const queryBusca = query(listaRef, orderBy('endTask', 'desc'), where('uid', '==', data?.uid) );

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
                        emailFormatado: doc.data()?.emailFormatado
                    })
                })
                setListaTarefaConcluida(lista);
            })
        }
        carregaTarefasConcluidas();
    }, [])

    async function concluiExcluiTarefa(item) {
        /**resgatando as tarefas pelo parametro e gravando elas em outra colecao */
        let dataAtual = new Date();
        let dataFormatada = `${dataAtual.toLocaleDateString()} ${dataAtual.toLocaleTimeString()}`;

        await addDoc( collection(db, 'tarefaExcluida'), {
            tituloTarefa: item.tituloTarefa,
            tarefa: item.tarefa,
            created: item.dataFormatada,
            endTask: dataFormatada,
            uid: item?.uid,
            email: item?.email,
            emailFormatado: item?.email.split('@')[0]
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

    async function buscarTarefa(e) {
        e.preventDefault();

        if(buscaItem === '') {
            toast.warn('Campo não pode ser vazio.');
            return;
        }

        const tarefaRef = doc(db, 'tarefa', buscaItem)
        await getDoc(tarefaRef)
        .then((snapshot) => {
            setTituloEdicaoTarefa(snapshot.data()?.tituloTarefa);
            setInputEdicaoTarefa(snapshot.data()?.tarefa);
        })
    }


    async function atualizaTarefa() {
        const tarefaRef = doc(db, 'tarefa', buscaItem);
        await updateDoc(tarefaRef, {
            tituloTarefa: tituloEdicaoTarefa,
            tarefa: inputEdicaoTarefa
        })
        .then(() => {
            setBuscaItem('');
            setInputEdicaoTarefa('');
            setTituloEdicaoTarefa('');
            toast.success('Tarefa Editada.')
        })
        .catch((err) => {
            toast.error(`Algo deu errado ${err}`);
        })
    }

    function capturaID(id) {
        setBuscaItem(id);
    }


    function limpaCamposInput() {
        setBuscaItem('');
        setInputEdicaoTarefa('');
        setTituloEdicaoTarefa();
    }

    const totalTarefasPendentes = useMemo(() => {
        return listaTarefaPendente.length;
    }, [listaTarefaPendente]);

    const totalTarefasConcluidas = useMemo(() => {
        return listaTarefaConcluida.length;
    }, [listaTarefaConcluida]);

    return(
        <>
            <Header />

            <main className='containerBoard roboto-regular'>

                <div className='tarefasPendentes'>

                    <form onSubmit={cadastraTarefa} className='boxForm'>
                        <input type="text" 
                            placeholder='Para Começar digite o Titulo para esta tarefa.'
                            required
                            value={tituloTarefa}
                            onChange={ (e) => setTituloTarefa(e.target.value) }
                        />
                        {tituloTarefa.length > 0 && (
                            <>
                                <textarea 
                                placeholder='Digite o objetivo desta tarefa.'
                                value={tarefa}
                                onChange={ (e)=> setTarefa(e.target.value) }
                                required
                                />
                                <button className='btnCadastraTarefa' type='submit'>
                                    Cadastrar tarefa
                                </button>
                                <div className='contadorCaracter'>
                                    Palavras: {tarefa.length === 0 ? (0): (contadorPalavras)} | Letras: {contadorCaracter}
                                </div>
                            </>
                        )}
                    </form>

                    {listaTarefaPendente.length > 0 && (
                        <form className='boxFormEditTarefa' onSubmit={buscarTarefa}>

                            <div className='boxInputEdit'>
                                <input type="text"
                                placeholder='Clique no ID da tarefa para editar e na lupa para trazer a tarefa.'
                                value={buscaItem}
                                onChange={ (e) => setBuscaItem(e.target.value)}
                                disabled
                                />
                                <button type='submit' className='btnSearchTask'>
                                    <CiSearch  size={25} color='#0069d9' className='btnSearchIcon'/>
                                </button>
                                <a href='#limpaCampo' className='btnLimpaInput' onClick={limpaCamposInput}>
                                    <MdClose size={25} color='#0069d9' className='btnCloseIcon' />
                                </a>
                            </div>

                            {buscaItem.length >= 15 && (
                                <>
                                        <input type="text"
                                            className='titleInputTarefa'
                                            placeholder='Edite o titulo da sua tarefa.'
                                            value={tituloEdicaoTarefa}
                                            onChange={ (e) => setTituloEdicaoTarefa(e.target.value) }
                                        />

                                        <textarea className='inputEdicaoTarefa'
                                        placeholder='Edite o objetivo da sua tarefa.'
                                        value={inputEdicaoTarefa}
                                        onChange={ (e) => setInputEdicaoTarefa(e.target.value)}
                                    />

                                    <a href="#atualizarTarefa" onClick={atualizaTarefa} className='atualizaTarefa'>
                                        Atualizar
                                    </a>
                                </>
                            )}
                    </form>
                    )}

                    <h2>Tarefas Pendentes ({totalTarefasPendentes})</h2>

                    {listaTarefaPendente.length === 0 && (<span>Não existem tarefas pendentes.</span>)}


                    <div className='boxTarefasPendentes'>
                        {listaTarefaPendente.map((item) => (
                            
                            <div className='cardTarefa etiquetaPendente' key={item.id}>
                                <p className='tituloTarefa'> <FaTasks className='iconTask' size={23}/> {item.tituloTarefa}</p>
                                <p className='nomeTarefa'><BiTask size={25}/></p>
                                <p className='nomeTarefa'> {item.tarefa}</p>

                                <span className='criacaoTarefaTime'>
                                    Criado em: 
                                    <time>{item.dataFormatada}</time>
                                    <FcClock size={20} className='iconClock'/>
                                </span>
                                <span className='criacaoTarefaUser'>
                                    <p>Criado por: {item.emailFormatado === undefined ? (item.email) : (item.emailFormatado)}</p>
                                </span>

                                <div className='areaButtons'>
                                    <button className='btnConcluir' onClick={() => concluiExcluiTarefa(item)}>
                                        Concluir
                                    </button>

                                    <p className='hashTarefa'>
                                        <a href="#id" onClick={() => capturaID(item.id)}>
                                         ID tarefa: {item.id}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    

                </div>

                <div className='tarefasConcluidas'>
                    <h2>Tarefas Concluidas ({totalTarefasConcluidas})</h2>

                    {listaTarefaConcluida.length === 0 && (<span>Não existem tarefas Concluidas.</span>)}

                    <div className='boxTarefasConcluidas'>
                        {listaTarefaConcluida.map((item) => (
                            <div className='cardTarefa etiquetaConcluida' key={item.id}>
                                <p className='tituloTarefa'><FaTasks className='iconTask' size={23}/> {item.tituloTarefa}</p>
                                <p className='nomeTarefa'><BiTask size={25}/></p>
                                <p className='nomeTarefa'>{item.tarefa}</p>

                                <span className='criacaoTarefaTime'>
                                    Criado em: 
                                    <time>{item.created}</time>
                                    <FcClock size={20} className='iconClock'/>
                                </span>
                                <span className='criacaoTarefaTime'>
                                    Terminada em: 
                                    <time>{item.endTask}</time>
                                    <FcClock size={20} className='iconClock'/>
                                </span>

                                <span className='criacaoTarefaUser'>
                                    <p>Criado por: {item.emailFormatado === undefined ? (item.email) : (item.emailFormatado)}</p>
                                </span>

                                <div className='areaButtons'>
                                    {item.uid === hashValidator && (
                                        <button className='btnConcluir excluir' onClick={ () => excluiTarefaDefinitivo(item.id) }>
                                            Excluir tarefa definitiva
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    
                </div>
            </main>
        </>
    );
}
