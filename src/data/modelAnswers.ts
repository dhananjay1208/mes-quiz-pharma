// FACILITATOR MODEL ANSWERS — rendered only inside the instructor view (password-gated).
// Structure mirrors the donor golden master (and the automotive answer key before it):
// per problem — recap, diagnosis root causes, primary/secondary MES functions with
// rationale, solution pitch sections, integrations table, optional data-model sketch;
// plus per-track Without-vs-With summaries and debrief questions.
// Keyed by problem id from problems.ts (std1..3 = standard track, problem1..4 = advanced).
// Every id, machine code, spec and number comes from Apps\PHARMA-MES-CONTEXT.md.
// Internal arithmetic (keep consistent): 10 tablets/blister · 2 blisters/carton · 10
// cartons/bundle · 20 bundles/case = 200 cartons = 4,000 tablets per case; batch = 400 kg
// granulation ≈ 1.6 M tablets (× 250 mg = 400 kg) = 400 cases; 48 cases/pallet.

import type { Track } from "./problems";

export type FunctionPick = { name: string; why: string };
export type PitchSection = { heading: string; points: string[] };
export type IntegrationRow = { source: string; data: string; purpose: string };

export type ModelAnswer = {
  problemId: string;
  recap: string;
  diagnosis: string[];
  primaryFunctions: FunctionPick[];
  secondaryFunctions: FunctionPick[];
  solutionPitch: PitchSection[];
  integrations: IntegrationRow[];
  dataModel?: string;
};

