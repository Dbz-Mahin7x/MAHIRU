const axios = require('axios');

module.exports = {
  name: 'lyrics',
  version: '1.0.0',
  hasPermssion: 0,
  credits: '𝐌𝐀𝐇𝐈𝐍 ✨',
  description: '📝 Get song lyrics from your API',
  commandCategory: '𝐌𝐔𝐒𝐈𝐂',
  usages: '[title] by [artist]',
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
        '📝 Please provide a song name!\n\nExamples:\n/lyrics shape of you by ed sheeran\n/lyrics bohemian rhapsody - queen',
        threadID,
        messageID
      );
    }

    let title, artist;
    const input = args.join(' ');
    
    if (input.includes(' by ')) {
      [title, artist] = input.split(' by ');
    } else if (input.includes(' - ')) {
      [artist, title] = input.split(' - ');
    } else {
      title = input;
      artist = '';
    }

    title = title.trim();
    artist = artist.trim();

    const apiUrl = await this.getApiUrl();
    
    if (!apiUrl) {
      return api.sendMessage('❌ API configuration error! Check your Api.json', threadID, messageID);
    }

    const searchingMsg = await api.sendMessage(
      `📝 Searching lyrics for:\n"${title}" ${artist ? 'by ' + artist : ''}...`,
      threadID
    );

    try {
      const { data } = await axios.get(`${apiUrl}/api/lyrics`, {
        params: { title, artist },
        timeout: 10000
      });

      if (data.success && data.lyrics) {
        let lyrics = data.lyrics;
        
        if (lyrics.length > 4000) {
          lyrics = lyrics.substring(0, 4000) + '...\n\n_Lyrics truncated (too long