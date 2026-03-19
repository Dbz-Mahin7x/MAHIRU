const axios = require('axios');

async function getApiUrl() {
  if (global.songFinderApiUrl) return global.songFinderApiUrl;
  try {
    const { data } = await axios.get('https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/Api.json');
    const base = data["song-finder"];
    global.songFinderApiUrl = base.endsWith('/') ? base.slice(0, -1) : base;
    return global.songFinderApiUrl;
  } catch (error) {
    return null;
  }
}

module.exports = {
  config: {
    name: 'lyrics',
    aliases: ['ly', 'songtext'],
    version: '1.0.2',
    author: 'AI Assistant',
    countDown: 3,
    role: 0,
    description: 'Get lyrics for any song',
    category: 'utility',
    guide: '{pn} [song title]'
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    if (!args || args.length === 0) return api.sendMessage("Kindly provide a song name! 🎶", threadID, messageID);

    const input = args.join(' ');
    let title = input, artist = '';
    if (input.includes(' by ')) [title, artist] = input.split(' by ');

    try {
      const BASE_URL = await getApiUrl();
      if (!BASE_URL) return api.sendMessage("⚠️ API server link could not be found.", threadID, messageID);

      const { data } = await axios.get(`${BASE_URL}/api/lyrics`, { 
        params: { title: title.trim(), artist: artist.trim() } 
      });

      if (data.success && data.lyrics) {
        const msg = `ʟʏʀɪᴄs ꜰɪɴᴅᴇʀ 📝\n\nᴛɪᴛʟᴇ: ${data.title}\nᴀʀᴛɪsᴛ: ${data.artist}\n\n${data.lyrics.substring(0, 3500)}`;
        return api.sendMessage(msg, threadID, messageID);
      } else {
        return api.sendMessage("❌ Lyrics not found for this track.", threadID, messageID);
      }
    } catch (e) {
      return api.sendMessage("⚠️ Error connecting to the lyrics server.", threadID, messageID);
    }
  }
};