export const MODEL_ANSWERS: Record<string, ModelAnswer> = {
  // ---------- STANDARD (beginner) track ----------
  std1: {
    problemId: "std1",
    recap:
      "The dryer's inline NIR moisture probe fouled and repeated 2.0% for days; the lab's oven test read 2.7% against a 2.5% limit. Nobody can say which granulation batches were dried too wet, so two weeks of product face a blanket hold.",
    diagnosis: [
      "A frozen sensor was believed: a reading that never changes on a naturally fluctuating measurement is itself a warning sign, but nothing was watching for it.",
      "No automatic cross-check between the inline probe and the lab test — the gap only surfaced by accident, weeks late, because the lab runs hours behind the dryer.",
      "No link between production data and product: there is no quick way to say which blend lots, press runs, or cartons used the wet granulate — hence the oversized hold.",
    ],
    primaryFunctions: [
      {
        name: "Data Collection/Acquisition",
        why: "Detect a 'stuck' sensor automatically — if a value that should wiggle doesn't change for a set time, mark it invalid and raise an alarm instead of trusting it.",
      },
      {
        name: "Quality Management",
        why: "Automatically compare each lab result against the inline reading for the same granulation batch; when they disagree beyond a limit, open a deviation immediately.",
      },
    ],
    secondaryFunctions: [
      {
        name: "Product Tracking and Genealogy",
        why: "Record which granulation batch became which blend lot, which IBCs, which press run and which cartons, so a bad batch means a precise hold — not a two-week block.",
      },
      {
        name: "Maintenance Management",
        why: "Schedule probe-window cleaning and calibration from its actual behavior (signal variance, run-hours), not just the calendar.",
      },
    ],
    solutionPitch: [
      {
        heading: "Catch the stuck probe in minutes",
        points: [
          "The MES watches every critical sensor for 'flatline' behavior and marks frozen values as invalid instead of recording them as fresh data.",
          "Operators and Quality get an alarm the moment the dryer's probe stops updating — days become minutes, and the dryer end-point is not declared on a dead signal.",
        ],
      },
      {
        heading: "Make the lab and the line agree",
        points: [
          "Each lab moisture result is automatically compared with what the inline probe said for that same granulation batch; a growing gap triggers an investigation before more product is at risk.",
        ],
      },
      {
        heading: "Hold only what's affected",
        points: [
          "Because the MES records granulation batch → blend lot → IBC → press run → cartons as production happens, Quality can hold exactly the affected batches and release everything else to the QP.",
        ],
      },
    ],
    integrations: [
      { source: "Dryer FBD2 PLC / NIR probe", data: "Moisture readings with timestamps, probe status", purpose: "Detect frozen/stale values at the source" },
      { source: "QC lab system (LIMS)", data: "Oven / Karl Fischer moisture results per batch", purpose: "Automatic lab-vs-line comparison per granulation batch" },
      { source: "Electronic batch record", data: "Which granulation batch ran when, on which dryer", purpose: "Targeted holds instead of blanket blocks" },
      { source: "Press and packaging counters", data: "Which press run and cartons consumed which blend lot", purpose: "Precise scope for any hold or recall" },
    ],
  },

  std2: {
    problemId: "std2",
    recap:
      "The Cardexil EXPORT order started on cartoner CR3 with domestic carton blanks still loaded and no Italian bollino stickers fetched; 18,000 cartons were packed in the wrong artwork before a person noticed. Wrong artwork on a medicine is a recall — and today only operator eyes stand in the way.",
    diagnosis: [
      "Starting an order doesn't check materials: the cartoner will run with whatever blanks and leaflets happen to be in the magazine.",
      "The rule 'this order needs the export carton, the Italian leaflet, and a bollino' lives in people's heads and paper schedules, not in a system that can enforce it.",
      "There is no automatic verification after the carton is closed — errors are discovered late and in bulk, not after the first few cartons.",
    ],
    primaryFunctions: [
      {
        name: "Dispatching Production Units",
        why: "The MES sends the order to the cartoner together with its bill of packaging materials — and refuses to let the order start until the right carton blank, leaflet and vignette lots are confirmed on the machine.",
      },
      {
        name: "Resource Allocation and Status",
        why: "Track which carton blanks, leaflets and vignette rolls are staged and loaded at each machine — by barcode scan, not by memory.",
      },
    ],
    secondaryFunctions: [
      {
        name: "Quality Management",
        why: "A camera reads the carton's printed code and artwork mark on every carton; a mismatch stops the machine after a handful of cartons instead of 18,000.",
      },
      {
        name: "Data Collection/Acquisition",
        why: "Scans and camera results are recorded per order — evidence for the batch record, the QP and any inspector.",
      },
    ],
    solutionPitch: [
      {
        heading: "No right materials, no start",
        points: [
          "Loading a pallet of carton blanks or a roll of bollini means scanning its barcode; the MES compares the scan against the order (export vs domestic) and blocks the start on any mismatch.",
          "The same check covers the leaflet and the printed lidding foil — so a market change switches everything together, in one place.",
        ],
      },
      {
        heading: "Verify every carton, stop in seconds",
        points: [
          "A verification camera at the cartoner checks each carton's code and artwork as it is closed; a wrong carton stops the line within seconds and rejects the few bad cartons automatically.",
        ],
      },
      {
        heading: "Prove it afterwards",
        points: [
          "Every order keeps a record of exactly which carton, leaflet and vignette lots were used and what the camera verified — the audit answer is a report in the batch record, not a search.",
        ],
      },
    ],
    integrations: [
      { source: "Barcode scanner at the cartoner", data: "Carton blank / leaflet / vignette lot identity", purpose: "Match loaded materials against the order before start" },
      { source: "Cartoner CR3 PLC", data: "Start/stop interlock signals", purpose: "Physically block a mismatched start; stop on camera alarm" },
      { source: "Carton verification camera", data: "Per-carton code and artwork check result", purpose: "Catch a wrong carton after cartons, not shifts" },
      { source: "ERP", data: "Order market (domestic/export), packaging bill of materials, assigned vignette lot", purpose: "The source of the rule the MES enforces" },
    ],
  },

  std3: {
    problemId: "std3",
    recap:
      "A pharmacy complaint forced a search for every carton made from one blend lot. With paper batch records as the record, the trace took three people three days — the whole week's production was blocked in quarantine to be safe, and the QP would not certify anything until the picture was clear.",
    diagnosis: [
      "Traceability exists only on paper — slow to search, easy to get wrong, and unable to answer 'which cartons came from this blend lot?' directly.",
      "The connections between blend lot, press, day, packaging run and case are reconstructed by hand after the fact instead of being recorded as production happens.",
      "Because the answer is uncertain, the hold has to be far bigger than the real problem — good product waits in quarantine with the bad, and the QP cannot certify with confidence.",
    ],
    primaryFunctions: [
      {
        name: "Product Tracking and Genealogy",
        why: "The MES records the chain blend lot → IBC → press run → coated batch → blister lot → cartons → cases automatically, at the moment production happens.",
      },
      {
        name: "Data Collection/Acquisition",
        why: "Machines, scales and scanners feed those records directly — nobody transcribes anything at the end of a shift.",
      },
    ],
    secondaryFunctions: [
      {
        name: "Document Control",
        why: "The electronic batch record replaces the binders — searchable in seconds, complete, reviewed by exception, and ready for the QP's certification.",
      },
    ],
    solutionPitch: [
      {
        heading: "Record the chain as you produce",
        points: [
          "Every case is linked to its packaging run, blister lot, coated batch, press run and blend lot at the moment it is packed — traceability becomes a by-product of running, not extra work.",
        ],
      },
      {
        heading: "Trace in minutes, precisely",
        points: [
          "'Show every carton and case made from blend lot X' becomes one query with a complete answer.",
          "The hold covers exactly those cases; the rest of the week's production goes to the QP and ships normally — and the warehouse knows where each affected case sits.",
        ],
      },
    ],
    integrations: [
      { source: "Press / blister / cartoner PLCs", data: "Run identity, counts, timestamps", purpose: "Automatic production records per run" },
      { source: "Case and pallet scanners", data: "Which cases came from which packaging run", purpose: "Forward trace from blend lot to shippable units" },
      { source: "Material / batch system (ERP)", data: "Blend lot and IBC identities and usage", purpose: "The root of the genealogy chain" },
      { source: "Warehouse system (WMS)", data: "Current location and status of affected cases", purpose: "Fast, targeted retrieval and a clean hold in quarantine" },
    ],
  },

  // ---------- ADVANCED (practitioner) track ----------
  problem1: {
    problemId: "problem1",
    recap:
      "Inline NIR moisture probe on fluid-bed dryer FBD2 froze at 2.0% LOD for two weeks; the lab's Karl Fischer on granulation batch GB-1834 read 2.7% against a 1.5–2.5% window. Historian HP2-HIST recorded the frozen value as fresh data. Affected granulation batches, blend lots, IBCs, press runs, coated batches, blister lots and carton serials are unknown; QA wants everything since the last verified calibration on hold.",
    diagnosis: [
      "Stale/frozen sensor data was trusted: the probe repeated its last good reading and nothing in the chain flagged it. A physically noisy signal (moisture at the dryer's exhaust) that does not change at all for hours is itself an alarm condition.",
      "No flatline rule, stale-data timeout, or plausibility limits on a critical quality attribute — data quality was assumed, never checked at acquisition. The dryer's end-point was declared on a dead signal, batch after batch.",
      "Inline probe and lab reference (LOD oven / Karl Fischer, hours behind the line) were never systematically reconciled, so a growing gap between them went unnoticed.",
      "Quality disposition is decoupled from genealogy: there is no fast way to map a suspect granulation batch forward through blend lots and IBCs to press runs, coated batches, blister lots and carton UIs — hence the blanket two-week hold.",
      "Probe calibration/cleaning state is not tied to data validity: readings kept counting as good after the probe window was fouled. In GxP terms the batch record now contains a critical process parameter that was never really measured — a data-integrity finding, not just a process one.",
    ],
    primaryFunctions: [
      {
        name: "Data Collection/Acquisition",
        why: "Flatline and stale-data detection, plausibility limits, and sensor-health flags applied at acquisition time — bad data must LOOK bad in the eBR, not good.",
      },
      {
        name: "Quality Management",
        why: "SPC on LOD, automatic lab-vs-inline reconciliation per granulation batch, and automatic holds on affected material (and everything downstream of it) when either source breaches.",
      },
      {
        name: "Product Tracking and Genealogy",
        why: "Forward trace in minutes: granulation batch → blend lot → IBCs → press run → coated batch → blister lot → carton UI ranges → cases/pallets. Turns a two-week blanket hold into a surgical one.",
      },
    ],
    secondaryFunctions: [
      {
        name: "Process Management",
        why: "The dryer end-point logic should refuse to complete on an INVALID input — interlock on data quality, not just on value.",
      },
      {
        name: "Maintenance Management",
        why: "Probe-window cleaning and calibration PMs driven by validity statistics and run-hours, with calibration state visible to quality decisions and the batch record.",
      },
    ],
    solutionPitch: [
      {
        heading: "Trustworthy acquisition (bad data must look bad)",
        points: [
          "Flatline rule on FBD2's NIR tag: if a noisy signal changes less than a deadband for N minutes, the MES marks the tag INVALID, alarms, and excludes it from the end-point decision and from the eBR as a measured value.",
          "Stale-data timeout: no fresh sample within the expected interval → quality code BAD, not last-value-carried-forward.",
          "Plausibility limits at the source (e.g. 0.5–8% LOD window for the drying phase); out-of-window values are quarantined with the reading, timestamp, and probe state.",
        ],
      },
      {
        heading: "Inline + lab reconciliation",
        points: [
          "Every LOD-oven / Karl Fischer result is automatically paired with the inline end-point value for the same granulation batch; a divergence beyond the allowed offset opens a deviation and flags the probe.",
          "The lab's hours-behind reality is accepted and designed for: inline controls the process, the lab audits the inline — the MES closes that loop instead of leaving it to chance.",
        ],
      },
      {
        heading: "Surgical containment instead of a blanket hold",
        points: [
          "One genealogy query: all granulation batches dried on FBD2 since the last verified calibration → the blend lots and IBCs they became → the press runs that drew from those IBCs → the coated batches, blister lots and exact carton UI ranges and case/pallet SSCCs.",
          "Hold is placed at batch/IBC/case level with full audit trail. Granulate and tablets look identical — only the data knows which cartons are affected; the QP gets a defensible list, not a guess.",
        ],
      },
      {
        heading: "Prevention",
        points: [
          "SPC on LOD catches drift toward the window edge before a spec breach.",
          "Probe cleaning PM triggered by condition (validity statistics, signal variance collapse) rather than calendar only; calibration state is a prerequisite recorded in the eBR.",
        ],
      },
    ],
    integrations: [
      { source: "FBD2 PLC / NIR analyzer", data: "LOD %, sample timestamp, probe status & validity code", purpose: "OPC UA ~1 s; flatline/stale rules applied at acquisition" },
      { source: "Plant historian HP2-HIST", data: "Raw LOD traces with quality codes", purpose: "Drift analysis, audit trail of what the plant believed vs measured" },
      { source: "LIMS / QC lab", data: "LOD oven / Karl Fischer results per granulation batch", purpose: "Automatic lab-vs-inline reconciliation, deviation trigger" },
      { source: "Blender BLD1 / IBC tracking", data: "Which IBCs received which blend lot, timestamps", purpose: "Forward genealogy from dryer to compression" },
      { source: "Press / blister / serialization station", data: "Run IDs, IBC consumption, carton UI ranges", purpose: "Trace suspect granulate to sellable units for surgical hold" },
      { source: "CMMS", data: "Probe calibration & cleaning records", purpose: "Tie data validity window to verified calibration state" },
    ],
    dataModel:
      "GranulationBatch GB-1834 → DryerRun { FBD2, start/end, LOD_inline (end-point + quality code), LOD_lab (KF), probe_calibration_state } → BlendLot BLND-1834 → IBC-00xx → PressRun PR3-0724-A { tooling set } → CoatedBatch B-CX-2417 { CS-118 } → BlisterLot { FL-2216 } → Carton UI range → Bundle → Case → Pallet SSCC",
  },

  problem2: {
    problemId: "problem2",
    recap:
      "Cadence APS releases a weekly sequence built on the changeover ladder (20 min strength / 2 h product / 3 h format / ~6 h + lab after ZTX-50). Line 3 crews re-sequence to protect shift OEE: CDX-10-EXP pushed to nights, CR3 then stood 40 minutes without staged VIG-IT-CDX10 vignettes or export blanks; Line 5 skipped the potent clean owed after Sunday's ZTX-50 run and Monday's FEM-2.5 batch is flagged for cross-contamination. Planning found out on Wednesday.",
    diagnosis: [
      "Local KPIs beat the plan: crews optimize their shift's OEE while the plant pays with extra changeovers, a vignette stockout, and a skipped potent clean — classic silo optimization.",
      "The released APS sequence is advisory, not enforced: nothing on the floor prevents or even records an order swap until days later.",
      "Order start is not gated on materials readiness: an export run could begin with no VIG-IT-CDX10 vignettes, export carton blanks or Italian leaflets staged at CR3 (domestic and export packaging differ — running the wrong ones is a market recall, not just waste).",
      "The potent clean after Zentrix is a rule in a planner's head, not an interlock — skipping it was physically possible and invisible until QA's swab came back. In GMP terms that is a cross-contamination event with a written-off batch and a deviation, not a scheduling slip.",
      "No timely actuals feedback: Planning operates blind for days, so the APS keeps planning from a fictional plant state.",
    ],
    primaryFunctions: [
      {
        name: "Operations/Detail Scheduling",
        why: "The MES receives and validates the Cadence APS sequence, enforces it on the floor, and reports actuals back. Key boundary: the MES does NOT re-sequence — it makes the released sequence real and makes deviations visible and deliberate.",
      },
      {
        name: "Dispatching Production Units",
        why: "Next-order control per line: press, coater, blister machine, cartoner and serialization station all receive the same order in the released sequence — an out-of-sequence start requires a supervisor exception with a reason code.",
      },
    ],
    secondaryFunctions: [
      {
        name: "Resource Allocation and Status",
        why: "Materials-readiness gate: VIG-IT-CDX10 vignette lot, export carton blanks, Italian leaflets, foil lot staged and verified before the order is allowed to start; equipment clean status (clean / dirty / clean-released) tracked as a resource state.",
      },
      {
        name: "Quality / Process Management",
        why: "Potent clean as a hard interlock: no recorded clean, swab results and QA release → no non-Zentrix batch start on Line 5 (PR5/CO5/BL5/CR5).",
      },
      {
        name: "Performance Analysis",
        why: "Schedule adherence per line/shift alongside OEE, plus changeover actuals vs the ladder model — so following the plan stops hurting the crew's numbers.",
      },
    ],
    solutionPitch: [
      {
        heading: "One sequence, enforced",
        points: [
          "MES receives the APS release and runs feasibility checks before accepting: order released in ERP, blend available in IBCs within hold time, equipment clean status compatible, changeover rules respected, materials ready.",
          "Dispatching offers exactly the next order in sequence. Deviating requires a supervisor-level exception with a reason code — captured in the moment, visible to Planning immediately, not on Wednesday.",
        ],
      },
      {
        heading: "Materials readiness as a start condition",
        points: [
          "Before the CDX-10-EXP run can start, the MES verifies the VIG-IT-CDX10 vignette lot, export carton blanks and Italian leaflets are staged at CR3 (scanned into the line-side location).",
          "Missing materials block the order while there is still time to react — the 40-minute stand-still becomes a proactive warehouse task an hour earlier.",
        ],
      },
      {
        heading: "The potent clean as an interlock, not a memo",
        points: [
          "The post-Zentrix clean is a tracked work order with a checklist; Line 5 cannot start Femodyl or anything else until clean completion, swab sampling and QA release are recorded — and the equipment status flips to clean-released.",
          "Line 5's segregated equipment (PR5/CO5/BL5/CR5) is modeled as such: the MES will never offer a Zentrix order to Line 3 equipment, and the FEM-2.5 cross-contamination flag becomes structurally impossible.",
        ],
      },
      {
        heading: "Close the loop with Planning",
        points: [
          "Actual start/end times, changeover durations, clean durations (incl. lab wait) and exceptions flow back to Cadence daily (or near-real-time), so the next plan starts from reality.",
          "Dashboards show schedule adherence % per line and shift next to OEE; the changeover ladder model is recalibrated from actuals.",
        ],
      },
    ],
    integrations: [
      { source: "Cadence APS (Northline Planning Systems)", data: "Released sequence, order attributes, changeover model", purpose: "Download + validate; actuals and exceptions fed back — never re-sequenced by the MES" },
      { source: "ERP", data: "Process orders, packaging BOM per market, vignette lot assignment", purpose: "Order release status, consumed-fiscal-material accountability" },
      { source: "Line PLCs (PR3/CO1/BL3/CR3, PR5/CO5/BL5/CR5)", data: "State words (5 = Changeover), run start/end", purpose: "Actual changeover durations, enforcement hooks" },
      { source: "Line-side material scans", data: "Vignette / carton blank / leaflet / foil staging confirmations", purpose: "Materials-readiness gate before order start" },
      { source: "Line HMI / Andon", data: "Next-order display, exception capture", purpose: "Crews see the sequence; deviations need a reason code" },
      { source: "QA system / LIMS", data: "Clean checklist completion, swab results, QA release", purpose: "Potent-clean interlock and first-batch release on Line 5" },
    ],
  },

  problem3: {
    problemId: "problem3",
    recap:
      "Pallet SSCC 003591230800127456 (48 cases of Cardexil 10 mg) held in quarantine: the carton serials of batch B-CX-2417 were never commissioned to the EU Hub, so the QP will not certify. The CP1 aggregation scanner was down 1.5 days (paper fallback 'to enter later') and edge gateway EG-PKG-01 had an outage — nobody knows which commissioning/aggregation events reached HP2-SER and the Hub vs stuck in a queue. Three days in, no one can say which carton UIs are in the 48 cases.",
    diagnosis: [
      "Aggregation capture had a manual fallback with no reconciliation path: paper sheets mean the physical pallet hierarchy and the recorded hierarchy diverged, and nobody owned closing that gap.",
      "No store-and-forward with delivery acknowledgement: events could be lost in the gateway outage and there is no per-event delivery state to consult — 'sent' and 'acknowledged' were the same thing to everyone.",
      "Batch certification and shipping are not interlocked on commissioning confirmation: the QP had no system view of 'all serials of B-CX-2417 acknowledged by the Hub', so the pallet sat while people guessed.",
      "No monitoring of the event pipeline — queued/sent/acknowledged/failed counts were invisible, so a growing backlog raised no alarm.",
      "Under EU FMD (Delegated Regulation 2016/161) this is not an IT nuisance: a carton whose UI is not in the Hub fails verification at the pharmacy — it is legally unsellable, and the QP cannot certify the batch. (Aggregation itself is not mandated by FMD — Helvion builds it for warehouse efficiency and DSCSA-readiness — but commissioning is.)",
    ],
    primaryFunctions: [
      {
        name: "Product Tracking and Genealogy",
        why: "The hierarchy carton UI → bundle → case → pallet SSCC is MES-owned, machine-captured, and queryable — 'what is in case CS-2417-31?' is one lookup, not an investigation.",
      },
      {
        name: "Data Collection/Acquisition",
        why: "Camera and scanner capture at the serialization station, bundler, case packer and palletizer at machine speed; no scan → no aggregation record → no release.",
      },
    ],
    secondaryFunctions: [
      {
        name: "Document Control",
        why: "Eliminates the paper fallback: every commissioning and aggregation event, exception, and rework is an electronic record with operator, timestamp, and device identity — part of the batch record the QP reviews.",
      },
      {
        name: "Quality Management (batch certification)",
        why: "QP certification is a controlled decision gated on 'reviewed eBR + all serials acknowledged by the EU Hub' — compliance built into the flow, not checked after the pallet is staged.",
      },
    ],
    solutionPitch: [
      {
        heading: "No scan, no ship",
        points: [
          "Commissioning is captured at the serialization station (SER-CR3) and aggregation by fixed scanners at BN3, CP1 and PZ1. If a scanner fails, a managed degraded mode (handheld scan) still captures electronically — paper is never the system of record.",
          "A pallet cannot be released from quarantine until its complete hierarchy (every carton UI → bundle → case → this pallet) exists in the MES and matches the physical build.",
        ],
      },
      {
        heading: "Store-and-forward with acknowledgements",
        points: [
          "The MES / site serialization manager HP2-SER buffers commissioning and aggregation events locally through any EG-PKG-01 or network outage and tracks per-event state: queued → sent → acknowledged by the L4 provider / EU Hub (or failed, with retry).",
          "A pipeline dashboard shows the backlog and oldest unacknowledged event; the batch's 'commissioned %' is visible to QA and the QP in real time.",
        ],
      },
      {
        heading: "Certification interlock on Hub confirmation",
        points: [
          "The QP certification step only opens for a batch whose serials are 100% acknowledged by the EU Hub and whose eBR review is complete; the WMS only offers certified, released pallets to shipping. A pallet that cannot be verified never reaches a truck.",
          "For genuine emergencies there is a controlled exception process with QA and QP sign-off, fully audit-trailed.",
        ],
      },
      {
        heading: "Instant answers for the QP and the authorities",
        points: [
          "Any case or pallet can be exploded to its exact carton UIs in seconds, including capture device, operator, and event timestamps — three days of guessing becomes a 30-second query and a certified report.",
        ],
      },
    ],
    integrations: [
      { source: "Serialization station SER-CR3 (print & verify camera)", data: "Carton UI printed/verified/rejected (GTIN + SN + batch + expiry)", purpose: "Unit-level foundation of the hierarchy; commissioning events" },
      { source: "Aggregation scanners (BN3 / CP1 / PZ1)", data: "Bundle, case, pallet aggregation reads", purpose: "Machine-speed hierarchy capture; degraded-mode handhelds" },
      { source: "Edge gateway EG-PKG-01 → HP2-SER", data: "Event stream with per-event delivery state", purpose: "Store-and-forward through outages; nothing lost, nothing double-sent" },
      { source: "L4 serialization provider / EU Hub (EMVO)", data: "Serial allocations, commissioning + aggregation (EPCIS) events, acknowledgements", purpose: "Serial-authority law: serials only from allocated ranges; per-event ack tracking" },
      { source: "WMS / quarantine warehouse", data: "Pallet status QUARANTINE / RELEASED, release requests", purpose: "No-certification-no-ship interlock" },
      { source: "eBR / QP certification workflow", data: "Batch review status, commissioned %, QP certificate id", purpose: "QP-2417 can only be issued when the Hub has every serial" },
    ],
    dataModel:
      "Carton UI { GTIN 00359123000108, SN 4T7K9DQ2CX41, batch B-CX-2417, exp 2028-06 } → Bundle BN-2417-88 (10 cartons) → Case CS-2417-31 (200 cartons, GTIN 20359123000317) → Pallet SSCC 003591230800127456 (48 cases) → serialization events { type: commission | aggregate, created, sent, ack, hub msg-id } → QP certificate QP-2417 → RELEASED",
  },

  problem4: {
    problemId: "problem4",
    recap:
      "New MES pilot on PR3: shift report says 1,600 'tablets' while CP1 packed 400 cases (1.6 M tablets) — the integrator mapped TabCountK (thousands of tablets). Tablet weight trends at 2,500 in a system expecting ~250 mg (tenths-of-a-milligram register). BL3's OEE shows 92% because 30-second polling never sees the 6–9-second foil-splice stops. The batch yield won't reconcile (400 kg granulation ≈ 1.6 M tablets), the batch record can't be reviewed, the QP can't release — trust in the go-live is collapsing.",
    diagnosis: [
      "Tag-mapping and unit errors shipped to production: TabCountK treated as a tablet counter (×1,000 error) and WeightTmg (tenths of a milligram) treated as milligrams (×10 error). Engineering units were never validated against a reference.",
      "Polling far too slow for the line dynamics: 30-second polling cannot see 6–9-second micro-stops — you must sample at least twice as fast as the shortest event you need to catch. The missing foil-splice stops (fault 5203) silently inflate availability.",
      "No commissioning reconciliation: MES counts were never cross-checked against the press HMI, the blister and cartoner counters, or the case count before the first shift report went out.",
      "KPIs and batch-record entries published from unverified data — and because the errors flattered the numbers (OEE 92%), nobody challenged them. Bad data doesn't look bad; it looks good.",
      "In pharma this is GMP, not cosmetic: the batch record must reconcile yields within limits and every count is subject to data-integrity expectations (Annex 11 / Part 11). An unreconcilable batch cannot be reviewed, certified or sold.",
    ],
    primaryFunctions: [
      {
        name: "Data Collection/Acquisition",
        why: "Correct address mapping against the device catalog, explicit unit scaling per tag, and event-driven subscription (or sufficiently fast polling) — the acquisition layer decides whether anything downstream, including the eBR, can be trusted.",
      },
      {
        name: "Performance Analysis",
        why: "OEE, counts, downtime classification and yield reconciliation that are cross-checked and carry trust indicators — an OEE built on mis-scaled or stale tags must be flagged, not published.",
      },
    ],
    secondaryFunctions: [
      {
        name: "Quality Management",
        why: "Per-tablet weight and compression-force data are only usable for IPC trending, SPC and release decisions when units and sampling are right.",
      },
      {
        name: "Document Control / Batch Record",
        why: "Tablet, carton, case and granulation-kg balances must close for the eBR's yield reconciliation — reconciliation is a production function, not a review-time scramble.",
      },
    ],
    solutionPitch: [
      {
        heading: "Commissioning discipline for every tag",
        points: [
          "Signal test per mapped tag: drive a known state on the machine and compare the MES value against the machine HMI before go-live sign-off — a validated interface, with the evidence in the IQ/OQ package.",
          "A tag dictionary documents address, meaning, engineering unit, and scale (tablets vs TabCountK ×1,000; mg vs WeightTmg ÷10); scaling lives in one governed, change-controlled place.",
        ],
      },
      {
        heading: "Subscribe, don't poll (or poll ≥ 2× the fastest event)",
        points: [
          "Machine states, counters, and faults via OPC UA subscription / report-by-exception with source timestamps — the 6–9-second foil splice becomes a recorded, classified event (fault 5203 → foil splice) instead of invisible availability loss.",
          "Where polling is unavoidable, the rate is derived from the shortest event that must be caught (≤ 3 s here), not from network convenience.",
        ],
      },
      {
        heading: "Reconciliation as a continuous habit",
        points: [
          "MES continuously balances: press tablets vs blisters ×10 vs cartons ×20 vs cases ×4,000, and granulation kg vs tablets produced (≈ 250 mg per tablet → 400 kg ≈ 1.6 M tablets = 400 cases). Persistent deviation opens an investigation automatically.",
          "The batch record's yield reconciliation becomes a standard section drawn from balances that were verified all batch long — not archaeology at review time.",
        ],
      },
      {
        heading: "Trust indicators on every KPI",
        points: [
          "Data-fidelity checks (mapping verified, units verified, sampling adequate, sensor alive) roll up into a trust flag per KPI and per eBR entry; an untrusted OEE is displayed as untrusted.",
          "This rebuilds go-live credibility with QA and the QP: the team can show WHY a number is right, not just assert it.",
        ],
      },
    ],
    integrations: [
      { source: "PR3 PLC (OPC UA, opc.tcp://pr3-plc.hp2.local:4840)", data: "ns=2;s=PR3.Prod.TabCount, TabCountK (×1,000), state word (1=Running…6=Idle), fault codes (3104)", purpose: "Correctly mapped counters + event-driven state/downtime capture" },
      { source: "PR3 force monitoring / IPC bench", data: "Per-tablet compression force, WeightTmg (tenths of mg!), hardness, thickness", purpose: "Unit-verified quality data for IPC trending and SPC" },
      { source: "BL3 / CR3 PLCs", data: "Blister count, carton count, reject counters, fault 5203 foil splice", purpose: "Cross-counter reconciliation and micro-stop capture" },
      { source: "Checkweigher (Modbus TCP)", data: "Carton weight stream", purpose: "Independent mass-balance input" },
      { source: "Plant historian HP2-HIST", data: "High-resolution state/counter traces", purpose: "Micro-stop analysis; evidence base for OEE" },
      { source: "ERP / eBR", data: "Goods movements (261 issue, 101 FG receipt), batch yield limits", purpose: "Granulation kg ↔ tablets ↔ cases yield reconciliation in the batch record" },
    ],
    dataModel:
      "Tag dictionary entry: { machine: PR3, node: ns=2;s=PR3.Prod.TabCountK, meaning: tablets produced, unit: kilo-tablets, scale: ×1,000 tablets, sampling: subscription, verified: 2026-09-26, reference: press HMI counter } → batch balance { press tablets ≙ blisters ×10 ≙ cartons ×20 ≙ cases ×4,000 ≙ granulation kg ÷ 0.00025 } → 400 kg ≙ 1.6 M tablets ≙ 400 cases",
  },
};

