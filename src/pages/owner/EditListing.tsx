import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { propertyApi, propertyCategories, amenitiesList } from '../../api/endpoints';
import { Button, Input, Select, Card, LoadingSpinner } from '../../components/ui';
import type { PropertyCategory } from '../../types';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getById(id!),
    enabled: !!id,
  });

  const property = data?.data?.property;
  const isRejected = property?.status === 'rejected';

  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (data?.data?.property && !formData) {
      const p = data.data.property;
      setFormData({
        title: p.title,
        description: p.description,
        propertyType: p.propertyType,
        price: p.price,
        maxPrice: p.maxPrice,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        maxArea: p.maxArea,
        amenities: p.amenities || [],
        videoUrl: p.videoUrl || '',
        location: p.location,
      });
    }
  }, [data, formData]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (isRejected) {
        return propertyApi.resubmit(id!, formData);
      }
      await propertyApi.update(id!, formData);
      await propertyApi.submit(id!);
    },
    onSuccess: () => {
      toast.success(isRejected ? 'Listing resubmitted for review!' : 'Listing updated and submitted!');
      navigate('/owner/listings');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update listing');
    },
  });

  if (isLoading) return <LoadingSpinner className="py-12" />;
  if (!property) return <div className="text-center py-20 text-neutral-700">Property not found</div>;
  if (!formData) return <LoadingSpinner className="py-12" />;

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => {
      if (field.startsWith('location.')) {
        const key = field.split('.')[1];
        return { ...prev, location: { ...prev.location, [key]: value } };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleElaborate = () => {
    const text = formData.description || '';
    if (!text.trim()) {
      toast.error('Please write a brief sentence first to elaborate.');
      return;
    }
    const titleText = formData.title || 'this property';
    const typeText = formData.propertyType || 'apartment';
    const cityText = formData.location?.city || 'this area';
    const bedText = formData.bedrooms ? `${formData.bedrooms} spacious bedroom${formData.bedrooms > 1 ? 's' : ''}` : '';
    const bathText = formData.bathrooms ? `${formData.bathrooms} modern bathroom${formData.bathrooms > 1 ? 's' : ''}` : '';
    const areaText = formData.area ? `${formData.area} sqft of living area` : '';
    
    let specs = [bedText, bathText, areaText].filter(Boolean).join(', ');
    if (specs) specs = ` Featuring ${specs}, it`;
    else specs = ' It';

    const elaborated = `Welcome to this beautiful property! This modern ${typeText} is located in the premium and highly accessible region of ${cityText || 'Bengaluru'}. ${text.trim()}${specs} boasts bright interiors, excellent ventilation, and offers highly comfortable living quarters. Close to major transit, retail hubs, and local attractions, this is a perfect match for anyone seeking convenience and premium space.`;

    updateField('description', elaborated);
    toast.success('Description polished and elaborated!');
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev: any) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: string) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-primary font-display mb-2">
        {isRejected ? 'Edit & Resubmit Listing' : 'Edit Listing'}
      </h1>
      <p className="text-neutral-700 mb-6">Update your property details</p>

      {isRejected && property.feedback && (
        <Card className="p-4 mb-6 border-l-4 border-error bg-error/5">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-error mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="font-semibold text-error mb-1">Admin Feedback</h3>
              <p className="text-sm text-neutral-700">{property.feedback}</p>
              <p className="text-xs text-neutral-700/60 mt-1">
                Please address the feedback above before resubmitting.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-primary font-display">Basic Information</h2>
          <Input
            label="Title *"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1.5">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={5}
              className="input-field resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleElaborate}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 rounded-lg border border-primary/10"
              >
                <svg className="w-3.5 h-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                ✨ Auto-Elaborate & Polish
              </button>
            </div>
          </div>
          <Select
            label="Property Type"
            options={propertyCategories}
            value={formData.propertyType}
            onChange={(e) => updateField('propertyType', e.target.value as PropertyCategory)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-lg text-primary font-display">Location</h2>
          <Input
            label="Address"
            value={formData.location.address}
            onChange={(e) => updateField('location.address', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City *" value={formData.location.city} onChange={(e) => updateField('location.city', e.target.value)} />
            <Input label="State" value={formData.location.state} onChange={(e) => updateField('location.state', e.target.value)} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-lg text-primary font-display">Details</h2>
          {(formData.propertyType === 'commercial' || formData.propertyType === 'land') ? (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">Rental Price Range * (₹/month)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Min Price" type="number" value={formData.price || ''} onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)} />
                  <Input label="Max Price" type="number" value={formData.maxPrice || ''} onChange={(e) => updateField('maxPrice', parseFloat(e.target.value) || undefined)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">Area Range * (sq ft)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Min Area" type="number" value={formData.area || ''} onChange={(e) => updateField('area', parseFloat(e.target.value) || 0)} />
                  <Input label="Max Area" type="number" value={formData.maxArea || ''} onChange={(e) => updateField('maxArea', parseFloat(e.target.value) || undefined)} />
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price (₹/month) *" type="number" value={formData.price || ''} onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)} />
              <Input label="Area (sq ft) *" type="number" value={formData.area || ''} onChange={(e) => updateField('area', parseFloat(e.target.value) || 0)} />
              <Input label="Bedrooms" type="number" value={formData.bedrooms || ''} onChange={(e) => updateField('bedrooms', parseInt(e.target.value) || 0)} />
              <Input label="Bathrooms" type="number" value={formData.bathrooms || ''} onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || 0)} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-lg text-primary font-display">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  formData.amenities.includes(amenity)
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-neutral-700 border-neutral-900/15 hover:border-primary'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-lg text-primary font-display">Media</h2>
          <Input
            label="Video URL"
            value={formData.videoUrl}
            onChange={(e) => updateField('videoUrl', e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>

        <div className="flex justify-between pt-4 border-t border-neutral-900/5">
          <Button variant="ghost" onClick={() => navigate('/owner/listings')}>Cancel</Button>
          {isRejected ? (
            <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
              Resubmit for Review
            </Button>
          ) : (
            <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
              Save & Submit
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
