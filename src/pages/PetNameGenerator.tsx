import { useState, useCallback, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw, Info, Heart, Dog, Cat } from 'lucide-react';
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

const PetNameGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [description, setDescription] = useState<string>('');
  const [petType, setPetType] = useState<string>('');
  const [tone, setTone] = useState<string>('fun');
  const [numberOfNames, setNumberOfNames] = useState<string>('7');
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Pet Name Generator",
    "description": "Generate unique and creative pet names with our AI-powered tool.",
    "applicationCategory": "Utility",
    "offers": {
      "@type": "Offer",
      "price": "0"
    }
  };

  const generateNames = useCallback(async () => {
    if (!petType.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both pet type and description",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const systemPrompt = `You are an AI specializing in generating creative and adorable pet names based on user input. You will receive a user prompt describing the desired pet name generation task. Your task is to generate a list of names based on the prompt.
You MUST respond with a valid JSON structure containing an array of name objects:
{
  "names": [
    {
      "name": "Fluffy",
      "meaning": "Soft and puffy appearance",
      "personality_traits": ["Playful", "Gentle", "Friendly"],
      "why_it_fits": "The name reflects the pet's appearance and gentle nature",
      "name_origin": "English, descriptive name based on physical characteristics"
    }
  ]
}`;

      const userPrompt = `Generate ${numberOfNames || 5} unique, creative, and adorable pet name ideas for a ${petType}. The names should be:
- Cute, catchy, and easy to say
- Suitable for the pet's personality traits: ${description}
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
  }, [description, petType, tone, numberOfNames, toast]);

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
        <title>AI Pet Name Generator | Create Perfect Pet Names</title>
        <meta name="description" content="Generate creative and unique pet names with our AI-powered tool. Get instant suggestions with personality traits and name meanings." />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
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
                  Pet Name Generator
                </h1>
                <p className="text-xl text-purple-700 mb-8">
                  Generate unique, meaningful names for your furry friends
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
                        <label htmlFor="petType" className="block text-sm font-medium text-purple-800 mb-2">
                          Pet Type
                        </label>
                        <Input 
                          id="petType"
                          type="text"
                          placeholder="Enter pet type (e.g., cat, dog, hamster)"
                          value={petType}
                          onChange={(e) => setPetType(e.target.value)}
                          className="bg-white/70 border-purple-200 focus-visible:ring-purple-500"
                        />
                      </div>
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
                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-purple-800 mb-2">
                          Pet's Personality
                        </label>
                        <Textarea 
                          id="description"
                          placeholder="Describe your pet's personality traits"
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
                            Generate Pet Names
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Results Section */}
                {generatedNames.length > 0 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-purple-800 text-center">Generated Pet Names</h2>
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
                      <div className="flex flex-col items-center">
                        <Dog className="size-12 text-purple-600 mb-2" />
                        <Cat className="size-8 text-purple-700" />
                      </div>
                    </div>
                    <p className="text-purple-700 mb-4">
                      Fill in the form to generate the perfect name for your pet
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
                    <AccordionTrigger className="px-4">What is a pet name generator?</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p>Our AI-powered pet name generator creates unique and adorable names based on your pet's type and personality traits. It helps you find the perfect name that matches your pet's characteristics.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="bg-white/70 rounded-lg">
                    <AccordionTrigger className="px-4">How does the pet name generator work?</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p>Simply enter your pet's type and personality traits, then choose how many names you'd like to generate. Our AI analyzes your input and creates personalized name suggestions with meanings and personality traits.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="bg-white/70 rounded-lg">
                    <AccordionTrigger className="px-4">Why is choosing the right pet name important?</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p>A pet's name becomes part of their identity and can reflect their personality. It's also something you'll use daily, so it should be meaningful and easy to pronounce.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="bg-white/70 rounded-lg">
                    <AccordionTrigger className="px-4">What makes a good pet name?</AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <ul className="list-disc pl-6 space-y-2 text-left">
                        <li>Easy to pronounce and remember</li>
                        <li>Suits your pet's personality</li>
                        <li>Something you're comfortable calling in public</li>
                        <li>Meaningful to you and your family</li>
                        <li>Unique but not too complicated</li>
                      </ul>
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
                  <h2 className="text-3xl font-bold text-purple-800 mb-4">How to Use the Pet Name Generator</h2>
                  <p className="text-lg text-purple-600">Follow these simple steps to find the perfect name for your pet</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <Card className="bg-white/70">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">1</span>
                        Enter Pet Type
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Start by specifying what kind of pet you have (e.g., cat, dog, rabbit, etc.).</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">2</span>
                        Describe Personality
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Tell us about your pet's personality traits, temperament, and any unique characteristics.</p>
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
                      <p>Click generate and let our AI create personalized name suggestions for your pet.</p>
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
                      <p>Click "Show details" to learn more about each name's meaning and why it might suit your pet.</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Adsterra Native Banner Ad */}
          <div className="my-8 max-w-4xl mx-auto">
            <script 
              async={true} 
              data-cfasync={"false"} 
              src="//pl26337987.profitableratecpm.com/132e23d9e3b100b8ba7ad79b8a165533/invoke.js"
            ></script>
            <div id="container-132e23d9e3b100b8ba7ad79b8a165533"></div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PetNameGenerator;
