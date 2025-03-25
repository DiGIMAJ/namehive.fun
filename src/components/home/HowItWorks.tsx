
import { 
  Search, 
  Settings2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';
import FeatureCard from './FeatureCard';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="page-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Name Hive Works</h2>
          <p className="text-xl text-gray-600">
            Our intelligent name generators use advanced algorithms to create perfect names for any purpose.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={Search}
            title="1. Choose Generator"
            description="Select from our specialized generators tailored for businesses, products, domains, and more."
          />
          <FeatureCard
            icon={Settings2}
            title="2. Set Parameters"
            description="Customize your results by setting preferences like length, style, industry, and more."
          />
          <FeatureCard
            icon={Sparkles}
            title="3. Generate Names"
            description="Our AI instantly creates a list of unique, catchy, and relevant name options."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="4. Verify Availability"
            description="Check domain availability and trademark status before finalizing your choice."
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
