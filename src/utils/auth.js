import { encode as base64encode } from "base64-arraybuffer";

function makeUrlSafe(string) {
    return string
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  const base64Digest = base64encode(digest);
  return makeUrlSafe(base64Digest);
}

export { generateCodeChallenge }