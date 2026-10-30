import { useEffect, useState, type FormEvent } from "react"
import type { Standup } from "../../worker/data"
import { Logo } from "../components/Logo"
import { useSession, type Session } from "../session/SessionProvider"

type StandupWithAuthor = Standup & { authorName: string }

export function StandupsPage({ session }: { session: Session }) {
  const { signOut } = useSession()
  const [standups, setStandups] = useState<StandupWithAuthor[]>([])
  const [yesterday, setYesterday] = useState("")
  const [today, setToday] = useState("")
  const [blockers, setBlockers] = useState("")

  useEffect(() => {
    void fetch("/api/standups")
      .then((response) => response.json<StandupWithAuthor[]>())
      .then(setStandups)
  }, [])

  function postStandup(event: FormEvent) {
    event.preventDefault()
    setStandups((current) => [
      {
        id: crypto.randomUUID(),
        authorId: session.user.id,
        authorName: session.user.name,
        date: new Date().toISOString().slice(0, 10),
        yesterday,
        today,
        blockers: blockers || null,
      },
      ...current,
    ])
    setYesterday("")
    setToday("")
    setBlockers("")
  }

  return (
    <div className="shell">
      <header className="topbar">
        <Logo />
        <span className="team-name">{session.team.name}</span>
        <span className={`plan plan-${session.team.plan}`}>{session.team.plan}</span>
        <div className="spacer" />
        <span className="muted">{session.user.name}</span>
        <button type="button" className="link" onClick={() => void signOut()}>
          Sign out
        </button>
      </header>

      <main className="content">
        <form className="card compose" onSubmit={postStandup}>
          <h2>Your standup</h2>
          <label>
            Yesterday
            <textarea value={yesterday} onChange={(event) => setYesterday(event.target.value)} required />
          </label>
          <label>
            Today
            <textarea value={today} onChange={(event) => setToday(event.target.value)} required />
          </label>
          <label>
            Blockers
            <input value={blockers} onChange={(event) => setBlockers(event.target.value)} placeholder="None" />
          </label>
          <button type="submit" className="primary">
            Post standup
          </button>
        </form>

        <section className="feed">
          <h2>Team updates</h2>
          {standups.map((standup) => (
            <article key={standup.id} className="card standup">
              <header>
                <span className="avatar">{standup.authorName[0]}</span>
                <strong>{standup.authorName}</strong>
                <span className="muted">{standup.date}</span>
              </header>
              <dl>
                <dt>Yesterday</dt>
                <dd>{standup.yesterday}</dd>
                <dt>Today</dt>
                <dd>{standup.today}</dd>
                {standup.blockers && (
                  <>
                    <dt>Blockers</dt>
                    <dd className="blocker">{standup.blockers}</dd>
                  </>
                )}
              </dl>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
