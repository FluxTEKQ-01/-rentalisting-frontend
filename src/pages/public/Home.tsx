import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { propertyApi, propertyCategories } from '../../api/endpoints';
import { getCategorySlug } from '../../config/categorySeoData';
import type { Property } from '../../types';
import ScrollVelocity from '../../components/ui/ScrollVelocity';

const heroTaglineItems = [
  "Verified Listings. Trusted Rentals.",
  "Find. Connect. Rent.",
  "Your Space, Your Choice.",
  "Rent Smarter with BookMySpace.",
  "Connecting Owners with Tenants.",
  "From Homes to Commercial Spaces.",
  "Search with Confidence.",
  "Discover Spaces That Fit Your Lifestyle."
];

const categoryIcons: Record<string, string> = {
  office: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  shop_retail: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  warehouse: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  house_apartment: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  villa: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  open_plot_land: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  event_venue: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  coworking: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  commercial_building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  parking: 'M5 16v6h4v-2h6v2h4v-6M5 16h14M5 16V8a2 2 0 012-2h10a2 2 0 012 2v8M7 12h10',
  showroom: 'M4 6h16M4 10h16M4 14h16M4 18h16',
  industrial: 'M6 2v6h.01M6 2h.01M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 0h12M10 18h4M8 14h8',
  hotel_banquet: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  shooting_location: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  storage: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
};

const visualCategories = [
  { title: 'Office Spaces', value: 'office', desc: 'Corporate offices, desk setups & commercial workspace hubs', image: '/categories/office.png' },
  { title: 'Commercial Buildings', value: 'commercial_building', desc: 'Standalone towers & commercial business complexes', image: '/categories/commercial.png' },
  { title: 'Co-working Spaces', value: 'coworking', desc: 'Shared desks, private cabins & startup workspaces', image: '/categories/coworking.png' },
  { title: 'Shooting Locations', value: 'shooting_location', desc: 'Film sets, photo studios & production sets', image: '/categories/shooting_location.png' },
  { title: 'Houses & Apartments', value: 'house_apartment', desc: 'Verified apartments, builder floors & family homes', image: '/categories/apartment.png' },
  { title: 'Villas', value: 'villa', desc: 'Independent villas, luxury bungalows & private estates', image: '/categories/villa.png' },
  { title: 'Open Plots & Land', value: 'open_plot_land', desc: 'Commercial & residential land plots for lease', image: '/categories/land.png' },
  { title: 'Shops & Retail', value: 'shop_retail', desc: 'High footfall retail outlets, stores & commercial units', image: '/categories/retail.png' },
  { title: 'Showrooms', value: 'showroom', desc: 'Glass-front display showrooms & retail brand outlets', image: '/categories/showroom.png' },
  { title: 'Warehouses', value: 'warehouse', desc: 'Industrial storage, logistics centers & godowns', image: '/categories/warehouse.png' },
  { title: 'Industrial Spaces', value: 'industrial', desc: 'Manufacturing plants, factories & industrial units', image: '/categories/industrial.png' },
  { title: 'Storage Spaces', value: 'storage', desc: 'Self-storage lockers, inventory & safe deposit space', image: '/categories/storage.png' },
  { title: 'Event Venues', value: 'event_venue', desc: 'Banquet halls, celebration grounds & party venues', image: '/categories/event.png' },
  { title: 'Hotels & Banquet Halls', value: 'hotel_banquet', desc: 'Hospitality properties, hotels & banquet spaces', image: '/categories/hotel_banquet.png' },
  { title: 'Parking Spaces', value: 'parking', desc: 'Dedicated vehicle parking slots & fleet storage', image: '/categories/parking.png' }
];

