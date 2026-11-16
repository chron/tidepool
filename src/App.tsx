import { useEffect } from "react"
import { LoginPage } from "./pages/LoginPage"
import { StandupsPage } from "./pages/StandupsPage"
import { useSession } from "./session/SessionProvider"

declare global {
  interface Window {
    datumAnalytics?: {
      identify: (userId: string, traits: Record<string, string>) => void
      group: (groupId: string, traits: Record<string, string>) => void
    }
  }
}

export function App() {
  const { state } = useSession()

  useEffect(() => {
    if (state.status !== "signed-in") return

    const { user, team } = state.session
    window.datumAnalytics?.identify(user.id, {
      email: user.email,
      name: user.name,
      role: user.role,
      plan: team.plan,
      created_at: new Date(user.createdAt).toISOString(),
    })
    window.datumAnalytics?.group(team.id, {
      name: team.name,
      plan: team.plan,
    })
  }, [state])

  if (state.status === "loading") return <div className="splash">Loading…</div>
  if (state.status === "signed-out") return <LoginPage />
  return <StandupsPage session={state.session} />
}
