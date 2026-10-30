import { useEffect, useState } from "react"
import { Logo } from "../components/Logo"
import { useSession } from "../session/SessionProvider"

interface DemoUser {
  id: string
  name: string
  email: string
  team: string
}

export function LoginPage() {
  const { signIn } = useSession()
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>([])
  const [pendingId, setPendingId] = useState<string | null>(null)

  useEffect(() => {
    void fetch("/api/demo-users")
      .then((response) => response.json<DemoUser[]>())
      .then(setDemoUsers)
  }, [])

  return (
    <main className="login">
      <div className="login-card">
        <Logo />
        <h1>Sign in to Tidepool</h1>
        <p className="muted">Async standups for teams that would rather be building.</p>
        <ul className="demo-users">
          {demoUsers.map((user) => (
            <li key={user.id}>
              <button
                type="button"
                disabled={pendingId !== null}
                onClick={() => {
                  setPendingId(user.id)
                  void signIn(user.id).finally(() => setPendingId(null))
                }}
              >
                <span className="avatar">{user.name[0]}</span>
                <span className="demo-user-text">
                  <strong>{user.name}</strong>
                  <span className="muted">
                    {user.email} · {user.team}
                  </span>
                </span>
                {pendingId === user.id && <span className="muted">Signing in…</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
