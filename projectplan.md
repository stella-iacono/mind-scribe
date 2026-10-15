# AI Project Plan: Mind Scribe

## 1. Project summary

- **Project name:** Mind Scribe
- **Owner / team:** Parent and daughter project team; individual names and responsibilities to confirm
- **Sponsor / stakeholders:** Project team; initial users are the journal author(s)
- **Status:** Proposed
- **Last updated:** 2026-10-14
- **Target launch date:** To be determined

### Overview
Mind Scribe is a personal journal-entry analyzer. A user writes entries over time, and AI helps organize them into themes, emotional observations, and other reflections so the user can explore their own history. The first version is a small analyzer that extracts structured observations from an entry and stores them. Later versions may add trends, search across past entries, and evidence-based pattern discovery.

### Problem or opportunity
Journal entries contain useful personal context, but it can be difficult to recall recurring themes, notice change over time, or connect habits and experiences with how one felt. Mind Scribe aims to make that material easier for the journal author to review, while also serving as a hands-on project for learning modern AI and software development.

### Proposed AI solution
For Version 1, an LLM will analyze a journal entry and return structured observations such as sentiment, themes, emotional state, and an uncertainty/confidence indicator. The application will store the entry and its analysis for later review. AI is useful for interpreting varied natural-language writing; deterministic code and database queries should handle storage, filtering, and calculations wherever possible. Analyses are reflective aids, not objective measurements or clinical assessments.

## 2. Goals and scope

### Goals
1. Build a usable first version that accepts a journal entry, produces structured analysis, and stores both the entry and result.
2. Help the user review personal themes and emotional observations without presenting uncertain AI interpretations as facts.
3. Learn and practice LLM APIs, prompt design, structured JSON output, database design, evaluation, data analysis, visualization, semantic search, and retrieval-augmented generation as the project develops.
4. Keep the design extensible so trend analysis and historical question answering can be added in later versions.

### Non-goals
- Diagnose, treat, or replace a therapist, counselor, physician, or other professional.
- Predict a user's mental-health condition or make consequential decisions about them.
- Share journal content between people by default.
- Build all of the later roadmap features into Version 1.

### Scope
- **Version 1 (initial scope):** A single user enters a journal entry; the system analyzes it for sentiment, themes, and emotional state, returns a structured result with uncertainty information, and stores the entry and analysis in a database.
- **Later roadmap:** Mood and theme trends over time; visualizations such as mood timelines, theme frequency, stress heatmaps, and goal progress; semantic search and RAG over the user's own entries; pattern discovery; conversations across time; and optional voice transcription, weekly summaries, habit/goal tracking, or a personal knowledge graph.
- **Out of scope for the initial version:** Family sharing, proactive coaching, mood prediction, and other features not needed to validate the basic analyzer. Each requires separate product, safety, and privacy decisions before implementation.

## 3. Users and stakeholders

| Group | Needs / responsibilities | How they are involved |
|---|---|---|
| Journal author / primary user | Private, useful reflection on their own writing; control over entries and analysis | Defines useful outputs, tests the analyzer, and decides whether to keep or act on insights |
| Parent project contributor | Architecture, database design, APIs, analytics, and visualizations (proposed division of labor) | Builds and reviews technical components |
| Daughter project contributor | AI prompts, UX, frontend, model experimentation, and feature design (proposed division of labor) | Designs and tests user-facing and AI behavior |
| Other family members (future only) | Separate private journals and explicit control over any shared memories or insights | Not included as users until family-mode permissions and safeguards are designed |

## 4. Scenarios and user journeys

The initial workflow is individual and private. Later scenarios are roadmap ideas, not Version 1 commitments.

### Scenario 1: Analyze a new entry (Version 1)
- **User and context:** A person has written a journal entry and wants help reflecting on it.
- **Starting point:** The user enters or submits an entry.
- **Desired outcome:** See a concise, organized interpretation they can review alongside the original entry.
- **Expected system behavior:** Analyze the entry and return structured fields for sentiment, themes, and emotional state, with uncertainty made clear; save the entry and analysis together.
- **Human role / fallback:** The user remains the authority on their own experience and can reject or correct an interpretation. If analysis fails, preserve the entry and report that analysis was unavailable rather than displaying a fabricated result.
- **Edge cases:** Empty or very short entries; ambiguous or mixed emotions; multiple languages; content that suggests acute distress; malformed model output; unavailable model or database.

