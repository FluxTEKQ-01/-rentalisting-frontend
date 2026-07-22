import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SeoHead from '../../components/seo/SeoHead';
import ScrollVelocity from '../../components/ui/ScrollVelocity';

const tickerItems = [
  "100% Manual Property Verification",
  "Direct Owner Connection",
  "15+ Property Categories",
  "Zero Hidden Brokerage Fees",
  "Search & Rent with Confidence",
  "Verified Photos & Real Locations"
];

const stats = [
  { value: '100%', label: 'Manual Review Rate', desc: 'Every single listing is inspected before going live' },
  { value: '15+', label: 'Property Categories', desc: 'From apartments to commercial hubs & film sets' },
  { value: '0%', label: 'Hidden Brokerage', desc: 'Direct owner communication with transparent pricing' },
  { value: '24/7', label: 'Dedicated Support', desc: 'Real human support for tenants and space owners' },
];

const coreValues = [
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Uncompromised Trust & Quality',
    desc: 'We eliminate fake photos and misleading descriptions through our mandatory review pipeline. Every property image, pricing structure, and owner detail is verified.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Direct Owner Connection',
    desc: 'No middlemen inflating costs. Tenants connect directly with genuine property owners, founders, and space managers for smooth lease negotiations.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
      </svg>
    ),
    title: 'Multi-Category Ecosystem',
    desc: 'Whether you need a 2BHK flat, a corporate office tower, a film shooting location, a warehouse, or an event ground — BookMySpace powers every rental need.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Instant & Seamless Search',
    desc: 'Engineered with cutting-edge real-time search, filters, geolocated mapping, and interactive category hubs for effortless discovery.',
  },
];

const verificationSteps = [
  {
    step: '01',
    title: 'Property Submission',
    desc: 'Owners upload detailed property specifications, high-res photos, floor plans, and pricing structures.',
  },
  {
    step: '02',
    title: 'Manual Inspection & Review',
    desc: 'Our review team evaluates accuracy, image quality, location details, and owner verification credentials.',
  },
  {
    step: '03',
    title: 'Live Marketplace Publishing',
    desc: 'Once approved, the listing goes live across relevant category hubs and search engine directories.',
  },
  {
    step: '04',
    title: 'Direct Enquiry & Lease',
    desc: 'Tenants browse verified spaces and initiate direct, transparent communication with space owners.',
  },
];

export default function About() {
  return (
    <>
      <SeoHead
        title="About Us | BookMySpace - Reimagining Space Rentals"
        description="Learn about BookMySpace - India's leading verified space rental platform connecting tenants with genuine property owners for residential, commercial, industrial, and event spaces."
        keywords={['about bookmyspace', 'verified real estate platform', 'direct owner rental', 'space rental marketplace']}
      />

      {/* Clean Grid Sheen Hero Section (Matching Home Page Aesthetic) */}
      <section className="hero-sheen border-b border-[#E2E8F0] overflow-hidden relative">
        <div className="container-custom grid min-h-[480px] items-center gap-10 py-14 lg:grid-cols-[1.1fr_.9fr] lg:py-20">
          {/* Left Content Column */}
          <div>
            <p className="mono text-[11px] uppercase tracking-[.14em] text-primary font-semibold">About BookMySpace</p>
            <h1 className="mt-4 max-w-2xl font-display text-3xl font-extrabold leading-[1.06] tracking-[-.04em] text-primary md:text-5xl lg:text-6xl">
              Trust isn't a promise. <br />
              <span className="text-[#F58220]">It's our process.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm md:text-base leading-relaxed text-neutral-700 font-medium">
              BookMySpace was created to eliminate rental fraud, fake listings, and middleman markups. Every single property on our platform undergoes a manual inspection before it goes live.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link className="btn-primary shadow-md" to="/properties">
                Explore Verified Spaces
                <svg className="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-800 shadow-xs hover:border-primary hover:text-primary transition-all"
              >
                <span>Post property</span>
                <span className="rounded bg-[#F58220] px-2 py-0.5 text-[10px] font-extrabold uppercase text-white tracking-wider">
                  FREE
                </span>
              </Link>
            </div>
          </div>

          {/* Right Showcase Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F58220]">Our Standards</span>
                <h3 className="text-lg font-bold text-slate-900 font-display">The BookMySpace Guarantee</h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-extrabold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Verified
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { title: '100% Manual Review', desc: 'Real humans verify location, details, and ownership docs.' },
                { title: 'Direct Owner Connect', desc: 'No broker commissions or hidden markups.' },
                { title: 'Real High-Res Photos', desc: 'Zero stock imagery or fake renders permitted.' },
                { title: 'Multi-Space Coverage', desc: 'Homes, offices, land plots, warehouses & studios.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-100/80">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81] text-white mt-0.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-neutral-600 font-semibold">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Trusted by space seekers nationwide
              </span>
              <span className="text-primary font-bold">100% Transparent</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Velocity Ticker Banner */}
      <div className="bg-primary py-3.5 border-b border-[#0a355c] shadow-inner overflow-hidden select-none">
        <ScrollVelocity
          texts={[
            <span className="inline-flex items-center gap-6 px-4">
              {tickerItems.map((text, index) => (
                <span key={index} className="inline-flex items-center gap-6">
                  <span className="font-display text-sm md:text-base font-semibold tracking-wider uppercase text-white/95">
                    {text}
                  </span>
                  <span className="text-accent font-bold text-xs select-none">✦</span>
                </span>
              ))}
            </span>
          ]}
          velocity={40}
          numCopies={6}
          className="py-0.5"
        />
      </div>

      {/* Stats Counter Section */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-extrabold text-[#F58220] sm:text-4xl font-display">{stat.value}</div>
                <div className="mt-1 text-sm font-bold text-slate-900">{stat.label}</div>
                <div className="mt-1 text-xs text-slate-500 max-w-[200px] mx-auto">{stat.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Why BookMySpace Stands Out</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl font-display">
              Built on Transparency, Engineered for Simplicity
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Finding a home, booking a warehouse, or securing a commercial office shouldn't come with guesswork. Here is how we redefine space discovery.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Process Section */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F58220]">Our Inspection Standard</span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl font-display leading-tight">
                How We Guarantee 100% Genuine Listings
              </h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Unlike unmoderated real estate portals overflowing with outdated listings or duplicate agent spam, every property submitted to BookMySpace undergoes a strict 4-step review process before going live.
              </p>

              <div className="mt-8 space-y-5">
                {verificationSteps.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-extrabold text-white">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{s.title}</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 p-8 text-white">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                alt="BookMySpace Verification Team"
                className="w-full h-72 object-cover rounded-2xl mb-6 shadow-md"
              />
              <blockquote className="text-base italic text-slate-200 leading-relaxed">
                "When every listing is reviewed, every move begins with confidence. We bridge the gap between genuine space seekers and verified property owners."
              </blockquote>
              <div className="mt-4 text-xs font-bold uppercase tracking-wider text-[#F58220]">
                — The BookMySpace Review Board
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* High-Conversion CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-[#0F4C81] to-slate-950 text-white relative overflow-hidden">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-extrabold sm:text-5xl font-display leading-tight">
            Ready to Find Your Ideal Space?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Browse thousands of verified apartments, commercial offices, villas, warehouses, and event grounds with zero hidden fees.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 rounded-full bg-[#F58220] px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:bg-amber-600 hover:scale-105"
            >
              <span>Browse All Rental Listings</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
