import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css' 
import "react-datepicker/dist/react-datepicker.css";
import Abonnements from './Abonnements'
import AjouterAbonnement from './AjouterAbonnement'
import MettreAjourAbonnement from './MettreAjourAbonnement'
import Enregistrement from './Enregistrement'
import Connexion from './Connexion'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Enregistrement />}></Route>
            <Route path='/login' element={<Connexion />}></Route>
            <Route path='/dashboard' element={<Abonnements />}></Route>
            <Route path='/create' element={<AjouterAbonnement />}></Route>
            <Route path='/update/:id' element={<MettreAjourAbonnement />}></Route>
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
