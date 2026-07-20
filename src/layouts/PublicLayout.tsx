import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../store/authContext';

const MenuIcon = ({ open }: { open: boolean }) => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth="1.8" d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg>;

export default function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setMenuOpen(false);

  return <div className="flex min-h-screen flex-col bg-neutral">
    <header className="site-header sticky top-0 z-40 border-b border-[#E2E8F0]">
      <div className="container-custom flex h-28 items-center justify-between gap-6">
        <Link to="/" className="flex items-center py-1 text-primary" onClick={close}>
          <img src="/logo.png" alt="BookMySpace" className="h-20 w-auto" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-neutral-700 md:flex">
          <Link className="hover:text-primary" to="/properties">Explore rentals</Link>
          <Link className="hover:text-primary" to="/about">About us</Link>
          <Link className="hover:text-primary" to="/contact">Contact</Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? <>
            {(user?.role === 'owner' || user?.role === 'admin') && <button className="btn-ghost btn-sm" onClick={() => navigate(user.role === 'owner' ? '/owner' : '/admin')}>Dashboard</button>}
            <button className="btn-outline btn-sm" onClick={logout}>Sign out</button>
          </> : <>
            <Link className="btn-ghost btn-sm" to="/login">Sign in</Link>
            <Link className="btn-primary btn-sm" to="/register">List a property</Link>
          </>}
        </div>
        <button className="rounded-md p-2 text-secondary hover:bg-[#eef2ff] md:hidden" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}><MenuIcon open={menuOpen} /></button>
      </div>
      {menuOpen && <div className="container-custom border-t border-[#E2E8F0] py-3 md:hidden">
        <nav className="flex flex-col gap-1 text-sm font-medium">
          <Link className="rounded-md px-3 py-2 hover:bg-[#eef2ff]" to="/properties" onClick={close}>Explore rentals</Link>
          <Link className="rounded-md px-3 py-2 hover:bg-[#eef2ff]" to="/about" onClick={close}>About us</Link>
          <Link className="rounded-md px-3 py-2 hover:bg-[#eef2ff]" to="/contact" onClick={close}>Contact</Link>
          {isAuthenticated ? <button className="mt-2 btn-outline btn-sm" onClick={() => { logout(); close(); }}>Sign out</button> : <div className="mt-2 flex gap-2"><Link className="btn-ghost btn-sm" to="/login" onClick={close}>Sign in</Link><Link className="btn-primary btn-sm" to="/register" onClick={close}>List a property</Link></div>}
        </nav>
      </div>}
    </header>
    <main className="flex-1"><Outlet /></main>
    <footer className="bg-primary text-white">
      <div className="container-custom grid gap-10 py-14 md:grid-cols-[1.7fr_1fr_1fr]">
        <div><div className="mb-6"><img src="/logo.png" alt="BookMySpace" className="h-24 w-auto brightness-0 invert" /></div><p className="max-w-sm text-sm leading-6 text-white/70">Your trusted partner in finding the perfect space. We verify listings so every move begins with confidence.</p><div className="mt-6 flex gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs">in</span><span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs">ig</span></div></div>
        <div><h3 className="mb-4 text-xs font-bold uppercase tracking-[.12em] text-white">Properties</h3><div className="flex flex-col gap-3 text-sm text-white/70"><Link to="/properties">Office spaces</Link><Link to="/properties?propertyType=house_apartment">Houses & Apartments</Link><Link to="/properties?propertyType=commercial_building">Commercial lease</Link><Link to="/properties?propertyType=open_plot_land">Plots & land</Link></div></div>
        <div><h3 className="mb-4 text-xs font-bold uppercase tracking-[.12em] text-white">Quick links</h3><div className="flex flex-col gap-3 text-sm text-white/70"><Link to="/">Home</Link><Link to="/properties">Explore rentals</Link><Link to="/register">List your property</Link><Link to="/about">About us</Link><Link to="/contact">Contact</Link></div></div>
      </div>
      <div className="container-custom border-t border-white/10 py-6 text-[11px] text-white/50">&copy; {new Date().getFullYear()} BookMySpace. Reimagining real estate.</div>
    </footer>
  </div>;
}
