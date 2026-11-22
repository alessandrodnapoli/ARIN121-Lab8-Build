import React, { useState } from 'react';
import { SAMPLE_STUDY_MATERIALS, SampleNote } from '../data/sampleNotes';
import { Sparkles, Clipboard, Trash2, BookOpen, AlertCircle, Check, Loader2 } from 'lucide-react';

interface MaterialInputSectionProps {
  material: string;
  setMaterial: (val: string) => void;
  onGenerateQuiz: () => void;
  isLoading: boolean;
  error: string | null;
}

export const MaterialInputSection: React.FC<MaterialInputSectionProps> = ({
  material,
  setMaterial,
  onGenerateQuiz,
  isLoading,
  error,
}) => {
  const [copiedPreset, setCopiedPreset] = useState<string | null>(null);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const wordCount = material.trim() ? material.trim().split(/\s+/).length : 0;
  const charCount = material.length;

  const handleSelectPreset = (preset: SampleNote) => {
    setMaterial(preset.text);
    setCopiedPreset(preset.id);
    setTimeout(() => setCopiedPreset(null), 2000);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMaterial(text);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch {
      // Clipboard read may not be permitted in some browser contexts
    }
  };

  const handleClear = () => {
    setMaterial('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 border border-indigo-100 rounded-2xl p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Practice Quiz Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Test your understanding with a targeted 3-question quiz
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Paste your lecture notes, textbook passages, or study summaries below. The assistant will formulate three multiple-choice questions (A, B, C, D) strictly anchored in your provided material.
          </p>
        </div>
      </div>

      {/* Preset Topics for Quick Testing */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium px-1">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Or load sample university study notes:</span>
          </span>
          {copiedPreset && (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Loaded sample notes
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_STUDY_MATERIALS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              type="button"
              className={`p-3 text-left rounded-xl border transition-all flex flex-col justify-between ${
                copiedPreset === preset.id
                  ? 'border-indigo-500 bg-indigo-50/70 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{preset.icon}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {preset.category}
                </span>
              </div>
              <div className="text-xs font-medium text-slate-800 line-clamp-1">
                {preset.topic}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Textarea Workspace Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        {/* Workspace Toolbar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label htmlFor="notes-textarea" className="font-semibold text-slate-700 flex items-center gap-2">
            <span>Lecture Notes or Study Material</span>
            <span className="text-[11px] font-normal text-slate-500">
              (Source constraints apply: quiz is built strictly from this text)
            </span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium flex items-center gap-1.5 transition-colors"
              title="Paste text from clipboard"
            >
              {pasteSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Pasted</span>
                </>
              ) : (
                <>
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Paste</span>
                </>
              )}
            </button>

            {material.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-1 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-1.5 transition-colors"
                title="Clear notes"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <div className="p-4 sm:p-5">
          <textarea
            id="notes-textarea"
            rows={10}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            disabled={isLoading}
            placeholder={`Paste your lecture notes, textbook excerpt, scientific mechanisms, or study guide here...

Example:
Cellular respiration is the process where cells convert biochemical energy from glucose into ATP. Glycolysis occurs in the cytoplasm, yielding 2 ATP and 2 NADH...`}
            className="w-full text-slate-800 placeholder-slate-400 text-sm leading-relaxed border-0 focus:outline-none focus:ring-0 resize-y min-h-[220px]"
          />
        </div>

        {/* Counter and Status */}
        <div className="px-5 py-2.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            {wordCount > 0 ? (
              <span>
                <strong className="text-slate-700">{wordCount}</strong> words ·{' '}
                <strong className="text-slate-700">{charCount}</strong> characters
              </span>
            ) : (
              <span className="text-slate-400 italic">No notes entered yet</span>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Recommended: 100 – 1,500 words for optimal 3-question coverage
          </div>
        </div>
      </div>

      {/* Error message banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Note Required to Generate Quiz</p>
            <p className="text-rose-700 text-xs sm:text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-500 max-w-sm">
          Clicking below sends your study material to the assistant to generate Questions 1, 2, and 3 without revealing answers.
        </div>

        <button
          type="button"
          onClick={onGenerateQuiz}
          disabled={isLoading}
          className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-indigo-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200 hover:shadow-lg active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating 3-Question Quiz...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Quiz (3 Questions)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
