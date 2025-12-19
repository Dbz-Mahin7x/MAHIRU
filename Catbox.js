const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "catbox",
    aliases: ["catboxupload"],
    version: "1.0",
    author: "𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧",
    countDown: 5,
    role: 0,
    shortDescription: "Upload media to catbox.moe",
    longDescription: "Upload images/GIFs/videos to catbox.moe and get a direct link",
    category: "utility",
    guide: "{p}catbox [reply to an image/GIF/video]"
  },

  onStart: async function ({ api, event, args }) {
    try {
      // Check if there's a reply with an attachment
      if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
        return api.sendMessage("🔸 Please reply to an image, GIF, or video to upload it to Catbox.", event.threadID, event.messageID);
      }

      const attachment = event.messageReply.attachments[0];
      const supportedTypes = ["photo", "animated_image", "video"];

      if (!supportedTypes.includes(attachment.type)) {
        return api.sendMessage("❌ Unsupported file type. Only images, GIFs, and videos are allowed.", event.threadID, event.messageID);
      }

      // Download the file
      const fileUrl = attachment.url;
      const fileName = `${Date.now()}_${attachment.type === 'photo' ? 'image.jpg' : attachment.type === 'animated_image' ? 'gif.gif' : 'video.mp4'}`;
      const filePath = path.join(__dirname, 'tmp', fileName);

      await fs.ensureDir(path.join(__dirname, 'tmp'));
      const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      await fs.writeFile(filePath, Buffer.from(response.data, 'binary'));

      // Upload to Catbox
      const catboxUrl = 'https://catbox.moe/user/api.php';
      const formData = {
        fileToUpload: fs.createReadStream(filePath),
        reqtype: 'fileupload'
      };

      const uploadResponse = await axios.post(catboxUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const catboxLink = uploadResponse.data.trim();

      // Send the result
      api.sendMessage(`✅𝐅𝐢𝐥𝐞 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝 𝐓𝐨 𝐂𝐚𝐭𝐛𝐨𝐱 \n✨ ${catboxLink}`, event.threadID, () => {
        // Clean up: Delete the temporary file
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete temp file:", err);
        });
      });

    } catch (error) {
      console.error(error);
      api.sendMessage("❌𝐅𝐚𝐢𝐥𝐞𝐝 𝐓𝐨 𝐔𝐩𝐥𝐨𝐚𝐝 𝐅𝐢𝐥𝐞. 𝐓𝐫𝐲 𝐀𝐠𝐚𝐢𝐧 𝐋𝐚𝐭𝐞𝐫🫠.", event.threadID, event.messageID);
    }
  }
};