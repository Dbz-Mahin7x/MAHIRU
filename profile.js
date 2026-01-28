const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "profile",
    aliases: ["dp", "pp", "pfp", "ump"],
    version: "2.1.0",
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

    // Fresh token for fetching cover photos and high-res avatars
    const token = "350685531728|62f8ce9f74b12f84c123cc23462a4a61";

    try {
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      let uid;
      if (event.type === "message_reply") {
        uid = event.messageReply.senderID;
      } else if (Object.keys(event.mentions || {}).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else if (args[0] && args[0].includes(".com/")) {
        uid = await api.getUID(args[0]);
      } else {
        uid = event.senderID;
      }

      const name = await usersData.getName(uid);

      // ✨ UPDATED: Stable high-res Avatar and Cover URLs
      const avatarURL = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=${token}`;
      const coverURL = `https://graph.facebook.com/${uid}?fields=cover&access_token=${token}`;

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
      } catch (err) {
        console.log("No cover found or token error for cover.");
      }

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
          body: `⋆˚✿˖°────୨🪽୧────°˖✿˚⋆\n🐾🪄 𝓟𝓻𝓸𝓯𝓲𝓵𝓮 𝓥𝓲𝓮𝔀𝓮𝓻 🪄🐾\n\n🎀 𝐍𝐚𝐦𝐞 : ${name}\n🦋 𝐔𝐬𝐞𝐫 𝐈𝐃 : ${uid}\n🪻 𝐋𝐢𝐧𝐤 : https://facebook.com/${uid}\n\n✨ 𝐀𝐯𝐚𝐭𝐚𝐫 & 𝐂𝐨𝐯𝐞𝐫 𝐑𝐞𝐚𝐝𝐲 💕\n\n❤️‍🔥 Enjoy the cuteness!\n⋆˚✿˖°────୨🫧୧────°˖✿˚⋆`,
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
      api.sendMessage("🐾🫧 Oopsie! Something went wrong while fetching the profile. 💔", event.threadID, event.messageID);
    }
  }
};
