# The Plant 2 Alert — MES Team Activity (Pharma Edition)

Team-based MES training activity for oral-solid-dose (tablet) pharmaceutical
manufacturing, set in the fictional **Helvion Pharma, Plant 2 Lakeworth**.
Deliverable #9 of the pharma MES training pack — ported from the tobacco golden master
("The Plant 4 Alert").

Teams pick a track — **Standard** (3 beginner problems with hints) or **Advanced**
(4 layered practitioner problems: frozen NIR moisture probe on the fluid-bed dryer,
changeover cascade against the APS plan with a skipped potent clean, a pallet held in
quarantine because its carton serials never reached the EU Hub, mis-mapped press
counters) — then answer 4 questions per problem: diagnosis, critical MES functions,
solution pitch, and data/integrations. Submissions go to Supabase (with a
localStorage offline fallback). A password-gated instructor dashboard shows all team
submissions plus facilitator model answers with PDF export.

## Run

```sh
npm install        # if it hangs: npm install --local-address=<Wi-Fi IPv4>
npm run dev        # http://localhost:8082
npm run build      # production build (NO type check)
npx tsc -p tsconfig.app.json --noEmit   # run this too
```

## Logins

- App gate: username `mes`, password `dec25` (instructor code `1208` sets a new password)
- Instructor dashboard (`#/instructor`): password `1208`

## Tech

Vite 5 · React 18 · TypeScript · Tailwind · shadcn/ui · HashRouter · Supabase
(table `team_submissions_pharma`, jsonb responses — create it once with
`supabase-table.sql`). All activity content lives in `src/data/*.ts` — see
`CLAUDE.md` for the architecture contract and `../PHARMA-MES-CONTEXT.md` for the world.