export type SummaryRow = { problem: string; without: string; withMes: string };

const STANDARD_SUMMARY: SummaryRow[] = [
  {
    problem: "The Moisture Probe That Got Stuck",
    without: "Frozen reading believed for days; two weeks of granulation batches on hold",
    withMes: "Stuck-probe alarm within minutes; lab-vs-line auto-compared; only affected batches held",
  },
  {
    problem: "The Wrong Carton Artwork",
    without: "18,000 cartons in the wrong artwork before a person noticed — a recall",
    withMes: "Scanned blanks and vignettes must match the order to start; camera stops the line after a handful of cartons",
  },
  {
    problem: "The Batch-Record Hunt",
    without: "Paper trace, 3 people × 3 days, whole week in quarantine, QP won't sign",
    withMes: "One genealogy query; precise hold on exactly the affected cases; the rest certified and shipped",
  },
];

const ADVANCED_SUMMARY: SummaryRow[] = [
  {
    problem: "The Dryer That Lied",
    without: "Frozen probe believed for two weeks; blanket hold of all production since calibration; eBR full of unmeasured values",
    withMes: "Flatline alarm within minutes; lab-vs-inline reconciliation; surgical hold of exact IBCs and carton UI ranges",
  },
  {
    problem: "The Changeover Cascade",
    without: "Silent re-sequencing, 40-min vignette stockout, skipped potent clean, a cross-contaminated batch, Planning learns on Wednesday",
    withMes: "Sequence enforced with materials-readiness and clean-release interlocks; adherence visible per shift; actuals fed back to Cadence",
  },
  {
    problem: "The Pallet Held in Quarantine",
    without: "Paper fallback + unknown event delivery; 3 days to guess what's in 48 cases; QP cannot certify",
    withMes: "No-scan-no-ship + store-and-forward with acknowledgements; any case explodes to its carton UIs in seconds; certification gated on Hub acks",
  },
  {
    problem: "The Counters That Didn't Add Up",
    without: "×1,000 and ×10 unit errors, invisible micro-stops, OEE 92% fiction, batch yield won't reconcile, release stalled",
    withMes: "Verified tag dictionary, ≥2× sampling rule, continuous tablet/carton/case/kg balances, trust flags on KPIs and eBR entries",
  },
];

