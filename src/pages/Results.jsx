import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Map from '../components/Map';
import LocationCard from '../components/LocationCard';
import AddressAutocomplete from '../components/AddressAutocomplete';
import AuthModal from '../components/AuthModal';
import FilterModal from '../components/FilterModal';
import AddSpotModal from '../components/AddSpotModal';
import RatingModal from '../components/RatingModal';
import ReviewsModal from '../components/ReviewsModal';
import ContactModal from '../components/ContactModal';
import SavedSpotsModal from '../components/SavedSpotsModal';
import { supabase, CATEGORIES } from '../lib/supabase';
import useGeolocation from '../hooks/useGeolocation';

const Results = ({
  t,
  language,
  languages,
  setLanguage,
  user,
  onLogout,
  locations,
  setLocations,
  savedSpots,
  setSavedSpots,
  mapCenter,
  setMapCenter,
  locationName,
  setLocationName,
  userLocation,
  setUserLocation
}) => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddSpot, setShowAddSpot] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showRating, setShowRating] = useState(null);
  const [showReviews, setShowReviews] = useState(null);
  const [showMySpots, setShowMySpots] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  const [filters, setFilters] = useState({
    categories: [],
    amenities: [],
    maxDistance: 10,
    minRating: 0
  });
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [isMapView, setIsMapView] = useState(false);

  const { getCurrentPosition, getDistance } = useGeolocation();

  const userSpots = user ? locations.filter(l => l.user_id === user.id) : [];

  // Calculate distances and filter
  const locationsWithDistance = locations.map(loc => ({
    ...loc,
    distance: getDistance(mapCenter[0], mapCenter[1], loc.lat, loc.lng)
  }));

  const filtered = locationsWithDistance
    .filter(loc => {
      if (filters.categories.length > 0 && !filters.categories.includes(loc.category)) return false;
      if (filters.amenities.length > 0 && !filters.amenities.every(a => (loc.amenities || []).includes(a))) return false;
      if (loc.distance > filters.maxDistance) return false;
      if (loc.rating < filters.minRating) return false;
      return true;
    })
    .sort((a, b) => a.distance - b.distance);

  const filterCount = 
    filters.categories.length + 
    filters.amenities.length + 
    (filters.maxDistance < 10 ? 1 : 0) + 
    (filters.minRating > 0 ? 1 : 0);

  const handleGetCurrentLocation = async () => {
    try {
      const coords = await getCurrentPosition();
      setUserLocation([coords.lat, coords.lng]);
      setMapCenter([coords.lat, coords.lng]);
      setLocationName('Current');
    } catch (err) {
      alert('Unable to get location');
    }
  };

  const handleAddressChange = (val, coords) => {
    setLocationSearch(val);
    if (coords) {
      setMapCenter([coords.lat, coords.lng]);
      setLocationName(val.split(',')[0]);
      setLocationSearch('');
    }
  };

  const handleSpotSelect = (spot) => {
    setSelectedLocation(spot.id);
    setExpanded(spot.id);
    setMapCenter([spot.lat, spot.lng]);
    setIsMapView(false); // Switch to list view to show details
  };

  const toggleCategory = (cat) => {
    setFilters(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      amenities: [],
      maxDistance: 10,
      minRating: 0
    });
  };

  const toggleSaveSpot = async (spotId) => {
    if (!user) {
      setAuthMode('login');
      setShowAuth(true);
      return;
    }

    const isSaved = savedSpots.includes(spotId);
    if (isSaved) {
      await supabase.from('saved_spots').delete().eq('user_id', user.id).eq('spot_id', spotId);
      setSavedSpots(prev => prev.filter(id => id !== spotId));
    } else {
      await supabase.from('saved_spots').insert({ user_id: user.id, spot_id: spotId });
      setSavedSpots(prev => [...prev, spotId]);
    }
  };

  const handleRateSpot = (spot) => {
    if (!user) {
      setAuthMode('login');
      setShowAuth(true);
      return;
    }
    setShowRating(spot);
  };

  const handleRatingSubmit = async ({ spotId, rating, review }) => {
    if (!user) return;

    const userName = user?.user_metadata?.name || 
                     user?.user_metadata?.full_name || 
                     user?.email?.split('@')[0] || 
                     'User';

    await supabase.from('reviews').insert({
      spot_id: spotId,
      user_id: user.id,
      user_name: userName,
      rating,
      review
    });

    // Update spot average rating
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('spot_id', spotId);

    if (allReviews) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await supabase
        .from('spots')
        .update({ rating: Math.round(avgRating * 10) / 10, reviews: allReviews.length })
        .eq('id', spotId);

      setLocations(prev =>
        prev.map(l =>
          l.id === spotId
            ? { ...l, rating: Math.round(avgRating * 10) / 10, reviews: allReviews.length }
            : l
        )
      );
    }
  };

  const handleShowReviews = async (spot) => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('spot_id', spot.id)
      .order('created_at', { ascending: false });
    
    setReviews(data || []);
    setShowReviews(spot);
  };

  const handleAddSpotClick = () => {
    if (!user) {
      setAuthMode('signup');
      setShowAuth(true);
      return;
    }
    setShowAddSpot(true);
  };

  const handleSpotAdded = (newSpot) => {
    setLocations(prev => [newSpot, ...prev]);
  };

  const shareSpot = (loc) => {
    const text = `${loc.name} on Throne — ${loc.rating}★ ${loc.address}`;
    if (navigator.share) {
      navigator.share({ title: loc.name, text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert(t('common.copied'));
    }
  };

  const getDirections = (loc) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-throne-lightgray">
      {/* Modals */}
      {showAuth && (
        <AuthModal
          t={t}
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
      {showFilters && (
        <FilterModal
          t={t}
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
          resultCount={filtered.length}
        />
      )}
      {showAddSpot && (
        <AddSpotModal
          t={t}
          user={user}
          mapCenter={mapCenter}
          onClose={() => setShowAddSpot(false)}
          onSpotAdded={handleSpotAdded}
        />
      )}
      {showRating && (
        <RatingModal
          t={t}
          spot={showRating}
          onClose={() => setShowRating(null)}
          onSubmit={handleRatingSubmit}
        />
      )}
      {showReviews && (
        <ReviewsModal
          t={t}
          spot={showReviews}
          reviews={reviews}
          onClose={() => setShowReviews(null)}
        />
      )}
      {showContact && <ContactModal t={t} onClose={() => setShowContact(false)} />}
      {showMySpots && (
        <SavedSpotsModal
          t={t}
          mode={showMySpots}
          spots={userSpots}
          savedSpots={savedSpots}
          locations={locations}
          onClose={() => setShowMySpots(null)}
          onSelectSpot={handleSpotSelect}
        />
      )}

      {/* Header */}
      <Header
        t={t}
        language={language}
        languages={languages}
        setLanguage={setLanguage}
        user={user}
        onLogout={onLogout}
        onLoginClick={() => {
          setAuthMode('login');
          setShowAuth(true);
        }}
        onSavedSpotsClick={() => setShowMySpots('saved')}
        onContributionsClick={() => setShowMySpots('contributions')}
        savedSpotsCount={savedSpots.length}
        contributionsCount={userSpots.length}
        locationName={locationName}
        showLocation
      />

      {/* Search Bar */}
      <div className="bg-white p-3 border-b border-gray-200">
        <div className="flex gap-2 max-w-lg mx-auto">
          <div className="flex-1">
            <AddressAutocomplete
              value={locationSearch}
              onChange={handleAddressChange}
              placeholder={t('results.searchLocation')}
              className="w-full border border-gray-300 p-2 text-sm"
            />
          </div>
          <button
            onClick={handleGetCurrentLocation}
            className="px-3 border border-gray-300 text-sm hover:bg-throne-lightgray transition-colors"
          >
            ◉
          </button>
        </div>
      </div>

      {/* Map */}
      <Map
        t={t}
        spots={filtered}
        selectedSpot={selectedLocation}
        userLocation={userLocation}
        mapCenter={mapCenter}
        onSpotSelect={handleSpotSelect}
        isFullView={isMapView}
        onToggleView={() => setIsMapView(!isMapView)}
      />

      {/* Controls */}
      <div className="bg-white p-3 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex gap-2">
            {Object.entries(CATEGORIES).map(([name, colors]) => {
              const isSelected = filters.categories.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleCategory(name)}
                  className="px-3 py-1 text-xs font-bold transition-colors"
                  style={{
                    backgroundColor: isSelected ? colors.bg : 'transparent',
                    color: isSelected ? colors.text : 'black',
                    border: `2px solid ${colors.bg}`
                  }}
                >
                  {t(`categories.${colors.key}`).toUpperCase()}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddSpotClick}
              className="px-3 py-1 bg-throne-green text-white text-xs font-bold hover:bg-green-700 transition-colors"
            >
              + {t('results.addSpot').toUpperCase()}
            </button>
            <button
              onClick={() => setShowFilters(true)}
              className="px-3 py-1 bg-black text-white text-xs font-bold relative hover:bg-gray-800 transition-colors"
            >
              {t('results.filter').toUpperCase()}
              {filterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-throne-red text-white text-[10px] w-4 h-4 flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results List (hidden in full map view) */}
      {!isMapView && (
        <div className="flex-1 p-3">
          <div className="max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-500">
                {filtered.length} {t('common.results').toUpperCase()}
              </span>
              {filterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-throne-red font-bold"
                >
                  {t('common.clearFilters').toUpperCase()}
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white p-8 text-center">
                <p className="text-gray-500 mb-4">{t('common.noResults')}</p>
                <button
                  onClick={clearFilters}
                  className="bg-black text-white px-4 py-2 text-sm font-bold hover:bg-gray-800 transition-colors"
                >
                  {t('common.clearFilters').toUpperCase()}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((loc, index) => (
                  <LocationCard
                    key={loc.id}
                    t={t}
                    loc={loc}
                    index={index}
                    isSelected={selectedLocation === loc.id}
                    isExpanded={expanded === loc.id}
                    isSaved={savedSpots.includes(loc.id)}
                    user={user}
                    onSelect={() => {
                      setSelectedLocation(loc.id);
                      setMapCenter([loc.lat, loc.lng]);
                    }}
                    onToggleExpand={() => setExpanded(expanded === loc.id ? null : loc.id)}
                    onToggleSave={() => toggleSaveSpot(loc.id)}
                    onRate={() => handleRateSpot(loc)}
                    onShowReviews={() => handleShowReviews(loc)}
                    onGetDirections={() => getDirections(loc)}
                    onShare={() => shareSpot(loc)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer t={t} onContactClick={() => setShowContact(true)} />
    </div>
  );
};

export default Results;
