import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Ticket, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  MessageCircle,
  Search,
  Filter,
  Bell,
  Send
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock data for tickets from tenants
const mockTickets = [
  {
    id: 'T001',
    title: 'Login Issues for Multiple Students',
    description: 'Students are unable to login to the platform. Getting authentication errors.',
    status: 'open',
    priority: 'high',
    tenant: 'University of Technology',
    tenantId: 'tenant-1',
    submittedBy: 'admin@university.edu',
    submittedAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    category: 'Authentication',
    responses: [
      {
        id: 'R001',
        author: 'admin@university.edu',
        message: 'This started happening after the maintenance yesterday. Affecting about 50+ students.',
        timestamp: '2024-01-15T10:35:00Z',
        isInternal: false
      }
    ]
  },
  {
    id: 'T002',
    title: 'Course Video Playback Problems',
    description: 'Video content is not loading properly in Safari browsers.',
    status: 'in_progress',
    priority: 'medium',
    tenant: 'Metro College',
    tenantId: 'tenant-2',
    submittedBy: 'support@metro.edu',
    submittedAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    category: 'Technical',
    responses: [
      {
        id: 'R002',
        author: 'support@metro.edu',
        message: 'The issue appears to be browser-specific. Chrome works fine.',
        timestamp: '2024-01-14T09:20:00Z',
        isInternal: false
      },
      {
        id: 'R003',
        author: 'platform-support',
        message: 'We are investigating the Safari compatibility issue. Will update soon.',
        timestamp: '2024-01-15T11:00:00Z',
        isInternal: true
      }
    ]
  },
  {
    id: 'T003',
    title: 'Bulk Student Import Feature Request',
    description: 'Need ability to import multiple students via CSV file upload.',
    status: 'resolved',
    priority: 'low',
    tenant: 'City Academy',
    tenantId: 'tenant-3',
    submittedBy: 'admin@cityacademy.edu',
    submittedAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-13T16:45:00Z',
    category: 'Feature Request',
    responses: [
      {
        id: 'R004',
        author: 'admin@cityacademy.edu',
        message: 'Currently have to add 200+ students manually which is very time consuming.',
        timestamp: '2024-01-10T14:25:00Z',
        isInternal: false
      },
      {
        id: 'R005',
        author: 'platform-support',
        message: 'This feature has been implemented and is now available in your admin panel.',
        timestamp: '2024-01-13T16:45:00Z',
        isInternal: true
      }
    ]
  }
];

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

export function PlatformOwnerSupport() {
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newResponse, setNewResponse] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.tenant.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
        : ticket
    ));
    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${newStatus}`,
    });
  };

  const handleAddResponse = () => {
    if (!newResponse.trim() || !selectedTicket) return;

    const response = {
      id: `R${Date.now()}`,
      author: 'platform-support',
      message: newResponse,
      timestamp: new Date().toISOString(),
      isInternal: true
    };

    setTickets(prev => prev.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { 
            ...ticket, 
            responses: [...ticket.responses, response],
            updatedAt: new Date().toISOString()
          }
        : ticket
    ));

    setNewResponse('');
    toast({
      title: "Response Added",
      description: "Your response has been sent to the tenant",
    });
  };

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const highPriorityTickets = tickets.filter(t => t.priority === 'high').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">Manage support tickets from all tenants</p>
        </div>
        <Button>
          <Bell className="h-4 w-4 mr-2" />
          Send Notification
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityTickets}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>All tickets from tenant administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
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
                        <span>From: {ticket.tenant}</span>
                        <span>By: {ticket.submittedBy}</span>
                        <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={ticket.status}
                        onValueChange={(value) => handleStatusChange(ticket.id, value)}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Respond ({ticket.responses.length})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Ticket #{ticket.id}: {ticket.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <p className="font-medium mb-2">Original Issue:</p>
                              <p className="text-sm">{ticket.description}</p>
                              <div className="flex items-center gap-2 mt-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{ticket.submittedBy.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  {ticket.submittedBy} • {new Date(ticket.submittedAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="font-medium">Conversation:</h4>
                              {ticket.responses.map((response) => (
                                <div 
                                  key={response.id} 
                                  className={`p-3 rounded-lg ${
                                    response.isInternal ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback>{response.author.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{response.author}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(response.timestamp).toLocaleString()}
                                    </span>
                                    {response.isInternal && (
                                      <Badge variant="secondary" className="text-xs">Platform Response</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm">{response.message}</p>
                                </div>
                              ))}
                            </div>
                            
                            <div className="border-t pt-4">
                              <Label htmlFor="response">Add Response:</Label>
                              <Textarea
                                id="response"
                                placeholder="Type your response to the tenant..."
                                value={newResponse}
                                onChange={(e) => setNewResponse(e.target.value)}
                                className="mt-2"
                                rows={3}
                              />
                              <Button onClick={handleAddResponse} className="mt-2">
                                <Send className="h-4 w-4 mr-2" />
                                Send Response
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}