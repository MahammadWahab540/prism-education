import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { InteractiveTiltCard } from '@/components/ui/tilt-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Target,
  Edit,
  Settings
} from 'lucide-react';

// Default profile data (used if nothing in storage)
const defaultProfile = {
  id: 1,
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  joinDate: 'January 2024',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  bio: 'Passionate UI/UX Designer & Developer with a love for creating intuitive and beautiful digital experiences. Always learning and growing in the tech space.',
  role: 'UI/UX Designer & Developer',
  skills: [
    { name: 'React Development', level: 85, category: 'Frontend' },
    { name: 'UI/UX Design', level: 92, category: 'Design' },
    { name: 'TypeScript', level: 78, category: 'Programming' },
    { name: 'Figma', level: 95, category: 'Design Tools' }
  ],
  achievements: [
    { name: 'Fast Learner', description: 'Completed 5+ courses this month', icon: '🏃' },
    { name: 'Streak Master', description: '54-day learning streak', icon: '🔥' },
    { name: 'Top Performer', description: 'Ranked #3 in leaderboard', icon: '🏆' },
    { name: 'Quiz Champion', description: '100% accuracy on recent quizzes', icon: '🧠' }
  ],
  stats: {
    coursesCompleted: 17,
    coursesInProgress: 3,
    totalHours: 142,
    certificates: 0
  },
  certificates: [] as { title: string; url: string }[]
};

export function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const storageKey = useMemo(() => `profile-details-${user?.id ?? 'guest'}`, [user?.id]);

  const [profile, setProfile] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [aboutDraft, setAboutDraft] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [phoneDraft, setPhoneDraft] = useState('');
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certUrl, setCertUrl] = useState('');

  // Load from storage or seed from auth context
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        setProfile(saved);
        return;
      }
    } catch {}

    // Seed with auth user if available
    setProfile(p => ({
      ...p,
      name: user?.name ?? p.name,
      email: user?.email ?? p.email,
      id: Number(user?.id ?? p.id),
    }));
  }, [storageKey, user?.name, user?.email, user?.id]);

  const startEditing = () => {
    setAboutDraft(profile.bio);
    setEmailDraft(profile.email);
    setPhoneDraft(profile.phone);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveProfile = () => {
    const updated = { ...profile, bio: aboutDraft, email: emailDraft, phone: phoneDraft };
    setProfile(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
    setIsEditing(false);
    toast({ title: 'Profile updated', description: 'Your changes were saved.' });
  };

  const addCertificate = () => {
    if (!certTitle.trim() || !certUrl.trim()) return;
    try {
      const u = new URL(certUrl);
      if (!u.protocol.startsWith('http')) throw new Error('Invalid URL');
    } catch {
      toast({ title: 'Invalid URL', description: 'Enter a valid link beginning with http(s).' });
      return;
    }
    const updated = {
      ...profile,
      certificates: [...(profile.certificates ?? []), { title: certTitle.trim(), url: certUrl.trim() }],
      stats: { ...profile.stats, certificates: (profile.stats?.certificates ?? 0) + 1 }
    };
    setProfile(updated);
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch {}
    setCertDialogOpen(false);
    setCertTitle('');
    setCertUrl('');
    toast({ title: 'Certificate added', description: 'Your external certificate was saved.' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <motion.div
        className="max-w-6xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header with Tilt Card */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <div className="relative h-48 md:h-64">
              <InteractiveTiltCard
                image={{
                  src: profile.coverImage,
                  alt: 'Profile cover image'
                }}
                tiltFactor={8}
                hoverScale={1.02}
                shadowIntensity={0.3}
                glareIntensity={0.2}
                borderRadius={0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Profile Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-end gap-6">
                  <Avatar size="2xl" className="border-4 border-white shadow-lg" tooltip={`${profile.name} - ${profile.role}`}>
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                    <p className="text-white/90 text-lg mb-3">{profile.role}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <MapPin className="w-3 h-3 mr-1" />
                        {profile.location}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        <Calendar className="w-3 h-3 mr-1" />
                        Joined {profile.joinDate}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={startEditing}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => navigate('/account/settings')}>
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isEditing ? (
                    <>
                      <p className="text-muted-foreground leading-relaxed mb-6">{profile.bio}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="about">About</Label>
                        <Textarea id="about" value={aboutDraft} onChange={(e) => setAboutDraft(e.target.value)} rows={4} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={emailDraft} onChange={(e) => setEmailDraft(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" value={phoneDraft} onChange={(e) => setPhoneDraft(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={saveProfile}>Save Changes</Button>
                        <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills Section */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Skills & Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements Section */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Certificates Section */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.certificates?.length ? (
                    <div className="space-y-3">
                      {profile.certificates.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <div className="font-medium">{c.title}</div>
                            <a href={c.url} target="_blank" rel="noreferrer" className="text-sm text-primary underline break-all">{c.url}</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No external certificates added yet.</p>
                  )}
                  <Button variant="outline" onClick={() => setCertDialogOpen(true)}>
                    <Award className="w-4 h-4 mr-2" />
                    Add External Certificates
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Learning Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {profile.stats.coursesCompleted}
                    </div>
                    <div className="text-sm text-muted-foreground">Courses Completed</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-1">
                      {profile.stats.coursesInProgress}
                    </div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-1">
                      {profile.stats.totalHours}
                    </div>
                    <div className="text-sm text-muted-foreground">Hours Learned</div>
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-muted-foreground mb-1">
                      {profile.stats.certificates}
                    </div>
                    <div className="text-sm text-muted-foreground">Certificates</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="ghost" onClick={startEditing}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button className="w-full justify-start" variant="ghost" onClick={() => navigate('/account/settings')}>
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button className="w-full justify-start" variant="ghost" onClick={() => setCertDialogOpen(true)}>
                    <Award className="w-4 h-4 mr-2" />
                    Add External Certificates
                  </Button>
                  <Button className="w-full justify-start" variant="ghost" onClick={() => navigate('/profile/learning-history')}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learning History
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Add Certificate Dialog */}
        <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add External Certificate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cert-title">Title</Label>
                <Input id="cert-title" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} placeholder="e.g., AWS Certified Cloud Practitioner" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-url">Link (URL)</Label>
                <Input id="cert-url" value={certUrl} onChange={(e) => setCertUrl(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCertDialogOpen(false)}>Cancel</Button>
              <Button onClick={addCertificate}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
