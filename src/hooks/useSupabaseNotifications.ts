import { useEffect, useState, useCallback } from 'react';
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

export function useSupabaseNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      setupRealtimeSubscription();
      checkNotificationPermission();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading notifications:', error);
        toast({ title: 'Error', description: 'Failed to load notifications', variant: 'destructive' });
        return;
      }

      const transformedNotifications: Notification[] = data?.map(notif => ({
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

      setNotifications(transformedNotifications);
      setUnreadCount(transformedNotifications.filter(n => !n.isRead).length);
      
    } catch (error) {
      console.error('Error in loadNotifications:', error);
      toast({ title: 'Error', description: 'Failed to load notifications', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

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

          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);

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

  const addNotification = async (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead' | 'userId'>) => {
    if (!user) return;

    try {
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

      if (error) {
        throw error;
      }
      
      // The realtime subscription will handle adding it to the local state
    } catch (error: any) {
      console.error('Error adding notification:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        throw error;
      }

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        throw error;
      }

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
      
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    permissionGranted,
    addNotification,
    markAsRead,
    markAllAsRead,
    requestPermission,
    refresh: loadNotifications,
  };
}