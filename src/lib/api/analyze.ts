import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/components/RoleSelector";

export interface CategoryScores {
  codeQuality: number;
  projectStructure: number;
  documentation: number;
  testing: number;
  realWorldApplicability: number;
  gitHygiene: number;
}

export interface RoadmapItem {
  action: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  reason: string;
}

export interface EvaluationResult {
  score: number;
  tier: "Not Ready" | "Emerging" | "Hire-Approaching" | "Role-Ready";
  badge: "bronze" | "silver" | "gold" | "none";
  summary: string;
  strengths: string[];
  gaps: string[];
  roadmap: RoadmapItem[];
  categoryScores: CategoryScores;
}

export interface AnalysisResponse {
  success: boolean;
  evaluation: EvaluationResult;
  repoMeta: {
    name: string;
    language: string;
    stars: number;
  };
  error?: string;
}

export async function analyzeRepository(
  repoUrl: string,
  role: Role
): Promise<AnalysisResponse> {
  const { data, error } = await supabase.functions.invoke<AnalysisResponse>(
    "analyze-repo",
    {
      body: { repoUrl, role },
    }
  );

  if (error) {
    throw new Error(error.message || "Failed to analyze repository");
  }

  if (!data) {
    throw new Error("No response from analysis");
  }

  if (!data.success && data.error) {
    throw new Error(data.error);
  }

  return data;
}
