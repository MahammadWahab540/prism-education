import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive browser notifications for important updates.",
        });
        return true;
      } else if (result === 'denied') {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Permission error",
        description: "Failed to request notification permission.",
        variant: "destructive"
      });
      return false;
    }
    
    return false;
  }, [isSupported, toast]);

  const showNotification = useCallback(async (options: NotificationOptions) => {
    if (!isSupported) {
      console.warn('Notifications not supported');
      return null;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag,
        data: options.data,
        requireInteraction: true,
        silent: false
      });

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
        
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      toast({
        title: "Notification error",
        description: "Failed to show notification.",
        variant: "destructive"
      });
      return null;
    }
  }, [isSupported, permission, requestPermission, toast]);

  const showLearningNotification = useCallback((lessonTitle: string, progress?: number) => {
    const body = progress 
      ? `You've completed ${progress}% of "${lessonTitle}". Keep going!`
      : `Continue learning "${lessonTitle}"`;

    return showNotification({
      title: 'Learning Progress Update',
      body,
      icon: '/favicon.ico',
      tag: 'learning-progress',
      data: {
        type: 'learning',
        lessonTitle,
        progress,
        url: window.location.href
      }
    });
  }, [showNotification]);

  const showQuizNotification = useCallback((quizTitle: string, score?: number) => {
    const body = score !== undefined
      ? `Quiz "${quizTitle}" completed! Your score: ${score}%`
      : `New quiz "${quizTitle}" is available`;

    return showNotification({
      title: 'Quiz Update',
      body,
      icon: '/favicon.ico',
      tag: 'quiz-update',
      data: {
        type: 'quiz',
        quizTitle,
        score,
        url: window.location.href
      }
    });
  }, [showNotification]);

  const showStreakNotification = useCallback((streakDays: number) => {
    return showNotification({
      title: '🔥 Streak Achievement!',
      body: `Amazing! You've maintained a ${streakDays}-day learning streak. Keep it up!`,
      icon: '/favicon.ico',
      tag: 'streak-achievement',
      data: {
        type: 'streak',
        streakDays,
        url: '/dashboard'
      }
    });
  }, [showNotification]);

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showLearningNotification,
    showQuizNotification,
    showStreakNotification
  };
}