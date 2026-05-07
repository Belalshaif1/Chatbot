import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Hero from '@/sections/Hero';
import TrustedBy from '@/sections/TrustedBy';
import Features from '@/sections/Features';
import HowItWorks from '@/sections/HowItWorks';
import Showcase from '@/sections/Showcase';
import Testimonials from '@/sections/Testimonials';
import Pricing from '@/sections/Pricing';
import CTABanner from '@/sections/CTABanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-bc-bg">
      <Navigation />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <Showcase />
        <Testimonials />
        <Pricing />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
