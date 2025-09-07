import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { StudentProfileData } from '@/types/student';
import { Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, Award, AlertTriangle } from 'lucide-react';

interface StudentProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentData: StudentProfileData | null;
}

type ProfLevel = 'Expert' | 'Proficient' | 'Competent' | 'Beginner' | 'Novice';

export function getProficiencyLevel(
  progress: number,
  avgScore: number,
  capstoneRequested?: boolean
): { level: ProfLevel; colorClass: string } {
  if ((progress > 80 && avgScore >= 90) || capstoneRequested)
    return { level: 'Expert', colorClass: 'bg-green-500' };
  if (progress >= 61 && progress <= 80 && avgScore >= 80)
    return { level: 'Proficient', colorClass: 'bg-blue-500' };
  if (progress >= 41 && progress <= 60 && avgScore >= 70)
    return { level: 'Competent', colorClass: 'bg-sky-500' };
  if (progress >= 21 && progress <= 40)
    return { level: 'Beginner', colorClass: 'bg-yellow-500' };
  if (progress >= 1 && progress <= 20)
    return { level: 'Novice', colorClass: 'bg-gray-500' };
  return { level: 'Novice', colorClass: 'bg-gray-500' };
}

const nf = new Intl.NumberFormat();
const currency = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function StudentProfileModal({ open, onOpenChange, studentData }: StudentProfileModalProps) {
  if (!studentData) return null;
  const {
    name,
    email,
    phone,
    location,
    avatarUrl,
    preferredRole,
    salaryExpectation,
    availableFrom,
    certifications = [],
    totalWatchTimeHours = 0,
    streakDays = 0,
    engagementScore = 0,
    skillRoadmaps = [],
  } = studentData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="space-y-4 lg:col-span-1">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={avatarUrl} alt={name} />
                      <AvatarFallback>{name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{name}</div>
                      <div className="text-sm text-muted-foreground">{email}</div>
                    </div>
                  </div>
                  {email && (
                    <div className="text-sm flex items-center gap-2"><Mail className="w-4 h-4" /> {email}</div>
                  )}
                  {phone && (
                    <div className="text-sm flex items-center gap-2"><Phone className="w-4 h-4" /> {phone}</div>
                  )}
                  {location && (
                    <div className="text-sm flex items-center gap-2"><MapPin className="w-4 h-4" /> {location}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Career Preferences</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {preferredRole && (
                    <div className="text-sm flex items-center gap-2"><Briefcase className="w-4 h-4" /> {preferredRole}</div>
                  )}
                  {typeof salaryExpectation === 'number' && (
                    <div className="text-sm flex items-center gap-2"><DollarSign className="w-4 h-4" /> {currency.format(salaryExpectation)}</div>
                  )}
                  {availableFrom && (
                    <div className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(availableFrom).toLocaleDateString()}</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">External Certifications</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {certifications.length === 0 && (
                    <div className="text-sm text-muted-foreground">No certifications listed.</div>
                  )}
                  {certifications.map((c, i) => (
                    <div key={i} className="text-sm flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.issuingBody} · {new Date(c.dateAwarded).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4 lg:col-span-2">
              {/* Engagement & Activity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">Total Watch Time</div>
                    <div className="text-xl font-bold">{nf.format(Math.round(totalWatchTimeHours))}h</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">Current Learning Streak</div>
                    <div className="text-xl font-bold">{nf.format(streakDays)} days</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <div className="text-xs text-muted-foreground">Engagement Score</div>
                    <div className="text-xl font-bold">{Math.round(engagementScore)}%</div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills Proficiency */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Skills Proficiency</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skillRoadmaps.length === 0 && (
                    <div className="text-sm text-muted-foreground">No skills tracked yet.</div>
                  )}
                  {skillRoadmaps.map((s, idx) => {
                    const { level, colorClass } = getProficiencyLevel(
                      s.overallProgressPercent,
                      s.averageQuizScore,
                      s.capstoneProjectRequested
                    );
                    const atRisk = s.averageQuizScore < 60 && s.overallProgressPercent > 40;
                    return (
                      <Card key={idx} className="border bg-background/50">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-primary" />
                              <div className="font-medium text-sm">{s.skillName}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className={`${colorClass} text-white`}>{level}</Badge>
                              {atRisk && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Average quiz score below 60% with higher progress — might need support.
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{Math.round(s.overallProgressPercent)}%</span>
                          </div>
                          <Progress value={s.overallProgressPercent} />
                          <div className="text-xs text-muted-foreground">Avg quiz score: {Math.round(s.averageQuizScore)}%</div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default StudentProfileModal;

