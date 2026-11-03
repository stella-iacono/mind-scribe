export type AnalysisStatus = "complete" | "pending" | "failed"

export type Observation = {
  label: string
  detail: string
  confidence: "High" | "Medium" | "Low"
}

export type EntryAnalysis = {
  summary: string
  themes: Observation[]
  emotions: Observation[]
  reflection: string
  caveat: string
}

export type JournalEntry = {
  id: string
  createdAt: string
  text: string
  status: AnalysisStatus
  analysis?: EntryAnalysis
  error?: string
  readyAt?: number
}

export type Page<T,> = {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type ApiErrorCode = "AUTH_INVALID" | "AUTH_EXPIRED" | "ENTRY_TOO_SHORT" | "ENTRY_NOT_FOUND" | "ANALYSIS_UNAVAILABLE" | "NETWORK_ERROR"

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message?: string,
  ) {
    super(message ?? code)
  }
}

const errorMessages: Record<ApiErrorCode, string> = {
  AUTH_INVALID:
    "That email or password is not recognized. Check your details and try again.",
  AUTH_EXPIRED: "Your session has expired. Sign in again to continue.",
  ENTRY_TOO_SHORT:
    "Write at least 40 characters so Mind Scribe has enough context to reflect on.",
  ENTRY_NOT_FOUND: "This entry could not be found. It may have been deleted.",
  ANALYSIS_UNAVAILABLE:
    "The analysis could not be completed. Your entry is safe—try again when you’re ready.",
  NETWORK_ERROR:
    "Mind Scribe could not connect. Your writing is still here; check your connection and try again.",
}

export function actionableError(error: unknown): string {
  if (error instanceof ApiError) return errorMessages[error.code]
  return errorMessages.NETWORK_ERROR
}

