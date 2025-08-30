import { useState } from 'react';
import { Bell, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationCTACardProps {
  title: string;
  description: string;
  ctaText: string;
  ctaAction: () => void;
  variant?: 'default' | 'success' | 'warning' | 'info';
  badge?: string;
  onDismiss?: () => void;
  showNotificationButton?: boolean;
}

export function NotificationCTACard({
  title,
  description,
  ctaText,
  ctaAction,
  variant = 'default',
  badge,
  onDismiss,
  showNotificationButton = true
}: NotificationCTACardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { showNotification, requestPermission, permission } = useNotifications();

  const variantStyles = {
    default: 'from-primary/5 to-accent/5 border-primary/20',
    success: 'from-emerald-50 to-green-50 border-emerald-200 dark:from-emerald-500/10 dark:to-green-500/10 dark:border-emerald-500/20',
    warning: 'from-amber-50 to-yellow-50 border-amber-200 dark:from-amber-500/10 dark:to-yellow-500/10 dark:border-amber-500/20',
    info: 'from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-500/10 dark:to-cyan-500/10 dark:border-blue-500/20'
  };

  const iconStyles = {
    default: 'text-primary',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    info: 'text-blue-600 dark:text-blue-400'
  };

  const handleCTAClick = async () => {
    ctaAction();
    
    // Show browser notification for CTA action if permission granted
    if (permission === 'granted') {
      await showNotification({
        title: 'Action Completed',
        body: `${title} - ${ctaText} completed successfully!`,
        data: { type: 'cta-completion' }
      });
    }
  };

  const handleNotificationRequest = async () => {
    await requestPermission();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={`bg-gradient-to-r ${variantStyles[variant]} backdrop-blur-sm`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center ${iconStyles[variant]}`}>
                {variant === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{title}</h4>
                    {badge && (
                      <Badge variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={handleCTAClick}
                    className="h-7 text-xs"
                    variant={variant === 'default' ? 'default' : 'outline'}
                  >
                    {ctaText}
                  </Button>
                  
                  {showNotificationButton && permission !== 'granted' && permission !== 'denied' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleNotificationRequest}
                      className="h-7 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      Enable Notifications
                    </Button>
                  )}
                </div>
              </div>
              
              {onDismiss && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="flex-shrink-0 h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}