import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

function MapAutoRecenter({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords[0] && coords[1]) {
      map.setView(coords, 14, { animate: true });
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }
  }, [coords, map]);
  return null;
}
import { motion } from 'framer-motion';
import { propertyApi, reviewApi, commentApi, propertyCategories, hasAmenities } from '../../api/endpoints';
import { useAuth } from '../../store/authContext';
import { Button, Card } from '../../components/ui';
import { LoadingSpinner } from '../../components/ui';
import { toEmbedUrl } from '../../utils/video';
import type { Property } from '../../types';
import SeoHead from '../../components/seo/SeoHead';
import toast from 'react-hot-toast';

import L from 'leaflet';

// Fix Leaflet marker icon paths in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const maskEmail = (email?: string) => {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  return parts[0][0] + '***@' + parts[1];
};

const CITY_COORDINATES: Record<string, [number, number]> = {
  hyderabad: [17.3850, 78.4867],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  mumbai: [19.0760, 72.8777],
  delhi: [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  chennai: [13.0827, 80.2707],
  pune: [18.5204, 73.8567],
  kolkata: [22.5726, 88.3639],
  gurgaon: [28.4595, 77.0266],
  gurugram: [28.4595, 77.0266],
  noida: [28.5355, 77.3910],
  ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873],
  kochi: [9.9312, 76.2673],
  cochin: [9.9312, 76.2673],
  goa: [15.2993, 74.1240],
  chandigarh: [30.7333, 76.7794],
  indore: [22.7196, 75.8577],
  lucknow: [26.8467, 80.9462],
  visakhapatnam: [17.6868, 83.2185],
  vizag: [17.6868, 83.2185],
  vijayawada: [16.5062, 80.6480],
  coimbatore: [11.0168, 76.9558],
  mysore: [12.2958, 76.6394],
  mysuru: [12.2958, 76.6394],
};

const PINCODE_AND_LOCALITY_COORDINATES: Record<string, [number, number]> = {
  // Pincodes
  '560066': [12.9698, 77.7499], // Whitefield
  '560038': [12.9784, 77.6408], // Indiranagar
  '560034': [12.9352, 77.6245], // Koramangala
  '560102': [12.9121, 77.6446], // HSR Layout
  '560037': [12.9592, 77.6974], // Marathahalli
  '560103': [12.9304, 77.6784], // Bellandur
  '560100': [12.8452, 77.6602], // Electronic City
  '560041': [12.9250, 77.5938], // Jayanagar
  '560078': [12.9077, 77.5854], // JP Nagar
  '500032': [17.4401, 78.3489], // Gachibowli
  '500081': [17.4483, 78.3915], // Madhapur
  '500033': [17.4319, 78.4071], // Jubilee Hills
  '500034': [17.4156, 78.4411], // Banjara Hills
  '400050': [19.0596, 72.8295], // Bandra
  '400053': [19.1363, 72.8277], // Andheri
  '400076': [19.1176, 72.9060], // Powai
  '122002': [28.4735, 77.0863], // Gurgaon
  '201301': [28.5708, 77.3260], // Noida
  // Localities
  whitefield: [12.9698, 77.7499],
  indiranagar: [12.9784, 77.6408],
  koramangala: [12.9352, 77.6245],
  'hsr layout': [12.9121, 77.6446],
  hsr: [12.9121, 77.6446],
  marathahalli: [12.9592, 77.6974],
  bellandur: [12.9304, 77.6784],
  'electronic city': [12.8452, 77.6602],
  jayanagar: [12.9250, 77.5938],
  gachibowli: [17.4401, 78.3489],
  madhapur: [17.4483, 78.3915],
  'jubilee hills': [17.4319, 78.4071],
  'banjara hills': [17.4156, 78.4411],
  bandra: [19.0596, 72.8295],
  andheri: [19.1363, 72.8277],
  powai: [19.1176, 72.9060],
};

