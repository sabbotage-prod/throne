import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Results from './pages/Results';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import useTranslation from './hooks/useTranslation';
import useGeolocation from './hooks/useGeolocation';
import { supabase, DEFAULT_SPOTS } from './lib/supabase';

function App() {
  const { t, language, setLanguage, languages } = useTranslation();
  const { getCurrentPosition } = useGeolocation();
  
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [savedSpots, setSavedSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [mapCenter, setMapCenter] = useState([48.8566, 2.3522]); // Paris default
  const [locationName, setLocationName] = useState('Paris');
  const [userLocation, setUserLocation] = useState(null);

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadSavedSpots(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadSavedSpots(session.user.id);
      } else {
        setUser(null);
        setSavedSpots([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load spots from database
  useEffect(() => {
    loadSpots();
  }, []);

  const loadSpots = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('spots')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Use default spots if database is empty or error
      setLocations(DEFAULT_SPOTS);
    } else {
      // Map 'Private' category to 'Business' for legacy data
      const mappedData = data.map(spot => ({
        ...spot,
        category: spot.category === 'Private' ? 'Business' : spot.category
      }));
      setLocations(mappedData);
    }
    setIsLoading(false);
  };

  const loadSavedSpots = async (userId) => {
    const { data } = await supabase
      .from('saved_spots')
      .select('spot_id')
      .eq('user_id', userId);
    
    if (data) {
      setSavedSpots(data.map(s => s.spot_id));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSavedSpots([]);
  };

  const handleLocationSelect = (coords, name) => {
    setMapCenter([coords.lat, coords.lng]);
    setLocationName(name);
  };

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="flex items-baseline gap-1 justify-center mb-4">
            <span className="text-3xl font-black">Throne</span>
            <span className="text-throne-red text-3xl font-black">/</span>
          </div>
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Landing
              t={t}
              language={language}
              languages={languages}
              setLanguage={setLanguage}
              user={user}
              onLogout={handleLogout}
              locations={locations}
              savedSpots={savedSpots}
              onLocationSelect={handleLocationSelect}
              onGetCurrentLocation={handleGetCurrentLocation}
            />
          }
        />
        <Route
          path="/results"
          element={
            <Results
              t={t}
              language={language}
              languages={languages}
              setLanguage={setLanguage}
              user={user}
              onLogout={handleLogout}
              locations={locations}
              setLocations={setLocations}
              savedSpots={savedSpots}
              setSavedSpots={setSavedSpots}
              mapCenter={mapCenter}
              setMapCenter={setMapCenter}
              locationName={locationName}
              setLocationName={setLocationName}
              userLocation={userLocation}
              setUserLocation={setUserLocation}
            />
          }
        />
        <Route path="/privacy" element={<Privacy t={t} />} />
        <Route path="/terms" element={<Terms t={t} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
