import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../store/authContext';
import { Button } from '../components/ui';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/admin/listings', label: 'Listings', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { to: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { to: '/admin/reviews', label: 'Reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-surface border-r border-[#E2E8F0] flex flex-col transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-[#E2E8F0]">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="BookMySpace" className="h-7 w-auto" />
            <div>
              <span className="font-display text-sm font-bold text-primary leading-tight block">Admin Panel</span>
              <span className="text-[11px] text-neutral-700/60 font-medium">Platform management</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-neutral-700 hover:bg-primary/5 hover:text-primary'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                </svg>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#E2E8F0]">
          <Link to="/" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-neutral-700 hover:text-primary hover:bg-primary/5 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to site
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-surface/90 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-10">
          <div className="flex items-center justify-between px-5 h-16">
            <button
              className="lg:hidden p-2.5 rounded-lg hover:bg-primary/5 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="text-left text-sm leading-tight">
                  <p className="font-medium text-neutral-900">{user?.name}</p>
                  <p className="text-[11px] text-neutral-700/60">Admin</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
