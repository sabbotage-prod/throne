import { useState } from 'react';

const RatingModal = ({ t, spot, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    await onSubmit({ spotId: spot.id, rating, review });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white w-full max-w-sm">
        {/* Header */}
        <div className="bg-throne-black text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-black tracking-wide">
            {t('rating.title').toUpperCase()}
          </h2>
          <button onClick={onClose} className="text-2xl leading-none hover:opacity-70">
            ×
          </button>
        </div>

        <div className="p-4">
          {/* Spot Info */}
          <div className="text-center mb-4">
            <h3 className="font-black text-lg">{spot.name}</h3>
            <p className="text-xs text-gray-500">{spot.address}</p>
          </div>

          {/* Rating Stars */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 block mb-2 text-center">
              {t('rating.yourRating').toUpperCase()}
            </label>
            <div className="flex justify-center gap-2 text-3xl">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  onClick={() => setRating(i)}
                  className={`cursor-pointer transition-transform hover:scale-110 ${
                    i <= rating ? 'text-throne-yellow' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 block mb-1">
              {t('rating.yourReview').toUpperCase()}
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border-2 border-black p-3 text-sm h-24"
              placeholder={t('rating.reviewPlaceholder')}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
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
              {loading ? t('rating.saving') : t('common.submit').toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
