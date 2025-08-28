import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Clock, CheckCircle } from 'lucide-react';

interface RaiseTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerGoal: any;
  onTicketRaised: () => void;
}

export function RaiseTicketModal({ isOpen, onClose, careerGoal, onTicketRaised }: RaiseTicketModalProps) {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call to create support ticket
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const ticketData = {
        type: 'Skill Request',
        goal_id: careerGoal.id,
        goal_name: careerGoal.name,
        student_id: 'current-student-id', // This would come from auth context
        additional_info: additionalInfo,
        status: 'open',
        created_at: new Date().toISOString(),
      };

      console.log('Support ticket created:', ticketData);

      setIsSubmitted(true);
      toast({
        title: "Support ticket created!",
        description: "We'll add the skills within 48 hours and notify you.",
      });

      // Auto-close after showing success
      setTimeout(() => {
        setIsSubmitted(false);
        setAdditionalInfo('');
        onTicketRaised();
        onClose();
      }, 2000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-accent-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ticket Created Successfully!</h3>
            <p className="text-muted-foreground">
              We'll add the skills for "{careerGoal.name}" within 48 hours and notify you when they're ready.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-primary" />
            <div>
              <DialogTitle>Request Skills Mapping</DialogTitle>
              <DialogDescription>
                We'll add the skills for "{careerGoal.name}" within 48 hours
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="additional-info">
              Additional Information (Optional)
            </Label>
            <Textarea
              id="additional-info"
              placeholder="Any specific skills or areas you'd like us to focus on?"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
            />
          </div>

          <div className="rounded-lg bg-primary-soft p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">48-Hour SLA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Our team will review "{careerGoal.name}" and add relevant skills within 48 hours. 
              You'll receive a notification when they're ready.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}