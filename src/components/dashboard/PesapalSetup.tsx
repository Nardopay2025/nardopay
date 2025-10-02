import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";

export function PesapalSetup() {
  const [loading, setLoading] = useState(false);
  const [ipnId, setIpnId] = useState<string | null>(null);

  const registerIPN = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('pesapal-register-ipn', {
        body: {
          ipnUrl: 'https://mczqwqsvumfsneoknlep.supabase.co/functions/v1/pesapal-ipn'
        }
      });

      if (error) throw error;

      if (data?.ipn_id) {
        setIpnId(data.ipn_id);
        toast.success('IPN URL registered successfully!');
      } else {
        throw new Error('No IPN ID returned');
      }
    } catch (error: any) {
      console.error('IPN registration error:', error);
      toast.error(error.message || 'Failed to register IPN URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (ipnId) {
      navigator.clipboard.writeText(ipnId);
      toast.success('IPN ID copied to clipboard!');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pesapal Setup</CardTitle>
        <CardDescription>
          Register your IPN URL with Pesapal to receive payment notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!ipnId ? (
          <>
            <p className="text-sm text-muted-foreground">
              Click the button below to register your IPN (Instant Payment Notification) URL with Pesapal.
              This is required to receive payment status updates.
            </p>
            <Button onClick={registerIPN} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register IPN URL
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">IPN URL Registered Successfully!</span>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Your IPN ID:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-muted px-3 py-2 rounded text-sm font-mono break-all">
                  {ipnId}
                </code>
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Next Steps:</p>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                <li>Copy the IPN ID above</li>
                <li>Go to your Supabase project settings</li>
                <li>Navigate to Edge Functions secrets</li>
                <li>Add a new secret named <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">PESAPAL_IPN_ID</code></li>
                <li>Paste the IPN ID as the value</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
