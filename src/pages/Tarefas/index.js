import "./tarefas.css";
import Header from "../../components/Header";
import Sidebar from '../../components/Sidebar'

import { FcClock } from "react-icons/fc";
import { CiSearch } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { FaTasks } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

import { toast } from 'react-hot-toast';
import { useState, useEffect, useMemo } from "react";
import {
  addDoc,
  collection,
  query,
  orderBy,
  doc,
  deleteDoc,
  where,
  updateDoc,
  getDoc,
  getDocs,
  onSnapshot
} from "firebase/firestore";
import { db, storage } from "../../Connection/firebaseConnection";

export default function Tarefas() {
  const [tarefa, setTarefa] = useState("");
  const [tituloTarefa, setTituloTarefa] = useState("");
  const [user, setUser] = useState({});
  const [listaTarefaPendente, setListaTarefaPendente] = useState([]);
  const [buscaItem, setBuscaItem] = useState("");
  const [inputEdicaoTarefa, setInputEdicaoTarefa] = useState("");
  const [tituloEdicaoTarefa, setTituloEdicaoTarefa] = useState("");
  const contadorCaracter = tarefa.length;
  const contadorPalavras = tarefa.split(" ").length;
  const [carregaTask, setCarregaTask] = useState(5);
  const [procura, setProcura] = useState('');
  const [arquivoUser, setArquivoUser] = useState([]);

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

    await addDoc(collection(db, "tarefa"), {
      tituloTarefa: tituloTarefa.toUpperCase(),
      tarefa: tarefa.toUpperCase(),
      created: new Date(),
      dataFormatada: dataFormatada,
      uid: user?.uid,
      email: user?.email,
      emailFormatado: user?.email.split("@")[0],
      urlArquivo: arquivoUser?.url || '',
      nomeArquivoOriginal: arquivoUser?.nomeOriginal || ''
    })
      .then(() => {
        setTarefa("");
        setTituloTarefa("");
        setTituloEdicaoTarefa("");
        setInputEdicaoTarefa("");
        toast.success("Tarefa registrada.");
      })
      .catch((err) => {
        toast.error(`Algo deu errado ${err}`);
      });
  }

  useEffect(() => {
    carregaTarefasPendentes();
  }, []);

  async function handleFile(e) {

    const arquivo = e.target.files[0];

    if(arquivo.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || arquivo.type === 'application/vnd.ms-excel,text/comma-separated-values' || arquivo.type === 'image/png' || arquivo.type === 'image/jpg'){
        await subirArquivo(arquivo)
        .then(() => {
        console.log('Upado com sucesso');
      })

    }else {
      alert('Formato de Envio invalido.');
      return;
    }


  }

  async function subirArquivo(arquivo) {
    if(!user?.uid) {
      return;
    }

    const currentUid = user?.uid;
    const uidArquivo = uuidv4();

    const uploadRef = ref(storage, `arquivoUsuario/${currentUid}/${uidArquivo} - ${arquivo.name}`);

    uploadBytes(uploadRef, arquivo)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {

        const arquivoItem = {
          name: uidArquivo,
          uid: currentUid,
          url: downloadURL,
          nomeOriginal: arquivo.name
        }

        setArquivoUser(arquivoItem);

      })
    })
   

  }

  async function carregaTarefasPendentes() {
    const data = JSON.parse(localStorage.getItem("userDetail"));

    const listaRef = collection(db, "tarefa");

    const q = query(listaRef, orderBy('created', 'asc'), where('uid', '==', data?.uid));

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
          uid: doc.data().uid,
          urlArquivo: doc.data().urlArquivo,
          nomeArquivoOriginal: doc.data().nomeArquivoOriginal
        })

      })

      setListaTarefaPendente(lista);
      console.log(lista)
   })

    
  }


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
    const refDoc = doc(db, "tarefa", item.id);
    await deleteDoc(refDoc);
  }

  async function buscarTarefa(e) {
    e.preventDefault();

    if (buscaItem === "") {
      toast.error("Campo não pode ser vazio.");
      return;
    }

    const tarefaRef = doc(db, "tarefa", buscaItem);
    await getDoc(tarefaRef).then((snapshot) => {
      setTituloEdicaoTarefa(snapshot.data()?.tituloTarefa);
      setInputEdicaoTarefa(snapshot.data()?.tarefa);
    });
  }

  async function atualizaTarefa() {
    const tarefaRef = doc(db, "tarefa", buscaItem);
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

  function carregaTarefa() {
    setCarregaTask(carregaTask + 3);
  }

  function copiaTexto(tarefaNome) {
    navigator.clipboard.writeText(tarefaNome);
    toast.success('Tarefa copiada para area de transferência');
  }

  async function procuraTarefa() {
    if(procura === '') {
      carregaTarefasPendentes();
      return;
    }

    setListaTarefaPendente([]);

    const q = query(collection(db, "tarefa"), 
    where('tituloTarefa', '>=', procura.toUpperCase()),
    where('tituloTarefa', '<=', procura.toUpperCase() + '\uf8ff')
  )

  const querySnapshot = await getDocs(q)

  
  let lista = [];
  querySnapshot.forEach((doc) => {
      
      lista.push({
        id: doc.id,
        tituloTarefa: doc.data().tituloTarefa,
        tarefa: doc.data()?.tarefa,
        email: doc.data()?.email,
        uid: doc.data()?.uid,
        dataFormatada: doc.data()?.dataFormatada,
        emailFormatado: doc.data()?.emailFormatado,
      });
      
  })
  setListaTarefaPendente(lista)
  

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
                placeholder="Para Começar digite o Titulo para esta tarefa com pelo menos 4 letras."
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
                  <div className="ttTarefa">
                    Se Precisar Anexe um arquivo para esta tarefa.
                  </div>
                  <input type="file" onChange={handleFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,text/comma-separated-values, text/csv, application/csv, image/*" />
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
                    placeholder="Clique no ID da tarefa para editar e na lupa para trazer a tarefa."
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
                      placeholder="Edite o titulo da sua tarefa."
                      value={tituloEdicaoTarefa}
                      onChange={(e) => setTituloEdicaoTarefa(e.target.value)}
                    />

                    <textarea
                      className="inputEdicaoTarefa"
                      placeholder="Edite o objetivo da sua tarefa."
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
              <h2>Tarefas Pendentes ({totalTarefasPendentes}) <span className="ttTarefa">Mostrando {totalTarefasPendentes} Tarefas</span></h2>

              <div className="boxBuscaTarefa">
                  <input type="text" 
                    placeholder="Digite o nome da tarefa para procurar"
                    value={procura}
                    onChange={ (e) => setProcura(e.target.value)}
                    className=""
                  />
                  <button onClick={procuraTarefa}>Buscar</button>
              </div>
            </>


            
           ) }
            {listaTarefaPendente.length === 0 && (
              <span>Não existem tarefas pendentes.</span>
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

                  {
                    item.nomeArquivoOriginal !== "" && item.urlArquivo !== "" && (
                      <span className="criacaoTarefaUser">
                        <a className="criacaoTarefaUser" href={item.urlArquivo}>Baixar Anexo - {item.nomeArquivoOriginal}</a>
                      </span>
                    )
                  }


                  <div className="areaButtons">
                    <button
                      className="btnConcluir"
                      onClick={() => concluiExcluiTarefa(item)}
                    >
                      Concluir
                    </button>

                    <p className="hashTarefa">
                      <a href="#id" onClick={() => capturaID(item.id)}>
                        ID tarefa: {item.id}
                      </a>
                    </p>
                  </div>
                </details>
              ))}
                {listaTarefaPendente.length > 3 && (
                  <button className='btnCarregaTarefa red' onClick={carregaTarefa}>Carregar Mais</button>
                )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
