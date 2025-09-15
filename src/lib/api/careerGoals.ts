// API functions for career goals management
export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Inactive";
}

// Mock API implementation - replace with actual API calls
export async function getCareerGoals(): Promise<CareerGoal[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data - in real implementation, this would be an API call
  return [
    {
      id: "1",
      title: "Full Stack Developer",
      description: "Master both frontend and backend development skills",
      status: "Active"
    },
    {
      id: "2", 
      title: "Data Scientist",
      description: "Develop expertise in data analysis and machine learning",
      status: "Active"
    },
    {
      id: "3",
      title: "DevOps Engineer", 
      description: "Learn infrastructure management and CI/CD practices",
      status: "Inactive"
    }
  ];
}

export async function updateCareerGoal(id: string, updates: Partial<Omit<CareerGoal, 'id'>>): Promise<CareerGoal> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock implementation - in real app, this would call PUT /api/career-goals/:id
  const goals = await getCareerGoals();
  const goal = goals.find(g => g.id === id);
  
  if (!goal) {
    throw new Error('Career goal not found');
  }
  
  return { ...goal, ...updates };
}