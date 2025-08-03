import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
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
  onLocationChange?: (lat: number, lng: number) => void;
}

// Composant pour gérer les événements de clic sur la carte
const LocationMarker: React.FC<{
  position: [number, number];
  onLocationChange?: (lat: number, lng: number) => void;
  address: string;
}> = ({ position, onLocationChange, address }) => {
  const map = useMapEvents({
    click(e) {
      if (onLocationChange) {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return (
    <Marker 
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          if (onLocationChange) {
            onLocationChange(position.lat, position.lng);
          }
        },
      }}
    >
      <Popup>
        <div className="text-sm">
          <strong>Localisation du projet</strong>
          <br />
          {address}
          <br />
          <em className="text-xs text-gray-600">
            Cliquez sur la carte ou glissez le marqueur pour ajuster la position
          </em>
        </div>
      </Popup>
    </Marker>
  );
};

const MapView: React.FC<MapViewProps> = ({ latitude, longitude, address, onLocationChange }) => {
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
        <LocationMarker 
          position={[latitude, longitude]} 
          onLocationChange={onLocationChange}
          address={address}
        />
      </MapContainer>
    </div>
  );
};

export default MapView;