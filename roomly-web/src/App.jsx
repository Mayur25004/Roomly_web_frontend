import { useState } from 'react'


import {BrowserRouter,Route,Routes,Navigate} from "react-router-dom"

import MainLayout from './layouts/MainLayout.jsx'
import Rooms from './pages/Rooms.jsx' 
function Login() {
  return<h1>Roomly Login</h1>
}


function App() {
 return (
  <BrowserRouter>
    <Routes>
      <Route path ="/" element = {<Navigate to= "/login" replace />}/>
      <Route path ="/login" element = {<Login/>}/>
      <Route element = {<MainLayout/>}>
        <Route path ="/rooms" element = {<Rooms/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
 )
}

export default App
