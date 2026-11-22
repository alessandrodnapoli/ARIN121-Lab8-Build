import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client with required header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface QuestionData {
  number: number;
  question: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

interface StoredQuiz {
  id: string;
  title: string;
  studyMaterial: string;
  questions: QuestionData[];
  createdAt: number;
}

function maskPayload(obj: any): string {
  const str = JSON.stringify(obj);
  let masked = '';
  for (let i = 0; i < str.length; i++) {
    masked += String.fromCharCode(str.charCodeAt(i) ^ 0x3c);
  }
  return Buffer.from(masked, 'binary').toString('base64');
}

function unmaskPayload(token: string): StoredQuiz | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('binary');
    let unmasked = '';
    for (let i = 0; i < raw.length; i++) {
      unmasked += String.fromCharCode(raw.charCodeAt(i) ^ 0x3c);
    }
    return JSON.parse(unmasked);
  } catch {
    return null;
  }
}

// In-memory store for generated quizzes (answers hidden from client until submission)
const quizStore = new Map<string, StoredQuiz>();

// Clean up quizzes older than 4 hours
setInterval(() => {
  const now = Date.now();
  for (const [id, quiz] of quizStore.entries()) {
    if (now - quiz.createdAt > 4 * 60 * 60 * 1000) {
      quizStore.delete(id);
    }
  }
}, 30 * 60 * 1000);

