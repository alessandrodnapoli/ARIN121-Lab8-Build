import React, { useState } from 'react';
import { QuizSubmissionResponse } from '../types';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  Lightbulb,
  Award,
  ChevronRight,
} from 'lucide-react';

interface ResultsSectionProps {
  results: QuizSubmissionResponse;
  onRetakeSameQuiz: () => void;
  onGenerateNewQuiz: () => void;
  onBackToNotes: () => void;
  isGeneratingNew: boolean;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({
  results,
  onRetakeSameQuiz,
  onGenerateNewQuiz,
  onBackToNotes,
  isGeneratingNew,
}) => {
  const [copiedReport, setCopiedReport] = useState(false);

  const isPerfectScore = results.score === 3;

  const handleCopyReport = () => {
    const reportText = `=== StudyQuiz Practice Assessment: ${results.title} ===
Score: ${results.score} / ${results.total} (${results.percentage}%)
Submission: ${results.formattedSubmission}
Rating: ${results.performanceRating}

${results.results
  .map(
    (r) => `Question ${r.number}: ${r.question}
Your Answer: (${r.selectedOption}) ${r.options.find((o) => o.label === r.selectedOption)?.text}
Correct Answer: (${r.correctOption}) ${r.options.find((o) => o.label === r.correctOption)?.text}
Status: ${r.isCorrect ? 'CORRECT' : 'INCORRECT'}
Explanation: ${r.explanation}
`
  )
  .join('\n')}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Module 2 Header Pill */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>Module 2: Assessment & Feedback</span>
        </span>

        <button
          onClick={handleCopyReport}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          title="Copy full quiz review to clipboard"
        >
          {copiedReport ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">Report Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Score Card */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 text-center relative overflow-hidden transition-all shadow-sm ${
          isPerfectScore
            ? 'bg-gradient-to-b from-emerald-50/70 to-white border-emerald-200 ring-1 ring-emerald-100'
            : results.score >= 2
            ? 'bg-gradient-to-b from-sky-50/70 to-white border-sky-200 ring-1 ring-sky-100'
            : 'bg-gradient-to-b from-amber-50/70 to-white border-amber-200 ring-1 ring-amber-100'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold mb-3 bg-white shadow-xs border border-slate-200/60">
          <span>Submitted Answers:</span>
          <code className="text-indigo-600 font-mono font-bold">
            {results.formattedSubmission}
          </code>
        </div>

        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Final Quiz Score
        </h2>

        {/* Score Out of Three */}
        <div className="flex items-baseline justify-center gap-2 my-2">
          <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            {results.score}
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-400">
            / {results.total}
          </span>
          <span
            className={`ml-2 text-sm font-bold px-2.5 py-1 rounded-full ${
              isPerfectScore
                ? 'bg-emerald-100 text-emerald-800'
                : results.score >= 2
                ? 'bg-sky-100 text-sky-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {results.percentage}%
          </span>
        </div>

        {/* Performance Description */}
        <p className="text-base font-semibold text-slate-800 max-w-lg mx-auto mt-2">
          {results.performanceRating}
        </p>

        {/* Quick Result Icons Indicator */}
        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-slate-100/80">
          {results.results.map((r) => (
            <div
              key={r.number}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                r.isCorrect
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {r.isCorrect ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
              )}
              <span>Question {r.number}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Question-by-Question Graded Review */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-slate-900">
            Detailed Review & Explanations
          </h3>
          <span className="text-xs text-slate-500">
            Explanations based strictly on study material
          </span>
        </div>

        {results.results.map((r) => {
          return (
            <div
              key={r.number}
              className={`bg-white rounded-2xl border p-6 transition-all shadow-sm ${
                r.isCorrect
                  ? 'border-emerald-200/90'
                  : 'border-rose-200/90'
              }`}
            >
              {/* Question Header & Status */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      r.isCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {r.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    Question {r.number} of 3
                  </span>
                </div>

                {r.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Correct</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Incorrect</span>
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h4 className="text-base font-semibold text-slate-900 mb-4 leading-snug">
                {r.question}
              </h4>

              {/* 4 Options Review */}
              <div className="space-y-2.5 mb-5">
                {r.options.map((opt) => {
                  const isSelected = r.selectedOption === opt.label;
                  const isCorrectAnswer = r.correctOption === opt.label;

                  let optionStyle = 'border-slate-200 bg-white text-slate-700';
                  let badgeStyle = 'bg-slate-100 text-slate-600';

                  if (isCorrectAnswer) {
                    optionStyle =
                      'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-300 shadow-xs';
                    badgeStyle = 'bg-emerald-600 text-white';
                  } else if (isSelected && !r.isCorrect) {
                    optionStyle =
                      'border-rose-400 bg-rose-50/70 text-rose-950 line-through opacity-85';
                    badgeStyle = 'bg-rose-600 text-white';
                  } else {
                    optionStyle = 'border-slate-200 bg-slate-50/40 text-slate-500';
                  }

                  return (
                    <div
                      key={opt.label}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${optionStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${badgeStyle}`}
                      >
                        {opt.label}
                      </span>

                      <span className="text-sm leading-relaxed flex-1 pt-0.5">
                        {opt.text}
                      </span>

                      {/* Status Badges on the right */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        {isCorrectAnswer && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1">
                            <Check className="w-3 h-3" /> Correct Answer
                          </span>
                        )}
                        {isSelected && !r.isCorrect && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-200 text-rose-800">
                            Your Choice
                          </span>
                        )}
                        {isSelected && r.isCorrect && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-800">
                            Your Choice
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pedagogical Explanation Card */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  r.isCorrect
                    ? 'bg-slate-50 border-slate-200 text-slate-800'
                    : 'bg-amber-50/60 border-amber-200/80 text-amber-950'
                }`}
              >
                <Lightbulb
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    r.isCorrect ? 'text-indigo-600' : 'text-amber-600'
                  }`}
                />
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <span>Explanation & Study Context</span>
                    {!r.isCorrect && (
                      <span className="text-[11px] font-normal text-amber-700">
                        (Identified correct option: <strong>{r.correctOption}</strong>)
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed text-slate-700">{r.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer (Honoring: "After providing feedback, do not generate another quiz unless the student specifically asks for one.") */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">What would you like to do next?</h4>
          <p className="text-xs text-slate-500">
            Per study assistant guidelines, new quizzes are only generated upon your direct request.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={onGenerateNewQuiz}
            disabled={isGeneratingNew}
            className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow-indigo-100 hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isGeneratingNew ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating New Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Another Quiz</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRetakeSameQuiz}
            className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Retake This Quiz</span>
          </button>

          <button
            type="button"
            onClick={onBackToNotes}
            className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Edit / New Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
