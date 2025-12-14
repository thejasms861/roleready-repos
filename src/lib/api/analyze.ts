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
  const { data, error } = await supabase.functions.invoke(
    "analyze-repo",
    {
      body: { repoUrl, role },
    }
  );

  // Handle edge function errors - the error body is still in data
  if (error) {
    // Try to extract the actual error message from the response
    const errorMessage = data?.error || error.message || "Failed to analyze repository";
    throw new Error(errorMessage);
  }

  if (!data) {
    throw new Error("No response from analysis");
  }
  
  // Check for error in response body (non-2xx that still returned data)
  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.success && data.error) {
    throw new Error(data.error);
  }

  return data;
}
