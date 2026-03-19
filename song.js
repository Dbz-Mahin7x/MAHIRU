const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'song',
  version: '2.0.0',
  hasPermssion: 0,
  credits: '𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧',
  description: '🎵 Search and play songs from your API',
  commandCategory: '𝐌𝐔𝐒𝐈𝐂',
  usages: '[song name]',
  cooldowns: 5,

  async getApiUrl() {
    try {
      const { data } = await axios.get('https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json');
      const base = data["song-finder"];
      if (!base) throw new Error('Song-finder URL not found in Api.json');
      return base.endsWith('/') ? base.slice(0, -1) : base;
    } catch (error) {
      console.error('Error fetching API URL:', error.message);
      return null;
    }
  },

  async run({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    
    if (!args || args.length === 0) {
      return api.sendMessage('🎵 Please provide a song name!\nExample: /song shape of you', threadID, messageID);
    }

    const query = args.join(' ');
    const apiUrl = await this.getApiUrl();
    
    if (!apiUrl) {
      return api.sendMessage('❌ API configuration error! Please check your Api.json file.', threadID, messageID);
    }

    const searchingMsg = await api.sendMessage(`🔍 Searching for "${query}"...`, threadID);
    
    try {
      const { data } = await axios.get(`${apiUrl}/api/search`, {
        params: { q: query, source: 'itunes', limit: 5 },
        timeout: 10000
      });

      if (!data.success || !data.results || data.results.length === 0) {
        return api.sendMessage(`❌ No results found for "${query}"`, threadID, messageID);
      }

      let msg = `🎵 𝐒𝐎𝐍𝐆 𝐒𝐄𝐀𝐑𝐂𝐇 𝐑𝐄𝐒𝐔𝐋𝐓𝐒\n`;
      msg += `━━━━━━━━━━━━━━━━━━\n`;
      msg += `🔍 Query: ${query}\n`;
      msg += `📊 Found: ${data.results.length} songs\n`;
      msg += `━━━━━━━━━━━━━━━━━━\n\n`;

      data.results.forEach((song, index) => {
        msg += `${index + 1}. ${song.title}\n`;
        msg += `   👤 Artist: ${song.artist}\n`;
        msg += `   ⏱️ Duration: ${song.duration || '3:30'}\n`;
        msg += `   🆔 ID: ${song.id}\n\n`;
      });

      msg += `━━━━━━━━━━━━━━━━━━\n`;
      msg += `📝 Reply with the number (1-5) to select`;

      global.client.handleReply.push({
        name: this.name,
        messageID: searchingMsg.messageID,
        author: senderID,
        type: 'select',
        results: data.results,
        apiUrl: apiUrl
      });

      return api.sendMessage(msg, threadID, searchingMsg.messageID);

    } catch (error) {
      console.error('Song search error:', error);
      return api.sendMessage(`❌ Error searching for song: ${error.message}`, threadID, messageID);
    }
  },

  async handleReply({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body } = event;
    const { author, type, results, apiUrl } = handleReply;

    if (senderID !== author) return;

    try {
      if (type === 'select') {
        const selection = parseInt(body);

        if (isNaN(selection) || selection < 1 || selection > results.length) {
          return api.sendMessage(`❌ Please reply with a valid number 1-${results.length}`, threadID, messageID);
        }

        const selectedSong = results[selection - 1];
        
        await api.sendMessage(`⏳ Getting "${selectedSong.title}" info...`, threadID);

        const { data } = await axios.get(`${apiUrl}/api/info`, {
          params: { id: selectedSong.id },
          timeout: 10000
        });

        if (!data.success || !data.song) {
          return api.sendMessage('❌ Could not get song details', threadID, messageID);
        }

        const song = data.song;

        let msg = `🎵 𝐍𝐎𝐖 𝐏𝐋𝐀𝐘𝐈𝐍𝐆\n`;
        msg += `━━━━━━━━━━━━━━━━━━\n`;
        msg += `📀 Title: ${song.title}\n`;
        msg += `👤 Artist: ${song.artist}\n`;
        msg += `💿 Album: ${song.album || 'Single'}\n`;
        msg += `⏱️ Duration: ${song.duration || '3:30'}\n`;
        
        if (song.genre) msg += `🎭 Genre: ${song.genre}\n`;
        if (song.year) msg += `📅 Year: ${song.year}\n`;
        
        msg += `━━━━━━━━━━━━━━━━━━\n`;

        if (song.preview_url) {
          try {
            const audioResponse = await axios({
              method: 'get',
              url: song.preview_url,
              responseType: 'stream',
              timeout: 15000
            });

            const cachePath = path.join(__dirname, 'cache');
            if (!fs.existsSync(cachePath)) {
              fs.mkdirSync(cachePath, { recursive: true });
            }

            const fileName = `song_${Date.now()}.mp3`;
            const filePath = path.join(cachePath, fileName);
            
            const writer = fs.createWriteStream(filePath);
            audioResponse.data.pipe(writer);

            await new Promise((resolve, reject) => {
              writer.on('finish', resolve);
              writer.on('error', reject);
            });

            await api.sendMessage({
              body: msg + '🎧 30-second preview attached',
              attachment: fs.createReadStream(filePath)
            }, threadID, messageID);

            fs.unlinkSync(filePath);

          } catch (audioError) {
            console.error('Audio download error:', audioError);
            await api.sendMessage(msg + '❌ Could not download preview', threadID, messageID);
          }
        } else {
          await api.sendMessage(msg + '❌ No preview available for this song', threadID, messageID);
        }

        await api.sendMessage(
          `📝 Want lyrics for "${song.title}"?\nReply with: lyrics ${song.title} by ${song.artist}`,
          threadID
        );
      }
    } catch (error) {
      console.error('Handle reply error:', error);
      api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
  }
};