import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { propertyApi } from '../../api/endpoints';
import { Card, LoadingSpinner } from '../../components/ui';
import type { Property } from '../../types';

const cubicBezier = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: cubicBezier },
};

const stagger = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.4, ease: cubicBezier },
};

function HeroSection() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    navigate(`/properties${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ''}`);
  };

  const handleTrendingClick = (term: string) => {
    navigate(`/properties?keyword=${encodeURIComponent(term)}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-24 md:py-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&h=1080&q=80" 
          alt="Luxury living background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-[2px]" />
      </div>

      <div className="container-custom relative z-10 mx-auto w-full">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-xs font-semibold tracking-widest uppercase mb-8 backdrop-blur-md">
            COLLECTION 2026
          </span>
          
          <h1 className="font-display text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight text-balance">
            Find your next sanctuary.
          </h1>
          
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed text-balance">
            Exquisite residences for the modern nomad, curated for absolute comfort and reliability.
          </p>

          {/* Recrafted Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6 bg-white/10 border border-white/20 p-2 rounded-2xl backdrop-blur-md flex items-center shadow-2xl">
            <div className="relative flex-1 flex items-center pl-4">
              <svg className="w-5 h-5 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Where would you like to escape to?"
                className="w-full bg-transparent border-none text-white placeholder-white/50 text-sm focus:outline-none pl-3 pr-4 py-3"
              />
            </div>
            
            {/* Shortcut hint */}
            <div className="hidden sm:flex items-center gap-1 bg-white/10 border border-white/10 px-2 py-1 rounded-lg text-[10px] font-bold text-white/60 mr-2 select-none">
              <span>⌘</span>
              <span>K</span>
            </div>

            <button type="submit" className="bg-primary hover:bg-primary-light text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0">
              Search
            </button>
          </form>

          {/* Trending suggestions */}
          <div className="text-xs md:text-sm text-white/60">
            <span className="font-semibold text-white/80">Trending: </span>
            {['Mayfair, UK', 'Chelsea Penthouses', 'Notting Hill Mews'].map((term, i) => (
              <span key={term}>
                {i > 0 && <span className="mx-2 text-white/30">|</span>}
                <button 
                  type="button" 
                  onClick={() => handleTrendingClick(term.split(',')[0])} 
                  className="hover:text-white transition-colors underline decoration-white/20 hover:decoration-white underline-offset-4"
                >
                  {term}
                </button>
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Downward Arrow Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 animate-bounce cursor-pointer select-none">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

function CuratedLocalities() {
  const navigate = useNavigate();

  const handleLocalityClick = (keyword: string) => {
    navigate(`/properties?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <section className="py-24 bg-surface">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-3xl font-bold text-neutral-900 mb-2">Curated Localities</h2>
            <p className="text-neutral-700/60 max-w-xl">
              Explore the most sought-after neighborhoods with real-time pricing trends and expert insights.
            </p>
          </div>
          <Link to="/properties" className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1.5 mt-4 md:mt-0 transition-colors">
            Explore All Districts
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Kensington & Chelsea */}
          <div 
            onClick={() => handleLocalityClick('Kensington')}
            className="md:col-span-7 relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <img 
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" 
              alt="Kensington & Chelsea" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            <div className="absolute top-6 left-6">
              <span className="bg-primary/20 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                PREMIUM SELECTION
              </span>
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-white">
              <div>
                <h3 className="font-display text-2xl font-bold mb-1">Kensington & Chelsea</h3>
                <p className="text-white/70 text-sm">The pinnacle of London elegance.</p>
              </div>
              <div className="text-right shrink-0">
                <span className="block font-display text-xl font-bold">₹4,50,000<span className="text-xs font-normal">/mo avg</span></span>
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  +12% YoY
                </span>
              </div>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Card 2: Shoreditch Hub */}
            <div 
              onClick={() => handleLocalityClick('Shoreditch')}
              className="relative h-[188px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              <img 
                src="https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80" 
                alt="Shoreditch Hub" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                <div>
                  <h3 className="font-display text-xl font-bold">Shoreditch Hub</h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="block font-display text-base font-bold">₹3,10,000<span className="text-xs font-normal">/mo avg</span></span>
                  <span className="text-[10px] font-semibold text-emerald-400">+8% growth</span>
                </div>
              </div>
            </div>

            {/* Bottom Two Cards row */}
            <div className="grid grid-cols-2 gap-6 flex-1">
              {/* Card 3: Hampstead */}
              <div 
                onClick={() => handleLocalityClick('Hampstead')}
                className="relative h-[188px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <img 
                  src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=600&q=80" 
                  alt="Hampstead" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-display text-lg font-bold mb-0.5">Hampstead</h3>
                  <p className="text-white/70 text-xs">Village serenity</p>
                </div>
              </div>

              {/* Card 4: Greenwich */}
              <div 
                onClick={() => handleLocalityClick('Greenwich')}
                className="relative h-[188px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <img 
                  src="https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=600&q=80" 
                  alt="Greenwich" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/5" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-display text-lg font-bold mb-0.5">Greenwich</h3>
                  <p className="text-white/70 text-xs">Riverside luxury</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedSanctuaries() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: () => propertyApi.list({ status: 'published', limit: '3', sort: 'latest' }),
  });

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      toast.success(updated[id] ? 'Added to favorites!' : 'Removed from favorites');
      return updated;
    });
  };

  return (
    <section className="py-24 bg-surface/50 border-t border-neutral-900/5">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-3">Featured Sanctuaries</h2>
          <p className="text-neutral-700/60 max-w-xl mx-auto">
            Our highest-rated properties, hand-picked and verified for excellence.
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner className="py-16" />
        ) : !data?.data?.length ? (
          <div className="text-center py-16 text-neutral-700 bg-neutral/30 rounded-2xl border border-neutral-900/5">
            <p className="text-lg">No sanctuaries available yet.</p>
            <p className="text-sm mt-1">Check back soon or browse all listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.data.slice(0, 3).map((property: Property, i: number) => {
              const rating = (4.7 + (i * 0.15) % 0.3).toFixed(1);
              return (
                <motion.div 
                  key={property._id} 
                  {...stagger} 
                  transition={{ ...stagger.transition, delay: i * 0.1 }}
                >
                  <Link to={`/properties/${property._id}`} className="block group">
                    <Card hover className="h-full overflow-hidden rounded-[2rem] bg-white border border-neutral-900/5">
                      {/* Image container */}
                      <div className="relative h-64 bg-neutral overflow-hidden">
                        {property.images?.[0]?.url ? (
                          <img
                            src={property.images[0].url}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-16 h-16 text-neutral-900/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
                        
                        {/* Verified badge */}
                        <div className="absolute top-4 left-4">
                          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-black text-emerald-600 tracking-wider shadow-sm select-none">
                            <svg className="w-3.5 h-3.5 text-emerald-500 fill-current" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            VERIFIED
                          </span>
                        </div>

                        {/* Favorite heart button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(property._id, e)}
                          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-sm transition-all hover:scale-110 duration-200"
                        >
                          <svg 
                            className={`w-4 h-4 transition-colors ${favorites[property._id] ? 'text-rose-500 fill-rose-500' : 'text-neutral-500 hover:text-rose-500'}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      {/* Content details */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3 gap-2">
                          <h3 className="font-display text-base font-bold text-neutral-900 group-hover:text-primary transition-colors truncate">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-1 shrink-0 bg-primary/5 px-2 py-1 rounded-lg text-primary text-xs font-black">
                            <span>★</span>
                            <span>{rating}</span>
                          </div>
                        </div>

                        <p className="text-neutral-700/60 text-xs mb-4">
                          {property.location.address ? `${property.location.address}, ` : ''}{property.location.city}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-neutral-700 border-t border-neutral-900/5 pt-4 mb-5">
                          {property.bedrooms > 0 && (
                            <span className="flex items-center gap-1.5 font-medium">
                              <svg className="w-4 h-4 text-neutral-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                              <span>{property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}</span>
                            </span>
                          )}
                          {property.bathrooms > 0 && (
                            <span className="flex items-center gap-1.5 font-medium">
                              <svg className="w-4 h-4 text-neutral-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}</span>
                            </span>
                          )}
                          <span className="flex items-center gap-1.5 font-medium">
                            <svg className="w-4 h-4 text-neutral-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            <span>{property.area} sqft</span>
                          </span>
                        </div>

                        {/* Price & view details button */}
                        <div className="flex items-center justify-between border-t border-neutral-900/5 pt-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-neutral-900">₹{property.price.toLocaleString()}</span>
                            <span className="text-neutral-700/60 text-xs">/month</span>
                          </div>
                          <span className="text-xs font-bold text-primary bg-primary/5 px-4 py-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all select-none">
                            View Details
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="container-custom">
        <motion.div 
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 text-white p-10 md:p-16 text-center shadow-2xl"
          {...fadeUp}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(165,180,252,0.15),transparent_50%)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
              Ready to list your sanctuary?
            </h2>
            <p className="text-white/80 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join our community of premium property owners and earn 25% more than other platforms with our curated guest matching and bespoke management services.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <button className="bg-white hover:bg-white/95 text-indigo-950 font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Get Started Now
                </button>
              </Link>
              <a href="mailto:consultation@luxebnb.com?subject=Bespoke%20Consultation">
                <button className="border border-white/30 hover:border-white/50 hover:bg-white/5 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Schedule a Consultation
                </button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <CuratedLocalities />
      <FeaturedSanctuaries />
      <CtaSection />
    </div>
  );
}
