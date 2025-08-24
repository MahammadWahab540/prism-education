
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2, GraduationCap, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Invalid credentials. Try: owner@platform.com, admin@tenant.com, or student@example.com');
    }
  };

  const demoAccounts = [
    { email: 'owner@platform.com', role: 'Platform Owner', desc: 'Full system access' },
    { email: 'admin@tenant.com', role: 'Tenant Admin', desc: 'Manage courses & students' },
    { email: 'student@example.com', role: 'Student', desc: 'Access learning content' }
  ];

  return (
    <div className="min-h-screen bg-gradient-pearl flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-glass rounded-2xl mb-6 shadow-glass">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gradient-luxury mb-4">EduPlatform</h1>
          <p className="text-muted-foreground text-lg">Premium Learning Management System</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Login Form */}
          <Card className="glass-card p-8 animate-fade-up" style={{animationDelay: '0.2s'}}>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to your premium learning experience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-white/50 backdrop-blur-sm border-white/20"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-white/50 backdrop-blur-sm border-white/20"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-primary to-accent-luxury hover:opacity-90 transition-opacity shadow-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Demo password: <code className="bg-muted px-2 py-1 rounded text-xs">password</code>
              </p>
            </div>
          </Card>

          {/* Demo Accounts */}
          <div className="space-y-4 animate-fade-up" style={{animationDelay: '0.4s'}}>
            <h3 className="text-xl font-semibold mb-4">Demo Accounts</h3>
            {demoAccounts.map((account, index) => (
              <Card 
                key={account.email}
                className="glass-card p-6 cursor-pointer hover:shadow-elevated transition-all duration-300 group"
                onClick={() => {
                  setEmail(account.email);
                  setPassword('password');
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent-luxury/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{account.role}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{account.desc}</p>
                    <p className="text-xs text-primary font-mono">{account.email}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
