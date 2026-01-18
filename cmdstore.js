const axios = require("axios");

const CMDSRUL_URL =
  "https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/CMDSRUL.json";
const CMDS_URL =
  "https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/CMDS.json";

const ITEMS_PER_PAGE = 6;

module.exports = {
  config: {
    name: "cmdstore",
    aliases: ["cmds", "store"],
    version: "1.0.0",
    author: "𝐌𝐀𝐇𝐈𝐍 🎀",
    role: 0,
    countDown: 3,
    shortDescription: "🪄 Cute Command Store",
    longDescription: "✨ Browse & get bot commands with style",
    category: "utility",
    guide: {
      en: "{pn} [page | command name]"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const query = args.join(" ").toLowerCase();
      const { data } = await axios.get(CMDSRUL_URL);

      let cmds = data.cmdName;
      let page = 1;

      if (query) {
        if (!isNaN(query)) {
          page = parseInt(query);
        } else {
          cmds = cmds.filter(c =>
            c.cmd.toLowerCase().includes(query)
          );
        }
      }

      if (cmds.length === 0) {
        return api.sendMessage(
          "🐾✨ No commands found, cutie~",
          event.threadID,
          event.messageID
        );
      }

      const totalPages = Math.ceil(cmds.length / ITEMS_PER_PAGE);
      if (page < 1 || page > totalPages) page = 1;

      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const showCmds = cmds.slice(start, end);

      let msg =
`⋆˚✿˖°───── 𝐂𝐌𝐃 𝐒𝐓𝐎𝐑𝐄 ─────°˖✿˚⋆
🪄 𝐎𝐰𝐧𝐞𝐫 : 𝐌𝐀𝐇𝐈𝐍
🎀 𝐓𝐨𝐭𝐚𝐥 : ${cmds.length}
📦 𝐏𝐚𝐠𝐞 : ${page}/${totalPages}
⋆˚✿˖°────────────────────°˖✿˚⋆\n`;

      showCmds.forEach((c, i) => {
        msg +=
`🐾 ${start + i + 1}. 𝐂𝐦𝐝 : ${c.cmd}
   🎀 𝐀𝐮𝐭𝐡𝐨𝐫 : ${c.author}
   🗓️ 𝐔𝐩𝐝𝐚𝐭𝐞 : ${c.update}\n\n`;
      });

      msg +=
`✨ Reply with a number to get RAW link
🍬 Example: reply 1`;

      api.sendMessage(
        msg,
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "cmdstore",
            author: event.senderID,
            cmds,
            page
          });
        },
        event.messageID
      );

    } catch (e) {
      api.sendMessage(
        "💔 Failed to load command store",
        event.threadID,
        event.messageID
      );
    }
  },

  onReply: async function ({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    const index = parseInt(event.body);
    if (isNaN(index)) return;

    const cmd = Reply.cmds[index - 1];
    if (!cmd) return;

    try {
      const { data } = await axios.get(CMDS_URL);
      const url = data[cmd.cmd];

      if (!url) {
        return api.sendMessage(
          "❌ RAW link not found",
          event.threadID,
          event.messageID
        );
      }

      api.sendMessage(
`🪄✨ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 : ${cmd.cmd}
🔗 𝐑𝐀𝐖 :
${url}`,
        event.threadID,
        event.messageID
      );

    } catch {
      api.sendMessage(
        "💔 Failed to fetch command link",
        event.threadID,
        event.messageID
      );
    }
  }
};