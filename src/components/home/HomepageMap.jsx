/* Google-style map section on homepage — Leaflet based */
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { MapPin, Trees, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LOCATIONS = [
  { lat: 34.1290, lng: -94.7360, name: 'Broken Bow Retreat', type: 'retreat', desc: 'Our flagship retreat location in SE Oklahoma' },
  { lat: 29.1275, lng: -103.2425, name: 'Big Bend Basecamp', type: 'retreat', desc: 'Desert stars and cold mornings' },
  { lat: 30.2672, lng: -97.7431, name: 'The Chair — Austin', type: 'barber', desc: 'Flagship barbershop' },
  { lat: 29.7604, lng: -95.3698, name: 'The Chair — Houston', type: 'barber', desc: 'Houston brotherhood hub' },
  { lat: 32.7767, lng: -96.7970, name: 'The Chair — Dallas', type: 'barber', desc: 'Deep Ellum location' },
];

export default function HomepageMap() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Where We Are</span>
          <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mt-2">The Brotherhood Map</h2>
          <p className="text-sm text-muted-foreground mt-2">Retreats, barbershops, and chapters across the country.</p>
        </motion.div>

        <div className="flex gap-4 justify-center mb-5 flex-wrap">
          {[{ label: 'Retreats', icon: Trees, color: 'text-primary' }, { label: 'Barbershops', icon: Scissors, color: 'text-accent' }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5 text-sm">
              <l.icon className={`w-4 h-4 ${l.color}`} /> <span>{l.label}</span>
            </div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-border h-80 md:h-96">
          <MapContainer center={[32, -97]} zoom={5} style={{ height: '100%', width: '100%' }} className="z-0">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {LOCATIONS.map(loc => (
              <Marker key={loc.name} position={[loc.lat, loc.lng]}>
                <Popup className="font-body">
                  <div className="text-sm font-semibold">{loc.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{loc.desc}</div>
                  <div className={`text-xs mt-1 font-heading uppercase tracking-wider ${loc.type === 'retreat' ? 'text-green-600' : 'text-amber-600'}`}>
                    {loc.type === 'retreat' ? '🌲 Retreat' : '✂️ Barbershop'}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        <div className="text-center mt-6">
          <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-xs">
            <Link to="/locations">View All Locations <MapPin className="w-3.5 h-3.5 ml-1.5" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}