
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
      message: "Hello! I'm your AI Tutor. Ask me anything about quantum computing concepts like qubits, superposition, or entanglement!",
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

    // Simple AI response based on keywords
    let aiResponse = "That's an interesting question! Could you be more specific about which quantum computing concept you'd like to explore?";
    
    const input = chatInput.toLowerCase();
    if (input.includes("qubit")) {
      aiResponse = "Great question about qubits! A qubit is the basic unit of quantum information. Unlike classical bits that are either 0 or 1, qubits can exist in a superposition of both states simultaneously, giving quantum computers their incredible power.";
    } else if (input.includes("superposition")) {
      aiResponse = "Superposition is one of the most fascinating aspects of quantum mechanics! It allows quantum particles to exist in multiple states at the same time. Think of it like a coin that's spinning in the air - it's neither heads nor tails until it lands and is measured.";
    } else if (input.includes("entanglement")) {
      aiResponse = "Quantum entanglement is often called 'spooky action at a distance.' When particles become entangled, measuring one particle instantly affects its partner, no matter how far apart they are. This property is crucial for quantum computing and quantum communication.";
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
