import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../../api/endpoints';
import { getSeoDataBySlug, CATEGORY_SEO_DATA, CategorySeoInfo } from '../../config/categorySeoData';
import CategoryHighlightIcon from '../../components/common/CategoryHighlightIcon';
import { PropertyCategory } from '../../types';
import SeoHead from '../../components/seo/SeoHead';
import JsonLdSchema from '../../components/seo/JsonLdSchema';
import HeroBackgroundSlider from '../../components/common/HeroBackgroundSlider';

interface CategorySEOPageProps {
  defaultCategory?: PropertyCategory;
}

export default function CategorySEOPage({ defaultCategory }: CategorySEOPageProps) {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // Determine current category info
  const slugToUse = categorySlug || (defaultCategory ? Object.values(CATEGORY_SEO_DATA).find(c => c.categoryValue === defaultCategory)?.slug : 'apartments') || 'apartments';
  const categoryInfo: CategorySeoInfo = getSeoDataBySlug(slugToUse) || CATEGORY_SEO_DATA['apartments'];

  // Filter state
  const [cityFilter, setCityFilter] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Fetch properties belonging to this category
  const { data: propertiesResponse, isLoading, isError } = useQuery({
    queryKey: ['categoryProperties', categoryInfo.categoryValue, cityFilter],
    queryFn: () => propertyApi.list({
      propertyType: categoryInfo.categoryValue,
      city: cityFilter || undefined,
      status: 'approved',
    }),
  });

  const properties = propertiesResponse?.data || [];

  // Combine real listing images with curated category fallback photography
  const listingImages = properties
    .map((p) => (p.images && p.images.length > 0 ? p.images[0].url : ''))
    .filter(Boolean);
  const heroImagesToUse =
    listingImages.length > 0
      ? Array.from(new Set([...listingImages, ...(categoryInfo.heroImages || [])]))
      : categoryInfo.heroImages || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Dynamic SEO Head Tags */}
      <SeoHead
        title={categoryInfo.metaTitle}
        description={categoryInfo.metaDescription}
        keywords={categoryInfo.keywords}
        canonicalUrl={window.location.origin + (categorySlug ? `/category/${categoryInfo.slug}` : window.location.pathname)}
      />

      {/* JSON-LD Structured Data Schema */}
      <JsonLdSchema
        categoryTitle={categoryInfo.title}
        categoryUrl={`/category/${categoryInfo.slug}`}
        faqs={categoryInfo.faqs}
        properties={properties}
      />

      {/* Hero Banner Section with Sliding Background Imagery */}
      <section className="relative min-h-[480px] overflow-hidden py-16 text-white md:py-24 flex items-center">
        <HeroBackgroundSlider images={heroImagesToUse} />

        <div className="container-custom relative z-20 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Trail */}
          <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-white/70">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-white transition-colors">Explore</Link>
            <span>/</span>
            <span className="text-white font-semibold">{categoryInfo.title}</span>
          </nav>

          <div className="max-w-3xl rounded-3xl bg-slate-950/45 p-6 sm:p-10 backdrop-blur-md border border-white/15 shadow-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#F58220] backdrop-blur-md border border-white/20">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              {categoryInfo.heroBadge}
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white drop-shadow-md">
              {categoryInfo.h1Title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl font-normal">
              {categoryInfo.heroSubtitle}
            </p>

            {/* Quick Location Filter Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <input
                  type="text"
                  placeholder="Filter by city (e.g. Hyderabad, Mumbai, Bangalore)..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full rounded-xl bg-white/15 px-4 py-3 text-sm text-white placeholder-white/60 border border-white/25 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-md transition-all"
                />
                {cityFilter && (
                  <button
                    onClick={() => setCityFilter('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xs bg-white/20 rounded-full px-2 py-0.5"
                  >
                    Clear
                  </button>
                )}
              </div>
              <span className="text-xs text-white/80 font-medium">
                Showing verified listings for <strong className="text-white">{categoryInfo.title}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Overview & Key Highlights Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {categoryInfo.overviewHeading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              {categoryInfo.overviewDescription}
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryInfo.highlights.map((item, idx) => (
              <div
                key={idx}
                className="group flex flex-col justify-start rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all duration-300 hover:shadow-md hover:border-slate-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F4C81]/10 text-[#0F4C81] transition-colors group-hover:bg-[#0F4C81] group-hover:text-white">
                  <CategoryHighlightIcon iconId={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid Section */}
      <section className="py-14 container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Verified {categoryInfo.title} Listings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Direct owner properties reviewed manually by BookMySpace
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {properties.length} Available Property{properties.length !== 1 ? 'ies' : ''}
          </span>
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse rounded-2xl bg-white p-4 border border-slate-200">
                <div className="h-48 w-full rounded-xl bg-slate-200"></div>
                <div className="mt-4 h-5 w-3/4 rounded bg-slate-200"></div>
                <div className="mt-2 h-4 w-1/2 rounded bg-slate-200"></div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600 border border-red-200">
            Unable to load property listings. Please try refreshing the page.
          </div>
        )}

        {!isLoading && !isError && properties.length === 0 && (
          <div className="rounded-2xl bg-white border border-slate-200/80 p-12 text-center max-w-xl mx-auto my-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No properties currently listed in this category</h3>
            <p className="mt-2 text-sm text-slate-500">
              Be the first to list a property under {categoryInfo.title} or explore all available rentals across other categories.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/properties" className="btn-primary text-sm px-5 py-2.5 rounded-xl">
                Explore All Rentals
              </Link>
              <Link to="/register" className="btn-outline text-sm px-5 py-2.5 rounded-xl">
                List Property
              </Link>
            </div>
          </div>
        )}

        {!isLoading && properties.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div key={property._id} className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0].url}
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                      <span>No image available</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-slate-900/75 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
                    ₹{property.price.toLocaleString('en-IN')}{property.maxPrice ? ` - ₹${property.maxPrice.toLocaleString('en-IN')}` : ''} / month
                  </span>
                  <span className="absolute top-3 right-3 rounded-full bg-emerald-500 text-white px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase shadow-sm">
                    Verified
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-medium text-[#0F4C81] uppercase tracking-wider">
                      {categoryInfo.title}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-slate-900 line-clamp-1 group-hover:text-[#0F4C81] transition-colors">
                      {property.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 flex items-center gap-1 line-clamp-1">
                      <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {property.location.address}, {property.location.city}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-600 border-t border-slate-100 pt-3">
                      {property.bedrooms > 0 && <span>{property.bedrooms} Beds</span>}
                      {property.bathrooms > 0 && <span>{property.bathrooms} Baths</span>}
                      {property.area > 0 && <span>{property.area} {property.areaUnit || 'sq ft'}</span>}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Owner Verified</span>
                    <Link
                      to={`/properties/${property._id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F4C81] hover:text-[#0A2540] transition-colors"
                    >
                      View Details
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Category Frequently Asked Questions (FAQ) Section */}
      {categoryInfo.faqs && categoryInfo.faqs.length > 0 && (
        <section className="py-14 bg-white border-t border-slate-200">
          <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">Got Questions?</span>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                Frequently Asked Questions ({categoryInfo.title})
              </h2>
            </div>

            <div className="space-y-4">
              {categoryInfo.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-slate-900 hover:text-[#0F4C81] transition-colors"
                    >
                      <span>{faq.question}</span>
                      <svg
                        className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0F4C81]' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related Categories SEO Interlinking Footer */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">
            Explore Other Property Categories
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {Object.values(CATEGORY_SEO_DATA).map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  cat.slug === categoryInfo.slug
                    ? 'bg-[#F58220] text-white font-bold'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
