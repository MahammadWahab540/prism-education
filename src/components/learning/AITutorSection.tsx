
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Message {
  id: number;
  sender: string;
  message: string;
  isAI: boolean;
}

export function AITutorSection() {
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "AI Tutor",
      message: "Hello! I'm your AI Tutor for the 'Introduction to Quantum Physics' stage. Ask me anything about the quantum concepts we're covering in this specific lesson!",
      isAI: true
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    const userMessage: Message = {
      id: chatMessages.length + 1,
      sender: "You",
      message: chatInput,
      isAI: false
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Stage-specific AI response - context limited to current lesson
    let aiResponse = "That's an interesting question! In this 'Introduction to Quantum Physics' stage, I can help you understand the foundational concepts we're covering. Could you ask about qubits, superposition, or other basics from this specific lesson?";
    
    const input = chatInput.toLowerCase();
    const currentStage = "Introduction to Quantum Physics"; // This would come from props in a real implementation
    
    if (input.includes("qubit")) {
      aiResponse = `Great question about qubits in "${currentStage}"! A qubit is the fundamental unit of quantum information that we're covering in this stage. Unlike classical bits that can only be 0 or 1, qubits can exist in a superposition of both states simultaneously. This is the foundation we need before moving to the next stages.`;
    } else if (input.includes("superposition")) {
      aiResponse = `Excellent! Superposition is a key concept in "${currentStage}". It means a quantum particle can exist in multiple states at the same time. In this introductory stage, think of it as the quantum version of a coin spinning in the air - it's neither heads nor tails until it lands. This principle is what makes quantum computing fundamentally different.`;
    } else if (input.includes("entanglement")) {
      aiResponse = `Good question about entanglement! While we touch on this in "${currentStage}", we'll explore it in much greater detail in later stages. For now, just know that entanglement is when quantum particles become connected in a special way - measuring one affects the other instantly, regardless of distance.`;
    } else if (input.includes("next") || input.includes("stage")) {
      aiResponse = `In "${currentStage}", we focus on the fundamental concepts. The next stages will build upon what you learn here, covering qubits in more detail, quantum gates, and practical applications. Make sure you understand superposition before moving forward!`;
    }

    const aiMessage: Message = {
      id: chatMessages.length + 2,
      sender: "AI Tutor",
      message: aiResponse,
      isAI: true
    };

    setTimeout(() => {
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setChatInput("");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isAI ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isAI
                    ? "bg-muted text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm font-medium mb-1">{message.sender}</p>
                <p className="text-sm">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
            placeholder="Ask about quantum computing concepts..."
            className="flex-1 px-3 py-2 border border-input rounded-md bg-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow]"
          />
          <Button onClick={handleChatSubmit}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
