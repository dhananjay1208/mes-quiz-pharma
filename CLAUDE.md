# CLAUDE.md — mes-quiz-pharma

"The Plant 2 Alert — MES to the Rescue!" — team-based MES scenario activity for
oral-solid-dose (tablet) pharmaceutical manufacturing (fictional Helvion Pharma,
Plant 2 Lakeworth). Deliverable #9 of the pharma MES training pack. Built 2026-09-26
by porting the tobacco golden master `MES Practitioner Training\Apps\mes-quiz-tobacco`
("The Plant 4 Alert" / Meridian) per the `mes-training-pack` skill's PORT_RECIPES.md #9.
**Pack canon (the only source of facts, ids, numbers): `Apps\PHARMA-MES-CONTEXT.md`.**
Shared build brief for all pack apps: `Apps\_shared\BUILD_BRIEF.md`.

Vite 5 + React 18 + **TypeScript** + Tailwind 3.4 + shadcn/ui (stock kit under
`src/components/ui/`, do not edit) + HashRouter + Supabase. Dev port **8082**.
Repo / Netlify (planned, per canon "Naming & keys"): `dhananjay1208/mes-quiz-pharma` ·
site `mesquizpharma`. Not yet published — DK's orchestrator does git + Netlify.

## Product concept (do not drift from this)

An open-ended TEAM WORKSHEET, not an MCQ quiz: teams read narrative plant problems
and fill 4 free-text fields per problem (Diagnosis / MES Functions / Solution Pitch /
Data & Integrations), submit under a team name, and the debrief is human. A
password-gated instructor dashboard shows all submissions PLUS facilitator model
answers. There is no scoring, timer, or auto-grading — by design.

**Two difficulty tracks:** the welcome page offers **Standard** (3 beginner
problems, one failure each, jargon glossed — NIR, LOD, bollino, QP — per-problem hint
chip, ~30 min) and **Advanced** (4 practitioner problems, ~40 min). Track ids are
disjoint (`std1..3` vs `problem1..4`) so `trackOfResponses()` infers a submission's
track from its response keys — no Supabase schema change. Instructor dashboard
badges each submission's track; Model Answers tab has a Standard|Advanced toggle plus
**Export PDF** (print stylesheet — body class `print-model-answers`,
`.print-break-before` page breaks in index.css, chrome tagged `print:hidden`; the
export prints whichever track is toggled).

Routes: `/` welcome + team name → `/scenario` worksheet → `/confirmation` →
`/instructor` (submissions + model answers).

## The problems (all facts from the canon)

- Standard: `std1` The Moisture Probe That Got Stuck (FBD2 NIR stuck at 2.0 %, lab
  2.7 % vs 2.5 % limit) · `std2` The Wrong Carton Artwork (CDX-10-EXP on CR3 with
  domestic blanks, no bollino, 18,000 cartons) · `std3` The Batch-Record Hunt (3
  people × 3 days of paper, whole week in quarantine, QP won't sign).
- Advanced: `problem1` The Dryer That Lied (FBD2 NIR frozen, GB-1834 KF 2.7 % vs
  window 1.5–2.5 %, HP2-HIST, BLND-1834, IBCs, PR3) · `problem2` The Changeover
  Cascade (Cadence APS ladder 20 min / 2 h / 3 h / ~6 h + lab, VIG-IT-CDX10 stockout
  at CR3, skipped potent clean on Line 5 after ZTX-50, FEM-2.5 flagged) · `problem3`
  The Pallet Held in Quarantine (SSCC 003591230800127456, 48 cases, B-CX-2417 serials
  never commissioned to the EU Hub, CP1 scanner paper fallback, EG-PKG-01 outage,
  HP2-SER, QP cannot certify) · `problem4` The Counters That Didn't Add Up (TabCountK
  ×1,000, WeightTmg ×10, BL3 6–9 s foil-splice stops invisible at 30 s polling, fault
  5203, yield reconciliation).
- **Problem 4's arithmetic is internally consistent on purpose:** 10 tablets/blister ·
  2 blisters/carton · 10 cartons/bundle · 20 bundles/case = 200 cartons = 4,000
  tablets/case; batch = 400 kg granulation ≈ 1.6 M tablets (× 250 mg = 400 kg) = 400
  cases; 48 cases/pallet. Keep any edit consistent.

## Architecture contract

- **ALL activity content lives in `src/data/*.ts`; components are presentation only.**
  - `problems.ts` — `PROBLEM_SETS: Record<Track, Problem[]>` (standard `std1..3` with
    `hint` fields, advanced `problem1..4`) + `TRACK_META` + `trackOfResponses()` +
    `emptyResponses(track)` + `TAB_GRID_CLASS`. **The problem count is derived
    everywhere** (tabs, validation, instructor view). To add a problem: edit
    `problems.ts` + `modelAnswers.ts` only (extend `TAB_GRID_CLASS` if > 6). Problem
    `id`s key the autosave and the Supabase jsonb rows — never rename existing ids,
    and keep the std*/problem* prefixes disjoint (track inference depends on it).
  - `mesFunctions.ts` — the 11 MES functions reference (OSD descriptions, shared by
    both tracks). Titles are the canonical ISA-95/MESA names.
  - `modelAnswers.ts` — facilitator answers keyed by problem id (both tracks) +
    per-track `SUMMARY_ROWS`/`DEBRIEF_QUESTIONS` (5 each). Rendered by
    `ModelAnswersView.tsx` (takes a `track` prop) in the instructor view only. NOTE:
    like all client-side content it IS readable in the public JS bundle — DK accepted
    this trade-off.
