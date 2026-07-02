/* ============================================================
   BARBER TEAM — Premium Team Showcase — ULTRA SEO
   Redesigned | No Filters | Modal Popup | Fully Responsive
   ============================================================ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scissors, Shield, Trees, Star, Clock, Users, 
  Calendar, ChevronRight, Instagram, Twitter, 
  ArrowRight, User, Crown, Compass,
  X, MapPin, Award, Heart, Zap,
  BadgeCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import SEO from '@/components/shared/SEO';

// ============================================================
// ACTUAL TEAM MEMBERS — All 3 with full details
// ============================================================
const TEAM_MEMBERS = [
  {
    id: '1',
    name: 'Hector Castro',
    role: 'Co-Founder & Master Barber',
    slug: 'hector-castro',
    bio: 'With 15+ years of mastery behind the chair and a passion for building community, Hector brings precision, artistry, and heart to every cut.',
    fullBio: `Hector started his barbering journey at 18, learning the craft from his grandfather in a small shop in East LA. Over the years, he's honed his skills in some of the most respected barbershops across the country. Today, he's the heartbeat of BOYZ IN THE WOODZ — leading with integrity, precision, and a deep commitment to the craft.

When he's not behind the chair, Hector is mentoring young barbers, hosting community events, and spending time in the wilderness with his brothers.`,
    specialties: ['Precision Fades', 'Beard Sculpting', 'Hot Towel Shave', 'Hair Tattoos'],
    image_url: '/images/logos/team-photo.png',
    first_aid_certified: true,
    wilderness_certified: true,
    experience: '15+ years',
    rating: 5.0,
    reviews: 342,
    icon: Crown,
    iconColor: 'text-amber-400',
    social: {
      instagram: '@hectorcastro',
      twitter: '@hectorbarber'
    },
    availability: 'Mon-Fri 9am-7pm',
    certifications: ['Master Barber License', 'Wilderness First Aid', 'Advanced Fade Techniques'],
    funFact: 'Can identify any beard oil by smell alone'
  },
  {
    id: '2',
    name: 'Ryan Cooper',
    role: 'Co-Founder & Operations Lead',
    slug: 'ryan-cooper',
    bio: 'Ryan keeps the ship running and the culture strong. From operations to community building, he ensures every brother has what they need to thrive.',
    fullBio: `Ryan's background is in outdoor education and business operations. He spent 8 years leading wilderness therapy programs before co-founding BOYZ IN THE WOODZ. His unique blend of operational expertise and deep understanding of human connection makes him the backbone of the team.

Ryan is passionate about creating spaces where men can be authentic, vulnerable, and strong. He oversees everything from scheduling to community events, ensuring every client feels welcomed and valued.`,
    specialties: ['Classic Cuts', 'Community Building', 'Leadership', 'Business Strategy'],
    image_url: '/images/logos/team-photo.png',
    first_aid_certified: false,
    wilderness_certified: true,
    experience: '10+ years',
    rating: 4.9,
    reviews: 287,
    icon: Shield,
    iconColor: 'text-blue-400',
    social: {
      instagram: '@ryancooper',
      twitter: '@ryanwild'
    },
    availability: 'Mon-Sat 10am-6pm',
    certifications: ['Wilderness First Responder', 'Operations Management', 'Leadership Coaching'],
    funFact: 'Has summited all 14ers in Colorado'
  },
  {
    id: '3',
    name: 'Jess Wild',
    role: 'Wilderness Guide & Barber',
    slug: 'jess-wild',
    bio: 'With 12+ years in wilderness therapy and outdoor leadership, Jess brings deep expertise in nature-based healing and brotherhood.',
    fullBio: `Jess discovered his passion for the outdoors while working as a wilderness therapy guide in Utah. He realized that the same skills that help men thrive in nature — patience, presence, and purpose — also apply to the barber chair.

Today, Jess splits his time between the barbershop and guiding wilderness retreats. He believes that true transformation happens when we connect with nature and each other. His approach to barbering is grounded, intentional, and deeply healing.`,
    specialties: ['Nature-Based Healing', 'Wilderness Therapy', 'Mental Wellness', 'Meditative Cuts'],
    image_url: '/images/logos/team-photo.png',
    first_aid_certified: true,
    wilderness_certified: true,
    experience: '12+ years',
    rating: 5.0,
    reviews: 156,
    icon: Compass,
    iconColor: 'text-emerald-400',
    social: {
      instagram: '@jesswild',
      twitter: '@jessoutdoors'
    },
    availability: 'Tue-Sat 8am-8pm',
    certifications: ['Wilderness Therapy Guide', 'Mental Health First Aid', 'Advanced Survival Skills'],
    funFact: 'Can start a fire with a bow drill in under 5 minutes'
  }
];

// ============================================================
// SEO STRUCTURED DATA
// ============================================================
const generateTeamSchema = (members) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Our Team — BOYZ IN THE WOODZ',
  description: 'Meet the brotherhood behind BOYZ IN THE WOODZ. Master barbers and wilderness guides committed to brotherhood, freedom, and nature.',
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: members.map((member, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: member.name,
        jobTitle: member.role,
        description: member.bio,
        image: member.image_url,
        knowsAbout: member.specialties,
      }
    }))
  }
});

// ============================================================
// STAFF MODAL COMPONENT
// ============================================================
function StaffModal({ member, isOpen, onClose }) {
  if (!isOpen || !member) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-card max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border/50 shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="relative aspect-[2/1] overflow-hidden bg-secondary/30">
            <img 
              src={member.image_url} 
              alt={member.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <div className="flex items-center gap-2 mb-0.5">
                <member.icon className={`w-4 h-4 ${member.iconColor}`} />
                <h2 className="font-heading text-xl tracking-wider uppercase">
                  {member.name}
                </h2>
              </div>
              <p className="text-white/70 text-xs">{member.role}</p>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-white">{member.rating}</span>
              <span className="text-[10px] text-white/50">({member.reviews})</span>
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <h3 className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground/60 mb-1.5">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {member.fullBio || member.bio}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <p className="text-[8px] font-heading tracking-wider uppercase text-muted-foreground/50">Experience</p>
                <p className="text-sm font-semibold text-foreground">{member.experience}</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3 text-center">
                <p className="text-[8px] font-heading tracking-wider uppercase text-muted-foreground/50">Availability</p>
                <p className="text-sm font-semibold text-foreground">{member.availability}</p>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground/60 mb-1.5">Specialties</h3>
              <div className="flex flex-wrap gap-1.5">
                {member.specialties?.map((s) => (
                  <span key={s} className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground/60 mb-1.5">Certifications</h3>
              <div className="flex flex-wrap gap-1.5">
                {member.certifications?.map((cert) => (
                  <span key={cert} className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                    <BadgeCheck className="w-3 h-3" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {member.funFact && (
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <p className="text-[8px] font-heading tracking-wider uppercase text-muted-foreground/50 mb-0.5">Fun Fact</p>
                <p className="text-sm text-muted-foreground">✨ {member.funFact}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-border/30">
              {member.social?.instagram && (
                <a 
                  href={`https://instagram.com/${member.social.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {member.social?.twitter && (
                <a 
                  href={`https://twitter.com/${member.social.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              <div className="flex-1" />
              <Button asChild size="sm" className="font-heading tracking-wider uppercase text-[10px]">
                <Link to="/barber/book">
                  <Calendar className="w-3 h-3 mr-1.5" />
                  Book {member.name.split(' ')[0]}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function BarberTeam() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamSchema = generateTeamSchema(TEAM_MEMBERS);

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setSelectedMember(null), 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Our Team — BOYZ IN THE WOODZ | Master Barbers & Wilderness Guides"
        description="Meet the brotherhood behind BOYZ IN THE WOODZ. Master barbers, wilderness guides, and community leaders committed to brotherhood, freedom, and nature."
        canonical="/barber/team"
        jsonLd={teamSchema}
      />

      {/* ─── HERO ─── */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[200px] -translate-y-1/2" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Scissors className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-heading tracking-[0.3em] text-primary uppercase">Our Brotherhood</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl tracking-wide uppercase text-foreground leading-[0.95] mb-3">
              Meet The{' '}
              <span className="text-primary">Team</span>
            </h1>

            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed px-2">
              Three brothers. One mission. Master barbers and wilderness guides committed to 
              brotherhood, freedom, and nature.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mt-6">
              {[
                { value: TEAM_MEMBERS.length, label: 'Team Members', icon: Users },
                { value: TEAM_MEMBERS.filter(b => b.first_aid_certified || b.wilderness_certified).length, label: 'Certified', icon: Shield },
                { value: `${(TEAM_MEMBERS.reduce((sum, b) => sum + b.rating, 0) / TEAM_MEMBERS.length).toFixed(1)}★`, label: 'Avg Rating', icon: Star },
                { value: '37+', label: 'Years Combined', icon: Clock },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <stat.icon className="w-3.5 h-3.5 text-primary/50" />
                    <span className="font-heading text-xl md:text-2xl text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground font-heading tracking-wider uppercase">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TEAM GRID ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {TEAM_MEMBERS.map((member, index) => {
            const Icon = member.icon || User;
            
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                onClick={() => openModal(member)}
              >
                {/* ── Image ── */}
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary/20">
                  <img 
                    src={member.image_url} 
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-white">{member.rating}</span>
                    <span className="text-[10px] text-white/50">({member.reviews})</span>
                  </div>

                  {/* Certification Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {member.first_aid_certified && (
                      <span className="text-[8px] bg-red-500/80 text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-medium backdrop-blur-sm">
                        <Heart className="w-2.5 h-2.5" /> First Aid
                      </span>
                    )}
                    {member.wilderness_certified && (
                      <span className="text-[8px] bg-emerald-500/80 text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-medium backdrop-blur-sm">
                        <Trees className="w-2.5 h-2.5" /> Wilderness
                      </span>
                    )}
                  </div>

                  {/* Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${member.iconColor}`} />
                      <h3 className="font-heading text-lg text-white tracking-wider uppercase">
                        {member.name}
                      </h3>
                    </div>
                    <p className="text-white/60 text-xs font-heading tracking-wider uppercase">
                      {member.role}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {member.experience}
                      </span>
                      <span className="w-px h-3 bg-white/10" />
                      <span className="truncate max-w-[120px]">{member.specialties?.[0]}</span>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-heading text-sm tracking-wider uppercase flex items-center gap-2">
                      View Profile
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* ── Quick Info ── */}
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialties?.slice(0, 2).map((s) => (
                      <span key={s} className="text-[10px] bg-secondary/50 text-muted-foreground px-2.5 py-1 rounded-full font-medium">
                        {s}
                      </span>
                    ))}
                    {member.specialties?.length > 2 && (
                      <span className="text-[10px] text-muted-foreground/50 px-1">
                        +{member.specialties.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-muted-foreground/50 font-heading tracking-wider uppercase flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {member.availability}
                    </span>
                    <span className="text-[9px] text-primary font-heading tracking-wider uppercase flex items-center gap-1">
                      Tap for details
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: Shield, label: '100% Certified', desc: 'All team members certified' },
            { icon: Award, label: 'Award Winning', desc: 'Recognized for excellence' },
            { icon: Heart, label: 'Community Built', desc: 'Built on brotherhood' },
            { icon: Zap, label: 'Book in 60s', desc: 'Easy online booking' },
          ].map((item, i) => (
            <div key={i} className="text-center p-3 md:p-4 bg-secondary/20 rounded-xl border border-border/20">
              <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary/40 mx-auto mb-1.5" />
              <p className="text-[9px] md:text-[10px] font-heading tracking-wider uppercase text-foreground">{item.label}</p>
              <p className="text-[7px] md:text-[8px] text-muted-foreground/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-12 md:py-16 bg-secondary/30 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Scissors className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-3" />
            <h2 className="font-heading text-2xl md:text-4xl tracking-wide uppercase mb-2">
              Ready for Your Cut?
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-5">
              Experience the brotherhood. Book a cut with one of our master barbers today.
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              <Button asChild size="lg" className="font-heading tracking-wider uppercase text-xs md:text-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group">
                <Link to="/barber/book">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
                  Book Appointment
                  <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-heading tracking-wider uppercase text-xs md:text-sm">
                <Link to="/grooming-lodge">View Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── MODAL ─── */}
      <StaffModal 
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}