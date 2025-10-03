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

// netlify/functions/webhooks-mtnmomo.ts
var webhooks_mtnmomo_exports = {};
__export(webhooks_mtnmomo_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(webhooks_mtnmomo_exports);
var json = (statusCode, data) => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(data)
});
var handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method Not Allowed" });
  try {
    return json(200, { received: true });
  } catch (err) {
    return json(400, { error: "Bad Request", details: err?.message || String(err) });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=webhooks-mtnmomo.js.map
