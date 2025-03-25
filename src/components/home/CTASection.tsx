
import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-30"></div>

      <div className="page-container relative z-10">
        <div className="glass-purple max-w-4xl mx-auto p-10 md:p-16 rounded-3xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Name?
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10">
              Join thousands of entrepreneurs, marketers, and creators who use Name Hive to create memorable names for their projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 shadow-lg shadow-purple-200 hover:shadow-purple-300">
                Start Generating Names
              </Button>
              <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 px-8 py-6 rounded-full text-lg font-medium transition-all duration-300">
                View All Generators
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
