/* ============================================================
   MISSION BANNER — Common mission statement on homepage
   "A man needs a cut and a reset" — ecosystem explainer
   ============================================================ */
import React from 'react';
import { motion } from 'framer-motion';

export default function MissionBanner() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative line */}
          <div className="w-12 h-px bg-primary mx-auto mb-6" />

          <h2 className="font-accent text-2xl md:text-3xl lg:text-4xl text-foreground italic leading-snug">
            "You don't need to escape your life. You just need a place to breathe."
          </h2>
          <p className="mt-6 text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Boyz In The Woodz is a brotherhood movement for men who are great at taking care of 
            everyone else and terrible at filling their own cup. Wilderness retreats. Outdoor gear. 
            A community that shows up — in the woods and in real life.
          </p>

          {/* Stats Row */}
          <div className="mt-12 grid grid-cols-3 gap-6 md:gap-12">
            {[
              { value: '21%', label: 'Cortisol drop in 20 min outdoors' },
              { value: '5,000+', label: 'Brotherhood members strong' },
              { value: '10pts', label: 'Per dollar earned everywhere' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="font-heading text-3xl md:text-4xl text-primary">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}