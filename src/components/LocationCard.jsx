import { CATEGORIES } from '../lib/supabase';

const BookmarkIcon = ({ filled, color }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill={filled ? color : 'none'} 
    stroke={color} 
    strokeWidth="2"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const LocationCard = ({
  t,
  loc,
  index,
  isSelected,
  isExpanded,
  isSaved,
  onSelect,
  onToggleExpand,
  onToggleSave,
  onRate,
  onShowReviews,
  onGetDirections,
  onShare,
  user
}) => {
  const colors = CATEGORIES[loc.category] || CATEGORIES.Public;

  return (
    <div
      className={`bg-white transition-shadow ${isSelected ? 'ring-2 ring-black' : ''}`}
      style={{ borderLeft: `4px solid ${colors.bg}` }}
      onClick={onSelect}
    >
      {/* Header Row */}
      <div className="flex items-stretch">
        {/* Number Box */}
        <div
          className="w-16 flex items-center justify-center text-lg font-black shrink-0"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {String(index + 1).padStart(2, '0')}/
        </div>

        {/* Name and Category */}
        <div className="flex-1 p-3 border-b border-gray-200 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="font-black text-lg leading-tight truncate">{loc.name}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">
                {t(`categories.${colors.key}`)} {t('results.facility')}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
              title={user ? (isSaved ? 'Remove from saved' : 'Save spot') : 'Log in to save'}
              className="shrink-0"
            >
              <BookmarkIcon filled={isSaved} color={colors.bg} />
            </button>
          </div>
        </div>

        {/* Rating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRate();
          }}
          className="w-16 flex flex-col items-center justify-center border-l border-b border-gray-200 bg-throne-lightgray hover:bg-gray-200 transition-colors shrink-0"
          title="Rate this spot"
        >
          <span className="text-lg font-black">{loc.rating || 0}</span>
          <span className="text-[10px] text-gray-500">★ RATE</span>
        </button>
      </div>

      {/* Details Row */}
      <div className="p-3 text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 truncate mr-2">{loc.address}</span>
          <span className="font-bold shrink-0">{loc.distance}km</span>
        </div>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(loc.amenities || []).slice(0, 4).map((a) => (
            <span key={a} className="px-2 py-0.5 bg-throne-lightgray text-xs">
              {a}
            </span>
          ))}
          {(loc.amenities || []).length > 4 && (
            <span className="px-2 py-0.5 text-xs text-gray-400">
              +{loc.amenities.length - 4}
            </span>
          )}
        </div>

        {/* More/Less Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="w-full py-2 bg-black text-white text-xs font-bold tracking-wide hover:bg-gray-800 transition-colors"
        >
          {isExpanded ? `− ${t('common.less').toUpperCase()}` : `+ ${t('common.more').toUpperCase()}`}
        </button>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-3 bg-throne-lightgray text-sm">
          <p className="mb-3">{loc.description || 'No description available.'}</p>

          {/* Hours and Reviews */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="bg-white p-2">
              <span className="text-gray-500 block">{t('spot.hours').toUpperCase()}</span>
              <span className="font-bold">{loc.hours || t('spot.notSpecified')}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowReviews();
              }}
              className="bg-white p-2 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-500 block">{t('reviews.title').toUpperCase()}</span>
              <span className="font-bold text-throne-blue">{loc.reviews || 0} →</span>
            </button>
          </div>

          {/* All Amenities */}
          {(loc.amenities || []).length > 0 && (
            <div className="mb-3">
              <span className="text-xs text-gray-500 block mb-1">
                {t('spot.allAmenities').toUpperCase()}
              </span>
              <div className="flex flex-wrap gap-1">
                {loc.amenities.map((a) => (
                  <span key={a} className="px-2 py-1 bg-white text-xs border border-gray-300">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGetDirections();
              }}
              className="flex-1 py-2 bg-black text-white text-xs font-bold tracking-wide hover:bg-gray-800 transition-colors"
            >
              {t('common.directions').toUpperCase()} →
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="px-4 py-2 border border-black text-xs font-bold hover:bg-black hover:text-white transition-colors"
            >
              {t('common.share').toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationCard;
