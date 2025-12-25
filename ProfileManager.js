const fs = require("fs");
const crypto = require("crypto");

const PROFILE_FILE = "profiles.json";
let cache = {};

if (fs.existsSync(PROFILE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(PROFILE_FILE, "utf8"));
  } catch { cache = {}; }
}

function save() {
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(cache, null, 2));
}

function shortUA(ua) {
  if (!ua) return "Unknown UA";
  if (ua.length < 40) return ua;
  return ua.substring(0, 35) + " ... " + ua.slice(-15);
}

function getProfile(wallet, proxy, ua) {
  const key = wallet.toLowerCase();

  if (!cache[key]) {
    const uuid = crypto.randomUUID();
    const device = proxy ? proxy.split("@").pop() : "LOCAL";
    cache[key] = { wallet, device, ua, uuid };
    save();
  }

  const p = cache[key];
  return {
    ...p,
    identity: `${p.wallet} | ${p.device} | ${shortUA(p.ua)}`
  };
}

module.exports = { getProfile };
