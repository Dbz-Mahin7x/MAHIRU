const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "sing",
    version: "5.1.1",
    author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
    countDown: 5,
    role: 0,
    category: "media",
    shortDescription: { en: "Fail-proof song player" },
    longDescription: { en: "Instantly plays audio via Mahiru Indestructible API." },
    guide: { en: "{pn} <song name>" }
  },

  onStart: async function ({ api, args, message, event }) {
    
    if (this.config.author !== "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧") {
      return api.sendMessage("❌ Author modified.", event.threadID);
    }

    const query = args.join(" ").trim();
    if (!query) return;

    api.setMessageReaction("🎀", event.messageID, () => {}, true);

    try {
     
      const configRes = await axios.get("https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json");
      const MAHIRU_API = configRes.data.sing; //Um

    
      const searchRes = await axios.get(`${MAHIRU_API}/song?q=${encodeURIComponent(query)}`);
      const song = searchRes.data;

      if (!song.download_url) {
        api.setMessageReaction("💔", event.messageID, () => {}, true);
        return;
      }

      const cachePath = path.join(__dirname, "cache");
      await fs.ensureDir(cachePath);
      const filePath = path.join(cachePath, `${Date.now()}.mp3`);

    
      const response = await axios({
        method: "GET",
        url: song.download_url,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", async () => {
        const body = 
          `✧ ೃ༄ ──── ୨ 🎀 ୧ ──── ✧ ೃ༄\n` +
          `🐾✨ 𝐘𝐎𝐔𝐑 𝐒𝐎𝐍𝐆 𝐈𝐒 𝐑𝐄𝐀𝐃𝐘 ✨🐾\n\n` +
          `📀 𝐓𝐢𝐭𝐥𝐞: ${song.title}\n` +
          `⏱ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${song.duration}\n` +
          `🫧 𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐯𝐢𝐛𝐞𝐬, 𝐡𝐮𝐧!\n` +
          `✧ ೃ༄ ──── ୨ 🧸 ୧ ──── ✧ ೃ༄`;

        await message.reply({
          body: body,
          attachment: fs.createReadStream(filePath)
        }, () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
          api.setMessageReaction("✅", event.messageID, () => {}, true);
        });
      });

      writer.on("error", () => api.setMessageReaction("❌", event.messageID, () => {}, true));

    } catch (err) {
      console.log("SING ERROR:", err.message);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }
};