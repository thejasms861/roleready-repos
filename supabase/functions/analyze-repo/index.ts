import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an AI code reviewer acting as a strict technical recruiter and senior software engineer.

Your job is to evaluate a student's public GitHub repository and produce an honest, recruiter-grade assessment.

This is not motivational feedback. This is hire-readiness evaluation.

❗ ABSOLUTE RULES (DO NOT BREAK)
- You do NOT invent scores.
- You do NOT guess.
- You do NOT default to mid-range scores.
- All numeric scoring is derived from the provided evaluation data.
- 80+ scores are rare. 90+ is exceptional.
- If information is missing, penalize — do not assume.

🧮 SCORING RUBRIC (100 POINTS TOTAL)

1️⃣ Code Quality & Readability — 25 points
Evaluate: Naming clarity, Consistency, Complexity, Formatting / lint signals
- Poor / messy: 5–10
- Average student quality: 12–17
- Clean & intentional: 18–22
- Production-level clarity: 23–25
Hard rule: If no linting or formatting config is present → cap at 18

2️⃣ Project Structure & Organization — 15 points
Evaluate: Logical folder separation, Entry points, Scalability signals
- Confusing / flat: 4–7
- Reasonable separation: 8–11
- Scalable & modular: 12–15

3️⃣ Documentation Quality — 15 points
Evaluate README for: Project purpose, Setup instructions, Usage clarity
- Missing / useless: 0–4
- Basic setup only: 5–8
- Clear + usage: 9–12
- Professional-grade: 13–15
Auto-generated README ≠ good README

4️⃣ Testing & Maintainability — 15 points
Evaluate: Test presence, Framework usage, Coverage signals
- No tests: 0
- Minimal tests: 4–7
- Reasonable coverage: 8–11
- Strong testing culture: 12–15
Hard rule: If tests = 0 → this severely limits hire readiness.

5️⃣ Real-World Applicability — 15 points
Evaluate: Problem usefulness, Non-tutorial originality, Practical workflows
- Pure tutorial clone: 4–6
- Small real use: 7–10
- Solves real problem: 11–13
- Production mindset: 14–15

6️⃣ Git & Commit Hygiene — 15 points
Evaluate: Commit frequency, Time distribution, Message quality, Branch usage
- Dump commits / poor messages: 3–6
- Some consistency: 7–10
- Clean & intentional: 11–13
- Team-ready workflow: 14–15

🚫 HARD RECRUITER CAPS (MANDATORY)
Apply these caps after scoring:
- No README: Maximum 45
- No tests: Maximum 75
- One-day commit history: Maximum 65
- Tutorial clone: Maximum 70
- No real-world value: Maximum 60
If multiple caps apply, use the lowest.

ROLE-SPECIFIC WEIGHTING:
Adjust your evaluation based on the selected role:
- frontend: Emphasize component structure, UI patterns, state management, accessibility, README demos
- backend: Emphasize API structure, error handling, database patterns, security, test coverage
- fullstack: Emphasize frontend-backend separation, API contracts, end-to-end clarity
- data-ml: Emphasize data pipelines, model structure, documentation, reproducibility
- opensource: Emphasize documentation quality, contribution guidelines, code clarity, community signals

📤 REQUIRED OUTPUT FORMAT (JSON)
You MUST respond with valid JSON only. No markdown, no explanation. Just the JSON object:
{
  "score": <number 0-100>,
  "tier": "<Not Ready|Emerging|Hire-Approaching|Role-Ready>",
  "badge": "<bronze|silver|gold|none>",
  "summary": "<2-3 sentence recruiter-style evaluation>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "gaps": ["<gap 1>", "<gap 2>", ...],
  "roadmap": [
    {"action": "<action>", "impact": "<high|medium|low>", "effort": "<high|medium|low>", "reason": "<why this matters for hiring>"},
    ...
  ],
  "categoryScores": {
    "codeQuality": <0-25>,
    "projectStructure": <0-15>,
    "documentation": <0-15>,
    "testing": <0-15>,
    "realWorldApplicability": <0-15>,
    "gitHygiene": <0-15>
  }
}

Badge rules:
- none: score < 50
- bronze: 50-69
- silver: 70-79
- gold: 80+

