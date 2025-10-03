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

// netlify/functions/webhooks-flutterwave.ts
var webhooks_flutterwave_exports = {};
__export(webhooks_flutterwave_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(webhooks_flutterwave_exports);
var json = (statusCode, data) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(data)
});
var handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });
  const secretHash = process.env.FLW_SECRET_HASH;
  const header = event.headers["verif-hash"] || event.headers["Verif-Hash"];
  if (!secretHash || !header || header !== secretHash) {
    return json(401, { error: "Invalid signature" });
  }
  try {
    const payload = event.body ? JSON.parse(event.body) : {};
    return json(200, { received: true });
  } catch (e) {
    return json(400, { error: "Bad Request", details: e?.message || String(e) });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=webhooks-flutterwave.js.map
