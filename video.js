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

if (!global.videoHistory) {
  global.videoHistory = new Set();
}

const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json`);
  return base.data.video;
};

module.exports = {
  config: {
    name: "video",
    version: "3.0.0",
    author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
    countDown: 5,
    role: 0,
    shortDescription: "High Quality Anime Video Search 🎀",
    category: "media",
    guide: { en: "{pn} <anime edit>" }
  },

  onStart: async function ({ api, event, args, message }) {
    const input = args.join(" ").toLowerCase();
    const cacheDir = path.join(__dirname, "cache");

    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    if (!input) {
      return message.reply(
`${header}🍓 ${toBold("𝐏𝐨𝐨𝐤𝐢𝐞'𝐬 𝐕𝐢𝐝𝐞𝐨 𝐕𝐚𝐮𝐥𝐭")} 🍓

🌷 ${toBold("𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐲𝐩𝐞 𝐬𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠 𝐜𝐮𝐭𝐞~")}

🎀 ${toBold("𝐄𝐱𝐚𝐦𝐩𝐥𝐞")}: video zoro edit
🥀 ${toBold("𝐄𝐱𝐚𝐦𝐩𝐥𝐞")}: video anime sad

"𝒾'𝓁𝓁 𝒻𝒾𝓃𝒹 𝓉𝒽𝑒 𝒷𝑒𝓈𝓉 𝑜𝓃𝑒𝓈 𝒻𝑜𝓇 𝓊𝓈" 🍬${footer}`);
    }

    api.setMessageReaction("🫧", event.messageID, () => {}, true);

    const videoPath = path.join(
      cacheDir,
      `vid_${event.senderID}_${Date.now()}.mp4`
    );

    try {
      const apiUrl = await baseApiUrl();
      
      const response = await axios.get(`${apiUrl}/mahin`, {
        params: {
          keyword: input,
          platform: "tiktok",
          random: true
        }
      });

      const videoData = response.data?.data;

      if (!videoData || !videoData.videoUrl) {
        api.setMessageReaction("🥀", event.messageID, () => {}, true);
        return message.reply(
`${header}🍂 ${toBold("𝐈 𝐜𝐨𝐮𝐥𝐝𝐧'𝐭 𝐟𝐢𝐧𝐝 𝐚𝐧𝐲 𝐩𝐫𝐞𝐭𝐭𝐲 𝐯𝐢𝐝𝐞𝐨𝐬 𝐟𝐨𝐫")} "${toBold(input)}" 🥀

💔 ${toBold("𝐓𝐫𝐲 𝐚 𝐝𝐢𝐟𝐟𝐞𝐫𝐞𝐧𝐭 𝐤𝐞𝐲𝐰𝐨𝐫𝐝, 𝐦𝐲 𝐥𝐨𝐯𝐞!")}${footer}`);
      }

      if (global.videoHistory.has(videoData.videoId)) {
        global.videoHistory.clear();
      }
      global.videoHistory.add(videoData.videoId);
      if (global.videoHistory.size > 100) global.videoHistory.clear();

      const videoBuffer = await axios.get(videoData.videoUrl, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(videoPath, Buffer.from(videoBuffer.data));

      const resultBody = 
`${header}🎀 ${toBold("𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐛𝐞𝐚𝐮𝐭𝐢𝐟𝐮𝐥 𝐯𝐢𝐝𝐞𝐨, 𝐝𝐚𝐫𝐥𝐢𝐧𝐠!")} 🎀

🌷 ${toBold("𝐊𝐞𝐲𝐰𝐨𝐫𝐝")}: ${toBold(input)}
🎬 ${toBold("𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧")}: ${toBold(videoData.duration?.toString() || "?")}𝐬
👤 ${toBold("𝐀𝐮𝐭𝐡𝐨𝐫")}: ${toBold(videoData.author || "Unknown")}

🍭 ${toBold("𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐯𝐢𝐛𝐞𝐬, 𝐩𝐨𝐨𝐤𝐢𝐞!")} 🫧

"𝒾𝓉'𝓈 𝒿𝓊𝓈𝓉 𝒻𝑜𝓇 𝓎𝑜𝓊" 🍫${footer}`;

      await message.reply({
        body: resultBody,
        attachment: fs.createReadStream(videoPath)
      });

      api.setMessageReaction("💗", event.messageID, () => {}, true);

      if (fs.existsSync(videoPath)) {
        setTimeout(() => fs.unlinkSync(videoPath), 5000);
      }

    } catch (error) {
      console.error("Video Error:", error);
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      api.setMessageReaction("⚠️", event.messageID, () => {}, true);
      return message.reply(
`${header}｡°(°¯᷄◠¯᷅°)°｡ ${toBold("𝐏𝐨𝐨𝐤𝐢𝐞, 𝐬𝐨𝐦𝐞𝐭𝐡𝐢𝐧𝐠 𝐰𝐞𝐧𝐭 𝐰𝐫𝐨𝐧𝐠...")}

💔 ${toBold("𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫!")} 🥀${footer}`);
    }
  }
};
