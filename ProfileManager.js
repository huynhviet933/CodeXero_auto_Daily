const fs = require("fs");
const crypto = require("crypto");

const PROFILE_FILE = "profiles.json";
const LOCK_FILE = "profiles.lock";

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ===== File Lock =====
async function acquireLock() {
  while (true) {
    try {
      fs.writeFileSync(LOCK_FILE, process.pid.toString(), { flag: "wx" });
      return;
    } catch {
      await sleep(5);
    }
  }
}

function releaseLock() {
  try { fs.unlinkSync(LOCK_FILE); } catch {}
}

// ===== Disk Identity =====
async function getProfile(wallet, proxy, ua) {
  await acquireLock();

  let data = {};
  if (fs.existsSync(PROFILE_FILE)) {
    try { data = JSON.parse(fs.readFileSync(PROFILE_FILE)); } catch {}
  }

  const key = wallet.toLowerCase();

  if (!data[key]) {
    data[key] = {
      wallet,
      uuid: crypto.randomUUID(),
      device: proxy ? proxy.split("@").pop() : "LOCAL",
      ua
    };
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(data, null, 2));
  }

  const profile = data[key];

  releaseLock();

  return {
    wallet: profile.wallet,
    uuid: profile.uuid,
    device: profile.device,
    ua: profile.ua
  };
}

module.exports = { getProfile };