### Scenario 2: Review trends (future version)
- **User and context:** A user has accumulated enough journal entries and wants to understand changes over time.
- **Starting point:** The user opens a trend view or asks a question such as “When am I happiest?” or “What topics cause the most stress?”
- **Desired outcome:** Explore mood and theme patterns, habits, or goal progress over a selected period.
- **Expected system behavior:** Aggregate stored analyses and entries over time; show the period and data behind each result. Candidate views include mood over time, theme frequency, stress heatmaps, and goal achievement charts.
- **Human role / fallback:** Present correlations as observations, not proof of causation; allow the user to inspect source entries and correct interpretations.
- **Edge cases:** Sparse or uneven journal history, changed analysis/model versions, missing dates, and confounding factors.

### Scenario 3: Ask a question across journal history (future version)
- **User and context:** A user wants to recall or compare something from their past writing.
- **Starting point:** The user asks a question such as “What was I worried about six months ago?” or “Have I made progress on exercising more?”
- **Desired outcome:** Get a useful answer grounded in their own journal history.
- **Expected system behavior:** Retrieve relevant entries, synthesize an answer using those entries, and provide references so the user can verify the answer. If evidence is insufficient, say so.
- **Human role / fallback:** The user checks the cited entries and decides what the comparison means.
- **Edge cases:** No relevant entries, conflicting entries, retrieval misses, or questions asking for unsupported conclusions.

## 5. Requirements

### Functional requirements
- [ ] Accept a journal entry and return an analysis containing sentiment, themes, and emotional state.
- [ ] Request and validate structured JSON from the AI service; handle missing, invalid, or failed responses explicitly.
- [ ] Store the original entry and its analysis in a database so the user can review them later.
- [ ] Keep Version 1 focused on the single-user entry-to-analysis workflow; select the interface and database as an open implementation decision.
- [ ] In later versions, support charts and time-based aggregation, then semantic search and answers grounded in retrieved entries.

### AI-specific requirements
- **AI task:** Analyze and classify journal text; later versions may summarize, retrieve, and synthesize from the user's own entries.
- **Expected output format:** Version 1 structured JSON with sentiment, themes, emotional state, and a confidence/uncertainty field. Define and validate the exact schema before implementation.
- **Quality boundaries:** Describe only what the writing supports. Do not diagnose, claim certainty about internal states, infer unsupported facts, or present correlations as causes.
- **Uncertainty handling:** Treat any model confidence as an estimate, not a calibrated probability unless validated. Allow mixed/unclear results and abstention rather than forcing a label.
- **Human review:** The journal author reviews and interprets all analysis; no AI output is authoritative.
- **Fallback behavior:** Clearly show analysis errors and preserve the user's entry if analysis is unavailable. Never substitute invented analysis for a failed call.

### Non-functional requirements
- **Performance / latency:** Target to be defined for the prototype.
- **Availability / reliability:** A failed AI request must not lose the journal entry; recovery and retry behavior to be defined.
- **Accessibility / usability:** Make entry, review, and correction straightforward; detailed accessibility criteria to be defined with the interface.
- **Supported platforms and languages:** To be determined.
- **Cost limits:** To be determined; record model/provider usage during prototyping.
- **Scalability:** Begin with personal use; reassess before supporting multiple users or family mode.

## 6. Data and model plan

