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
  try {
    // Use fetch directly to get proper error handling
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-repo`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ repoUrl, role }),
      }
    );

    const data = await response.json();

    // Check for error response
    if (!response.ok || data.error) {
      const errorMessage = data.error || "Failed to analyze repository";
      
      // Throw user-friendly errors
      if (errorMessage.includes("not found") || errorMessage.includes("Not Found")) {
        throw new Error("Repository not found. Please check that the URL is correct and the repository is public.");
      }
      if (errorMessage.includes("private")) {
        throw new Error("This repository is private. Repository Mirror can only analyze public repositories.");
      }
      if (errorMessage.includes("rate limit")) {
        throw new Error("GitHub API rate limit exceeded. Please try again in a few minutes.");
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    // Re-throw with user-friendly message if it's a network error
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error("Unable to connect to the analysis service. Please check your internet connection.");
    }
    throw err;
  }
}
