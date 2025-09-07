import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCapstones } from '@/hooks/useCapstones';
import { CapstoneDetail } from '@/components/capstone/CapstoneDetail';

const CapstonePage = () => {
  const { capstoneId } = useParams();
  const navigate = useNavigate();
  const { state } = useCapstones();
  const capstone = useMemo(() => state.configs.find(c => c.id === capstoneId), [state.configs, capstoneId]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
          <h1 className="text-2xl font-bold">Capstone</h1>
        </div>
        {!capstone ? (
          <div className="text-sm text-muted-foreground">Capstone not found.</div>
        ) : (
          <CapstoneDetail capstone={capstone} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CapstonePage;

