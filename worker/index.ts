import { findUser, standupsForTeam, teams, users } from "./data"

const SESSION_COOKIE = "tp_session"

function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, init)
}

function sessionUserId(request: Request) {
  const cookie = request.headers.get("cookie") ?? ""
  const match = cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

function sessionCookie(value: string, maxAge: number) {
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
}

export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === "/api/demo-users" && request.method === "GET") {
      return json(users.map(({ id, name, email, teamId }) => ({ id, name, email, team: teams[teamId].name })))
    }

    if (url.pathname === "/api/login" && request.method === "POST") {
      const { userId } = await request.json<{ userId?: string }>()
      const user = userId ? findUser(userId) : undefined
      if (!user) return json({ error: "Unknown user" }, { status: 401 })
      return json({ ok: true }, { headers: { "set-cookie": sessionCookie(user.id, 60 * 60 * 24 * 30) } })
    }

    if (url.pathname === "/api/logout" && request.method === "POST") {
      return json({ ok: true }, { headers: { "set-cookie": sessionCookie("", 0) } })
    }

    const userId = sessionUserId(request)
    const user = userId ? findUser(userId) : undefined

    if (url.pathname === "/api/session" && request.method === "GET") {
      if (!user) return json({ error: "Not signed in" }, { status: 401 })
      return json({ user, team: teams[user.teamId] })
    }

    if (url.pathname === "/api/standups" && request.method === "GET") {
      if (!user) return json({ error: "Not signed in" }, { status: 401 })
      return json(standupsForTeam(user.teamId))
    }

    return json({ error: "Not found" }, { status: 404 })
  },
} satisfies ExportedHandler
