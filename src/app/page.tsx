"use client";

import { useState } from "react";
import { UploadCloud, FileText, Loader2, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Target, Zap } from "lucide-react";

interface EvaluationResult {
  overallScore: number;
  recommendation: string;
  breakdown: {
    communication: { score: number; signal: string; evidence: string[]; interpretation: string };
    narrative: { score: number; signal: string; evidence: string[]; interpretation: string };
    problemSolution: { score: number; signal: string; evidence: string[]; interpretation: string };
  };
  executiveSummary: string;
  keyStrengths: string[];
  keyWeaknesses: string[];
  risksAndConcerns: string[];
  investorInsights: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"pdf" | "text">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (activeTab === "pdf" && !file) {
      setError("Please select a PDF file");
      return;
    }
    if (activeTab === "text" && !text.trim()) {
      setError("Please enter pitch deck text");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (activeTab === "pdf" && file) {
        formData.append("file", file);
      } else {
        formData.append("text", text);
      }

      const res = await fetch("/api/evaluate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to evaluate pitch deck");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Evalia
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            AI-powered pitch deck evaluation simulating real venture capital reasoning
          </p>
        </header>

        {!result && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 max-w-2xl mx-auto">
            <div className="flex justify-center mb-8 bg-slate-100 p-1 rounded-lg w-max mx-auto">
              <button
                onClick={() => setActiveTab("pdf")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "pdf" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Upload PDF
              </button>
              <button
                onClick={() => setActiveTab("text")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "text" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Paste Text
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === "pdf" ? (
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-slate-400 transition-colors bg-slate-50">
                  <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-semibold text-slate-900">
                      Choose a PDF file
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="mt-2 text-xs text-slate-500">
                    {file ? file.name : "Maximum 10MB"}
                  </p>
                </div>
              ) : (
                <div>
                  <textarea
                    rows={10}
                    className="w-full rounded-xl border border-slate-300 p-4 text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                    placeholder="Paste the extracted text of your pitch deck here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Evaluating Deck...
                  </>
                ) : (
                  "Generate Investor Memo"
                )}
              </button>
            </form>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Investment Decision Memo</h2>
              <button
                onClick={() => setResult(null)}
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Evaluate Another
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Investment Readiness
                </div>
                <div className={`text-6xl font-black ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore}
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                  <Target className="w-4 h-4" />
                  {result.recommendation}
                </div>
              </div>

              <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center space-y-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Executive Summary
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {result.executiveSummary}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold border-b border-slate-100 pb-4">
                Evaluation Breakdown
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { label: "Communication", weight: "25%", data: result.breakdown.communication },
                  { label: "Narrative", weight: "35%", data: result.breakdown.narrative },
                  { label: "Problem-Solution", weight: "40%", data: result.breakdown.problemSolution }
                ].map((item) => (
                  <div key={item.label} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-700">{item.label} ({item.weight})</span>
                        <span className={getScoreColor(item.data.score || 0)}>{item.data.score || 0}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-slate-900 h-2 rounded-full" style={{ width: `${item.data.score || 0}%` }}></div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-sm space-y-3 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">Signal:</span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                          item.data.signal?.toLowerCase().includes('strong') ? 'bg-emerald-100 text-emerald-700' :
                          item.data.signal?.toLowerCase().includes('weak') ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {item.data.signal || "Unknown"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Evidence</span>
                        <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                          {item.data.evidence?.map((e: string, i: number) => <li key={i} className="leading-relaxed">{e}</li>)}
                        </ul>
                      </div>
                      <div className="pt-3 border-t border-slate-200">
                        <p className="text-slate-600 italic leading-relaxed">"{item.data.interpretation}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800 font-bold">
                  <TrendingUp className="w-5 h-5" />
                  Key Strengths
                </div>
                <ul className="space-y-3">
                  {result.keyStrengths.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm text-emerald-900 leading-relaxed">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                <div className="flex items-center gap-2 mb-4 text-red-800 font-bold">
                  <TrendingDown className="w-5 h-5" />
                  Key Weaknesses
                </div>
                <ul className="space-y-3">
                  {result.keyWeaknesses.map((w, i) => (
                    <li key={i} className="flex gap-3 text-sm text-red-900 leading-relaxed">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4 text-rose-800 font-bold">
                  <AlertCircle className="w-5 h-5" />
                  Critical Risks & Concerns
                </div>
                <ul className="grid md:grid-cols-2 gap-4">
                  {result.risksAndConcerns.map((r, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                      <span className="text-rose-500 font-bold">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-blue-600 font-bold">
                  <Zap className="w-5 h-5" />
                  Investor Insights
                </div>
                <p className="text-slate-700 leading-relaxed bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                  {result.investorInsights}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}