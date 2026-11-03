import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { actionableError, api, JournalEntry, Page } from "./api"
import {
  AlertIcon,
  ArrowIcon,
  BackIcon,
  CalendarIcon,
  CheckIcon,
  LockIcon,
  MoreIcon,
  PlusIcon,
  QuillIcon,
  SparkIcon,
  TrashIcon,
} from "./icons"

type Route = { view: "signin" | "entries" | "new" | "detail" id?: string }

const parseRoute = (): Route => {
  const path = window.location.pathname
  if (path === "/new") return { view: "new" }
  if (path.startsWith("/entries/"))
    return { view: "detail", id: path.split("/")[2] }
  if (path === "/entries") return { view: "entries" }
  return { view: "signin" }
}

const formatDate = (date: string, full = false) =>
  new Intl.DateTimeFormat(
    "en-US",
    full
      ? {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      : { month: "short", day: "numeric", year: "numeric" },
  ).format(new Date(date))

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="Mind Scribe">
      <span className="brand-mark">
        <QuillIcon />
      </span>
      {!compact && <span>mind scribe</span>}
    </div>
  )
}

function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger"
}) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {children}
    </button>
  )
}

function AppShell({
  children,
  onNavigate,
  onSignOut,
}: {
  children: ReactNode
  onNavigate: (path: string) => void
  onSignOut: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" onClick={() => onNavigate("/entries")}>
          <Brand />
        </button>
        <nav aria-label="Primary navigation">
          <Button variant="ghost" onClick={() => onNavigate("/entries")}>
            Entries
          </Button>
          <Button onClick={() => onNavigate("/new")}>
            <PlusIcon /> New entry
          </Button>
          <div className="account-wrap">
            <button
              className="avatar-button"
              aria-label="Open account menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              AM
            </button>
            {open && (
              <div className="account-menu">
                <span>Alex Morgan</span>
                <small>demo@mindscribe.app</small>
                <hr />
                <button onClick={onSignOut}>Sign out</button>
              </div>
            )}
          </div>
        </nav>
      </header>
      {children}
      <footer className="footer">
        <span>Your words stay private.</span>
        <span>Mind Scribe offers reflections, not medical advice.</span>
      </footer>
    </div>
  )
}

