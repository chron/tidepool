export type Plan = "free" | "team" | "business"
export type Role = "owner" | "admin" | "member"

export interface Team {
  id: string
  name: string
  plan: Plan
  seats: number
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
  teamId: string
  createdAt: string
}

export interface Standup {
  id: string
  authorId: string
  date: string
  yesterday: string
  today: string
  blockers: string | null
}

export const teams: Record<string, Team> = {
  harbourlight: { id: "harbourlight", name: "Harbourlight", plan: "business", seats: 24 },
  kestrel: { id: "kestrel", name: "Kestrel Labs", plan: "free", seats: 3 },
}

export const users: User[] = [
  {
    id: "usr_maya",
    name: "Maya Chen",
    email: "maya@harbourlight.io",
    role: "owner",
    teamId: "harbourlight",
    createdAt: "2025-03-14T09:12:00Z",
  },
  {
    id: "usr_tom",
    name: "Tom Okafor",
    email: "tom@harbourlight.io",
    role: "member",
    teamId: "harbourlight",
    createdAt: "2025-11-02T22:40:00Z",
  },
  {
    id: "usr_priya",
    name: "Priya Raman",
    email: "priya@kestrel.dev",
    role: "owner",
    teamId: "kestrel",
    createdAt: "2026-08-21T04:05:00Z",
  },
]

const standups: (Standup & { teamId: string })[] = [
  {
    id: "su_1",
    teamId: "harbourlight",
    authorId: "usr_maya",
    date: "2026-10-30",
    yesterday: "Reviewed the Q4 pricing page copy with marketing.",
    today: "Interviewing two candidates for the support lead role.",
    blockers: null,
  },
  {
    id: "su_2",
    teamId: "harbourlight",
    authorId: "usr_tom",
    date: "2026-10-30",
    yesterday: "Shipped the calendar sync fix for recurring events.",
    today: "Pairing on the Slack reminder retries.",
    blockers: "Waiting on staging credentials from IT.",
  },
  {
    id: "su_3",
    teamId: "kestrel",
    authorId: "usr_priya",
    date: "2026-10-30",
    yesterday: "Set up Tidepool for the team.",
    today: "Inviting the rest of the founders.",
    blockers: null,
  },
]

export function findUser(id: string) {
  return users.find((user) => user.id === id)
}

export function standupsForTeam(teamId: string) {
  return standups
    .filter((standup) => standup.teamId === teamId)
    .map(({ teamId: _teamId, ...standup }) => ({
      ...standup,
      authorName: findUser(standup.authorId)?.name ?? "Unknown",
    }))
}
