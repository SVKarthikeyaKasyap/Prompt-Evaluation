import React from "react";
import PlaygroundView from "./components/PlaygroundView";
import { 
  Scale, 
  Info
} from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans" id="app_root">
      {/* Dynamic Header Navbar Section */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm/60 backdrop-blur-md" id="app_header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo / Title Area */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Scale size={20} className="transform -rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-slate-900 tracking-tight text-lg leading-tight uppercase">
                  Prompt Evaluation Framework
                </h1>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                  Live Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Academic Comparative LLM Assessment
              </p>
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="app_main_content">
        
        {/* Dynamic description callout */}
        <div className="bg-blue-50/40 border border-blue-50 rounded-2xl p-4 flex items-center gap-3.5 mb-8 text-xs text-slate-600 font-medium">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
            <Info size={14} />
          </div>
          <div>
            <span>Dynamic Evaluation Playground: Test any custom text prompt live against Google Gemini's modeling layers. Watch real-time dual GPT-4o vs Claude 3.5 Sonnet simulation outputs and automatically grade them against the framework's core metrics of Karthikeya SV's evaluation suite.</span>
          </div>
        </div>

        {/* View Layout */}
        <div className="relative">
          <PlaygroundView />
        </div>
      </main>

      {/* Footer Area */}
      <footer className="bg-white border-t border-slate-100 py-6" id="app_footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Prompt Evaluation System</span>
          </div>
          <div>
            <span>Module 3 Assessment Report • Designed by <strong>Karthikeya SV</strong> (Roll No: 23EG107D59)</span>
          </div>
          <div>
            <span>Powered by Gemini & Express</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
