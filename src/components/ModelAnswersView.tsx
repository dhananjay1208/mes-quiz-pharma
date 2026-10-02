import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, MessageCircleQuestion } from "lucide-react";
import { PROBLEM_SETS, TRACK_META, type Track } from "@/data/problems";
import { MODEL_ANSWERS, SUMMARY_ROWS, DEBRIEF_QUESTIONS } from "@/data/modelAnswers";

interface ModelAnswersViewProps {
  track: Track;
}

// Facilitator-only content: rendered inside the password-gated instructor view.
// The wrapper class `model-answers-print-root` + body.print-model-answers drive the
// PDF export (print stylesheet in index.css).
const ModelAnswersView = ({ track }: ModelAnswersViewProps) => {
  return (
    <div className="space-y-6 model-answers-print-root">
      {/* Print-only header (PDF cover line) */}
      <div className="hidden print:block border-b-2 border-gray-800 pb-3 mb-2">
        <h1 className="text-2xl font-bold">
          The Plant 2 Alert — Facilitator Answer Key
        </h1>
        <p className="text-sm mt-1">
          {TRACK_META[track].label} track · {TRACK_META[track].problemCount} problems ·
          Helvion Pharma, Plant 2 Lakeworth · printed {new Date().toLocaleDateString()}
        </p>
        <p className="text-xs mt-1 italic">
          Facilitator use only — do not distribute to participants before the debrief.
        </p>
      </div>

      <Card className="border-[hsl(var(--pha-teal))]/40 print:hidden">
        <CardHeader>
          <CardTitle className="pha-text-teal">
            Facilitator Model Answers — {TRACK_META[track].label} track
          </CardTitle>
          <CardDescription>
            Reference answers for the debrief — teams are not expected to hit every point.
            Strong submissions identify the root causes, pick sensible primary MES functions,
            and propose concrete integrations.
          </CardDescription>
        </CardHeader>
      </Card>

      {PROBLEM_SETS[track].map((problem) => {
        const answer = MODEL_ANSWERS[problem.id];
        if (!answer) return null;
        return (
          <Card key={problem.id} className="print-break-before">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span className="text-2xl">{problem.icon}</span>
                <span>{problem.title}</span>
              </CardTitle>
              <CardDescription>{answer.recap}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Diagnosis */}
              <div>
                <h4 className="font-semibold text-base mb-2 pha-text">1. Diagnosis — Root Causes</h4>
                <ul className="space-y-2">
                  {answer.diagnosis.map((point, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[hsl(var(--pha-success))] mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* MES Functions */}
              <div>
                <h4 className="font-semibold text-base mb-2 pha-text">2. Critical MES Functions</h4>
                <div className="space-y-2">
                  {answer.primaryFunctions.map((f, i) => (
                    <div key={i} className="p-3 rounded-lg pha-bg border">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className="pha-gradient text-white border-0">Primary</Badge>
                        <span className="font-medium text-sm">{f.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{f.why}</p>
                    </div>
                  ))}
                  {answer.secondaryFunctions.map((f, i) => (
                    <div key={i} className="p-3 rounded-lg border">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline">Secondary</Badge>
                        <span className="font-medium text-sm">{f.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{f.why}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Solution Pitch */}
              <div>
                <h4 className="font-semibold text-base mb-2 pha-text">3. How MES Solves This</h4>
                <div className="space-y-3">
                  {answer.solutionPitch.map((section, i) => (
                    <div key={i}>
                      <h5 className="font-medium text-sm mb-1">{section.heading}</h5>
                      <ul className="ml-4 space-y-1">
                        {section.points.map((point, j) => (
                          <li key={j} className="text-sm text-muted-foreground list-disc">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrations */}
              <div>
                <h4 className="font-semibold text-base mb-2 pha-text">4. Key Data / Integrations</h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>System / Device</TableHead>
                        <TableHead>Data Elements</TableHead>
                        <TableHead>Purpose / Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {answer.integrations.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-sm">{row.source}</TableCell>
                          <TableCell className="text-sm">{row.data}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{row.purpose}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {answer.dataModel && (
                  <div className="mt-3 p-3 rounded-lg bg-muted font-mono text-xs leading-relaxed">
                    {answer.dataModel}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Summary table */}
      <Card className="print-break-before">
        <CardHeader>
          <CardTitle>Summary: Without MES vs With MES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Problem</TableHead>
                  <TableHead>Without MES</TableHead>
                  <TableHead>With MES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SUMMARY_ROWS[track].map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{row.problem}</TableCell>
                    <TableCell className="text-sm text-[hsl(var(--pha-danger))]">{row.without}</TableCell>
                    <TableCell className="text-sm text-[hsl(var(--pha-success))]">{row.withMes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Debrief questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircleQuestion className="h-5 w-5 text-[hsl(var(--pha-teal))]" />
            <span>Discussion Points for Debrief</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {DEBRIEF_QUESTIONS[track].map((q, i) => (
              <li key={i} className="flex items-start space-x-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-[hsl(var(--pha-indigo))] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span>{q}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelAnswersView;
