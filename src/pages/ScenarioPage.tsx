import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Save, AlertTriangle, Pill, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import {
  PROBLEM_SETS,
  TRACK_META,
  FIELD_LABELS,
  TAB_GRID_CLASS,
  emptyResponses,
  type Track,
  type ProblemResponse,
  type ResponsesMap,
} from "@/data/problems";
import { MES_FUNCTIONS } from "@/data/mesFunctions";

const ScenarioPage = () => {
  // Track is chosen on the welcome page; localStorage is synchronous, so resolve it
  // in the initializers (missing/invalid → redirect in the effect below).
  const [track] = useState<Track | null>(() => {
    const t = localStorage.getItem("phaPlantTrack");
    return t === "standard" || t === "advanced" ? (t as Track) : null;
  });
  const problems = track ? PROBLEM_SETS[track] : [];
  const [teamName, setTeamName] = useState("");
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responses, setResponses] = useState<ResponsesMap>(() =>
    track ? emptyResponses(track) : {}
  );
  const [activeTab, setActiveTab] = useState(() => (track ? PROBLEM_SETS[track][0].id : ""));
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedTeamName = localStorage.getItem("phaPlantTeamName");
    if (!savedTeamName || !track) {
      navigate("/");
      return;
    }
    setTeamName(savedTeamName);

    // Restore autosaved responses; merge over a fresh map so a stale save from an
    // older or different problem set can never leave a problem id undefined.
    const savedResponses = localStorage.getItem("phaPlantResponses");
    if (savedResponses) {
      try {
        setResponses({ ...emptyResponses(track), ...JSON.parse(savedResponses) });
      } catch {
        // corrupted autosave — start fresh
      }
    }
  }, [navigate, track]);

  const handleResponseChange = (problemId: string, field: keyof ProblemResponse, value: string) => {
    setResponses((prev) => {
      const next = {
        ...prev,
        [problemId]: {
          ...(prev[problemId] ?? { diagnosis: "", mesFunction: "", solution: "", dataIntegrations: "" }),
          [field]: value,
        },
      };
      localStorage.setItem("phaPlantResponses", JSON.stringify(next));
      return next;
    });
  };

  const handleSubmit = async () => {
    // Precise validation: name every empty field and jump to the first incomplete tab.
    const fieldKeys = Object.keys(FIELD_LABELS) as (keyof ProblemResponse)[];
    const missing = problems.flatMap((p, i) =>
      fieldKeys
        .filter((f) => !responses[p.id]?.[f]?.trim())
        .map((f) => ({ problemId: p.id, label: `Problem ${i + 1}: ${FIELD_LABELS[f]}` }))
    );

    if (missing.length > 0) {
      setActiveTab(missing[0].problemId);
      toast({
        title: `${missing.length} field${missing.length > 1 ? "s" : ""} still empty`,
        description:
          missing.slice(0, 5).map((m) => m.label).join(" · ") +
          (missing.length > 5 ? " …" : ""),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionTime = new Date().toISOString();

      // Save to Supabase; a failure is logged but never blocks the training room.
      const { error } = await supabase.from("team_submissions_pharma").insert({
        team_name: teamName,
        submission_time: submissionTime,
        responses,
      });
      if (error) {
        console.warn("Supabase insert failed — localStorage fallback only:", error.message);
      }

      // Always keep a local backup (offline fallback + same-machine instructor view).
      localStorage.setItem("phaPlantSubmissionTime", submissionTime);
      localStorage.setItem(
        `teamSubmission_pha_${teamName}_${Date.now()}`,
        JSON.stringify({ teamName, submissionTime, responses })
      );

      toast({
        title: "Success!",
        description: "Your team responses have been submitted successfully.",
        variant: "default",
      });
      navigate("/confirmation");
    } catch (error) {
      console.error("Error submitting responses:", error);
      // Network-level failure: still submit via localStorage (never-fail contract).
      const submissionTime = new Date().toISOString();
      localStorage.setItem("phaPlantSubmissionTime", submissionTime);
      localStorage.setItem(
        `teamSubmission_pha_${teamName}_${Date.now()}`,
        JSON.stringify({ teamName, submissionTime, responses })
      );
      toast({
        title: "Success!",
        description: "Your team responses have been submitted successfully.",
        variant: "default",
      });
      navigate("/confirmation");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!teamName || !track) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">Step 2 of 3</Badge>
                  <Badge variant="secondary">{TRACK_META[track].label} level</Badge>
                </div>
                <h1 className="text-3xl font-bold pha-text">Helvion Plant 2 Alert</h1>
                <p className="text-xl text-muted-foreground">Team: {teamName}</p>
              </div>
              <Pill className="h-12 w-12 text-[hsl(var(--pha-indigo))]" />
            </div>
          </div>

          {/* Scenario Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-[hsl(var(--pha-danger))]" />
                <span>The Situation</span>
              </CardTitle>
              <CardDescription>
                Good morning, Task Force. Helvion Pharma's Plant 2 Lakeworth is in trouble.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {problems.map((problem) => (
                  <div key={problem.id} className="p-4 border rounded-lg pha-bg">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{problem.icon}</span>
                      <h3 className="font-semibold">{problem.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* MES Function Reference */}
          <Card className="mb-6">
            <Collapsible open={isReferenceOpen} onOpenChange={setIsReferenceOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50">
                  <CardTitle className="flex items-center justify-between">
                    <span>Key MES Functions (Reference)</span>
                    {isReferenceOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="grid gap-4">
                    {MES_FUNCTIONS.map((func, index) => (
                      <div key={index} className="p-4 rounded-lg bg-muted/30 border">
                        <div className="flex items-start space-x-3">
                          <Target className="h-5 w-5 text-[hsl(var(--pha-indigo))] mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-base mb-2">{func.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{func.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Response Section */}
          <Card>
            <CardHeader>
              <CardTitle>Team Response Worksheet</CardTitle>
              <CardDescription>
                Complete all sections for each problem. Your responses are automatically saved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className={`grid w-full ${TAB_GRID_CLASS[problems.length]}`}>
                  {problems.map((problem, index) => (
                    <TabsTrigger key={problem.id} value={problem.id}>
                      Problem {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {problems.map((problem) => (
                  <TabsContent key={problem.id} value={problem.id} className="space-y-6">
                    <div className="p-4 border rounded-lg pha-bg">
                      <h3 className="font-bold text-lg mb-2">{problem.title}</h3>
                      <p className="text-muted-foreground">{problem.description}</p>
                    </div>

                    {problem.hint && (
                      <div className="p-3 rounded-lg border border-[hsl(var(--pha-teal))]/40 bg-[hsl(var(--pha-accent))]/10 text-sm">
                        <span className="font-semibold">💡 Hint — MES functions to consider: </span>
                        {problem.hint}
                      </div>
                    )}

                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`${problem.id}-diagnosis`} className="text-base font-semibold">
                          Our Diagnosis of the Key Problem(s):
                        </Label>
                        <Textarea
                          id={`${problem.id}-diagnosis`}
                          value={responses[problem.id]?.diagnosis ?? ""}
                          onChange={(e) => handleResponseChange(problem.id, "diagnosis", e.target.value)}
                          placeholder="What do you think is the root cause of this problem?"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${problem.id}-mesFunction`} className="text-base font-semibold">
                          Critical MES Function(s) We'd Use:
                        </Label>
                        <Textarea
                          id={`${problem.id}-mesFunction`}
                          value={responses[problem.id]?.mesFunction ?? ""}
                          onChange={(e) => handleResponseChange(problem.id, "mesFunction", e.target.value)}
                          placeholder="Which MES functions from the reference list would be most important?"
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${problem.id}-solution`} className="text-base font-semibold">
                          How MES Solves This (Our Solution Pitch):
                        </Label>
                        <Textarea
                          id={`${problem.id}-solution`}
                          value={responses[problem.id]?.solution ?? ""}
                          onChange={(e) => handleResponseChange(problem.id, "solution", e.target.value)}
                          placeholder="Explain how the MES would address and solve this problem..."
                          className="min-h-[120px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`${problem.id}-data`} className="text-base font-semibold">
                          Key Data / Integrations Needed:
                        </Label>
                        <Textarea
                          id={`${problem.id}-data`}
                          value={responses[problem.id]?.dataIntegrations ?? ""}
                          onChange={(e) => handleResponseChange(problem.id, "dataIntegrations", e.target.value)}
                          placeholder="What data sources, systems, or integrations would be essential? (e.g., press/blister PLCs, NIR probes, serialization cameras, LIMS, APS, ERP, EU Hub)"
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="mt-8 pt-6 border-t">
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full text-lg h-12 pha-gradient hover:opacity-90 transition-opacity"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Submitting..." : "Submit Team Responses"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPage;
