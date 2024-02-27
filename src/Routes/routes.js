import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Tarefas from "../pages/Tarefas";
import Private from "./Private";
import Erro from "../pages/Erro";

export default function RoutesApp() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <Login /> }/>
                <Route path="/Tarefas" element={ <Private> <Tarefas /> </Private> }/>


                <Route path="*" element={ <Erro /> }/>
            </Routes>
        </BrowserRouter>
    );
}