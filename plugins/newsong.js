const {
  cmd,
  commands
} = require("../command");
const yts = require("yt-search");
const axios = require("axios");
const {
  fetchJson,
  getBuffer
} = require("../lib/functions");

const commandDetails = {
  pattern: "song",
  desc: "Download Song",
  react: "🎵",
  use: ".song <YouTube URL>",
  category: "download",
  filename: __filename,
};

cmd(commandDetails, async (bot, message, args, { from, q, reply, sender }) => {
  try {
    if (!q) {
      return reply("❌ Please provide a title. ❌");
    }

    const searchResults = await yts(q);
    const video = searchResults.videos[0];
    const videoUrl = video.url;
    const videoTitle = video.title.length > 20 ? video.title.substring(0, 20) + "..." : video.title;

    const downloadMessage = `*● 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 ●*
     
* *QUEEN RASHU MD SONG DAWNLODER🎧*

*╭╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼ ✵*
*│* *Song Name :* _${videoTitle}_
*│* *Duration :* _${yts.timestamp}_
*│* *Views :* _${yts.views}_
*│* *Author :* _${yts.author.name}_
*|* *Link :* _${yts.url}_
*╰╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼ ✵*

* *Reply Required Format 👇*

*✵ ╼╼╼╼╼( ʀᴀꜱʜᴜ )╼╼╼╼╼ ✵*

*1 |: AUDIO  MP3 TYPE 🎶*
*2 |: AUDIO  DOC TYPE 📂*
*3 |: AUDIO VOICE MODE 🎤*

> *𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ❀*`;

    const axiosOptions = { responseType: "arraybuffer" };
    const thumbnailImage = Buffer.from(
      (await axios.get("https://files.catbox.moe/p5ghv5.jpeg", axiosOptions)).data,
      "binary"
    );

    const messageContext = {
      image: { url: video.thumbnail || "https://files.catbox.moe/p5ghv5.jpeg" },
      caption: downloadMessage,
      contextInfo: {
        mentionedJid: [sender],
        externalAdReply: {
          showAdAttribution: true,
          containsAutoReply: true,
          title: "QUEEN SPRIKY MD",
          body: "© 𝗤𝗨𝗘𝗘𝗡 𝗦𝗣𝗥𝗜𝗞𝗬 𝗠𝗗 ᵀᴹ",
          previewType: "PHOTO",
          thumbnail: thumbnailImage,
          sourceUrl: "https://whatsapp.com/channel/0029VajvrA2ATRSkEnZwMQ0p",
          mediaType: 1,
        },
      },
    };

    const fetchAudio = await fetchJson(`https://dark-shan-yt.koyeb.app/download/ytmp3?url=${videoUrl}`);
    const downloadLink = fetchAudio.data.download;

    const initialMessage = await bot.sendMessage(from, messageContext, { quoted: message });

    bot.ev.on("messages.upsert", async (newMessageEvent) => {
      const newMessage = newMessageEvent.messages[0];

      if (!newMessage.message || !newMessage.message.extendedTextMessage) {
        return;
      }

      const userResponse = newMessage.message.extendedTextMessage.text.trim();
      const contextInfo = newMessage.message.extendedTextMessage.contextInfo;

      if (contextInfo && contextInfo.stanzaId === initialMessage.key.id) {
        try {
          switch (userResponse) {
            case "1":
              await bot.sendMessage(
                from,
                {
                  audio: { url: downloadLink },
                  mimetype: "audio/mpeg",
                  fileName: `${video.title}.mp3`,
                  caption: "*© 𝚀𝚄𝙴𝙴𝙽 𝚂𝙿𝚁𝙸𝙺𝚈 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝙾𝚃*",
                },
                { quoted: newMessage }
              );
              break;

            case "2":
              await bot.sendMessage(
                from,
                {
                  document: { url: downloadLink },
                  mimetype: "audio/mpeg",
                  fileName: `${video.title}.mp3`,
                  caption: "*© 𝚀𝚄𝙴𝙴𝙽 𝚂𝙿𝚁𝙸𝙺𝚈 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝙾𝚃*",
                },
                { quoted: newMessage }
              );
              break;

            case "3":
              await bot.sendMessage(
                from,
                {
                  audio: { url: downloadLink },
                  mimetype: "audio/mpeg",
                  ptt: true,
                },
                { quoted: newMessage }
              );
              break;

            default:
              reply("❌ Invalid option. Please select a valid option (1, 2, or 3) 🔴");
          }
        } catch (error) {
          console.error(error);
          reply(`❌ Error: ${error.message} ❌`);
        }
      }
    });
  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message} ❌`);
  }
});
