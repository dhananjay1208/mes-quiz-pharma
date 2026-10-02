// The Plant 2 Alert — problem sets (Helvion Pharma, Plant 2 Lakeworth; OSD tablets).
// ALL activity content lives in src/data/*.ts. Two difficulty tracks share one app:
//   standard — 3 beginner-friendly problems, ONE failure each, jargon glossed, hints
//   advanced — 4 practitioner problems (multi-layered, pack-canon IDs)
// The problem count is derived from the active set everywhere (worksheet tabs,
// validation, instructor view). To add a problem: edit this file + modelAnswers.ts.
// Problem ids key the autosave and the Supabase jsonb rows — never rename existing
// ids. The two tracks use DISJOINT id prefixes (std* vs problem*) so the instructor
// view can infer a submission's track from its response keys (no schema change).
// Every machine code, id, spec and number comes from Apps\PHARMA-MES-CONTEXT.md.

export type Track = "standard" | "advanced";

export type ProblemResponse = {
  diagnosis: string;
  mesFunction: string;
  solution: string;
  dataIntegrations: string;
};

export type ResponsesMap = Record<string, ProblemResponse>;

export type Problem = {
  id: string;
  title: string;
  icon: string;
  description: string;
  hint?: string; // shown as a "MES functions to consider" chip (standard track)
};

export const FIELD_LABELS: Record<keyof ProblemResponse, string> = {
  diagnosis: "Diagnosis",
  mesFunction: "MES Functions",
  solution: "Solution Pitch",
  dataIntegrations: "Data / Integrations",
};

export const TRACK_META: Record<
  Track,
  { label: string; tagline: string; duration: string; problemCount: number }
> = {
  standard: {
    label: "Standard",
    tagline: "New to MES — shorter problems with hints",
    duration: "30 minutes",
    problemCount: 3,
  },
  advanced: {
    label: "Advanced",
    tagline: "Practitioner level — layered, realistic problems",
    duration: "40 minutes",
    problemCount: 4,
  },
};

const STANDARD_PROBLEMS: Problem[] = [
  {
    id: "std1",
    title: "Problem 1: The Moisture Probe That Got Stuck",
    icon: "🌡️",
    description:
      "Our fluid-bed dryer (FBD2) has an inline sensor — an NIR probe — that measures how much moisture is left in the granules while they dry. For days it reported exactly 2.0% — steady as a rock, right on target. Then the QC lab's oven test (which takes hours and runs long after the dryer is done) came back at 2.7%, above our 2.5% limit. The probe window was coated with powder and had simply been repeating its last good reading, and every system believed it. Now nobody can say which batches of granules were dried too wet, so Quality wants everything from the last two weeks put on hold.",
    hint: "Data Collection · Quality Management · Product Tracking & Genealogy",
  },
  {
    id: "std2",
    title: "Problem 2: The Wrong Carton Artwork",
    icon: "🏷️",
    description:
      "Cardexil 10 mg comes in two versions that contain exactly the same tablets: the domestic carton and the EXPORT carton for Italy, which has different artwork, a different language, and a small numbered sticker (a 'bollino') that the Italian health system needs for reimbursement. Last night the crew started the Cardexil EXPORT order on cartoner CR3, but the domestic carton blanks were still in the magazine and no bollino stickers had been fetched. The machine happily packed 18,000 cartons before anyone noticed. A medicine in the wrong carton is a market complaint and a recall, not just waste — and today, catching it depends entirely on an operator's eyes.",
    hint: "Dispatching Production · Resource Allocation & Status · Quality Management",
  },
  {
    id: "std3",
    title: "Problem 3: The Batch-Record Hunt",
    icon: "📦",
    description:
      "A pharmacy reported a suspect carton of Cardexil, and we have to find every carton made from the same blend of powder. Our records live in paper batch records and logbooks: which powder blend went into which tablet press, on which day, into which packaging run, into which cases. It took three people three days to work it out — and because we still weren't sure, we blocked the entire week's production in the quarantine warehouse to be safe. Most of it was perfectly fine, and the Qualified Person (QP) who must sign off every batch before it can be sold refused to sign anything until the picture was clear.",
    hint: "Product Tracking & Genealogy · Data Collection · Document Control",
  },
];

