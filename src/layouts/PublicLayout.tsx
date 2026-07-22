import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../store/authContext';
import { propertyCategories } from '../api/endpoints';
import { getCategorySlug } from '../config/categorySeoData';
import LocationPromptModal from '../components/location/LocationPromptModal';
import BackToTopButton from '../components/common/BackToTopButton';

const MenuIcon = ({ open }: { open: boolean }) => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth="1.8" d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>;

export default function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setMenuOpen(false);

  const handlePropertyRentalsClick = (e: React.MouseEvent) => {
    close();
    if (window.location.pathname === '/') {
      e.preventDefault();
      const section = document.getElementById('browse-categories');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#browse-categories');
      setTimeout(() => {
        const section = document.getElementById('browse-categories');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  return <div className="flex min-h-screen flex-col bg-neutral">
    <LocationPromptModal />
    <BackToTopButton />
    <header className="site-header sticky top-0 z-40 border-b border-[#E2E8F0]">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20 relative">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            close();
            window.location.href = '/';
          }}
          className="flex items-center shrink-0 cursor-pointer"
          title="Refresh BookMySpace Home"
        >
          <img src="/logo.png" alt="BookMySpace" className="h-7 w-auto md:h-9" />
        </a>
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-700">
          <Link className="hover:text-primary transition-colors" to="/owner">For Owners</Link>
          <a
            href="/#browse-categories"
            onClick={handlePropertyRentalsClick}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Property Rentals
          </a>
          <Link className="hover:text-primary transition-colors" to="/about">About Us</Link>
          <Link className="hover:text-primary transition-colors" to="/contact">Contact Us</Link>
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          {/* Post Property FREE Pill Button */}
          <Link
            to={isAuthenticated ? (user?.role === 'owner' ? '/owner/listings/create' : '/owner') : '/register'}
            className="relative inline-flex items-center gap-2 rounded-full border border-amber-300/90 bg-white px-4 py-1.5 text-xs font-bold text-slate-900 shadow-sm transition-all hover:border-[#F58220] hover:shadow-md group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F58220] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F58220]"></span>
            </span>
            <span>Post property</span>
            <span className="relative inline-flex items-center rounded bg-[#F58220] px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-white tracking-wider shadow-xs animate-pulse">
              FREE
            </span>
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              {(user?.role === 'owner' || user?.role === 'admin') && (
                <button className="btn-ghost btn-sm text-xs" onClick={() => navigate(user.role === 'owner' ? '/owner' : '/admin')}>
                  Dashboard
                </button>
              )}
              <button className="btn-outline btn-sm text-xs" onClick={logout}>Sign out</button>
            </div>
          )}
        </div>
        <button className="ml-auto rounded-md p-2 text-secondary hover:bg-[#eef2ff] md:hidden" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}><MenuIcon open={menuOpen} /></button>
      </div>
      {menuOpen && <div className="container-custom border-t border-[#E2E8F0] py-3 md:hidden bg-white">
        <nav className="flex flex-col gap-1 text-sm font-medium">
          <Link className="rounded-md px-3 py-2 hover:bg-[#eef2ff]" to="/owner" onClick={close}>For Owners</Link>
          <a
            href="/#browse-categories"
            onClick={handlePropertyRentalsClick}
            className="rounded-md px-3 py-2 hover:bg-[#eef2ff] cursor-pointer"
          >
            Property Rentals
          </a>
          <Link className="rounded-md px-3 py-2 hover:bg-[#eef2ff]" to="/about" onClick={close}>About Us</Link>
          <Link className="rounded-md px-3 py-2 hover:bg-[#eef2ff]" to="/contact" onClick={close}>Contact Us</Link>
          <Link
            to={isAuthenticated ? (user?.role === 'owner' ? '/owner/listings/create' : '/owner') : '/register'}
            onClick={close}
            className="mt-2 flex items-center justify-between rounded-xl border border-amber-300/80 bg-amber-50/40 px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F58220] opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F58220]"></span>
              </span>
              <span>Post property</span>
            </span>
            <span className="rounded bg-[#F58220] px-2 py-0.5 text-[10px] font-extrabold uppercase text-white tracking-wider shadow-xs animate-pulse">
              FREE
            </span>
          </Link>
          {isAuthenticated && (
            <button className="mt-1 btn-outline btn-sm w-full" onClick={() => { logout(); close(); }}>Sign out</button>
          )}
        </nav>
      </div>}
    </header>
    <main className="flex-1"><Outlet /></main>
    <footer className="bg-primary text-white">
      <div className="container-custom grid gap-10 py-14 md:grid-cols-[1.7fr_1fr_1fr]">
        <div><a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="mb-6 inline-block cursor-pointer" title="Refresh BookMySpace Home"><img src="/logo.png" alt="BookMySpace" className="h-8 w-auto brightness-0 invert md:h-10" /></a><p className="max-w-sm text-sm leading-6 text-white/70">At BookMySpace, trust isn't a promise — it's our process. Every listing you see has passed a manual review by our team to ensure accuracy, quality photos, and verified details. Whether you're searching for an office, a retail space, or your next home, we connect you directly with verified owners. Because when every listing is reviewed, every move begins with confidence.</p></div>
        <div><h3 className="mb-4 text-xs font-bold uppercase tracking-[.12em] text-white">Rental Properties</h3><div className="flex flex-col gap-2 text-sm text-white/70">{propertyCategories.map(cat => <Link key={cat.value} to={`/category/${getCategorySlug(cat.value)}`} onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>{cat.label}</Link>)}</div></div>
        <div><h3 className="mb-4 text-xs font-bold uppercase tracking-[.12em] text-white">Quick links</h3><div className="flex flex-col gap-3 text-sm text-white/70"><Link to="/" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>Home</Link><Link to="/properties" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>Explore Rentals</Link><Link to="/register" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>List your property</Link><Link to="/about" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>About us</Link><Link to="/contact" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}>Contact Us</Link></div></div>
      </div>
      <div className="container-custom border-t border-white/10 py-6 text-[11px] text-white/50">&copy; {new Date().getFullYear()} BookMySpace. Reimagining real estate.</div>
    </footer>
  </div>;
}
