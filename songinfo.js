const axios = require('axios');

module.exports = {
  name: 'songinfo',
  version: '1.0.0',
  hasPermssion: 0,
  credits: '𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧',
  description: 'ℹ️ Get detailed song information from your API',
  commandCategory: '𝐌𝐔𝐒𝐈𝐂',
  usages: '[song ID]',
  cooldowns: 3,

  async getApiUrl() {
    try {
      const { data } = await axios.get('https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json');
      const base = data["song-finder"];
      if (!base) throw new Error('Song-finder URL not found');
      return base.endsWith('/') ? base.slice(0, -1) : base;
    } catch (error) {
      console.error('Error fetching API URL:', error.message);
      return null;
    }
  },

  async run({ api, event, args }) {
    const { threadID, messageID } = event;
    
    if (!args || args.length === 0) {
      return api.sendMessage(
        'ℹ️ Please provide a song ID!\n\nExample: /songinfo 1147409136\n\nGet IDs from /song command results.',
        threadID,
        messageID
      );
    }

    const songId = args[0].trim();

    const apiUrl = await this.getApiUrl();
    
    if (!apiUrl) {
      return api.sendMessage('❌ API configuration error! Check your Api.json', threadID, messageID);
    }

    const searchingMsg = await api.sendMessage(`ℹ️ Getting info for song ID: ${songId}...`, threadID);

    try {
      const { data } = await axios.get(`${apiUrl}/api/info`, {
        params: { id: songId },
        timeout: 10000
      });

      if (!data.success || !data.song) {
        return api.sendMessage(
          `❌ Song not found with ID: ${songId}`,
          threadID,
          searchingMsg.messageID
        );
      }

      const s = data.song;

      let msg = `ℹ️ 𝐒𝐎𝐍𝐆 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍\n`;
      msg += `━━━━━━━━━━━━━━━━━━\n`;
      msg += `🎵 Title: ${s.title}\n`;
      msg += `👤 Artist: ${s.artist}\n`;
      msg += `💿 Album: ${s.album || 'N/A'}\n`;
      msg += `⏱️ Duration: ${s.duration || 'N/A'}\n`;
      
      if (s.genre) msg += `🎭 Genre: ${s.genre}\n`;
      if (s.year) msg += `📅 Year: ${s.year}\n`;
      if (s.release_date) msg += `📆 Released: ${s.release_date}\n`;
      
      msg += `🆔 ID: ${s.id}\n`;
      msg += `━━━━━━━━━━━━━━━━━━\n`;
      msg += `🎵 Use /song to search more\n`;
      msg += `📝 Use /lyrics ${s.title} by ${s.artist} for lyrics`;

      if (s.thumbnail) {
        try {
          const imgResponse = await axios({
            method: 'get',
            url: s.thumbnail,
            responseType: 'stream'
          });

          await api.sendMessage({
            body: msg,
            attachment: imgResponse.data
          }, threadID, searchingMsg.messageID);
        } catch {
          await api.sendMessage(msg, threadID, searchingMsg.messageID);
        }
      } else {
        await api.sendMessage(msg, threadID, searchingMsg.messageID);
      }

    } catch (error) {
      console.error('Song info error:', error);
      await api.sendMessage(
        `❌ Error fetching song info\n\n${error.message}`,
        threadID,
        searchingMsg.messageID
      );
    }
  }
};