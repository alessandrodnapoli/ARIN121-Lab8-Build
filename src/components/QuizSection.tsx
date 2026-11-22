import React, { useState } from 'react';
import { QuizData, OptionLabel } from '../types';
import { CheckCircle2, AlertCircle, ArrowLeft, Send, Sparkles, Check, HelpCircle } from 'lucide-react';

interface QuizSectionProps {
  quizData: QuizData;
  answers: Record<number, OptionLabel>;
  onSelectAnswer: (questionNumber: number, option: OptionLabel) => void;
  onSubmit: () => void;
  onBackToNotes: () => void;
  isSubmitting: boolean;
  submitError: string | null;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  quizData,
  answers,
  onSelectAnswer,
  onSubmit,
  onBackToNotes,
  isSubmitting,
  submitError,
}) => {
  const [attemptedSubmitWithoutAll, setAttemptedSubmitWithoutAll] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === 3 && [1, 2, 3].every(n => answers[n]);

  const handleSubmitClick = () => {
    if (!isComplete) {
      setAttemptedSubmitWithoutAll(true);
      return;
    }
    setAttemptedSubmitWithoutAll(false);
    onSubmit();
  };

  // Build formatted submission string (e.g., "1B, 2D, 3A")
  const formattedSubmissionString = [1, 2, 3]
    .map(num => (answers[num] ? `${num}${answers[num]}` : `${num}?`))
    .join(', ');

  const missingQuestions = [1, 2, 3].filter(n => !answers[n]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation & Topic Banner */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToNotes}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Notes</span>
        </button>

        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span>Module 1: Quiz Presentation</span>
        </div>
      </div>

      {/* Quiz Header & Instructions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Practice Assessment
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              {quizData.title}
            </h2>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="text-xs font-medium text-slate-500">Progress</div>
            <div className="text-sm font-bold text-slate-800">
              {answeredCount} of 3 Answered
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isComplete ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${(answeredCount / 3) * 100}%` }}
          />
        </div>

        {/* Presentation Prompt Note */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            Select one answer (<strong>A, B, C, or D</strong>) for each of the three questions below. Correct answers and explanations remain hidden until all three questions are answered and submitted for grading.
          </div>
        </div>
      </div>

      {/* 3 Questions */}
      <div className="space-y-6">
        {quizData.questions.map((q) => {
          const selectedAnswer = answers[q.number];
          const isAnswered = Boolean(selectedAnswer);
          const isMissingOnAttempt = attemptedSubmitWithoutAll && !isAnswered;

          return (
            <div
              key={q.number}
              id={`question-${q.number}`}
              className={`bg-white rounded-2xl border p-6 transition-all ${
                isMissingOnAttempt
                  ? 'border-amber-400 ring-2 ring-amber-100 shadow-sm'
                  : isAnswered
                  ? 'border-indigo-200/80 shadow-sm'
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isAnswered 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {q.number}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Question {q.number} of 3
                  </span>
                </div>

                {isAnswered ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    <Check className="w-3 h-3" /> Selected {selectedAnswer}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Unanswered</span>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug mb-5">
                {q.question}
              </h3>

              {/* 4 Answer Options: A, B, C, D */}
              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.label;

                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        onSelectAnswer(q.number, opt.label);
                        if (attemptedSubmitWithoutAll) {
                          setAttemptedSubmitWithoutAll(false);
                        }
                      }}
                      className={`w-full p-3.5 sm:p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 group cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Label Badge (A, B, C, D) */}
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                        }`}
                      >
                        {opt.label}
                      </span>

                      {/* Option Text */}
                      <span className={`text-sm leading-relaxed flex-1 pt-0.5 ${
                        isSelected ? 'font-medium text-slate-900' : 'text-slate-700'
                      }`}>
                        {opt.text}
                      </span>

                      {/* Radio Circle Indicator */}
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 bg-white group-hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {isMissingOnAttempt && (
                <div className="mt-3 text-xs text-amber-700 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Please choose an option for Question {q.number} before submitting.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission Format & Validation Notice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-slate-700">Submission format:</span>{' '}
            <code className="px-2 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono font-bold">
              {formattedSubmissionString}
            </code>
          </div>

          <div className="text-slate-500">
            {isComplete ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All 3 questions answered
              </span>
            ) : (
              <span className="text-amber-600 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Remaining: {missingQuestions.map(n => `Q${n}`).join(', ')}
              </span>
            )}
          </div>
        </div>

        {submitError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Submit Answers Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            {isComplete
              ? 'Ready! Click to submit answers and view score & explanations.'
              : 'Answer all 3 questions to unlock the Submit Answers button.'}
          </p>

          <button
            type="button"
            onClick={handleSubmitClick}
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isComplete
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200 hover:shadow-lg active:scale-[0.98]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Grading Quiz...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Answers</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
