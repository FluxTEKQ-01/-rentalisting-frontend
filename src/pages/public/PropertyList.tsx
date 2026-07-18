import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { propertyApi, propertyCategories } from '../../api/endpoints';
import { Card, SearchBar, Select, Button, LoadingSpinner, EmptyState, Pagination } from '../../components/ui';
import type { Property } from '../../types';

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_low', label: 'Lowest price' },
  { value: 'price_high', label: 'Highest price' },
];

interface Filters {
  keyword: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  sort: string;
}

export default function PropertyList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    keyword: searchParams.get('keyword') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    sort: searchParams.get('sort') || 'latest',
  });

  const page = parseInt(searchParams.get('page') || '1', 10);

  const queryParams: Record<string, string | undefined> = {
    page: String(page),
    limit: '12',
    sort: filters.sort,
    status: 'published',
  };
  if (filters.keyword) queryParams.keyword = filters.keyword;
  if (filters.propertyType) queryParams.propertyType = filters.propertyType;
  if (filters.minPrice) queryParams.minPrice = filters.minPrice;
  if (filters.maxPrice) queryParams.maxPrice = filters.maxPrice;
  if (filters.bedrooms) queryParams.bedrooms = filters.bedrooms;
  if (filters.bathrooms) queryParams.bathrooms = filters.bathrooms;

  const queryKey = ['properties', JSON.stringify(queryParams)];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => propertyApi.list(queryParams),
  });

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSearchParams((prev) => {
      if (value) prev.set(key, value);
      else prev.delete(key);
      prev.set('page', '1');
      return prev;
    });
  };

  const clearFilters = () => {
    setFilters({ keyword: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', sort: 'latest' });
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '' && v !== 'latest');

  return (
    <div className="container-custom py-10 md:py-14">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary">Properties</h1>
        <p className="text-neutral-700 mt-1">Browse available rental properties</p>
      </motion.div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={filters.keyword}
              onChange={(v) => updateFilter('keyword', v)}
              placeholder="Search by location, type, or keyword…"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-44">
              <Select
                options={sortOptions}
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
              />
            </div>
            <Button
              variant={hasActiveFilters ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-accent" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card p-5 space-y-5 sticky top-20">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-primary">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-neutral-700 hover:text-primary underline">Clear</button>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700/70 uppercase tracking-wider block mb-1.5">Property type</label>
                <Select
                  options={[{ value: '', label: 'All types' }, ...propertyCategories]}
                  value={filters.propertyType}
                  onChange={(e) => updateFilter('propertyType', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700/70 uppercase tracking-wider block mb-1.5">Min price</label>
                  <input type="number" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} placeholder="₹0" className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700/70 uppercase tracking-wider block mb-1.5">Max price</label>
                  <input type="number" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} placeholder="₹99,999" className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700/70 uppercase tracking-wider block mb-1.5">Bedrooms</label>
                  <Select options={[{ value: '', label: 'Any' }, { value: '1', label: '1+' }, { value: '2', label: '2+' }, { value: '3', label: '3+' }, { value: '4', label: '4+' }, { value: '5', label: '5+' }]} value={filters.bedrooms} onChange={(e) => updateFilter('bedrooms', e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700/70 uppercase tracking-wider block mb-1.5">Bathrooms</label>
                  <Select options={[{ value: '', label: 'Any' }, { value: '1', label: '1+' }, { value: '2', label: '2+' }, { value: '3', label: '3+' }]} value={filters.bathrooms} onChange={(e) => updateFilter('bathrooms', e.target.value)} />
                </div>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="w-full" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          </motion.div>
        </aside>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <LoadingSpinner className="py-20" />
          ) : !data?.data?.length ? (
            <EmptyState
              title="No properties found"
              description="Try adjusting your search or filter criteria."
              action={{ label: 'Clear filters', onClick: clearFilters }}
            />
          ) : (
            <>
              <div className="text-sm text-neutral-700/60 mb-5">
                <span className="font-medium text-neutral-900">{data.pagination.total}</span> {data.pagination.total === 1 ? 'property' : 'properties'} found
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {data.data.map((property: Property, i: number) => (
                  <motion.div
                    key={property._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <Link to={`/properties/${property._id}`} className="block group">
                      <Card hover className="h-full overflow-hidden">
                        <div className="relative h-48 bg-neutral overflow-hidden">
                          {property.images?.[0]?.url ? (
                            <img src={property.images[0].url} alt={property.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-14 h-14 text-neutral-900/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm text-primary px-3 py-1.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-1">
                            <span className="text-[10px] text-neutral-700 font-medium">₹</span>
                            <span className="font-display">{property.maxPrice ? `${property.price.toLocaleString()} - ${property.maxPrice.toLocaleString()}` : property.price.toLocaleString()}</span>
                            <span className="text-[10px] text-neutral-700 font-medium">/mo</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-medium text-neutral-700/60 uppercase tracking-wider">{property.propertyType}</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-900/10" />
                            <span className="text-[11px] text-neutral-700/60">{property.location.city}</span>
                          </div>
                          <h3 className="font-display text-lg font-bold text-primary leading-snug mb-3 group-hover:text-primary-light transition-colors">{property.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-neutral-700 border-t border-neutral-900/5 pt-3">
                            {property.bedrooms > 0 && (
                              <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-neutral-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                                <span>{property.bedrooms}</span>
                              </span>
                            )}
                            {property.bathrooms > 0 && (
                              <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-neutral-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span>{property.bathrooms}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4 h-4 text-neutral-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                              <span>{property.maxArea ? `${property.area} - ${property.maxArea}` : property.area} {property.areaUnit}</span>
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Pagination
                page={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={(p) => setSearchParams((prev) => { prev.set('page', String(p)); return prev; })}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
