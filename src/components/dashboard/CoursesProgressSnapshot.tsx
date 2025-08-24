
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, CheckCircle } from 'lucide-react';

interface CoursesProgressSnapshotProps {
  data: {
    inProgress: number;
    completed: number;
  };
}

export function CoursesProgressSnapshot({ data }: CoursesProgressSnapshotProps) {
  const cardVariants = {
    hover: {
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Courses in Progress */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
      >
        <Card className="glass-card hover:shadow-elevated transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-indigo-700 mb-1">{data.inProgress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Completed Courses */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
      >
        <Card className="glass-card hover:shadow-elevated transition-all duration-300 cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700 mb-1">{data.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
