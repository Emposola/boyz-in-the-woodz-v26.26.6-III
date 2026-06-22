import React from 'react';
import SEO from '@/components/shared/SEO';
import HomeHero from '../components/home/HomeHero';
import HomeCrisis from '../components/home/HomeCrisis';
import HomeScience from '../components/home/HomeScience';
import ServeBlock from '../components/home/ServeBlock';
import HomeCode from '../components/home/HomeCode';
import HomeProducts from '../components/home/HomeProducts';
import HomeExperience from '../components/home/HomeExperience';
import HomeProof from '../components/home/HomeProof';
import HomeFinalCTA from '../components/home/HomeFinalCTA';

export default function Home() {
  return (
    <div className="pt-0">
      <SEO
        title={null}
        description="Boyz In The Woodz — Brotherhood. Freedom. Nature. Wilderness retreats for men who need space to breathe. Barber shop. Outdoor clothing. Science-backed reset through nature and brotherhood."
        canonical="/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'BOYZ IN THE WOODZ',
            url: 'https://boyzinthewoodz.com',
            logo: 'https://boyzinthewoodz.com/images/logos/logo-navbar-about.jpg',
            description: 'Brotherhood. Freedom. Nature. Wilderness retreats and clothing for men who need space to breathe.',
            sameAs: [
              'https://instagram.com/boyzinthewoodz',
              'https://tiktok.com/@boyzinthewoodz',
              'https://youtube.com/@boyzinthewoodz',
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'BOYZ IN THE WOODZ',
            url: 'https://boyzinthewoodz.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://boyzinthewoodz.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is Boyz In The Woodz?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Boyz In The Woodz is a brotherhood movement and clothing brand built for men who need space to breathe. We offer wilderness retreats, a barbershop, outdoor gear, and a loyalty points system — all grounded in science and brotherhood.',
                },
              },
              {
                '@type': 'Question',
                name: 'How do wilderness retreats help men\'s mental health?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Research shows 20 minutes in nature reduces cortisol by 21% (Cornell, 2019). Face-to-face connection cuts depression risk by 50% (Social Psychiatry Journal, 2021). Strong social ties lower mortality by 45% (PLOS Medicine, 2022). Our retreats deliver all three.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is The Code at Boyz In The Woodz?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The Code is five non-negotiable rules: No Phones, Show Up Physically, Respect Everyone, No Ego, and Leave Better. They create the trust and safety that allows real brotherhood to grow.',
                },
              },
            ],
          },
        ]}
      />

      {/* 1. Hero — Emotional hook + primary CTAs */}
      <HomeHero />

      {/* 2. Crisis — Iceberg + stats (the problem we solve) */}
      <HomeCrisis />

      {/* 3. Science — Why nature works (peer-reviewed proof) */}
      <HomeScience />

      {/* 4. Who We Serve — 4 personas */}
      <ServeBlock />

      {/* 5. The Code — 5 non-negotiables */}
      <HomeCode />

      {/* 6. Products — Survival Pack 01 + Retreat dual CTA */}
      <HomeProducts />

      {/* 7. Experience — Arrive → Unplug → Connect → Return */}
      <HomeExperience />

      {/* 8. Social Proof — Reviews + Numbers combined */}
      <HomeProof />

      {/* 9. Final CTA — The Final Truth */}
      <HomeFinalCTA />
    </div>
  );
}
