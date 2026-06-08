import React, { useState, useEffect } from "react";
import { EVALUATION_CRITERIA } from "../data";
import { CustomPlaygroundRun, ModelRunScores } from "../types";
import { 
  Play, 
  Sparkles, 
  Cpu, 
  Award, 
  RefreshCw, 
  ShieldAlert, 
  Trash2, 
  History, 
  HelpCircle, 
  ListRestart, 
  Compass, 
  Terminal, 
  CheckCircle2, 
  BookOpen 
} from "lucide-react";

export default function PlaygroundView() {
  const [promptInput, setPromptInput] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const [currentRun, setCurrentRun] = useState<CustomPlaygroundRun | null>(null);
  const [history, setHistory] = useState<CustomPlaygroundRun[]>([]);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("prompt_eval_playground_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed loading storage history", e);
    }
  }, []);

  // Save history helper
  const saveHistoryList = (newHistory: CustomPlaygroundRun[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("prompt_eval_playground_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed saving storage history", e);
    }
  };

  const runLiveEvaluation = async () => {
    if (!promptInput.trim()) return;
    setIsEvaluating(true);
    setErrorText(null);
    setCurrentRun(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptInput.trim() })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned code ${res.status}`);
      }

      const result = await res.json();
      
      const newRun: CustomPlaygroundRun = {
        id: "run_" + Date.now(),
        timestamp: new Date().toISOString(),
        prompt: promptInput.trim(),
        llm1Response: result.llm1Response,
        llm2Response: result.llm2Response,
        scores: result.scores,
        critique: result.judgeCritique
      };

      setCurrentRun(newRun);
      saveHistoryList([newRun, ...history]);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "Failed to make connection with evaluation sandbox. Please check your credentials.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const deleteHistoryItem = (id: string) => {
    const filtered = history.filter(item => item.id !== id);
    saveHistoryList(filtered);
    if (currentRun?.id === id) {
      setCurrentRun(null);
    }
  };

  const loadHistoryItem = (item: CustomPlaygroundRun) => {
    setCurrentRun(item);
    setPromptInput(item.prompt);
  };

  const clearAllSessionAndHistory = () => {
    if (window.confirm("Verify you want to wipe all session history logs?")) {
      saveHistoryList([]);
      setCurrentRun(null);
    }
  };

  const scoreMetrics = [
    { key: "accuracy", label: "Factual Accuracy" },
    { key: "relevance", label: "Relevance" },
    { key: "clarity", label: "Structural Clarity" },
    { key: "creativity", label: "Originality/Style" },
    { key: "reasoning", label: "Logical Reasoning" },
    { key: "hallucination", label: "Hallucination Rate", isHall: true },
    { key: "instructionFollowing", label: "Constraint compliance" },
    { key: "consistency", label: "Stability" }
  ];

  const getBadgeColor = (val: number, isHall = false) => {
    if (isHall) {
      if (val <= 2) return "bg-emerald-100 text-emerald-800 border-emerald-200";
      if (val <= 5) return "bg-teal-100 text-teal-800 border-teal-200";
      if (val <= 7) return "bg-amber-100 text-amber-800 border-amber-200";
      return "bg-rose-100 text-rose-800 border-rose-200";
    }
    if (val >= 8) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (val >= 6) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-rose-100 text-rose-800 border-rose-200";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="playground_main_container">
      {/* Playground Config Left Side Column */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Compass size={18} />
            </div>
            <h2 className="font-sans font-bold text-lg text-slate-900 tracking-tight">Playground Controls</h2>
          </div>

          {/* Prompt Entry Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Evaluation Prompt
            </label>
            <textarea
              rows={4}
              value={promptInput}
              onChange={(e) => {
                setPromptInput(e.target.value);
              }}
              placeholder="Type your custom prompt to cross-evaluate GPT-4o (LLM 1) vs Claude 3.5 Sonnet (LLM 2)..."
              className="w-full text-sm p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 leading-relaxed placeholder:text-slate-400"
            />
          </div>

          {/* Submission button */}
          <button
            onClick={runLiveEvaluation}
            disabled={isEvaluating || !promptInput.trim()}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
          >
            {isEvaluating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Simulating Models & Grading...</span>
              </>
            ) : (
              <>
                <Play size={16} fill="white" />
                <span>Execute Framework Assessment</span>
              </>
            )}
          </button>
        </div>

        {/* History Log Container */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800">
              <History size={18} className="text-slate-500" />
              <h3 className="font-sans font-semibold text-sm text-slate-900">Session Evaluation Logs</h3>
            </div>
            {history.length > 0 && (
              <button 
                onClick={clearAllSessionAndHistory}
                className="text-xs text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1.5"
                title="Wipe historical data logs"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-1.5 border-2 border-dashed border-slate-100 rounded-2xl">
                <Terminal size={24} className="mx-auto opacity-40 text-slate-500" />
                <p className="text-xs font-medium">No recorded evaluations yet</p>
                <p className="text-[10px] text-slate-400">Trigger standard or custom prompt evaluations above</p>
              </div>
            ) : (
              history.map((h) => (
                <div 
                  key={h.id}
                  onClick={() => loadHistoryItem(h)}
                  className={`p-3.5 rounded-xl border transition-all text-left cursor-pointer group flex justify-between items-start gap-4 ${
                    currentRun?.id === h.id 
                      ? "bg-blue-50/45 border-blue-200" 
                      : "bg-slate-50/50 border-slate-100 hover:bg-slate-100/50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-sans font-semibold text-slate-700 text-xs truncate">
                      "{h.prompt}"
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium mt-1">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistoryItem(h.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 md:opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Output Results Window Right Side Panel */}
      <div className="lg:col-span-8">
        {errorText && (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl space-y-2 flex items-start gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-slate-800 text-sm">Sandbox Configuration Warning</h3>
              <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                {errorText}
              </p>
              <div className="text-[10px] text-slate-500 mt-3 font-semibold uppercase tracking-wider">
                Tip: Ensure you have added your valid Gemini client secret in the "Settings &gt; Secrets" menu.
              </div>
            </div>
          </div>
        )}

        {isEvaluating ? (
          /* Sleek Loading placeholder */
          <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center py-24 space-y-6 flex flex-col justify-center items-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                <Sparkles size={20} className="animate-pulse" />
              </div>
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="font-sans font-bold text-slate-800 text-lg">Evaluation Pipeline Active</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generating dual responses from GPT-4o and Claude 3.5 Sonnet, sending payloads, and rendering detailed judge comparative scores. Please hold...
              </p>
            </div>
          </div>
        ) : currentRun ? (
          /* Live Results rendered beautifully */
          <div className="space-y-6">
            {/* Model Outputs comparison split screen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LLM 1 Output */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <h4 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Cpu size={16} className="text-blue-500 animate-pulse" />
                    GPT-4o (LLM 1)
                  </h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    OpenAI
                  </span>
                </div>
                <div className="text-slate-700 font-mono text-xs leading-relaxed max-h-[250px] overflow-y-auto whitespace-pre-wrap">
                  {currentRun.llm1Response}
                </div>
              </div>

              {/* LLM 2 Output */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                  <h4 className="font-sans font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Award size={16} className="text-violet-500" />
                    Claude 3.5 Sonnet (LLM 2)
                  </h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700">
                    Anthropic
                  </span>
                </div>
                <div className="text-slate-700 font-mono text-xs leading-relaxed max-h-[250px] overflow-y-auto whitespace-pre-wrap">
                  {currentRun.llm2Response}
                </div>
              </div>
            </div>

            {/* Scorecard table layout comparison */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-sans font-bold text-slate-800 text-base">Comparative Scores Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-3">Evaluation Metric</th>
                      <th className="py-3 text-center">GPT-4o</th>
                      <th className="py-3 text-center">Claude 3.5</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {scoreMetrics.map((m) => {
                      const score1 = currentRun.scores.llm1[m.key as keyof ModelRunScores] as number;
                      const score2 = currentRun.scores.llm2[m.key as keyof ModelRunScores] as number;

                      return (
                        <tr key={m.key} className="hover:bg-slate-50/50">
                          <td className="py-3.5 font-sans font-semibold text-slate-700">
                            {m.label} {m.isHall && <span className="text-[9px] text-slate-400 lowercase">(lower is better)</span>}
                          </td>
                          <td className="py-3.5 text-center">
                            <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-xs border ${getBadgeColor(score1, m.isHall)}`}>
                              {score1}/10
                            </span>
                          </td>
                          <td className="py-3.5 text-center">
                            <span className={`px-2.5 py-0.5 rounded-md font-mono font-bold text-xs border ${getBadgeColor(score2, m.isHall)}`}>
                              {score2}/10
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Judge Critique Card Box */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 size={16} />
                </div>
                <h3 className="font-sans font-bold text-indigo-955 text-base">Evaluation Verdict & Critique</h3>
              </div>
              <div className="text-slate-650 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {currentRun.critique}
              </div>
            </div>
          </div>
        ) : (
          /* Welcome screen when first starting playground */
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm py-20 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
              <Terminal size={28} />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-2xl font-sans font-bold text-slate-900 tracking-tight">AI Evaluation Sandbox ready</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Enter your custom text prompt to run real integrations and compare LLM responses dynamically across 8 critical constraints!
              </p>
            </div>
            <div className="flex justify-center flex-wrap gap-6 text-xs text-slate-400 font-semibold uppercase tracking-wider pt-4 border-t border-slate-55 lg:max-w-md lg:mx-auto">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> Real-time testing</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> Auto grading</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> Session history</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
