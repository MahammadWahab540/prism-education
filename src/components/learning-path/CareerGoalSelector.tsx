import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Target, TrendingUp, Users, Code, Palette, BarChart, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCareersSupabase } from '@/hooks/useCareersSupabase';

interface CareerGoalSelectorProps {
  onGoalSelect: (goal: any) => void;
}

const goalIcons = {
  'Software Development': Code,
  'Data Science': BarChart,
  'UI/UX Design': Palette,
  'Digital Marketing': TrendingUp,
  'Project Management': Users,
  'Cybersecurity': Shield,
};

export function CareerGoalSelector({ onGoalSelect }: CareerGoalSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user } = useAuth();
  const { categories, goals, isLoading, error } = useCareersSupabase();

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="glass-card">
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-28" />
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
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
              <p className="font-medium">Failed to load career goals</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tenantId = user?.tenantId;
  const tenantCategories = categories.filter(c => c.isGlobal || c.tenantId === tenantId);
  const tenantGoals = goals.filter(g => g.isGlobal || g.tenantId === tenantId);

  const goalsWithCategory = useMemo(() => tenantGoals.map(g => ({
    ...g,
    categoryName: tenantCategories.find(c => c.id === g.categoryId)?.name || 'Other',
  })), [tenantGoals, tenantCategories]);

  const filteredGoals = goalsWithCategory.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (goal.shortDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (goal.longDescription || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || goal.categoryName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl">Step 1: Choose Your Career Goal</CardTitle>
              <CardDescription>
                Select the career path that aligns with your aspirations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card className="glass-card">
        <CardContent className="pt-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search career goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {Array.from(new Set(tenantCategories.map(c => c.name))).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGoals.map((goal, index) => {
          const IconComponent = goalIcons[goal.name as keyof typeof goalIcons] || Target;
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card hover:shadow-elevated transition-all duration-300 cursor-pointer group h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent-luxury group-hover:scale-110 transition-transform">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {goal.name}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {goal.categoryName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {goal.shortDescription || goal.longDescription || '—'}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Duration</span>
                      <span className="font-medium">{goal.durationMinMonths}-{goal.durationMaxMonths} months</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty</span>
                      <Badge variant={
                        goal.difficulty === 'Beginner' ? 'secondary' :
                        goal.difficulty === 'Intermediate' ? 'default' : 
                        'destructive'
                      }>
                        {goal.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    variant="outline"
                    onClick={() => onGoalSelect(goal)}
                  >
                    Select This Goal
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredGoals.length === 0 && (
        <Card className="glass-card">
          <CardContent className="pt-8 pb-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No career goals found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or category filters
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);  
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
