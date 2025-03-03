import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'
import "./style.css";
import { JwtProvider } from "./providers/JwtProvider.tsx";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_ROOT;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <JwtProvider>
        <App />
      </JwtProvider>
    </Router>
  </StrictMode>,
)
