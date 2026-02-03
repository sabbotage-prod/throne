import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CATEGORIES } from '../lib/supabase';

const Map = ({
  t,
  spots,
  selectedSpot,
  userLocation,
  mapCenter,
  onSpotSelect,
  isFullView = false,
  onToggleView
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const [selectedPopupSpot, setSelectedPopupSpot] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView(mapCenter, 13);
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO'
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(mapCenter, 14);
    }
  }, [mapCenter]);

  // Update user marker
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: 'user-marker',
      html: `
        <div class="user-marker-pulse" style="
          background: #E53935;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(229,57,53,0.5);
        "></div>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    userMarkerRef.current = L.marker(userLocation, { 
      icon: userIcon, 
      zIndexOffset: 1000 
    })
      .addTo(mapInstanceRef.current)
      .bindPopup('<strong>You</strong>');
  }, [userLocation]);

  // Update spot markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    spots.forEach((spot, index) => {
      const colors = CATEGORIES[spot.category] || CATEGORIES.Public;
      const isSelected = selectedSpot === spot.id;

      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background: ${colors.bg};
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 900;
            color: ${colors.text};
            border: ${isSelected ? '3px solid black' : 'none'};
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          ">
            ${String(index + 1).padStart(2, '0')}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([spot.lat, spot.lng], { icon: markerIcon })
        .addTo(mapInstanceRef.current);

      marker.on('click', () => {
        if (isFullView) {
          setSelectedPopupSpot(spot);
        } else {
          onSpotSelect(spot);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if multiple spots and no selection
    if (spots.length > 1 && !selectedSpot) {
      const bounds = L.latLngBounds(spots.map(s => [s.lat, s.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    }
  }, [spots, selectedSpot, isFullView]);

  // Resize map when view changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [isFullView]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className={`w-full z-0 transition-all duration-300 ${isFullView ? 'h-[60vh]' : 'h-56'}`}
      />

      {/* View Toggle Button */}
      <button
        onClick={onToggleView}
        className="absolute top-2 right-2 bg-white border-2 border-black px-3 py-1 text-xs font-bold z-[500] hover:bg-black hover:text-white transition-colors"
      >
        {isFullView ? t('results.listView') : t('results.mapView')}
      </button>

      {/* Category Legend */}
      <div className="absolute bottom-2 left-2 bg-white/95 px-2 py-1 text-[10px] z-[500] flex gap-3">
        {Object.entries(CATEGORIES).map(([name, colors]) => (
          <div key={name} className="flex items-center gap-1">
            <div className="w-3 h-3" style={{ backgroundColor: colors.bg }} />
            <span className="font-bold">{t(`categories.${colors.key}`)}</span>
          </div>
        ))}
      </div>

      {/* Popup Card for Full View */}
      {isFullView && selectedPopupSpot && (
        <div className="absolute bottom-16 left-4 right-4 bg-white border-2 border-black p-4 z-[600] shadow-lg max-w-sm mx-auto">
          <button
            onClick={() => setSelectedPopupSpot(null)}
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            ×
          </button>
          
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center text-sm font-black shrink-0"
              style={{ 
                backgroundColor: CATEGORIES[selectedPopupSpot.category]?.bg,
                color: CATEGORIES[selectedPopupSpot.category]?.text
              }}
            >
              {selectedPopupSpot.rating || 0}★
            </div>
            <div className="min-w-0">
              <h3 className="font-black truncate">{selectedPopupSpot.name}</h3>
              <p className="text-xs text-gray-500 truncate">{selectedPopupSpot.address}</p>
              <p className="text-xs text-gray-600 mt-1">{selectedPopupSpot.distance}km away</p>
            </div>
          </div>

          <button
            onClick={() => {
              onSpotSelect(selectedPopupSpot);
              setSelectedPopupSpot(null);
            }}
            className="mt-3 w-full py-2 bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors"
          >
            {t('spot.readMore')} →
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;
