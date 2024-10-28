import "./query.module.css";
import Header from "../../components/Header";
import Sidebar from '../../components/Sidebar'

import { FcClock } from "react-icons/fc";
import { CiSearch } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";

import { toast } from 'react-hot-toast';
import { useState, useEffect, useMemo } from "react";
import {
  addDoc,
  collection,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "../../Connection/firebaseConnection";

export default function Query() {
  const [tarefa, setTarefa] = useState("");
  const [tituloTarefa, setTituloTarefa] = useState("");
  const [user, setUser] = useState({});
  const [listaTarefaPendente, setListaTarefaPendente] = useState([]);
  const [buscaItem, setBuscaItem] = useState("");
  const [inputEdicaoTarefa, setInputEdicaoTarefa] = useState("");
  const [tituloEdicaoTarefa, setTituloEdicaoTarefa] = useState("");
  const contadorCaracter = tarefa.length;
  const contadorPalavras = tarefa.split(" ").length;
  const [listaTotalTarefas, setListaTotalTarefas] = useState([]);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("userDetail")));
  }, [user.email]);

  async function cadastraTarefa(e) {
    e.preventDefault();

    let dataAtual = new Date();
    let dataFormatada = `${dataAtual.toLocaleDateString()} ${dataAtual.toLocaleTimeString()}`;

    if (tarefa === "") {
      toast.error("Preencha com uma tarefa.");
      return;
    }

    await addDoc(collection(db, "minhasQuerys"), {
      tituloTarefa: tituloTarefa.toUpperCase(),
      tarefa: tarefa.toUpperCase(),
      created: new Date(),
      dataFormatada: dataFormatada,
      uid: user?.uid,
      email: user?.email,
      emailFormatado: user?.email.split("@")[0],
    })
      .then(() => {
        setTarefa("");
        setTituloTarefa("");
        toast.success("Tarefa registrada.");
      })
      .catch((err) => {
        toast.error(`Algo deu errado ${err}`);
      });
  }

  useEffect(() => {
    async function carregaTarefasPendentes() {
      //const data = JSON.parse(localStorage.getItem("userDetail"));
      const listaRef = collection(db, "minhasQuerys");
  
      const q = query(listaRef, orderBy('created', 'desc'));
  
     onSnapshot(q, (snapshot) => {
      let lista = [];
  
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            email: doc.data().email,
            emailFormatado: doc.data().emailFormatado,
            dataFormatada: doc.data().dataFormatada,
            created: doc.data().created,
            tarefa: doc.data().tarefa,
            tituloTarefa: doc.data().tituloTarefa,
            uid: doc.data().uid
          })
  
        })
  
        setListaTarefaPendente(lista)
        setListaTotalTarefas(lista.length);
     })
  
    }
    carregaTarefasPendentes();
  });

  


  async function concluiExcluiTarefa(item) {
    /**resgatando as tarefas pelo parametro e gravando elas em outra colecao */
    let dataAtual = new Date();
    let dataFormatada = `${dataAtual.toLocaleDateString()} ${dataAtual.toLocaleTimeString()}`;

    await addDoc(collection(db, "tarefaExcluida"), {
      tituloTarefa: item.tituloTarefa,
      tarefa: item.tarefa,
      created: item.dataFormatada,
      endTask: dataFormatada,
      uid: item?.uid,
      email: item?.email,
      emailFormatado: item?.email.split("@")[0],
      dataTarefaConcluida: new Date()
    })
      .then(() => {
        toast.success("Tarefa concluida.");
      })
      .catch((err) => {
        toast.error(`Algo deu errado ${err}`);
      });

    /**capturando id pelo parametro da funcao e excluindo da colecao tarefas */
    const refDoc = doc(db, "minhasQuerys", item.id);
    await deleteDoc(refDoc);
  }

  async function buscarTarefa(e) {
    e.preventDefault();

    if (buscaItem === "") {
      toast.error("Campo não pode ser vazio.");
      return;
    }

    const tarefaRef = doc(db, "minhasQuerys", buscaItem);
    await getDoc(tarefaRef).then((snapshot) => {
      setTituloEdicaoTarefa(snapshot.data()?.tituloTarefa);
      setInputEdicaoTarefa(snapshot.data()?.tarefa);
    });
  }

  async function atualizaTarefa() {
    const tarefaRef = doc(db, "minhasQuerys", buscaItem);
    toast.success('Modo edição de tarefa.');
    await updateDoc(tarefaRef, {
      tituloTarefa: tituloEdicaoTarefa,
      tarefa: inputEdicaoTarefa,
    })
      .then(() => {
        setBuscaItem("");
        setInputEdicaoTarefa("");
        setTituloEdicaoTarefa("");
        toast.success("Tarefa Editada.");
      })
      .catch((err) => {
        toast.error(`Algo deu errado ${err}`);
      });
  }

  function capturaID(id) {
    setBuscaItem(id);
  }

  function limpaCamposInput() {
    setBuscaItem("");
    setInputEdicaoTarefa("");
    setTituloEdicaoTarefa("");
  }

  const totalTarefasPendentes = useMemo(() => {
    return listaTarefaPendente.length;
  }, [listaTarefaPendente]);

  function copiaTexto(tarefaNome) {
    navigator.clipboard.writeText(tarefaNome);
    toast.success('Query Copiada para seu Ctrl + C');
  }


  return (
    <>
      <Header />

      <div className="containerApp">
        <Sidebar />
        <main className="containerBoard roboto-regular">
          <div className="tarefasPendentes">
            <form onSubmit={cadastraTarefa} className="boxForm">
              <input
                type="text"
                placeholder="Para Começar digite o Titulo para esta query com pelo menos 4 letras."
                required
                value={tituloTarefa}
                onChange={(e) => setTituloTarefa(e.target.value)}
              />
              {tituloTarefa.length >= 4 && (
                <>
                  <textarea
                    placeholder="Digite o objetivo desta tarefa."
                    value={tarefa}
                    onChange={(e) => setTarefa(e.target.value)}
                    required
                  />
                  <button className="btnCadastraTarefa" type="submit">
                    Cadastrar tarefa
                  </button>
                  <div className="contadorCaracter">
                    Palavras: {tarefa.length === 0 ? 0 : contadorPalavras} |
                    Letras: {contadorCaracter}
                  </div>
                </>
              )}
            </form>

            {listaTarefaPendente.length > 0 && (
              <form className="boxFormEditTarefa" onSubmit={buscarTarefa}>
                <div className="boxInputEdit">
                  <input
                    type="text"
                    placeholder="Clique no ID da query para editar e na lupa para trazer a query."
                    value={buscaItem}
                    onChange={(e) => setBuscaItem(e.target.value)}
                    disabled
                  />
                  <button type="submit" className="btnSearchTask">
                    <CiSearch
                      size={25}
                      color="#0069d9"
                      className="btnSearchIcon"
                    />
                  </button>
                  <a
                    href="#limpaCampo"
                    className="btnLimpaInput"
                    onClick={limpaCamposInput}
                  >
                    <MdClose
                      size={25}
                      color="#0069d9"
                      className="btnCloseIcon"
                    />
                  </a>
                </div>

                {buscaItem.length >= 15 && (
                  <>
                    <input
                      type="text"
                      className="titleInputTarefa"
                      placeholder="Edite o titulo da sua query."
                      value={tituloEdicaoTarefa}
                      onChange={(e) => setTituloEdicaoTarefa(e.target.value)}
                    />

                    <textarea
                      className="inputEdicaoTarefa"
                      placeholder="Edite o objetivo da sua query."
                      value={inputEdicaoTarefa}
                      onChange={(e) => setInputEdicaoTarefa(e.target.value)}
                    />

                    <a
                      href="#atualizarTarefa"
                      onClick={atualizaTarefa}
                      className="atualizaTarefa"
                    >
                      Atualizar
                    </a>
                  </>
                )}
              </form>
            )}

           { listaTarefaPendente.length > 0 && ( 
            <>
              <h2>Querys ({totalTarefasPendentes}) <span className="ttTarefa">Mostrando {totalTarefasPendentes} de {listaTotalTarefas} Querys </span></h2>
            </>


            
           ) }
            {listaTarefaPendente.length === 0 && (
              <span>Não existem Querys na sua Lista.</span>
            )}

            <div className="boxTarefasPendentes">

              {listaTarefaPendente.map((item) => (
                <details className="cardTarefa etiquetaPendente" key={item.id}>
                  <summary className="tituloTarefa">
                    <div>
                      {" "}
                      <FaTasks className="iconTask" size={23} />{" "}
                      {item.tituloTarefa}
                    </div>
                    
                    <div>
                      <span className="titleCreate">Criação: {item.dataFormatada}</span>
                    </div>
                  </summary>
                  <p className="nomeTarefa">
                    <BiTask size={25} />
                  </p>
                  <p className="nomeTarefa" onClick={() => copiaTexto(item.tarefa)}> {item.tarefa}</p>

                  <span className="criacaoTarefaTime">
                    Criado em:
                    <time>{item.dataFormatada}</time>
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
                    <button
                      className="btnConcluir"
                      onClick={() => concluiExcluiTarefa(item)}
                    >
                      Excluir Query
                    </button>

                    <p className="hashTarefa">
                      <a href="#id" onClick={() => capturaID(item.id)}>
                        ID tarefa: {item.id}
                      </a>
                    </p>
                  </div>
                </details>
              ))}
                
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
