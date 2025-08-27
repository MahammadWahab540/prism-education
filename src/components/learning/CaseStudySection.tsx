
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface CaseStudyFeedback {
  type: "excellent" | "good" | "needs-revision" | null;
  message: string;
}

export function CaseStudySection() {
  const [caseStudySubmission, setCaseStudySubmission] = useState("");
  const [caseStudyFeedback, setCaseStudyFeedback] = useState<CaseStudyFeedback>({ 
    type: null, 
    message: "" 
  });

  const submitCaseStudy = () => {
    const submission = caseStudySubmission.toLowerCase();
    const hasSuper = submission.includes("superposition");
    const hasEntangle = submission.includes("entanglement");

    if (hasSuper && hasEntangle) {
      setCaseStudyFeedback({
        type: "excellent",
        message: "Excellent Analysis! You've successfully identified how both superposition and entanglement can revolutionize logistics optimization. Consider exploring how quantum algorithms like QAOA could further enhance route optimization."
      });
    } else if (hasSuper || hasEntangle) {
      setCaseStudyFeedback({
        type: "good",
        message: "Good Start! You've identified one key quantum concept. Try to include both superposition and entanglement in your analysis to show how they work together in quantum optimization algorithms."
      });
    } else {
      setCaseStudyFeedback({
        type: "needs-revision",
        message: "Needs Revision. Your analysis should focus on the core quantum concepts of superposition and entanglement. Review the lesson materials and explain how these principles could solve the logistics optimization problem."
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-semibold">Logistics Optimization Case Study</h3>
        
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm mb-2">
            <strong>Scenario:</strong> A logistics company wants to optimize its delivery routes across 50 cities to minimize travel time and fuel costs. Traditional computers struggle with this complex optimization problem due to the exponential number of possible route combinations.
          </p>
          <p className="text-sm">
            <strong>Your Task:</strong> Explain how the quantum concepts of superposition and entanglement could solve this problem more efficiently than classical computing methods.
          </p>
        </div>
        
        <Textarea
          value={caseStudySubmission}
          onChange={(e) => setCaseStudySubmission(e.target.value)}
          placeholder="Write your analysis here..."
          className="min-h-32"
        />
        
        <Button 
          onClick={submitCaseStudy} 
          disabled={!caseStudySubmission.trim()}
          className="w-full"
        >
          Submit for AI Evaluation
        </Button>
        
        {caseStudyFeedback.type && (
          <div
            className={`p-4 rounded-lg border-l-4 ${
              caseStudyFeedback.type === "excellent"
                ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                : caseStudyFeedback.type === "good"
                ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                : "bg-red-50 dark:bg-red-900/20 border-red-500"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant={
                  caseStudyFeedback.type === "excellent"
                    ? "default"
                    : caseStudyFeedback.type === "good"
                    ? "secondary"
                    : "destructive"
                }
              >
                {caseStudyFeedback.type === "excellent"
                  ? "Excellent Analysis!"
                  : caseStudyFeedback.type === "good"
                  ? "Good Start..."
                  : "Needs Revision"}
              </Badge>
            </div>
            <p className="text-sm">{caseStudyFeedback.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