const initialEntries: JournalEntry[] = [
  {
    id: "entry-1",
    createdAt: "2026-03-10T20:14:00.000Z",
    text: "I took the long way home after work today. The air felt lighter than it has all week, and for once I didn’t feel the need to fill the walk with a podcast. I kept thinking about how quickly I say yes to things before checking whether I have the energy. Maybe the quiet felt good because it was one decision I made only for myself.",
    status: "complete",
    analysis: {
      summary:
        "A quiet walk creates space to notice the cost of automatic commitments and the value of self-directed time.",
      themes: [
        {
          label: "Personal boundaries",
          detail:
            "You connect quick agreement with overlooking your available energy.",
          confidence: "High",
        },
        {
          label: "Restorative solitude",
          detail:
            "Unfilled quiet appears to offer relief rather than loneliness.",
          confidence: "High",
        },
        {
          label: "Agency",
          detail:
            "Choosing the longer route felt meaningful because it was self-directed.",
          confidence: "Medium",
        },
      ],
      emotions: [
        {
          label: "Relief",
          detail:
            "The lighter air and unhurried walk suggest a release of pressure.",
          confidence: "High",
        },
        {
          label: "Curiosity",
          detail:
            "You are examining a familiar habit without harsh self-judgment.",
          confidence: "Medium",
        },
      ],
      reflection:
        "What might change if you paused before your next “yes” and checked what you need first?",
      caveat:
        "This reading is based only on the language in this entry. “Relief” and “agency” are interpretations, not facts about how you felt.",
    },
  },
  {
    id: "entry-2",
    createdAt: "2026-03-07T08:32:00.000Z",
    text: "Saturday morning. I finally cleared the corner of the kitchen table that has been collecting mail for weeks. It was a tiny task, but seeing the bare wood made the whole room feel calmer. I want to remember that starting small still counts.",
    status: "complete",
    analysis: {
      summary:
        "Completing a small, delayed task brings an outsized sense of calm and reinforces the value of modest beginnings.",
      themes: [
        {
          label: "Small wins",
          detail:
            "A limited task becomes evidence that progress does not need to be dramatic.",
          confidence: "High",
        },
        {
          label: "Environment and mood",
          detail: "Visual order seems connected to a calmer internal state.",
          confidence: "Medium",
        },
      ],
      emotions: [
        {
          label: "Satisfaction",
          detail: "You describe a sense of ease after finishing the task.",
          confidence: "High",
        },
      ],
      reflection:
        "What is another “corner of the table” task that could make today feel lighter?",
      caveat:
        "The connection between order and calm is inferred from this single moment and may not hold in every context.",
    },
  },
  {
    id: "entry-3",
    createdAt: "2026-03-03T22:05:00.000Z",
    text: "I had a difficult conversation with Sam and keep replaying one sentence I wish I had phrased differently. The rest of the conversation was honest and kind, but my attention keeps snapping back to that awkward moment. I hope I can let the whole conversation count, not just the imperfect part.",
    status: "failed",
    error: "ANALYSIS_UNAVAILABLE",
  },
  {
    id: "entry-4",
    createdAt: "2026-02-26T19:42:00.000Z",
    text: "Today felt full from beginning to end. I moved from one obligation to another without much room in between, yet the ten minutes I spent watering the plants stayed with me. I noticed two new leaves. It felt reassuring that growth can happen quietly while my attention is elsewhere.",
    status: "complete",
    analysis: {
      summary:
        "A small moment of care interrupts a crowded day and offers reassurance about quiet, ongoing growth.",
      themes: [
        {
          label: "Quiet growth",
          detail:
            "The new leaves become a hopeful metaphor for change that does not demand attention.",
          confidence: "High",
        },
      ],
      emotions: [
        {
          label: "Reassurance",
          detail:
            "Caring for the plants appears to soften the pressure of a busy day.",
          confidence: "High",
        },
      ],
      reflection:
        "Where else might something be growing even when you are not actively tending to it?",
      caveat:
        "The metaphor of growth is explicit, but its broader meaning in your life remains open.",
    },
  },
  {
    id: "entry-5",
    createdAt: "2026-02-19T07:18:00.000Z",
    text: "Woke before my alarm and watched the room slowly get brighter. I usually reach for my phone immediately, but this morning I stayed still. Nothing important happened, which might be why it felt important. I would like more mornings that begin without urgency.",
    status: "complete",
    analysis: {
      summary:
        "An unhurried morning reveals a desire for beginnings shaped by presence rather than urgency.",
      themes: [
        {
          label: "Intentional pace",
          detail:
            "Pausing before reaching for your phone creates a different quality of attention.",
          confidence: "High",
        },
      ],
      emotions: [
        {
          label: "Peace",
          detail: "Stillness and gradual light suggest a calm, receptive mood.",
          confidence: "Medium",
        },
      ],
      reflection:
        "What is one small choice that could protect this feeling tomorrow morning?",
      caveat:
        "Peace is inferred from the scene; you may have experienced the stillness differently.",
    },
  },
  {
    id: "entry-6",
    createdAt: "2026-02-11T21:51:00.000Z",
    text: "Dinner with my sister was easy in a way I did not know I needed. We laughed about old stories and made plans we might actually keep. I left feeling more like myself. I should remember that connection can give energy back rather than only asking for it.",
    status: "complete",
    analysis: {
      summary:
        "A relaxed evening with your sister challenges the idea that social connection always consumes energy.",
      themes: [
        {
          label: "Nourishing connection",
          detail:
            "Familiar company helps you feel restored and more like yourself.",
          confidence: "High",
        },
      ],
      emotions: [
        {
          label: "Warmth",
          detail: "Laughter and future plans convey affection and ease.",
          confidence: "High",
        },
      ],
      reflection:
        "Which relationships tend to return energy to you, and what do they have in common?",
      caveat:
        "This observation reflects one evening and does not define the relationship as a whole.",
    },
  },
]

const wait = (duration = 250) =>
  new Promise((resolve) => window.setTimeout(resolve, duration))

export class MindScribeApi {
  private accessToken: string | null = null
  private entries = initialEntries.map((entry) => ({ ...entry }))
  private reauthenticate?: () => Promise<string | null>

  setReauthenticationHandler(handler: () => Promise<string | null>) {
    this.reauthenticate = handler
  }

  clearSession() {
    this.accessToken = null
  }

