const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "profile",
    aliases: ["dp", "pp", "pfp", "ump"], // 🐾 aliases
    version: "2.0.0",
    author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
    role: 0,
    countDown: 5,
    shortDescription: "🎀 View Facebook profile",
    longDescription: "🪻 Show profile picture, cover photo & user info (reply / mention / link / self)",
    category: "information",
    guide: {
      en: "{pn} [reply | @mention | profile link]"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    const cacheDir = path.join(__dirname, "cache");
    const avatarPath = path.join(cacheDir, "avatar.png");
    const coverPath = path.join(cacheDir, "cover.png");

    try {
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      let uid;

      // 🐾 Reply
      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      }
      // 🐾 Mention
      else if (Object.keys(event.mentions || {}).length > 0) {
        uid = Object.keys(event.mentions)[0];
      }
      // 🐾 Link
      else if (args[0] && args[0].includes(".com/")) {
        uid = await api.getUID(args[0]);
      }
      // 🐾 Self
      else {
        uid = event.senderID;
      }

      const name = await usersData.getName(uid);

      const avatarURL = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const coverURL = `https://graph.facebook.com/${uid}?fields=cover&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // 🌸 Fetch cover
      let coverImage = null;
      try {
        const coverRes = await axios.get(coverURL);
        if (coverRes.data.cover?.source) {
          await new Promise(resolve =>
            request(encodeURI(coverRes.data.cover.source))
              .pipe(fs.createWriteStream(coverPath))
              .on("close", resolve)
          );
          coverImage = fs.createReadStream(coverPath);
        }
      } catch {}

      // 🌸 Fetch avatar
      await new Promise(resolve =>
        request(encodeURI(avatarURL))
          .pipe(fs.createWriteStream(avatarPath))
          .on("close", resolve)
      );

      const attachments = [
        fs.createReadStream(avatarPath),
        ...(coverImage ? [coverImage] : [])
      ];

      api.sendMessage(
        {
          body:
`⋆˚✿˖°────୨🪽୧────°˖✿˚⋆
🐾🪄 𝓟𝓻𝓸𝓯𝓲𝓵𝓮 𝓥𝓲𝓮𝔀𝓮𝓻 🪄🐾

🎀 𝐍𝐚𝐦𝐞 : ${name}
🦋 𝐔𝐬𝐞𝐫 𝐈𝐃 : ${uid}
🪻 𝐋𝐢𝐧𝐤 : https://facebook.com/${uid}

✨ 𝐀𝐯𝐚𝐭𝐚𝐫 & 𝐂𝐨𝐯𝐞𝐫 𝐑𝐞𝐚𝐝𝐲 💕

🍬 

❤️‍🔥 Enjoy the cuteness!
⋆˚✿˖°────୨🫧୧────°˖✿˚⋆`,
          attachment: attachments
        },
        event.threadID,
        () => {
          if (fs.existsSync(avatarPath)) fs.unlinkSync(avatarPath);
          if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
        },
        event.messageID
      );

    } catch (err) {
      console.error(err);
      api.sendMessage(
`🐾🫧 Oopsie Cutie!
✨ Something went wrong 💔
🍬 Please try again later`,
        event.threadID,
        event.messageID
      );
    }
  }
};