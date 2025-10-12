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
import { useSupportSupabase } from '@/hooks/useSupportSupabase';
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

export function PlatformOwnerSupport() {
  const { tickets, isLoading, updateTicket } = useSupportSupabase();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newResponse, setNewResponse] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicket({ id: ticketId, status: newStatus as any });
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

    const updatedResponses = [...selectedTicket.responses, response];
    updateTicket({ 
      id: selectedTicket.id, 
      responses: updatedResponses as any
    });

    setNewResponse('');
  };

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const highPriorityTickets = tickets.filter(t => t.priority === 'high').length;

  if (isLoading) {
    return <div className="p-8 text-center">Loading support tickets...</div>;
  }

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
                        <span>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</span>
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
                                  {ticket.submittedBy || ticket.user_id} • {new Date(ticket.submitted_at).toLocaleString()}
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