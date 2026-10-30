import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import { SessionProvider } from "./session/SessionProvider"
import "./styles.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <App />
    </SessionProvider>
  </StrictMode>,
)
