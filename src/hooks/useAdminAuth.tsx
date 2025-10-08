import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/**
 * SECURITY NOTE: This hook provides UI-level admin checking ONLY.
 * 
 * The client-side role check here is for user experience (showing/hiding UI elements).
 * ACTUAL SECURITY is enforced by:
 * 1. Row Level Security (RLS) policies on database tables
 * 2. Server-side role validation in edge functions
 * 3. The has_role() database function that checks user_roles table
 * 
 * An attacker can bypass this client-side check by modifying JavaScript,
 * but they still cannot access protected resources due to RLS policies.
 * 
 * All admin operations MUST have server-side validation.
 */
export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Unauthorized",
            description: "Please log in to access admin panel",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Check admin role from secure user_roles table
        const { data: userRole, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (error) {
          console.error("Error checking admin role:", error);
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        if (!userRole) {
          toast({
            title: "Access Denied",
            description: "You don't have permission to access the admin panel",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Admin auth check error:", error);
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [navigate, toast]);

  return { isAdmin, isLoading };
};
