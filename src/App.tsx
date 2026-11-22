/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MaterialInputSection } from './components/MaterialInputSection';
import { QuizSection } from './components/QuizSection';
import { ResultsSection } from './components/ResultsSection';
import { AssistantRulesModal } from './components/AssistantRulesModal';
import { QuizData, OptionLabel, QuizSubmissionResponse } from './types';

export default function App() {
  const [material, setMaterial] = useState<string>('');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<number, OptionLabel>>({});
  const [results, setResults] = useState<QuizSubmissionResponse | null>(null);
  const [step, setStep] = useState<'input' | 'quiz' | 'results'>('input');

  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // Generate 3-Question Quiz
  const handleGenerateQuiz = async () => {
    setError(null);

    // Source constraint enforcement: If no material supplied, ask for it
    if (!material.trim()) {
      setError('Please supply your lecture notes or study material before generating a quiz.');
      return;
    }

    setIsLoadingQuiz(true);
    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material: material.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz. Please check your notes and try again.');
      }

      setQuizData(data);
      setAnswers({});
      setResults(null);
      setStep('quiz');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while generating the quiz.');
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  // Select an option for a question
  const handleSelectAnswer = (questionNumber: number, option: OptionLabel) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: option,
    }));
    setSubmitError(null);
  };

  // Submit and grade quiz
  const handleSubmitAnswers = async () => {
    if (!quizData) return;

    // Check that all 3 are answered
    const unanswered = [1, 2, 3].filter((n) => !answers[n]);
    if (unanswered.length > 0) {
      setSubmitError(`Please answer Question ${unanswered.join(', ')} before submitting.`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quizData.quizId,
          quizToken: quizData.quizToken,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to grade your quiz. Please try again.');
      }

      setResults(data);
      setStep('results');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to grade answers.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retake the same 3 questions
  const handleRetakeSameQuiz = () => {
    setAnswers({});
    setResults(null);
    setStep('quiz');
  };

  // Generate another quiz from the same material
  const handleGenerateAnotherQuiz = async () => {
    await handleGenerateQuiz();
  };

  // Return to notes input
  const handleBackToNotes = () => {
    setStep('input');
    setError(null);
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Header
        currentStep={step}
        onShowHelp={() => setShowRulesModal(true)}
        onReset={handleBackToNotes}
        hasQuiz={Boolean(quizData)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {step === 'input' && (
          <MaterialInputSection
            material={material}
            setMaterial={setMaterial}
            onGenerateQuiz={handleGenerateQuiz}
            isLoading={isLoadingQuiz}
            error={error}
          />
        )}

        {step === 'quiz' && quizData && (
          <QuizSection
            quizData={quizData}
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            onSubmit={handleSubmitAnswers}
            onBackToNotes={handleBackToNotes}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )}

        {step === 'results' && results && (
          <ResultsSection
            results={results}
            onRetakeSameQuiz={handleRetakeSameQuiz}
            onGenerateNewQuiz={handleGenerateAnotherQuiz}
            onBackToNotes={handleBackToNotes}
            isGeneratingNew={isLoadingQuiz}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} StudyQuiz Assistant · Built for University Students</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Module 1: Generation</span>
            <span>·</span>
            <span>Module 2: Assessment</span>
            <span>·</span>
            <span>Zero Correct Answer Pre-disclosure</span>
          </div>
        </div>
      </footer>

      <AssistantRulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </div>
  );
}
