import { Card, CardContent } from "@/components/ui/card";

type CheckoutPreviewProps = {
  businessName: string;
  headerGradient: string;
  productName: string;
  productDescription?: string;
  amount: string; // e.g., "USD 25.00"
  imageUrl?: string;
  imageAlt?: string;
};

export function CheckoutPreview({
  businessName,
  headerGradient,
  productName,
  productDescription,
  amount,
  imageUrl,
  imageAlt = "Product image",
}: CheckoutPreviewProps) {
  return (
    <Card className="overflow-hidden border-border bg-card/90 backdrop-blur-sm shadow-2xl">
      <div className="p-4 text-white" style={{ background: headerGradient }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center text-xs font-bold">NP</div>
            <div className="text-sm font-semibold truncate max-w-[12rem]">{businessName}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-white/80">pay</div>
            <div className="text-sm font-bold">#ABC12345</div>
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div
            className="rounded-lg overflow-hidden bg-muted/40 border border-border h-44 sm:h-48 md:h-56 w-full"
            style={{
              backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
              backgroundSize: imageUrl ? 'cover' : undefined,
              backgroundPosition: imageUrl ? 'center' : undefined,
              backgroundRepeat: imageUrl ? 'no-repeat' : undefined,
            }}
          >
            {!imageUrl && (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-background">
                <span className="text-muted-foreground text-xs">{imageAlt}</span>
              </div>
            )}
          </div>
          <div className="rounded-lg bg-foreground/5 dark:bg-white/5 p-4 border border-border">
            <div className="text-sm font-semibold mb-2">Order Summary</div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="text-sm font-medium">{productName}</div>
                {productDescription && (
                  <div className="text-xs text-muted-foreground">{productDescription}</div>
                )}
              </div>
              <div className="text-sm font-bold">{amount}</div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">Total</span>
              <span className="text-sm font-bold">{amount}</span>
            </div>
          </div>
        </div>

        {/* Disabled inputs for preview only */}
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input disabled readOnly className="bg-background border border-border rounded px-3 py-2 text-sm opacity-80 cursor-not-allowed" placeholder="Full Name" />
            <input disabled readOnly className="bg-background border border-border rounded px-3 py-2 text-sm opacity-80 cursor-not-allowed" placeholder="Email Address" />
          </div>
          <input disabled readOnly className="bg-background border border-border rounded px-3 py-2 text-sm w-full opacity-80 cursor-not-allowed" placeholder="WhatsApp Number" />
          <button disabled aria-disabled="true" className="w-full text-white text-sm font-medium py-2.5 rounded opacity-70 cursor-not-allowed" style={{ background: headerGradient }}>
            Pay {amount}
          </button>
          <p className="text-[10px] text-center text-muted-foreground">Secured by NardoPay • Encrypted checkout</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default CheckoutPreview;


