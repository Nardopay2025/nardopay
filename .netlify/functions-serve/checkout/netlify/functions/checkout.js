var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/checkout.ts
var checkout_exports = {};
__export(checkout_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(checkout_exports);
var json = (statusCode, data) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(data)
});
async function initiatePaystack(body) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return json(500, { error: "Missing PAYSTACK_SECRET_KEY" });
  const { amount, currency, email, linkId, metadata } = body;
  if (currency !== "NGN") return json(400, { error: "Paystack requires NGN currency for card init" });
  const naira = Number(amount);
  if (!Number.isFinite(naira) || naira <= 0) return json(400, { error: "Invalid amount" });
  const kobo = Math.round(naira * 100);
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${secret}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email || "customer@example.com",
      amount: kobo,
      currency: "NGN",
      metadata: { linkId, ...metadata || {} }
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return json(res.status, { error: "Paystack init failed", details: text });
  }
  const data = await res.json();
  return json(200, { provider: "paystack", data });
}
var handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { linkId, amount, currency, rail } = body;
    if (!linkId || amount === void 0 || !currency || !rail) return json(400, { error: "Missing fields" });
    if (rail === "paystack") {
      return await initiatePaystack({ ...body });
    }
    if (rail === "flutterwave") {
      const secret = process.env.FLW_SECRET_KEY;
      const publicKey = process.env.FLW_PUBLIC_KEY;
      if (!secret || !publicKey) return json(500, { error: "Missing FLW keys" });
      const tx_ref = `flw_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      const payload = {
        tx_ref,
        amount,
        currency,
        redirect_url: process.env.SITE_URL || process.env.VITE_API_BASE_URL || "http://localhost:8888",
        customer: {
          email: body.email || "customer@example.com"
        },
        meta: { linkId }
      };
      const res = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${secret}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        return json(res.status, { error: "Flutterwave init failed", details: text });
      }
      const data = await res.json();
      return json(200, { provider: "flutterwave", data });
    }
    return json(501, { error: "Selected rail not implemented yet", rail });
  } catch (err) {
    return json(500, { error: "Internal error", details: err?.message || String(err) });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=checkout.js.map
