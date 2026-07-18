import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../store/authContext';
import { Button, Input, Select } from '../../components/ui';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !mobile || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, mobile, password, role);
      toast.success('Account created! Welcome to Rentalisting.');
      if (role === 'admin') navigate('/admin');
      else if (role === 'visitor') navigate('/');
      else navigate('/owner');
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((e: any) => {
          toast.error(e.message);
        });
      } else {
        toast.error(errorData?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16">
      <div className="w-full max-w-sm mx-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-primary">Create your account</h1>
            <p className="text-neutral-700 mt-1.5">Join as a property owner</p>
          </div>

          <div className="card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <Input
                label="Mobile number"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+1 234 567 890"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
              <Select
                label="Register as"
                options={[
                  { value: 'visitor', label: 'Tenant / Visitor (Browse)' },
                  { value: 'owner', label: 'Property Owner (List & Manage)' },
                  { value: 'admin', label: 'Platform Admin' },
                ]}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <Button type="submit" loading={loading} className="w-full">
                Create account
              </Button>
            </form>

            <p className="text-center text-sm text-neutral-700 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