export const SUMMARY_ROWS: Record<Track, SummaryRow[]> = {
  standard: STANDARD_SUMMARY,
  advanced: ADVANCED_SUMMARY,
};

export const DEBRIEF_QUESTIONS: Record<Track, string[]> = {
  standard: [
    "Which of the three problems would be most expensive in a real plant, and why? What costs are hiding beyond the obvious ones (a recall, a written-off batch, a QP who won't sign)?",
    "Paper records and human eyes failed in all three stories. What is it about paper that breaks down at production speed — and where does paper still make sense in a GMP plant?",
    "For each problem: should the MES warn people, or physically stop the machine? Where would you draw that line, and who decides — production, QA, or the QP?",
    "Every solution depended on data coming from machines, scales and scanners. What happens to each solution if that data is wrong — and how would you know?",
    "In pharma a batch is not sellable until a Qualified Person certifies its reviewed batch record. How does each of the three solutions make that certification faster and safer?",
  ],
  advanced: [
    "Data integrity: 'Bad data doesn't look bad — it looks good.' Where else in this plant could a frozen or mis-scaled signal be quietly poisoning a KPI, an eBR entry, or a release decision?",
    "System boundaries: Cadence APS owns the sequence and the MES enforces it. Why is it dangerous for the MES to start re-sequencing 'helpfully'? Where exactly would you draw that boundary in the design?",
    "Compliance by interlock vs by report: EU Hub commissioning, clean-release after a potent product, and yield reconciliation can be after-the-fact checks or hard interlocks. What are the trade-offs (throughput risk vs regulatory risk), and where would you put each?",
    "Change management: Line 3 crews re-sequenced orders to protect their OEE. What KPI and incentive changes must accompany the MES so operators don't fight the system that exposes them?",
    "Commissioning: write the go-live checklist item that would have caught the TabCountK ×1,000 and WeightTmg ×10 mappings before the first shift report. Who signs it — and where does that evidence live in a validated (Annex 11 / Part 11) system?",
  ],
};
