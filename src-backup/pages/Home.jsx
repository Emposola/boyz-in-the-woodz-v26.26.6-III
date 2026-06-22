import React from 'react';
import HeroSplit from '../components/home/HeroSplit';
import MissionBanner from '../components/home/MissionBanner';
import FeaturedProducts from '../components/home/FeaturedProducts';
import LoyaltyExplainer from '../components/home/LoyaltyExplainer';
import SocialProofStrip from '../components/home/SocialProofStrip';
import ImpactCounters from '../components/home/ImpactCounters';
import UpcomingEventsStrip from '../components/home/UpcomingEventsStrip';
import HomepageMap from '../components/home/HomepageMap';
import HomeFeatureBlocks from '../components/home/HomeFeatureBlocks';
import CrossBrandCTA from '../components/home/CrossBrandCTA';
import LiveBrotherhoodFeed from '../components/home/LiveBrotherhoodFeed';
import BrotherhoodNumbers from '../components/home/BrotherhoodNumbers';

export default function Home() {
  return (
    <div>
      <HeroSplit />
      <SocialProofStrip />
      <BrotherhoodNumbers />
      <MissionBanner />
      <LiveBrotherhoodFeed />
      <ImpactCounters />
      <FeaturedProducts business="boyz" title="Survival Pack 01" subtitle="Gear forged in the woods. Worn as proof." />
      <CrossBrandCTA />
      <LoyaltyExplainer />
      <UpcomingEventsStrip />
      <HomeFeatureBlocks />
      <HomepageMap />
    </div>
  );
}