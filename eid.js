"use strict";

const axios = require("axios");

const toBold = (t) => {
  const m = { a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢", j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦", n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳", A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌", N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙", 0: "𝟎", 1: "𝟏", 2: "𝟐", 3: "𝟑", 4: "𝟒", 5: "𝟓", 6: "𝟔", 7: "𝟕", 8: "𝟖", 9: "𝟗" };
  return String(t).split("").map(c => m[c] || c).join("");
};

const header = `✧ ೃ༄ ──── ୨ 🌙 ୧ ──── ✧ ೃ༄\n`;
const footer = `\n✧ ೃ༄ ──── ୨ 🧸 ୧ ──── ✧ ೃ༄`;
const divider = `✧ ೃ༄ ─── ୨ ✨ ୧ ─── ✧ ೃ༄\n`;

module.exports = {
  config: {
    name: "eid",
    version: "4.2.0",
    author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
    description: "Eid countdown with modular Vercel API and Author Lock",
    category: "fun",
    countDown: 5,
    role: 0
  },

  onStart: async function ({ event, api }) {
    // 🛡️ AUTHOR LOCK SYSTEM
    if (this.config.author !== "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧") {
      console.warn(`[AUTHOR LOCK] Unauthorized author change detected in 'eid' command!`);
      return api.sendMessage(`⚠️ ${toBold("AUTHOR ERROR")}\n${divider}Don't change the author name! This command belongs to 𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧`, event.threadID);
    }

    const eidDate = new Date("May 27, 2026 00:00:00").getTime();
    const now = new Date().getTime();
    const t = eidDate - now;

    if (t <= 0) {
      return api.sendMessage(
        `${header}🎊 ${toBold("𝐄𝐈𝐃 𝐌𝐔𝐁𝐀𝐑𝐀𝐊!")} 🎊\n${divider}আজ খুশির ঈদ! আল্লাহ আপনাদের সবার জীবনে আনন্দ ও শান্তি বয়ে আনুন। 🌙✨\n${footer}`,
        event.threadID
      );
    }

    const days = Math.floor(t / (1000 * 60 * 60 * 24));
    const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((t % (1000 * 60)) / 1000);

    const message = `${header}` +
      `🕌 ${toBold("𝐀𝐆𝐑𝐈𝐌 𝐄𝐈𝐃 𝐌𝐔𝐁𝐀𝐑𝐀𝐊")} 🕌\n` +
      `${divider}` +
      `خوف خدا دیکھنا ہے تو مسلمان کا دیکھ جو روزے میں وضو کا পানি منہ میں لیکر بھی پیতা نہیں ہے ✨\n` +
      `${divider}` +
      `🍓 ${toBold("𝐄𝐢𝐝 𝐂𝐨𝐮𝐧𝐭𝐝𝐨𝐰𝐧")} »\n` +
      `🗓️ ${toBold(days)} দিন ${toBold(hours)} ঘণ্টা\n` +
      `⏳ ${toBold(minutes)} মিনিট ${toBold(seconds)} সেকেন্ড\n` +
      `${divider}` +
      `📌 ${toBold("𝐂𝐡𝐚𝐧𝐝 𝐃𝐞𝐤𝐡𝐚𝐫 𝐎𝐩𝐨𝐫 𝐃𝐢𝐩𝐞𝐧𝐝")}\n` +
      `🎀 ${toBold("𝐂𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲")}: ${toBold("Mahiru X Mahin")}${footer}`;

    try {
      const userRepoApi = "https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json";
      const githubResponse = await axios.get(userRepoApi);
      const vercelBaseUrl = githubResponse.data.img; 
      const finalImageUrl = `${vercelBaseUrl}/api/imgs/eid`;

      const stream = await global.utils.getStreamFromURL(finalImageUrl);

      return api.sendMessage({
        body: message,
        attachment: stream
      }, event.threadID, event.messageID);
      
    } catch (e) {
      return api.sendMessage(message, event.threadID, event.messageID);
    }
  }
};