  private async request<T,>(
    operation: (headers: Headers) => Promise<T>,
    hasRetried = false,
  ): Promise<T> {
    const headers = new Headers({ "Content-Type": "application/json" })
    if (this.accessToken)
      headers.set("Authorization", `Bearer ${this.accessToken}`)
    try {
      if (!this.accessToken) throw new ApiError("AUTH_EXPIRED")
      return await operation(headers)
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === "AUTH_EXPIRED" &&
        !hasRetried &&
        this.reauthenticate
      ) {
        this.accessToken = await this.reauthenticate()
        if (this.accessToken) return this.request(operation, true)
      }
      throw error
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    await wait(450)
    if (
      email.toLowerCase() !== "demo@mindscribe.app" ||
      password !== "reflect"
    ) {
      throw new ApiError("AUTH_INVALID")
    }
    this.accessToken = `session-${crypto.randomUUID()}`
  }

  async listEntries(page = 1, pageSize = 5): Promise<Page<JournalEntry>> {
    return this.request(async () => {
      await wait()
      const start = (page - 1) * pageSize
      return {
        items: this.entries
          .slice(start, start + pageSize)
          .map((entry) => ({ ...entry })),
        page,
        pageSize,
        total: this.entries.length,
        totalPages: Math.max(1, Math.ceil(this.entries.length / pageSize)),
      }
    })
  }

  async getEntry(id: string): Promise<JournalEntry> {
    return this.request(async () => {
      await wait(180)
      const entry = this.entries.find((candidate) => candidate.id === id)
      if (!entry) throw new ApiError("ENTRY_NOT_FOUND")
      if (
        entry.status === "pending" &&
        entry.readyAt &&
        Date.now() >= entry.readyAt
      ) {
        entry.status = "complete"
        entry.readyAt = undefined
        entry.analysis = this.makeAnalysis(entry.text)
      }
      return { ...entry }
    })
  }

  async createEntry(text: string): Promise<JournalEntry> {
    return this.request(async () => {
      await wait(550)
      if (text.trim().length < 40) throw new ApiError("ENTRY_TOO_SHORT")
      const entry: JournalEntry = {
        id: `entry-${crypto.randomUUID()}`,
        createdAt: new Date().toISOString(),
        text: text.trim(),
        status: "pending",
        readyAt: Date.now() + 4500,
      }
      this.entries.unshift(entry)
      return { ...entry }
    })
  }

  async retryAnalysis(id: string): Promise<JournalEntry> {
    return this.request(async () => {
      await wait(450)
      const entry = this.entries.find((candidate) => candidate.id === id)
      if (!entry) throw new ApiError("ENTRY_NOT_FOUND")
      entry.status = "pending"
      entry.error = undefined
      entry.readyAt = Date.now() + 3500
      return { ...entry }
    })
  }

  async deleteEntry(id: string): Promise<void> {
    return this.request(async () => {
      await wait(350)
      const index = this.entries.findIndex((candidate) => candidate.id === id)
      if (index === -1) throw new ApiError("ENTRY_NOT_FOUND")
      this.entries.splice(index, 1)
    })
  }

  private makeAnalysis(text: string): EntryAnalysis {
    const lower = text.toLowerCase()
    const theme = lower.includes("work")
      ? "Work and energy"
      : lower.includes("friend")
        ? "Connection"
        : "Self-awareness"
    return {
      summary:
        "This entry pauses to notice what is asking for your attention and turns an everyday experience into a chance for reflection.",
      themes: [
        {
          label: theme,
          detail:
            "You appear to be noticing how this experience connects to your needs and priorities.",
          confidence: "Medium",
        },
        {
          label: "Making meaning",
          detail:
            "The entry moves from describing an event toward considering what it might mean.",
          confidence: "High",
        },
      ],
      emotions: [
        {
          label: "Thoughtfulness",
          detail:
            "Your language suggests a reflective, attentive stance toward the experience.",
          confidence: "Medium",
        },
      ],
      reflection:
        "If you returned to this moment a week from now, what detail would you want to remember?",
      caveat:
        "This is a tentative reading of one entry, not a diagnosis or a complete picture of your experience.",
    }
  }
}

export const api = new MindScribeApi()
