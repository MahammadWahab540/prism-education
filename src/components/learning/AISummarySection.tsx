
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AISummarySection() {
  const [summaryGenerated, setSummaryGenerated] = useState(false);

  const generateSummary = () => {
    setSummaryGenerated(true);
  };

  return (
    <Card>
      <CardContent className="p-6">
        {!summaryGenerated ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-4">Generate AI Summary</h3>
            <p className="text-muted-foreground mb-6">
              Get a comprehensive summary of the key concepts from this lesson.
            </p>
            <Button onClick={generateSummary} size="lg">
              Generate AI Summary
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Lesson Summary</h3>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                <h4 className="font-semibold mb-2">🔹 Qubits</h4>
                <p className="text-sm text-muted-foreground">
                  The fundamental unit of quantum information that can exist in superposition of 0 and 1 states simultaneously.
                </p>
              </div>
              <div className="p-4 bg-accent-luxury/10 rounded-lg border-l-4 border-accent-luxury">
                <h4 className="font-semibold mb-2">🔸 Superposition</h4>
                <p className="text-sm text-muted-foreground">
                  The quantum phenomenon allowing particles to exist in multiple states at once, enabling parallel computation.
                </p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold mb-2">🔗 Entanglement</h4>
                <p className="text-sm text-muted-foreground">
                  A quantum correlation where measuring one particle instantly affects its entangled partner, regardless of distance.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
