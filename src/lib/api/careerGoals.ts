// API functions for career goals management
export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  status: "Active" | "Inactive";
}

// Mock data store - in real implementation, this would be handled by the backend
let mockCareerGoals: CareerGoal[] = [
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

// Mock API implementation - replace with actual API calls
export async function getCareerGoals(): Promise<CareerGoal[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [...mockCareerGoals];
}

export async function updateCareerGoal(id: string, updates: Partial<Omit<CareerGoal, 'id'>>): Promise<CareerGoal> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockCareerGoals.findIndex(goal => goal.id === id);
  if (index === -1) {
    throw new Error('Career goal not found');
  }
  
  const updatedGoal = { ...mockCareerGoals[index], ...updates };
  mockCareerGoals[index] = updatedGoal;
  
  return updatedGoal;
}

export async function createCareerGoal(goalData: Omit<CareerGoal, 'id'>): Promise<CareerGoal> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newGoal: CareerGoal = {
    id: `goal-${Date.now()}`,
    ...goalData
  };
  
  mockCareerGoals.push(newGoal);
  return newGoal;
}