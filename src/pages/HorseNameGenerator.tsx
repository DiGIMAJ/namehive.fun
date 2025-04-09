import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw, Info, Heart } from 'lucide-react';
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

const HorseNameGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [description, setDescription] = useState<string>('');
  const [horseType, setHorseType] = useState<string>('pleasure');
  const [numberOfNames, setNumberOfNames] = useState<string>('7');
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // SEO Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Horse Name Generator",
    "description": "Generate unique and perfect horse names with our AI-powered tool.",
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
        "name": "How do I choose a good horse name?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Consider your horse's appearance, personality, breed, and discipline when selecting a name. Racing horses often have different naming conventions than show horses or pleasure horses. The best names are meaningful, easy to call out, and reflect your horse's unique characteristics."
        }
      },
      {
        "@type": "Question",
        "name": "What are popular horse naming trends?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Popular trends include names based on coloration (Midnight, Copper), personality (Spirit, Grace), heritage-based names for specific breeds, and strong, noble names for competition horses. Some owners also choose themed names that match their farm or stable name."
        }
      },
      {
        "@type": "Question",
        "name": "Are there rules for naming registered horses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, many breed registries have specific rules for naming horses. For example, Thoroughbred names cannot exceed 18 characters, cannot use names of famous horses, and must be approved by The Jockey Club. Other breed associations have their own requirements."
        }
      }
    ]
  };

  const generateNames = useCallback(async () => {
    if (!description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a description of your horse",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const systemPrompt = `You are an AI specializing in generating creative and appropriate horse names based on user input. You will receive a user prompt describing the desired horse name generation task. Your task is to generate a list of names based on the prompt.
You MUST respond with a valid JSON structure containing an array of name objects:
{
  "names": [
    {
      "name": "Midnight Thunder",
      "meaning": "Represents power and darkness, suitable for a black horse with strong presence",
      "personality_traits": ["Bold", "Powerful", "Majestic"],
      "why_it_fits": "The name conveys both the horse's black coloration and its powerful, thunderous gallop",
      "name_origin": "Descriptive name combining natural elements (night and storm) to create a powerful image"
    }
  ]
}`;

      const userPrompt = `Generate ${numberOfNames || 5} unique, creative, and suitable horse name ideas. The names should be:
- Appropriate for the horse type: ${horseType} horse
- Suitable for a horse with these traits: ${description}
- Names should be memorable, meaningful, and reflect the horse's personality, appearance, and purpose`;

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
  }, [description, horseType, numberOfNames, toast]);

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
        <title>Horse Name Generator | Perfect Equine Names | Name Hive</title>
        <meta name="description" content="Generate the perfect horse name with our AI-powered tool. Create distinctive names for racehorses, show horses, and pleasure horses based on breed, color and personality." />
        <meta name="keywords" content="horse names, equine names, racehorse names, show horse names, barn names, thoroughbred names, horse naming, equestrian names" />
        <meta property="og:title" content="Horse Name Generator | Perfect Equine Names | Name Hive" />
        <meta property="og:description" content="Find the perfect name for your horse with our AI-powered name generator. Ideal for racehorses, show horses, and pleasure horses." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Horse Name Generator | Name Hive" />
        <meta name="twitter:description" content="Generate unique and meaningful horse names based on breed, discipline, and personality." />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 flex flex-col">
      <Navbar />
        <main className="flex-grow scroll-smooth">
        <section className="pt-32 pb-16 bg-gradient-to-b from-amber-100 to-amber-50 relative">
          <div className="page-container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="size-20 bg-amber-200 text-amber-600 mx-auto rounded-2xl flex items-center justify-center mb-6 animate-float shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 19h1c1.1 0 2 .9 2 2H2c0-1.1.9-2 2-2h1" />
                  <path d="M2 19V7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8" />
                  <path d="m11 15-1-1 2-2-2-2 1-1 3 3-3 3Z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-amber-800">
                Horse Name Generator
              </h1>
              <p className="text-xl text-amber-700 mb-8">
                Generate unique, meaningful names for your equine companion
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="page-container">
            <div className="max-w-4xl mx-auto">
              <div className="glass-amber p-8 mb-12 shadow-lg rounded-xl bg-white/40 backdrop-blur-sm border border-amber-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="numberOfNames" className="block text-sm font-medium text-amber-800 mb-2">
                        Number of Names
                      </label>
                      <Select 
                        value={numberOfNames} 
                        onValueChange={setNumberOfNames}
                      >
                        <SelectTrigger className="bg-white/70 border-amber-200 focus-visible:ring-amber-500">
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
                      <label htmlFor="horseType" className="block text-sm font-medium text-amber-800 mb-2">
                        Horse Type
                      </label>
                      <Select 
                        value={horseType} 
                        onValueChange={setHorseType}
                      >
                        <SelectTrigger className="bg-white/70 border-amber-200 focus-visible:ring-amber-500">
                          <SelectValue placeholder="Select horse type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="race">Racehorse</SelectItem>
                          <SelectItem value="show">Show Horse</SelectItem>
                          <SelectItem value="pleasure">Pleasure Horse</SelectItem>
                          <SelectItem value="draft">Draft Horse</SelectItem>
                          <SelectItem value="western">Western Performance</SelectItem>
                          <SelectItem value="sport">Sport Horse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-amber-800 mb-2">
                        Horse's Characteristics
                      </label>
                      <Textarea 
                        id="description"
                        placeholder="Describe your horse's breed, color, personality traits, temperament, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px] bg-white/70 border-amber-200 focus-visible:ring-amber-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button 
                      type="submit" 
                      className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-6 button-glow"
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
                          Generate Horse Names
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Results Section */}
              {generatedNames.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-amber-800 text-center">Generated Horse Names</h2>
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {generatedNames.map((nameObj, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow card-gradient border border-amber-200/50">
                        <CardHeader className="pb-4 bg-gradient-to-r from-amber-100/50 to-transparent">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl text-amber-800">{nameObj.name}</CardTitle>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(nameObj.name, "Name")}
                                className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 -mt-2 -mr-2"
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
                                <h4 className="font-semibold text-amber-800">Personality Traits</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.personality_traits.join(", "), "Personality traits")}
                                  className="h-6 w-6 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {nameObj.personality_traits.map((trait, i) => (
                                  <Badge key={i} className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-amber-800">Why It Fits</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.why_it_fits, "Why it fits")}
                                  className="h-6 w-6 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-gray-700">{nameObj.why_it_fits}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-amber-800">Name Origin</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.name_origin, "Name origin")}
                                  className="h-6 w-6 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
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
                            className="text-sm text-amber-600 hover:text-amber-800 hover:bg-amber-100 border-amber-200 flex items-center"
                          >
                            <Info className="h-4 w-4 mr-1" />
                            {expandedCard === index ? "Show less" : "Show details"}
                          </Button>
                          
                          {user && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-amber-600 hover:text-amber-800 hover:bg-amber-100 border-amber-200"
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
                <div className="glass-amber p-12 text-center rounded-xl bg-white/40 backdrop-blur-sm border border-amber-100">
                  <div className="flex justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="size-12 text-amber-600 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 19h1c1.1 0 2 .9 2 2H2c0-1.1.9-2 2-2h1" />
                      <path d="M2 19V7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8" />
                      <path d="m11 15-1-1 2-2-2-2 1-1 3 3-3 3Z" />
                    </svg>
                  </div>
                  <p className="text-amber-700 mb-4">
                    Fill in the form to generate the perfect name for your horse
                  </p>
                  <Button
                    onClick={handleSubmit}
                    variant="outline"
                    className="border-amber-400 text-amber-700 hover:bg-amber-200"
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
            <h2 className="text-3xl font-bold text-amber-800 text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">What makes a good horse name?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>A good horse name should reflect the horse's breed, color, personality, or purpose. Names that are easy to pronounce, distinctive, and meaningful tend to work best. For racehorses, you might want something memorable that sounds good when announced, while show horses often benefit from elegant or impressive names.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">Are there different naming conventions for different horse disciplines?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Yes! Racehorses often have creative, catchy names that stand out when announced (like "Secretariat" or "American Pharoah"). Show horses frequently have elegant, prestigious names (like "Sapphire" or "Authentic"). Working and pleasure horses often have simpler, more casual "barn names" (like "Buddy" or "Star"). Competition horses in disciplines like dressage might have names reflecting their European heritage.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">What are the rules for registering horse names?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Each breed registry has different rules. For Thoroughbreds, names can't exceed 18 characters, can't be entirely numeric, can't use famous names, and must be approved by The Jockey Club. Quarter Horses can't have names exceeding 20 characters and can't duplicate names. Many registries require that names include part of the sire or dam's name, especially for warmbloods and some Arabian registries.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">Should my horse have both a registered name and a barn name?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Many horses do have both. The registered name appears on official paperwork and is used for competitions or breeding records (like "Midnight Symphony"), while the barn name is shorter and used daily (like "Midnight" or "Symphony"). This is especially common with registered show horses and racehorses, as their official names can be quite elaborate.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
          <div className="page-container">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-amber-800 mb-4">How to Use the Horse Name Generator</h2>
                <p className="text-lg text-amber-600">Follow these simple steps to find the perfect name for your horse</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">1</span>
                      Select Horse Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Choose what type of horse you have - racehorse, show horse, pleasure horse, etc. - as this will influence the style of names generated.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">2</span>
                      Describe Your Horse
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Tell us about your horse's breed, coloration, personality traits, and any special characteristics that make them unique.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">3</span>
                      Generate Names
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Click generate and let our AI create personalized name suggestions for your equine companion.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">4</span>
                      Explore Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Click "Show details" to learn more about each name's meaning, origin, and why it might be perfect for your horse.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer is included via the App component */}
    </div>
    </>
  );
};

export default HorseNameGenerator; 