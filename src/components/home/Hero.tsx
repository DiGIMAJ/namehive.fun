
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="page-container">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Generate <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">Perfect Names</span> for Any Purpose
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 md:mb-10 animate-fade-in animation-delay-100">
            Create catchy, memorable, and unique names for your business, brand, character, or any creative project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 md:mb-12 animate-fade-in animation-delay-200">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 h-auto text-lg rounded-full shadow-lg hover:shadow-xl transition-all button-glow" asChild>
              <Link to="/sign-up">
                Create Free Account
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-100 px-8 py-6 h-auto text-lg rounded-full" asChild>
              <Link to="/generators">
                Explore Generators
              </Link>
            </Button>
          </div>
          
          <div className="text-gray-500 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm animate-fade-in animation-delay-300">
            <div className="flex items-center">
              <span className="size-2 rounded-full bg-green-500 mr-2"></span>
              100% Free to Use
            </div>
            <div className="flex items-center">
              <span className="size-2 rounded-full bg-green-500 mr-2"></span>
              70+ Specialized Generators
            </div>
            <div className="flex items-center">
              <span className="size-2 rounded-full bg-green-500 mr-2"></span>
              AI-Powered Suggestions
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden md:block absolute -bottom-40 left-0 right-0 h-48 bg-white rotate-2 -z-10"></div>
      <div className="hidden md:block absolute -bottom-40 left-0 right-0 h-48 bg-white -rotate-2 -z-10"></div>
    </section>
  );
};

export default Hero;
