import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { propertyApi, propertyCategories } from '../../api/endpoints';
import { Button, Card } from '../../components/ui';
import { LoadingSpinner } from '../../components/ui';
import { toEmbedUrl } from '../../utils/video';
import type { Property } from '../../types';

export default function PropertyDetails() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner className="py-32" />;
  if (!data?.data?.property) return (
    <div className="container-custom py-20 text-center">
      <h2 className="font-display text-2xl font-bold text-primary mb-2">Property not found</h2>
      <p className="text-neutral-700 mb-6">The property you're looking for doesn't exist or has been removed.</p>
      <Link to="/properties"><Button variant="primary">Browse properties</Button></Link>
    </div>
  );

  const property = data.data.property;
  const categoryLabel = propertyCategories.find((c) => c.value === property.propertyType)?.label || property.propertyType;

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative rounded-2xl overflow-hidden bg-neutral h-[350px] md:h-[480px]">
              {property.images?.[selectedImage]?.url ? (
                <img src={property.images[selectedImage].url} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-neutral-900/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-thin">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === selectedImage ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-neutral-900/20'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xs font-medium text-neutral-700/60 uppercase tracking-wider">{categoryLabel}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-900/10" />
                    <span className="text-xs text-neutral-700/60">{property.location.city}{property.location.state ? `, ${property.location.state}` : ''}</span>
                  </div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-primary leading-tight">{property.title}</h1>
                  <p className="text-sm text-neutral-700 mt-1">
                    {property.location.address}{property.location.zipCode ? ` — ${property.location.zipCode}` : ''}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="font-display text-3xl md:text-4xl font-bold text-accent">
                    <span className="text-lg text-neutral-700 font-sans">₹</span>
                    {property.maxPrice
                      ? `${property.price.toLocaleString()} - ${property.maxPrice.toLocaleString()}`
                      : property.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-neutral-700/60">per month</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 py-5 border-y border-neutral-900/5 mb-6">
                {property.bedrooms > 0 && (
                  <div className="text-center">
                    <p className="font-display text-2xl font-bold text-primary">{property.bedrooms}</p>
                    <p className="text-xs text-neutral-700/60 mt-0.5">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="text-center">
                    <p className="font-display text-2xl font-bold text-primary">{property.bathrooms}</p>
                    <p className="text-xs text-neutral-700/60 mt-0.5">Bathrooms</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-primary">
                    {property.maxArea ? `${property.area} - ${property.maxArea}` : property.area}
                  </p>
                  <p className="text-xs text-neutral-700/60 mt-0.5">{property.areaUnit}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="font-display text-lg font-bold text-primary mb-3">About this property</h2>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-display text-lg font-bold text-primary mb-3">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity: string) => (
                      <span key={amenity} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary rounded-lg text-sm font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {property.videoUrl && (
                <div className="mb-6">
                  <h2 className="font-display text-lg font-bold text-primary mb-3">Video tour</h2>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-neutral">
                    <iframe src={toEmbedUrl(property.videoUrl)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Property video" />
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {property.location.coordinates?.lat && property.location.coordinates?.lng && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6">
                <h2 className="font-display text-lg font-bold text-primary mb-4">Location</h2>
                <div className="h-[280px] rounded-2xl overflow-hidden [&_.leaflet-container]:rounded-[inherit]">
                  <MapContainer
                    center={[property.location.coordinates.lat, property.location.coordinates.lng]}
                    zoom={14}
                    className="h-full w-full"
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[property.location.coordinates.lat, property.location.coordinates.lng]}>
                      <Popup>{property.title}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-neutral-900/5">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  {property.owner?.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <p className="font-display font-bold text-primary">{property.owner?.name || 'Property Owner'}</p>
                  <p className="text-sm text-neutral-700/60">{property.owner?.email}</p>
                </div>
              </div>
              <h2 className="font-display text-lg font-bold text-primary mb-4">Contact owner</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const data = new FormData(form);
                  const subject = encodeURIComponent(`Inquiry about ${property.title}`);
                  const body = encodeURIComponent(
                    `Hi ${property.owner?.name},\n\n${data.get('message')}\n\n- ${data.get('name')} (${data.get('email')})`
                  );
                  window.location.href = `mailto:${property.owner?.email}?subject=${subject}&body=${body}`;
                }}
                className="space-y-3"
              >
                <input name="name" placeholder="Your name" required className="input-field" />
                <input name="email" type="email" placeholder="Your email" required className="input-field" />
                <textarea name="message" placeholder="Hi, I'm interested in this property..." rows={4} required className="input-field resize-none" />
                <Button type="submit" className="w-full">Send message</Button>
              </form>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <h2 className="font-display text-lg font-bold text-primary mb-4">Share</h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(window.location.href); }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Copy link
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <h2 className="font-display text-lg font-bold text-primary mb-2">List your property</h2>
              <p className="text-sm text-neutral-700 mb-4">Reach quality tenants. List your rental on Rentalisting today.</p>
              <Link to="/register">
                <Button variant="outline" size="sm" className="w-full">Get started</Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