- **Supabase**: project client in `src/integrations/supabase/client.ts` (shared DK
  training project `zpblcnhnndhajekljide`, same as the tobacco and automotive apps).
  Table **`team_submissions_pharma`** (id, created_at, team_name, submission_time,
  **responses jsonb**) — SQL in `supabase-table.sql` (PACK_CONVENTIONS template;
  **HUMAN STEP: DK must run it once**). `types.ts` is hand-slimmed to just this table.
  **Insert failure is silent by design** (never-fail training-room contract):
  submission always also writes localStorage `teamSubmission_pha_*`, and the
  instructor view merges Supabase + localStorage and dedupes. Offline submissions are
  visible only on the submitting machine. Until the table exists the app is
  localStorage-only.
- Stale-autosave guard: responses restore as `{...emptyResponses(), ...saved}` and all
  renders use `responses[id]?.field` — a saved state from an older problem set must
  never crash the page.
- Login gates: family gate in `App.tsx`/`LoginGate.tsx` — user `mes`, default password
  `dec25` (localStorage `mesQuizPharmaPass`), instructor code `1208`, session flag
  `mesQuizPharmaAuth`. Instructor dashboard password `1208`
  (`InstructorLogin.tsx`), session flag `instructorLoggedInPha`.
- localStorage keys: `phaPlantTeamName`, `phaPlantTrack`, `phaPlantResponses`,
  `phaPlantSubmissionTime`, `teamSubmission_pha_<team>_<ts>`. JSON export file:
  `pharma_mes_alert_submissions_<date>.json`.

## Domain rules from DK (owner) — MUST respect

- Fictional company/products only (Helvion Pharma; Cardexil CDX-10 / CDX-20 /
  CDX-10-EXP, Zentrix ZTX-50, Femodyl FEM-2.5). Canonical IDs/machines from
  PHARMA-MES-CONTEXT.md (FBD2, PR3/CO1/BL3/CR3, PR5/CO5/BL5/CR5, CP1, PZ1, EG-PKG-01,
  HP2-SER, HP2-HIST, TabCountK = kilo-tablets, WeightTmg = tenths of mg, state words
  1=Running…6=Idle, faults 3104/5203/2205/4408). Never invent parallel IDs.
- Regulatory honesty: EU FMD mandates commissioning/verification, NOT aggregation —
  Helvion aggregates for warehouse efficiency/DSCSA-readiness (problem3 says so).
- **Never build Tailwind classes from template strings** (`grid-cols-${n}`,
  `bg-${x}-100`) — custom tokens are invisible to the JIT scanner. Use literal
  lookups (`TAB_GRID_CLASS`).
- Theme (the seam): pack palette indigo (business) + teal (MES) + mist surface.
  Custom vars `--pha-*` (`--pha-indigo`, `--pha-teal`, `--pha-deep`, `--pha-light`,
  `--pha-accent`, `--pha-danger`, `--pha-success`) and utility classes `.pha-gradient`,
  `.pha-gradient-teal`, `.pha-text`, `.pha-text-teal`, `.pha-bg`, `.pha-*-text` in
  `src/index.css`; ramps `biz` (indigo) / `mes` (teal) / `mist` in
  `tailwind.config.ts` (used only by `LoginGate.tsx`). Icon: lucide `Pill`.
  Favicon pair = pack capsule glyph in `public/`.

## Stack & commands

```bash
npm install                # if it hangs: ipconfig → npm install --local-address=<Wi-Fi IPv4>
                           # (this copy reused the donor's node_modules via robocopy)
npm run dev                # port 8082
npm run build              # vite build only — NO type check!
npx tsc -p tsconfig.app.json --noEmit   # run this too; TS strict is OFF
```

Deploy (when DK says go) = `git push` to main (Netlify auto-builds via netlify.toml).
Do NOT use the Netlify MCP deploy tool (upload proxy 404s). PowerShell multiline
commits: `git commit -F <tempfile>`.

## Verification

`npm run build` + `npx tsc --noEmit` must pass; dist CSS must contain `.pha-gradient`
and `.grid-cols-4`. Browser smoke (localhost:8082): gate (wrong pw errors,
`mes`/`dec25` enters, code `1208` changes password) → welcome shows "3 Problems" /
"4 Problems" per track → scenario: tabs, hint chips (standard), 11-function
collapsible, autosave survives reload, stale autosave doesn't crash, incomplete submit
names missing fields and jumps to the first incomplete tab, full submit POSTs to
`team_submissions_pharma` (check Network 201 — the toast is optimistic; 404 until DK
creates the table) → confirmation → instructor `1208`: submissions render with track
badges, Model Answers tab renders both tracks + summary + 5 debrief questions, Export
PDF opens the print dialog, Export downloads JSON → offline submit still reaches
confirmation via localStorage.
