import * as crypto from "crypto";

export function buildSignature({
  timestamp,
  method,
  endpoint,
  bodyString,
  apiSecret,
}: {
  timestamp: string;
  method: string;
  endpoint: string;
  bodyString: string; // '' for GET
  apiSecret: string;
}): string {
  const prehash = `${timestamp}${method.toUpperCase()}${endpoint}${bodyString}`;
  const hmac = crypto.createHmac("sha256", apiSecret).update(prehash).digest();
  return hmac.toString("base64");
}