const ADVANCED_PROBLEMS: Problem[] = [
  {
    id: "problem1",
    title: "Problem 1: The Dryer That Lied",
    icon: "🌡️",
    description:
      "Last Tuesday the QC lab's Karl Fischer result on granulation batch GB-1834 came back at 2.7% LOD — the window is 1.5–2.5%, target 2.0%. Yet the inline NIR moisture probe on fluid-bed dryer FBD2 had reported a rock-steady 2.0% for two straight weeks. The probe window was fouled with powder — it kept repeating its last good reading, and historian HP2-HIST recorded every repeat as fresh data. The lab runs hours behind the line, so that granulate was long since milled, lubricated into blend lot BLND-1834, loaded into IBC totes, and partly compressed on PR3 and coated. Wet granulate means sticking, capping, and dissolution failures we can't see. We don't know how many granulation batches ran wet, which blend lots and IBCs they became, or which press runs, coated batches, blister lots, and carton serials consumed them. QA wants everything since the last verified probe calibration on hold.",
  },
  {
    id: "problem2",
    title: "Problem 2: The Changeover Cascade",
    icon: "🔄",
    description:
      "Cadence APS releases a weekly sequence built around the changeover ladder — 20 minutes for a strength change, 2 hours for a product change, 3 hours for a format change, and a 6-hour full clean plus swab sampling and QA release after potent Zentrix 50 mg. But the Line 3 crews quietly swap orders to protect their shift OEE: last week they ran three Cardexil 10 mg domestic orders back-to-back and pushed the CDX-10-EXP order to the night shift — which then stood still for 40 minutes at cartoner CR3 because nobody had staged the Italian VIG-IT-CDX10 vignettes or picked the export carton blanks and leaflets. Meanwhile Line 5 skipped the potent clean owed from Sunday's ZTX-50 run and started Femodyl 2.5 mg on Monday; QA's swab has flagged that batch for Zentrix cross-contamination. Planning found out about all of it on Wednesday.",
  },
  {
    id: "problem3",
    title: "Problem 3: The Pallet Held in Quarantine",
    icon: "📦",
    description:
      "A pallet of Cardexil 10 mg (SSCC 003591230800127456, 48 cases) is stuck in the quarantine warehouse, and the QP refuses to certify batch B-CX-2417: the carton serial numbers were never commissioned to the EU Hub, so a pharmacist scanning any of those cartons would get 'unknown pack' — legally unsellable. That week the aggregation scanner at case packer CP1 was down for a day and a half, so the crew logged case-to-pallet contents on a paper sheet 'to enter later.' Our packaging edge gateway EG-PKG-01 also had a network outage, and nobody can say which commissioning and aggregation events actually reached the site serialization manager HP2-SER and the EU Hub versus stuck in a queue. The wholesaler needs the delivery; three days in, we still can't say exactly which carton UIs are inside those 48 cases.",
  },
  {
    id: "problem4",
    title: "Problem 4: The Counters That Didn't Add Up",
    icon: "🔢",
    description:
      "We piloted the new MES data collection on tablet press PR3, and the numbers make no sense. The shift production report says PR3 produced 1,600 tablets — on a shift where case packer CP1 packed 400 cases of Cardexil, which is 1.6 million tablets. It turns out the integrator mapped TabCountK, the press's legacy counter that counts in thousands of tablets. Average tablet weight is trending at 2,500 in a system that expects around 250 mg — that register turned out to be in tenths of a milligram. And the OEE dashboard for blister machine BL3 shows 92% even though you can hear it stopping on foil splices: the MES polls the PLC every 30 seconds, so the 6-to-9-second micro-stops never appear in the data. QA cannot close the batch yield reconciliation — 400 kg of granulation should be about 1.6 million tablets — so the batch record can't be reviewed, the QP can't release the batch, and the whole go-live is losing credibility.",
  },
];

export const PROBLEM_SETS: Record<Track, Problem[]> = {
  standard: STANDARD_PROBLEMS,
  advanced: ADVANCED_PROBLEMS,
};

// A submission's track is inferred from its response keys (std* ids ⇒ standard);
// rows containing only problem1..4 read as advanced.
export const trackOfResponses = (responses: ResponsesMap): Track =>
  Object.keys(responses).some((k) => k.startsWith("std")) ? "standard" : "advanced";

export const emptyResponses = (track: Track): ResponsesMap =>
  Object.fromEntries(
    PROBLEM_SETS[track].map((p) => [
      p.id,
      { diagnosis: "", mesFunction: "", solution: "", dataIntegrations: "" },
    ])
  );

// Tailwind's JIT scanner only sees literal class names — never build `grid-cols-${n}`.
export const TAB_GRID_CLASS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};
