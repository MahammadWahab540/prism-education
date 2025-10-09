import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { RaiseTicketModal } from './RaiseTicketModal';
import { Search, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { useSupabaseSkills } from '@/hooks/useSupabaseSkills';
import { useLearningPath } from '@/contexts/LearningPathSupabase';

interface SkillsSelectorProps {
  careerGoal: any;
  onSkillsSelect: (skills: any[]) => void;
  selectedSkills: any[];
}

export function SkillsSelector({ careerGoal, onSkillsSelect, selectedSkills }: SkillsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const { markOnboardingComplete } = useLearningPath();
  const { skills, loading, error } = useSupabaseSkills();

  // Filter skills based on career goal's linked skills if available
  const availableSkills = skills.filter(skill => {
    // If goal has linkedSkillIds, only show those skills
    if (careerGoal?.linkedSkillIds?.length > 0) {
      return careerGoal.linkedSkillIds.includes(skill.id);
    }
    // Otherwise show all active skills
    return skill.isActive;
  });

  // Show loading state while skills are being fetched
  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-80" />
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-5 w-3/4" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
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

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="glass-card border-destructive">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <p className="font-medium">Failed to load skills</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredSkills = availableSkills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (skill.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSkillToggle = (skill: any) => {
    const isSelected = selectedSkills.some(s => s.id === skill.id);
    let newSelectedSkills;
    
    if (isSelected) {
      newSelectedSkills = selectedSkills.filter(s => s.id !== skill.id);
    } else {
      newSelectedSkills = [...selectedSkills, skill];
    }
    
    onSkillsSelect(newSelectedSkills);
  };

  const handleContinue = () => {
    if (selectedSkills.length === 0) {
      setShowTicketModal(true);
    } else {
      onSkillsSelect(selectedSkills);
    }
  };

  const handleTicketRaised = () => {
    setShowTicketModal(false);
    // Allow continuation with 0 skills after ticket is raised - mark as complete
    markOnboardingComplete();
    onSkillsSelect([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Step 2: Select Skills to Master</CardTitle>
              <CardDescription>
                Choose the skills that will help you achieve your career goal: {careerGoal.name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {availableSkills.length > 0 ? (
        <>
          {/* Search */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill, index) => {
              const isSelected = selectedSkills.some(s => s.id === skill.id);
              
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`glass-card hover:shadow-elevated transition-all duration-300 cursor-pointer group h-full ${
                      isSelected ? 'ring-2 ring-primary bg-primary-soft' : ''
                    }`}
                    onClick={() => handleSkillToggle(skill)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <Checkbox 
                            checked={isSelected}
                            onChange={() => handleSkillToggle(skill)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-base group-hover:text-primary transition-colors">
                              {skill.name}
                            </CardTitle>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {skill.category}
                              </Badge>
                              <Badge 
                                variant={
                                  skill.difficulty === 'Beginner' ? 'secondary' :
                                  skill.difficulty === 'Intermediate' ? 'default' : 
                                  'destructive'
                                }
                                className="text-xs"
                              >
                                {skill.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {skill.description}
                      </p>
                      
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Est. Duration</span>
                        <span className="font-medium">{skill.estimatedHours}h</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Selected Skills Summary */}
          {selectedSkills.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Selected Skills ({selectedSkills.length})</CardTitle>
                <CardDescription>
                  You can continue with these skills or add more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSkills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="px-3 py-1">
                      {skill.name}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSkillToggle(skill);
                        }}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Button onClick={handleContinue} className="w-full">
                  Continue with Selected Skills
                </Button>
              </CardContent>
            </Card>
          )}

          {/* No skills found */}
          {filteredSkills.length === 0 && searchTerm && (
            <Card className="glass-card">
              <CardContent className="pt-8 pb-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No skills found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        // No skills available for this career goal
        <Card className="glass-card">
          <CardContent className="pt-8 pb-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Skills Available Yet</h3>
            <p className="text-muted-foreground mb-6">
              We haven't mapped skills for this career goal yet. Don't worry - we can help!
            </p>
            <Button onClick={() => setShowTicketModal(true)} className="px-8">
              Request Skills Mapping
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              We'll add the skills within 48 hours
            </p>
          </CardContent>
        </Card>
      )}

      {/* Continue button for when no skills selected */}
      {availableSkills.length > 0 && selectedSkills.length === 0 && (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">No skills selected</p>
                <p className="text-sm text-muted-foreground">
                  You can continue without selecting skills or raise a ticket for new skills
                </p>
              </div>
              <Button onClick={handleContinue} variant="outline">
                Continue Anyway
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <RaiseTicketModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        careerGoal={careerGoal}
        onTicketRaised={handleTicketRaised}
      />
    </div>
  );
}
