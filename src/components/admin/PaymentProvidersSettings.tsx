import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";

/**
 * ⚠️ CRITICAL SECURITY WARNING ⚠️
 * 
 * This component manages sensitive payment provider credentials.
 * 
 * SECURITY ARCHITECTURE:
 * - Payment credentials (consumer_key, consumer_secret) are NEVER fetched from the server
 * - The manage-payment-configs edge function filters out secrets in list operations
 * - Server-side admin role checks are enforced by RLS and edge functions
 * - Client-side admin checks are for UX only - actual security is server-side
 * - All credential operations are logged in admin_audit_logs table
 * 
 * DEVELOPER GUIDELINES:
 * - NEVER add code that fetches or displays payment credentials
 * - NEVER bypass server-side validation
 * - ALL admin operations MUST go through edge functions with role checks
 * - Test new admin features with non-admin accounts to verify security
 * - Credentials are write-only: admins can set them but never retrieve them
 */

interface ProviderConfig {
  id: string;
  provider: string;
  country_code: string;
  environment: string;
  // SECURITY: These fields are NEVER returned from the server for security
  // They only exist in the form state when creating/updating configs
  consumer_key?: string;
  consumer_secret?: string;
  ipn_id: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const COUNTRIES = [
  { code: "KE", name: "Kenya" },
  { code: "UG", name: "Uganda" },
  { code: "TZ", name: "Tanzania" },
  { code: "MW", name: "Malawi" },
  { code: "RW", name: "Rwanda" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

export default function PaymentProvidersSettings() {
  const [configs, setConfigs] = useState<ProviderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ProviderConfig | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    provider: "pesapal",
    country_code: "KE",
    environment: "sandbox",
    consumer_key: "",
    consumer_secret: "",
    ipn_id: "",
    is_active: true,
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('manage-payment-configs', {
        body: { action: 'list' },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setConfigs(data.configs || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Unable to load configurations",
        variant: "destructive",
      });
      console.error('[UI] Config fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const action = editingConfig ? 'update' : 'create';
      const body = editingConfig 
        ? { action, id: editingConfig.id, ...formData }
        : { action, ...formData };

      const { data, error } = await supabase.functions.invoke('manage-payment-configs', {
        body,
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Success",
        description: `Configuration ${editingConfig ? 'updated' : 'created'} successfully`,
      });

      setDialogOpen(false);
      resetForm();
      fetchConfigs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Operation failed. Please try again.",
        variant: "destructive",
      });
      console.error('[UI] Config save error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this config?")) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('manage-payment-configs', {
        body: { action: 'delete', id },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: "Success",
        description: "Configuration deleted successfully",
      });
      fetchConfigs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Deletion failed. Please try again.",
        variant: "destructive",
      });
      console.error('[UI] Config delete error:', error);
    }
  };

  const handleEdit = (config: ProviderConfig) => {
    setEditingConfig(config);
    setFormData({
      provider: config.provider,
      country_code: config.country_code,
      environment: config.environment,
      consumer_key: '', // Don't populate secrets in edit form
      consumer_secret: '', // Never show existing secrets
      ipn_id: config.ipn_id || "",
      is_active: config.is_active,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingConfig(null);
    setFormData({
      provider: "pesapal",
      country_code: "KE",
      environment: "sandbox",
      consumer_key: "",
      consumer_secret: "",
      ipn_id: "",
      is_active: true,
    });
  };

  const registerIPN = async (config: ProviderConfig) => {
    try {
      toast({
        title: "Registering IPN",
        description: "Please wait...",
      });

      const ipnUrl = 'https://mczqwqsvumfsneoknlep.supabase.co/functions/v1/pesapal-ipn';
      
      // Call edge function with only configId - credentials fetched server-side
      const { data, error } = await supabase.functions.invoke('pesapal-register-ipn', {
        body: {
          configId: config.id,
          ipnUrl,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `IPN registered: ${data.ipn_id}`,
      });
      
      fetchConfigs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register IPN",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Payment Gateway Configurations</h3>
            <p className="text-sm text-muted-foreground">Manage payment provider credentials by country</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Config
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingConfig ? "Edit" : "Add"} Payment Provider Config</DialogTitle>
                <DialogDescription>
                  Configure payment gateway credentials for a specific country
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select
                    value={formData.provider}
                    onValueChange={(value) => setFormData({ ...formData, provider: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pesapal">Pesapal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select
                    value={formData.country_code}
                    onValueChange={(value) => setFormData({ ...formData, country_code: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Environment</Label>
                  <Select
                    value={formData.environment}
                    onValueChange={(value) => setFormData({ ...formData, environment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Consumer Key</Label>
                  <Input
                    value={formData.consumer_key}
                    onChange={(e) => setFormData({ ...formData, consumer_key: e.target.value })}
                    placeholder="Enter consumer key"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Consumer Secret</Label>
                  <Input
                    value={formData.consumer_secret}
                    onChange={(e) => setFormData({ ...formData, consumer_secret: e.target.value })}
                    placeholder="Enter consumer secret"
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label>IPN ID (Optional)</Label>
                  <Input
                    value={formData.ipn_id}
                    onChange={(e) => setFormData({ ...formData, ipn_id: e.target.value })}
                    placeholder="Enter IPN ID"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Active</Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingConfig ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : configs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No payment provider configurations yet. Add one to get started.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Consumer Key</TableHead>
                  <TableHead>Consumer Secret</TableHead>
                  <TableHead>IPN ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">
                      {COUNTRIES.find(c => c.code === config.country_code)?.name || config.country_code}
                    </TableCell>
                    <TableCell className="capitalize">{config.provider}</TableCell>
                    <TableCell>
                      <Badge variant={config.environment === "production" ? "default" : "secondary"}>
                        {config.environment}
                      </Badge>
                    </TableCell>
                     <TableCell>
                       <div className="flex items-center gap-2">
                         <code className="text-xs">••••••••</code>
                         <span className="text-xs text-muted-foreground">Hidden for security</span>
                       </div>
                     </TableCell>
                     <TableCell>
                       <code className="text-xs">••••••••</code>
                     </TableCell>
                    <TableCell>
                      {config.ipn_id ? (
                        <code className="text-xs">{config.ipn_id.substring(0, 8)}...</code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.is_active ? "default" : "secondary"}>
                        {config.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => registerIPN(config)}
                          title={config.ipn_id ? "Re-register IPN with Pesapal" : "Register IPN with Pesapal"}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(config)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(config.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-2">Quick Setup - Test Credentials</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Securely add all 7 country test credentials from Pesapal (credentials stored server-side only)
        </p>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              const { data: session } = await supabase.auth.getSession();
              if (!session?.session?.access_token) {
                throw new Error('Not authenticated');
              }

              // Call secure edge function to add test configs
              const { data, error } = await supabase.functions.invoke('setup-test-configs', {
                body: {
                  action: 'setup_test_configs',
                },
                headers: {
                  Authorization: `Bearer ${session.session.access_token}`,
                },
              });

              if (error) throw error;

              const successCount = data.results.filter((r: any) => r.success).length;
              toast({
                title: "Success",
                description: `${successCount} of 7 test configurations added successfully`,
              });
              
              fetchConfigs();
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message || "Failed to add test configurations",
                variant: "destructive",
              });
            }
          }}
        >
          Add All Test Configurations
        </Button>
      </Card>
    </div>
  );
}
