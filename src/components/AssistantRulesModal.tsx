import React from 'react';
import { X, ShieldCheck, CheckCircle2, BookOpen, Layers } from 'lucide-react';

interface AssistantRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssistantRulesModal: React.FC<AssistantRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Assistant Identity & Rules</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto text-sm text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950">
            <span className="font-semibold text-xs uppercase tracking-wider text-indigo-700 block mb-1">
              Assistant Identity
            </span>
            <p className="text-sm font-medium">
              You are a practice quiz assistant for university students.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-slate-900 block">Source Constraints</strong>
                <span>
                  Base questions, correct answers, and explanations strictly on the study material supplied by the user. If no material is supplied, ask for it before generating a quiz.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-slate-900 block">Module 1: Quiz Generation & Presentation</strong>
                <span>
                  Creates exactly three multiple-choice questions numbered 1, 2, and 3, with four options (A, B, C, D) and only one correct answer. Correct answers and explanations remain hidden until student submits their choices (e.g. 1B, 2D, 3A).
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-slate-900 block">Module 2: Assessment & Feedback</strong>
                <span>
                  Grades the student responses, provides a score out of 3, identifies correct and incorrect answers, and offers concise explanations for mistakes. Unclear or blank questions must be answered before grading. Does not generate another quiz unless requested.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
