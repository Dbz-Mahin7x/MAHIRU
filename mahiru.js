"use strict";

const axios = require("axios");

const pookies = ["baby", "bby", "babu", "bbu", "jan", "bot", "জান", "জানু", "বেবি", "wifey", "mahiru"];

const toBold = (t) => {
  const map = {
    a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",i:"𝐢",j:"𝐣",k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",y:"𝐲",z:"𝐳",
    A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",I:"𝐈",J:"𝐉",K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",Y:"𝐘",Z:"𝐙",
    0:"𝟎",1:"𝟏",2:"𝟐",3:"𝟑",4:"𝟒",5:"𝟓",6:"𝟔",7:"𝟕",8:"𝟖",9:"𝟗"
  };
  return t.split("").map(c => map[c] || c).join("");
};

// Strictly fetch from Api.json - No hardcoded fallbacks
async function getBaseApiUrl() {
  if (global.mahiruBaseApiUrl) return global.mahiruBaseApiUrl;
  try {
    const { data } = await axios.get('https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json');
    let base = data["mahiru"];
    if (!base) throw new Error("Key 'mahiru' missing in Api.json");
    global.mahiruBaseApiUrl = base.endsWith('/') ? base.slice(0, -1) : base;
    return global.mahiruBaseApiUrl;
  } catch (error) {
    console.error("Critical API Error:", error.message);
    throw new Error("Could not retrieve Mahiru API URL from configuration.");
  }
}

module.exports.config = {
   name: "mahiru",
   aliases: ["baby", "bby", "bbu", "jan", "janu", "wifey", "bot", "pookie"],
   version: "2.1.1",
   author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
   role: 0,
   category: "chat",
   guide: {
     en: "{pn} [message] OR teach [question] - [response] OR remove [question] - [index] OR list OR list all OR edit [question] - [newResponse] OR msg [question]"
   }
 };

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const msg = args.join(" ").toLowerCase();
  const uid = event.senderID;
  const { threadID, messageID } = event;

  try {
    const baseApiUrl = await getBaseApiUrl();

    if (!args[0]) {
      const ran = ["Bolo baby 🎀", "I love you pookie 💖", "Type !mahiru hi ✨"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], threadID, messageID);
    }

    // --- TEACH COMMAND ---
    if (args[0] === "teach") {
      const content = msg.replace("teach ", "");
      const [trigger, ...responsesArr] = content.split(" - ");
      const responses = responsesArr.join(" - ");
      if (!trigger || !responses) return api.sendMessage(`❌ | teach [question] - [response]`, threadID, messageID);
      
      const response = await axios.post(`${baseApiUrl}/api/jan/teach`, { trigger, responses, userID: uid });
      const userName = (await usersData.getName(uid)) || "Pookie";
      return api.sendMessage(`✅ Replies added: "${responses}" to "${trigger}"\n• ${toBold("Teacher")}: ${userName}\n• ${toBold("Total")}: ${toBold((response.data.count || 0).toString())}`, threadID, messageID);
   }

    // --- REMOVE COMMAND ---
    if (args[0] === "remove") {
      const content = msg.replace("remove ", "");
      const [trigger, index] = content.split(" - ");
      if (!trigger || !index || isNaN(index)) return api.sendMessage(`❌ | remove [question] - [index]`, threadID, messageID);
      const response = await axios.delete(`${baseApiUrl}/api/jan/remove`, {
        data: { trigger, index: parseInt(index, 10) }
      });
      return api.sendMessage(response.data.message, threadID, messageID);
   }

    // --- LIST COMMAND ---
    if (args[0] === "list") {
      const endpoint = args[1] === "all" ? "/list/all" : "/list";
      const response = await axios.get(`${baseApiUrl}/api/jan${endpoint}`);
      if (args[1] === "all") {
        let message = `👑 ${toBold("Mahiru's Top Teachers")}:\n\n`;
        const data = Object.entries(response.data.data).sort((a, b) => b[1] - a[1]).slice(0, 15);
        for (let i = 0; i < data.length; i++) {
          const [userID, count] = data[i];
          const name = (await usersData.getName(userID)) || "Unknown";
          message += `${i + 1}. ${name}: ${toBold(count.toString())}\n`;
        }
        return api.sendMessage(message, threadID, messageID);
      }
      return api.sendMessage(response.data.message, threadID, messageID);
   }

    // --- EDIT COMMAND ---
    if (args[0] === "edit") {
      const content = msg.replace("edit ", "");
      const [oldTrigger, ...newArr] = content.split(" - ");
      const newResponse = newArr.join(" - ");
      if (!oldTrigger || !newResponse) return api.sendMessage(`❌ | Format: edit [question] - [newResponse]`, threadID, messageID);
      await axios.put(`${baseApiUrl}/api/jan/edit`, { oldTrigger, newResponse });
      return api.sendMessage(`✅ Edited "${oldTrigger}" to "${newResponse}"`, threadID, messageID);
   }

    // --- MESSAGE SEARCH ---
    if (args[0] === "msg") {
      const searchTrigger = args.slice(1).join(" ");
      if (!searchTrigger) return api.sendMessage("Please provide a message to search. 🔍", threadID, messageID);
      try {
        const response = await axios.get(`${baseApiUrl}/api/jan/msg`, { params: { userMessage: `msg ${searchTrigger}` } });
        return api.sendMessage(response.data.message || "No message found.", threadID, messageID);
      } catch (error) {
        return api.sendMessage("Error finding message. ⚠️", threadID, messageID);
      }
   }

    // --- DEFAULT CHAT LOGIC ---
    const botResponse = await getMahiruResponse(msg, event.attachments || [], baseApiUrl);
    api.sendMessage(botResponse, threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "mahiru",
          type: "reply",
          messageID: info.messageID,
          author: uid,
          text: botResponse
        });
      }
    }, messageID);

  } catch (err) {
    api.sendMessage(`❌ ${toBold("Config Error")}: ${err.message}`, threadID, messageID);
  }
};

