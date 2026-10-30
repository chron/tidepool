import { LoginPage } from "./pages/LoginPage"
import { StandupsPage } from "./pages/StandupsPage"
import { useSession } from "./session/SessionProvider"

export function App() {
  const { state } = useSession()

  if (state.status === "loading") return <div className="splash">Loading…</div>
  if (state.status === "signed-out") return <LoginPage />
  return <StandupsPage session={state.session} />
}
