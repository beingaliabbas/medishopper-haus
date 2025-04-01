
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from '@/components/ui/use-toast';
import { Shield, Loader2, AlertTriangle } from 'lucide-react';
import { loginAdmin } from '@/api/auth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username || !password) {
      setError("Please enter both username and password.");
      toast({
        title: "Missing Fields",
        description: "Please enter both username and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = await loginAdmin(username, password);
      
      if (!token) {
        setError("Invalid username or password. Please try again.");
        toast({
          title: "Login Failed",
          description: "Invalid username or password.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      localStorage.setItem('admin-token', token);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard."
      });
      
      navigate('/admin/orders');
    } catch (error) {
      console.error('Login error:', error);
      setError("An error occurred during login. Please try again.");
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-medical-100 flex items-center justify-center">
              <Shield className="h-6 w-6 text-medical-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Login Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-medical-600 hover:bg-medical-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
