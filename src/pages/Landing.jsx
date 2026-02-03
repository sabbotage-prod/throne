import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddressAutocomplete from '../components/AddressAutocomplete';
import InstallPrompt from '../components/InstallPrompt';
import AuthModal from '../components/AuthModal';
import ContactModal from '../components/ContactModal';
import SavedSpotsModal from '../components/SavedSpotsModal';
import { CATEGORIES } from '../lib/supabase';

const Landing = ({
  t,
  language,
  languages,
  setLanguage,
  user,
  onLogout,
  locations,
  savedSpots,
  onLocationSelect,
  onGetCurrentLocation
}) => {
  const navigate = useNavigate();
  const [locationSearch, setLocationSearch] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showContact, setShowContact] = useState(false);
  const [showMySpots, setShowMySpots] = useState(null);

  const userSpots = user ? locations.filter(l => l.user_id === user.id) : [];
  const totalReviews = locations.reduce((sum, l) => sum + (l.reviews || 0), 0);

  const handleAddressChange = (val, coords) => {
    setLocationSearch(val);
    if (coords) {
      onLocationSelect(coords, val.split(',')[0]);
      navigate('/results');
    }
  };

  const handleCurrentLocation = () => {
    onGetCurrentLocation();
    navigate('/results');
  };

  const handleExplore = () => {
    navigate('/results');
  };

  const handleSelectSpot = (spot) => {
    onLocationSelect({ lat: spot.lat, lng: spot.lng }, spot.name);
    navigate('/results');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Modals */}
      {showAuth && (
        <AuthModal
          t={t}
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
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
          onSelectSpot={handleSelectSpot}
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
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <div className="max-w-md mx-auto w-full">
          {/* Headline */}
          <div className="mb-8">
            <h1 className="text-4xl font-black leading-tight mb-2">
              {t('landing.headline1')}<br />
              {t('landing.headline2')}<br />
              {t('landing.headline3')}
            </h1>
            <p className="text-gray-500 text-sm">{t('common.tagline')}</p>
          </div>

          {/* Category Legend */}
          <div className="flex gap-4 mb-8">
            {Object.entries(CATEGORIES).map(([name, colors]) => (
              <div key={name} className="flex items-center gap-2">
                <div className="w-4 h-4" style={{ backgroundColor: colors.bg }} />
                <span className="text-xs font-bold">
                  {t(`categories.${colors.key}`).toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="mb-4">
            <AddressAutocomplete
              value={locationSearch}
              onChange={handleAddressChange}
              placeholder={t('landing.searchPlaceholder')}
              className="w-full border-2 border-black p-4 text-sm"
            />
          </div>

          {/* Current Location Button */}
          <button
            onClick={handleCurrentLocation}
            className="w-full border-2 border-black p-4 font-bold text-sm mb-3 hover:bg-throne-lightgray flex items-center justify-center gap-2 transition-colors"
          >
            ◉ {t('landing.useCurrentLocation').toUpperCase()}
          </button>

          {/* Explore Button */}
          <button
            onClick={handleExplore}
            className="w-full bg-black text-white p-4 font-bold text-sm hover:bg-gray-800 transition-colors mb-4"
          >
            {t('landing.exploreCity').toUpperCase()} →
          </button>

          {/* Install Prompt */}
          <InstallPrompt t={t} />

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8 text-center">
            <div>
              <span className="text-2xl font-black">{locations.length}</span>
              <span className="text-xs text-gray-500 block">
                {t('landing.spots').toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-2xl font-black">{totalReviews}</span>
              <span className="text-xs text-gray-500 block">
                {t('landing.reviews').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer t={t} onContactClick={() => setShowContact(true)} />
    </div>
  );
};

export default Landing;
