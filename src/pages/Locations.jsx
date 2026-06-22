/* ============================================================
   LOCATIONS — Map showing retreat sites, barbershop, pop-ups
   Uses React-Leaflet for interactive map
   ============================================================ */
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/supabaseClient';
import { motion } from 'framer-motion';
import { MapPin, Trees, Scissors, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import SEO from '@/components/shared/SEO';

/* --- Fix Leaflet marker icon issue --- */
import L from 'leaflet';
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* --- Fallback locations when DB is empty --- */
const FALLBACK_LOCATIONS = [
  { id: 'l1', name: 'The Chair — Flagship', type: 'barbershop', address: '1234 Brotherhood Ave, Austin, TX', lat: 30.267, lng: -97.743, hours: 'Tue-Sat 9am-7pm, Sun 10am-4pm', description: 'Our home base. Where the magic happens.' },
  { id: 'l2', name: 'Broken Bow Retreat Site', type: 'retreat', address: 'Beavers Bend State Park, OK', lat: 34.164, lng: -94.729, description: 'Dense forest, creek access, fire pits. Our flagship retreat location.' },
  { id: 'l3', name: 'Big Bend Basecamp', type: 'retreat', address: 'Big Bend National Park, TX', lat: 29.25, lng: -103.25, description: 'Desert wilderness. Stars like you\'ve never seen.' },
  { id: 'l4', name: 'Pop-Up: Dallas Market', type: 'popup', address: 'Deep Ellum, Dallas, TX', lat: 32.783, lng: -96.783, description: 'Seasonal gear pop-up and mini grooming station.' },
];

const TYPE_ICONS = { retreat: Trees, barbershop: Scissors, popup: MapPin };
const TYPE_COLORS = { retreat: 'text-green-400', barbershop: 'text-accent', popup: 'text-primary' };

export default function Locations() {
  const [selected, setSelected] = useState(null);

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => api.entities.Location.filter({ active: true }),
    initialData: [],
  });

  const displayLocations = locations.length > 0 ? locations : FALLBACK_LOCATIONS;

  return (
    <div className="min-h-screen">
      <SEO title="Locations — Find Your Reset" description="Locations for resets, retreats, and brotherhood meetups across the country." canonical="/locations" />
      {/* --- Hero --- */}
      <section className="py-12 md:py-16 bg-secondary/30 text-center">
        <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
        <h1 className="font-heading text-4xl md:text-5xl tracking-wide uppercase">Locations</h1>
        <p className="text-muted-foreground text-sm mt-2">Retreat sites, The Chair, and pop-up events.</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        {/* --- Map --- */}
        <div className="lg:col-span-2 h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-border">
          <MapContainer
            center={[32.0, -98.0]}
            zoom={5}
            className="h-full w-full"
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap, &copy; CARTO'
            />
            {displayLocations.filter(l => l.lat && l.lng).map(loc => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={defaultIcon}
                eventHandlers={{ click: () => setSelected(loc) }}
              >
                <Popup>
                  <div className="text-xs">
                    <strong>{loc.name}</strong><br />
                    {loc.address}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* --- Location List --- */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {displayLocations.map(loc => {
            const Icon = TYPE_ICONS[loc.type] || MapPin;
            const color = TYPE_COLORS[loc.type] || 'text-primary';
            return (
              <motion.button
                key={loc.id}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => setSelected(loc)}
                className={`w-full text-left bg-card border rounded-lg p-4 transition-colors ${selected?.id === loc.id ? 'border-primary' : 'border-border hover:border-primary/30'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground">{loc.type}</span>
                </div>
                <h3 className="text-sm font-medium">{loc.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{loc.address}</p>
                {loc.hours && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {loc.hours}
                  </p>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* --- Selected Detail --- */}
      {selected && (
        <section className="max-w-3xl mx-auto px-4 pb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-heading text-xl tracking-wider uppercase">{selected.name}</h2>
            <p className="text-sm text-muted-foreground mt-2">{selected.description}</p>
            {selected.address && <p className="text-xs text-muted-foreground mt-2">{selected.address}</p>}
          </div>
        </section>
      )}
    </div>
  );
}