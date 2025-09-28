import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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

const fetchNotifications = async (user: any): Promise<Notification[]> => {
  if (!user) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load notifications: ${error.message}`);
  }

  return data?.map(notif => ({
    id: notif.id,
    title: notif.title,
    message: notif.message,
    type: notif.type,
    timestamp: notif.created_at,
    isRead: notif.is_read,
    userId: notif.user_id,
    actionUrl: notif.action_url,
    metadata: (notif.metadata as Record<string, any>) || {},
  })) || [];
};

export function useSupabaseNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [permissionGranted, setPermissionGranted] = useState(false);

  const { data: notifications = [], isLoading: loading, error } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => fetchNotifications(user),
    enabled: !!user,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (user) {
      setupRealtimeSubscription();
      checkNotificationPermission();
    }
  }, [user, notifications]);

  if (error) {
    toast({ title: 'Error', description: 'Failed to load notifications', variant: 'destructive' });
  }

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-channel')
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
          const newNotification: Notification = {
            id: payload.new.id,
            title: payload.new.title,
            message: payload.new.message,
            type: payload.new.type,
            timestamp: payload.new.created_at,
            isRead: payload.new.is_read,
            userId: payload.new.user_id,
            actionUrl: payload.new.action_url,
            metadata: (payload.new.metadata as Record<string, any>) || {},
          };

          // Invalidate and refetch notifications to update cache
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });

          // Show browser notification if permission granted
          if (permissionGranted && 'Notification' in window) {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico',
              tag: newNotification.type,
            });
          }

          // Show toast notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support notifications.",
        variant: "destructive"
      });
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermissionGranted(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      const granted = result === 'granted';
      setPermissionGranted(granted);
      
      if (granted) {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive browser notifications for important updates.",
        });
      } else {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive"
        });
      }
      
      return granted;
    }

    return false;
  };

  const addNotificationMutation = useMutation({
    mutationFn: async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead' | 'userId'>) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: notificationData.title,
          message: notificationData.message,
          type: notificationData.type,
          action_url: notificationData.actionUrl,
          metadata: notificationData.metadata,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      // The realtime subscription will handle updating the cache
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

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
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  return {
    notifications,
    unreadCount,
    loading,
    error,
    permissionGranted,
    addNotification: addNotificationMutation.mutate,
    isAddingNotification: addNotificationMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    requestPermission,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] }),
  };
}