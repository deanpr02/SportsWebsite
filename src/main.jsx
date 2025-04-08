import { StrictMode } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'
import Home from './Components/MainView/Home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}/>
        <Route path="/home/*" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
