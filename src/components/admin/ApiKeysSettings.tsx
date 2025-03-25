
import React, { useState } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ApiKeysSettingsProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
  onSaveSettings: () => void;
  isSaving: boolean;
}

const ApiKeysSettings = ({ 
  apiKey, 
  onApiKeyChange, 
  onSaveSettings, 
  isSaving 
}: ApiKeysSettingsProps) => {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys Configuration</CardTitle>
        <CardDescription>
          Configure the API keys for third-party services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="groqApiKey">Groq API Key</Label>
          <div className="relative">
            <Input
              id="groqApiKey"
              name="groqApiKey"
              type={showSecret ? "text" : "password"}
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              className="pr-10"
              placeholder="Enter your Groq API key"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Used for AI name generation capabilities
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSaveSettings} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save API Keys"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeysSettings;