function SignIn({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.signIn(email.trim(), password)
      onSuccess()
    } catch (caught) {
      setError(actionableError(caught))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="signin-page">
      <section className="signin-story" aria-labelledby="welcome-title">
        <Brand />
        <div className="story-copy">
          <p className="eyebrow">A quieter way to look back</p>
          <h1 id="welcome-title">
            Notice what’s
            <br />
            <em>beneath the words.</em>
          </h1>
          <p>
            Write freely. Mind Scribe helps you surface themes, emotions, and
            questions worth returning to.
          </p>
        </div>
        <blockquote>
          “The unexamined life is not worth living.”<cite>— Socrates</cite>
        </blockquote>
      </section>
      <section className="signin-panel" aria-labelledby="signin-title">
        <div className="signin-card">
          <p className="eyebrow">Welcome back</p>
          <h2 id="signin-title">Sign in to your journal</h2>
          <p className="muted">
            Your entries are private and only visible after you sign in.
          </p>
          {error && (
            <div className="alert alert-error" role="alert">
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={submit} noValidate>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={loading || !email || !password}>
              {loading ? "Signing in…" : "Sign in"} <ArrowIcon />
            </Button>
          </form>
          <div className="demo-note">
            <strong>For this prototype</strong>
            <span>Use demo@mindscribe.app and password “reflect”</span>
          </div>
          <p className="security-note">
            <LockIcon /> Journal content is never stored in this browser.
          </p>
        </div>
      </section>
    </main>
  )
}

function StatusBadge({ status }: { status: JournalEntry["status"] }) {
  const labels = {
    complete: "Analyzed",
    pending: "Analyzing",
    failed: "Needs attention",
  }
  return (
    <span className={`status status-${status}`}>
      {status === "complete" ? (
        <CheckIcon />
      ) : status === "failed" ? (
        <AlertIcon />
      ) : (
        <span className="pulse" />
      )}
      {labels[status]}
    </span>
  )
}

function EntryList({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [result, setResult] = useState<Page<JournalEntry> | null>(null)
  const [page, setPage] = useState(1)
  const [error, setError] = useState("")

  useEffect(() => {
    let current = true
    setError("")
    api
      .listEntries(page)
      .then((data) => current && setResult(data))
      .catch((caught) => current && setError(actionableError(caught)))
    return () => {
      current = false
    }
  }, [page])

  return (
    <main className="page page-list">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your private space</p>
          <h1>Journal entries</h1>
          <p className="muted">Look back with a little more clarity.</p>
        </div>
        <Button onClick={() => onNavigate("/new")}>
          <PlusIcon /> Write a new entry
        </Button>
      </div>
      {error && (
        <div className="alert alert-error" role="alert">
          <AlertIcon />
          {error}
        </div>
      )}
      {!result && !error && (
        <div className="loading-state" role="status">
          <span className="spinner" /> Gathering your entries…
        </div>
      )}
      {result?.items.length === 0 && (
        <section className="empty-state">
          <span className="empty-mark">
            <QuillIcon />
          </span>
          <p className="eyebrow">A blank page, in the best way</p>
          <h2>Your journal starts here.</h2>
          <p>Write what’s on your mind. There’s no right way to begin.</p>
          <Button onClick={() => onNavigate("/new")}>
            <PlusIcon /> Write your first entry
          </Button>
        </section>
      )}
      {result && result.items.length > 0 && (
        <>
          <section className="entry-list" aria-label="Journal entries">
            <div className="list-labels">
              <span>Date</span>
              <span>Entry</span>
              <span>Analysis</span>
              <span />
            </div>
            {result.items.map((entry) => (
              <article className="entry-row" key={entry.id}>
                <time dateTime={entry.createdAt}>
                  <CalendarIcon />
                  {formatDate(entry.createdAt)}
                </time>
                <button
                  className="entry-preview"
                  onClick={() => onNavigate(`/entries/${entry.id}`)}
                >
                  <strong>
                    {entry.analysis?.summary ??
                      (entry.status === "failed"
                        ? "Analysis needs another try"
                        : "Your reflection is being prepared")}
                  </strong>
                  <span>{entry.text}</span>
                </button>
                <StatusBadge status={entry.status} />
                <button
                  className="icon-button"
                  aria-label={`Open entry from ${formatDate(entry.createdAt)}`}
                  onClick={() => onNavigate(`/entries/${entry.id}`)}
                >
                  <ArrowIcon />
                </button>
              </article>
            ))}
          </section>
          <nav className="pagination" aria-label="Entry pages">
            <Button
              variant="secondary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <BackIcon /> Previous
            </Button>
            <span>
              Page {page} of {result.totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page === result.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next <ArrowIcon />
            </Button>
          </nav>
        </>
      )}
    </main>
  )
}

function NewEntry({
  onNavigate,
  draft,
  setDraft,
}: {
  onNavigate: (path: string) => void
  draft: string
  setDraft: (value: string) => void
}) {
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const max = 10000

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (draft.trim().length < 40) {
      setError(
        "Write at least 40 characters so there is enough context for a thoughtful reflection.",
      )
      return
    }
    setError("")
    setSubmitting(true)
    try {
      const entry = await api.createEntry(draft)
      setDraft("")
      onNavigate(`/entries/${entry.id}`)
    } catch (caught) {
      setError(actionableError(caught))
      setSubmitting(false)
    }
  }

  return (
    <main className="page editor-page">
      <button className="back-link" onClick={() => onNavigate("/entries")}>
        <BackIcon /> Back to entries
      </button>
      <div className="editor-heading">
        <p className="eyebrow">New entry</p>
        <h1>What’s on your mind?</h1>
        <p>There’s no need to make it polished. Write as you are.</p>
      </div>
      <form className="editor-form" onSubmit={submit}>
        <div className="paper">
          <label htmlFor="entry-text">Journal entry</label>
          <p id="entry-instructions">
            Write at least 40 characters. Your words will be analyzed only after
            you choose “Save &amp; reflect.”
          </p>
          <textarea
            id="entry-text"
            aria-describedby={`entry-instructions entry-count${
              error ? " entry-error" : ""
            }`}
            aria-invalid={Boolean(error)}
            value={draft}
            maxLength={max}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Start writing here…"
            rows={14}
            autoFocus
          />
          <span id="entry-count" className="character-count">
            {draft.length.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
        {error && (
          <div id="entry-error" className="alert alert-error" role="alert">
            <AlertIcon />
            {error}
          </div>
        )}
        <div className="submit-row">
          <p>
            <LockIcon />
            <span>
              <strong>Private by design</strong>Your entry is sent securely for
              analysis and is never stored in this browser.
            </span>
          </p>
          <div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onNavigate("/entries")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save & reflect"} <SparkIcon />
            </Button>
          </div>
        </div>
      </form>
    </main>
  )
}

function AnalysisContent({ entry }: { entry: JournalEntry }) {
  const analysis = entry.analysis!
  return (
    <div className="analysis-content">
      <section className="analysis-intro">
        <span className="analysis-icon">
          <SparkIcon />
        </span>
        <div>
          <p className="eyebrow">At a glance</p>
          <h2>{analysis.summary}</h2>
        </div>
      </section>
      <section className="analysis-section">
        <p className="section-number">01</p>
        <div>
          <h2>Themes that surfaced</h2>
          <div className="observation-grid">
            {analysis.themes.map((item) => (
              <article className="observation" key={item.label}>
                <div>
                  <h3>{item.label}</h3>
                  <span
                    className={`confidence confidence-${item.confidence.toLowerCase()}`}
                  >
                    {item.confidence} confidence
                  </span>
                </div>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="analysis-section">
        <p className="section-number">02</p>
        <div>
          <h2>Emotional observations</h2>
          <div className="observation-grid">
            {analysis.emotions.map((item) => (
              <article className="observation" key={item.label}>
                <div>
                  <h3>{item.label}</h3>
                  <span
                    className={`confidence confidence-${item.confidence.toLowerCase()}`}
                  >
                    {item.confidence} confidence
                  </span>
                </div>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="reflection-card">
        <p className="eyebrow">A question to carry with you</p>
        <blockquote>{analysis.reflection}</blockquote>
      </section>
      <aside className="uncertainty">
        <AlertIcon />
        <div>
          <h3>About this reflection</h3>
          <p>
            {analysis.caveat} AI can miss context—keep what resonates and leave
            the rest.
          </p>
        </div>
      </aside>
    </div>
  )
}

function EntryDetail({
  id,
  onNavigate,
}: {
  id: string
  onNavigate: (path: string) => void
}) {
  const [entry, setEntry] = useState<JournalEntry | null>(null)
  const [error, setError] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [working, setWorking] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const load = useCallback(
    () =>
      api
        .getEntry(id)
        .then(setEntry)
        .catch((caught) => setError(actionableError(caught))),
    [id],
  )
  useEffect(() => {
    load()
  }, [load])
  useEffect(() => {
    if (entry?.status !== "pending") return
    const timer = window.setInterval(load, 1800)
    return () => window.clearInterval(timer)
  }, [entry?.status, load])
  useEffect(() => {
    if (confirmDelete) dialogRef.current?.showModal()
    else dialogRef.current?.close()
  }, [confirmDelete])

  const retry = async () => {
    setWorking(true)
    setError("")
    try {
      setEntry(await api.retryAnalysis(id))
    } catch (caught) {
      setError(actionableError(caught))
    }
    setWorking(false)
  }
  const remove = async () => {
    setWorking(true)
    try {
      await api.deleteEntry(id)
      onNavigate("/entries")
    } catch (caught) {
      setError(actionableError(caught))
      setConfirmDelete(false)
      setWorking(false)
    }
  }

  if (error && !entry)
    return (
      <main className="page">
        <button className="back-link" onClick={() => onNavigate("/entries")}>
          <BackIcon /> Back to entries
        </button>
        <div className="alert alert-error" role="alert">
          <AlertIcon />
          {error}
        </div>
      </main>
    )
  if (!entry)
    return (
      <main className="page loading-state" role="status">
        <span className="spinner" /> Opening your entry…
      </main>
    )

  return (
    <main className="page detail-page">
      <div className="detail-toolbar">
        <button className="back-link" onClick={() => onNavigate("/entries")}>
          <BackIcon /> Back to entries
        </button>
        <div>
          <Button variant="ghost" aria-label="More options">
            <MoreIcon />
          </Button>
          <Button
            variant="ghost"
            className="delete-button"
            onClick={() => setConfirmDelete(true)}
          >
            <TrashIcon /> Delete
          </Button>
        </div>
      </div>
      <header className="detail-heading">
        <div>
          <p className="eyebrow">Journal entry</p>
          <h1>{formatDate(entry.createdAt)}</h1>
          <time dateTime={entry.createdAt}>
            {formatDate(entry.createdAt, true)}
          </time>
        </div>
        <StatusBadge status={entry.status} />
      </header>
      {error && (
        <div className="alert alert-error" role="alert">
          <AlertIcon />
          {error}
        </div>
      )}
      <div className="detail-layout">
        <article className="original-entry">
          <p className="eyebrow">Your words</p>
          <p>{entry.text}</p>
        </article>
        <section className="analysis-panel" aria-labelledby="analysis-title">
          <div className="analysis-title-row">
            <div>
              <p className="eyebrow">Mind Scribe reflection</p>
              <h2 id="analysis-title">What this entry may be holding</h2>
            </div>
          </div>
          <div aria-live="polite">
            {entry.status === "complete" && <AnalysisContent entry={entry} />}
            {entry.status === "pending" && (
              <div className="analysis-state">
                <span className="thinking-orbit">
                  <SparkIcon />
                </span>
                <h3>Reading with care…</h3>
                <p>
                  We’re looking for themes and emotional cues. This usually
                  takes less than a minute.
                </p>
                <div className="progress-track">
                  <span />
                </div>
                <small>
                  You can leave this page. Your entry has been saved.
                </small>
              </div>
            )}
            {entry.status === "failed" && (
              <div className="analysis-state failed-state">
                <span className="failed-icon">
                  <AlertIcon />
                </span>
                <h3>We couldn’t complete the reflection</h3>
                <p>
                  Your original entry is safe. This can happen during a
                  temporary service issue.
                </p>
                <Button onClick={retry} disabled={working}>
                  <SparkIcon />
                  {working ? "Trying again…" : "Try analysis again"}
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
      <dialog
        ref={dialogRef}
        className="dialog"
        onCancel={() => setConfirmDelete(false)}
      >
        <form method="dialog" onSubmit={(event) => event.preventDefault()}>
          <span className="dialog-icon">
            <TrashIcon />
          </span>
          <p className="eyebrow">Delete entry</p>
          <h2>Let this entry go?</h2>
          <p>
            This permanently deletes the entry and its reflection. This action
            cannot be undone.
          </p>
          <div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setConfirmDelete(false)}
            >
              Keep entry
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={working}
              onClick={remove}
            >
              {working ? "Deleting…" : "Delete permanently"}
            </Button>
          </div>
        </form>
      </dialog>
    </main>
  )
}

export default function App() {
  const [route, setRoute] = useState(parseRoute)
  const [authenticated, setAuthenticated] = useState(false)
  const [draft, setDraft] = useState("")

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, "", path)
    setRoute(parseRoute())
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  useEffect(() => {
    const onPopState = () => setRoute(parseRoute())
    window.addEventListener("popstate", onPopState)
    api.setReauthenticationHandler(async () => null)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const signedIn = () => {
    setAuthenticated(true)
    navigate("/entries")
  }
  const signOut = () => {
    api.clearSession()
    setDraft("")
    setAuthenticated(false)
    navigate("/")
  }

  if (!authenticated) return <SignIn onSuccess={signedIn} />
  return (
    <AppShell onNavigate={navigate} onSignOut={signOut}>
      {route.view === "new" ? (
        <NewEntry onNavigate={navigate} draft={draft} setDraft={setDraft} />
      ) : route.view === "detail" && route.id ? (
        <EntryDetail id={route.id} onNavigate={navigate} />
      ) : (
        <EntryList onNavigate={navigate} />
      )}
    </AppShell>
  )
}
