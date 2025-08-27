
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VideoSectionProps {
  onProgressUpdate: (progress: number) => void;
}

export function VideoSection({ onProgressUpdate }: VideoSectionProps) {
  const [videoProgress, setVideoProgress] = useState(0);

  const simulateVideoProgress = () => {
    const newProgress = Math.min(videoProgress + 10, 100);
    setVideoProgress(newProgress);
    onProgressUpdate((newProgress / 100) * 30); // Convert to 30% scale for unlock logic
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
          <div className="text-center">
            <Play className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Quantum Computing Introduction Video</p>
            <p className="text-sm text-muted-foreground mt-2">
              (Placeholder for YouTube embed)
            </p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
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
          disabled={videoProgress >= 100}
          className="w-full"
        >
          {videoProgress >= 100 ? 'Video Complete' : 'Simulate Watch Progress'}
        </Button>
      </CardContent>
    </Card>
  );
}
