import './App.css';
import RoutesApp from './Routes/routes';

import { Toaster } from 'react-hot-toast';

export default function App() {
  return(
    <div className="App">
     <Toaster
      position='top-right'
      
     />

      <RoutesApp />
    </div>
  );
}