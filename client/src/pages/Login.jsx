// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from "sonner";
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);
//   const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      console.log(user);
      toast.success("Logged in Successfully");

      
      if (user.role === 'master') {
        navigate('/master');
      } else {
        navigate('/company');
      }
    } catch (error) {
      toast(
        <div>
          <div className="font-semibold text-red-600">Error</div>
          <div className="text-sm text-gray-700">
            {error.response?.data?.message || "Invalid credentials"}
          </div>
        </div>
      );      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Chatbot Platform</h1>
          <p className="text-gray-600 mt-2">Multi-tenant chatbot management</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@chatbot.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="mt-6 text-center">
  <p className="text-gray-600">
    Don't have an account?{' '}
    <Link to="/register" className="text-blue-600 font-semibold hover:underline">
      Sign up for free
    </Link>
  </p>
</div>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><strong>Master Admin:</strong> admin@chatbot.com / admin123</p>
                <p><strong>Company Admin:</strong> demo@company.com / demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}