import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'assignment' | 'grade' | 'announcement';
  timestamp: string;
  isRead: boolean;
  userId: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  requestPermission: () => Promise<boolean>;
  sendPushNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

// Convert database notification to frontend type
const convertDbNotification = (dbNotification: any): Notification => ({
  id: dbNotification.id,
  title: dbNotification.title,
  message: dbNotification.message,
  type: dbNotification.type,
  timestamp: dbNotification.created_at,
  isRead: dbNotification.is_read,
  userId: dbNotification.user_id,
  actionUrl: dbNotification.action_url,
  metadata: dbNotification.metadata,
});

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Query notifications from Supabase
  const { 
    data: notifications = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async (): Promise<Notification[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(convertDbNotification);
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('New notification received:', payload);
          const newNotification = convertDbNotification(payload.new);
          
          // Update query cache
          queryClient.setQueryData(['notifications', user.id], (old: Notification[] = []) => 
            [newNotification, ...old]
          );

          // Show toast
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });

          // Show browser notification if permission granted
          if (permissionGranted && 'Notification' in window) {
            const browserNotification = new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico',
              tag: newNotification.type,
            });

            browserNotification.onclick = () => {
              window.focus();
              if (newNotification.actionUrl) {
                window.location.href = newNotification.actionUrl;
              }
              browserNotification.close();
            };

            setTimeout(() => browserNotification.close(), 5000);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updatedNotification = convertDbNotification(payload.new);
          queryClient.setQueryData(['notifications', user.id], (old: Notification[] = []) => 
            old.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, toast, permissionGranted]);

  // Check browser notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  // Mutations
  const addNotificationMutation = useMutation({
    mutationFn: async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notificationData.userId,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          action_url: notificationData.actionUrl,
          metadata: notificationData.metadata || {},
        })
        .select()
        .single();

      if (error) throw error;
      return convertDbNotification(data);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const removeNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  // Helper functions
  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermissionGranted(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setPermissionGranted(granted);
      return granted;
    }

    return false;
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    addNotificationMutation.mutate(notificationData);
  };

  const sendPushNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    addNotification(notificationData);
  };

  const markAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const removeNotification = (notificationId: string) => {
    removeNotificationMutation.mutate(notificationId);
  };

  const clearAllNotifications = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id);
      
    if (error) {
      console.error('Error clearing notifications:', error);
      return;
    }
    
    queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications,
      requestPermission,
      sendPushNotification,
      isLoading,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}