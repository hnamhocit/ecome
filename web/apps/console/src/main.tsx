import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { AuthProvider } from "@workspace/auth"
import { ThemeProvider } from "./context/ThemeContext"

import "./index.css"
import App from "./App"

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8080"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider baseURL={API_BASE_URL}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
