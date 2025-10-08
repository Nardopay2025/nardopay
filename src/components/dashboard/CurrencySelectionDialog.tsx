import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Smartphone, Building } from 'lucide-react';
import { COUNTRIES, getCountryByCode, getCurrencyForCountry } from '@/lib/countries';
import { z } from 'zod';

// Validation schemas
const withdrawalSchema = z.object({
  mobile_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional().or(z.literal('')),
  bank_account_number: z.string().min(5, 'Account number must be at least 5 characters').max(34, 'Account number must be less than 34 characters').optional().or(z.literal('')),
  bank_account_name: z.string().min(1, 'Account name is required').max(100, 'Account name must be less than 100 characters').optional().or(z.literal('')),
});

interface CurrencySelectionDialogProps {
  open: boolean;
  userId: string;
  onComplete: () => void;
}

export const CurrencySelectionDialog = ({ open, userId, onComplete }: CurrencySelectionDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'country' | 'withdrawal'>('country');
  const [selectedCountry, setSelectedCountry] = useState('KE');
  const [withdrawalType, setWithdrawalType] = useState<'mobile' | 'bank'>('mobile');
  const [withdrawalData, setWithdrawalData] = useState({
    mobile_provider: '',
    mobile_number: '',
    bank_name: '',
    bank_account_number: '',
    bank_account_name: '',
  });

  const country = getCountryByCode(selectedCountry);
  const currency = getCurrencyForCountry(selectedCountry);

  const handleCountrySubmit = () => {
    if (!country) return;
    setStep('withdrawal');
  };

  const handleWithdrawalSubmit = async () => {
    setLoading(true);

    try {
      const updateData: any = {
        country: selectedCountry,
        currency,
        currency_set_at: new Date().toISOString(),
        withdrawal_account_type: withdrawalType,
      };

      if (withdrawalType === 'mobile') {
        if (!withdrawalData.mobile_provider || !withdrawalData.mobile_number) {
          throw new Error('Please fill in all mobile money fields');
        }
        
        // Validate mobile number format
        const validated = withdrawalSchema.parse({
          mobile_number: withdrawalData.mobile_number,
        });
        
        updateData.mobile_provider = withdrawalData.mobile_provider;
        updateData.mobile_number = withdrawalData.mobile_number;
      } else {
        if (!withdrawalData.bank_name || !withdrawalData.bank_account_number || !withdrawalData.bank_account_name) {
          throw new Error('Please fill in all bank account fields');
        }
        
        // Validate bank account fields
        const validated = withdrawalSchema.parse({
          bank_account_number: withdrawalData.bank_account_number,
          bank_account_name: withdrawalData.bank_account_name,
        });
        
        updateData.bank_name = withdrawalData.bank_name;
        updateData.bank_account_number = withdrawalData.bank_account_number;
        updateData.bank_account_name = withdrawalData.bank_account_name;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Setup complete!',
        description: `Your account is configured for ${country?.name} (${currency})`,
      });

      onComplete();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {step === 'country' ? 'Select Your Country' : 'Setup Withdrawal Account'}
          </DialogTitle>
          <DialogDescription>
            {step === 'country' 
              ? 'Choose your country. Your currency will be set automatically based on your country.'
              : 'Configure where you want to receive your funds.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 'country' ? (
            <>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name} ({country.currency})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-muted-foreground">
                  <strong>Selected:</strong> {country?.name} - Currency: {currency}
                </p>
              </div>

              <Button onClick={handleCountrySubmit} className="w-full">
                Continue
              </Button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  type="button"
                  variant={withdrawalType === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setWithdrawalType('mobile')}
                  className="h-auto py-4"
                  disabled={!country?.mobileProviders?.length}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    <span className="text-sm">Mobile Money</span>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={withdrawalType === 'bank' ? 'default' : 'outline'}
                  onClick={() => setWithdrawalType('bank')}
                  className="h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Building className="h-5 w-5" />
                    <span className="text-sm">Bank Account</span>
                  </div>
                </Button>
              </div>

              {withdrawalType === 'mobile' ? (
                <>
                  <div>
                    <Label htmlFor="mobile_provider">Mobile Provider</Label>
                    <Select 
                      value={withdrawalData.mobile_provider} 
                      onValueChange={(val) => setWithdrawalData({...withdrawalData, mobile_provider: val})}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {country?.mobileProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="mobile_number">Phone Number</Label>
                    <Input
                      id="mobile_number"
                      type="tel"
                      value={withdrawalData.mobile_number}
                      onChange={(e) => setWithdrawalData({...withdrawalData, mobile_number: e.target.value})}
                      placeholder="e.g., +254712345678"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Select 
                      value={withdrawalData.bank_name} 
                      onValueChange={(val) => setWithdrawalData({...withdrawalData, bank_name: val})}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {country?.banks.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bank_account_number">Account Number</Label>
                    <Input
                      id="bank_account_number"
                      value={withdrawalData.bank_account_number}
                      onChange={(e) => setWithdrawalData({...withdrawalData, bank_account_number: e.target.value})}
                      placeholder="Account number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank_account_name">Account Name</Label>
                    <Input
                      id="bank_account_name"
                      value={withdrawalData.bank_account_name}
                      onChange={(e) => setWithdrawalData({...withdrawalData, bank_account_name: e.target.value})}
                      placeholder="Account holder name"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep('country')} 
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleWithdrawalSubmit} 
                  disabled={loading} 
                  className="flex-1"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Setup
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};