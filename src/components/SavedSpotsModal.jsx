import { CATEGORIES } from '../lib/supabase';

const SavedSpotsModal = ({ 
  t, 
  mode, 
  spots, 
  savedSpots, 
  locations, 
  onClose, 
  onSelectSpot 
}) => {
  const displaySpots = mode === 'saved'
    ? locations.filter(l => savedSpots.includes(l.id))
    : spots;

  const title = mode === 'saved' ? t('auth.savedSpots') : t('auth.myContributions');
  const emptyIcon = mode === 'saved' ? '🔖' : '📍';
  const emptyText = mode === 'saved' 
    ? 'No saved spots yet' 
    : 'No contributions yet';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-throne-red text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-black tracking-wide">
            {title.toUpperCase()}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none hover:opacity-70">
            ×
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {displaySpots.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">{emptyIcon}</div>
              <p className="text-gray-500">{emptyText}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {displaySpots.map((spot) => {
                const colors = CATEGORIES[spot.category] || CATEGORIES.Public;
                return (
                  <div
                    key={spot.id}
                    onClick={() => {
                      onSelectSpot(spot);
                      onClose();
                    }}
                    className="p-4 hover:bg-throne-lightgray cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1 mr-2">
                        <h3 className="font-bold truncate">{spot.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{spot.address}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-throne-yellow text-sm">
                          {'★'.repeat(Math.round(spot.rating || 0))}
                        </span>
                        <p 
                          className="text-xs font-bold"
                          style={{ color: colors.bg }}
                        >
                          {t(`categories.${colors.key}`)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedSpotsModal;
