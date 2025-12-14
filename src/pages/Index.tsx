import { useState } from "react";
import { Header } from "@/components/Header";
import { UrlInput } from "@/components/UrlInput";
import { RoleSelector, Role } from "@/components/RoleSelector";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { ArrowRight, GitBranch, Target, Map, Sparkles, AlertCircle } from "lucide-react";
import { analyzeRepository, EvaluationResult } from "@/lib/api/analyze";
import { toast } from "sonner";

type Step = "input" | "role" | "analyzing" | "results";

export default function Index() {
  const [step, setStep] = useState<Step>("input");
  const [repoUrl, setRepoUrl] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [analysisResult, setAnalysisResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSubmit = (url: string) => {
    setRepoUrl(url);
    setStep("role");
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleAnalyze = async () => {
    if (!selectedRole) return;
    setStep("analyzing");
    setError(null);

    try {
      const response = await analyzeRepository(repoUrl, selectedRole);
      setAnalysisResult(response.evaluation);
      setStep("results");
    } catch (err) {
      console.error("Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Analysis failed";
      setError(errorMessage);
      
      // Show user-friendly toast popup
      if (errorMessage.toLowerCase().includes("not found") || errorMessage.toLowerCase().includes("private") || errorMessage.toLowerCase().includes("404")) {
        toast.error("Unable to Access Repository", {
          description: "This repository either doesn't exist or is set to private. Please enter a valid public GitHub repository URL.",
          duration: 5000,
        });
      } else if (errorMessage.toLowerCase().includes("rate limit")) {
        toast.error("Too Many Requests", {
          description: "We've hit a temporary limit. Please wait a moment and try again.",
          duration: 5000,
        });
      } else if (errorMessage.toLowerCase().includes("connect") || errorMessage.toLowerCase().includes("network")) {
        toast.error("Connection Error", {
          description: "Unable to reach the server. Please check your internet connection and try again.",
          duration: 5000,
        });
      } else {
        toast.error("Something Went Wrong", {
          description: "We couldn't analyze this repository. Please try again or use a different repository.",
          duration: 5000,
        });
      }
      
      setStep("role");
    }
  };

  const handleReset = () => {
    setStep("input");
    setRepoUrl("");
    setSelectedRole(null);
    setAnalysisResult(null);
    setError(null);
  };

  if (step === "results" && analysisResult) {
    return (
      <>
        <Header />
        <AnalysisResults
          repoUrl={repoUrl}
          role={selectedRole!}
          score={analysisResult.score}
          tier={analysisResult.tier}
          badge={analysisResult.badge}
          summary={analysisResult.summary}
          strengths={analysisResult.strengths}
          gaps={analysisResult.gaps}
          roadmap={analysisResult.roadmap}
          onReset={handleReset}
        />
      </>
    );
  }

  if (step === "analyzing") {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto" />
              <GitBranch className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Analyzing Repository</h2>
              <p className="text-sm text-muted-foreground font-mono max-w-sm">
                Fetching repository data and evaluating hiring signals...
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          {step === "input" && (
            <div className="max-w-3xl mx-auto text-center space-y-8 py-16 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Powered Portfolio Review
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  See Your Code Through a{" "}
                  <span className="text-gradient-insight">Recruiter's Eyes</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Repository Mirror evaluates your GitHub projects against real hiring expectations 
                  for the role you're targeting. No fluff — just signal.
                </p>
              </div>

              <div className="max-w-xl mx-auto">
                <UrlInput onSubmit={handleUrlSubmit} />
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
                <div className="p-5 rounded-lg border border-border bg-card/30 text-left space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">Role-Calibrated</h3>
                  <p className="text-sm text-muted-foreground">
                    Scored against the exact signals hiring managers look for.
                  </p>
                </div>
                <div className="p-5 rounded-lg border border-border bg-card/30 text-left space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-insight/10 flex items-center justify-center">
                    <GitBranch className="w-5 h-5 text-insight" />
                  </div>
                  <h3 className="font-semibold text-foreground">Honest Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear strengths, non-negotiable gaps. No sugar-coating.
                  </p>
                </div>
                <div className="p-5 rounded-lg border border-border bg-card/30 text-left space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Map className="w-5 h-5 text-success" />
                  </div>
                  <h3 className="font-semibold text-foreground">Action Roadmap</h3>
                  <p className="text-sm text-muted-foreground">
                    Prioritized steps to go from "interesting" to interview-worthy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Role Selection Step */}
          {step === "role" && (
            <div className="max-w-lg mx-auto py-12 animate-slide-up">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Select Target Role</h2>
                  <p className="text-muted-foreground">
                    How should we evaluate your repository?
                  </p>
                </div>

                {error && (
                  <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-destructive">{error}</div>
                  </div>
                )}

                <div className="p-6 rounded-xl border border-border bg-card/50">
                  <RoleSelector
                    selectedRole={selectedRole}
                    onSelectRole={handleRoleSelect}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("input")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    variant="insight"
                    onClick={handleAnalyze}
                    disabled={!selectedRole}
                    className="flex-1"
                  >
                    Start Analysis
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-mono">
            Repository Mirror doesn't judge effort — it evaluates signal.
          </p>
        </div>
      </footer>
    </>
  );
}
