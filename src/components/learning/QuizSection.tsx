
import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizResult {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

interface QuizSectionProps {
  onQuizComplete: (passed: boolean) => void;
}

export function QuizSection({ onQuizComplete }: QuizSectionProps) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "What is a qubit?",
      options: [
        "A classical bit that can be 0 or 1",
        "A quantum bit that can be in superposition of 0 and 1",
        "A type of quantum computer",
        "A measurement device"
      ],
      correct: 1,
      explanation: "A qubit is the fundamental unit of quantum information that can exist in a superposition of both 0 and 1 states simultaneously."
    },
    {
      id: 2,
      question: "What is quantum superposition?",
      options: [
        "When qubits are stacked on top of each other",
        "The ability of quantum particles to exist in multiple states simultaneously",
        "A type of quantum gate",
        "The process of measuring quantum states"
      ],
      correct: 1,
      explanation: "Quantum superposition allows particles to exist in multiple states at once, which is fundamental to quantum computing's power."
    },
    {
      id: 3,
      question: "What is quantum entanglement?",
      options: [
        "When qubits get physically tangled",
        "A quantum phenomenon where particles become correlated and instantly affect each other regardless of distance",
        "The process of creating qubits",
        "A type of quantum error"
      ],
      correct: 1,
      explanation: "Quantum entanglement creates a correlation between particles where measuring one instantly affects the other, regardless of the distance between them."
    }
  ];

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizCompleted(false);
    setQuizResults([]);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const results = quizQuestions.map((question, index) => ({
      questionId: question.id,
      selectedAnswer: quizAnswers[index],
      isCorrect: quizAnswers[index] === question.correct
    }));
    
    setQuizResults(results);
    setQuizCompleted(true);
    
    const score = results.filter(result => result.isCorrect).length;
    onQuizComplete(score >= 2); // Pass if 2 or more correct
  };

  const retakeQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setQuizAnswers([]);
    setQuizResults([]);
  };

  const score = quizResults.filter(result => result.isCorrect).length;
  const totalQuestions = quizQuestions.length;

  return (
    <Card>
      <CardContent className="p-6">
        {!quizStarted && !quizCompleted && (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4">Ready to Test Your Knowledge?</h3>
            <p className="text-muted-foreground mb-6">
              Take this quiz to check your understanding of quantum computing concepts.
            </p>
            <Button onClick={startQuiz} size="lg">
              Let's Start the Quiz!
            </Button>
          </div>
        )}

        {quizStarted && !quizCompleted && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </h3>
              <Badge variant="outline">
                {currentQuestion + 1}/{quizQuestions.length}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg">{quizQuestions[currentQuestion].question}</h4>
              <div className="space-y-2">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      quizAnswers[currentQuestion] === index
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={nextQuestion}
                disabled={quizAnswers[currentQuestion] === undefined}
              >
                {currentQuestion === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          </div>
        )}

        {quizCompleted && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
              <div className={`text-3xl font-bold mb-2 ${
                score === totalQuestions ? 'text-green-600' : 
                score >= 2 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {score}/{totalQuestions}
              </div>
              <p className="text-muted-foreground">
                {score === totalQuestions
                  ? "Perfect score! Congratulations! 🎉"
                  : score >= 2
                  ? "Good job! You passed the quiz."
                  : "Keep studying and try again!"}
              </p>
            </div>

            {score < totalQuestions && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Review Incorrect Answers:</h4>
                {quizResults.map((result, index) => {
                  if (result.isCorrect) return null;
                  const question = quizQuestions[index];
                  return (
                    <div key={question.id} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h5 className="font-semibold mb-2">{question.question}</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Correct Answer:</strong> {question.options[question.correct]}
                      </p>
                      <p className="text-sm">{question.explanation}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-center">
              <Button onClick={retakeQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
