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

// netlify/functions/webhooks-paystack.ts
var webhooks_paystack_exports = {};
__export(webhooks_paystack_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(webhooks_paystack_exports);
var import_node_crypto = require("crypto");
var json = (statusCode, data) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(data)
});
var handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });
  const secret = process.env.PAYSTACK_SECRET_KEY || "";
  const signature = event.headers["x-paystack-signature"] || event.headers["X-Paystack-Signature"];
  const computed = (0, import_node_crypto.createHmac)("sha512", secret).update(event.body || "").digest("hex");
  if (!secret || !signature || signature !== computed) {
    return json(401, { error: "Invalid signature" });
  }
  return json(200, { received: true });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=webhooks-paystack.js.map
