import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdfExtractor";
import { runFullEvaluation } from "@/lib/evaluator";
import crypto from "crypto";

const evaluationCache = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    let textToEvaluate = "";

    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      textToEvaluate = await extractTextFromPDF(buffer);
    } else if (text) {
      textToEvaluate = text;
    } else {
      return NextResponse.json({ error: "no file or text provided" }, { status: 400 });
    }

    if (!textToEvaluate.trim()) {
      return NextResponse.json({ error: "could not extract text from the provided input" }, { status: 400 });
    }

    const hashKey = crypto.createHash('sha256').update(textToEvaluate).digest('hex');

    if (evaluationCache.has(hashKey)) {
      console.log(`Cache hit for deck hash: ${hashKey}`);
      return NextResponse.json(evaluationCache.get(hashKey));
    }

    console.log(`Cache miss for deck hash: ${hashKey}. Running full evaluation...`);
    const evaluationResult = await runFullEvaluation(textToEvaluate);

    evaluationCache.set(hashKey, evaluationResult);

    return NextResponse.json(evaluationResult);

  } catch (error: any) {
    console.error("Evaluation error:", error);
    return NextResponse.json({ error: error.message || "an error occurred during evaluation" }, { status: 500 });
  }
}
