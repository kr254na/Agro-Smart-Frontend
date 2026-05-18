import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Farm } from './FarmCard';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const customIcon = L.divIcon({
  html: `<svg width="25" height="41" viewBox="0 0 25 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 0C5.59645 0 0 5.59645 0 12.5C0 21.875 12.5 40.625 12.5 40.625C12.5 40.625 25 21.875 25 12.5C25 5.59645 19.4036 0 12.5 0Z" fill="var(--color-primary)"/><circle cx="12.5" cy="12.5" r="5" fill="black"/></svg>`,
  className: '',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapUpdater({ farms }: { farms: Farm[] }) {
  const map = useMap();
  useEffect(() => {
    const validFarms = farms.filter(f => f.latitude != null && f.longitude != null);
    if (validFarms.length > 0) {
      const bounds = L.latLngBounds(validFarms.map((f) => [f.latitude, f.longitude] as [number, number]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [farms, map]);
  return null;
}

export default function FarmMap({ farms }: { farms: Farm[] }) {
  // Filter for farms that actually have location data
  const validFarms = farms.filter(f => f.latitude != null && f.longitude != null);
  const center: [number, number] = validFarms.length > 0 
    ? [validFarms[0].latitude, validFarms[0].longitude] 
    : [26.8467, 80.9462]; // Default Lucknow

  return (
    <div className="w-full h-full min-h-[300px] z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater farms={farms} />
        {validFarms.map((farm) => (
          <Marker key={farm.id} position={[farm.latitude, farm.longitude]} icon={customIcon}>
            <Popup>
              <div className="text-primary-foreground font-bold">{farm.farmName}</div>
              <div className="text-xs text-muted-foreground">{farm.totalArea} Acres</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}