function getPropertyCoordinates(property: Property, liveGeoCoords: [number, number] | null): [number, number] {
  if (liveGeoCoords) return liveGeoCoords;

  if (property.location?.coordinates?.lat && property.location?.coordinates?.lng) {
    const lat = Number(property.location.coordinates.lat);
    const lng = Number(property.location.coordinates.lng);
    if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
      return [lat, lng];
    }
  }

  const fullText = [
    property.location?.address,
    property.location?.city,
    property.location?.state,
    property.location?.zipCode,
  ].filter(Boolean).join(' ').toLowerCase();

  for (const [key, coords] of Object.entries(PINCODE_AND_LOCALITY_COORDINATES)) {
    if (fullText.includes(key)) {
      return coords;
    }
  }

  const cityKey = (property.location?.city || '').toLowerCase().trim();
  if (CITY_COORDINATES[cityKey]) {
    return CITY_COORDINATES[cityKey];
  }
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (cityKey.includes(key) || key.includes(cityKey)) {
      return coords;
    }
  }

  return [17.3850, 78.4867];
}

export default function PropertyDetails() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [geoCoords, setGeoCoords] = useState<[number, number] | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getById(id!),
    enabled: !!id,
  });

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Review Form & Admin Control States
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newReviewerName, setNewReviewerName] = useState(user?.name || '');
  const [submittingReview, setSubmittingReview] = useState(false);

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editReviewerName, setEditReviewerName] = useState('');
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const { data: reviewsResponse, refetch: refetchReviews } = useQuery({
    queryKey: ['propertyReviews', id],
    queryFn: () => reviewApi.list(id!),
    enabled: !!id,
  });

  const reviewsList: any[] = reviewsResponse?.data?.reviews || (Array.isArray(reviewsResponse?.data) ? reviewsResponse.data : []);
  const totalReviewsCount = reviewsList.length;
  const avgRating = totalReviewsCount > 0
    ? (reviewsList.reduce((acc: number, r: any) => acc + (Number(r.rating) || 5), 0) / totalReviewsCount).toFixed(1)
    : '5.0';

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter your review feedback');
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewApi.create(id!, {
        rating: newRating,
        comment: newComment.trim(),
        userName: newReviewerName.trim() || user?.name || 'Verified Visitor',
      });
      toast.success('Review submitted successfully!');
      setNewComment('');
      setShowReviewForm(false);
      refetchReviews();
    } catch {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleStartEditReview = (rev: any) => {
    setEditingReviewId(rev._id);
    setEditRating(rev.rating || 5);
    setEditComment(rev.comment || '');
    setEditReviewerName(rev.userName || rev.user?.name || 'Verified Visitor');
  };

  const handleSaveEditReview = async (reviewId: string) => {
    if (!editComment.trim()) {
      toast.error('Review comment cannot be empty');
      return;
    }
    try {
      await reviewApi.update(reviewId, {
        rating: editRating,
        comment: editComment.trim(),
        userName: editReviewerName.trim(),
      });
      toast.success('Review updated successfully!');
      setEditingReviewId(null);
      refetchReviews();
    } catch {
      toast.error('Failed to update review.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewApi.delete(reviewId);
      toast.success('Review deleted successfully');
      setDeletingReviewId(null);
      refetchReviews();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const [commentForm, setCommentForm] = useState({ name: '', email: '', address: '', comment: '' });
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.email.trim() || !commentForm.comment.trim()) {
      toast.error('Please fill in name, email, and comment');
      return;
    }
    setCommentSubmitting(true);
    try {
      await commentApi.create(id!, commentForm);
      toast.success('Comment posted successfully!');
      setCommentForm({ name: '', email: '', address: '', comment: '' });
    } catch {
      toast.error('Failed to post comment. Please try again.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  const propertyData = data?.data?.property;

  useEffect(() => {
    if (!propertyData?.location) return;

    if (propertyData.location.coordinates?.lat && propertyData.location.coordinates?.lng) {
      const lat = Number(propertyData.location.coordinates.lat);
      const lng = Number(propertyData.location.coordinates.lng);
      if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
        setGeoCoords([lat, lng]);
        return;
      }
    }

    let isMounted = true;
    const controller = new AbortController();

    const addressClean = (propertyData.location.address || '').replace(/[-—–#]/g, ' ').replace(/\s+/g, ' ').trim();
    const cityClean = (propertyData.location.city || '').trim();
    const zipClean = (propertyData.location.zipCode || '').trim();
    const stateClean = (propertyData.location.state || '').trim();

    // Multi-tier queries from specific to broad to ensure pincodes and addresses match
    const queryTiers = [
      [addressClean, cityClean, zipClean, 'India'].filter(Boolean).join(', '),
      [addressClean, cityClean, 'India'].filter(Boolean).join(', '),
      [zipClean, cityClean, 'India'].filter(Boolean).join(', '),
      [zipClean, 'India'].filter(Boolean).join(', '),
      [cityClean, stateClean, 'India'].filter(Boolean).join(', '),
    ].filter((q) => q.length > 3);

    const tryGeocode = async () => {
      for (const query of queryTiers) {
        if (!isMounted) break;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`, {
            signal: controller.signal,
            headers: { 'Accept-Language': 'en' },
          });
          const results = await res.json();
          if (isMounted && Array.isArray(results) && results.length > 0) {
            const lat = parseFloat(results[0].lat);
            const lon = parseFloat(results[0].lon);
            if (!isNaN(lat) && !isNaN(lon)) {
              setGeoCoords([lat, lon]);
              return;
            }
          }
        } catch {
          // Continue to next tier fallback
        }
      }
    };

    tryGeocode();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [propertyData]);

  if (isLoading) return (
    <>
      <SeoHead
        title="Loading property details..."
        description="Loading property details on BookMySpace"
      />
      <LoadingSpinner className="py-32" />
    </>
  );
  if (error) return (
    <>
      <SeoHead title="Error loading property" description="Failed to load property details on BookMySpace" />
      <div className="container-custom py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-primary mb-2">Error loading property</h2>
        <p className="text-neutral-700 mb-6">Unable to load property details. Please try again later.</p>
        <Link to="/properties"><Button variant="primary">Browse properties</Button></Link>
      </div>
    </>
  );
  if (!data?.data?.property) return (
    <>
      <SeoHead title="Property not found" description="The requested property could not be found on BookMySpace" />
      <div className="container-custom py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-primary mb-2">Property not found</h2>
        <p className="text-neutral-700 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/properties"><Button variant="primary">Browse properties</Button></Link>
      </div>
    </>
  );

  const property = data.data.property;
  const categoryLabel = propertyCategories.find((c) => c.value === property.propertyType)?.label || property.propertyType;
  const coords = getPropertyCoordinates(property, geoCoords);

  return (
    <div className="container-custom py-8 md:py-12">
      <SeoHead
        title={`${property.title} - ${categoryLabel} in ${property.location.city}`}
        description={`${property.description.slice(0, 160)}... Rental price: ₹${property.price.toLocaleString('en-IN')}/mo in ${property.location.city}.`}
        keywords={[property.title, categoryLabel, property.location.city, `${property.propertyType} for rent`, `${property.location.city} rental`]}
        ogImage={property.images?.[0]?.url || '/logo.png'}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative rounded-2xl overflow-hidden bg-[#E2E8F0] h-[350px] md:h-[480px]">
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
                      i === selectedImage ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-[#E2E8F0]'
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
                      ? `${property.price.toLocaleString('en-IN')} - ${property.maxPrice.toLocaleString('en-IN')}`
                      : property.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-neutral-700/60">
                    {property.propertyType === 'open_plot_land'
                      ? (property.isNegotiable ? 'Negotiable Price' : 'Total Plot Price')
                      : 'per month'}
                  </p>
                </div>
              </div>

              {(property.bedrooms > 0 || property.bathrooms > 0 || Boolean(property.area) || (property.propertyType === 'open_plot_land' && property.pricePerSqft)) && (
                <div className="flex flex-wrap gap-6 py-5 border-y border-[#E2E8F0] mb-6">
                  {property.propertyType !== 'open_plot_land' && property.bedrooms > 0 && (
                    <div className="text-center">
                      <p className="font-display text-2xl font-bold text-primary">{property.bedrooms}</p>
                      <p className="text-xs text-neutral-700/60 mt-0.5">Bedrooms</p>
                    </div>
                  )}
                  {property.propertyType !== 'open_plot_land' && property.bathrooms > 0 && (
                    <div className="text-center">
                      <p className="font-display text-2xl font-bold text-primary">{property.bathrooms}</p>
                      <p className="text-xs text-neutral-700/60 mt-0.5">{property.propertyType === 'office' ? 'Washrooms' : 'Bathrooms'}</p>
                    </div>
                  )}
                  {Boolean(property.area && String(property.area).trim()) && (
                    <div className="text-center">
                      <p className="font-display text-2xl font-bold text-primary">
                        {property.maxArea ? `${property.area} - ${property.maxArea}` : property.area}
                      </p>
                      <p className="text-xs text-neutral-700/60 mt-0.5">
                        {String(property.area || '').match(/[a-zA-Z]/) ? 'Area' : (property.areaUnit || 'sqft')}
                      </p>
                    </div>
                  )}
                  {property.propertyType === 'open_plot_land' && property.pricePerSqft ? (
                    <div className="text-center">
                      <p className="font-display text-2xl font-bold text-accent">₹{property.pricePerSqft.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-neutral-700/60 mt-0.5">per sqft</p>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="mb-6">
                <h2 className="font-display text-lg font-bold text-primary mb-3">About this property</h2>
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {hasAmenities(property.propertyType) && property.amenities && property.amenities.length > 0 && (
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

              {property.videoUrl ? (
                <div className="mb-6">
                  <h2 className="font-display text-lg font-bold text-primary mb-3">Video tour</h2>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-[#E2E8F0]">
                    <iframe
                      src={toEmbedUrl(property.videoUrl)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Property video"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h2 className="font-display text-lg font-bold text-primary mb-2">Video tour</h2>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs font-semibold text-slate-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>No Video Uploaded By Owner</span>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              {(() => {
                const fullAddressQuery = [
                  property.location.address,
                  property.location.city,
                  property.location.state,
                  property.location.zipCode,
                  'India',
                ].filter(Boolean).join(', ');

                const googleMapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddressQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

                return (
                  <>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div>
                        <h2 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                          <svg className="w-5 h-5 text-accent shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          Google Map Location
                        </h2>
                        <p className="text-xs text-neutral-600 mt-0.5">
                          {property.location.address ? `${property.location.address}, ` : ''}{property.location.city}{property.location.zipCode ? ` (${property.location.zipCode})` : ''}
                        </p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 px-3.5 py-2 rounded-xl border border-primary/15 transition-colors shrink-0 shadow-sm"
                      >
                        <svg className="w-4 h-4 text-[#EA4335]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        Get Directions
                      </a>
                    </div>
                    <div className="h-[340px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative bg-slate-100">
                      <iframe
                        title="Google Map Property Location"
                        src={googleMapEmbedUrl}
                        className="w-full h-full border-0 rounded-2xl"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </>
                );
              })()}
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#E2E8F0]">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  {property.owner?.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <p className="font-display font-bold text-primary">{property.owner?.name || 'Property Owner'}</p>
                  <p className="text-sm text-neutral-700/60">{maskEmail(property.owner?.email)}</p>
                </div>
              </div>
              <h2 className="font-display text-lg font-bold text-primary mb-4">Contact owner</h2>
              {inquirySent ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-emerald-900 text-base">Inquiry Sent Successfully!</h3>
                  <p className="mt-1.5 text-xs text-emerald-700 leading-relaxed">
                    {property.owner?.name || 'The property owner'} has been notified of your interest. They will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setInquirySent(false)}
                    className="mt-4 text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const name = (formData.get('name') as string || '').trim();
                    const email = (formData.get('email') as string || '').trim();
                    const phone = (formData.get('phone') as string || '').trim();
                    const message = (formData.get('message') as string || '').trim();

                    if (!name || !email || !message) {
                      toast.error('Please fill in all required fields');
                      return;
                    }

                    try {
                      setInquirySubmitting(true);
                      await propertyApi.contactOwner(property._id, { name, email, phone, message });
                      setInquirySent(true);
                      toast.success('Inquiry sent successfully to property owner!');
                    } catch (err: any) {
                      console.error('Failed to send inquiry via API:', err);
                      const subject = encodeURIComponent(`Inquiry about ${property.title}`);
                      const body = encodeURIComponent(`Hi ${property.owner?.name || 'Owner'},\n\n${message}\n\n- ${name} (${email}${phone ? `, ${phone}` : ''})`);
                      if (property.owner?.email) {
                        window.location.href = `mailto:${property.owner.email}?subject=${subject}&body=${body}`;
                        toast.success('Opened mail app to contact owner!');
                        setInquirySent(true);
                      } else {
                        toast.error(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
                      }
                    } finally {
                      setInquirySubmitting(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <input name="name" placeholder="Your name *" required className="input-field" />
                  <input name="email" type="email" placeholder="Your email *" required className="input-field" />
                  <input name="phone" type="tel" placeholder="Your phone number (optional)" className="input-field" />
                  <textarea name="message" placeholder="Hi, I'm interested in this property..." rows={4} required className="input-field resize-none" />
                  <Button type="submit" className="w-full justify-center" disabled={inquirySubmitting}>
                    {inquirySubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending message...
                      </span>
                    ) : (
                      'Send message'
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <h2 className="font-display text-lg font-bold text-primary mb-4">Share this property</h2>
              <div className="flex flex-col gap-2.5">
                <Button
                  variant={copied ? "primary" : "outline"}
                  size="sm"
                  className="w-full justify-center gap-2 font-semibold transition-all"
                  onClick={async () => {
                    try {
                      if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(window.location.href);
                      } else {
                        const textArea = document.createElement('textarea');
                        textArea.value = window.location.href;
                        textArea.style.position = 'fixed';
                        textArea.style.left = '-999999px';
                        textArea.style.top = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        document.execCommand('copy');
                        textArea.remove();
                      }
                      setCopied(true);
                      toast.success('Property link copied to clipboard!');
                      setTimeout(() => setCopied(false), 3000);
                    } catch {
                      toast.error('Failed to copy link. Please copy the URL manually.');
                    }
                  }}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Link copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy link
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(`Check out ${property.title} for rent on BookMySpace: ${window.location.href}`);
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l.277.444-1.155 4.218 4.316-1.132.305.186z"/>
                  </svg>
                  Share via WhatsApp
                </button>

                {typeof navigator !== 'undefined' && !!navigator.share && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center gap-2 border border-slate-200 hover:bg-slate-50"
                    onClick={() => {
                      navigator.share({
                        title: property.title,
                        text: `Check out ${property.title} for rent on BookMySpace`,
                        url: window.location.href,
                      }).catch(() => {});
                    }}
                  >
                    <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    More options
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-display text-lg font-bold text-primary flex items-center gap-1.5">
                    Property Reviews & Ratings
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-amber-400 text-sm">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= Math.round(Number(avgRating)) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{avgRating} / 5.0</span>
                    <span className="text-xs text-slate-700">({totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'})</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="shrink-0 text-xs px-3 py-1.5"
                >
                  {showReviewForm ? 'Cancel' : '✍️ Write Review'}
                </Button>
              </div>

              {/* Form to submit a review */}
              {showReviewForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleCreateReview}
                  className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Submit Your Rating & Review</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Rating *</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={`text-xl transition-transform hover:scale-110 ${star <= newRating ? 'text-amber-400' : 'text-slate-300'}`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-medium text-slate-600">
                        {newRating === 5 ? 'Excellent ⭐⭐⭐⭐⭐' : newRating === 4 ? 'Very Good ⭐⭐⭐⭐' : newRating === 3 ? 'Good ⭐⭐⭐' : newRating === 2 ? 'Fair ⭐⭐' : 'Poor ⭐'}
                      </span>
                    </div>
                  </div>

                  {!user && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ananya Rao"
                        value={newReviewerName}
                        onChange={(e) => setNewReviewerName(e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Feedback / Review *</label>
                    <textarea
                      rows={3}
                      placeholder="Share your experience regarding location, amenities, noise, maintenance, and owner behavior..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowReviewForm(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={submittingReview}
                      className="text-xs"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* Reviews List */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {reviewsList.length === 0 ? (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-600 font-medium">No reviews submitted yet.</p>
                    <p className="text-[11px] text-slate-700 mt-0.5">Be the first tenant to leave a review for this listing!</p>
                  </div>
                ) : (
                  reviewsList.map((rev: any) => (
                    <div key={rev._id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      {editingReviewId === rev._id ? (
                        /* Inline Edit View for Admin / Review Author */
                        <div className="space-y-2.5 bg-white p-3 rounded-lg border border-primary/20 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary">Editing Review</span>
                            <div className="flex text-amber-400 text-lg">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setEditRating(star)}
                                  className={star <= editRating ? 'text-amber-400' : 'text-slate-300'}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </div>

                          <input
                            type="text"
                            value={editReviewerName}
                            onChange={(e) => setEditReviewerName(e.target.value)}
                            placeholder="Reviewer Name"
                            className="w-full text-xs rounded border border-slate-200 p-2"
                          />

                          <textarea
                            rows={2}
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            className="w-full text-xs rounded border border-slate-200 p-2 resize-none"
                          />

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingReviewId(null)}
                              className="text-xs px-2.5 py-1 text-slate-600 hover:bg-slate-100 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEditReview(rev._id)}
                              className="text-xs px-3 py-1 bg-primary text-white font-medium rounded hover:bg-primary/90"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal Review View */
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                {(rev.userName || rev.user?.name || 'T')[0].toUpperCase()}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 leading-tight">
                                  {rev.userName || rev.user?.name || 'Verified Tenant'}
                                </h4>
                                <div className="flex items-center gap-1 text-[10px] text-slate-700">
                                  <span className="text-amber-400 font-bold">
                                    {'★'.repeat(rev.rating || 5)}{'☆'.repeat(5 - (rev.rating || 5))}
                                  </span>
                                  <span>•</span>
                                  <span>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Recent'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Admin Controls: Edit & Delete */}
                            {isAdmin && (
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditReview(rev)}
                                  className="p-1 text-slate-600 hover:text-primary hover:bg-slate-100 rounded transition-colors text-xs flex items-center gap-1"
                                  title="Edit Review (Admin)"
                                >
                                  ✏️ <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingReviewId(rev._id)}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors text-xs flex items-center gap-1"
                                  title="Delete Review (Admin)"
                                >
                                  🗑️ <span className="hidden sm:inline">Delete</span>
                                </button>
                              </div>
                            )}
                          </div>

                          <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                            {rev.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Confirm Delete Modal */}
              {deletingReviewId && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Delete Inappropriate Review?</h3>
                    <p className="text-xs text-slate-600">
                      Are you sure you want to delete this review? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingReviewId(null)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteReview(deletingReviewId)}
                        className="text-xs bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete Review
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6">
              <h2 className="font-display text-lg font-bold text-primary mb-4">Leave a Comment</h2>
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Your Address"
                  value={commentForm.address}
                  onChange={(e) => setCommentForm({ ...commentForm, address: e.target.value })}
                  className="input-field"
                />
                <textarea
                  placeholder="Write your comment... *"
                  rows={3}
                  value={commentForm.comment}
                  onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                  className="input-field resize-none"
                  required
                />
                <Button type="submit" className="w-full justify-center" disabled={commentSubmitting}>
                  {commentSubmitting ? 'Submitting...' : 'Post Comment'}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
