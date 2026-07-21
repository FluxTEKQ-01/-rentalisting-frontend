import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../store/authContext';
import { propertyCategories } from '../api/endpoints';
import LocationPromptModal from '../components/location/LocationPromptModal';

const MenuIcon = ({ open }: { open: boolean }) => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth="1.8" d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>;

export default function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setMenuOpen(false);

  return <div className="flex min-h-screen flex-col bg-neutral">
    <LocationPromptModal />
    <header className="site-header sticky top-0 z-40 border-b border-[#E2E8F0]">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20 relative">
        <Link to="/" className="flex items-center shrink-0" onClick={() => { close(); window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }}>
          <img src="/logo.png" alt="BookMySpace" className="h-7 w-auto md:h-9" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-700 md:flex md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link className="hover:text-primary whitespace-nowrap transition-colors" to="/properties">Explore Rentals</Link>
          <Link className="hover:text-primary whitespace-nowrap transition-colors" to="/about">About Us</Link>
          <Link className="hover:text-primary whitespace-nowrap transition-colors" to="/contact">Contact Us</Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated && (
            <>
              {(user?.role === 'owner' || user?.role === 'admin') && <button className="btn-ghost btn-sm" onClick={() => navigate(user.role === 'owner' ? '/owner' : '/admin')}>Dashboard</button>}
              <button className="btn-outline btn-sm" onClick={logout}>Sign out</button>
            </>
          )}
        </div>
        <button className="ml-auto rounded-md p-2 text-secondary hover:bg-[#eef2ff] md:hidden" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}><MenuIcon open={menuOpen} /></button>
      </div>
      {menuOpen && <div className="container-custom border-t border-[#E2E8F0] py-3 md:hidden">
        <nav className="flex flex-col gap-1 text-sm font-medium">
          <Link className="rounded-md px-3 py-2 hover:bg-[#eef2ff]" to="/properties" onClick={close}>Explore rentals</Link>
          <Link className="rounded-md px-3 py-2 hover:bg-[#eef2ff]" to="/about" onClick={close}>About us</Link>
          <Link className="rounded-md px-3 py-2 hover:bg-[#eef2ff]" to="/contact" onClick={close}>Contact</Link>
          {isAuthenticated && <button className="mt-2 btn-outline btn-sm" onClick={() => { logout(); close(); }}>Sign out</button>}
        </nav>
      </div>}
    </header>
    <main className="flex-1"><Outlet /></main>
    <footer className="bg-primary text-white">
      <div className="container-custom grid gap-10 py-14 md:grid-cols-[1.7fr_1fr_1fr]">
        <div><div className="mb-6"><img src="/logo.png" alt="BookMySpace" className="h-8 w-auto brightness-0 invert md:h-10" /></div><p className="max-w-sm text-sm leading-6 text-white/70">At BookMySpace, trust isn't a promise — it's our process. Every listing you see has passed a manual review by our team to ensure accuracy, quality photos, and verified details. Whether you're searching for an office, a retail space, or your next home, we connect you directly with verified owners. Because when every listing is reviewed, every move begins with confidence.</p></div>
        <div><h3 className="mb-4 text-xs font-bold uppercase tracking-[.12em] text-white">Rental Properties</h3><div className="flex flex-col gap-2 text-sm text-white/70">{propertyCategories.map(cat => <Link key={cat.value} to={`/properties?propertyType=${cat.value}`} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>{cat.label}</Link>)}</div></div>
        <div><h3 className="mb-4 text-xs font-bold uppercase tracking-[.12em] text-white">Quick links</h3><div className="flex flex-col gap-3 text-sm text-white/70"><Link to="/" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>Home</Link><Link to="/properties" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>Explore Rentals</Link><Link to="/register" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>List your property</Link><Link to="/about" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>About us</Link><Link to="/contact" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>Contact Us</Link></div></div>
      </div>
      <div className="container-custom border-t border-white/10 py-6 text-[11px] text-white/50">&copy; {new Date().getFullYear()} BookMySpace. Reimagining real estate.</div>
    </footer>
  </div>;
}
