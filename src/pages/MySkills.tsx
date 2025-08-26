
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { InfoCard } from '@/components/ui/info-card';

const MySkills = () => {
  const skills = [
    {
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop",
      title: "JavaScript & TypeScript",
      description: "Advanced proficiency in modern JavaScript ES6+ features, TypeScript for type-safe development, and asynchronous programming patterns."
    },
    {
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1920&auto=format&fit=crop",
      title: "React & Next.js",
      description: "Expert in React ecosystem including hooks, context, state management, and Next.js for full-stack web applications with SSR/SSG."
    },
    {
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop",
      title: "Node.js & Backend",
      description: "Proficient in server-side development with Node.js, Express.js, API design, database integration, and microservices architecture."
    },
    {
      image: "https://images.unsplash.com/photo-1544737151-6e4b9d5d8c91?q=80&w=1920&auto=format&fit=crop",
      title: "Database Management",
      description: "Experience with SQL and NoSQL databases including PostgreSQL, MongoDB, Redis, and ORM/ODM tools like Prisma and Mongoose."
    },
    {
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1920&auto=format&fit=crop",
      title: "Cloud & DevOps",
      description: "AWS/Azure cloud services, Docker containerization, CI/CD pipelines, and infrastructure as code with Terraform."
    },
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop",
      title: "Data Analysis",
      description: "Statistical analysis, data visualization with D3.js/Chart.js, Python for data science, and machine learning fundamentals."
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Skills</h1>
            <p className="text-muted-foreground mt-2">
              Explore your technical expertise and professional capabilities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
          {skills.map((skill, index) => (
            <InfoCard
              key={index}
              image={skill.image}
              title={skill.title}
              description={skill.description}
              borderColor={`hsl(var(--color-${(index % 5) + 1}))`}
              borderBgColor="hsl(var(--muted))"
              cardBgColor="hsl(var(--card))"
              shadowColor="hsl(var(--border))"
              textColor="hsl(var(--foreground))"
              hoverTextColor="hsl(var(--card-foreground))"
              fontFamily="var(--font-inter)"
              rtlFontFamily="var(--font-inter)"
              effectBgColor={`hsl(var(--color-${(index % 5) + 1}))`}
              patternColor1="hsla(var(--muted-foreground) / 0.1)"
              patternColor2="hsla(var(--muted-foreground) / 0.15)"
              contentPadding="14.3px 16px"
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MySkills;
