
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/ui/minimal-card";
import { Button } from '@/components/ui/button';
import { ArrowRight, Map } from 'lucide-react';

const MySkills = () => {
  const navigate = useNavigate();

  const skills = [
    {
      id: 'javascript-typescript',
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop",
      title: "JavaScript & TypeScript",
      description: "Advanced proficiency in modern JavaScript ES6+ features, TypeScript for type-safe development, and asynchronous programming patterns.",
      icon: "⚛️"
    },
    {
      id: 'react-nextjs',
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1920&auto=format&fit=crop",
      title: "React & Next.js",
      description: "Expert in React ecosystem including hooks, context, state management, and Next.js for full-stack web applications with SSR/SSG.",
      icon: "🔷"
    },
    {
      id: 'nodejs-backend',
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop",
      title: "Node.js & Backend",
      description: "Proficient in server-side development with Node.js, Express.js, API design, database integration, and microservices architecture.",
      icon: "⚙️"
    },
    {
      id: 'database-management',
      image: "https://images.unsplash.com/photo-1544737151-6e4b9d5d8c91?q=80&w=1920&auto=format&fit=crop",
      title: "Database Management",
      description: "Experience with SQL and NoSQL databases including PostgreSQL, MongoDB, Redis, and ORM/ODM tools like Prisma and Mongoose.",
      icon: "🗄️"
    },
    {
      id: 'cloud-devops',
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1920&auto=format&fit=crop",
      title: "Cloud & DevOps",
      description: "AWS/Azure cloud services, Docker containerization, CI/CD pipelines, and infrastructure as code with Terraform.",
      icon: "☁️"
    },
    {
      id: 'data-analysis',
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop",
      title: "Data Analysis",
      description: "Statistical analysis, data visualization with D3.js/Chart.js, Python for data science, and machine learning fundamentals.",
      icon: "📊"
    }
  ];

  const handleViewRoadmap = (skillId: string) => {
    navigate(`/roadmap/${skillId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Skills</h1>
            <p className="text-muted-foreground mt-2">
              Explore your technical expertise and follow structured learning paths
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <MinimalCard key={index} className="group">
              <div className="relative">
                <MinimalCardImage 
                  src={skill.image} 
                  alt={skill.title}
                />
                <div className="absolute top-2 right-2 text-2xl bg-card/80 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm">
                  {skill.icon}
                </div>
              </div>
              
              <MinimalCardTitle className="group-hover:text-primary transition-colors">
                {skill.title}
              </MinimalCardTitle>
              
              <MinimalCardDescription className="mb-4">
                {skill.description}
              </MinimalCardDescription>
              
              <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Skill Level
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < 4 ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleViewRoadmap(skill.id)}
                  className="w-full bg-gradient-to-r from-primary to-accent-luxury hover:from-primary/90 hover:to-accent-luxury/90 text-white"
                >
                  <Map className="h-4 w-4 mr-2" />
                  View Roadmap
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </MinimalCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MySkills;