// Vector Graphics for How It Works Steps
function Step1Vector() {
  return (
    <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="28" height="32" rx="4" fill="#0F4C81" fillOpacity="0.1" stroke="#0F4C81" strokeWidth="2" />
      <path d="M18 16 H30 M18 22 H26" stroke="#0F4C81" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="30" r="9" fill="#F58220" />
      <path d="M32 26 V34 M28 30 L32 26 L36 30" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Step2Vector() {
  return (
    <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6 L38 12 V22 C38 31 32 38 24 42 C16 38 10 31 10 22 V12 L24 6 Z" fill="#005EB8" fillOpacity="0.1" stroke="#005EB8" strokeWidth="2" />
      <path d="M18 22 L22 26 L30 18" stroke="#F58220" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Step3Vector() {
  return (
    <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 24 L24 14 L36 24 V38 H12 Z" fill="#0F4C81" fillOpacity="0.15" stroke="#0F4C81" strokeWidth="2" />
      <rect x="20" y="28" width="8" height="10" fill="#0F4C81" />
      <circle cx="34" cy="14" r="7" fill="#10B981" />
      <circle cx="34" cy="14" r="3" fill="#ffffff" />
    </svg>
  );
}

function Step4Vector() {
  return (
    <svg className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 14 C8 10.7 10.7 8 14 8 H34 C37.3 8 40 10.7 40 14 V26 C40 29.3 37.3 32 34 32 H18 L10 38 V32 H14" fill="#005EB8" fillOpacity="0.1" stroke="#005EB8" strokeWidth="2" />
      <circle cx="20" cy="20" r="2.5" fill="#F58220" />
      <circle cx="27" cy="20" r="2.5" fill="#0F4C81" />
      <circle cx="34" cy="20" r="2.5" fill="#F58220" />
    </svg>
  );
}

const howItWorksSteps = [
  {
    number: "01",
    title: "Owners submit",
    text: "Property owners submit their rental property with verified photos & details for review.",
    icon: <Step1Vector />,
  },
  {
    number: "02",
    title: "We verify",
    text: "Our dedicated review team inspects and verifies the property information.",
    icon: <Step2Vector />,
  },
  {
    number: "03",
    title: "Listings go live",
    text: "Approved listings are published instantly for genuine tenants to explore.",
    icon: <Step3Vector />,
  },
  {
    number: "04",
    title: "Tenants enquire",
    text: "Interested tenants browse verified spaces and send enquiries directly to owners.",
    icon: <Step4Vector />,
  },
];

function Icon({ name }: { name: 'search' | 'pin' | 'shield' | 'message' | 'filter' | 'check' | 'arrow' }) {
  const paths = { search: 'm21 21-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z', pin: 'M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', shield: 'M12 3 5 6v5c0 4.7 3 8.7 7 10 4-1.3 7-5.3 7-10V6l-7-3Z', message: 'M20 11.5a7.5 7.5 0 0 1-8 7.5 8.3 8.3 0 0 1-3.8-.9L4 19l1.1-3.3A7.3 7.3 0 0 1 4 12a7.5 7.5 0 0 1 8-7.5 7.5 7.5 0 0 1 8 7Z', filter: 'M4 6h16M7 12h10m-7 6h4', check: 'm5 12 4 4L19 6', arrow: 'M5 12h14m-6-6 6 6-6 6' };
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7"><path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} /></svg>;
}

function RecentCard({ property }: { property: Property }) {
  const image = property.images?.[0]?.url;
  return <article className="card-hover flex h-full flex-col"><Link to={`/properties/${property._id}`} className="relative block aspect-[16/10] overflow-hidden bg-[#E2E8F0]">{image ? <img className="h-full w-full object-cover transition duration-500 hover:scale-105" src={image} alt={property.title} /> : <div className="grid h-full place-items-center text-sm text-neutral-700">Image unavailable</div>}<span className="absolute left-3 top-3 rounded bg-accent px-2 py-1 text-[10px] font-bold text-white">Verified</span></Link><div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-primary">{property.propertyType.replace('_', ' ')}</p><h3 className="mt-1 font-display text-lg font-semibold leading-5">{property.title}</h3><p className="mt-2 flex items-center gap-1 text-xs text-neutral-700"><Icon name="pin" />{property.location.city}</p></div><div className="shrink-0 text-right"><strong className="font-display text-base text-primary">₹{property.price.toLocaleString('en-IN')}</strong><small className="block text-[10px] text-neutral-700">per month</small></div></div><div className="mt-5 grid grid-cols-3 border-y border-[#E2E8F0] py-3 text-center text-xs text-neutral-700"><span>{property.bedrooms || '—'} BHK</span><span>{property.bathrooms || '—'} bath</span><span>{property.area} {property.areaUnit || 'sq ft'}</span></div><Link className="btn-outline btn-sm mt-4" to={`/properties/${property._id}`}>View details</Link></div></article>;
}

export default function Home() {
  const navigate = useNavigate(); const [location, setLocation] = useState(''); const [type, setType] = useState('');
  const { data, isLoading } = useQuery({ queryKey: ['recent-approved-rentals'], queryFn: () => propertyApi.list({ status: 'published', limit: '3', sort: 'latest' }) });
  const search = (event: React.FormEvent) => { event.preventDefault(); const query = new URLSearchParams(); if (location) query.set('keyword', location); if (type) query.set('propertyType', type); navigate(`/properties${query.size ? `?${query}` : ''}`); };
  
  return <>
    <section className="hero-sheen border-b border-[#E2E8F0]"><div className="container-custom grid-rule grid min-h-[440px] items-center gap-8 py-12 lg:grid-cols-[1.1fr_.9fr] lg:py-20"><div><p className="mono text-[11px] uppercase tracking-[.14em] text-primary">Rental marketplace</p><h1 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-[1.04] tracking-[-.045em] text-primary md:text-6xl">Find the perfect space for your needs.</h1><p className="mt-6 max-w-xl leading-7 text-neutral-700">Discover verified rental spaces across multiple categories. Every published listing is reviewed before it goes live, so you can search with confidence.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="btn-primary" to="/properties">Explore Rentals <Icon name="arrow" /></Link><Link className="btn-outline" to="/register">List your property</Link></div></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl relative overflow-hidden">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4 mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setType('house_apartment')}
                className={`rounded-lg px-3 py-1.5 transition-colors ${type === 'house_apartment' || !type ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Rent
              </button>
              <button
                type="button"
                onClick={() => setType('office')}
                className={`rounded-lg px-3 py-1.5 transition-colors ${type === 'office' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Commercial
              </button>
              <button
                type="button"
                onClick={() => setType('open_plot_land')}
                className={`rounded-lg px-3 py-1.5 transition-colors ${type === 'open_plot_land' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Plots / Land
              </button>
              <button
                type="button"
                onClick={() => setType('villa')}
                className={`rounded-lg px-3 py-1.5 transition-colors ${type === 'villa' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Villas
              </button>
            </div>

            <h2 className="text-xl font-bold text-slate-900">Find a space that fits.</h2>
            <form onSubmit={search} className="mt-4 space-y-3.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Location
                <input className="input-field mt-1" value={location} onChange={e => setLocation(e.target.value)} placeholder="Search by area, landmark or city..." />
              </label>
              <label className="block text-xs font-semibold text-neutral-700">
                Property type
                <select className="input-field mt-1" value={type} onChange={e => setType(e.target.value)}>
                  <option value="">Any type</option>
                  {propertyCategories.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select>
              </label>
              <button className="btn-primary w-full shadow-md" type="submit">
                <Icon name="search" /> Search rentals
              </button>
            </form>
            <p className="mt-4 flex items-center gap-2 text-xs leading-5 text-neutral-700">
              <Icon name="shield" /> Only reviewed listings are published.
            </p>
          </div></div></section>

    <div className="bg-primary py-3.5 border-b border-[#0a355c] shadow-inner overflow-hidden select-none">
      <ScrollVelocity
        texts={[
          <span className="inline-flex items-center gap-6 px-4">
            {heroTaglineItems.map((text, index) => (
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

    <section id="browse-categories" className="container-custom py-16 md:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-[11px] uppercase tracking-[.14em] text-primary font-semibold">Browse rentals</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">Browse by property type</h2>
          <p className="mt-2 text-sm text-neutral-700">Start with the kind of space you need.</p>
        </div>
        <Link className="text-sm font-semibold text-primary hover:underline flex items-center gap-1" to="/properties">
          Explore all categories →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visualCategories.map(cat => (
          <Link
            key={cat.value}
            to={`/category/${getCategorySlug(cat.value as any)}`}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_36px_rgba(15,76,129,0.10)]"
          >
            <div className="flex h-44 w-full items-center justify-center p-2 rounded-xl bg-[#F8FAFC]">
              <img
                src={cat.image}
                alt={cat.title}
                className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-5 text-center">
              <h3 className="font-display text-lg font-bold text-neutral-900 transition-colors group-hover:text-primary flex items-center justify-center gap-1.5">
                {cat.title}
                <span className="text-primary transition-transform group-hover:translate-x-1">›</span>
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-700">
                {cat.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* Why Choose BookMySpace Section with Motion & Animations */}
    <section className="border-y border-[#E2E8F0] bg-white relative overflow-hidden">
      <div className="container-custom grid gap-12 py-16 md:grid-cols-[1fr_1.1fr] md:py-24 items-center">
        <div>
          <p className="mono text-[11px] uppercase tracking-[.14em] text-primary font-semibold">
            Why choose BookMySpace
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            A trusted rental marketplace.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-neutral-700">
            BookMySpace focuses entirely on rental properties, giving tenants and owners a simpler, transparent way to connect.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-[#F8FAFC] to-[#eef2ff] p-5 border-l-4 border-l-primary shadow-sm relative overflow-hidden"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-accent/10 rounded-full blur-xl pointer-events-none" />
            <h4 className="font-display text-sm font-bold text-primary flex items-center gap-2">
              <Icon name="shield" /> Only Verified Properties. No Fake Listings.
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-700">
              Every listing is reviewed before publication, helping you search with confidence and peace of mind.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Verified Listings", "Every submitted property is manually reviewed before it becomes visible.", 'shield'],
            ["Wide Variety", "Browse offices, shops, warehouses, homes, villas, event venues and more.", 'pin'],
            ["Direct Enquiries", "Send an enquiry directly to a property owner when you are interested.", 'message'],
            ["Simple Discovery", "Search by location, budget, property type and more.", 'search']
          ].map(([title, text, icon], idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef2ff] text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Icon name={icon as 'shield' | 'pin' | 'message' | 'search'} />
              </div>
              <h3 className="font-display text-base font-bold text-neutral-900 group-hover:text-primary transition-colors">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-neutral-700">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Featured Listings Section */}
    <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] py-16 md:py-20">
      <div className="container-custom">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono text-[11px] font-semibold uppercase tracking-[.14em] text-accent">
              Top Picked Spaces
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
              Featured Listings
            </h2>
            <p className="mt-2 text-sm text-neutral-700">
              Hand-picked verified rental spaces ready for immediate move-in.
            </p>
          </div>
          <Link className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline" to="/properties">
            Explore all featured →
          </Link>
        </div>

        {isLoading ? (
          <div className="text-sm text-neutral-700">Loading featured listings…</div>
        ) : data?.data?.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {data.data.map((property: Property) => (
              <article key={property._id} className="card-hover flex h-full flex-col">
                <Link to={`/properties/${property._id}`} className="relative block aspect-[16/10] overflow-hidden bg-[#E2E8F0]">
                  {property.images?.[0]?.url ? (
                    <img className="h-full w-full object-cover transition duration-500 hover:scale-105" src={property.images[0].url} alt={property.title} />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-neutral-700">Image unavailable</div>
                  )}
                  <span className="absolute left-3 top-3 rounded bg-accent px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1">
                    <span>✦</span> Featured
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{property.propertyType.replace('_', ' ')}</p>
                      <h3 className="mt-1 font-display text-lg font-semibold leading-5">{property.title}</h3>
                      <p className="mt-2 flex items-center gap-1 text-xs text-neutral-700"><Icon name="pin" />{property.location.city}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <strong className="font-display text-base text-primary">₹{property.price.toLocaleString('en-IN')}</strong>
                      <small className="block text-[10px] text-neutral-700">per month</small>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 border-y border-[#E2E8F0] py-3 text-center text-xs text-neutral-700">
                    <span>{property.bedrooms || '—'} BHK</span>
                    <span>{property.bathrooms || '—'} bath</span>
                    <span>{property.area} {property.areaUnit || 'sq ft'}</span>
                  </div>
                  <Link className="btn-primary btn-sm mt-4 w-full text-center" to={`/properties/${property._id}`}>View details</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#E2E8F0] p-10 text-center">
            <p className="font-display text-lg">No featured listings right now.</p>
            <Link className="btn-primary mt-5" to="/properties">Explore Rentals</Link>
          </div>
        )}
      </div>
    </section>

    {/* Approved Rentals Section */}
    <section className="container-custom py-16 md:py-20"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mono text-[11px] uppercase tracking-[.14em] text-primary">Approved rentals</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Recently added properties</h2><p className="mt-2 text-sm text-neutral-700">New listings that have completed our review process.</p></div><Link className="text-sm font-semibold text-primary hover:underline" to="/properties">Explore all rentals →</Link></div>{isLoading ? <div className="text-sm text-neutral-700">Loading recently added properties…</div> : data?.data?.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-3">{data.data.map((property: Property) => <RecentCard key={property._id} property={property} />)}</div> : <div className="rounded-lg border border-dashed border-[#E2E8F0] p-10 text-center"><p className="font-display text-lg">No approved rentals are available right now.</p><p className="mt-2 text-sm text-neutral-700">Please check back soon or explore all rental listings.</p><Link className="btn-primary mt-5" to="/properties">Explore Rentals</Link></div>}</section>

    {/* How BookMySpace Works Section with Animations & Vector Icons */}
    <section id="how-it-works" className="border-t border-[#E2E8F0] bg-gradient-to-b from-[#eef2ff] to-[#F8FAFC] py-16 md:py-24 relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="max-w-xl">
          <p className="mono text-[11px] font-semibold uppercase tracking-[.14em] text-primary">
            How BookMySpace works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl font-display">
            From property submission to tenant enquiry.
          </h2>
          <p className="mt-3 text-sm text-neutral-700">
            A seamless 4-step process built to ensure quality, trust, and speed for owners and tenants alike.
          </p>
        </div>

        {/* Step Flow Grid with Framer Motion Stagger & Vector Graphics */}
        <div className="mt-12 grid gap-6 md:grid-cols-4 relative">
          {howItWorksSteps.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              whileHover={{ y: -6 }}
              className="group relative flex flex-col justify-between rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="w-9 h-9 rounded-full bg-primary text-white font-mono text-xs font-bold flex items-center justify-center shadow-md group-hover:bg-accent transition-colors">
                  {step.number}
                </span>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] group-hover:bg-primary/10 transition-colors">
                  {step.icon}
                </div>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-neutral-900 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-700">
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Bottom Call to Action Banner */}
    <section className="bg-primary"><div className="container-custom flex flex-col justify-between gap-6 py-12 text-white md:flex-row md:items-center"><div><p className="mono text-[11px] uppercase tracking-[.14em] text-white/70">Looking for a rental property?</p><h2 className="mt-2 text-3xl font-semibold">Browse verified listings across multiple categories.</h2></div><Link className="btn-accent shrink-0" to="/properties">Explore Rentals</Link></div></section>
  </>;
}
