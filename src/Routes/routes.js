import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Tarefas from "../pages/Tarefas";
import Private from "./Private";
import TarefasConcluidas from "../pages/tarefasConcluidas";
import LogTarefas from "../pages/LogTarefas";
import Query from "../pages/Query";
import Erro from "../pages/Erro";

export default function RoutesApp() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Login /> }/>
                <Route path="/cadastro" element={ <Cadastro /> }/>
                <Route path="/Tarefas" element={ <Private> <Tarefas /> </Private> }/>
                <Route path="/Tarefas/TarefasConcluidas" element={ <Private> <TarefasConcluidas /> </Private> }/>
                <Route path="/Tarefas/logTarefasCriadas" element={<Private><LogTarefas /></Private>}/>
                <Route path="/Tarefas/Query" element={<Private><Query /></Private>}/>


                <Route path="*" element={ <Erro /> }/>
            </Routes>
        </BrowserRouter>
    );
}