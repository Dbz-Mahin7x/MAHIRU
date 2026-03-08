<p align="center">
  <img src="https://files.catbox.moe/eldlq4.jpg" alt="MAHIRU Banner" width="100%" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
</p>

<h1 align="center">
  🎀 𝐌𝐀𝐇𝐈𝐑𝐔 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐒𝐓𝐎𝐑𝐄 ✨
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-purple?style=for-the-badge&logo=github">
  <img src="https://img.shields.io/badge/Commands-3_Total-blue?style=for-the-badge&logo=javascript">
  <img src="https://img.shields.io/badge/Maintained-Yes-brightgreen?style=for-the-badge&logo=vercel">
  <img src="https://img.shields.io/badge/API-Ready-ff69b4?style=for-the-badge&logo=json">
</p>

<p align="center">
  <b>⚡ Central hub for managing and distributing custom JavaScript commands via raw GitHub links ⚡</b>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=F75C7E&center=true&vCenter=true&width=600&lines=%F0%9F%93%A6+Command+Storage+System;%F0%9F%9A%80+Fast+%26+Reliable;%F0%9F%93%8C+Raw+GitHub+Links" alt="Typing SVG">
</p>

---

## 🎀 𝐀𝐔𝐓𝐇𝐎𝐑 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="https://img.icons8.com/color/48/000000/user.png" width="40"><br>
        <b>Developer</b><br>
        <span style="font-size: 1.2em;">✨ 𝐌𝐀𝐇𝐈𝐍 ✨</span>
      </td>
      <td align="center">
        <img src="https://img.icons8.com/color/48/000000/github.png" width="40"><br>
        <b>GitHub</b><br>
        <a href="https://github.com/Dbz-Mahin7x">@Dbz-Mahin7x</a>
      </td>
      <td align="center">
        <img src="https://img.icons8.com/color/48/000000/facebook.png" width="40"><br>
        <b>Facebook</b><br>
        <a href="https://www.facebook.com/RentaroAijo.4x">@Rentaro Aijo</a>
      </td>
    </tr>
  </table>
</p>

---

## 🚀 𝐐𝐔𝐈𝐂𝐊 𝐋𝐈𝐍𝐊𝐒

<p align="center">
  <a href="https://github.com/Dbz-Mahin7x/MAHIRU/blob/main/Api.json">
    <img src="https://img.shields.io/badge/📡_API_Config-Api.json-8A2BE2?style=for-the-badge">
  </a>
  <a href="https://github.com/Dbz-Mahin7x/MAHIRU/blob/main/CMDS.json">
    <img src="https://img.shields.io/badge/📜_Command_List-CMDS.json-blue?style=for-the-badge">
  </a>
  <a href="https://github.com/Dbz-Mahin7x/MAHIRU/blob/main/CMDSRUL.json">
    <img src="https://img.shields.io/badge/📋_Registry_Info-CMDSRUL.json-green?style=for-the-badge">
  </a>
</p>

---

## 📁 𝐅𝐈𝐋𝐄 𝐒𝐓𝐑𝐔𝐂𝐓𝐔𝐑𝐄

```

📦 MAHIRU/
├── 📄 Api.json          # Main API configuration
├── 📄 CMDS.json         # Complete command list with URLs
├── 📄 CMDSRUL.json      # Registry info & version timestamps
├── 📄 README.md         # Documentation
├── 📄 cmdstore.js       # Command storage management
└── 📄 sing.js           # Music search & playback module

```

---

## 🛠️ 𝐂𝐔𝐑𝐑𝐄𝐍𝐓 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒

| Command | Author | Description | File |
|---------|--------|-------------|------|
| 🗃️ **cmdstore** | 𝐌𝐀𝐇𝐈𝐍 ✨ | Manages internal command storage and retrieval | `cmdstore.js` |
| 🎵 **sing** | 𝐌𝐀𝐇𝐈𝐍 🎵 | Dedicated module for music search and playback | `sing.js` |

---

## ⚙️ 𝐇𝐎𝐖 𝐓𝐎 𝐔𝐒𝐄

### 📥 Fetch Commands via Raw URLs

All commands are accessible through raw GitHub links. Get the URLs from `CMDS.json`.

### 🔧 Example: Loading a Command (Node.js)

```javascript
const axios = require('axios');

// Raw URL from CMDS.json
const commandUrl = "https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/sing.js";

async function loadCommand() {
    try {
        const response = await axios.get(commandUrl);
        const commandCode = response.data;
        
        // Execute or save the command logic here
        console.log('✅ Command loaded successfully!');
        
        // If you need to evaluate the command
        // eval(commandCode);
        
    } catch (error) {
        console.error('❌ Error loading command:', error.message);
    }
}

loadCommand();
```

