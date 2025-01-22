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

    const downloadMessage = `*╭╼╼╼╼╼╼╼╼ ● 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 ● ╼╼╼╼╼╼╼╼╮*
     
* *QUEEN RASHU MD SONG DAWNLODER🎧*

*╭╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼ ✵*
*│* Song Name : ${videoTitle}
*╰╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼ ✵*

* *Reply Required Format 👇*

*✵ ╼╼╼╼╼( ʀᴀꜱʜᴜ )╼╼╼╼╼ ✵*

*1 |: AUDIO  MP3 TYPE 🎶*
*2 |: AUDIO  DOC TYPE 📂*
*3 |: AUDIO VOICE MODE 🎤*

> *𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ❀*`;

    const axiosOptions = { responseType: "arraybuffer" };
    const thumbnailImage = Buffer.from(
      (await axios.get("https://i.ibb.co/g98HkMY/8188.jpg", axiosOptions)).data,
      "binary"
    );

    const messageContext = {
      image: { url: video.thumbnail || "https://i.ibb.co/g98HkMY/8188.jpg" },
      caption: downloadMessage,
      contextInfo: {
        mentionedJid: [sender],
        externalAdReply: {
          showAdAttribution: true,
          containsAutoReply: true,
          title: "QUEEN RASHU MD",
          body: "© 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 𝐕1",
          previewType: "PHOTO",
          thumbnail: thumbnailImage,
          sourceUrl: "https://whatsapp.com/channel/0029Vb2GOyk6rsQwJSBa7T2h",
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
                  caption: "> *𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ❀*",
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
                  caption: "> *𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ❀*",
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
