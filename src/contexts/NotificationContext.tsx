import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications for different user types
const mockNotifications: Record<string, Notification[]> = {
  '1': [ // Platform Owner
    {
      id: 'n1',
      title: 'New Tenant Registration',
      message: 'TechCorp University has submitted a registration request',
      type: 'info',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      userId: '1',
      actionUrl: '/tenants'
    },
    {
      id: 'n2',
      title: 'System Alert',
      message: 'High CPU usage detected on server cluster',
      type: 'warning',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: false,
      userId: '1'
    }
  ],
  '2': [ // Tenant Admin
    {
      id: 'n3',
      title: 'Support Ticket Response',
      message: 'Platform support has responded to your video playback issue',
      type: 'info',
      timestamp: '2024-01-15T11:00:00Z',
      isRead: false,
      userId: '2',
      actionUrl: '/help-support'
    },
    {
      id: 'n4',
      title: 'New Student Registration',
      message: '5 new students have registered for your courses',
      type: 'success',
      timestamp: '2024-01-15T08:30:00Z',
      isRead: true,
      userId: '2',
      actionUrl: '/students'
    }
  ],
  '3': [ // Student
    {
      id: 'n5',
      title: 'New Assignment Available',
      message: 'Data Structures - Assignment 3 has been published',
      type: 'assignment',
      timestamp: '2024-01-15T14:00:00Z',
      isRead: false,
      userId: '3',
      actionUrl: '/assignments'
    },
    {
      id: 'n6',
      title: 'Grade Published',
      message: 'Your grade for Midterm Exam is now available',
      type: 'grade',
      timestamp: '2024-01-15T12:30:00Z',
      isRead: false,
      userId: '3',
      actionUrl: '/grades'
    }
  ]
};

interface NotificationProviderProps {
  children: ReactNode;
  userId: string;
}

export function NotificationProvider({ children, userId }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load notifications for current user
    const userNotifications = mockNotifications[userId] || [];
    setNotifications(userNotifications);
  }, [userId]);

  useEffect(() => {
    // Check if browser supports notifications
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

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
    const newNotification: Notification = {
      ...notificationData,
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      userId
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    toast({
      title: newNotification.title,
      description: newNotification.message,
    });
  };

  const sendPushNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    // Add to internal notification list
    addNotification(notificationData);

    // Send browser push notification if permission granted
    if (permissionGranted && 'Notification' in window) {
      const browserNotification = new Notification(notificationData.title, {
        body: notificationData.message,
        icon: '/favicon.ico',
        tag: notificationData.type,
        requireInteraction: notificationData.type === 'error' || notificationData.type === 'warning'
      });

      // Handle notification click
      browserNotification.onclick = () => {
        window.focus();
        if (notificationData.actionUrl) {
          // In a real app, you'd use your router to navigate
          console.log('Navigate to:', notificationData.actionUrl);
        }
        browserNotification.close();
      };

      // Auto close after 5 seconds for non-critical notifications
      if (notificationData.type === 'info' || notificationData.type === 'success') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Simulate receiving new notifications periodically (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications for demo purposes
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        const demoNotifications = {
          '1': [
            { title: 'New Tenant Request', message: 'ABC College wants to join the platform', type: 'info' as const },
            { title: 'System Health', message: 'All systems operating normally', type: 'success' as const }
          ],
          '2': [
            { title: 'Student Activity', message: 'New course completion detected', type: 'info' as const },
            { title: 'Support Update', message: 'Your ticket has been updated', type: 'info' as const }
          ],
          '3': [
            { title: 'Reminder', message: 'Assignment due tomorrow', type: 'warning' as const },
            { title: 'New Message', message: 'Instructor sent you a message', type: 'info' as const }
          ]
        };

        const userDemoNotifications = demoNotifications[userId];
        if (userDemoNotifications && userDemoNotifications.length > 0) {
          const randomNotification = userDemoNotifications[Math.floor(Math.random() * userDemoNotifications.length)];
          sendPushNotification({
            ...randomNotification,
            userId
          });
        }
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [userId, permissionGranted]);

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
      sendPushNotification
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