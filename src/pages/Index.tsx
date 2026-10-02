import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Target, ArrowRight, Sprout, Factory, Check } from "lucide-react";
import Navigation from "@/components/Navigation";
import { TRACK_META, type Track } from "@/data/problems";

const Index = () => {
  const [teamName, setTeamName] = useState("");
  const [track, setTrack] = useState<Track>("standard");
  const navigate = useNavigate();

  const handleStart = () => {
    if (teamName.trim()) {
      localStorage.setItem("phaPlantTeamName", teamName.trim());
      localStorage.setItem("phaPlantTrack", track);
      navigate("/scenario");
    }
  };

  const meta = TRACK_META[track];

  return (
    <div className="min-h-screen pha-gradient">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <Badge variant="secondary" className="mb-4">💊 MES TRAINING</Badge>
            <h1 className="text-5xl font-bold text-white mb-4">
              The Plant 2 Alert
            </h1>
            <h2 className="text-2xl text-white/90 mb-2">
              MES to the Rescue!
            </h2>
            <p className="text-xl text-white/80">
              Helvion Pharma needs your expertise
            </p>
          </div>

          {/* Main Content Card */}
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl pha-text">
                Welcome, MES Task Force!
              </CardTitle>
              <CardDescription className="text-lg">
                Helvion Pharma's Plant 2 Lakeworth — an oral-solid-dose tablet plant —
                is facing critical problems from granulation to the quarantine warehouse.
                In this activity, your team will diagnose operational problems and propose
                MES-driven solutions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Activity Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 pha-bg rounded-lg">
                  <Clock className="text-[hsl(var(--pha-indigo))] h-8 w-8" />
                  <div>
                    <h3 className="font-semibold">Duration</h3>
                    <p className="text-muted-foreground">{meta.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 pha-bg rounded-lg">
                  <Users className="text-[hsl(var(--pha-indigo))] h-8 w-8" />
                  <div>
                    <h3 className="font-semibold">Team Activity</h3>
                    <p className="text-muted-foreground">Work together</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 pha-bg rounded-lg">
                  <Target className="text-[hsl(var(--pha-indigo))] h-8 w-8" />
                  <div>
                    <h3 className="font-semibold">{meta.problemCount} Problems</h3>
                    <p className="text-muted-foreground">To solve</p>
                  </div>
                </div>
              </div>

              {/* Level selector */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold pha-text">Choose Your Level</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTrack("standard")}
                    className={`text-left p-4 rounded-lg border-2 transition-colors ${
                      track === "standard"
                        ? "border-[hsl(var(--pha-indigo))] pha-bg"
                        : "border-border hover:border-[hsl(var(--pha-indigo))]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Sprout className="h-5 w-5 text-[hsl(var(--pha-success))]" />
                        <span className="font-semibold">Standard</span>
                      </div>
                      {track === "standard" && <Check className="h-5 w-5 text-[hsl(var(--pha-indigo))]" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {TRACK_META.standard.tagline} · {TRACK_META.standard.problemCount} problems
                      · ~{TRACK_META.standard.duration}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTrack("advanced")}
                    className={`text-left p-4 rounded-lg border-2 transition-colors ${
                      track === "advanced"
                        ? "border-[hsl(var(--pha-teal))] pha-bg"
                        : "border-border hover:border-[hsl(var(--pha-teal))]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Factory className="h-5 w-5 text-[hsl(var(--pha-teal))]" />
                        <span className="font-semibold">Advanced</span>
                      </div>
                      {track === "advanced" && <Check className="h-5 w-5 text-[hsl(var(--pha-teal))]" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {TRACK_META.advanced.tagline} · {TRACK_META.advanced.problemCount} problems
                      · ~{TRACK_META.advanced.duration}
                    </p>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold pha-text">Instructions</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[hsl(var(--pha-indigo))] text-white flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                    <span>Work with your team</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[hsl(var(--pha-indigo))] text-white flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                    <span>Read the scenario carefully</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[hsl(var(--pha-indigo))] text-white flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                    <div>
                      <span className="font-semibold">For EACH of the {meta.problemCount} problems presented, identify:</span>
                      <ul className="ml-4 mt-2 space-y-1 text-muted-foreground">
                        <li>• The key underlying issue(s)</li>
                        <li>• Which core MES function(s) would be most critical in addressing it</li>
                        <li>• HOW the MES would solve the problem</li>
                        <li>• What key data or integrations would be essential</li>
                      </ul>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[hsl(var(--pha-indigo))] text-white flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                    <span>Record your team's responses in the provided sections</span>
                  </li>
                </ul>
              </div>

              {/* Team Name Input */}
              <div className="space-y-4 p-6 pha-bg rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="teamName" className="text-lg font-semibold">
                    Enter Your Team Name:
                  </Label>
                  <Input
                    id="teamName"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="e.g., The Granulation Gang"
                    className="text-lg"
                    onKeyDown={e => e.key === 'Enter' && handleStart()}
                  />
                </div>
                <Button
                  onClick={handleStart}
                  disabled={!teamName.trim()}
                  size="lg"
                  className="w-full text-lg h-12 pha-gradient hover:opacity-90 transition-opacity"
                >
                  Let's Get Started!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-white/70">
            <p>Ready to save Plant 2 Lakeworth? Your mission starts now!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
