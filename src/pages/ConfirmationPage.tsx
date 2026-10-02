import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, RotateCcw, Home } from "lucide-react";
import Navigation from "@/components/Navigation";
import { TRACK_META, type Track } from "@/data/problems";

const ConfirmationPage = () => {
  const [teamName, setTeamName] = useState("");
  const [submissionTime, setSubmissionTime] = useState("");
  const savedTrack = localStorage.getItem("phaPlantTrack");
  const track: Track = savedTrack === "advanced" ? "advanced" : "standard";
  const problemCount = TRACK_META[track].problemCount;
  const navigate = useNavigate();

  useEffect(() => {
    const savedTeamName = localStorage.getItem("phaPlantTeamName");
    const savedSubmissionTime = localStorage.getItem("phaPlantSubmissionTime");

    if (!savedTeamName || !savedSubmissionTime) {
      navigate("/");
      return;
    }

    setTeamName(savedTeamName);
    setSubmissionTime(new Date(savedSubmissionTime).toLocaleTimeString());
  }, [navigate]);

  const handleStartOver = () => {
    localStorage.removeItem("phaPlantTeamName");
    localStorage.removeItem("phaPlantResponses");
    localStorage.removeItem("phaPlantSubmissionTime");
    localStorage.removeItem("phaPlantTrack");
    navigate("/");
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  if (!teamName) return null;

  return (
    <div className="min-h-screen pha-gradient">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <Badge variant="secondary" className="mb-4">
              ✅ MISSION ACCOMPLISHED
            </Badge>
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h1 className="text-4xl font-bold text-white">
                Mission Complete!
              </h1>
            </div>
          </div>

          <Card className="mb-8 animate-fade-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl pha-text">
                Thank you, Team {teamName}!
              </CardTitle>
              <CardDescription className="text-lg">
                Your MES rescue plan for Helvion Pharma's Plant 2 Lakeworth has been submitted successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 pha-bg rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Ready for Debrief</h3>
                <p className="text-muted-foreground mb-4">
                  Prepare to share your brilliant ideas and solutions with the group!
                </p>
                <Badge variant="outline">
                  Submitted at {submissionTime}
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold mb-2">What You Accomplished</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>✓ Analyzed {problemCount} critical tablet-manufacturing problems</li>
                    <li>✓ Identified root causes and MES solutions</li>
                    <li>✓ Proposed data integration strategies</li>
                    <li>✓ Developed a comprehensive rescue plan</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-semibold mb-2">Next Steps</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Present your solutions to the group</li>
                    <li>• Listen to other teams' approaches</li>
                    <li>• Discuss implementation strategies</li>
                    <li>• Learn from different perspectives</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleStartOver}
                  variant="outline"
                  size="lg"
                  className="flex items-center"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Start Over (New Team)
                </Button>
                <Button
                  onClick={handleReturnHome}
                  size="lg"
                  className="pha-gradient hover:opacity-90 transition-opacity"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Return to Welcome
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-white/70">
            <p className="text-lg">
              💊 Helvion Pharma thanks you for your service! 💊
            </p>
            <p className="text-sm mt-2">
              Your expertise has helped save the day and prevent the next Plant 2 crisis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
