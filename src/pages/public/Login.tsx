import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../store/authContext';
import { Button, Input } from '../../components/ui';
import toast from 'react-hot-toast';

function AuthVectorGraphics() {
  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center justify-center p-4">
      {/* Background Ambient Glows */}
      <div className="absolute top-4 -left-4 w-60 h-60 bg-secondary/15 rounded-full filter blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute -bottom-4 -right-4 w-60 h-60 bg-accent/20 rounded-full filter blur-3xl opacity-70 pointer-events-none" />

      {/* Main SVG Vector Graphic */}
      <svg className="w-full h-auto max-h-[300px] drop-shadow-xl" viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="loginBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F4C81" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#005EB8" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="loginBuildingGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#005EB8" />
            <stop offset="100%" stopColor="#0F4C81" />
          </linearGradient>
          <linearGradient id="loginBuildingGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0F4C81" />
            <stop offset="100%" stopColor="#0a355c" />
          </linearGradient>
          <linearGradient id="loginAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F58220" />
            <stop offset="100%" stopColor="#ffa045" />
          </linearGradient>
        </defs>

        {/* Outer Circular Grid Boundary */}
        <circle cx="250" cy="190" r="160" fill="url(#loginBgGrad)" stroke="#0F4C81" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="6 6" />

        {/* Abstract Floating Dots */}
        <circle cx="100" cy="90" r="14" fill="#F58220" fillOpacity="0.25" />
        <circle cx="400" cy="280" r="20" fill="#005EB8" fillOpacity="0.15" />

        {/* Ground Base Shadow */}
        <ellipse cx="250" cy="310" rx="150" ry="20" fill="#0F4C81" fillOpacity="0.08" />

        {/* Building 1 (Left Tower) */}
        <rect x="150" y="130" width="68" height="175" rx="8" fill="url(#loginBuildingGrad2)" />
        <rect x="165" y="150" width="15" height="15" rx="3" fill="#ffffff" fillOpacity="0.85" />
        <rect x="188" y="150" width="15" height="15" rx="3" fill="#ffffff" fillOpacity="0.85" />
        <rect x="165" y="178" width="15" height="15" rx="3" fill="#ffffff" fillOpacity="0.85" />
        <rect x="188" y="178" width="15" height="15" rx="3" fill="#F58220" />
        <rect x="165" y="206" width="15" height="15" rx="3" fill="#ffffff" fillOpacity="0.85" />
        <rect x="188" y="206" width="15" height="15" rx="3" fill="#ffffff" fillOpacity="0.85" />
        <rect x="165" y="234" width="15" height="15" rx="3" fill="#ffffff" fillOpacity="0.85" />
        <rect x="188" y="234" width="15" height="15" rx="3" fill="#ffffff" fillOpacity="0.85" />

        {/* Central Modern Villa/House Structure */}
        <path d="M220 170 L280 115 L340 170 V305 H220 Z" fill="url(#loginBuildingGrad1)" />
        <path d="M210 175 L280 110 L350 175" stroke="url(#loginAccentGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />

        {/* House Windows & Door */}
        <rect x="240" y="185" width="28" height="28" rx="4" fill="#ffffff" />
        <rect x="292" y="185" width="28" height="28" rx="4" fill="#ffffff" />
        <path d="M265 305 V250 H295 V305 Z" fill="#0F4C81" />
        <circle cx="271" cy="280" r="2.5" fill="#F58220" />

        {/* Floating Security Badge */}
        <g transform="translate(100, 180)">
          <rect x="0" y="0" width="110" height="38" rx="19" fill="#ffffff" filter="drop-shadow(0px 8px 16px rgba(15,76,129,0.15))" />
          <circle cx="19" cy="19" r="11" fill="#0F4C81" />
          <path d="M14 19 L18 23 L25 15" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="36" y="23" fill="#0F4C81" fontSize="11" fontWeight="700" fontFamily="Space Grotesk, sans-serif">Secure Auth</text>
        </g>

        {/* Floating Location Pin Vector */}
        <g transform="translate(330, 85)">
          <circle cx="30" cy="30" r="28" fill="#ffffff" filter="drop-shadow(0px 8px 20px rgba(15,76,129,0.18))" />
          <path d="M30 16 C23.37 16 18 21.37 18 28 C18 36.5 30 45 30 45 C30 45 42 36.5 42 28 C42 21.37 36.63 16 30 16 Z" fill="url(#loginAccentGrad)" />
          <circle cx="30" cy="27" r="4.5" fill="#ffffff" />
        </g>

        {/* Floating Key Graphic Badge */}
        <g transform="translate(285, 255)">
          <rect x="0" y="0" width="115" height="42" rx="12" fill="#0F4C81" filter="drop-shadow(0px 10px 20px rgba(0,0,0,0.2))" />
          <path d="M20 21 A 5 5 0 1 0 20 21.01 M20 16 A 5 5 0 1 1 20 26 A 5 5 0 0 1 20 16 Z" fill="none" stroke="#F58220" strokeWidth="2.5" />
          <path d="M25 21 H36 M32 21 V24 M35 21 V24" stroke="#F58220" strokeWidth="2.5" strokeLinecap="round" />
          <text x="44" y="25" fill="#ffffff" fontSize="11" fontWeight="600" fontFamily="Manrope, sans-serif">Quick Access</text>
        </g>
      </svg>

      {/* Feature Badges below graphic */}
      <div className="mt-6 grid grid-cols-3 gap-2.5 w-full">
        <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-[11px] font-bold text-primary">Protected</p>
          <p className="text-[9px] text-neutral-700/70">Encrypted portal</p>
        </div>

        <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-[11px] font-bold text-neutral-900">Dashboard</p>
          <p className="text-[9px] text-neutral-700/70">Manage listings</p>
        </div>

        <div className="flex flex-col items-center text-center p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-[11px] font-bold text-neutral-900">Enquiries</p>
          <p className="text-[9px] text-neutral-700/70">Direct messaging</p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'owner') navigate('/owner');
      else navigate('/');
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((e: any) => {
          toast.error(e.message);
        });
      } else {
        toast.error(errorData?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 hero-sheen">
      <div className="container-custom max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left Side: Branding & Vector Illustration */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            <span className="mono text-[11px] uppercase tracking-[.14em] text-primary font-semibold px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              Welcome Back
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight">
              Manage your rentals & enquiries.
            </h1>
            <p className="text-neutral-700 max-w-lg leading-relaxed text-sm md:text-base">
              Log in to your BookMySpace account to view your listed properties, respond to tenant enquiries, or manage platform settings.
            </p>

            <div className="w-full pt-2">
              <AuthVectorGraphics />
            </div>
          </div>

          {/* Right Side: Login Form Card */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

              <div className="text-center mb-6">
                <h2 className="font-display text-2xl font-bold text-primary">Log in to BookMySpace</h2>
                <p className="text-neutral-700 text-xs mt-1">Enter your credentials below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button type="submit" loading={loading} className="w-full mt-2">
                  Log in
                </Button>
              </form>

              <p className="text-center text-sm text-neutral-700 mt-6 pt-4 border-t border-[#E2E8F0]">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