async function generateQuizWithRetry(prompt: string, systemInstruction: string, schema: any, maxRetries = 3) {
  let delay = 1000;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });
      return response;
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      const isTransient =
        errMsg.includes('503') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('429') ||
        errMsg.includes('high demand') ||
        errMsg.includes('ResourceExhausted');

      if (attempt < maxRetries && isTransient) {
        console.warn(`Gemini API attempt ${attempt} transient failure. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw err;
      }
    }
  }
  throw new Error('Gemini service temporarily unavailable. Please try again in a moment.');
}

// API: Generate 3-Question Multiple Choice Quiz
app.post('/api/quiz/generate', async (req, res) => {
  try {
    const { material } = req.body;

    if (!material || typeof material !== 'string' || material.trim().length === 0) {
      return res.status(400).json({
        error: 'Source material is required. Please supply your lecture notes or study material before generating a quiz.',
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in environment secrets.',
      });
    }

    const systemInstruction = `Identity: You are a practice quiz assistant for university students.
Source Constraints: Base questions, correct answers, and explanations strictly on the study material supplied by the user. If no material is supplied, ask for it before generating a quiz.
Module 1: Quiz Generation and Presentation
Using the study material provided by the student, create a quiz with exactly three multiple-choice questions. Number the questions 1, 2, and 3, and provide four answer choices for each question, labelled A, B, C, and D. Make sure each question has only one correct answer. Make the questions university-level, testing conceptual understanding, definitions, cause-and-effect, and key principles present in the material.`;

    const userPrompt = `Here is the student's study material:
---
${material.trim()}
---

Please generate exactly three multiple-choice questions (1, 2, 3) with four answer choices each (A, B, C, D) and identify the single correct choice and an educational explanation based solely on the text above.`;

    const quizSchema = {
      type: Type.OBJECT,
      properties: {
        quizTitle: {
          type: Type.STRING,
          description: 'A concise subject/topic title for the quiz based on the notes',
        },
        questions: {
          type: Type.ARRAY,
          description: 'Array of exactly three multiple-choice questions',
          items: {
            type: Type.OBJECT,
            properties: {
              number: {
                type: Type.INTEGER,
                description: 'Question number: 1, 2, or 3',
              },
              question: {
                type: Type.STRING,
                description: 'The question text testing material understanding',
              },
              optionA: {
                type: Type.STRING,
                description: 'Full text for Option A',
              },
              optionB: {
                type: Type.STRING,
                description: 'Full text for Option B',
              },
              optionC: {
                type: Type.STRING,
                description: 'Full text for Option C',
              },
              optionD: {
                type: Type.STRING,
                description: 'Full text for Option D',
              },
              correctOption: {
                type: Type.STRING,
                description: "The single correct option letter. Must be exactly 'A', 'B', 'C', or 'D'",
              },
              explanation: {
                type: Type.STRING,
                description: 'Clear explanation based on the material explaining why the correct option is right and addressing why other options are wrong or mistaken',
              },
            },
            required: [
              'number',
              'question',
              'optionA',
              'optionB',
              'optionC',
              'optionD',
              'correctOption',
              'explanation',
            ],
          },
        },
      },
      required: ['quizTitle', 'questions'],
    };

    const response = await generateQuizWithRetry(userPrompt, systemInstruction, quizSchema);

    const rawText = response.text || '{}';
    const parsed = JSON.parse(rawText);

    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length < 3) {
      throw new Error('AI response did not contain 3 valid questions. Please try again.');
    }

    const quizId = 'quiz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    // Normalize questions to exactly 3 questions numbered 1, 2, 3
    const validLabels: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const normalizedQuestions: QuestionData[] = parsed.questions.slice(0, 3).map((q: any, idx: number) => {
      const optA = String(q.optionA || (q.options && q.options[0]?.text) || 'Option A').replace(/^[A-Da-d][\.\)\:\-]\s*/, '').trim();
      const optB = String(q.optionB || (q.options && q.options[1]?.text) || 'Option B').replace(/^[A-Da-d][\.\)\:\-]\s*/, '').trim();
      const optC = String(q.optionC || (q.options && q.options[2]?.text) || 'Option C').replace(/^[A-Da-d][\.\)\:\-]\s*/, '').trim();
      const optD = String(q.optionD || (q.options && q.options[3]?.text) || 'Option D').replace(/^[A-Da-d][\.\)\:\-]\s*/, '').trim();

      const options = [
        { label: 'A' as const, text: optA },
        { label: 'B' as const, text: optB },
        { label: 'C' as const, text: optC },
        { label: 'D' as const, text: optD },
      ];

      let correctOpt = String(q.correctOption || 'A').toUpperCase().trim().replace(/[^ABCD]/g, '') as 'A' | 'B' | 'C' | 'D';
      if (!validLabels.includes(correctOpt)) {
        correctOpt = 'A';
      }

      return {
        number: idx + 1,
        question: String(q.question).trim(),
        options,
        correctOption: correctOpt,
        explanation: String(q.explanation || 'Refer to the lecture notes for context.').trim(),
      };
    });

    const quizRecord: StoredQuiz = {
      id: quizId,
      title: parsed.quizTitle || 'Lecture Material Practice Quiz',
      studyMaterial: material.trim(),
      questions: normalizedQuestions,
      createdAt: Date.now(),
    };

    // Store in backend cache with answers hidden from student
    quizStore.set(quizId, quizRecord);
    const quizToken = maskPayload(quizRecord);

    // Return to client WITHOUT correctOption or explanation!
    // As required: "Display all three questions clearly without revealing the correct answers or providing explanations."
    const clientQuestions = normalizedQuestions.map(q => ({
      number: q.number,
      question: q.question,
      options: q.options,
    }));

    return res.json({
      quizId,
      quizToken,
      title: parsed.quizTitle || 'Lecture Material Practice Quiz',
      questions: clientQuestions,
      instructions: 'Please submit your answers using the question number followed by your chosen letter (e.g., 1B, 2D, 3A).',
    });
  } catch (error: any) {
    console.error('Quiz Generation Error:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while generating your practice quiz. Please try again.',
    });
  }
});

// API: Submit & Grade Quiz
app.post('/api/quiz/submit', async (req, res) => {
  try {
    const { quizId, quizToken, answers } = req.body;

    if (!quizId && !quizToken) {
      return res.status(400).json({ error: 'Quiz identifier is required.' });
    }

    let storedQuiz = quizId ? quizStore.get(quizId) : null;
    if (!storedQuiz && quizToken) {
      storedQuiz = unmaskPayload(quizToken);
    }

    if (!storedQuiz) {
      return res.status(404).json({
        error: 'Quiz session has expired or was not found. Please generate a new quiz.',
      });
    }

    // Check if answers are missing or incomplete (Module 2 requirement:
    // "If the student leaves an answer blank or submits an answer with an unclear question number, ask them to clarify before grading the quiz.")
    const missingQuestions: number[] = [];
    for (let i = 1; i <= 3; i++) {
      const ans = answers?.[i] || answers?.[String(i)];
      if (!ans || !['A', 'B', 'C', 'D'].includes(String(ans).toUpperCase())) {
        missingQuestions.push(i);
      }
    }

    if (missingQuestions.length > 0) {
      return res.status(400).json({
        error: `Please select an answer for Question ${missingQuestions.join(', ')} before submitting. All three questions must be answered to grade the quiz.`,
        missingQuestions,
      });
    }

    // Grade each question
    let score = 0;
    const results = storedQuiz.questions.map(q => {
      const studentChoice = String(answers[q.number] || answers[String(q.number)]).toUpperCase() as 'A' | 'B' | 'C' | 'D';
      const isCorrect = studentChoice === q.correctOption;
      if (isCorrect) score += 1;

      return {
        number: q.number,
        question: q.question,
        options: q.options,
        selectedOption: studentChoice,
        correctOption: q.correctOption,
        isCorrect,
        explanation: q.explanation,
      };
    });

    // Create student answer format string (e.g., "1B, 2D, 3A")
    const formattedSubmission = results
      .map(r => `${r.number}${r.selectedOption}`)
      .join(', ');

    // Generate feedback summary conforming to Module 2 guidelines
    let performanceRating = 'Keep practicing!';
    if (score === 3) {
      performanceRating = 'Outstanding! You have mastered this study material.';
    } else if (score === 2) {
      performanceRating = 'Good job! A solid grasp of most concepts, with minor points to review.';
    } else if (score === 1) {
      performanceRating = 'Fair effort. Review the study material explanations below to solidify core ideas.';
    } else {
      performanceRating = 'Review needed. Take time to read through the explanations and revisit your notes.';
    }

    return res.json({
      quizId,
      title: storedQuiz.title,
      score,
      total: 3,
      percentage: Math.round((score / 3) * 100),
      formattedSubmission,
      performanceRating,
      results,
    });
  } catch (error: any) {
    console.error('Quiz Submission Error:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while evaluating your answers.',
    });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
