
import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/home/Hero';
import GeneratorsSection from '@/components/home/GeneratorsSection';
import HowItWorks from '@/components/home/HowItWorks';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/layout/Footer';
import CategorySection from '@/components/home/CategorySection';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <CategorySection />
        <GeneratorsSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
