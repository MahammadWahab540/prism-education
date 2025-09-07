import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface Message { id: number; sender: string; text: string; }

interface Props {
  contextTitle: string; // stage title
  acceptanceCriteria?: string[];
  validation?: string[];
}

export function CapstoneGuideChat({ contextTitle, acceptanceCriteria = [], validation = [] }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'AI Guide', text: `Hi! I'm your guide for "${contextTitle}". Ask me anything about this checkpoint.` },
  ]);
  const [input, setInput] = useState('');

  const respond = (content: string) => {
    const txt = content.toLowerCase();
    const clarifiers = [
      'What is the smallest outcome you can demo for this stage?',
      'Which dependency is blocking you right now?',
      'Do you have test data or mocks ready?',
      'What acceptance criteria are unclear?',
      'What can you complete in the next 30 minutes?'
    ];
    let advice = '';
    if (txt.includes('deliverable') || txt.includes('repo')) advice = 'Ensure your repository has a clear README, tests, and a working demo link.';
    else if (txt.includes('deadline') || txt.includes('time')) advice = 'Break the task into sub-tasks and timebox. Aim to finish drafts 24h before the deadline.';
    else if (txt.includes('criteria') || txt.includes('acceptance')) advice = `Enforce acceptance criteria: ${acceptanceCriteria.slice(0,3).join('; ') || 'as defined'}.`;
    else advice = `For "${contextTitle}", clarify scope, list acceptance criteria, then iterate quickly.`;
    const smallest = 'Pick one subtask, stub tests, and implement the minimal slice (<30 min).';
    const checklist = [
      ...(validation.length ? [`Validation: ${validation[0]}`] : []),
      ...(acceptanceCriteria.length ? [`Acceptance: ${acceptanceCriteria[0]}`] : []),
      'Commit and push changes',
    ];
    return `${clarifiers.slice(0,3).map(q => `• ${q}`).join('\n')}

Advice: ${advice}
Next action (<30m): ${smallest}
Checklist: ${checklist.join(' | ')}`;
  };

  const onSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: messages.length + 1, sender: 'You', text: input };
    setMessages(prev => [...prev, userMsg]);
    const aiMsg: Message = { id: messages.length + 2, sender: 'AI Guide', text: respond(input) };
    setTimeout(() => setMessages(prev => [...prev, aiMsg]), 500);
    setInput('');
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="h-72 overflow-y-auto space-y-2">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded px-3 py-2 text-sm ${m.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <div className="font-medium mb-0.5">{m.sender}</div>
                <div>{m.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 border rounded bg-background"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder="Ask about this checkpoint..."
          />
          <Button onClick={onSend}><Send className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
