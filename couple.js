"use strict";

const axios = require("axios");

// Helper to fetch API URL from your central Api.json
async function getApiUrl() {
  if (global.coupleApiUrl) return global.coupleApiUrl;
  try {
    const { data } = await axios.get('https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json');
    let base = data["Couple"];
    // Ensure no trailing slash
    global.coupleApiUrl = base.endsWith('/') ? base.slice(0, -1) : base;
    return global.coupleApiUrl;
  } catch (error) {
    console.error("Failed to fetch Couple API config:", error.message);
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

const header = `✧ ೃ༄ ──── ୨ 🎀 ୧ ──── ✧ ೃ༄\n`;
const footer = `\n✧ ೃ༄ ──── ୨ 🧸 ୧ ──── ✧ ೃ༄`;

module.exports = {
  config: {
    name: "couple",
    aliases: ["animecouple"],
    version: "4.2.0",
    author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
    countDown: 5,
    role: 0,
    category: "anime",
    shortDescription: "🎀 Cute anime couples system"
  },

  onStart: async function ({ args, message, event, api }) {
    const input = args.join(" ").toLowerCase();
    const { messageID } = event;

    // 🎀 HELP
    if (input === "help") {
      return message.reply(
`${header}🎀 ${toBold("Anime Couples Commands")} 🎀

• couple → random 💖
• couple naruto → by anime 🍥
• couple search gojo → search 🔍
• couple tag wholesome → tags 🏷️
• couple top → best couples 🏆
• couple stats → api stats 📊
• couple list → all anime 📋

${footer}`);
    }

    api.setMessageReaction("💗", messageID, () => {}, true);

    try {
      const API_BASE_URL = await getApiUrl();
      let endpoint = "";
      let params = {};

      // 🎀 ROUTING
      if (input === "stats") endpoint = "/api/stats";
      else if (input === "list") endpoint = "/api/anime";
      else if (input === "top") endpoint = "/api/couples/top";
      else if (input.startsWith("tag ")) {
        endpoint = "/api/couples/tag";
        params.tag = input.replace("tag ", "");
      }
      else if (input.startsWith("search ")) {
        endpoint = "/api/couples/search";
        params.q = input.replace("search ", "");
      }
      else if (!input) {
        endpoint = "/api/couples/random";
      }
      else {
        // Assume input is anime name
        endpoint = `/api/couples/anime/${encodeURIComponent(input)}`;
      }

      const res = await axios.get(API_BASE_URL + endpoint, { params });
      const data = res.data;

      if (!data.success) {
        return message.reply(`${header}❌ ${toBold("No results found")}${footer}`);
      }

      // 📊 STATS
      if (input === "stats") {
        const s = data.stats;
        return message.reply(
`${header}📊 ${toBold("API Stats")}

💖 Couples: ${toBold(s.totalCouples.toString())}
🍥 Anime: ${toBold(s.totalAnime.toString())}
👥 Characters: ${toBold(s.totalCharacters.toString())}

${footer}`);
      }

      // 📋 LIST
      if (input === "list") {
        let text = `${header}📋 ${toBold("Anime List")}\n\n`;
        data.anime.forEach(a => {
          text += `${a.emoji} ${toBold(a.name)} (${a.couples})\n`;
        });
        return message.reply(text + footer);
      }

      // 🏆 TOP / SEARCH / TAG
      if (input === "top" || input.startsWith("search ") || input.startsWith("tag ")) {
        const title = input === "top" ? "Top Couples" : "Search Results";
        let text = `${header}${input === "top" ? "🏆" : "🔍"} ${toBold(title)}\n\n`;
        data.couples.slice(0, 5).forEach((c, i) => {
          text += `${i + 1}. ${c.animeEmoji} ${toBold(c.name)}\n💖 ${c.ratingStars}\n\n`;
        });
        return message.reply(text + footer);
      }

      // 🎀 RANDOM OR SPECIFIC ANIME RESULT
      let couple;
      if (endpoint === "/api/couples/random") {
        couple = data.couple;
      } else {
        const list = data.couples;
        if (!list || list.length === 0) {
          return message.reply(`${header}❌ ${toBold("No couples found")}${footer}`);
        }
        couple = list[Math.floor(Math.random() * list.length)];
      }

      // Selection of image
      const imgUrl = couple.images && couple.images.length > 0 ? couple.images[0] : null;

      const resultMessage = 
`${header}${couple.animeEmoji} ${toBold("Cute Couple")} ${couple.animeEmoji}

💖 ${toBold(couple.name)}
⭐ ${couple.ratingStars}

👫 ${couple.characters.join(" ❤️ ")}

📖 ${toBold(couple.type)}
🏷️ ${couple.tags.join(", ")}

"${couple.quote}"

${footer}`;

      if (imgUrl) {
        const imageStream = await axios.get(imgUrl, { responseType: "stream" });
        await message.reply({
          body: resultMessage,
          attachment: imageStream.data
        });
      } else {
        await message.reply(resultMessage);
      }

    } catch (err) {
      console.log(err.message);
      return message.reply(
`${header}❌ ${toBold("API Error")}
Ensure the link in Api.json is valid 💔
${footer}`);
    }
  }
};
