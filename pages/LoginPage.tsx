import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Logo from '../components/ui/Logo';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Checkbox } from '../components/ui/checkbox';
import { supabase } from '../lib/supabaseClient';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLogin = async (emailVal: string, passwordVal: string) => {
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: emailVal,
      password: passwordVal,
    });
    setIsLoading(false);

    if (error) {
      if (error.message === 'Invalid login credentials') {
        setError('Invalid email or password. Please try again.');
      } else {
        // For other errors, show a generic message and log the details.
        // This prevents leaking sensitive info like "Invalid API key".
        setError('An unexpected error occurred. Please try again.');
        console.error('Supabase Login Error:', error);
      }
    }
    // On successful login, the onAuthStateChange listener in AuthContext will handle the redirect.
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };
  
  const handleQuickLogin = () => {
    const demoEmail = 'admin@aesthetics360.com';
    const demoPassword = 'adminCoachTool25!';
    setEmail(demoEmail);
    setPassword(demoPassword);
    performLogin(demoEmail, demoPassword);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Left side with image and branding */}
      <div className="hidden lg:flex lg:w-3/5 bg-gray-900 p-12 flex-col justify-between relative overflow-hidden">
        <div 
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1677442135728-a3f24b211153?q=80&w=2574&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        
        <div className="relative z-10 text-white">
            <h1 className="text-4xl font-bold">Optimize your clinic's performance with Aesthetics360</h1>
            <p className="mt-4 text-white/70 max-w-xl">
                Aesthetics360 offers cutting-edge software tailored for plastic surgery clinics, streamlining patient management, appointment scheduling, and medical documentation—all in one place.
            </p>
        </div>
        <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="w-10 h-1 bg-white rounded-full"></span>
                <span className="w-10 h-1 bg-white/30 rounded-full"></span>
                <span className="w-10 h-1 bg-white/30 rounded-full"></span>
            </div>
            <div className="flex items-center gap-2">
                <button className="h-10 w-10 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                    <ChevronLeft className="h-5 w-5"/>
                </button>
                 <button className="h-10 w-10 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                    <ChevronRight className="h-5 w-5"/>
                </button>
            </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-2/5 flex flex-col justify-between items-center p-8 bg-card relative">
        <div className="absolute top-6 right-6 flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-full !px-3 !py-1.5 bg-secondary text-foreground">EN</Button>
            <Button variant="ghost" size="sm" className="rounded-full !px-3 !py-1.5 text-muted-foreground">ES</Button>
        </div>
        
        <div className="w-full max-w-sm mx-auto flex flex-col items-start justify-center flex-grow">
          <Logo className="h-10 w-auto mb-6" />
          <div className="mb-8 w-full">
            <h2 className="text-3xl font-bold text-foreground">Sign in</h2>
            <p className="text-muted-foreground mt-1">Please enter your credentials to log in</p>
          </div>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                      type="email" 
                      id="email" 
                      placeholder="your.email@company.com" 
                      className="pl-10 h-11" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password"  className="text-sm font-medium text-foreground">Password <span className="text-destructive">*</span></label>
                 <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                      type={showPassword ? 'text' : 'password'} 
                      id="password" 
                      placeholder="Enter your password" 
                      className="pl-10 pr-10 h-11" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            {error && (
                <div className="mt-4 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

             <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <Checkbox id="remember-me" />
                    <label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer select-none">Remember me</label>
                </div>
                <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
            </div>
            <Button type="submit" className="w-full mt-6 h-11" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Login'
              )}
            </Button>
          </form>
           <div className="text-center mt-4">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleQuickLogin();
                }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Quick login with demo credentials
              </a>
            </div>
        </div>
        <footer className="text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-4">
                <a href="#" className="hover:text-primary">Terms of Service</a>
                <a href="#" className="hover:text-primary">Privacy Policy</a>
                <a href="#" className="hover:text-primary">Cookies</a>
            </div>
            <p className="mt-2">© 2025 Aesthetics360, LLC. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;