📱 Alternative: Direct Fetch

```bash
# Using curl
curl -O https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/cmdstore.js

# Using wget
wget https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/sing.js
```

---

📡 𝐀𝐏𝐈 𝐂𝐎𝐍𝐅𝐈𝐆𝐔𝐑𝐀𝐓𝐈𝐎𝐍

The Api.json file contains the main API configuration. Structure example:

```json
{
  "name": "MAHIRU",
  "version": "2.0.0",
  "author": "MAHIN",
  "endpoints": {
    "commands": "https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/CMDS.json",
    "registry": "https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/CMDSRUL.json"
  }
}
```

---

📋 𝐂𝐌𝐃𝐒.𝐉𝐒𝐎𝐍 𝐅𝐎𝐑𝐌𝐀𝐓

```json
{
  "commands": [
    {
      "name": "cmdstore",
      "author": "MAHIN ✨",
      "description": "Manages internal command storage",
      "url": "https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/cmdstore.js"
    },
    {
      "name": "sing",
      "author": "MAHIN 🎵",
      "description": "Music search and playback module",
      "url": "https://raw.githubusercontent.com/Dbz-Mahin7x/MAHIRU/main/sing.js"
    }
  ]
}
```

---

🔄 𝐔𝐏𝐃𝐀𝐓𝐄 𝐓𝐈𝐌𝐄𝐒𝐓𝐀𝐌𝐏𝐒

Check CMDSRUL.json for the latest version information:

```json
{
  "last_updated": "2026-03-08",
  "version": "2.0.0",
  "commands_count": 2,
  "registry": {
    "cmdstore": "2026-03-08",
    "sing": "2026-03-08"
  }
}
```

⚡ Note: This repository is updated frequently. Always check CMDSRUL.json for the latest version timestamps.

---

🚀 𝐐𝐔𝐈𝐂𝐊 𝐃𝐄𝐏𝐋𝐎𝐘

Deploy to Vercel (Optional)

```json
// vercel.json
{
  "name": "mahiru-cmd-store",
  "version": 2,
  "builds": [
    {
      "src": "*.json",
      "use": "@vercel/static"
    },
    {
      "src": "*.js",
      "use": "@vercel/static"
    }
  ]
}
```

---

📊 𝐑𝐄𝐏𝐎 𝐒𝐓𝐀𝐓𝐒

<p align="center">
  <img src="https://img.shields.io/github/last-commit/Dbz-Mahin7x/MAHIRU?color=gold&style=for-the-badge">
  <img src="https://img.shields.io/github/repo-size/Dbz-Mahin7x/MAHIRU?color=red&style=for-the-badge">
  <img src="https://img.shields.io/github/stars/Dbz-Mahin7x/MAHIRU?color=yellow&style=for-the-badge">
  <img src="https://img.shields.io/github/forks/Dbz-Mahin7x/MAHIRU?color=blue&style=for-the-badge">
</p>

---

📞 𝐂𝐎𝐍𝐓𝐀𝐂𝐓

<p align="center">
  <a href="https://www.facebook.com/RentaroAijo.4x">
    <img src="https://img.icons8.com/color/48/000000/facebook.png" width="50">
  </a>
  <a href="mailto:Mahinstarou@gmail.com">
    <img src="https://img.icons8.com/color/48/000000/gmail.png" width="50">
  </a>
  <a href="https://github.com/Dbz-Mahin7x">
    <img src="https://img.icons8.com/color/48/000000/github.png" width="50">
  </a>
</p>

<p align="center">
  <b>📧 Email:</b> Mahinstarou@gmail.com
</p>

---

📝 𝐋𝐈𝐂𝐄𝐍𝐒𝐄

```
© 2026 MAHIRU Command Store
Developed with ®️ by Mahin Ahmed
All Rights Reserved

This project is licensed for personal and educational use.
Redistribution or commercial use requires permission.
```

---

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=2000&pause=500&color=F75C7E&center=true&vCenter=true&width=435&lines=%F0%9F%93%A6+Command+Store+Ready!;%F0%9F%9A%80+Load+Commands+Instantly;%F0%9F%8C%99+MAHIRU+System">
</p>

<p align="center">
  <b>Made with 💜 by MAHIN in Bangladesh 🇧🇩</b>
</p>

<p align="center">
  <img src="https://profile-counter.glitch.me/mahiru-cmdstore/count.svg" alt="Visitor Count">
</p>
