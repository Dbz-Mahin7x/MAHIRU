const axios = require('axios');

const COUNTRIES = {
  us: '🇺🇸 USA',
  gb: '🇬🇧 UK',
  bd: '🇧🇩 Bangladesh',
  jp: '🇯🇵 Japan',
  in: '🇮🇳 India',
  ca: '🇨🇦 Canada',
  au: '🇦🇺 Australia',
  de: '🇩🇪 Germany',
  fr: '🇫🇷 France',
  kr: '🇰🇷 South Korea'
};

module.exports = {
  name: 'trending',
  version: '1.0.0',
  hasPermssion: 0,
  credits: '𝓡𝓮𝓷𝓽𝓪𝓻𝓸 𝐴𝓲𝓳𝓸 🌸🫧',
  description: '🔥 Get trending songs by country from your API',
  commandCategory: '𝐌𝐔𝐒𝐈𝐂',
  usages: '[country code] (default: us)',
  cooldowns: 10,

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
    
    let country = 'us';
    if (args && args.length > 0) {
      country = args[0].toLowerCase();
    }

    const apiUrl = await this.getApiUrl();
    
    if (!apiUrl) {
      return api.sendMessage('❌ API configuration error! Check your Api.json', threadID, messageID);
    }

    const searchingMsg = await api.sendMessage(
      `🔍 Fetching trending songs for ${COUNTRIES[country] || country.toUpperCase()}...`,
      threadID
    );

    try {
      const { data } = await axios.get(`${apiUrl}/api/trending`, {
        params: { country, limit: 10 },
        timeout: 10000
      });

      if (!data.success || !data.trending || data.trending.length === 0) {
        return api.sendMessage(
          `❌ No trending data for ${COUNTRIES[country] || country.toUpperCase()}`,
          threadID,
          searchingMsg.messageID
        );
      }

      const countryName = COUNTRIES[country] || country.toUpperCase();
      
      let msg = `🔥 𝐓𝐑𝐄𝐍𝐃𝐈𝐍𝐆 𝐒𝐎𝐍𝐆𝐒\n`;
      msg += `━━━━━━━━━━━━━━━━━━\n`;
      msg += `📍 Country: ${countryName}\n`;
      msg += `📊 Top ${data.trending.length} Songs\n`;
      msg += `━━━━━━━━━━━━━━━━━━\n\n`;

      data.trending.forEach((song, index) => {
        msg += `${index + 1}. ${song.title}\n`;
        msg += `   👤 ${song.artist}\n`;
        if (index < data.trending.length - 1) msg += `\n`;
      });

      msg += `\n━━━━━━━━━━━━━━━━━━\n`;
      msg += `🎵 Use /song [name] to search\n`;
      msg += `🌍 Try: /trending bd, /trending jp, /trending gb`;

      await api.sendMessage(msg, threadID, searchingMsg.messageID);

    } catch (error) {
      console.error('Trending error:', error);
      await api.sendMessage(
        `❌ Error fetching trending songs\n\n${error.message}`,
        threadID,
        searchingMsg.messageID
      );
    }
  }
};