Tier rules:
- Not Ready: score < 40
- Emerging: 40-59
- Hire-Approaching: 60-79
- Role-Ready: 80+`;

async function fetchGitHubData(repoUrl: string) {
  // Extract owner and repo from URL
  const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = repoUrl.match(urlPattern);
  
  if (!match) {
    throw new Error('Invalid GitHub URL format');
  }
  
  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  
  console.log(`Fetching data for ${owner}/${cleanRepo}`);
  
  // Fetch repo metadata, README, and file tree in parallel
  const [repoRes, readmeRes, treeRes, commitsRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    }),
    fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/readme`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    }).catch(() => null),
    fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/git/trees/HEAD?recursive=1`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    }).catch(() => null),
    fetch(`https://api.github.com/repos/${owner}/${cleanRepo}/commits?per_page=100`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    }).catch(() => null),
  ]);
  
  if (!repoRes.ok) {
    const errorData = await repoRes.json().catch(() => ({}));
    throw new Error(`Repository not found or not accessible: ${errorData.message || repoRes.status}`);
  }
  
  const repoData = await repoRes.json();
  
  // Get README content
  let readmeContent = '';
  if (readmeRes?.ok) {
    const readmeData = await readmeRes.json();
    if (readmeData.content) {
      readmeContent = atob(readmeData.content);
    }
  }
  
  // Get file tree
  let fileTree: string[] = [];
  if (treeRes?.ok) {
    const treeData = await treeRes.json();
    fileTree = (treeData.tree || [])
      .filter((item: any) => item.type === 'blob')
      .map((item: any) => item.path);
  }
  
  // Get commits
  let commits: any[] = [];
  if (commitsRes?.ok) {
    commits = await commitsRes.json();
  }
  
  // Analyze commits for time distribution
  const commitDates = commits.map((c: any) => new Date(c.commit?.author?.date || c.commit?.committer?.date));
  const uniqueDays = new Set(commitDates.map(d => d.toDateString())).size;
  const commitMessages = commits.slice(0, 20).map((c: any) => c.commit?.message?.split('\n')[0] || '');
  
  // Detect testing signals
  const hasTests = fileTree.some(f => 
    f.includes('test') || 
    f.includes('spec') || 
    f.includes('__tests__') ||
    f.endsWith('.test.js') ||
    f.endsWith('.test.ts') ||
    f.endsWith('.spec.js') ||
    f.endsWith('.spec.ts')
  );
  
  // Detect linting/formatting
  const hasLinting = fileTree.some(f => 
    f.includes('eslint') || 
    f.includes('prettier') || 
    f.includes('.editorconfig') ||
    f.includes('tslint')
  );
  
  // Detect package.json for test scripts
  const hasPackageJson = fileTree.some(f => f === 'package.json');
  
  return {
    name: repoData.name,
    description: repoData.description || '',
    language: repoData.language || 'Unknown',
    languages: repoData.language ? [repoData.language] : [],
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    createdAt: repoData.created_at,
    updatedAt: repoData.updated_at,
    defaultBranch: repoData.default_branch,
    readme: readmeContent.substring(0, 8000), // Limit README size
    fileTree: fileTree.slice(0, 200), // Limit file tree
    commitCount: commits.length,
    uniqueCommitDays: uniqueDays,
    recentCommitMessages: commitMessages,
    hasTests,
    hasLinting,
    hasPackageJson,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { repoUrl, role } = await req.json();
    
    if (!repoUrl) {
      return new Response(
        JSON.stringify({ error: 'Repository URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!role) {
      return new Response(
        JSON.stringify({ error: 'Role selection is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Analyzing repository: ${repoUrl} for role: ${role}`);
    
    // Fetch GitHub data
    const repoData = await fetchGitHubData(repoUrl);
    console.log('GitHub data fetched successfully');
    
    // Build evaluation prompt
    const evaluationPrompt = `Evaluate this GitHub repository for a ${role.replace('-', ' ')} role.

REPOSITORY DATA:
- Name: ${repoData.name}
- Description: ${repoData.description}
- Primary Language: ${repoData.language}
- Stars: ${repoData.stars}
- Forks: ${repoData.forks}
- Created: ${repoData.createdAt}
- Last Updated: ${repoData.updatedAt}
- Total Commits (last 100): ${repoData.commitCount}
- Unique Commit Days: ${repoData.uniqueCommitDays}
- Has Tests: ${repoData.hasTests}
- Has Linting Config: ${repoData.hasLinting}

FILE STRUCTURE (sample):
${repoData.fileTree.slice(0, 50).join('\n')}

RECENT COMMIT MESSAGES:
${repoData.recentCommitMessages.join('\n')}

README CONTENT:
${repoData.readme || 'NO README FOUND'}

Provide your evaluation as JSON only.`;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: evaluationPrompt }
        ],
      }),
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI evaluation failed');
    }
    
    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }
    
    console.log('AI response received');
    
    // Parse JSON from response (handle potential markdown wrapping)
    let evaluation;
    try {
      // Try to extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json?\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      evaluation = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse evaluation results');
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        evaluation,
        repoMeta: {
          name: repoData.name,
          language: repoData.language,
          stars: repoData.stars,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in analyze-repo function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Analysis failed' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
