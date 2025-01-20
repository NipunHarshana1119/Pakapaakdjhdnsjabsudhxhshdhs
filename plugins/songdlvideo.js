const config = require('../config');
const { cmd } = require('../command');
const { ytsearch, ytmp3, ytmp4 } = require('@dark-yasiya/yt-dl.js'); 

// video2

cmd({
    pattern: "video",
    alias: ["video2", "ytvideo", "ytdl"],
    react: "🎥",
    desc: "Download YouTube video with selectable quality",
    category: "main",
    use: '.play4 <Yt url or Name>',
    filename: __filename
},
async (conn, mek, m, { from, prefix, quoted, q, reply, waitForReply }) => {
    try {
        if (!q) return await reply("Please provide a YouTube URL or Name");

        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");

        let yts = yt.results[0];

        let ytmsg = `╭━━━〔 *𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃* 〕━━━╮

* *ʋιԃҽσ ԃαɯɳʅσαԃιɳɠ 🎥*

╰──────────────────────╯
╭━┉┉┉┉┉┉┉┉┉┉┉┉━❐━⪼
┇๏ *𝑻𝒊𝒕𝒍𝒆* -  _${yts.title}_
┇๏ *𝑫𝒖𝒓𝒂𝒕𝒊𝒐𝒏* - _${yts.timestamp}_
┇๏ *𝑽𝒊𝒆𝒘𝒔* -  _${yts.views}_
┇๏ *𝑨𝒖𝒕𝒉𝒐𝒓* -  _${yts.author.name}_
┇๏ *𝑳𝒊𝒏𝒌* -  _${yts.url}_
╰━┉┉┉┉┉┉┉┉┉┉┉┉━❑━⪼

> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`;

        // Send video details
        await conn.sendMessage(from, { image: { url: yts.thumbnail || yts.image || '' }, caption: `${ytmsg}` }, { quoted: mek });

        let quality = "360p"; // Directly set quality to 360p
        const ytdl = await ytmp4(yts.url, quality);
        if (!ytdl.download.url) return reply("Failed to get the download link!");

        // Send video file
        await conn.sendMessage(from, {
            video: { url: ytdl.download.url },
            mimetype: "video/mp4",
            caption: `> *${yts.title}*\n> *Quality: ${quality}*\n\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(e.message || "An error occurred!");
    }
});

// play2

cmd({
    pattern: "song",
    alias: ["audio2","ytdl2","ytsong2"],
    react: "🎧",
    desc: "Download Youtube song",
    category: "main",
    use: '.song < Yt url or Name >',
    filename: __filename
},
async(conn, mek, m,{ from, prefix, quoted, q, reply }) => {
try{

if(!q) return await reply("Please give me Yt url or Name")
	
const yt = await ytsearch(q);
if(yt.results.length < 1) return reply("Results is not found !")

let yts = yt.results[0]  
const ytdl = await ytmp3(yts.url)
		
let ytmsg = `╭━━━〔 *𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃* 〕━━━╮

* ʂσɳɠ ԃαɯɳʅσαԃιɳɠ 🎧

╰──────────────────────╯
╭━┉┉┉┉┉┉┉┉┉┉┉┉━❐━⪼
┇๏ *𝑻𝒊𝒕𝒍𝒆* -  _${yts.title}_
┇๏ *𝑫𝒖𝒓𝒂𝒕𝒊𝒐𝒏* - _${yts.timestamp}_
┇๏ *𝑽𝒊𝒆𝒘𝒔* -  _${yts.views}_
┇๏ *𝑨𝒖𝒕𝒉𝒐𝒓* -  _${yts.author.name}_
┇๏ *𝑳𝒊𝒏𝒌* -  _${yts.url}_
╰━┉┉┉┉┉┉┉┉┉┉┉┉━❑━⪼

> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`
// SEND DETAILS
await conn.sendMessage(from, { image: { url: yts.thumbnail || yts.image || '' }, caption: `${ytmsg}`}, { quoted: mek });

// SEND AUDIO TYPE
await conn.sendMessage(from, { audio: { url: ytdl.download.url }, mimetype: "audio/mpeg" }, { quoted: mek })

// SEND DOC TYPE
await conn.sendMessage(from, { document: { url: ytdl.download.url }, mimetype: "audio/mpeg", fileName: ytdl.result.title + '.mp3', caption: `> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` }, { quoted: mek })


} catch (e) {
console.log(e)
reply(e)
}}
)
