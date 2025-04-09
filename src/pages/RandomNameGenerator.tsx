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

const RandomNameGenerator = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [description, setDescription] = useState<string>('');
  const [nameCategory, setNameCategory] = useState<string>('general');
  const [numberOfNames, setNumberOfNames] = useState<string>('7');
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Random Name Generator",
    "description": "Generate unique and creative random names with our AI-powered tool.",
    "applicationCategory": "Utility",
    "offers": {
      "@type": "Offer",
      "price": "0"
    }
  };

  const generateNames = useCallback(async () => {
    if (!description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a description for the type of names you want",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const systemPrompt = `You are an AI specializing in generating creative and unique random names based on user input. You will receive a user prompt describing the desired name generation task. Your task is to generate a list of names based on the prompt.
You MUST respond with a valid JSON structure containing an array of name objects:
{
  "names": [
    {
      "name": "Axionite",
      "meaning": "A name inspired by technology and innovation",
      "personality_traits": ["Modern", "Futuristic", "Innovative"],
      "why_it_fits": "The name has a sleek, modern sound that evokes cutting-edge technology",
      "name_origin": "Created by combining 'axiom' (self-evident truth) with a modern-sounding suffix"
    }
  ]
}`;

      const userPrompt = `Generate ${numberOfNames || 7} unique, creative, and memorable random names. The names should be:
- Suitable for the following category: ${nameCategory}
- Following these requirements or characteristics: ${description}
- Names should be original, easy to pronounce, and have a distinct meaning or feeling`;

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
  }, [description, nameCategory, numberOfNames, toast]);

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
        <title>Random Name Generator | Create Unique Names | Name Hive</title>
        <meta name="description" content="Generate creative and unique random names with our AI-powered tool. Perfect for businesses, products, usernames, characters, and more." />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col">
      <Navbar />
        <main className="flex-grow scroll-smooth">
        <section className="pt-32 pb-16 bg-gradient-to-b from-blue-100 to-blue-50 relative">
          <div className="page-container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="size-20 bg-blue-200 text-blue-600 mx-auto rounded-2xl flex items-center justify-center mb-6 animate-float shadow-md">
                <RefreshCw className="size-10" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-blue-800">
                Random Name Generator
              </h1>
              <p className="text-xl text-blue-700 mb-8">
                Generate unique, creative names for any purpose
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="page-container">
            <div className="max-w-4xl mx-auto">
              <div className="glass-blue p-8 mb-12 shadow-lg rounded-xl bg-white/40 backdrop-blur-sm border border-blue-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nameCategory" className="block text-sm font-medium text-blue-800 mb-2">
                        Name Category
                      </label>
                      <Select 
                        value={nameCategory} 
                        onValueChange={setNameCategory}
                      >
                        <SelectTrigger className="bg-white/70 border-blue-200 focus-visible:ring-blue-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="business">Business/Brand</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="character">Character</SelectItem>
                          <SelectItem value="username">Username</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="numberOfNames" className="block text-sm font-medium text-blue-800 mb-2">
                        Number of Names
                      </label>
                      <Select 
                        value={numberOfNames} 
                        onValueChange={setNumberOfNames}
                      >
                        <SelectTrigger className="bg-white/70 border-blue-200 focus-visible:ring-blue-500">
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
                      <label htmlFor="description" className="block text-sm font-medium text-blue-800 mb-2">
                        Requirements
                      </label>
                      <Textarea 
                        id="description"
                        placeholder="Describe what kind of names you're looking for (e.g., modern, futuristic, natural, technical, etc.)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px] bg-white/70 border-blue-200 focus-visible:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <Button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 button-glow"
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
                          <RefreshCw className="mr-2 h-5 w-5" />
                          Generate Random Names
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Results Section */}
              {generatedNames.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-blue-800 text-center">Generated Names</h2>
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {generatedNames.map((nameObj, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow card-gradient border border-blue-200/50">
                        <CardHeader className="pb-4 bg-gradient-to-r from-blue-100/50 to-transparent">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl text-blue-800">{nameObj.name}</CardTitle>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopy(nameObj.name, "Name")}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 -mt-2 -mr-2"
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
                                <h4 className="font-semibold text-blue-800">Personality Traits</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.personality_traits.join(", "), "Personality traits")}
                                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {nameObj.personality_traits.map((trait, i) => (
                                  <Badge key={i} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-blue-800">Why It Fits</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.why_it_fits, "Why it fits")}
                                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-gray-700">{nameObj.why_it_fits}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-1">
                                <h4 className="font-semibold text-blue-800">Name Origin</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopy(nameObj.name_origin, "Name origin")}
                                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100"
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
                            className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 border-blue-200 flex items-center"
                          >
                            <Info className="h-4 w-4 mr-1" />
                            {expandedCard === index ? "Show less" : "Show details"}
                          </Button>
                          
                          {user && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 border-blue-200"
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
                <div className="glass-blue p-12 text-center rounded-xl bg-white/40 backdrop-blur-sm border border-blue-100">
                  <div className="flex justify-center mb-6">
                    <RefreshCw className="size-12 text-blue-600 mb-2" />
                  </div>
                  <p className="text-blue-700 mb-4">
                    Fill in the form to generate unique random names
                  </p>
                  <Button
                    onClick={handleSubmit}
                    variant="outline"
                    className="border-blue-400 text-blue-700 hover:bg-blue-200"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
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
            <h2 className="text-3xl font-bold text-blue-800 text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">What can I use the random name generator for?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Our random name generator is versatile and can be used for creating names for businesses, products, projects, fictional characters, usernames, game avatars, domain names, and more. Simply select the appropriate category and describe what type of name you're looking for.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">How does the random name generator work?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Our AI-powered generator creates unique names based on your specified category and requirements. It analyzes patterns in language and naming conventions to generate names that are original yet appropriate for your intended use case. Each name comes with additional context like meaning and personality traits.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">What makes a good name?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>A good name should be memorable, distinctive, easy to pronounce and spell, and appropriate for its intended use. It should evoke the right emotions and associations while avoiding negative connotations. Ideally, it should also be available as a domain name if you're naming a business or brand.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white/70 rounded-lg">
                  <AccordionTrigger className="px-4">Are these names free to use?</AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <p>Yes, the names generated are free to use. However, we recommend conducting appropriate trademark searches before using a name commercially. While our generator creates unique names, there's always a possibility that similar names may already be trademarked or in use by others.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="page-container">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-blue-800 mb-4">How to Use the Random Name Generator</h2>
                <p className="text-lg text-blue-600">Follow these simple steps to create the perfect name</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">1</span>
                      Choose Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Select what type of name you need - business, product, character, username, or project.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">2</span>
                      Describe Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Tell us your desired characteristics for the name, such as whether it should be modern, futuristic, natural, technical, etc.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">3</span>
                      Generate Names
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Click generate and let our AI create personalized name suggestions based on your requirements.</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">4</span>
                      Explore Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Click "Show details" to learn more about each name's meaning, traits, and why it might be perfect for your needs.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    </>
  );
};

export default RandomNameGenerator;
