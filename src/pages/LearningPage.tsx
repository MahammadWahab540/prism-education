
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Youtube, MessageCircle, FileText, Lightbulb, CheckCircle, Send, Play } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useUnlockLogic } from '@/hooks/useUnlockLogic';

const LearningPage = () => {
  const { skillId, stageId } = useParams();
  const navigate = useNavigate();
  const { updateVideoProgress, completeQuiz } = useUnlockLogic(skillId || '');

  // AI Tutor State
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: 'Hello! I\'m your AI tutor. Ask me anything about quantum computing concepts!' }
  ]);
  const [userMessage, setUserMessage] = useState('');

  // AI Summary State
  const [showSummary, setShowSummary] = useState(false);

  // Case Study State
  const [caseStudyText, setCaseStudyText] = useState('');
  const [caseStudyFeedback, setCaseStudyFeedback] = useState(null);

  // Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Video Progress State
  const [videoProgress, setVideoProgress] = useState(0);

  const questions = [
    {
      question: "What is a qubit?",
      options: [
        "A classical bit that can be 0 or 1",
        "A quantum bit that can be in superposition of 0 and 1",
        "A type of quantum computer",
        "A measurement device"
      ],
      correct: 1,
      explanation: "A qubit is the fundamental unit of quantum information that can exist in a superposition of both 0 and 1 states simultaneously, unlike classical bits."
    },
    {
      question: "What is superposition in quantum computing?",
      options: [
        "When two quantum computers work together",
        "The ability of a quantum system to be in multiple states simultaneously",
        "A type of quantum algorithm",
        "The process of measuring a quantum state"
      ],
      correct: 1,
      explanation: "Superposition allows quantum particles to exist in multiple states at once, enabling quantum computers to process many possibilities simultaneously."
    },
    {
      question: "What is quantum entanglement?",
      options: [
        "When qubits become physically connected",
        "A quantum phenomenon where particles remain connected regardless of distance",
        "The process of creating qubits",
        "A type of quantum gate"
      ],
      correct: 1,
      explanation: "Quantum entanglement is a phenomenon where two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently."
    }
  ];

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', content: userMessage }];
    
    let aiResponse = "I'd be happy to help you understand quantum computing concepts better. Could you be more specific about what you'd like to know?";
    
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('qubit')) {
      aiResponse = "Great question about qubits! A qubit is the basic unit of quantum information. Unlike classical bits that are either 0 or 1, qubits can exist in a superposition of both states simultaneously. This is what gives quantum computers their power!";
    } else if (lowerMsg.includes('superposition')) {
      aiResponse = "Superposition is one of the most fascinating quantum phenomena! It means a quantum system can exist in multiple states at the same time. Think of it like a coin spinning in the air - it's neither heads nor tails until it lands and you observe it.";
    } else if (lowerMsg.includes('entanglement')) {
      aiResponse = "Quantum entanglement is often called 'spooky action at a distance.' When particles become entangled, measuring one instantly affects the other, no matter how far apart they are. Einstein famously didn't like this concept, but it's been proven real!";
    }

    newMessages.push({ role: 'ai', content: aiResponse });
    setChatMessages(newMessages);
    setUserMessage('');
  };

  const handleGenerateSummary = () => {
    setShowSummary(true);
  };

  const handleCaseStudySubmit = () => {
    const text = caseStudyText.toLowerCase();
    const hasSuperposition = text.includes('superposition');
    const hasEntanglement = text.includes('entanglement');

    if (hasSuperposition && hasEntanglement) {
      setCaseStudyFeedback({
        type: 'excellent',
        message: 'Excellent Analysis!',
        details: 'You correctly identified both superposition and entanglement concepts. Consider also discussing quantum parallelism and how it could process multiple route calculations simultaneously.'
      });
    } else if (hasSuperposition || hasEntanglement) {
      setCaseStudyFeedback({
        type: 'good',
        message: 'Good Start...',
        details: `You mentioned ${hasSuperposition ? 'superposition' : 'entanglement'} but missed ${hasSuperposition ? 'entanglement' : 'superposition'}. Try to explain how both concepts could work together in route optimization.`
      });
    } else {
      setCaseStudyFeedback({
        type: 'needs-revision',
        message: 'Needs Revision',
        details: 'Your analysis should include the core quantum concepts of superposition and entanglement. Review the lesson content and try to explain how these could help optimize delivery routes.'
      });
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const handleAnswerQuestion = (answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate final score
      const score = newAnswers.reduce((total, answer, index) => {
        return total + (answer === questions[index].correct ? 1 : 0);
      }, 0);
      
      setQuizScore(score);
      setQuizCompleted(true);
      
      // Mark quiz as completed if score is good enough
      if (score >= 2) {
        completeQuiz(stageId || '');
      }
    }
  };

  const handleRetakeQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuizScore(0);
  };

  const simulateVideoProgress = () => {
    const newProgress = Math.min(videoProgress + 10, 100);
    setVideoProgress(newProgress);
    
    // Update progress in the unlock logic (convert to 30% scale)
    updateVideoProgress(stageId || '', (newProgress / 100) * 30);
  };

  const handleBackToRoadmap = () => {
    navigate(`/roadmap/${skillId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBackToRoadmap}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Roadmap
          </Button>
        </div>

        <div className="text-center space-y-4 py-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent-luxury flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Lesson: Introduction to Quantum Computing
          </h1>
          <p className="text-muted-foreground text-lg">
            Stage 1: Core Concepts
          </p>
        </div>

        {/* Main Tabbed Interface */}
        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              Lesson Video
            </TabsTrigger>
            <TabsTrigger value="tutor" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Tutor
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              AI Summary
            </TabsTrigger>
            <TabsTrigger value="case-study" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              AI Case Study
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Dynamic Quiz
            </TabsTrigger>
          </TabsList>

          {/* Video Tab */}
          <TabsContent value="video" className="space-y-4">
            <div className="bg-card rounded-lg p-6 border">
              <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Video Player Placeholder</p>
                  <p className="text-sm text-muted-foreground">Introduction to Quantum Computing</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{videoProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>
              
              <Button 
                onClick={simulateVideoProgress} 
                className="mt-4"
                disabled={videoProgress >= 100}
              >
                {videoProgress >= 100 ? 'Video Complete' : 'Simulate Watch Progress'}
              </Button>
            </div>
          </TabsContent>

          {/* AI Tutor Tab */}
          <TabsContent value="tutor" className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/30 rounded-lg">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about qubits, superposition, or entanglement..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* AI Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              {!showSummary ? (
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">Generate AI Summary</h3>
                  <p className="text-muted-foreground">
                    Get a comprehensive summary of the key concepts from this lesson.
                  </p>
                  <Button onClick={handleGenerateSummary} className="bg-gradient-to-r from-primary to-accent-luxury">
                    Generate AI Summary
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">Lesson Summary: Quantum Computing Fundamentals</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                      <h4 className="font-semibold text-foreground mb-2">🔹 Qubits</h4>
                      <p className="text-muted-foreground">
                        The fundamental unit of quantum information. Unlike classical bits, qubits can exist in superposition, 
                        allowing them to be both 0 and 1 simultaneously until measured.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-accent-luxury/10 rounded-lg border-l-4 border-accent-luxury">
                      <h4 className="font-semibold text-foreground mb-2">🔸 Superposition</h4>
                      <p className="text-muted-foreground">
                        A quantum phenomenon where particles can exist in multiple states simultaneously. This enables quantum 
                        computers to process exponentially more information than classical computers.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-500/10 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-semibold text-foreground mb-2">🔗 Entanglement</h4>
                      <p className="text-muted-foreground">
                        When quantum particles become interconnected, measuring one instantly affects the other regardless of 
                        distance. This "spooky action at a distance" enables powerful quantum algorithms.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Case Study Tab */}
          <TabsContent value="case-study" className="space-y-4">
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h3 className="text-xl font-bold text-foreground">Real-World Application</h3>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Scenario:</h4>
                <p className="text-muted-foreground">
                  A logistics company wants to optimize delivery routes for 1000+ packages across a major city. 
                  They need to find the most efficient routes considering traffic, distance, fuel costs, and delivery windows.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="font-semibold text-foreground">
                  Explain how quantum concepts of superposition and entanglement could solve this problem:
                </label>
                <Textarea
                  value={caseStudyText}
                  onChange={(e) => setCaseStudyText(e.target.value)}
                  placeholder="Describe how superposition and entanglement could help optimize delivery routes..."
                  className="min-h-32"
                />
              </div>
              
              <Button 
                onClick={handleCaseStudySubmit}
                disabled={!caseStudyText.trim()}
                className="w-full"
              >
                Submit for AI Evaluation
              </Button>
              
              {caseStudyFeedback && (
                <div className={`p-4 rounded-lg border-l-4 ${
                  caseStudyFeedback.type === 'excellent' ? 'bg-green-50 border-green-500 text-green-800' :
                  caseStudyFeedback.type === 'good' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                  'bg-red-50 border-red-500 text-red-800'
                }`}>
                  <h4 className="font-semibold mb-2">{caseStudyFeedback.message}</h4>
                  <p>{caseStudyFeedback.details}</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              {!quizStarted && !quizCompleted && (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-foreground">Ready to Test Your Knowledge?</h3>
                  <p className="text-muted-foreground">
                    Take this quiz to check your understanding of quantum computing concepts.
                  </p>
                  <Button onClick={handleStartQuiz} className="bg-gradient-to-r from-primary to-accent-luxury">
                    Let's Start the Quiz!
                  </Button>
                </div>
              )}
              
              {quizStarted && !quizCompleted && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Question {currentQuestion + 1} of {questions.length}</h3>
                    <div className="text-sm text-muted-foreground">
                      Progress: {currentQuestion + 1}/{questions.length}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">{questions[currentQuestion].question}</h4>
                    
                    <div className="space-y-2">
                      {questions[currentQuestion].options.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full text-left justify-start p-4 h-auto"
                          onClick={() => handleAnswerQuestion(index)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {quizCompleted && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">Quiz Complete!</h3>
                    <div className={`text-3xl font-bold ${
                      quizScore === questions.length ? 'text-green-600' : 
                      quizScore >= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {quizScore}/{questions.length}
                    </div>
                    {quizScore === questions.length && (
                      <p className="text-green-600 font-semibold">🎉 Congratulations! Perfect score!</p>
                    )}
                  </div>
                  
                  {/* Feedback for incorrect answers */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Review:</h4>
                    {questions.map((question, index) => {
                      const userAnswer = userAnswers[index];
                      const isCorrect = userAnswer === question.correct;
                      
                      if (isCorrect) return null;
                      
                      return (
                        <div key={index} className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                          <h5 className="font-semibold text-red-800 mb-2">
                            Question {index + 1}: {question.question}
                          </h5>
                          <p className="text-red-700 mb-2">
                            <strong>Correct Answer:</strong> {question.options[question.correct]}
                          </p>
                          <p className="text-red-600 text-sm">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Button onClick={handleRetakeQuiz} variant="outline" className="w-full">
                    Retake Quiz
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LearningPage;
