import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload, Link as LinkIcon, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const EMOJI_LIST = ['📚', '💻', '🎨', '🔬', '📊', '🏗️', '🎯', '🚀', '⚡', '🌟', '🔥', '💡', '🎓', '📱', '🌐', '⚙️', '🎭', '🎬', '🎵', '📈'];

interface IconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (icon: { type: 'emoji' | 'image' | 'url'; value: string }) => void;
}

export function IconPicker({ open, onOpenChange, onSelect }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredEmojis = EMOJI_LIST.filter(() => true); // In real app, filter by search

  const handleEmojiSelect = (emoji: string) => {
    onSelect({ type: 'emoji', value: emoji });
    onOpenChange(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 512 * 1024) {
      toast({ title: 'Error', description: 'Image must be less than 512KB', variant: 'destructive' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onSelect({ type: 'image', value: dataUrl });
      onOpenChange(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) return;
    
    // Validate URL format
    try {
      new URL(imageUrl);
      onSelect({ type: 'url', value: imageUrl });
      onOpenChange(false);
      setImageUrl('');
    } catch {
      toast({ title: 'Error', description: 'Invalid URL', variant: 'destructive' });
    }
  };

  const getRandomEmoji = () => {
    const random = EMOJI_LIST[Math.floor(Math.random() * EMOJI_LIST.length)];
    handleEmojiSelect(random);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Icon</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="emoji" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emoji">Emoji</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="emoji" className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search emojis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button size="icon" variant="outline" onClick={getRandomEmoji}>
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-8 gap-2 max-h-[300px] overflow-y-auto p-2">
              {filteredEmojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="text-3xl hover:bg-accent p-2 rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-3">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                PNG, JPEG, or WebP (max 512KB)
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                Choose File
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-3">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://example.com/icon.png"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    className="pl-8"
                  />
                </div>
                <Button onClick={handleUrlSubmit}>Add</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter a direct link to an image file
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
