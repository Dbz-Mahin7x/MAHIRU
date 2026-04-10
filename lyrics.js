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
    aliases: ["ly"],
    version: "1.1.0",
    author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
    countDown: 5,
    role: 0,
    shortDescription: "Get song lyrics",
    longDescription: "Fetch lyrics with artist and image using your custom Vercel API",
    category: "music",
    guide: "{pn} <song name>"
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const songName = args.join(" ");

    if (!songName) {
      return api.sendMessage(`${header}💔 ${toBold("Baby... give me a song name first")} 😩${footer}`, threadID, messageID);
    }

    try {
      const BASE_URL = await getLyricsApi();
      const apiUrl = `${BASE_URL}/api/lyrics?song=${encodeURIComponent(songName)}`;
      
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || data.status !== "success") {
        return api.sendMessage(`${header}❌ ${toBold("Couldn't find those lyrics for you")} 😢${footer}`, threadID, messageID);
      }

      // Formatting the lyrics message
      const resultMsg = 
`${header}🎵 ${toBold("Song")}: ${data.song}
🎤 ${toBold("Artist")}: ${data.artist}
👑 ${toBold("Dev")}: ${data.operator}

━━━━━━━━━━━━━━━
${data.lyrics.length > 3900 ? data.lyrics.slice(0, 3850) + "... (truncated)" : data.lyrics}
━━━━━━━━━━━━━━━

🔗 ${toBold("Source")}: ${data.url}${footer}`;

      // Sending message with album art attachment
      const imageStream = await global.utils.getStreamFromURL(data.image);
      
      return api.sendMessage({
        body: resultMsg,
        attachment: imageStream
      }, threadID, messageID);

    } catch (err) {
      console.error("Lyrics Error:", err.message);
      return api.sendMessage(`${header}⚠️ ${toBold("The API is acting up... like my heart")} 💔${footer}`, threadID, messageID);
    }
  }
};
