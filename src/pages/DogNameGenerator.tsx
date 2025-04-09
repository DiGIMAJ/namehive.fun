import { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw, Info, Heart, Dog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface GeneratedName {
  name: string;
  meaning: string;
  personality_traits: string[];
  why_it_fits: string;
  name_origin: string;
}

const DogNameGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [description, setDescription] = useState<string>('');
  const [tone, setTone] = useState<string>('fun');
  const [numberOfNames, setNumberOfNames] = useState<string>('7');
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // SEO Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Dog Name Generator",
    "description": "Generate unique and creative dog names with our AI-powered tool.",
    "applicationCategory": "Utility",
    "offers": {
      "@type": "Offer",
      "price": "0"
    }
  };

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I choose the perfect name for my dog?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Consider your dog's personality, appearance, and breed. Choose a name that's easy to pronounce, distinct from commands, and one you'll be comfortable calling at the dog park."
        }
      },
      {
        "@type": "Question",
        "name": "What are popular dog naming trends in 2023?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Popular trends include nature-inspired names, human names, pop culture references, and names that reflect your dog's heritage or breed origin."
        }
      },
      {
        "@type": "Question",
        "name": "Should dog names be one or two syllables?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While one or two syllable names are easier for dogs to recognize, any length name can work well if it's distinct from common commands."
        }
      }
    ]
  };

  const generateNames = useCallback(async () => {
    if (!description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a description of your dog",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const systemPrompt = `You are an AI specializing in generating creative and adorable dog names based on user input. You will receive a user prompt describing the desired dog name generation task. Your task is to generate a list of names based on the prompt.
You MUST respond with a valid JSON structure containing an array of name objects:
{
  "names": [
    {
      "name": "Max",
      "meaning": "Greatest or maximum",
      "personality_traits": ["Loyal", "Energetic", "Friendly"],
      "why_it_fits": "The name reflects the dog's boundless energy and loyal nature",
      "name_origin": "Latin, short form of Maximilian meaning 'greatest'"
    }
  ]
}`;

      const userPrompt = `Generate ${numberOfNames || 5} unique, creative, and adorable dog name ideas. The names should be:
- Cute, catchy, and easy to say
- Suitable for a dog with these personality traits: ${description}
- Based on the following tone: ${tone}`;

      const response = await fetch('https://groq-webhook-worker.digimajbusinessenterprise.workers.dev/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to generate names. Status: ${response.status}. ${errorText}`);
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);
      
      // Extract the actual content based on the response format
      // Handle both Cloudflare Worker and Express server formats
      const content = responseData.choices ? 
        responseData.choices[0].message.content : // Cloudflare Worker format
        responseData.content || responseData.text; // Express server format or fallback
      
      console.log('Extracted content:', content);
      
      try {
        // Try to find and parse JSON in the content
        let parsedData;
        
        if (typeof content === 'string') {
          // Look for JSON object in the content string
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No valid JSON found in response content');
          }
        } else if (typeof content === 'object') {
          // If content is already an object, use it directly
          parsedData = content;
        } else if (responseData.names && Array.isArray(responseData.names)) {
          // Direct names array in the response
          parsedData = responseData;
        } else {
          throw new Error('Unable to extract valid data from response');
        }
        
        // Validate and set the generated names
        if (parsedData && parsedData.names && Array.isArray(parsedData.names)) {
          setGeneratedNames(parsedData.names);
        } else {
          console.error('Invalid response structure:', parsedData);
          throw new Error('Invalid response format: Missing "names" array');
        }
      } catch (parseError) {
        console.error('Error parsing response:', parseError, responseData, content);
        toast({
          title: "Error",
          description: "Failed to parse the generated names. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating names:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate names. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [description, tone, numberOfNames, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateNames();
  };

  const handleCopy = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${description} copied to clipboard`,
    });
  };

  const toggleCardExpansion = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  // Add Adsterra Social Bar script to the page
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//pl26337968.profitableratecpm.com/d1/c3/4b/d1c34b54771a008765d3faaae652ce6d.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>AI Dog Name Generator | Perfect Dog Names | Name Hive</title>
        <meta name="description" content="Generate creative and unique dog names with our AI-powered tool. Find the perfect name for your canine companion based on personality and breed." />
        <meta name="keywords" content="dog name generator, puppy names, dog names, canine names, pet names for dogs, AI dog names" />
        <meta property="og:title" content="AI Dog Name Generator | Perfect Dog Names | Name Hive" />
        <meta property="og:description" content="Find the perfect name for your canine companion with our AI-powered dog name generator." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Dog Name Generator | Name Hive" />
        <meta name="twitter:description" content="Generate unique and meaningful dog names based on personality and breed." />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      <Navbar />
        <main className="flex-grow scroll-smooth">
        <section className="pt-32 pb-16 bg-gradient-to-b from-purple-100 to-purple-50 relative">
          <div className="page-container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="size-20 bg-purple-200 text-purple-600 mx-auto rounded-2xl flex items-center justify-center mb-6 animate-float shadow-md">
                <Dog className="size-10" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-purple-800">
                Dog Name Generator
              </h1>
              <p className="text-xl text-purple-700 mb-8">
                Generate unique, meaningful names for your canine companion
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="page-container">
            <div className="max-w-4xl mx-auto">
              <div className="glass-purple p-8 mb-12 shadow-lg rounded-xl bg-white/40 backdrop-blur-sm border border-purple-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="numberOfNames" className="block text-sm font-medium text-purple-800 mb-2">
                        Number of Names
                      </label>
                      <Select 
                        value={numberOfNames} 
                        onValueChange={setNumberOfNames}
                      >
                        <SelectTrigger className="bg-white/70 border-purple-200 focus-visible:ring-purple-500">
                          <SelectValue placeholder="Number of names" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 names</SelectItem>
                          <SelectItem value="7">7 names</SelectItem>
                          <SelectItem value="15">15 names</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="tone" className="block text-sm font-medium text-purple-800 mb-2">
                        Naming Style
                      </label>
                      <Select 
                        value={tone} 
                        onValueChange={setTone}
                      >
                        <SelectTrigger className="bg-white/70 border-purple-200 focus-visible:ring-purple-500">
                          <SelectValue placeholder="Naming style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fun">Fun & Playful</SelectItem>
                          <SelectItem value="cute">Cute & Adorable</SelectItem>
                          <SelectItem value="strong">Strong & Brave</SelectItem>
                          <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                          <SelectItem value="unique">Unique & Uncommon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-purple-800 mb-2">
                        Dog's Personality & Characteristics
                      </label>
                      <Textarea 
                        id="description"
                        placeholder="Describe your dog's personality traits, breed, appearance, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px] bg-white/70 border-purple-200 focus-visible:ring-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button 
                      type="submit" 
                      className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 button-glow"
                      disabled={isGenerating}
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-5 w-5" />
                          Generate Dog Names
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Results Section */}
              {generatedNames.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-purple-800 text-center">Generated Dog Names</h2>
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {generatedNames.map((nameObj, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow card-gradient border border-purple-200/50">
                        <CardHeader className="pb-4 bg-gradient-to-r from-purple-100/50 to-transparent">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl text-purple-800">{nameObj.name}</CardTitle>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(nameObj.name, "Name")}
                                className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 -mt-2 -mr-2"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription>
                            <span className="font-medium">Meaning: </span>
                            {nameObj.meaning}
                          </CardDescription>
                        </CardHeader>
                        
                        {expandedCard === index && (
                          <CardContent className="text-sm space-y-4 pt-0 bg-white/70">
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-purple-800">Personality Traits</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.personality_traits.join(", "), "Personality traits")}
                                  className="h-6 w-6 p-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {nameObj.personality_traits.map((trait, i) => (
                                  <Badge key={i} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-purple-800">Why It Fits</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.why_it_fits, "Why it fits")}
                                  className="h-6 w-6 p-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-gray-700">{nameObj.why_it_fits}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-purple-800">Name Origin</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.name_origin, "Name origin")}
                                  className="h-6 w-6 p-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-gray-700">{nameObj.name_origin}</p>
                            </div>
                          </CardContent>
                        )}
                        
                        <CardFooter className="pt-2 pb-4 bg-white/70 flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toggleCardExpansion(index)}
                            className="text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-100 border-purple-200 flex items-center"
                          >
                            <Info className="h-4 w-4 mr-1" />
                            {expandedCard === index ? "Show less" : "Show details"}
                          </Button>
                          
                          {user && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 border-purple-200"
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                Favorite
                              </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {generatedNames.length === 0 && !isGenerating && (
                <div className="glass-purple p-12 text-center rounded-xl bg-white/40 backdrop-blur-sm border border-purple-100">
                  <div className="flex justify-center mb-6">
                    <Dog className="size-12 text-purple-600 mb-2" />
                  </div>
                  <p className="text-purple-700 mb-4">
                    Fill in the form to generate the perfect name for your dog
                  </p>
                  <Button
                    onClick={handleSubmit}
                    variant="outline"
                    className="border-purple-400 text-purple-700 hover:bg-purple-200"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Generate Names
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white/50">
          <div className="page-container">
            <h2 className="text-3xl font-bold text-purple-800 text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">How do I choose the right name for my dog?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>The best dog names are those that match your dog's personality, are easy to pronounce, and won't be confused with common commands like "sit" or "stay." Consider your dog's breed, size, color, and distinctive traits when choosing a name.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">How many syllables should a dog name have?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Dogs typically respond best to one or two-syllable names as they're easier to recognize. However, you can choose longer names and use a shortened version for commands. What matters most is consistency in how you call your dog.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">What are popular dog naming trends?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Currently popular dog naming trends include human names (like Max, Charlie, or Bella), food-inspired names (Cookie, Pepper), nature-themed names (River, Storm), and pop culture references from popular shows, movies, or books.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">Should I consider my dog's breed when naming them?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>A dog's breed can provide excellent inspiration for names. For example, German Shepherds might suit German names, while Akitas might benefit from Japanese-inspired names. However, the most important factor is finding a name you love that fits your dog's unique personality.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
          <div className="page-container">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-purple-800 mb-4">How to Use the Dog Name Generator</h2>
                <p className="text-lg text-purple-600">Follow these simple steps to find the perfect name for your dog</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">1</span>
                      Select Naming Style
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Choose between fun & playful, cute & adorable, strong & brave, elegant & sophisticated, or unique & uncommon naming styles.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">2</span>
                      Describe Your Dog
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Tell us about your dog's personality traits, breed, appearance, and any unique characteristics that make them special.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">3</span>
                      Generate Names
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Click generate and let our AI create personalized name suggestions for your canine companion.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">4</span>
                      Explore Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Click "Show details" to learn more about each name's meaning, origin, and why it might be perfect for your dog.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Adsterra Native Banner Ad */}
        <div className="my-8 max-w-4xl mx-auto">
          <script async={true} data-cfasync="false" src="//pl26337987.profitableratecpm.com/132e23d9e3b100b8ba7ad79b8a165533/invoke.js"></script>
          <div id="container-132e23d9e3b100b8ba7ad79b8a165533"></div>
        </div>
      </main>
        
        {/* Replace the Footer component with a custom footer implementation */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-purple-600 rounded-full p-2">
                    <span className="text-white font-bold">N</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Name Hive</h3>
                  </div>
                </div>
                <p className="text-gray-400">AI-powered name generator for all your needs</p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Generators</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Business & Brand</li>
                  <li>Personal & Social</li>
                  <li>Writing & Creative</li>
                  <li>Tech Industry</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Special Generators</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Geographical & Local</li>
                  <li>Fantasy & Gaming</li>
                  <li>Niche-Specific</li>
                  <li>Specialty & Fun</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Blog</li>
                  <li>Pricing</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Refund Policy</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
              {new Date().getFullYear()} Name Hive. All rights reserved.
            </div>
          </div>
        </footer>
    </div>
    </>
  );
};

export default DogNameGenerator; 