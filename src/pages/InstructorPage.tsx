import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Users, Download, LogOut, ClipboardList, BookOpenCheck, Printer } from "lucide-react";
import Navigation from "@/components/Navigation";
import InstructorLogin from "@/components/InstructorLogin";
import ModelAnswersView from "@/components/ModelAnswersView";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  PROBLEM_SETS,
  TRACK_META,
  TAB_GRID_CLASS,
  trackOfResponses,
  type Track,
  type ResponsesMap,
} from "@/data/problems";

interface TeamResponse {
  teamName: string;
  submissionTime: string;
  responses: ResponsesMap;
}

const InstructorPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teamSubmissions, setTeamSubmissions] = useState<TeamResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [answersTrack, setAnswersTrack] = useState<Track>("standard");
  const { toast } = useToast();

  // PDF export = print with a dedicated stylesheet (see index.css @media print rules).
  const exportAnswersPdf = () => {
    document.body.classList.add("print-model-answers");
    const cleanup = () => document.body.classList.remove("print-model-answers");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
  };

  useEffect(() => {
    // Check if instructor is already logged in (session storage)
    const loggedIn = sessionStorage.getItem("instructorLoggedInPha");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      loadSubmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem("instructorLoggedInPha", "true");
    loadSubmissions();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("instructorLoggedInPha");
  };

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      // Load from Supabase (all machines) …
      let transformedSubmissions: TeamResponse[] = [];
      try {
        const { data, error } = await supabase
          .from("team_submissions_pharma")
          .select("*")
          .order("submission_time", { ascending: false });

        if (!error && data) {
          transformedSubmissions = data.map((row) => ({
            teamName: row.team_name,
            submissionTime: row.submission_time,
            // jsonb → app shape; render guards handle rows from older problem sets
            responses: (row.responses ?? {}) as ResponsesMap,
          }));
        }
      } catch (e) {
        console.warn("Supabase not reachable, using localStorage only");
      }

      // … plus local submissions from this machine (offline fallback)
      const localSubmissions: TeamResponse[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("teamSubmission_pha_")) {
          try {
            const submission = JSON.parse(localStorage.getItem(key) || "");
            localSubmissions.push(submission);
          } catch (error) {
            console.error("Error parsing local submission:", error);
          }
        }
      }

      // Combine and deduplicate (prefer Supabase over localStorage)
      const allSubmissions = [...transformedSubmissions, ...localSubmissions];
      const uniqueSubmissions = allSubmissions.filter((submission, index, self) =>
        index === self.findIndex(
          (s) => s.teamName === submission.teamName && s.submissionTime === submission.submissionTime
        )
      );

      uniqueSubmissions.sort(
        (a, b) => new Date(b.submissionTime).getTime() - new Date(a.submissionTime).getTime()
      );

      setTeamSubmissions(uniqueSubmissions);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast({
        title: "Error Loading Submissions",
        description: "There was an error loading team submissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportSubmissions = () => {
    const dataStr = JSON.stringify(teamSubmissions, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `pharma_mes_alert_submissions_${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Show login form if not logged in
  if (!isLoggedIn) {
    return (
      <div>
        <Navigation />
        <InstructorLogin onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 print:hidden">
            <div>
              <h1 className="text-3xl font-bold pha-text">Instructor Dashboard</h1>
              <p className="text-muted-foreground">Team submissions and facilitator model answers</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                <Users className="h-4 w-4 mr-1" />
                {teamSubmissions.length} Teams
              </Badge>
              <Button onClick={loadSubmissions} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={exportSubmissions} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <Tabs defaultValue="submissions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 print:hidden">
              <TabsTrigger value="submissions" className="flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                Team Submissions
              </TabsTrigger>
              <TabsTrigger value="answers" className="flex items-center">
                <BookOpenCheck className="h-4 w-4 mr-2" />
                Model Answers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submissions">
              {teamSubmissions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {isLoading ? "Loading..." : "No Submissions Yet"}
                    </h3>
                    <p className="text-muted-foreground">
                      {isLoading
                        ? "Please wait while we load the submissions..."
                        : "Team submissions will appear here once they complete the scenario."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {teamSubmissions.map((submission, index) => {
                    const track = trackOfResponses(submission.responses);
                    const problems = PROBLEM_SETS[track];
                    return (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Team: {submission.teamName}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{TRACK_META[track].label}</Badge>
                            <Badge variant="secondary">
                              {new Date(submission.submissionTime).toLocaleString()}
                            </Badge>
                          </div>
                        </CardTitle>
                        <CardDescription>
                          Submitted their MES rescue plan · {TRACK_META[track].label} level
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue={problems[0].id} className="w-full">
                          <TabsList className={`grid w-full ${TAB_GRID_CLASS[problems.length]}`}>
                            {problems.map((problem, i) => (
                              <TabsTrigger key={problem.id} value={problem.id}>
                                Problem {i + 1}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {problems.map((problem) => (
                            <TabsContent key={problem.id} value={problem.id} className="space-y-4">
                              <h3 className="font-semibold text-lg">{problem.title}</h3>

                              <div className="grid gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Diagnosis:</h4>
                                  <div className="p-3 bg-muted rounded-lg text-sm">
                                    {submission.responses[problem.id]?.diagnosis || "No response provided"}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">MES Functions:</h4>
                                  <div className="p-3 bg-muted rounded-lg text-sm">
                                    {submission.responses[problem.id]?.mesFunction || "No response provided"}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Solution:</h4>
                                  <div className="p-3 bg-muted rounded-lg text-sm">
                                    {submission.responses[problem.id]?.solution || "No response provided"}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Data/Integrations:</h4>
                                  <div className="p-3 bg-muted rounded-lg text-sm">
                                    {submission.responses[problem.id]?.dataIntegrations || "No response provided"}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>
                      </CardContent>
                    </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="answers">
              <div className="flex items-center justify-between mb-4 print:hidden">
                <div className="flex items-center space-x-1 rounded-md bg-muted p-1">
                  <Button
                    variant={answersTrack === "standard" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setAnswersTrack("standard")}
                  >
                    Standard ({TRACK_META.standard.problemCount})
                  </Button>
                  <Button
                    variant={answersTrack === "advanced" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setAnswersTrack("advanced")}
                  >
                    Advanced ({TRACK_META.advanced.problemCount})
                  </Button>
                </div>
                <Button onClick={exportAnswersPdf} variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <ModelAnswersView track={answersTrack} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InstructorPage;
