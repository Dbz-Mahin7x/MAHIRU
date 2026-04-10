"use strict";

const axios = require("axios");

const toBold = (t) => {
  const map = {
    a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",i:"𝐢",j:"𝐣",k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",y:"𝐲",z:"𝐳",
    A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",I:"𝐈",J:"𝐉",K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",Y:"𝐘",Z:"𝐙",
    0:"𝟎",1:"𝟏",2:"𝟐",3:"𝟑",4:"𝟒",5:"𝟓",6:"𝟔",7:"𝟕",8:"𝟖",9:"𝟗"
  };
  return t.split("").map(c => map[c] || c).join("");
};

// Fetch API URL strictly from Api.json
async function getLyricsApi() {
  if (global.lyricsApiUrl) return global.lyricsApiUrl;
  try {
    const { data } = await axios.get('https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json');
    let base = data["lyrics"];
    if (!base) throw new Error("Key 'lyrics' not found");
    global.lyricsApiUrl = base.endsWith('/') ? base.slice(0, -1) : base;
    return global.lyricsApiUrl;
  } catch (error) {
    console.error("API Config Error:", error.message);
    throw error;
  }
}

const header = `✧ ೃ༄ ──── ୨ 🎀 ୧ ──── ✧ ೃ༄\n`;
const footer = `\n✧ ೃ༄ ──── ୨ 🧸 ୧ ──── ✧ ೃ༄`;

module.exports = {
  config: {
    name: "lyrics",
    aliases: ["song", "ly", "lyric"],
    version: "2.0.0",
    author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
    countDown: 5,
    role: 0,
    shortDescription: "🎀 Get beautiful song lyrics",
    longDescription: "Fetch lyrics with artist name and album art using your custom Vercel API",
    category: "music",
    guide: { en: "{pn} <song name>" }
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const songName = args.join(" ");

    if (!songName) {
      api.setMessageReaction("🍭", messageID, () => {}, true);
      return api.sendMessage(
`${header}🎀 ${toBold("𝐇𝐞𝐲 𝐜𝐮𝐭𝐢𝐞, 𝐭𝐞𝐥𝐥 𝐦𝐞 𝐚 𝐬𝐨𝐧𝐠 𝐧𝐚𝐦𝐞!")} 🎀

🌷 ${toBold("𝐄𝐱𝐚𝐦𝐩𝐥𝐞")}: lyrics blur
💝 ${toBold("𝐄𝐱𝐚𝐦𝐩𝐥𝐞")}: lyrics shape of you
🍭 ${toBold("𝐄𝐱𝐚𝐦𝐩𝐥𝐞")}: lyrics anime op

✨ ${toBold("𝐈'𝐥𝐥 𝐟𝐢𝐧𝐝 𝐭𝐡𝐞 𝐥𝐲𝐫𝐢𝐜𝐬 𝐟𝐨𝐫 𝐲𝐨𝐮, 𝐦𝐲 𝐥𝐨𝐯𝐞~")}
${footer}`, threadID, messageID);
    }

    api.setMessageReaction("🫧", messageID, () => {}, true);

    try {
      const BASE_URL = await getLyricsApi();
      const apiUrl = `${BASE_URL}/api/lyrics?song=${encodeURIComponent(songName)}`;
      
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || data.status !== "success") {
        api.setMessageReaction("🥀", messageID, () => {}, true);
        return api.sendMessage(
`${header}🍂 ${toBold("𝐀𝐰𝐰, 𝐈 𝐜𝐨𝐮𝐥𝐝𝐧'𝐭 𝐟𝐢𝐧𝐝 𝐭𝐡𝐨𝐬𝐞 𝐥𝐲𝐫𝐢𝐜𝐬...")} 🥀

💔 ${toBold("𝐓𝐫𝐲 𝐚 𝐝𝐢𝐟𝐟𝐞𝐫𝐞𝐧𝐭 𝐬𝐨𝐧𝐠 𝐧𝐚𝐦𝐞, 𝐝𝐚𝐫𝐥𝐢𝐧𝐠!")}
✨ ${toBold("𝐄𝐱𝐚𝐦𝐩𝐥𝐞")}: lyrics perfect
${footer}`, threadID, messageID);
      }

      // Format the lyrics message without dividers
      const lyricsText = data.lyrics.length > 3500 ? data.lyrics.slice(0, 3450) + "... (｡•́︿•̀｡) 𝐓𝐫𝐮𝐧𝐜𝐚𝐭𝐞𝐝" : data.lyrics;
      
      const resultMsg = 
`${header}🎵 ${toBold("𝐒𝐨𝐧𝐠")}: ${toBold(data.song)} 🎵
🎤 ${toBold("𝐀𝐫𝐭𝐢𝐬𝐭")}: ${toBold(data.artist)}
👑 ${toBold("𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫")}: ${toBold(data.operator)}

${lyricsText}

🔗 ${toBold("𝐒𝐨𝐮𝐫𝐜𝐞")}: ${data.url}

🍭 ${toBold("𝐄𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐦𝐮𝐬𝐢𝐜, 𝐦𝐲 𝐥𝐨𝐯𝐞!")} 💖
${footer}`;

      // Send message with album art attachment
      const imageStream = await global.utils.getStreamFromURL(data.image);
      
      api.setMessageReaction("💗", messageID, () => {}, true);
      
      return api.sendMessage({
        body: resultMsg,
        attachment: imageStream
      }, threadID, messageID);

    } catch (err) {
      console.error("Lyrics Error:", err.message);
      api.setMessageReaction("💔", messageID, () => {}, true);
      return api.sendMessage(
`${header}｡°(°¯᷄◠¯᷅°)°｡ ${toBold("𝐎𝐡 𝐧𝐨, 𝐭𝐡𝐞 𝐀𝐏𝐈 𝐢𝐬 𝐛𝐞𝐢𝐧𝐠 𝐬𝐡𝐲!")} 💔

🌷 ${toBold("𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐥𝐚𝐭𝐞𝐫, 𝐬𝐰𝐞𝐞𝐭𝐢𝐞~")}
✨ ${toBold("𝐈 𝐤𝐧𝐨𝐰 𝐲𝐨𝐮'𝐫𝐞 𝐝𝐲𝐢𝐧𝐠 𝐭𝐨 𝐬𝐢𝐧𝐠 𝐚𝐥𝐨𝐧𝐠!")}
${footer}`, threadID, messageID);
    }
  }
};