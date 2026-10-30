import { createContext, use, useCallback, useEffect, useState, type ReactNode } from "react"
import type { Team, User } from "../../worker/data"

export interface Session {
  user: User
  team: Team
}

type SessionState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in"; session: Session }

interface SessionContextValue {
  state: SessionState
  signIn: (userId: string) => Promise<void>
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

async function fetchSession(): Promise<Session | null> {
  const response = await fetch("/api/session")
  if (response.status === 401) return null
  if (!response.ok) throw new Error(`Session request failed: ${response.status}`)
  return response.json()
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: "loading" })

  const refresh = useCallback(async () => {
    const session = await fetchSession()
    setState(session ? { status: "signed-in", session } : { status: "signed-out" })
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const signIn = useCallback(
    async (userId: string) => {
      await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      await refresh()
    },
    [refresh],
  )

  const signOut = useCallback(async () => {
    await fetch("/api/logout", { method: "POST" })
    setState({ status: "signed-out" })
  }, [])

  return <SessionContext value={{ state, signIn, signOut }}>{children}</SessionContext>
}

export function useSession() {
  const context = use(SessionContext)
  if (!context) throw new Error("useSession must be used inside SessionProvider")
  return context
}
