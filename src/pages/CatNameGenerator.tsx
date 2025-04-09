import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw, Info, Heart, Cat } from 'lucide-react';
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

const CatNameGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [description, setDescription] = useState<string>('');
  const [tone, setTone] = useState<string>('elegant');
  const [numberOfNames, setNumberOfNames] = useState<string>('7');
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // SEO Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Cat Name Generator",
    "description": "Generate unique and creative cat names with our AI-powered tool.",
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
        "name": "How do I choose the perfect name for my cat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Consider your cat's personality, appearance, and behavior. Choose a name that's easy to pronounce, distinct, and one that both you and your cat will respond to."
        }
      },
      {
        "@type": "Question",
        "name": "What are popular cat naming trends in 2023?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Popular trends include mythology-inspired names, elegant royal names, food-based names, and nature-themed names that reflect your cat's personality or appearance."
        }
      },
      {
        "@type": "Question",
        "name": "Can cats actually recognize their names?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Scientific research has shown that cats can indeed recognize their names. A 2019 study published in Scientific Reports confirmed that cats can distinguish their names from other similar-sounding words."
        }
      }
    ]
  };

  const generateNames = useCallback(async () => {
    if (!description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a description of your cat",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const systemPrompt = `You are an AI specializing in generating creative and adorable cat names based on user input. You will receive a user prompt describing the desired cat name generation task. Your task is to generate a list of names based on the prompt.
You MUST respond with a valid JSON structure containing an array of name objects:
{
  "names": [
    {
      "name": "Luna",
      "meaning": "Moon in Latin, reflecting mystery and elegance",
      "personality_traits": ["Independent", "Mysterious", "Elegant"],
      "why_it_fits": "The name reflects the cat's graceful nature and nocturnal energy",
      "name_origin": "Latin word for moon, commonly associated with feline grace and mystery"
    }
  ]
}`;

      const userPrompt = `Generate ${numberOfNames || 5} unique, creative, and adorable cat name ideas. The names should be:
- Cute, catchy, and fitting for a feline
- Suitable for a cat with these personality traits: ${description}
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

  return (
    <>
      <Helmet>
        <title>AI Cat Name Generator | Perfect Feline Names | Name Hive</title>
        <meta name="description" content="Generate creative and unique cat names with our AI-powered tool. Find the perfect name for your feline friend based on personality and appearance." />
        <meta name="keywords" content="cat name generator, kitten names, cat names, feline names, pet names for cats, AI cat names" />
        <meta property="og:title" content="AI Cat Name Generator | Perfect Feline Names | Name Hive" />
        <meta property="og:description" content="Find the perfect name for your feline companion with our AI-powered cat name generator." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Cat Name Generator | Name Hive" />
        <meta name="twitter:description" content="Generate unique and meaningful cat names based on personality and characteristics." />
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
                <Cat className="size-10" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-purple-800">
                Cat Name Generator
              </h1>
              <p className="text-xl text-purple-700 mb-8">
                Generate unique, meaningful names for your feline companion
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
                          <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                          <SelectItem value="cute">Cute & Adorable</SelectItem>
                          <SelectItem value="mythical">Mythical & Magical</SelectItem>
                          <SelectItem value="quirky">Quirky & Playful</SelectItem>
                          <SelectItem value="regal">Regal & Majestic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-purple-800 mb-2">
                        Cat's Personality & Characteristics
                      </label>
                      <Textarea 
                        id="description"
                        placeholder="Describe your cat's personality traits, breed, appearance, etc."
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
                          Generate Cat Names
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Results Section */}
              {generatedNames.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-purple-800 text-center">Generated Cat Names</h2>
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
                    <Cat className="size-12 text-purple-600 mb-2" />
                  </div>
                  <p className="text-purple-700 mb-4">
                    Fill in the form to generate the perfect name for your cat
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
                  <AccordionTrigger className="px-4">How do I pick the perfect cat name?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>The perfect cat name reflects your cat's unique personality and appearance. Consider their behaviors, physical traits, and the sounds they respond to. Many cat owners find that names ending with an "ee" sound (like Kitty, Mochi, or Cleo) get the best response from felines.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">Do cats actually respond to their names?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Yes! Scientific research has confirmed that cats can recognize their names. A study published in Scientific Reports found that cats can distinguish their names from other similar-sounding words, even when called by a stranger. However, whether they choose to respond is another matter entirely!</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">What are popular cat naming trends?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Current popular cat naming trends include mythology-inspired names (Luna, Apollo, Athena), food names (Mochi, Wasabi, Biscuit), elegant names (Duchess, Prince, Lady), nature-themed names (Willow, Sky, River), and classic human names (Oliver, Sophie, Max).</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">Should I consider my cat's breed when naming them?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>A cat's breed can provide wonderful inspiration for names. For example, Russian Blue cats might suit Russian names, while Siamese cats might benefit from Thai-inspired names. Maine Coons often get rugged, outdoorsy names that match their wilderness origins. However, the most important factor is finding a name that feels right for your specific cat's personality.</p>
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
                <h2 className="text-3xl font-bold text-purple-800 mb-4">How to Use the Cat Name Generator</h2>
                <p className="text-lg text-purple-600">Follow these simple steps to find the perfect name for your feline friend</p>
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
                    <p>Choose between elegant & sophisticated, cute & adorable, mythical & magical, quirky & playful, or regal & majestic naming styles.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">2</span>
                      Describe Your Cat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Tell us about your cat's personality traits, breed, appearance, and any unique characteristics that make them special.</p>
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
                    <p>Click generate and let our AI create personalized name suggestions for your feline companion.</p>
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
                    <p>Click "Show details" to learn more about each name's meaning, origin, and why it might be perfect for your cat.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
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

export default CatNameGenerator; 