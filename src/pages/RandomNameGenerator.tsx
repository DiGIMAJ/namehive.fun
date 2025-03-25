
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FavoriteButton from '@/components/podcast/FavoriteButton';
import { useAuth } from '@/context/AuthContext';

const RandomNameGenerator = () => {
  const [name, setName] = useState('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateRandomName = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomName = Math.random().toString(36).substring(2, 10);
      setName(randomName);
      setGeneratedNames(prevNames => [...prevNames, randomName]);
      setIsLoading(false);
    }, 500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Name copied to clipboard."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-32 pb-16">
        <div className="page-container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Random Name Generator</h1>
            <p className="text-gray-600 text-lg">Generate unique and random names for any purpose</p>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate a Random Name</CardTitle>
                <CardDescription>Click the button below to generate a unique name</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input 
                    type="text" 
                    value={name} 
                    readOnly 
                    placeholder="Generated name will appear here" 
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => copyToClipboard(name)} 
                    disabled={!name}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <Button onClick={generateRandomName} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Name'
                  )}
                </Button>
              </CardContent>
            </Card>
            
            {generatedNames.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Generated Names</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {generatedNames.map((name, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500">Randomly generated name</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs text-gray-500">Domain available</div>
                          {user && (
                            <FavoriteButton 
                              podcastName={name} 
                              description="Random name" 
                              niche="random-name" 
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RandomNameGenerator;
