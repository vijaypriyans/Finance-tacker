import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const LoginForm = () => {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('login');

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    school: '',
    phone: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Check MongoDB connection status on mount
  useEffect(() => {
    const checkMongoDBStatus = async () => {
      try {
        const response = await axios.get('https://finance-tacker-backend-ybhm.onrender.com/api/health');
        if (response.data.status === 'error') {
          toast({
            title: 'Database Error',
            description: response.data.message || 'MongoDB is not connected.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Database Error',
          description: 'Server is not connect to database. Please try again later.',
          variant: 'destructive',
        });
      }
    };

    checkMongoDBStatus();
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(loginData.email, loginData.password);
      toast({
        title: 'Welcome back!',
        description: "You've successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Unable to connect to the server. Please try again later.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (registerData.password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setLoading(true);

    try {
      await register(registerData.name, registerData.email, registerData.password);
      toast({
        title: 'Account created!',
        description: 'Welcome to your personal finance dashboard.',
      });
      setLoginData({ email: registerData.email, password: registerData.password });
      setTab('login');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Unable to connect to the server. Please try again later.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 mb-2">
            FinanceTracker Pro
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your intelligent personal finance companion
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData((prev) => ({ ...prev, password: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={registerData.name}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="School Name"
                      value={registerData.school}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, school: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Phone"
                      value={registerData.phone}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData((prev) => ({ ...prev, password: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                    {passwordError && (
                      <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