- **Data sources:** User-authored journal entries; derived analysis stored with each entry. Future trend and memory features may use these entries and analyses.
- **Data rights and consent:** Use only entries the journal author chooses to submit. Confirm AI-provider terms and whether submitted content may be retained or used for model improvement before selecting a provider.
- **Sensitive or personal data:** Journal text may contain highly personal, health-related, relationship, or other sensitive details. Minimize collection, restrict access, and decide on encryption and local/cloud storage before real personal entries are used.
- **Data quality and representativeness:** Entries reflect what the user chose to write and may be incomplete or uneven; they are not a comprehensive or neutral record of the user's life. Evaluate whether the analyzer misreads different writing styles or emotional expression.
- **Retention and deletion:** Define retention, export, and permanent deletion behavior before production use. User control over journal data is required.
- **Model / provider:** An LLM API is proposed for the learning prototype. Candidate provider, model/version, hosting, privacy terms, and cost are open decisions. Python, Streamlit, SQLite, and an OpenAI API were suggested as an easiest prototype stack; Python, FastAPI, React, PostgreSQL, pgvector, and an OpenAI or Anthropic model were suggested as a longer-term option. No stack has been selected.
- **Grounding or retrieval sources:** Version 1 analyzes only the submitted entry. Future memory answers must be grounded in retrieved journal entries and show supporting references.
- **Dependencies:** Chosen LLM API/provider, database, and application framework; future semantic search depends on embeddings and a vector-search solution.

## 7. Success metrics and evaluation

Targets and baselines have not yet been agreed. Establish them using a small, consented set of representative test entries before deciding whether the analyzer is useful enough to expand.

| Metric | Baseline | Target | Measurement method / data source | Owner |
|---|---|---|---|---|
| User outcome: usefulness of the analysis for reflection | To measure | To define | User review/feedback after analyzing test entries | Project team |
| AI quality: valid structured output and reasonable themes/emotion labels | To measure | To define | Validate JSON schema; review outputs against a human-written rubric | Project team |
| Safety: unsupported or overly certain interpretations | To measure | To define | Human review of representative and edge-case entries | Project team |
| Reliability: entries preserved when analysis fails | To measure | Must not lose submitted entries | Test API/model failure and database recovery cases | Project team |
| Operations: response time and per-entry cost | To measure | To define | Record latency and provider usage during prototype tests | Project team |

### Evaluation plan
- **Test set / scenarios:** Create a small, consented set of representative entries, including short, ambiguous, mixed-emotion, and edge-case examples. Avoid using another person's private writing without permission.
- **Quality rubric:** Check schema validity, relevance of themes and emotional labels, faithfulness to the text, appropriate uncertainty, and absence of diagnostic or unsupported claims.
- **Human evaluators:** Project contributors review outputs; the journal author determines whether interpretations are personally useful. Define how disagreements will be recorded.
- **Comparisons:** Compare alternative prompts/models and, where useful, the user's own interpretation of sample entries.
- **Release threshold:** To be agreed before a pilot; require valid outputs, acceptable faithfulness, and tested failure behavior.
- **Re-evaluation triggers:** Changes to model/provider, prompt, output schema, data handling, retrieval approach, or any major feature.

## 8. Safety, privacy, and responsible use

- **Potential harms:** Misreading an entry may distress or mislead a user; repeated labels may encourage over-reliance or turn a limited written record into a false picture of the person. Sensitive content may be exposed through storage or an external model provider.
- **Affected groups and unequal impact:** Writing style, language, culture, age, and ways of expressing emotion may affect how entries are interpreted. Test for systematic misreadings before broadening use.
- **Mitigations:** Make the analysis optional and editable; distinguish observations from facts; show uncertainty; preserve source entries; avoid diagnostic language; provide a way to delete data; and do not make automated decisions about the user.
- **Privacy and security review:** Before using real entries, decide local versus cloud processing, access controls, encryption, provider retention/training terms, backups, and deletion. Status: open.
- **Transparency:** Tell users that AI analyzes their writing, that interpretations can be wrong, and that the product is not therapy or professional advice.
- **Misuse and abuse cases:** Do not expose one person's journal or insights to another without explicit authorization. Family mode would require separate accounts/data boundaries and opt-in sharing.
- **Incident process:** Define how to report a harmful or privacy-impacting result, pause analysis, investigate provider/storage behavior, and delete or correct affected data.
- **Applicable policies or regulations:** To assess based on intended users, data, deployment, and jurisdiction before any public or family release.

## 9. Timeline and milestones

