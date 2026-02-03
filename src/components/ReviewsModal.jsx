const ReviewsModal = ({ t, spot, reviews, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-throne-black text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-black tracking-wide">
            {t('reviews.title').toUpperCase()}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none hover:opacity-70">
            ×
          </button>
        </div>

        {/* Spot Info */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-black">{spot.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-throne-yellow">
              {'★'.repeat(Math.round(spot.rating || 0))}
              {'☆'.repeat(5 - Math.round(spot.rating || 0))}
            </span>
            <span className="font-bold">{spot.rating || 0}</span>
            <span className="text-gray-500 text-sm">
              ({reviews.length} {t('reviews.title').toLowerCase()})
            </span>
          </div>
        </div>

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto p-4">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {t('reviews.noReviews')}
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-throne-yellow text-sm">
                        {'★'.repeat(r.rating)}
                      </span>
                      <span className="text-gray-300 text-sm">
                        {'★'.repeat(5 - r.rating)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {r.review && <p className="text-sm">{r.review}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    — {r.user_name || t('reviews.anonymous')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
