import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Target, TrendingUp, Users, Code, Palette, BarChart, Shield } from 'lucide-react';
import { mockCareerGoals } from '@/lib/mockData';

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

  const filteredGoals = mockCareerGoals.filter(goal => {
    const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || goal.category === selectedCategory;
    return matchesSearch && matchesCategory && goal.is_active;
  });

  const categories = [...new Set(mockCareerGoals.map(goal => goal.category))];

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
            {categories.map((category) => (
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
                          {goal.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {goal.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Duration</span>
                      <span className="font-medium">{goal.estimated_duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty</span>
                      <Badge variant={
                        goal.difficulty_level === 'Beginner' ? 'secondary' :
                        goal.difficulty_level === 'Intermediate' ? 'default' : 
                        'destructive'
                      }>
                        {goal.difficulty_level}
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