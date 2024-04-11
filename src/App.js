import './App.css';
import RoutesApp from './Routes/routes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
  return(
    <div className="App">
      <ToastContainer
        autoClose={900}
        limit={1}
      />
      <RoutesApp />
    </div>
  );
}