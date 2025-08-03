import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  latitude: number;
  longitude: number;
  address: string;
}

const MapView: React.FC<MapViewProps> = ({ latitude, longitude, address }) => {
  useEffect(() => {
    // Force le redimensionnement de la carte après le montage
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
    
    return () => clearTimeout(timer);
  }, [latitude, longitude]);

  return (
    <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        key={`${latitude}-${longitude}`}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          maxZoom={19}
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <div className="text-sm">
              <strong>Localisation du projet</strong>
              <br />
              {address}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;