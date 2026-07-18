import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../store/authContext';
import { Button } from '../components/ui';


export default function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-surface/85 backdrop-blur-xl border-b border-neutral-700/10 sticky top-0 z-40 shadow-sm transition-all duration-200">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-18">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display font-black text-2xl tracking-wider text-primary select-none">LUXEBNB</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <div className="w-px h-5 bg-neutral-900/10 mx-3" />
              {!isAuthenticated ? (
                <div className="flex items-center gap-2.5">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Sign in</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">List Your Property</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  {user?.role === 'owner' && (
                    <Link to="/owner">
                      <Button variant="ghost" size="sm">Dashboard</Button>
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="ghost" size="sm">Admin</Button>
                    </Link>
                  )}
                  <Button variant="outline" size="sm" onClick={logout}>Sign out</Button>
                </div>
              )}
            </nav>

            <button
              className="md:hidden p-2.5 rounded-lg hover:bg-primary/5 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-5 border-t border-neutral-900/5 pt-4 space-y-1">
              <div className="space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="block">
                      <Button variant="ghost" size="sm" className="w-full justify-start">Sign in</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="block">
                      <Button variant="primary" size="sm" className="w-full">List Your Property</Button>
                    </Link>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => { logout(); setMenuOpen(false); }} className="w-full">
                    Sign out
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-neutral-900 text-white border-t border-neutral-800">
        <div className="container-custom py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <Link to="/" className="flex items-center mb-4">
                <span className="font-display font-black text-2xl tracking-wider text-white select-none">LUXEBNB</span>
              </Link>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Redefining luxury living for the global nomad. Every stay is a sanctuary.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-secondary-light text-sm uppercase tracking-wider mb-4">Platform</h4>
              <div className="flex flex-col gap-2.5 text-sm text-white/70">
                <Link to="/properties?propertyType=apartment" className="hover:text-white transition-colors w-fit">Apartments</Link>
                <Link to="/properties?propertyType=villa" className="hover:text-white transition-colors w-fit">Villas</Link>
                <Link to="/properties" className="hover:text-white transition-colors w-fit">Locations</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-secondary-light text-sm uppercase tracking-wider mb-4">Company</h4>
              <div className="flex flex-col gap-2.5 text-sm text-white/70">
                <Link to="/careers" className="hover:text-white transition-colors w-fit">Careers</Link>
                <Link to="/press" className="hover:text-white transition-colors w-fit">Press</Link>
                <Link to="/contact" className="hover:text-white transition-colors w-fit">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-secondary-light text-sm uppercase tracking-wider mb-4">Legal</h4>
              <div className="flex flex-col gap-2.5 text-sm text-white/70">
                <Link to="/terms" className="hover:text-white transition-colors w-fit">Terms</Link>
                <Link to="/privacy" className="hover:text-white transition-colors w-fit">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <span>&copy; {new Date().getFullYear()} LUXEBNB Global. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <button aria-label="Language selection" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
                </svg>
              </button>
              <button aria-label="Customer support chat" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
