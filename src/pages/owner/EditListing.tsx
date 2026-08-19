import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { propertyApi, propertyCategories, amenitiesList, hasAmenities } from '../../api/endpoints';
import { Button, Input, Select, Card, LoadingSpinner } from '../../components/ui';
import { parseIndianCurrency } from '../../utils/currencyParser';
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
  const [existingImages, setExistingImages] = useState<{ url: string; publicId: string }[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (data?.data?.property && !formData) {
      const p = data.data.property;
      setFormData({
        title: p.title,
        description: p.description,
        propertyType: p.propertyType,
        price: p.price,
        maxPrice: p.maxPrice,
        pricePerSqft: p.pricePerSqft,
        isNegotiable: p.isNegotiable,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        maxArea: p.maxArea,
        areaUnit: p.areaUnit || 'sqft',
        amenities: p.amenities || [],
        videoUrl: p.videoUrl || '',
        location: p.location,
      });
      setExistingImages(p.images || []);
    }
  }, [data, formData]);

  const mutation = useMutation({
    mutationFn: async () => {
      let uploadedImages: { url: string; publicId: string }[] = [];
      if (newFiles.length > 0) {
        const uploadRes = await propertyApi.uploadImages(newFiles);
        uploadedImages = uploadRes.data.images;
      }
      const allImages = [...existingImages, ...uploadedImages];
      const payload = {
        ...formData,
        price: parseIndianCurrency(formData.price),
        maxPrice: formData.maxPrice !== undefined && formData.maxPrice !== null && formData.maxPrice !== '' ? parseIndianCurrency(formData.maxPrice) : undefined,
        images: allImages,
      };
      if (isRejected) {
        return propertyApi.resubmit(id!, payload);
      }
      await propertyApi.update(id!, payload);
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

  const isPlotLand = formData.propertyType === 'open_plot_land';
  const isOffice = formData.propertyType === 'office';
  const isRangeType = !isPlotLand && !isOffice && ['warehouse', 'coworking', 'commercial_building', 'parking', 'showroom', 'industrial', 'storage'].includes(formData.propertyType);

  const areaUnitOptions = [
    { value: 'sqft', label: 'Sq. Ft. (sqft)' },
    { value: 'sq_yards', label: 'Sq. Yards (Gaj)' },
    { value: 'acres', label: 'Acres' },
    { value: 'cents', label: 'Cents' },
    { value: 'gunthas', label: 'Gunthas' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + existingImages.length + newFiles.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    const oversized = files.find((f) => f.size > 2 * 1024 * 1024);
    if (oversized) {
      toast.error('Image size exceeds 2MB — please reduce image size');
      return;
    }
    setNewFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setNewImagePreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
          {isPlotLand ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Total Expected Price * (₹)"
                    type="text"
                    value={formData.price !== undefined && formData.price !== null ? String(formData.price) : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateField('price', val);
                      const parsedP = parseIndianCurrency(val);
                      const numArea = parseIndianCurrency(formData.area);
                      if (parsedP > 0 && numArea > 0 && formData.areaUnit === 'sqft') {
                        updateField('pricePerSqft', Math.round(parsedP / numArea));
                      }
                    }}
                    placeholder="e.g., 1.45cr, 75L, 45,000, 5000000"
                  />
                  {parseIndianCurrency(formData.price) > 0 && String(formData.price).match(/[a-zA-Z,]/) ? (
                    <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <span>Converted:</span>
                      <span className="font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ₹{parseIndianCurrency(formData.price).toLocaleString('en-IN')}
                      </span>
                    </p>
                  ) : null}
                </div>
                <div>
                  <Input
                    label="Price per Sq.Ft (₹)"
                    type="text"
                    value={formData.pricePerSqft !== undefined && formData.pricePerSqft !== null ? String(formData.pricePerSqft) : ''}
                    onChange={(e) => updateField('pricePerSqft', parseIndianCurrency(e.target.value) || undefined)}
                    placeholder="e.g., 2,500"
                  />
                  {formData.pricePerSqft && String(formData.pricePerSqft).match(/[,]/) ? (
                    <p className="text-xs text-slate-600 mt-1">₹{parseIndianCurrency(formData.pricePerSqft).toLocaleString('en-IN')}/sqft</p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                <input
                  type="checkbox"
                  id="editNegotiableCheckbox"
                  checked={!!formData.isNegotiable}
                  onChange={(e) => updateField('isNegotiable', e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300 cursor-pointer"
                />
                <label htmlFor="editNegotiableCheckbox" className="text-sm font-medium text-slate-800 cursor-pointer select-none">
                  Price is Negotiable
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Total Plot / Land Area *"
                  type="text"
                  value={formData.area !== undefined && formData.area !== null ? String(formData.area) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateField('area', val);
                    const numVal = parseIndianCurrency(val);
                    const currentPrice = parseIndianCurrency(formData.price);
                    if (currentPrice > 0 && numVal > 0 && formData.areaUnit === 'sqft') {
                      updateField('pricePerSqft', Math.round(currentPrice / numVal));
                    }
                  }}
                  placeholder="e.g., 2 Acres, 2 acre 3 guntha, 2400"
                />
                <Select
                  label="Area Unit *"
                  options={areaUnitOptions}
                  value={formData.areaUnit || 'sqft'}
                  onChange={(e) => updateField('areaUnit', e.target.value)}
                />
              </div>
            </div>
          ) : isOffice ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Rental Price * (₹/month)"
                    type="text"
                    value={formData.price !== undefined && formData.price !== null ? String(formData.price) : ''}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="e.g., 65,000 or 65k"
                  />
                  {parseIndianCurrency(formData.price) > 0 && String(formData.price).match(/[a-zA-Z,]/) ? (
                    <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <span>Converted:</span>
                      <span className="font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ₹{parseIndianCurrency(formData.price).toLocaleString('en-IN')}/mo
                      </span>
                    </p>
                  ) : null}
                </div>
                <Input
                  label="Rental Area * (sq ft)"
                  type="text"
                  value={formData.area !== undefined && formData.area !== null ? String(formData.area) : ''}
                  onChange={(e) => updateField('area', e.target.value)}
                  placeholder="e.g., 1800"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Washrooms / Bathrooms"
                  type="number"
                  value={formData.bathrooms || ''}
                  onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 2"
                />
              </div>
            </div>
          ) : isRangeType ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">Rental Price Range * (₹/month)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Min Price"
                      type="text"
                      value={formData.price !== undefined && formData.price !== null ? String(formData.price) : ''}
                      onChange={(e) => updateField('price', e.target.value)}
                      placeholder="e.g., 50,000 or 50k"
                    />
                    {parseIndianCurrency(formData.price) > 0 && String(formData.price).match(/[a-zA-Z,]/) ? (
                      <p className="text-xs text-emerald-700 font-semibold mt-1">₹{parseIndianCurrency(formData.price).toLocaleString('en-IN')}/mo</p>
                    ) : null}
                  </div>
                  <div>
                    <Input
                      label="Max Price"
                      type="text"
                      value={formData.maxPrice !== undefined && formData.maxPrice !== null ? String(formData.maxPrice) : ''}
                      onChange={(e) => updateField('maxPrice', e.target.value)}
                      placeholder="e.g., 1,00,000 or 1L"
                    />
                    {formData.maxPrice && parseIndianCurrency(formData.maxPrice) > 0 && String(formData.maxPrice).match(/[a-zA-Z,]/) ? (
                      <p className="text-xs text-emerald-700 font-semibold mt-1">₹{parseIndianCurrency(formData.maxPrice).toLocaleString('en-IN')}/mo</p>
                    ) : null}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">Area Range * (sq ft)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min Area"
                    type="text"
                    value={formData.area !== undefined && formData.area !== null ? String(formData.area) : ''}
                    onChange={(e) => updateField('area', e.target.value)}
                    placeholder="e.g., 1000"
                  />
                  <Input
                    label="Max Area"
                    type="text"
                    value={formData.maxArea !== undefined && formData.maxArea !== null ? String(formData.maxArea) : ''}
                    onChange={(e) => updateField('maxArea', e.target.value)}
                    placeholder="e.g., 5000"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Price (₹/month) *"
                  type="text"
                  value={formData.price !== undefined && formData.price !== null ? String(formData.price) : ''}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="e.g., 25,000 or 25k"
                />
                {parseIndianCurrency(formData.price) > 0 && String(formData.price).match(/[a-zA-Z,]/) ? (
                  <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <span>Converted:</span>
                    <span className="font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ₹{parseIndianCurrency(formData.price).toLocaleString('en-IN')}/mo
                    </span>
                  </p>
                ) : null}
              </div>
              <Input
                label="Area (sq ft) *"
                type="text"
                value={formData.area !== undefined && formData.area !== null ? String(formData.area) : ''}
                onChange={(e) => updateField('area', e.target.value)}
                placeholder="e.g., 1200"
              />
              <Input label="Bedrooms" type="number" value={formData.bedrooms || ''} onChange={(e) => updateField('bedrooms', parseInt(e.target.value) || 0)} />
              <Input label="Bathrooms" type="number" value={formData.bathrooms || ''} onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || 0)} />
            </div>
          )}
        </div>

        {hasAmenities(formData.propertyType) && (
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
                  : 'bg-surface text-neutral-700 border-[#E2E8F0] hover:border-primary'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="font-bold text-lg text-primary font-display">Media</h2>
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Images (max 4)
            </label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {existingImages.map((img, i) => (
                <div key={`existing-${i}`} className="relative aspect-square rounded-lg overflow-hidden bg-[#E2E8F0] group">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
              {newImagePreviews.map((preview, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden bg-[#E2E8F0] group">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
              {existingImages.length + newFiles.length < 4 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-[#E2E8F0] flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <svg className="w-8 h-8 text-neutral-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <p className="text-xs text-neutral-700/60 mt-2">{existingImages.length + newFiles.length} / 4 images | Max 2MB per image | JPEG, PNG, WebP</p>
          </div>
          <Input
            label="Video URL"
            value={formData.videoUrl}
            onChange={(e) => updateField('videoUrl', e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>

        <div className="flex justify-between pt-4 border-t border-[#E2E8F0]">
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
