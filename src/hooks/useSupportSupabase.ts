import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  category: string;
  user_id: string;
  tenant_id: string | null;
  submitted_at: string;
  updated_at: string;
  responses: Array<{
    id: string;
    author: string;
    message: string;
    timestamp: string;
    isInternal: boolean;
  }>;
  submittedBy?: string;
  tenant?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  target_audience: string;
  tenant_id: string | null;
  created_by: string;
  published_at: string;
  expires_at: string | null;
  is_active: boolean;
  view_count: number;
  author_name: string | null;
  isRead?: boolean;
}

const fetchTickets = async (userId: string, role: string, tenantId?: string): Promise<SupportTicket[]> => {
  let query = supabase
    .from('support_tickets')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (role === 'student') {
    query = query.eq('user_id', userId);
  } else if (role === 'tenant_admin' && tenantId) {
    query = query.eq('tenant_id', tenantId);
  }
  // Platform owners see all tickets (no filter)

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as SupportTicket[];
};

const fetchAnnouncements = async (userId: string, tenantId?: string): Promise<Announcement[]> => {
  const { data: announcements, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  if (error) throw error;

  // Check which announcements the user has read
  const { data: reads } = await supabase
    .from('announcement_reads')
    .select('announcement_id')
    .eq('user_id', userId);

  const readIds = new Set(reads?.map(r => r.announcement_id) || []);

  return (announcements || []).map(a => ({
    ...a,
    isRead: readIds.has(a.id)
  })) as Announcement[];
};

export function useSupportSupabase() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading: ticketsLoading, error: ticketsError } = useQuery({
    queryKey: ['support-tickets', user?.id, user?.role, user?.tenantId],
    queryFn: () => fetchTickets(user!.id, user!.role, user?.tenantId),
    enabled: !!user,
  });

  const { data: announcements = [], isLoading: announcementsLoading, error: announcementsError } = useQuery({
    queryKey: ['announcements', user?.id, user?.tenantId],
    queryFn: () => fetchAnnouncements(user!.id, user?.tenantId),
    enabled: !!user,
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticket: Omit<SupportTicket, 'id' | 'submitted_at' | 'updated_at' | 'responses'>) => {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          ...ticket,
          user_id: user!.id,
          tenant_id: user?.tenantId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast({ title: 'Success', description: 'Ticket created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create ticket', variant: 'destructive' });
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SupportTicket> & { id: string }) => {
      const { data, error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast({ title: 'Success', description: 'Ticket updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update ticket', variant: 'destructive' });
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcement: Omit<Announcement, 'id' | 'published_at' | 'view_count' | 'isRead'>) => {
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          ...announcement,
          created_by: user!.id,
          tenant_id: user?.tenantId || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({ title: 'Success', description: 'Announcement published successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to publish announcement', variant: 'destructive' });
    },
  });

  const markAnnouncementReadMutation = useMutation({
    mutationFn: async (announcementId: string) => {
      const { error } = await supabase
        .from('announcement_reads')
        .insert({
          announcement_id: announcementId,
          user_id: user!.id,
        });

      if (error && !error.message.includes('duplicate')) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });

  const toggleAnnouncementMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({ title: 'Success', description: 'Announcement status updated' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update announcement', variant: 'destructive' });
    },
  });

  return {
    tickets,
    announcements,
    isLoading: ticketsLoading || announcementsLoading,
    error: ticketsError || announcementsError,
    createTicket: createTicketMutation.mutate,
    updateTicket: updateTicketMutation.mutate,
    createAnnouncement: createAnnouncementMutation.mutate,
    markAnnouncementRead: markAnnouncementReadMutation.mutate,
    toggleAnnouncement: toggleAnnouncementMutation.mutate,
    isCreatingTicket: createTicketMutation.isPending,
    isUpdatingTicket: updateTicketMutation.isPending,
    isCreatingAnnouncement: createAnnouncementMutation.isPending,
  };
}
