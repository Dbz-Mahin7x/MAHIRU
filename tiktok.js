"use strict";

const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// Helper to fetch API URL from your central Api.json
async function getApiUrl() {
  if (global.tiktokApiUrl) return global.tiktokApiUrl;
  try {
    const { data } = await axios.get('https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json');
    let base = data["tiktok-dl"];
    global.tiktokApiUrl = base.endsWith('/') ? base.slice(0, -1) : base;
    return global.tiktokApiUrl;
  } catch (error) {
    console.error("Failed to fetch TikTok API config:", error.message);
    throw error;
  }
}

const toBold = (t) => {
  const map = {
    a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",i:"𝐢",j:"𝐣",k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",y:"𝐲",z:"𝐳",
    A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",I:"𝐈",J:"𝐉",K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",Y:"𝐘",Z:"𝐙",
    0:"𝟎",1:"𝟏",2:"𝟐",3:"𝟑",4:"𝟒",5:"𝟓",6:"𝟔",7:"𝟕",8:"𝟖",9:"𝟗"
  };
  return t.split("").map(c => map[c] || c).join("");
};

module.exports = {
  config: {
    name: "tiktok",
    version: "1.0.1",
    author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
    countDown: 10,
    role: 0,
    category: "media",
    shortDescription: "📥 Download TikTok videos without watermark"
  },

  onStart: async function ({ api, event, args, message }) {
    const url = args[0];
    const { threadID, messageID } = event;
    
    if (!url || !url.includes('tiktok.com')) {
      return message.reply(
        `🎵 ${toBold("Please provide a TikTok URL!")}\n\n` +
        `${toBold("Example:")}\n` +
        `/tiktok https://vm.tiktok.com/ZS...`
      );
    }

    const loadingMsg = await message.reply(`⏳ ${toBold("Downloading TikTok video...")}`);

    try {
      const BASE_URL = await getApiUrl();
      const apiUrl = `${BASE_URL}/api/tiktok?url=${encodeURIComponent(url)}`;
      
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (!data.success) {
        api.unsendMessage(loadingMsg.messageID);
        return message.reply(`❌ ${toBold(data.error || "Download failed")}`);
      }

      const videoUrl = data.video.no_watermark;
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
      
      const videoPath = path.join(cacheDir, `tiktok_${Date.now()}.mp4`);
      
      const videoResponse = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(videoPath);
      videoResponse.data.pipe(writer);

      writer.on('finish', async () => {
        const info = 
          `🎵 ${toBold("TikTok Downloaded")}\n\n` +
          `👤 @${data.author.unique_id}\n` +
          `📝 ${data.metadata.title || 'No caption'}\n\n` +
          `❤️ ${toBold(data.stats.likes.toLocaleString())} likes\n` +
          `💬 ${toBold(data.stats.comments.toLocaleString())} comments\n` +
          `🔄 ${toBold(data.stats.shares.toLocaleString())} shares\n\n` +
          `✨ ${toBold("No watermark!")}`;

        await message.reply({
          body: info,
          attachment: fs.createReadStream(videoPath)
        });

        // Cleanup
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
        api.unsendMessage(loadingMsg.messageID);
      });

      writer.on('error', (err) => {
        throw err;
      });

    } catch (error) {
      console.error(error);
      api.unsendMessage(loadingMsg.messageID);
      message.reply(`❌ ${toBold("Error:")} ${error.message}`);
    }
  }
};
