import Groq from "groq-sdk";
import { SANITIZATION_PROMPT, COMMUNICATION_PROMPT, NARRATIVE_PROMPT, PROBLEM_SOLUTION_PROMPT, AGGREGATOR_PROMPT } from "./prompts";

let groq: any;
function getGroq() {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
}

async function runEvaluator(prompt: string, text: string) {
  const completion = await getGroq().chat.completions.create({
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: text }
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  const responseContent = completion.choices[0]?.message?.content || "{}";
  return JSON.parse(responseContent);
}

async function sanitizeText(rawText: string) {
  const completion = await getGroq().chat.completions.create({
    messages: [
      { role: "system", content: SANITIZATION_PROMPT },
      { role: "user", content: rawText }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.1,
  });

  return completion.choices[0]?.message?.content || rawText;
}

export async function runFullEvaluation(text: string) {
  const cleanMarkdownText = await sanitizeText(text);

  const [commEval, narrEval, psEval] = await Promise.all([
    runEvaluator(COMMUNICATION_PROMPT, cleanMarkdownText),
    runEvaluator(NARRATIVE_PROMPT, cleanMarkdownText),
    runEvaluator(PROBLEM_SOLUTION_PROMPT, cleanMarkdownText),
  ]);

  const commScore = commEval.score || 0;
  const narrScore = narrEval.score || 0;
  const psScore = psEval.score || 0;
  
  const irs = Math.round(0.25 * commScore + 0.35 * narrScore + 0.40 * psScore);
  
  let recommendation = "";
  if (irs >= 85) recommendation = "Highly Investable";
  else if (irs >= 70) recommendation = "Promising";
  else if (irs >= 50) recommendation = "Needs Validation";
  else recommendation = "High Risk";

  const aggregatorInput = `
PITCH DECK TEXT (CLEANED):
${cleanMarkdownText}

---
ASSOCIATE EVALUATIONS:
Communication: ${JSON.stringify(commEval)}
Narrative: ${JSON.stringify(narrEval)}
Problem-Solution: ${JSON.stringify(psEval)}
  `;

  const aggEval = await runEvaluator(AGGREGATOR_PROMPT, aggregatorInput);

  return {
    overallScore: irs,
    recommendation,
    breakdown: {
      communication: commScore,
      narrative: narrScore,
      problemSolution: psScore
    },
    executiveSummary: aggEval.executiveSummary || "",
    keyStrengths: aggEval.keyStrengths || [],
    keyWeaknesses: aggEval.keyWeaknesses || [],
    risksAndConcerns: aggEval.risksAndConcerns || [],
    investorInsights: aggEval.investorInsights || ""
  };
}