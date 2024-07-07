import '../styles/App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css' 
import "react-datepicker/dist/react-datepicker.css";
import Abonnements from '../composants/Abonnements'
import AjouterAbonnement from '../composants/AjouterAbonnement'
import MettreAjourAbonnement from '../composants/MettreAjourAbonnement'
import Enregistrement from '../composants/Enregistrement'
import Connexion from '../composants/Connexion'
import ResetPassword from '../composants/ResetPassword'


function App() {

  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Enregistrement />}></Route>
            <Route path='/login' element={<Connexion />}></Route>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path='/dashboard' element={<Abonnements />}></Route>
            <Route path='/create' element={<AjouterAbonnement />}></Route>
            <Route path='/update/:id' element={<MettreAjourAbonnement />}></Route>
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
