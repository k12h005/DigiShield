import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Welcome Back</h1>
        <p className="text-text-muted">Sign in to your account to manage your alerts.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text" htmlFor="password">
              Password
            </label>
            <a href="#" className="text-sm font-semibold text-primary hover:text-primary-hover">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <label htmlFor="remember" className="text-sm text-text-muted">Remember me for 30 days</label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
        </button>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-text-muted uppercase tracking-wider font-medium">Or continue with</span>
            </div>
        </div>

        <button type="button" className="w-full bg-white border border-gray-200 text-text font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Sign in with Google
        </button>
      </form>

      <p className="mt-10 text-center text-text-muted">
        Don't have an account?{' '}
        <Link to="/signup" className="font-bold text-primary hover:text-primary-hover transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
