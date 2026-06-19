import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'citizen'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Create Account</h1>
        <p className="text-text-muted">Start monitoring your digital footprint today.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-text" htmlFor="firstName">
                First Name
                </label>
                <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="input-field"
                required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-text" htmlFor="lastName">
                Last Name
                </label>
                <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="input-field"
                required
                />
            </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text" htmlFor="role">
            I am a...
          </label>
          <select 
            id="role" 
            value={formData.role} 
            onChange={handleChange} 
            className="input-field appearance-none"
          >
            <option value="citizen">Citizen</option>
            <option value="legal">Legal Professional</option>
            <option value="government">Government Official</option>
          </select>
        </div>

        <div className="flex items-start gap-2">
          <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" required />
          <label htmlFor="terms" className="text-sm text-text-muted leading-snug">
            I agree to the <a href="#" className="font-semibold text-text hover:text-primary transition-colors">Terms of Service</a> and <a href="#" className="font-semibold text-text hover:text-primary transition-colors">Privacy Policy</a>.
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
        </button>
      </form>

      <p className="mt-10 text-center text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary hover:text-primary-hover transition-colors">
          Sign in
        </Link>
      </p>

      <div className="mt-12 p-4 bg-secondary rounded-xl flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-text">Your data is secure</p>
          <p className="text-xs text-text-muted">We use AES-256 encryption to protect your monitored assets.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
