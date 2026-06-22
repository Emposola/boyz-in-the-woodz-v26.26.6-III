/* ============================================================
   LOCATION MAP — Embeds Google Maps for 457 West St, Keene NH
   Used on Homepage and Contact page
   ============================================================ */
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Star, ExternalLink } from 'lucide-react';

const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2929.2!2d-72.281!3d42.941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e04bab27073b3f%3A0x312b4098c4d916f9!2s457%20West%20St%2C%20Keene%2C%20NH%2003431!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus';
const MAPS_LINK = 'https://maps.google.com/?q=457+West+St,+Keene,+NH+03431';
const REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJP-MHp6xb4okR-RbZxJhAKzE';
const YELP_URL = 'https://www.yelp.com/biz/boyz-in-the-woodz';

export default function LocationMap({ compact = false }) {
  return (
    <section className={`${compact ? 'py-10' : 'py-16'} bg-background`}>
      <div className="max-w-7xl mx-auto px-4">
        {!compact && (
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Find Us</span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mt-2">Visit The Chair</h2>
            <p className="text-sm text-muted-foreground mt-2">Walk-ins welcome. Same-day slots usually open.</p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map embed */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl overflow-hidden border border-border shadow-lg">
            <iframe
              src={GOOGLE_MAPS_EMBED}
              width="100%"
              height={compact ? "300" : "400"}
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Boyz In The Woodz — 457 West St, Keene, NH"
            />
          </motion.div>

          {/* Info card */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h3 className="font-heading text-xl tracking-wider uppercase">The Chair — Keene</h3>
                <p className="text-xs text-primary font-heading tracking-wider uppercase mt-0.5">Main Location</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">457 West St</p>
                    <p className="text-xs text-muted-foreground">Keene, NH 03431</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Mon–Fri: 9am – 7pm</p>
                    <p className="text-xs text-muted-foreground">Sat: 8am – 5pm</p>
                    <p className="text-xs text-muted-foreground">Sun: Closed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href="tel:+16035550100" className="text-sm hover:text-primary transition-colors">(603) 555-0100</a>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-heading tracking-wider uppercase hover:bg-yellow-500/20 transition-colors">
                <Star className="w-4 h-4 fill-yellow-400" /> Leave Us a Google Review
              </a>
              <a href={YELP_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-900/20 border border-red-800/40 text-red-400 text-sm font-heading tracking-wider uppercase hover:bg-red-900/30 transition-colors">
                <Star className="w-4 h-4" /> Review on Yelp
              </a>
              <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-secondary border border-border text-muted-foreground text-xs font-heading tracking-wider uppercase hover:text-primary hover:border-primary/40 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Get Directions
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}