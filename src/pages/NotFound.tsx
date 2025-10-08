import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="inline-block relative">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute inset-0 blur-3xl bg-primary/20 -z-10"></div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="gap-2"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Need help? Visit our support page or contact us
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a
              href="/contact"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Contact Support
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="/resources"
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              Browse Resources
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
