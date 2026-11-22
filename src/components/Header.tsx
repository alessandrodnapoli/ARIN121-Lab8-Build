import React from 'react';
import { GraduationCap, BookOpen, Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentStep: 'input' | 'quiz' | 'results';
  onShowHelp: () => void;
  onReset: () => void;
  hasQuiz: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onShowHelp,
  onReset,
  hasQuiz,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div 
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group"
          title="Return to Study Notes"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">StudyQuiz</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-150">
                University Edition
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Practice Quiz Assistant for Higher Education</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-medium">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
            currentStep === 'input' 
              ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200' 
              : 'text-slate-500'
          }`}>
            <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">1</span>
            <span>Study Material</span>
          </div>

          <span className="text-slate-300">→</span>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
            currentStep === 'quiz' 
              ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200' 
              : 'text-slate-500'
          }`}>
            <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">2</span>
            <span>3-Question Quiz</span>
          </div>

          <span className="text-slate-300">→</span>

          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
            currentStep === 'results' 
              ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200' 
              : 'text-slate-500'
          }`}>
            <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">3</span>
            <span>Assessment & Feedback</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasQuiz && currentStep !== 'input' && (
            <button
              onClick={onReset}
              className="text-xs font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Notes</span>
            </button>
          )}

          <button
            onClick={onShowHelp}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            title="View system prompt and evaluation guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Assistant Rules</span>
          </button>
        </div>
      </div>
    </header>
  );
};
