/* ============================================================
   BARBER GALLERY — Before/after photos with lightbox
   Image grid showcasing haircuts and beard work
   ============================================================ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, X } from 'lucide-react';

/* --- Sample gallery images (placeholders) --- */
const GALLERY_IMAGES = [
  { id: 1, url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&q=80', caption: 'Clean fade with sharp lineup' },
  { id: 2, url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80', caption: 'Classic taper cut' },
  { id: 3, url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', caption: 'Hot towel shave experience' },
  { id: 4, url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80', caption: 'Precision beard sculpting' },
  { id: 5, url: 'https://images.unsplash.com/photo-1585747860019-8007580e2f14?w=600&q=80', caption: 'The Chair atmosphere' },
  { id: 6, url: 'https://images.unsplash.com/photo-1596728325478-17f1e0acda3b?w=600&q=80', caption: 'Fresh cut, fresh start' },
];

export default function BarberGallery() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen">
      {/* --- Hero --- */}
      <section className="py-16 md:py-20 bg-secondary/30 text-center">
        <Scissors className="w-8 h-8 text-accent mx-auto mb-3" />
        <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase">Gallery</h1>
        <p className="text-muted-foreground text-sm mt-2">Proof is in the cut.</p>
      </section>

      {/* --- Image Grid --- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.button
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setLightbox(img)}
              className="relative aspect-square overflow-hidden rounded-lg bg-secondary group cursor-pointer"
            >
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                <span className="text-white text-xs p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  {img.caption}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* --- Lightbox --- */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={lightbox.url}
              alt={lightbox.caption}
              className="max-w-full max-h-[85vh] rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}