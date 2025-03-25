
import React, { useState } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PaymentGatewaySettingsProps {
  sellerId: string;
  secretKey: string;
  onSellerIdChange: (value: string) => void;
  onSecretKeyChange: (value: string) => void;
  onSaveSettings: () => void;
  isSaving: boolean;
}

const PaymentGatewaySettings = ({
  sellerId,
  secretKey,
  onSellerIdChange,
  onSecretKeyChange,
  onSaveSettings,
  isSaving
}: PaymentGatewaySettingsProps) => {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Gateway Configuration</CardTitle>
        <CardDescription>
          Configure your 2Checkout payment processor settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="twoCheckoutSellerId">2Checkout Seller ID</Label>
          <Input
            id="twoCheckoutSellerId"
            name="twoCheckoutSellerId"
            value={sellerId}
            onChange={(e) => onSellerIdChange(e.target.value)}
            placeholder="Enter your 2Checkout Seller ID"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="twoCheckoutSecretKey">2Checkout Secret Key</Label>
          <div className="relative">
            <Input
              id="twoCheckoutSecretKey"
              name="twoCheckoutSecretKey"
              type={showSecret ? "text" : "password"}
              value={secretKey}
              onChange={(e) => onSecretKeyChange(e.target.value)}
              className="pr-10"
              placeholder="Enter your 2Checkout Secret Key"
            />
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onSaveSettings} 
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="size-4" />
          {isSaving ? "Saving..." : "Save Payment Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentGatewaySettings;
