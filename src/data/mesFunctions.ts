// The 11 ISA-95 / MESA MES functions, described for oral-solid-dose (tablet) manufacturing.
// Keep consistent with Apps\PHARMA-MES-CONTEXT.md (Helvion Pharma, Plant 2 Lakeworth)
// and, once built, Apps\mes-functions-pharma\src\data\registry.js taglines.

export type MesFunction = {
  title: string;
  description: string;
};

export const MES_FUNCTIONS: MesFunction[] = [
  {
    title: "Resource Allocation and Status",
    description:
      "Managing and tracking equipment, materials, and people — granulators, dryers, blenders, IBC totes, presses and tooling sets, blister lines, carton blanks, leaflets, foil lots, export vignettes, and qualified operators — including availability, clean/dirty status, hold-time clocks, and real-time state. In a tablet plant this means knowing which IBC holds which blend lot, whether Line 5 is clean-released after a potent run, and whether the Italian vignettes are actually staged at the cartoner.",
  },
  {
    title: "Operations/Detail Scheduling",
    description:
      "Sequencing and timing batches and packaging runs against finite capacity and changeover rules — the 20-minute strength change, the 2-hour product change, the 3-hour format change, and the 6-hour-plus-lab potent clean. In pharma the sequence usually comes from an external APS (Cadence): the MES validates it, enforces it on the floor, and feeds actual results back — it never re-sequences.",
  },
  {
    title: "Dispatching Production Units",
    description:
      "Controlling the flow of orders, batches, and runs by issuing commands to start, hold, and stop work, with real-time updates. A product change must reach the press, the coater, the blister machine, the cartoner, and the serialization station together — one order, one recipe revision, many systems — and it must not start until materials and clean status are confirmed.",
  },
  {
    title: "Document Control",
    description:
      "Managing and distributing master batch records, recipes (R-CDX-07 v12), SOPs, and compliance records under GMP, EU Annex 11 and 21 CFR Part 11. The electronic batch record (eBR) is the product's twin: every scale print, endpoint, IPC result and signature lands in it, review-by-exception replaces the 12-day paper review, and nothing is sellable until the QP has certified it.",
  },
  {
    title: "Product Tracking and Genealogy",
    description:
      "Building the full genealogy chain: API and excipient lots → granulation batch (binder lot) → blend lot (IBC ids) → compression run (tooling set) → coated batch (coating-suspension lot) → blister lot (film and foil lots) → carton UI → bundle → case → pallet SSCC. Blends and tablets of different strengths look identical — only the data knows — and this chain is what turns a recall into a surgical hold.",
  },
  {
    title: "Performance Analysis",
    description:
      "Comparing actual results to targets: OEE on blister and cartoning lines (the packaging journey 45.0 → 63.5), schedule adherence against the APS plan, batch yield and reconciliation, reject rates, changeover durations, and batch-record cycle time — built on data the plant can actually trust.",
  },
  {
    title: "Labor Management",
    description:
      "Tracking and directing personnel by qualification and GMP training status — qualified hands on qualified equipment, from the dispensing booth to the QP's certification — with shift patterns, training records, electronic signatures, and 'who did what, when' in the audit trail.",
  },
  {
    title: "Maintenance Management",
    description:
      "Planning and executing maintenance and calibration to protect uptime and quality — press punches and dies, blister sealing plates, the cartoner's printhead, balance and NIR-probe calibration, filter changes — triggered by counters, condition data, and calibration due-dates, not just the calendar.",
  },
  {
    title: "Process Management",
    description:
      "Directing and controlling production with recipes, setpoints, loops, and interlocks — granulation endpoint by impeller power, dryer LOD target 2.0% (window 1.5–2.5%), blend revolutions, press compression force, coating spray rate — and hard gates like 'no recorded clean and QA release after Zentrix, no next batch on Line 5.'",
  },
  {
    title: "Quality Management",
    description:
      "Recording, tracking, and analyzing quality at line speed — per-tablet force monitoring and auto-reject on the press, in-process checks every 30 minutes (weight 250 mg ±5%, hardness 80–140 N, thickness), camera fill inspection on the blister machine, DataMatrix verification per carton — and lab results (LOD/Karl Fischer, dissolution, assay) reconciled against inline sensors. Deviations, OOS results, and holds route through genealogy to exactly the affected material.",
  },
  {
    title: "Data Collection/Acquisition",
    description:
      "Monitoring and gathering real-time data from PLCs, NIR probes, the press's force monitoring, checkweighers, and serialization cameras — with correct tag mapping, unit scaling (TabCountK is thousands; WeightTmg is tenths of a milligram), data-quality flags, and polling or subscription rates fast enough for the events that matter. The MES — and the batch record built on it — is only as truthful as its data acquisition.",
  },
];
