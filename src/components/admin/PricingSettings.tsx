
import React from 'react';
import { Save } from 'lucide-react';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PricingSettingsProps {
  monthlyPrice: number;
  yearlyPrice: number;
  onMonthlyPriceChange: (value: number) => void;
  onYearlyPriceChange: (value: number) => void;
  onSaveSettings: () => void;
  isSaving: boolean;
}

const PricingSettings = ({
  monthlyPrice,
  yearlyPrice,
  onMonthlyPriceChange,
  onYearlyPriceChange,
  onSaveSettings,
  isSaving
}: PricingSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Configuration</CardTitle>
        <CardDescription>
          Set the pricing for your subscription plans
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
          <Input
            id="monthlyPrice"
            name="monthlyPrice"
            type="number"
            min="0"
            step="0.01"
            value={monthlyPrice}
            onChange={(e) => onMonthlyPriceChange(parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="yearlyPrice">Yearly Price ($)</Label>
          <Input
            id="yearlyPrice"
            name="yearlyPrice"
            type="number"
            min="0"
            step="0.01"
            value={yearlyPrice}
            onChange={(e) => onYearlyPriceChange(parseFloat(e.target.value) || 0)}
          />
          <p className="text-sm text-gray-500">
            Recommended: Set annual price to provide a discount compared to monthly
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
          {isSaving ? "Saving..." : "Save Pricing"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingSettings;
