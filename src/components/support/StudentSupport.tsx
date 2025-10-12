import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSupportSupabase } from '@/hooks/useSupportSupabase';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  MessageSquare, 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  Megaphone,
  Search,
  Calendar,
  BookOpen,
  Star
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'destructive';
    case 'in_progress': return 'default';
    case 'resolved': return 'secondary';
    default: return 'outline';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'outline';
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'assignment': return BookOpen;
    case 'grade': return Star;
    case 'announcement': return Megaphone;
    default: return Bell;
  }
};

export function StudentSupport() {
  const { user } = useAuth();
  const { 
    tickets, 
    announcements, 
    isLoading, 
    createTicket, 
    markAnnouncementRead,
    isCreatingTicket
  } = useSupportSupabase();
  
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general'
  });

  // Fetch notifications from database
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const handleSubmitTicket = () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) return;

    createTicket({ ...newTicket, priority: 'medium' as any, status: 'open' as any } as any);
    setNewTicket({ title: '', description: '', category: 'general' });
    setShowTicketForm(false);
  };

  const handleMarkAnnouncementRead = (id: string) => {
    markAnnouncementRead(id);
  };

  const handleMarkNotificationRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
  };

  const unreadAnnouncements = announcements.filter(a => !a.isRead).length;
  const unreadNotifications = notifications.filter((n: any) => !n.is_read).length;

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">Get help, view announcements, and manage notifications</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={unreadNotifications > 0 ? "destructive" : "secondary"}>
            {unreadNotifications} New Notifications
          </Badge>
          <Badge variant={unreadAnnouncements > 0 ? "destructive" : "secondary"}>
            {unreadAnnouncements} New Announcements
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="help" className="space-y-6">
        <TabsList>
          <TabsTrigger value="help">Help Center</TabsTrigger>
          <TabsTrigger value="announcements" className="relative">
            Announcements
            {unreadAnnouncements > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {unreadAnnouncements}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="help" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'open').length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'in_progress').length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'resolved').length}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Help Requests</CardTitle>
                  <CardDescription>Track your support requests and get help when needed</CardDescription>
                </div>
                <Dialog open={showTicketForm} onOpenChange={setShowTicketForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Get Help
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Help</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="help-title">What do you need help with?</Label>
                        <Input
                          id="help-title"
                          placeholder="Brief description of your issue"
                          value={newTicket.title}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="help-description">Describe your problem</Label>
                        <Textarea
                          id="help-description"
                          placeholder="Please provide as much detail as possible about the issue you're experiencing"
                          value={newTicket.description}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="help-category">Category</Label>
                        <Select 
                          value={newTicket.category} 
                          onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Question</SelectItem>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="account">Account Problem</SelectItem>
                            <SelectItem value="course">Course Content</SelectItem>
                            <SelectItem value="grades">Grades & Assignments</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleSubmitTicket} className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Submit Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No help requests yet</h3>
                    <p className="text-muted-foreground mb-4">Need assistance? Create a help request and our team will assist you.</p>
                    <Button onClick={() => setShowTicketForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Get Help
                    </Button>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">#{ticket.id}</Badge>
                              <Badge variant={getStatusColor(ticket.status)}>
                                {ticket.status.replace('_', ' ').toUpperCase()}
                              </Badge>
                              <Badge variant="secondary">{ticket.category}</Badge>
                            </div>
                            <h3 className="font-semibold mb-1">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                             <div className="flex items-center gap-4 text-xs text-muted-foreground">
                               <span>Submitted: {new Date(ticket.submitted_at).toLocaleDateString()}</span>
                               <span>Responses: {ticket.responses.length}</span>
                             </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>School Announcements</CardTitle>
              <CardDescription>Important updates and news from your institution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                   <Card 
                     key={announcement.id} 
                     className={`cursor-pointer hover:shadow-md transition-shadow ${
                       !announcement.isRead ? 'border-blue-200 bg-blue-50' : ''
                     }`}
                     onClick={() => handleMarkAnnouncementRead(announcement.id)}
                   >
                     <CardContent className="p-4">
                       <div className="flex items-start justify-between">
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-2">
                             <Badge variant={getPriorityColor(announcement.priority)}>
                               {announcement.priority.toUpperCase()}
                             </Badge>
                             {!announcement.isRead && (
                               <Badge variant="default">New</Badge>
                             )}
                             <span className="text-xs text-muted-foreground">
                               From: {announcement.author_name || 'Admin'}
                             </span>
                           </div>
                           <h3 className="font-semibold mb-2 flex items-center gap-2">
                             <Megaphone className="h-4 w-4" />
                             {announcement.title}
                           </h3>
                           <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                           <p className="text-xs text-muted-foreground">
                             Published: {new Date(announcement.published_at).toLocaleString()}
                           </p>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Notifications</CardTitle>
              <CardDescription>Stay updated with your academic progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const IconComponent = getNotificationIcon(notification.type);
                  return (
                    <Card 
                      key={notification.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        !notification.is_read ? 'border-blue-200 bg-blue-50' : ''
                      }`}
                      onClick={() => handleMarkNotificationRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${notification.is_read ? 'bg-muted' : 'bg-primary/10'}`}>
                            <IconComponent className={`h-4 w-4 ${notification.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              {!notification.is_read && (
                                <Badge variant="default" className="h-5 text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}