export interface StudentCertification {
  name: string;
  issuingBody: string;
  dateAwarded: string; // ISO
}

export interface StudentSkillRoadmap {
  skillName: string;
  overallProgressPercent: number; // 0-100
  averageQuizScore: number; // 0-100
  capstoneProjectRequested?: boolean;
}

export interface StudentProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;

  preferredRole?: string;
  salaryExpectation?: number; // in major units
  availableFrom?: string; // ISO

  certifications?: StudentCertification[];

  totalWatchTimeHours?: number;
  streakDays?: number;
  engagementScore?: number; // 0-100

  skillRoadmaps: StudentSkillRoadmap[];
}

