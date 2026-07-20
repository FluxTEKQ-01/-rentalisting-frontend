import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../store/authContext';
import { Button } from '../components/ui';

const sidebarLinks = [
  { to: '/owner', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/owner/listings', label: 'My Listings', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { to: '/owner/listings/create', label: 'Create Listing', icon: 'M12 4v16m8-8H4' },
  { to: '/owner/notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
];

export default function OwnerLayout() {
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
          <Link to="/owner" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="BookMySpace" className="h-8 w-auto" />
            <div>
              <span className="font-display text-sm font-bold text-primary leading-tight block">BookMySpace</span>
              <span className="text-[11px] text-neutral-700/60 font-medium">Owner dashboard</span>
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
                {link.label === 'Notifications' && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-accent" />
                )}
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
                  {user?.name?.charAt(0) || 'O'}
                </div>
                <div className="text-left text-sm leading-tight">
                  <p className="font-medium text-neutral-900">{user?.name}</p>
                  <p className="text-[11px] text-neutral-700/60">Owner</p>
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
