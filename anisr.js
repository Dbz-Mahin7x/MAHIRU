"use strict";

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const toBold = (t) => {
  const m = { 
    a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢", j: "𝐣", k: "𝐤", l: "𝐥", m: "𝐦", n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭", u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳",
    A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉", K: "𝐊", L: "𝐋", M: "𝐌", N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓", U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙",
    0: "𝟎", 1: "𝟏", 2: "𝟐", 3: "𝟑", 4: "𝟒", 5: "𝟓", 6: "𝟔", 7: "𝟕", 8: "𝟖", 9: "𝟗"
  };
  return t.split("").map(c => m[c] || c).join("");
};

const header = `✧ ೃ༄ ──── ୨ 🎀 ୧ ──── ✧ ೃ༄\n`;
const footer = `\n✧ ೃ༄ ──── ୨ 🧸 ୧ ──── ✧ ೃ༄`;

if (!global.animeHistory) {
  global.animeHistory = new Set();
}

const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json`);
  return base.data.video;
};

module.exports = {
  config: {
    name: "anisr",
    version: "3.3.0",
    author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
    countDown: 5,
    role: 0,
    category: "anime",
    shortDescription: "Anime edit video search 🎀",
    guide: { en: "{pn} <anime name>" }
  },

  onStart: async function ({ api, args, event, message }) {
    const query = args.join(" ");
    
    if (!query) {
      return message.reply(
`${header}🍭 ${toBold("𝐄𝐧𝐭𝐞𝐫 𝐚𝐧𝐢𝐦𝐞 𝐧𝐚𝐦𝐞, 𝐝𝐚𝐫𝐥𝐢𝐧𝐠!")}

🌷 ${toBold("𝐄𝐱𝐚𝐦𝐩𝐥𝐞")}: anisr naruto
🎀 ${toBold("𝐄𝐱𝐚𝐦𝐩𝐥𝐞")}: anisr gojo edit

"𝒾'𝓁𝓁 𝒻𝒾𝓃𝒹 𝓉𝒽𝑒 𝒷𝑒𝓈𝓉 𝑒𝒹𝒾𝓉𝓈 𝒻𝑜𝓇 𝓎𝑜𝓊" 🍬${footer}`);
    }

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const filePath = path.join(cacheDir, `anime_${event.senderID}_${Date.now()}.mp4`);
    api.setMessageReaction("🍭", event.messageID, () => {}, true);

    try {
      const apiUrl = await baseApiUrl();
      
      const response = await axios.get(`${apiUrl}/mahin`, {
        params: {
          keyword: query,
          platform: "tiktok",
          random: true
        }
      });

      const videoData = response.data?.data;

      if (!videoData || !videoData.videoUrl) {
        api.setMessageReaction("🥀", event.messageID, () => {}, true);
        return message.reply(
`${header}🍂 ${toBold("𝐍𝐨 𝐚𝐧𝐢𝐦𝐞 𝐞𝐝𝐢𝐭𝐬 𝐟𝐨𝐮𝐧𝐝 𝐟𝐨𝐫")} "${toBold(query)}" 🥀

💔 ${toBold("𝐓𝐫𝐲 𝐚 𝐝𝐢𝐟𝐟𝐞𝐫𝐞𝐧𝐭 𝐚𝐧𝐢𝐦𝐞 𝐧𝐚𝐦𝐞, 𝐦𝐲 𝐥𝐨𝐯𝐞!")}${footer}`);
      }

      // Avoid duplicates
      if (global.animeHistory.has(videoData.videoId)) {
        global.animeHistory.clear();
      }
      global.animeHistory.add(videoData.videoId);
      if (global.animeHistory.size > 100) global.animeHistory.clear();

      const videoBuffer = await axios.get(videoData.videoUrl, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, Buffer.from(videoBuffer.data));

      const resultBody = 
`${header}✨ ${toBold("𝐀𝐧𝐢𝐦𝐞 𝐄𝐝𝐢𝐭 𝐅𝐨𝐮𝐧𝐝!")} ✨

🎀 ${toBold("𝐀𝐧𝐢𝐦𝐞")}: ${toBold(query)}
🎬 ${toBold("𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧")}: ${toBold(videoData.duration?.toString() || "?")}𝐬
👤 ${toBold("𝐂𝐫𝐞𝐚𝐭𝐨𝐫")}: ${toBold(videoData.author || "Unknown")}

🍭 ${toBold("𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐯𝐢𝐛𝐞𝐬, 𝐩𝐨𝐨𝐤𝐢𝐞!")} 🫧

"𝒶𝓃𝒾𝓂𝑒 𝒾𝓈 𝒻𝑜𝓇 𝓉𝒽𝑒 𝓈𝑜𝓊𝓁" 🎀${footer}`;

      await message.reply({
        body: resultBody,
        attachment: fs.createReadStream(filePath)
      });

      api.setMessageReaction("🎀", event.messageID, () => {}, true);

      if (fs.existsSync(filePath)) {
        setTimeout(() => fs.unlinkSync(filePath), 5000);
      }

    } catch (err) {
      console.error("Anisearch Error:", err);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      api.setMessageReaction("🥀", event.messageID, () => {}, true);
      return message.reply(
`${header}｡°(°¯᷄◠¯᷅°)°｡ ${toBold("𝐏𝐨𝐨𝐤𝐢𝐞, 𝐬𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠 𝐰𝐞𝐧𝐭 𝐰𝐫𝐨𝐧𝐠...")}

💔 ${toBold("𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫!")} 🥀${footer}`);
    }
  }
};