async function getMahiruResponse(text, attachments, baseUrl) {
  try {
    const res = await axios.post(`${baseUrl}/api/mahiru`, { text, style: 3, attachments });
    return res.data.message;
  } catch { return "error janu... Mahiru API is unreachable 🥹"; }
}

module.exports.onReply = async ({ api, event }) => {
   if (event.type !== "message_reply") return;
   try {
    const baseApiUrl = await getBaseApiUrl();
    const replyMessage = await getMahiruResponse(event.body?.toLowerCase() || "hi", event.attachments || [], baseApiUrl);
    api.sendMessage(replyMessage, event.threadID, (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: "mahiru",
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          text: replyMessage
        });
      }
    }, event.messageID);
  } catch (err) { console.error(err); }
};

module.exports.onChat = async ({ api, event }) => {
  try {
    const message = event.body?.toLowerCase() || "";
    const attachments = event.attachments || [];
    const baseApiUrl = await getBaseApiUrl();

    if (event.type !== "message_reply" && pookies.some(word => message.startsWith(word))) {
      api.setMessageReaction("🎀", event.messageID, () => {}, true);
      
      const randomMessage = [
        "𝐁𝐨𝐥𝐨 𝐣𝐚𝐧 𝐤𝐢 𝐤𝐨𝐫𝐭𝐞 𝐩𝐚𝐫𝐢 𝐭𝐦𝐫 𝐣𝐨𝐧𝐧𝐨🥹❤️‍🩹",
        "𝐇𝐞𝐲 𝐦𝐲 𝐥𝐢𝐭𝐭𝐥𝐞 𝐜𝐮𝐢𝐭𝐞 𝐩𝐢𝐞💦🎀🪄",
        "𝐁𝐛𝐲🌹𝐑𝐨𝐬𝐞 𝐍𝐢𝐚 𝐚𝐬𝐨 𝐩𝐥𝐳𝐳𝐳𝐳🦋❄️",
        "🫠𝐓𝐮𝐦𝐫 𝐣𝐧𝐧𝐨 𝐚𝐦𝐚𝐫 𝐀𝐦𝐦𝐮 𝐛𝐨𝐤𝐚 𝐝𝐞𝐢 ☹️🎀",
        "𝐁𝐛𝐲 𝐜𝐮𝐭𝐞 𝐯𝐢𝐛𝐞 𝐚ล𝐥 𝖽𝖺𝗒 🎀🍓🤍",
        "বলো ফুলটুশি_😘",
        "মায়া সবসময়ই কিছু না কিছুতে বাঁধা দিবেই🩷🪻🫧",
        "𝐀𝐥𝐚𝐛𝐮 𝐉𝐚𝐧𝐧 ❤️‍🩹",
        "👀𝐉𝐚𝐧 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧 𝐊𝐨𝐫𝐛𝐚💅🙍‍♀️",
        "𝐁𝐛𝐲 𝐜𝐮𝐭𝐞 𝐦𝐨𝐝𝐞 𝐚𝐜𝐭𝐢𝐯𝐞 🎀✨"
      ];

      const mahiruMessage = randomMessage[Math.floor(Math.random() * randomMessage.length)];
      const messageParts = message.trim().split(/\s+/);

      if (messageParts.length === 1 && attachments.length === 0) {
        api.sendMessage(mahiruMessage, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "mahiru",
              type: "reply",
              author: event.senderID,
              text: mahiruMessage
            });
          }
        }, event.messageID);
      } else {
        let userText = message;
        for (const prefix of pookies) {
          if (message.startsWith(prefix)) {
            userText = message.substring(prefix.length).trim();
            break;
          }
        }
        const res = await axios.post(`${baseApiUrl}/api/mahiru`, { text: userText, style: 3, attachments });
        const botResponse = res.data.message;
        api.sendMessage(botResponse, event.threadID, (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "mahiru",
              type: "reply",
              author: event.senderID,
              text: botResponse
            });
          }
        }, event.messageID);
      }
    }
  } catch (err) { console.error("onChat error:", err.message); }
};
