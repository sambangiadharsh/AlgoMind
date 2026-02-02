import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import PreviewSection from '../components/landing/PreviewSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';

const LandingPage = () => {
  return (
    <div className="space-y-16 md:space-y-24 overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PreviewSection />
      <TestimonialsSection />
    </div>
  );
};

export default LandingPage;