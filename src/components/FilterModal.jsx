import { CATEGORIES, AMENITIES } from '../lib/supabase';

const FilterModal = ({ 
  t, 
  filters, 
  onFiltersChange, 
  onClose, 
  resultCount 
}) => {
  const toggleCategory = (cat) => {
    onFiltersChange({
      ...filters,
      categories: filters.categories.includes(cat)
        ? filters.categories.filter(c => c !== cat)
        : [...filters.categories, cat]
    });
  };

  const toggleAmenity = (amenity) => {
    onFiltersChange({
      ...filters,
      amenities: filters.amenities.includes(amenity)
        ? filters.amenities.filter(a => a !== amenity)
        : [...filters.amenities, amenity]
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      amenities: [],
      maxDistance: 10,
      minRating: 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-black text-white p-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-black tracking-wide">
            {t('filters.title').toUpperCase()}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none hover:opacity-70">
            ×
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Max Distance */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-2">
              {t('filters.maxDistance').toUpperCase()}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={filters.maxDistance}
                onChange={(e) => onFiltersChange({ ...filters, maxDistance: +e.target.value })}
                className="flex-1"
              />
              <span className="font-black text-lg w-16 text-right">
                {filters.maxDistance}km
              </span>
            </div>
          </div>

          {/* Min Rating */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-2">
              {t('filters.minRating').toUpperCase()}
            </label>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => onFiltersChange({ ...filters, minRating: r })}
                  className={`flex-1 py-2 text-sm font-bold transition-colors ${
                    filters.minRating === r
                      ? 'bg-black text-white'
                      : 'bg-throne-lightgray hover:bg-gray-200'
                  }`}
                >
                  {r === 0 ? t('filters.all') : `${r}★`}
                </button>
              ))}
            </div>
          </div>

          {/* Facility Type */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-2">
              {t('filters.facilityType').toUpperCase()}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(CATEGORIES).map(([name, colors]) => {
                const isSelected = filters.categories.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleCategory(name)}
                    className="py-3 text-sm font-bold transition-colors"
                    style={{
                      backgroundColor: isSelected ? colors.bg : '#F5F5F5',
                      color: isSelected ? colors.text : 'black'
                    }}
                  >
                    {t(`categories.${colors.key}`).toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-2">
              {t('filters.amenities').toUpperCase()}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES.map(({ key, value }) => {
                const isSelected = filters.amenities.includes(value);
                return (
                  <button
                    key={key}
                    onClick={() => toggleAmenity(value)}
                    className={`px-3 py-2 text-xs font-bold text-left transition-colors ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'bg-throne-lightgray hover:bg-gray-200'
                    }`}
                  >
                    {isSelected && '✓ '}{t(`amenities.${key}`)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-2">
          <button
            onClick={clearFilters}
            className="flex-1 py-3 border border-black text-sm font-bold hover:bg-black hover:text-white transition-colors"
          >
            {t('filters.clear').toUpperCase()}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors"
          >
            {t('filters.showResults', { count: resultCount }).toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
