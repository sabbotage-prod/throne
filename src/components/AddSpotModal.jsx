import { useState } from 'react';
import { supabase, CATEGORIES, AMENITIES } from '../lib/supabase';
import AddressAutocomplete from './AddressAutocomplete';

const AddSpotModal = ({ t, user, mapCenter, onClose, onSpotAdded }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Public');
  const [address, setAddress] = useState('');
  const [coords, setCoords] = useState(null);
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [rating, setRating] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserName = () => {
    return user?.user_metadata?.name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'User';
  };

  const handleAddressChange = (val, coordsData) => {
    setAddress(val);
    if (coordsData) setCoords(coordsData);
  };

  const toggleAmenity = (amenity) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async () => {
    if (!name || !address) {
      alert('Please fill in name and address');
      return;
    }

    setLoading(true);

    const spotData = {
      name,
      category,
      address,
      description,
      hours,
      rating: rating || 0,
      amenities,
      lat: coords?.lat || mapCenter[0] + (Math.random() - 0.5) * 0.01,
      lng: coords?.lng || mapCenter[1] + (Math.random() - 0.5) * 0.01,
      reviews: rating ? 1 : 0,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('spots')
      .insert(spotData)
      .select()
      .single();

    if (error) {
      alert('Error: ' + error.message);
    } else {
      onSpotAdded?.(data);
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-throne-green text-white p-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-black tracking-wide">
            {t('addSpot.title').toUpperCase()}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none hover:opacity-70">
            ×
          </button>
        </div>

        {/* User Info */}
        <div className="bg-throne-lightgray p-3 flex items-center gap-2 text-sm border-b border-gray-200">
          <div className="w-6 h-6 bg-throne-red text-white font-bold text-xs flex items-center justify-center">
            {getUserName().charAt(0).toUpperCase()}
          </div>
          <span>
            {t('addSpot.addingAs')} <strong>{getUserName()}</strong>
          </span>
        </div>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              {t('addSpot.name').toUpperCase()} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-black p-3 text-sm"
              placeholder={t('addSpot.namePlaceholder')}
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              {t('addSpot.address').toUpperCase()} *
            </label>
            <AddressAutocomplete
              value={address}
              onChange={handleAddressChange}
              placeholder={t('addSpot.addressPlaceholder')}
              className="w-full border-2 border-black p-3 text-sm"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              {t('addSpot.type').toUpperCase()}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CATEGORIES).map(([cat, colors]) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className="py-3 text-sm font-bold transition-colors"
                  style={{
                    backgroundColor: category === cat ? colors.bg : '#F5F5F5',
                    color: category === cat ? colors.text : 'black'
                  }}
                >
                  {t(`categories.${colors.key}`).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              {t('addSpot.hours').toUpperCase()}
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full border-2 border-black p-3 text-sm"
              placeholder={t('addSpot.hoursPlaceholder')}
            />
          </div>

          {/* Rating */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              {t('addSpot.yourRating').toUpperCase()}
            </label>
            <div className="text-2xl">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  onClick={() => setRating(i)}
                  className={`cursor-pointer transition-colors ${
                    i <= rating ? 'text-throne-yellow' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              {t('addSpot.description').toUpperCase()}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-black p-3 text-sm h-20"
              placeholder={t('addSpot.descriptionPlaceholder')}
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              {t('filters.amenities').toUpperCase()}
            </label>
            <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto border border-gray-200 p-2">
              {AMENITIES.map(({ key, value }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAmenity(value)}
                  className={`px-2 py-1 text-xs font-bold text-left transition-colors ${
                    amenities.includes(value)
                      ? 'bg-black text-white'
                      : 'bg-throne-lightgray hover:bg-gray-200'
                  }`}
                >
                  {amenities.includes(value) && '✓ '}{t(`amenities.${key}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-black text-sm font-bold hover:bg-black hover:text-white transition-colors"
          >
            {t('common.cancel').toUpperCase()}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 bg-throne-green text-white text-sm font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? t('common.loading') : t('addSpot.title').toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSpotModal;
