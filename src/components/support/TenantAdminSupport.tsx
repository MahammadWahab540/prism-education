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
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Ticket, 
  Megaphone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Send,
  MessageSquare,
  Users,
  Bell
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock data for tickets and announcements
const mockTickets = [
  {
    id: 'T001',
    title: 'Video Playback Issues',
    description: 'Students report that course videos are not loading in their browsers',
    status: 'open',
    priority: 'high',
    category: 'Technical',
    submittedAt: '2024-01-15T10:30:00Z',
    responses: [
      {
        id: 'R001',
        author: 'Platform Support',
        message: 'We have received your ticket and are investigating the video playback issue. We will update you within 24 hours.',
        timestamp: '2024-01-15T11:00:00Z',
        isInternal: true
      }
    ]
  },
  {
    id: 'T002',
    title: 'Bulk Student Import',
    description: 'Need assistance with importing 200+ students via CSV file',
    status: 'resolved',
    priority: 'medium',
    category: 'Feature Request',
    submittedAt: '2024-01-10T14:20:00Z',
    responses: [
      {
        id: 'R002',
        author: 'Platform Support',
        message: 'The bulk import feature is now available in your admin panel. You can access it under Students > Import.',
        timestamp: '2024-01-12T16:45:00Z',
        isInternal: true
      }
    ]
  }
];

const mockAnnouncements = [
  {
    id: 'A001',
    title: 'Welcome to Spring Semester 2024',
    content: 'We are excited to welcome all students to the new semester. Please check your course schedules and complete the orientation modules.',
    priority: 'high',
    targetAudience: 'all_students',
    publishedAt: '2024-01-15T09:00:00Z',
    expiresAt: '2024-01-30T23:59:59Z',
    isActive: true,
    viewCount: 245,
    author: 'Academic Office'
  },
  {
    id: 'A002',
    title: 'Library Hours Extended',
    content: 'Starting this week, the digital library will be available 24/7. Access your resources anytime through the Library tab.',
    priority: 'medium',
    targetAudience: 'all_students',
    publishedAt: '2024-01-12T14:00:00Z',
    expiresAt: '2024-02-15T23:59:59Z',
    isActive: true,
    viewCount: 189,
    author: 'Library Services'
  }
];

export function TenantAdminSupport() {
  const [tickets, setTickets] = useState(mockTickets);
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium',
    targetAudience: 'all_students',
    expiresAt: ''
  });
  const { toast } = useToast();

  const handleSubmitTicket = () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const ticket = {
      id: `T${String(tickets.length + 1).padStart(3, '0')}`,
      ...newTicket,
      status: 'open',
      submittedAt: new Date().toISOString(),
      responses: []
    };

    setTickets(prev => [ticket, ...prev]);
    setNewTicket({ title: '', description: '', priority: 'medium', category: 'general' });
    setShowTicketForm(false);
    
    toast({
      title: "Ticket Submitted",
      description: "Your support ticket has been submitted successfully",
    });
  };

  const handlePublishAnnouncement = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const announcement = {
      id: `A${String(announcements.length + 1).padStart(3, '0')}`,
      ...newAnnouncement,
      publishedAt: new Date().toISOString(),
      isActive: true,
      viewCount: 0,
      author: 'Admin'
    };

    setAnnouncements(prev => [announcement, ...prev]);
    setNewAnnouncement({
      title: '',
      content: '',
      priority: 'medium',
      targetAudience: 'all_students',
      expiresAt: ''
    });
    setShowAnnouncementForm(false);
    
    toast({
      title: "Announcement Published",
      description: "Your announcement has been published to students",
    });
  };

  const toggleAnnouncementStatus = (id: string) => {
    setAnnouncements(prev => prev.map(ann => 
      ann.id === id ? { ...ann, isActive: !ann.isActive } : ann
    ));
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">Manage support tickets and student announcements</p>
        </div>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
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
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Support Tickets</CardTitle>
                  <CardDescription>Track and manage your support requests</CardDescription>
                </div>
                <Dialog open={showTicketForm} onOpenChange={setShowTicketForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Ticket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Support Ticket</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ticket-title">Title</Label>
                        <Input
                          id="ticket-title"
                          placeholder="Brief description of the issue"
                          value={newTicket.title}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ticket-description">Description</Label>
                        <Textarea
                          id="ticket-description"
                          placeholder="Detailed description of the issue you're experiencing"
                          value={newTicket.description}
                          onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ticket-priority">Priority</Label>
                          <Select 
                            value={newTicket.priority} 
                            onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="ticket-category">Category</Label>
                          <Select 
                            value={newTicket.category} 
                            onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="billing">Billing</SelectItem>
                              <SelectItem value="feature_request">Feature Request</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={handleSubmitTicket} className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Submit Ticket
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
                    <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No support tickets yet</p>
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
                              <Badge variant={getPriorityColor(ticket.priority)}>
                                {ticket.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="secondary">{ticket.category}</Badge>
                            </div>
                            <h3 className="font-semibold mb-1">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Submitted: {new Date(ticket.submittedAt).toLocaleDateString()}</span>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Student Announcements</CardTitle>
                  <CardDescription>Create and manage announcements for your students</CardDescription>
                </div>
                <Dialog open={showAnnouncementForm} onOpenChange={setShowAnnouncementForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Megaphone className="h-4 w-4 mr-2" />
                      New Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Announcement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="announcement-title">Title</Label>
                        <Input
                          id="announcement-title"
                          placeholder="Announcement title"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="announcement-content">Content</Label>
                        <Textarea
                          id="announcement-content"
                          placeholder="Write your announcement message here..."
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="announcement-priority">Priority</Label>
                          <Select 
                            value={newAnnouncement.priority} 
                            onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, priority: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="announcement-audience">Target Audience</Label>
                          <Select 
                            value={newAnnouncement.targetAudience} 
                            onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, targetAudience: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all_students">All Students</SelectItem>
                              <SelectItem value="new_students">New Students</SelectItem>
                              <SelectItem value="senior_students">Senior Students</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="announcement-expires">Expires At (Optional)</Label>
                        <Input
                          id="announcement-expires"
                          type="datetime-local"
                          value={newAnnouncement.expiresAt}
                          onChange={(e) => setNewAnnouncement(prev => ({ ...prev, expiresAt: e.target.value }))}
                        />
                      </div>
                      <Button onClick={handlePublishAnnouncement} className="w-full">
                        <Bell className="h-4 w-4 mr-2" />
                        Publish Announcement
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No announcements published yet</p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <Card key={announcement.id} className={`${announcement.isActive ? '' : 'opacity-60'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={getPriorityColor(announcement.priority)}>
                                {announcement.priority.toUpperCase()}
                              </Badge>
                              <Badge variant="outline">{announcement.targetAudience.replace('_', ' ')}</Badge>
                              <Badge variant={announcement.isActive ? 'default' : 'secondary'}>
                                {announcement.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <h3 className="font-semibold mb-1">{announcement.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Published: {new Date(announcement.publishedAt).toLocaleDateString()}</span>
                              <span><Users className="h-3 w-3 inline mr-1" />{announcement.viewCount} views</span>
                              {announcement.expiresAt && (
                                <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleAnnouncementStatus(announcement.id)}
                          >
                            {announcement.isActive ? 'Deactivate' : 'Activate'}
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
      </Tabs>
    </div>
  );
}