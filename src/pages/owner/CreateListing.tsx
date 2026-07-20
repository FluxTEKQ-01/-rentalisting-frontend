import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { propertyApi, propertyCategories, amenitiesList } from '../../api/endpoints';
import { Button, Input, Select, Card } from '../../components/ui';
import type { PropertyCategory, PropertyFormData } from '../../types';

const steps = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Location' },
  { id: 3, label: 'Details' },
  { id: 4, label: 'Media' },
  { id: 5, label: 'Review' },
];

export default function CreateListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    propertyType: 'house_apartment',
    price: 0,
    maxPrice: undefined,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    maxArea: undefined,
    amenities: [],
    videoUrl: '',
    location: { address: '', city: '', state: '', zipCode: '', coordinates: { lat: 0, lng: 0 } },
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async () => {
      let uploadedImages: { url: string; publicId: string }[] = [];
      if (images.length > 0) {
        const uploadRes = await propertyApi.uploadImages(images);
        uploadedImages = uploadRes.data.images;
      }
      return propertyApi.create({
        ...formData,
        images: uploadedImages,
      });
    },
    onSuccess: async (res) => {
      const propertyId = res.data.property._id;
      await propertyApi.submit(propertyId);
      toast.success('Listing created and submitted for review!');
      navigate('/owner/listings');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      let uploadedImages: { url: string; publicId: string }[] = [];
      if (images.length > 0) {
        const uploadRes = await propertyApi.uploadImages(images);
        uploadedImages = uploadRes.data.images;
      }
      return propertyApi.create({
        ...formData,
        images: uploadedImages,
      });
    },
    onSuccess: () => {
      toast.success('Listing saved as draft!');
      navigate('/owner/listings');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to save draft');
    },
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => {
      if (field.startsWith('location.')) {
        const key = field.split('.')[1];
        return { ...prev, location: { ...prev.location, [key]: value } };
      }
      return { ...prev, [field]: value };
    });
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    if (field.startsWith('location.')) {
      const key = field.split('.')[1];
      if (errors[key]) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
      }
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (formData.title.trim().length < 5) {
        newErrors.title = 'Title must be at least 5 characters';
      }
      if (formData.description.trim().length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
    } else if (step === 2) {
      if (!formData.location.city.trim()) {
        newErrors.city = 'City is required';
      }
    } else if (step === 3) {
      if (formData.price <= 0) {
        newErrors.price = 'Rental price must be greater than 0';
      }
      if (formData.area <= 0) {
        newErrors.area = 'Area must be greater than 0';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return;
    }
    setErrors({});
    setStep(step + 1);
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="Property Title *"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g., Modern 2BR Apartment in Downtown"
              error={errors.title}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-1.5">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe your property in detail (min 20 characters)..."
                rows={5}
                className={`input-field resize-none ${errors.description ? 'ring-2 ring-error/30 border-error' : ''}`}
              />
              {errors.description && <p className="mt-1 text-sm text-error">{errors.description}</p>}
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
              label="Property Type *"
              options={propertyCategories}
              value={formData.propertyType}
              onChange={(e) => updateField('propertyType', e.target.value as PropertyCategory)}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Input
              label="Address"
              value={formData.location.address}
              onChange={(e) => updateField('location.address', e.target.value)}
              placeholder="Street address"
            />
            <Input
              label="City *"
              value={formData.location.city}
              onChange={(e) => updateField('location.city', e.target.value)}
              placeholder="e.g., New York"
              error={errors.city}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="State"
                value={formData.location.state}
                onChange={(e) => updateField('location.state', e.target.value)}
                placeholder="e.g., NY"
              />
              <Input
                label="ZIP Code"
                value={formData.location.zipCode}
                onChange={(e) => updateField('location.zipCode', e.target.value)}
                placeholder="e.g., 10001"
              />
            </div>
            <p className="text-sm text-neutral-700/60">
              Coordinates can be added later via map picker.
            </p>
          </div>
        );

      case 3:
        const isRangeType = ['office', 'warehouse', 'open_plot_land', 'coworking', 'commercial_building', 'parking', 'showroom', 'industrial', 'storage'].includes(formData.propertyType);
        return (
          <div className="space-y-4">
            {isRangeType ? (
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">Rental Price Range * (₹/month)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min Price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 50000"
                    error={errors.price}
                  />
                  <Input
                    label="Max Price"
                    type="number"
                    value={formData.maxPrice || ''}
                    onChange={(e) => updateField('maxPrice', parseFloat(e.target.value) || undefined)}
                    placeholder="e.g., 100000"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Rental Price * (₹/month)"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 25000"
                  error={errors.price}
                />
                <Input
                  label="Bedrooms"
                  type="number"
                  value={formData.bedrooms || ''}
                  onChange={(e) => updateField('bedrooms', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 2"
                />
              </div>
            )}

            {isRangeType ? (
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">Area Range * (sq ft)</label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min Area"
                    type="number"
                    value={formData.area || ''}
                    onChange={(e) => updateField('area', parseFloat(e.target.value) || 0)}
                    placeholder="e.g., 1000"
                    error={errors.area}
                  />
                  <Input
                    label="Max Area"
                    type="number"
                    value={formData.maxArea || ''}
                    onChange={(e) => updateField('maxArea', parseFloat(e.target.value) || undefined)}
                    placeholder="e.g., 5000"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Area * (sq ft)"
                  type="number"
                  value={formData.area || ''}
                  onChange={(e) => updateField('area', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 1200"
                  error={errors.area}
                />
                <Input
                  label="Bathrooms"
                  type="number"
                  value={formData.bathrooms || ''}
                  onChange={(e) => updateField('bathrooms', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 1"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">Amenities</label>
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
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Images (max 10)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {imagePreview.map((preview, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-[#E2E8F0] group">
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    >
                      X
                    </button>
                  </div>
                ))}
                {imagePreview.length < 10 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-[#E2E8F0] flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <svg className="w-8 h-8 text-neutral-700/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>
            <Input
              label="Video URL (YouTube/Vimeo embed link)"
              value={formData.videoUrl}
              onChange={(e) => updateField('videoUrl', e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
        );

      case 5:
        const isRangeReview = ['office', 'warehouse', 'open_plot_land', 'coworking', 'commercial_building', 'parking', 'showroom', 'industrial', 'storage'].includes(formData.propertyType);
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-primary font-display">Review Your Listing</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#E2E8F0] rounded-lg">
                <div><span className="text-neutral-700">Title:</span> <span className="font-medium">{formData.title}</span></div>
                <div><span className="text-neutral-700">Type:</span> <span className="font-medium">{formData.propertyType}</span></div>
                <div><span className="text-neutral-700">Price:</span> <span className="font-medium">
                  {isRangeReview
                    ? `₹${formData.price.toLocaleString()} - ₹${(formData.maxPrice || 0).toLocaleString()}/mo`
                    : `₹${formData.price.toLocaleString()}/mo`}
                </span></div>
                <div><span className="text-neutral-700">Area:</span> <span className="font-medium">
                  {isRangeReview
                    ? `${formData.area} - ${formData.maxArea || 0} sqft`
                    : `${formData.area} sqft`}
                </span></div>
                <div><span className="text-neutral-700">Bedrooms:</span> <span className="font-medium">{isRangeReview ? 'N/A' : formData.bedrooms}</span></div>
                <div><span className="text-neutral-700">Bathrooms:</span> <span className="font-medium">{isRangeReview ? 'N/A' : formData.bathrooms}</span></div>
                <div><span className="text-neutral-700">City:</span> <span className="font-medium">{formData.location.city}</span></div>
                <div><span className="text-neutral-700">Images:</span> <span className="font-medium">{images.length} uploaded</span></div>
              </div>
              {formData.amenities.length > 0 && (
                <div>
                  <span className="text-neutral-700">Amenities: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.amenities.map((a) => (
                      <span key={a} className="px-2 py-0.5 bg-primary/5 text-primary rounded text-xs font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <span className="text-neutral-700">Description: </span>
                <p className="text-neutral-900 mt-1 whitespace-pre-line">{formData.description.substring(0, 200)}...</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-primary font-display mb-2">Create Listing</h1>
      <p className="text-neutral-700 mb-6">Fill in the details for your rental property</p>

      <div className="flex items-center justify-between mb-8">
        {steps.map((s) => (
          <div key={s.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  s.id === step
                    ? 'bg-primary text-white'
                    : s.id < step
                    ? 'bg-primary text-white'
                        : 'bg-[#E2E8F0] text-neutral-700/40'
                }`}
              >
                {s.id < step ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.id
                )}
              </div>
              <span className={`text-xs font-medium hidden md:inline ${s.id === step ? 'text-primary' : 'text-neutral-700/40'}`}>
                {s.label}
              </span>
            </div>
            {s.id < 5 && <div className={`w-8 md:w-16 h-0.5 mx-2 ${s.id < step ? 'bg-primary' : 'bg-[#E2E8F0]'}`} />}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {renderStep()}

        <div className="flex justify-between mt-8">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="ghost" onClick={() => {
                setErrors({});
                setStep(step - 1);
              }}>Previous</Button>
            )}
            {step < 5 && (
              <Button variant="outline" onClick={() => saveDraftMutation.mutate()} loading={saveDraftMutation.isPending}>
                Save as Draft
              </Button>
            )}
          </div>
          {step < 5 ? (
            <Button onClick={handleNextStep}>Next Step</Button>
          ) : (
            <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
              Submit for Review
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
