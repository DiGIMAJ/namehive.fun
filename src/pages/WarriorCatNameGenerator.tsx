import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw, Info, Heart, Cat, Sword, Shield } from 'lucide-react';
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

const WarriorCatNameGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [description, setDescription] = useState<string>('');
  const [clan, setClan] = useState<string>('thunderclan');
  const [numberOfNames, setNumberOfNames] = useState<string>('7');
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // SEO Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Warrior Cat Name Generator",
    "description": "Generate unique and creative Warrior Cat names with our AI-powered tool.",
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
        "name": "How do Warrior Cat names work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Warrior Cat names follow a specific pattern: they start with a prefix that describes a physical or personality trait, and are followed by a suffix that changes as the cat ages and changes rank. Kits have the suffix '-kit', apprentices have '-paw', and warriors have suffixes like '-heart', '-fur', '-claw', etc."
        }
      },
      {
        "@type": "Question",
        "name": "What are the different Warrior Cat clans?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In the Warriors series, there are five main clans: ThunderClan (forest dwellers), RiverClan (swimmers), WindClan (swift open moorland cats), ShadowClan (pine forest cats), and SkyClan (skilled climbers). Each clan has distinct traits and territories."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use these names for my real cat?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! While these names are inspired by the Warriors book series, they make unique and creative real-world cat names too. You might choose to use just the prefix as your cat's everyday name."
        }
      }
    ]
  };

  const generateNames = useCallback(async () => {
    if (!description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a description of your warrior cat",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const systemPrompt = `You are an AI specializing in generating creative Warrior Cat names based on user input. You will receive a user prompt describing the desired cat name generation task. Your task is to generate a list of names based on the prompt.
You MUST respond with a valid JSON structure containing an array of name objects:
{
  "names": [
    {
      "name": "Stormheart",
      "meaning": "A brave warrior with the force of a storm within them",
      "personality_traits": ["Brave", "Loyal", "Fierce"],
      "why_it_fits": "The name reflects the cat's stormy gray coloration and fierce, passionate personality",
      "name_origin": "Based on the Warrior Cats naming convention, combining a nature element (Storm) with a body part or character trait (heart)"
    }
  ]
}`;

      const userPrompt = `Generate ${numberOfNames || 5} unique, creative Warrior Cat names. The names should be:
- Follow the Warrior Cats naming convention (nature-inspired prefixes with meaningful suffixes like -heart, -claw, -fur, -pelt, etc.)
- Suitable for a warrior cat with these traits: ${description}
- Appropriate for a cat from ${clan}
- Names should be memorable, meaningful, and reflect the cat's personality and appearance`;

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
  }, [description, clan, numberOfNames, toast]);

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
        <title>Warrior Cat Name Generator | Epic Clan Cat Names | Name Hive</title>
        <meta name="description" content="Generate epic Warrior Cat names with our AI-powered tool. Create the perfect clan name for your feline warrior based on personality, appearance, and clan." />
        <meta name="keywords" content="warrior cat names, warrior cats, clan cat names, warriors book series, thunderclan names, riverclan names, windclan names, shadowclan names, skyclan names" />
        <meta property="og:title" content="Warrior Cat Name Generator | Epic Clan Cat Names | Name Hive" />
        <meta property="og:description" content="Create the perfect warrior name for your clan cat with our AI-powered Warrior Cat name generator." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Warrior Cat Name Generator | Name Hive" />
        <meta name="twitter:description" content="Generate epic clan names for your warrior cat based on personality, appearance, and clan." />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50 flex flex-col">
      <Navbar />
        <main className="flex-grow scroll-smooth">
        <section className="pt-32 pb-16 bg-gradient-to-b from-indigo-100 to-indigo-50 relative">
          <div className="page-container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="size-20 bg-indigo-200 text-indigo-600 mx-auto rounded-2xl flex items-center justify-center mb-6 animate-float shadow-md">
                <div className="relative">
                  <Cat className="size-10" />
                  <Shield className="size-4 absolute bottom-0 right-0" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-indigo-800">
                Warrior Cat Name Generator
              </h1>
              <p className="text-xl text-indigo-700 mb-8">
                Generate epic, clan-worthy names for your warrior cat
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="page-container">
            <div className="max-w-4xl mx-auto">
              <div className="glass-indigo p-8 mb-12 shadow-lg rounded-xl bg-white/40 backdrop-blur-sm border border-indigo-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="numberOfNames" className="block text-sm font-medium text-indigo-800 mb-2">
                        Number of Names
                      </label>
                      <Select 
                        value={numberOfNames} 
                        onValueChange={setNumberOfNames}
                      >
                        <SelectTrigger className="bg-white/70 border-indigo-200 focus-visible:ring-indigo-500">
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
                      <label htmlFor="clan" className="block text-sm font-medium text-indigo-800 mb-2">
                        Clan
                      </label>
                      <Select 
                        value={clan} 
                        onValueChange={setClan}
                      >
                        <SelectTrigger className="bg-white/70 border-indigo-200 focus-visible:ring-indigo-500">
                          <SelectValue placeholder="Choose a clan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thunderclan">ThunderClan</SelectItem>
                          <SelectItem value="riverclan">RiverClan</SelectItem>
                          <SelectItem value="windclan">WindClan</SelectItem>
                          <SelectItem value="shadowclan">ShadowClan</SelectItem>
                          <SelectItem value="skyclan">SkyClan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-indigo-800 mb-2">
                        Cat's Personality & Appearance
                      </label>
                      <Textarea 
                        id="description"
                        placeholder="Describe your warrior cat's personality traits, appearance, battle skills, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px] bg-white/70 border-indigo-200 focus-visible:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button 
                      type="submit" 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6 button-glow"
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
                          <Sword className="mr-2 h-5 w-5" />
                          Generate Warrior Names
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Results Section */}
              {generatedNames.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-indigo-800 text-center">Generated Warrior Names</h2>
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {generatedNames.map((nameObj, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow card-gradient border border-indigo-200/50">
                        <CardHeader className="pb-4 bg-gradient-to-r from-indigo-100/50 to-transparent">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl text-indigo-800">{nameObj.name}</CardTitle>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(nameObj.name, "Name")}
                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 -mt-2 -mr-2"
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
                                <h4 className="font-semibold text-indigo-800">Personality Traits</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.personality_traits.join(", "), "Personality traits")}
                                  className="h-6 w-6 p-0 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {nameObj.personality_traits.map((trait, i) => (
                                  <Badge key={i} className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-indigo-800">Why It Fits</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.why_it_fits, "Why it fits")}
                                  className="h-6 w-6 p-0 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-gray-700">{nameObj.why_it_fits}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-indigo-800">Name Origin</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.name_origin, "Name origin")}
                                  className="h-6 w-6 p-0 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"
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
                            className="text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 border-indigo-200 flex items-center"
                          >
                            <Info className="h-4 w-4 mr-1" />
                            {expandedCard === index ? "Show less" : "Show details"}
                          </Button>
                          
                          {user && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 border-indigo-200"
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
                <div className="glass-indigo p-12 text-center rounded-xl bg-white/40 backdrop-blur-sm border border-indigo-100">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Cat className="size-12 text-indigo-600 mb-2" />
                      <Shield className="size-5 text-indigo-700 absolute bottom-0 right-0" />
                    </div>
                  </div>
                  <p className="text-indigo-700 mb-4">
                    Fill in the form to generate the perfect warrior name for your cat
                  </p>
                  <Button
                    onClick={handleSubmit}
                    variant="outline"
                    className="border-indigo-400 text-indigo-700 hover:bg-indigo-200"
                  >
                    <Sword className="mr-2 h-4 w-4" />
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
            <h2 className="text-3xl font-bold text-indigo-800 text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">How do Warrior Cat names work?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>In the Warriors universe, cats receive different names as they progress through life stages. Kits are given names ending with "-kit" (like Bluekit). When they become apprentices, their suffix changes to "-paw" (Bluepaw). Once they become warriors, they receive unique suffixes that reflect their skills, appearance, or personality traits (like Bluefur, later Bluestar).</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">What are the different Warrior Cat clans?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>The five main clans in the Warriors series are: ThunderClan (forest-dwelling cats who are known for their courage), RiverClan (swimming cats who live near water), WindClan (swift cats who live on open moors), ShadowClan (cats who live in marshy pine forests and are known for their cunning), and SkyClan (cats who excel at jumping and climbing trees).</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">What makes a good Warrior Cat name?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>A good Warrior Cat name should reflect the cat's appearance, personality, or abilities. The prefix is often descriptive (like Storm, Tiger, Bright, Swift), while the suffix complements it and adds meaning (-heart for compassion, -claw for fighting skill, -star for leadership). The best names are meaningful, easy to pronounce, and create a strong identity for the character.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">Can I use this generator for Warriors fan fiction?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Absolutely! This generator is perfect for creating authentic-sounding Warrior Cat names for your fan fiction, role-playing games, or original stories set in the Warriors universe. The names follow the conventions established in the books while providing unique combinations that might not yet exist in the official series.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 bg-gradient-to-b from-indigo-50 to-white">
          <div className="page-container">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-indigo-800 mb-4">How to Use the Warrior Cat Name Generator</h2>
                <p className="text-lg text-indigo-600">Follow these simple steps to find the perfect warrior name</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">1</span>
                      Choose Your Clan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Select which clan your warrior cat belongs to - ThunderClan, RiverClan, WindClan, ShadowClan, or SkyClan - as this will influence the style of names generated.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">2</span>
                      Describe Your Warrior
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Tell us about your warrior cat's appearance, personality, skills in battle, and any special traits that make them unique within their clan.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">3</span>
                      Generate Names
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Click generate and let our AI create authentic Warrior Cat names that follow the naming conventions of the Warriors series.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">4</span>
                      Explore Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Click "Show details" to learn more about each name's meaning, origin, and why it might be perfect for your warrior cat character.</p>
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

export default WarriorCatNameGenerator; 