| Milestone | Deliverable / exit criteria | Owner | Deadline | Status |
|---|---|---|---|---|
| Discovery and requirements | Confirm Version 1 workflow, exact analysis schema, stack, and privacy decisions | Project team | TBD | Not started |
| Data and feasibility | Confirm provider/data terms and test with consented sample entries | Project team | TBD | Not started |
| Version 1 prototype | Entry submission, structured AI analysis, and database storage work end to end | Project team | TBD | Not started |
| Evaluation and review | Review output quality, uncertainty, failure handling, and data protections | Project team | TBD | Not started |
| Version 1 pilot | Try the analyzer with its intended user(s), gather feedback, and decide next scope | Project team | TBD | Not started |
| Later versions | Prioritize trends, visualizations, memory/RAG, and pattern discovery based on pilot findings | Project team | TBD | Future |

## 10. Risks, assumptions, and dependencies

| Type | Description | Likelihood / impact | Mitigation or validation | Owner |
|---|---|---|---|---|
| Risk | AI may misinterpret emotionally sensitive writing or sound more certain than warranted | Medium / High | Evaluate against a rubric; communicate limitations; keep the user in control | Project team |
| Risk | Sending private entries to a third-party service may not meet the user's privacy expectations | Medium / High | Review provider terms; consider local processing; obtain informed consent before testing real data | Project team |
| Risk | API cost, latency, or availability may make the prototype unreliable | Medium / Medium | Track usage; set limits; preserve entries and show explicit failure messages | Project team |
| Assumption | A structured AI analysis will be useful enough to support reflection | To validate | Test outputs with the intended user and revise or drop fields that are not useful | Project team |
| Assumption | A small single-user prototype is an appropriate first scope | High | Validate through the Version 1 pilot before adding multi-user features | Project team |
| Dependency | LLM API/provider and chosen application/database stack | TBD / Medium | Select only after comparing ease of learning, privacy, cost, and future extensibility | Project team |

## 11. Launch and operations

- **Rollout plan:** Private prototype followed by a small, opt-in pilot; no public or family release is currently committed.
- **Go / no-go criteria:** Agree on output-quality and safety thresholds; verify data handling, entry persistence, deletion, and failure behavior before using real journal content.
- **Monitoring:** Track valid-output rate, user corrections/feedback, failure rate, latency, and model usage/cost. Avoid logging raw journal text unless explicitly required and protected.
- **Feedback and support:** Collect feedback directly from pilot users; define a process to flag inaccurate, upsetting, or privacy-impacting output.
- **Ownership after launch:** Project team; individual component owners to be assigned.
- **Rollback / shutdown plan:** Disable AI analysis while retaining user-controlled access to stored entries; define how to export/delete stored data.
- **Maintenance:** Re-evaluate when prompts, models, data schemas, providers, or retrieval behavior change. Review trend and pattern interpretations before adding proactive insights.

## 12. Decisions and approvals

| Date | Decision | Rationale | Decision-maker(s) |
|---|---|---|---|
| 2026-10-14 | Use a simple journal-entry analyzer as the Version 1 direction; treat trends, memory, pattern discovery, and family mode as future possibilities | Keep the first build small while preserving a learning and extension path | Project team |
| TBD | Select prototype stack, model/provider, and local/cloud data approach | Balance learning goals, privacy, cost, and extensibility | Project team |

### Approvals
- **Project owner:** To confirm
- **Product or business:** Project team; approval process to define
- **Privacy / security / legal (as applicable):** Review data and provider choices before real-entry testing or any broader release
- **Launch approval:** To define after prototype evaluation

## 13. Open questions and next steps

- [ ] Decide the exact Version 1 output schema and whether confidence should be numeric, categorical, or expressed only as uncertainty text — **Owner:** Project team — **Due:** TBD
- [ ] Choose the first interface and storage approach (suggested prototype: Python, Streamlit, SQLite) — **Owner:** Project team — **Due:** TBD
- [ ] Compare candidate AI providers, privacy terms, cost, and retention behavior before sending real journal content — **Owner:** Project team — **Due:** TBD
- [ ] Define entry export, deletion, and backup expectations — **Owner:** Project team — **Due:** TBD
- [ ] Create a consented evaluation set and agree on a quality/safety rubric and pilot thresholds — **Owner:** Project team — **Due:** TBD
- [ ] Assign contributor names, responsibilities, and realistic milestone dates — **Owner:** Project team — **Due:** TBD
