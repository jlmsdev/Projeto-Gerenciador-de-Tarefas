import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Tarefas from "../pages/Tarefas";
import Private from "./Private";

export default function RoutesApp() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Login /> }/>
                <Route path="/cadastro" element={ <Cadastro /> }/>
                <Route path="/Tarefas" element={ <Private> <Tarefas /> </Private> }/>
            </Routes>
        </BrowserRouter>
    );
}