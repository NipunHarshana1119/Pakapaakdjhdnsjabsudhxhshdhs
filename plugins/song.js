const {
    default: makeWASocket,
    getAggregateVotesInPollMessage, 
    useMultiFileAuthState,
    DisconnectReason,
    getDevice,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
    getContentType,
    Browsers,
    delay,
    makeInMemoryStore,
    makeCacheableSignalKeyStore,
    downloadContentFromMessage,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    proto
} = require('@whiskeysockets/baileys')
const fs = require('fs')
const FileType = require('file-type')
const { exec } = require('child_process');
const { cmd, commands } = require("../command");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require("../lib/functions");
const { Buffer } = require("buffer");
const axios = require("axios");
const config = require('../config')
const fetch = require("node-fetch");
const crypto = require('crypto');
const Esana = require("@sl-code-lords/esana-news");
const Hiru = require('hirunews-scrap');
const yts = require("yt-search");
const { updateEnv, readEnv } = require('../lib/database');
const os = require("os")
const EnvVar = require('../lib/mongodbenv');
var api = new Esana();
const DYXT_NEWS = require("@dark-yasiya/news-scrap");
const newss = new DYXT_NEWS();

let activeGroups = {};
let lastNewsTitles = {};

async function getLatestNews() {
    let newsData = [];
    
    // Hiru News
    try {
        const hiruApi = new Hiru();
        const hiruNews = await hiruApi.BreakingNews();
        newsData.push({
            title: hiruNews.results.title,
            content: hiruNews.results.news,
            date: hiruNews.results.date
        });
    } catch (err) {
        console.error(`Error fetching Hiru News: ${err.message}`);
    }

    // Esana News
    try {
        const esanaApi = new Esana();
        const esanaNews = await esanaApi.getLatestNews(); 
        if (esanaNews && esanaNews.title && esanaNews.description && esanaNews.publishedAt) {
            newsData.push({
                title: esanaNews.title,
                content: esanaNews.description,
                date: esanaNews.publishedAt
            });
        } else {
            console.error("Error: Esana News returned invalid data.");
        }
    } catch (err) {
        console.error(`Error fetching Esana News: ${err.message}`);
    }

    return newsData;
}

// Function to check for and post new news to the group
async function checkAndPostNews(conn, groupId) {
    const latestNews = await getLatestNews();
    latestNews.forEach(async (newsItem) => {
        if (!lastNewsTitles[groupId]) {
            lastNewsTitles[groupId] = [];
        }

        if (!lastNewsTitles[groupId].includes(newsItem.title)) {
           await conn.sendMessage(groupId, { 
                text: `*📍𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 𝐀𝐔𝐓𝐎 𝐍𝐄𝐖𝐒📑*\n\n*╭─────╎◈𝐍𝐄𝐖𝐒 𝐀𝐋𝐄𝐑𝐓◈╎────╮*\n\n* 🎀⭕ *${newsItem.title} 📰*\n_${newsItem.content}_\n\n~${newsItem.date}~\n\n🌟 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 🗞️\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` 
            });
            lastNewsTitles[groupId].push(newsItem.title);

            if (lastNewsTitles[groupId].length > 100) {
                lastNewsTitles[groupId].shift();
            }
        }
    });
}

cmd({
  'pattern': "leave1",
  'alias': ['left', 'l'],
  'react': '🔐',
  'desc': "Remove all members with a specific country code from the group",
  'category': 'owner',
  'filename': __filename
}, async (_0x403693, _0x1fe1a1, _0xe5d90b, {
  from: _0x1ac45c,
  quoted: _0x1d832e,
  body: _0x2e22cd,
  isCmd: _0x3e35c1,
  command: _0x2ba3e8,
  args: _0x400b8c,
  q: _0x473315,
  isGroup: _0x51c21a,
  senderNumber: _0x5bd5ac,
  reply: _0x284a7b
}) => {
  try {
    if (!_0x51c21a) {
      return _0x284a7b("*🚫 This command can only be used in groups.*");
    }
    const _0x3f975e = _0x403693.user.id.split(':')[0x0];
    if (_0x5bd5ac !== _0x3f975e) {
      return _0x284a7b("> *🚫 Only the bot owner can use this command.*");
    }
    const _0x32c8ad = _0x400b8c[0x0];
    if (!_0x32c8ad) {
      return _0x284a7b("Please specify the country code (e.g., +255 or +254).");
    }
    const _0x239d3d = await _0x403693.groupMetadata(_0x1ac45c);
    const _0x1bb4c9 = _0x239d3d.participants;
    const _0x1f9bc8 = _0x1bb4c9.filter(_0x22331a => _0x22331a.number && _0x22331a.number.startsWith(_0x32c8ad));
    if (_0x1f9bc8.length === 0x0) {
      return _0x284a7b("No members found with country code " + _0x32c8ad + '.');
    }
    for (let _0x298c47 of _0x1f9bc8) {
      await _0x403693.groupRemove(_0x1ac45c, [_0x298c47.jid]);
    }
    _0x284a7b("Removed all members with country code " + _0x32c8ad + " from the group.");
  } catch (_0x1f5ab4) {
    console.error(_0x1f5ab4);
    _0x284a7b("❌ Error: " + _0x1f5ab4);
  }
});


cmd({
    pattern: "gpass",
    desc: "Generate a strong password.",
    category: "other",
    react: "🔐",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const length = args[0] ? parseInt(args[0]) : 12; // Default length is 12 if not provided
        if (isNaN(length) || length < 8) {
            return reply('Please provide a valid length for the password (Minimum 08 Characters💦).');
        }

        const generatePassword = (len) => {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
            let password = '';
            for (let i = 0; i < len; i++) {
                const randomIndex = crypto.randomInt(0, charset.length);
                password += charset[randomIndex];
            }
            return password;
        };

        const password = generatePassword(length);
        const message = `🔐 *Your Strong Password* 🔐\n\nPlease find your generated password below:\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`;

        // Send initial notification message
        await conn.sendMessage(from, { text: message }, { quoted: mek });

        // Send the password in a separate message
        await conn.sendMessage(from, { text: password }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ Error generating password🤕: ${e.message}`);
    }
});

cmd({
  'pattern': "gend",
  'alias': ['gkick', 'endg'],
  'react': '🔐',
  'desc': "Remove all members with a specific country code from the group",
  'category': 'owner',
  'filename': __filename
}, async (_0x403693, _0x1fe1a1, _0xe5d90b, {
  from: _0x1ac45c,
  quoted: _0x1d832e,
  body: _0x2e22cd,
  isCmd: _0x3e35c1,
  command: _0x2ba3e8,
  args: _0x400b8c,
  q: _0x473315,
  isGroup: _0x51c21a,
  senderNumber: _0x5bd5ac,
  reply: _0x284a7b
}) => {
  try {
    if (!_0x51c21a) {
      return _0x284a7b("*🚫 This command can only be used in groups.*");
    }
    const _0x3f975e = _0x403693.user.id.split(':')[0x0];
    if (_0x5bd5ac !== _0x3f975e) {
      return _0x284a7b("> *🚫 Only the bot owner can use this command.*");
    }
    const _0x32c8ad = _0x400b8c[0x0];
    if (!_0x32c8ad) {
      return _0x284a7b("Please specify the country code (e.g., +94 or +94 ).");
    }
    const _0x239d3d = await _0x403693.groupMetadata(_0x1ac45c);
    const _0x1bb4c9 = _0x239d3d.participants;
    const _0x1f9bc8 = _0x1bb4c9.filter(_0x22331a => _0x22331a.number && _0x22331a.number.startsWith(_0x32c8ad));
    if (_0x1f9bc8.length === 0x0) {
      return _0x284a7b("No members found with country code " + _0x32c8ad + '.');
    }
    for (let _0x298c47 of _0x1f9bc8) {
      await _0x403693.groupRemove(_0x1ac45c, [_0x298c47.jid]);
    }
    _0x284a7b("Removed all members with country code " + _0x32c8ad + " from the group.");
  } catch (_0x1f5ab4) {
    console.error(_0x1f5ab4);
    _0x284a7b("❌ Error: " + _0x1f5ab4);
  }
});


cmd({
    pattern: "opentime",
    react: "🔖",
    desc: "To open group to a time",
    category: "group",
    use: '.opentime',
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{   
if (!isGroup) return reply(ONLGROUP)
if (!isAdmins) return reply(ADMIN)	
  if (args[1] == 'second') {
                    var timer = args[0] * `1000`
                } else if (args[1] == 'minute') {
                    var timer = args[0] * `60000`
                } else if (args[1] == 'hour') {
                    var timer = args[0] * `3600000`
                } else if (args[1] == 'day') {
                    var timer = args[0] * `86400000`
                } else {
                    return reply('*select:*\nsecond\nminute\nhour\n\n*example*\n10 second')
                }
                reply(`Open time ${q} starting from now`)
                setTimeout(() => {
                    var nomor = mek.participant
                    const open = `*OPEN TIME* THE GROUP WAS OPENED BY 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 TO APPROVED ADMIN\n NOW MEMBERS CAN SEND MESSAGES 🔓`
                    conn.groupSettingUpdate(from, 'not_announcement')
                    reply(open)
                }, timer)
await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }}) 
} catch (e) {
reply('*Error !!*')
l(e)
}
})

cmd(
  {
    pattern: 'img',
    alias: ['image', 'pinterest', 'pinimg'],
    react: '\uD83D\uDDBC️',
    desc: 'Search and download images from Pinterest using keywords.',
    category: 'image',
    use: '.img <keywords>',
    filename: __filename,
  },
  async (
    _0x1a9409,
    _0x59fdb9,
    _0x3f150e,
    { from: _0x163393, args: _0x12b1f7, reply: _0x2ac5cb }
  ) => {
    try {
      const _0x3207b0 = _0x12b1f7.join(' ')
      if (!_0x3207b0) {
        return _0x2ac5cb('*Please provide search keywords for the image.*')
      }
      _0x2ac5cb(
        '*\uD83D\uDD0D 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃-𝐈𝐌𝐀𝐆𝐄\uD83C\uDF38 - ' +
          _0x3207b0 +
          '...*'
      )
      const _0x2f5556 =
          'https://apitest1-f7dcf17bd59b.herokuapp.com/download/piniimg?text=' +
          encodeURIComponent(_0x3207b0),
        _0x530cac = await axios.get(_0x2f5556)
      if (
        !_0x530cac.data ||
        !_0x530cac.data.result ||
        _0x530cac.data.result.length === 0
      ) {
        return _0x2ac5cb('\u274C No images found for "' + _0x3207b0 + '".')
      }
      const _0x82a454 = _0x530cac.data.result
      for (
        let _0xecb4cf = 0;
        _0xecb4cf < Math.min(_0x82a454.length, 5);
        _0xecb4cf++
      ) {
        const _0x58b5b7 = _0x82a454[_0xecb4cf]
        _0x58b5b7.images_url &&
          (await _0x1a9409.sendMessage(
            _0x163393,
            {
              image: { url: _0x58b5b7.images_url },
              caption:
                '*\uD83E\uDD0D𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃-𝐈𝐌𝐀𝐆𝐄\uD83D\uDD10 - ' +
                _0x3207b0 +
                '*',
            },
            { quoted: _0x59fdb9 }
          ))
      }
      _0x82a454.every((_0x45deb7) => !_0x45deb7.images_url) &&
        _0x2ac5cb('\u274C No valid image URLs found in the results.')
    } catch (_0x422b47) {
      console.error(_0x422b47)
      _0x2ac5cb('\u274C An error occurred while processing your request.')
    }
  }
)


cmd({
  pattern: "alive2",
  desc: "bbh.",
  category: "loading alive",
  react: '馃憢',
  filename: __filename
}, async (client, message, args, { from, reply }) => {
  try {
    const sentMessage = await client.sendMessage(from, { text: '> *饾悙饾悢饾悇饾悇饾悕 饾悜饾悁饾悞饾悋饾悢 饾悓饾悆 饾悁饾悑饾悎饾悤饾悇*' });
    const heartSequence = ['Loading . . . ', 'Nipun Harshana', '鈻扳柊鈻扳柋鈻扁柋鈻扁柋鈻扁柋鈻扁柋 10%', '鈻扳柊鈻扳柊鈻扁柋鈻扁柋鈻扁柋鈻扁柋 20%', '鈻扳柊鈻扳柊鈻扳柋鈻扁柋鈻扁柋鈻扁柋 30%', '鈻扳柊鈻扳柊鈻扳柊鈻扁柋鈻扁柋鈻扁柋 40%', '鈻扳柊鈻扳柊鈻扳柊鈻扳柋鈻扁柋鈻扁柋 50%', '鈻扳柊鈻扳柊鈻扳柊鈻扳柊鈻扁柋鈻扁柋聽60%', '鈻扳柊鈻扳柊鈻扳柊鈻扳柊鈻扳柋鈻扁柋 70%', '鈻扳柊鈻扳柊鈻扳柊鈻扳柊鈻扳柊鈻扁柋 80%', '鈻扳柊鈻扳柊鈻扳柊鈻扳柊鈻扳柊鈻扳柋 90%', '鈻扳柊鈻扳柊鈻扳柊鈻扳柊鈻扳柊鈻扳柊 100%', 'COMPLETE LOADING 鈽橈笍馃憢','ALIVE NOW', '馃憢 饾懐饾挌饾拞  饾懓 饾懆饾拵 饾懚饾拸饾拲饾拪饾拸饾拞 饾懙饾拹饾挊\n\n*鈾★笌鈥⑩攣鈹� 鉂� 饾悙饾悢饾悇饾悇饾悕 饾悜饾悁饾悞饾悋饾悢 饾悓饾悆 鉂� 鈹佲攣鈥⑩櫋锔�*\n\n> 蕗岽溕瘁礇瑟岽嶀磭 : ${runtime(process.uptime())}\n> 蕗岽€岽� 岽滉湵岽€散岽� : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\n> 蕼岽応湵岽� 纱岽€岽嶀磭 : ${os.hostname()}\n> 岽忈础纱岽囀€ : 饾悙饾悢饾悇饾悇饾悕 饾悜饾悁饾悞饾悋饾悢 饾悓饾悆\n\n> *漏 饾櫩饾櫨饾殕饾櫞饾櫚饾殎饾櫝 饾櫛饾殘 饾殌饾殑饾櫞饾櫞饾櫧 饾殎饾櫚饾殏饾櫡饾殑 饾櫦饾櫝 鉁�*'];

    for (const heart of heartSequence) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await client.relayMessage(from, {
        protocolMessage: {
          key: sentMessage.key,
          type: 14,
          editedMessage: {
            conversation: heart
          }
        }
      }, {});
    }
  } catch (error) {
    console.log(error);
    reply("鉂� *Error!* " + error.message);
  }
});


cmd({
  pattern: "menu",
  alias: ["මෙනු", "මෙනූ", 'කමාන්ඩ්'],
  desc: "Commands panel",
  react: '📚',
  filename: __filename
}, async (bot, message, args, options) => {
  const { from, quoted, reply, pushname } = options;

  try {

    const menuText = `*👋 Hello ${pushname}*
    
     *꧁ྀི*𝐐𝐔𝚵𝚵𝐍 𝐑𝚫𝐒𝐇𝐔 𝐌𝐃*ྀི꧂*
*❖╭─────────────···▸*
> *ʀᴜɴᴛɪᴍᴇ* : ${runtime(process.uptime())}
> *ʀᴀᴍ ᴜsᴇ* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
> *ɴᴀᴍᴇ ʙᴏᴛ* : *𝐐𝐔𝚵𝚵𝐍 𝐑𝚫𝐒𝐇𝐔 𝐌𝐃*
> *ᴏᴡɴᴇʀ ᴄᴏɴᴛᴀᴄᴛ* : *wa.me/94727319036*
> *ᴄʀᴇᴀᴛᴏʀ* : *CYBER RUSH MODZ ( Nipun Harshana )*
> *ᴠᴇʀsɪᴏɴs* : *ᴠ.0.1*
*❖╰────────────···▸▸*
*♡︎•━━━━━━☻︎━━━━━━•♡︎*
*╭╼╼╼╼╼╼╼╼╼╼*
*├➤ 1  • ᴏᴡɴᴇʀ ᴍᴇɴᴜ*
*├➤ 2  • ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ*
*├➤ 3  • ᴍᴏᴠɪᴇ ᴍᴇɴᴜ*
*├➤ 4  • ꜱᴇᴀʀᴄʜ ᴍᴇɴᴜ*
*├➤ 5  • ᴅᴀᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ*
*├➤ 6  • ᴍᴀɪɴ ᴍᴇɴᴜ*
*├➤ 7  • ɢʀᴏᴜᴘ ᴍᴇɴᴜ*
*├➤ 8  • ꜰᴜɴ ᴍᴇɴᴜ*
*├➤ 9  • ᴀɪ ᴍᴇɴᴜ*
*├➤ 10 • ᴏᴛʜᴇʀ ᴍᴇɴᴜ*
*╰╼╼╼╼╼╼╼╼╼╼*
* ▣▣▣▣▣▣▣▣▣▣▣▣*⁠⁠⁠⁠

*ׂ╰┈➤ 🔢Reply with the Number you want to select*

> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`;

    // Send Menu Message
 const sentMenuMessage = await bot.sendMessage(
  from,
  {
    image: { url: "https://i.ibb.co/BsjkCDP/9555.jpg" },
    caption: menuText,
    contextInfo: {
      mentionedJid: [],
      isForwarded: true,
      forwardingScore: 1,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363368882758119@newsletter",
        newsletterName: "ꪶ𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃ꫂ",
        serverMessageId: 999,
      },
    },
  },
  { quoted: message }
);

    const menuMessageId = sentMenuMessage.key.id;

    // Define responses for each option
    const menuResponses = {
      '1': { imageCaption: `*꧁◈╾───☉ ᴏᴡɴᴇʀ ᴍᴇɴᴜ ☉───╼◈꧂*

╭────────●●►
│ ➽ *setting*
> ʙᴏᴛ ꜱᴇᴛᴛɪɴɢ  ᴄʜᴀɴɢᴇ
│ ➽ *block*
> ᴜꜱᴇʀ ʙʟᴏᴄᴋ
│ ➽ *unblock*
> ʙʟᴏᴄᴋ ᴜꜱᴇʀ  ᴜɴʙʟᴏᴄᴋ
│ ➽ *shutdown*
> ʙᴏᴛ ꜱᴛᴏᴘ
│ ➽ *broadcast*
> ᴀʟʟ ɢʀᴏᴜᴘ ꜱᴇɴᴅ ᴍꜱɢ
│ ➽ *setpp*
> ᴘʀᴏꜰɪʟᴇ ᴘɪᴄ ᴄʜᴀɴɢᴇ
│ ➽ *clearchats*
> ᴀʟʟ ᴄʜᴀᴛ ᴄʟᴇᴀʀ 
│ ➽ *jid*
> ᴄʜᴀᴛ ᴊɪᴅ 
│ ➽ *gjid*
> ɢʀᴏᴜᴘ ᴊɪᴅ
│ ➽ *update*
> ʙᴏᴛ ᴜᴘᴅᴀᴛᴇ
│ ➽ *updatecmd*
> ᴜᴘᴅᴀᴛᴇ ʙᴏᴛ ᴄᴏᴍᴍᴀɴᴅ
│ ➽ *boom*
> ꜱᴇɴᴅ ᴜɴʟɪᴍɪᴛᴇᴅ ᴄᴏꜱᴛᴜᴍᴇꜱ ᴍᴇꜱꜱᴀɢᴇ
╰────────────────────●●►


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` },

      '2': { imageCaption: 
`*꧁◈╾───☉ ᴄᴏɴᴠᴇʀᴛ ᴍᴇɴᴜ ☉───╼◈꧂*

╭────────●●►
│ ➽ *sticker*
> ᴘʜᴏᴛᴏ ᴄᴏɴᴠᴇʀᴛ ꜱᴛɪᴄᴋᴇʀ
│ ➽ *trt*
> ᴛʀᴀɴꜱʟᴀᴛᴇ ᴛᴇxᴛ ʙᴇᴛᴡᴇᴇɴ  ʟᴀɴɢᴜᴀɢᴇꜱ
│ ➽ *tts*
> ᴅᴀᴡɴʟᴏᴀᴅ ᴛʏᴘᴇ ᴛᴇxᴛ ᴛᴏ ᴠᴏɪᴄᴇ
│ ➽ *vv*
> ᴠɪᴇᴡᴏɴᴄᴇ ᴍᴇꜱꜱᴀɢᴇ ᴀɢɪɴ ᴠɪᴇᴡ
│ ➽ *fancy*
> ᴄᴏɴᴠᴇʀᴛ ᴛᴏ ᴛᴇxᴛ ɪɴᴛᴏ ᴠᴀʀɪᴏᴜꜱ ꜰᴏɴᴛ
│ ➽ *pickupline*
> ɢᴇᴛ ᴀ ʀᴀɴᴅᴏᴍ ᴘɪᴄᴜᴘ ʟɪɴᴇ ᴛʜᴇ ᴀᴘɪ
│ ➽ *img2url*
> ɪᴍᴀɢᴇ ᴜʀʟ ᴄʀᴇᴀᴛᴇᴅ
│ ➽ *rbg*
> ʀᴇᴍᴏᴠᴇ ᴘʜᴏᴛᴏ ʙᴀᴄᴋʀᴏᴜɴᴅ
│ ➽ *tinyurl*
> ᴜʀʟ ᴛᴏ ɢᴇᴛ ꜱʜᴏʀᴛᴛ ʟɪɴᴋ
│ ➽ *qr*
> ɢᴀɴᴀʀᴀᴛᴇ ᴀ Qʀ ᴄᴏᴅᴇ
│ ➽ *gpass*
> ɢᴀɴᴀʀᴀᴛᴇ ꜱᴛʀᴏɴɢ ᴘᴀꜱꜱᴡᴇᴀʀᴅ
╰────────────────────●●►


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` },

      '3': { imageCaption: 
`*꧁◈╾───☉ ᴍᴏᴠɪᴇ ᴍᴇɴᴜ ☉───╼◈꧂*

╭────────●●►
│ ➽ *sinhalasub*
> ꜱɪɴʜᴀʟᴀ ꜱᴜʙ ᴛɪᴛʟᴇ ᴍᴏᴠɪᴇ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *cartoon*
> ᴄᴀʀᴛᴏᴏɴ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *baiscope*
> ʙɪꜱᴄᴏᴘᴇ ᴍᴏᴠɪᴇ ᴅᴀᴡɴʟᴏᴀᴅ
╰────────────────────●●►


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` },

      '4': { imageCaption: 
`*꧁◈╾───☉ ꜱᴇᴀʀᴄʜ ᴍᴇɴᴜ ☉───╼◈꧂*

╭────────●●►
│ ➽ *yts*
> ꜱᴇᴀʀᴄʜ ꜰᴏʀ ʏᴏᴜᴛᴜʙᴇ ᴠɪᴅᴇᴏꜱ ᴜꜱɪɴɢ ᴀ Qᴜᴇʀʏ
│ ➽ *save*
> ꜱᴀᴠᴇ ᴀɴᴅ ꜱᴇɴᴅ ʙᴀᴄᴋ ᴀ ᴍᴇᴅɪᴀ ꜰɪʟᴇ ( ɪᴍᴀɢᴇꜱ / ᴠɪᴅᴇᴏ ᴏʀ ᴀᴜᴅɪᴏ )
│ ➽ *rashunews*
> ɢᴇᴛ ᴀ ꜱɪɴʜᴀʟᴀ ʙʀᴇᴋɪɴɢ ɴᴇᴡꜱ ʜᴇᴅʟɪɴᴇꜱ
│ ➽ *news*
> ɢᴇᴛ ᴀ ʟᴀꜱᴛᴇꜱᴛ ɴᴇᴡꜱ ʜᴇᴅʟɪɴᴇꜱ
╰────────────────────●●►


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` },

      '5': { imageCaption: 
`*꧁◈╾───☉ ᴅᴀᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ ☉───╼◈꧂*

╭────────●●►
│ ➽ *song*
> ʏᴏᴜᴛᴜʙᴇ ꜱᴏɴɢ  ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *songpro*
> ʏᴏᴜᴛᴜʙᴇ ꜱᴏɴɢ ᴅᴀᴡɴʟᴏᴀᴅ  
│ ➽ *video*
> ʏᴏᴜᴛᴜʙᴇ ᴠɪᴅᴇᴏ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *videopro*
> ʏᴏᴜᴛᴜʙᴇ ᴠɪᴅᴇᴏ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *apk*
> ᴘʟᴀʏꜱᴛᴏʀʏ ᴀᴘᴘ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *tiktok*
> ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *tiktok2*
> ᴛɪᴋᴛᴏᴋ ᴠɪᴅᴇᴏ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *fb*
> ꜰᴀᴄᴇʙᴏᴏᴄᴋ ᴠɪᴅᴇᴏ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *mediafire*
> ᴍᴇᴅɪᴀꜰɪʀᴇ ʟɪɴᴋ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *ig*
> ɪɴꜱᴛᴀɢʀᴀᴍ ᴠɪᴅᴇᴏ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *twitter*
> ᴛᴡɪᴛᴛᴇʀ ᴠɪᴅᴇᴏ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *xnxxdown*
> (18+) ᴠɪᴅᴇᴏ ᴅᴀᴡɴʟᴏᴀᴅ
│ ➽ *gdrive*
> ɢᴅʀɪᴠᴇ ᴛᴏ ᴅᴀᴡɴʟᴏᴀᴅ ꜰɪʟᴇ
╰────────────────────●●►


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` },

      '6': { imageCaption: 
`*꧁◈╾───☉ ᴍᴀɪɴ  ᴍᴇɴᴜ ☉───╼◈꧂*

╭────────●●►
│ ➽ *wiki*
> ꜱᴇᴀʀᴄʜ ᴡɪᴋɪᴘᴇᴅɪᴀ ꜰᴏʀ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ
│ ➽ *env*
> ɢᴇᴛ ʙᴏᴛ ꜱᴇᴛᴛɪɴɢ ʟɪꜱᴛ
│ ➽ *system*
> ᴄʜᴇᴄᴋ ᴜᴘᴛɪᴍᴇ
│ ➽ *ping*
> ᴄʜᴇᴄᴋ ʙᴏᴛ ꜱᴘᴇᴇᴅ
│ ➽ *owner*
> ɢᴇᴛ ᴏᴡɴᴇʀ ɴᴜᴍʙᴇʀ
│ ➽ *alive*
> ʙᴏᴛ ᴏɴʟɪɴᴇ ᴄʜᴇᴄᴋ
│ ➽ *list*
> ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅ ᴛᴡᴏ ʟɪꜱᴛ
╰────────────────────●●►


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` },

      '7': { imageCaption: 
`*꧁◈╾───☉ ɢʀᴏᴜᴘ  ᴍᴇɴᴜ ☉───╼◈꧂*

╭────────●●►
│ ➽ *closetime*
> ᴍᴜᴛᴇ ᴛʜɪꜱ ɢʀᴏᴜᴘ
│ ➽ *opentime*
> ᴜɴᴍᴜᴛᴇ ᴛʜɪꜱ ɢʀᴏᴜᴘ
│ ➽ *kick*
> ʀᴇᴍᴏᴠᴇ ᴏɴᴇ ᴍᴇᴍʙᴇʀꜱ
│ ➽ *kickall*
> ʀᴇᴍᴏᴠᴇ ᴀʟʟ ᴍᴇᴍʙᴇʀꜱ 
│ ➽ *msgall*
> ꜱᴇɴᴅ ɢʀᴏᴜᴘ ᴀʟʟ ᴍᴇᴍʙᴇʀꜱ ɪɴʙᴏx ᴍꜱɢ 
│ ➽ *promote*
> ꜱᴇᴛ ᴀᴅᴍɪɴɢ
│ ➽ *demote*
> ᴜɴꜱᴇᴛ ᴀᴅᴍɪɴɢ
│ ➽ *add*
> ᴀᴅᴅ ᴏɴᴇ  ᴍᴇᴍʙᴇʀꜱ
│ ➽ *delete*
> ᴅᴇʟᴇᴛᴇ ᴛʜɪꜱ ᴍᴇꜱꜱᴀɢᴇ
│ ➽ *gname*
> ɢʀᴏᴜᴘ ɴᴀᴍᴇ ᴄʜᴀɴɢᴇ
│ ➽ *tagall*
> ᴛᴀɢ ᴀʟʟ ᴍᴇᴍʙᴀʀꜱ
│ ➽ *tagadmin*
> ᴛᴀɢ ᴀʟʟ  ᴀᴅᴍɪɴɢ
│ ➽ *invite*
> ɢʀᴏᴜᴘ ʟɪɴᴋ ɢᴇɴᴇʀᴀᴛᴛᴇ
│ ➽ *join*
> ᴊᴏɪɴ ᴀ ɢʀᴏᴜᴘ ᴜꜱɪɴɢ ᴏɴ ɪɴᴠɪᴛᴇ ʟɪɴᴋ
│ ➽ *leave*
> ᴍᴀᴋᴇ ᴛʜᴇ ʙᴏᴛ ʟᴇꜰᴛ ᴛʜᴇ ᴄᴜʀʀᴇɴᴛ ɢʀᴏᴜᴘ
│ ➽ *setdesc*
> ᴄʜᴀɴɢᴇ ɢʀᴏᴜᴘ ᴅᴇꜱᴄᴛʀɪᴘᴛɪᴏɴ
│ ➽ *setwelcome*
> ꜱᴇᴛ ᴛʜᴇ ᴡᴇʟᴄᴏᴍᴇ ᴍᴇꜱꜱᴀɢᴇ ꜰᴏʀ ᴛʜᴇ ɢʀᴏᴜᴘ
│ ➽ *setgoodbye*
> ꜱᴇᴛ ᴛʜᴇ ɢᴏᴏᴅ ʙʏᴇ  ᴍᴇꜱꜱᴀɢᴇ ꜰᴏʀ ᴛʜᴇ ɢʀᴏᴜᴘ
│ ➽ *gend*
> ɢʀᴏᴜᴘ ᴀʟʟ ᴍᴇᴍʙᴇʀꜱ ʀᴇᴍᴏᴠᴇ ᴀɴᴅ ɢʀᴏᴜᴘ ᴄʟᴏꜱᴇ
│ ➽ *allreq*
> ᴀᴘᴘʀᴏᴠᴇ ᴏʀ ʀᴇᴊᴇᴄᴛ ᴀʟʟ ᴊᴏɪɴ ʀᴇQᴜᴇꜱᴛꜱ
│ ➽ *disappear*
> ᴛʀᴜɴ ᴏɴ/ᴏꜰꜰ ᴅɪꜱᴀᴘᴘᴇᴀʀɪɴɢ ᴍᴇᴢꜱᴀɢᴇꜱ
│ ➽ *senddm*
> ꜱᴇɴᴅ ᴀ ᴅɪꜱᴀᴘᴘᴇᴀʀɪɴɢ ᴍᴇꜱꜱᴀɢᴇ
│ ➽ *lockgs*
> ᴄʜᴀɴɢᴇ ᴛᴏ ɢʀᴏᴜᴘ ꜱᴇᴛᴛɪɴɢꜱ ᴛᴏ ᴏɴʟʏ ᴀᴅᴍɪɴꜱ ᴄᴀɴ ᴇᴅɪᴛ ɢʀᴏᴜᴘ ᴏɴꜰᴏ
│ ➽ *unlockgs*
> ᴄʜᴀɴɢᴇ ᴛᴏ ɢʀᴏᴜᴘ ꜱᴇᴛᴛɪɴɢꜱ ᴛᴏ ᴀʟʟ ᴍᴇᴍʙᴀʀꜱ ᴄᴀɴ ᴇᴅɪᴛ ɢʀᴏᴜᴘ ᴏɴꜰᴏ
│ ➽ *left*
> ᴛᴏ ʟᴇᴀᴠᴇ ꜰʀᴏᴍ ᴛʜᴇ ɢʀᴏᴜᴘ
│ ➽ *gdesc*
> ᴛᴏ ᴄʜᴀɴɢᴇ ᴛʜᴇ ɢʀᴏᴜᴘ ᴅɪꜱᴄʀɪᴘᴛɪᴏɴ
│ ➽ *tag*
> ᴛᴏ ᴛᴀɢ ᴀʟʟ ᴍᴇᴍʙᴇʀꜱ ꜰᴏʀ ᴍᴇꜱꜱᴀɢᴇ
│ ➽ *tagx*
> ᴛᴏ ᴛᴀɢ ᴀʟʟ ᴍᴇᴍʙᴇʀꜱ ꜰᴏʀ ᴍᴇꜱꜱᴀɢᴇ
╰────────────────────●●►


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` },

      '8': { imageCaption: 
`*꧁◈╾───☉ ꜰᴜɴ ᴍᴇɴᴜ ☉───╼◈꧂*

╭────────●●►
│ ➽ *ship*
│ ➽ *dare*
│ ➽ *character*
│ ➽ *fact*
│ ➽ *insult*
│ ➽ *truth*
│ ➽ *pickupline*
│ ➽ *joke*
│ ➽ *dog*
│ ➽ *hack*
│ ➽ *animegirl*
│ ➽ *animegirl1*
│ ➽ *animegirl2*
│ ➽ *animegirl3*
│ ➽ *animegirl4*
│ ➽ *animegirl5*
╰────────────────────●●►


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` },

      '9': { imageCaption: 
`*꧁◈╾───☉ ᴀɪ ᴍᴇɴᴜ ☉───╼◈꧂*

╭────────●●►
│ ➽ *ai*
│ ➽ *mistra*
│ ➽ *gpt3*
│ ➽ *gpt4*
│ ➽ *llama3*
│ ➽ *meta*
│ ➽ *ai4*
│ ➽ *sd2*
│ ➽ *sd*
╰────────────────────●●►


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` },

      '10': { imageCaption: 
`*꧁◈╾───☉ ᴏᴛʜᴇʀ ᴍᴇɴᴜ ☉───╼◈꧂*

╭────────●●►
│ ➽ *anime*
│ ➽ *anime1*
│ ➽ *anime2*
│ ➽ *anime3*
│ ➽ *anime4*
│ ➽ *anime5*
│ ➽ *githubstalk*
│ ➽ *weather*
│ ➽ *fancy*
╰────────────────────●●►


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*` },
    };

    // Listen for replies to the menu message
    bot.ev.on("messages.upsert", async event => {
      const newMessage = event.messages[0];
      if (!newMessage.message) return;

      const userReply = newMessage.message.conversation || newMessage.message.extendedTextMessage?.text;
      const isReplyToMenu = newMessage.message.extendedTextMessage?.contextInfo?.stanzaId === menuMessageId;

if (isReplyToMenu) {
  const response = menuResponses[userReply];
  if (response) {
    // Send image response
    await bot.sendMessage(
  from,
  {
    image: { url: "https://i.ibb.co/BsjkCDP/9555.jpg" },
    caption: response.imageCaption,
    contextInfo: {
      mentionedJid: [],
      isForwarded: true,
      forwardingScore: 1,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363368882758119@newsletter",
        newsletterName: "ꪶ𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃ꫂ",
        serverMessageId: 999,
      },
    },
  },
  { quoted: newMessage }
);
  } else {
    // Handle invalid input
    await bot.sendMessage(from, {
      text: "Invalid option! Please reply with a valid number."
    }, { quoted: newMessage });
  }
}
    });
  } catch (error) {
    console.error(error);
    reply(`Error: ${error.message}`);
  }
});


cmd({
    pattern: "closetime",
    react: "🔖",
    desc: "To close group to a time",
    category: "group",
    use: '.closstime',
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{   
if (!isGroup) return reply(ONLGROUP)
if (!isAdmins) return reply(ADMIN)	
                if (args[1] == 'second') {
                    var timer = args[0] * `1000`
                } else if (args[1] == 'minute') {
                    var timer = args[0] * `60000`
                } else if (args[1] == 'hour') {
                    var timer = args[0] * `3600000`
                } else if (args[1] == 'day') {
                    var timer = args[0] * `86400000`
                } else {
                    return reply('*select:*\nsecond\nminute\nhour\n\n*Example*\n10 second')
                }
                reply(`Close time ${q} starting from now`)
                setTimeout(() => {
                    var nomor = m.participant
                    const close = `*CLOSE TIME* GROUP CLOSED BY 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 AT APPROVED ADMIN\nNOW ONLY ADMIN CAN SEND MESSAGES 🔐`
                    conn.groupSettingUpdate(from, 'announcement')
                    reply(close)
                }, timer)
await conn.sendMessage(from, { react: { text: `✅`, key: mek.key }}) 
} catch (e) {
reply('*Error !!*')
l(e)
}
})


cmd({
    pattern: "tagadmin",
    alais:["tagadmins"],
    react: "🙀",
    desc: "Tags all the admins in the group.",
    category: "group",
    filename: __filename,
},           
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
        // Check if the command is used in a group
        if (!isGroup) return reply(`This command is only for groups.`);
        if (!isAdmins) return reply(`This command is only for group admin.`);
        
        // Fetch all group admins
        const admins = groupAdmins;
        if (admins.length === 0) {
            return reply('There are no admins in this group.');
        }
        // Create a message with all admin tags
        let adminTagMessage = '*TAGGING ALL ADMINS IN THE GROUP 🔳:*\n\n';
        for (let admin of admins) {
            adminTagMessage += `@${admin.split('@')[0]}\n`;  // Mention each admin by their number
        }
        // Send the message and tag the admins
        await conn.sendMessage(from, { text: adminTagMessage, mentions: admins }, { quoted: mek });
    } catch (e) {
        console.error('Error tagging admins:', e);
        reply('you are not an admin.');
    }
})

cmd({
    pattern: "mute",	
    alias: ["lock"],
    react: "🔒",
    desc: "mute group.",
    category: "group",
    filename: __filename,
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isItzcp, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
if (!isOwner || !isAdmins) return;


if (!m.isGroup) return reply(mg.onlygroup);
if (!isBotAdmins) return reply(mg.needbotadmins);     
            await conn.groupSettingUpdate(m.chat, "announcement")
           const mass = await conn.sendMessage(m.chat, { text: '*GROUP CHAT MUTED BY 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃* 🔒' }, { quoted: mek });
            return await conn.sendMessage(m.chat, { react: { text: '🔒', key: mass.key } });
} catch(e) {
console.log(e);
reply('*PLEASE GIVE ME A ADDMIN ROLE❗👻*')    
} 
})

cmd({
    pattern: "unmute",	
    alias: ["unlock"],
    react: "🔓",
    desc: "unmute group.",
    category: "group",
    filename: __filename,
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isItzcp, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
if (!isOwner || !isAdmins) return;


if (!m.isGroup) return reply(mg.onlygroup);
if (!isBotAdmins) return reply(mg.needbotadmins);     
            await conn.groupSettingUpdate(m.chat, "not_announcement")
           const mass = await conn.sendMessage(m.chat, { text: '*GROUP CHAT UNMUTED BY 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃* 🔒' }, { quoted: mek });
            return await conn.sendMessage(m.chat, { react: { text: '🔒', key: mass.key } });
} catch(e) {
console.log(e);
reply('*PLEASE GIVE ME A ADDMIN ROLE❗👻*')    
} 
})

cmd({
    pattern: "add",
    alias: ["aja"],
    react: "➕",
    desc: "Adds a user to the group.",
    category: "group",
    filename: __filename,
    use: '<number>',
},           
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!m.isGroup) return reply(`This command is only for groups.`);
        
        // Check if the bot has admin privileges
        if (!isBotAdmins) return reply(`I need admin privileges to add users.`);
        
        // Check if the number is provided (from q or args)
        if (!q || isNaN(q)) return reply('Please provide a valid phone number to add.');
        
        const userToAdd = `${q}@s.whatsapp.net`;  // Format the phone number
        // Add the user to the group
        await conn.groupParticipantsUpdate(m.chat, [userToAdd], "add");
        // Confirm the addition
        reply(`User ${q} has been added to the group.`);
    } catch (e) {
        console.error('Error adding user:', e);
        reply('An error occurred while adding the user. Please make sure the number is correct and they are not already in the group.');
    }
})

cmd({
    pattern: "setgoodbye",
    desc: "Set the goodbye message for the group.",
    category: "group",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group.')
        if (!isBotAdmins) return reply('Bot must be an admin to use this command.')
        if (!isAdmins) return reply('You must be an admin to use this command.')

        const goodbye = q
        if (!goodbye) return reply('Please provide a goodbye message.')

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: goodbye })
        await reply('Goodbye message has been set.')
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

cmd({
    pattern: "setwelcome",
    desc: "Set the welcome message for the group.",
    category: "group",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group.')
        if (!isBotAdmins) return reply('Bot must be an admin to use this command.')
        if (!isAdmins) return reply('You must be an admin to use this command.')

        const welcome = q
        if (!welcome) return reply('Please provide a welcome message.')

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: welcome })
        await reply('Welcome message has been set.')
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
});

cmd({
pattern: "delete",
react: "❌",
alias: ["dl"],
desc: "delete message",
category: "group",
use: '.del',
filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isItzcp, groupAdmins, isBotAdmins, isAdmins, reply}) => {
if (!isOwner ||  !isAdmins) return;
try{
if (!m.quoted) return reply(mg.notextfordel);
const key = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        }
        await conn.sendMessage(m.chat, { delete: key })
} catch(e) {
console.log(e);
reply('𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Deleteing Message Successful..👨‍💻✅')
} 
});

cmd(
  {
    pattern: "restart",
    desc: "Restart the bot",
    category: "owner",
    react: "💢",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      if (!isOwner) {
    return reply("❌ You Are Not The Owner !");
  }
      const { exec } = require("child_process");
      reply("Restarting...");
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Sleep function
      exec("pm2 restart all", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          reply(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`);
          reply(`Stderr: ${stderr}`);
          return;
        }
        console.log(`Stdout: ${stdout}`);
        reply("Bot restarted successfully.");
      });
    } catch (e) {
      console.error(e);
      reply(`An error occurred: ${e.message}`);
    }
  }
);

cmd({
    pattern: "vv",
    react: "馃榿",
    alias: ["mattu","dakkada","mekada","supiri"],
    desc: "To ViewOnceMessage",
    category: "convert",
    use: '.vv',
    filename: __filename
},
async(conn, mek, m,{from, prefix, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{         

conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
                let quoted = message.msg ? message.msg : message
                let mime = (message.msg || message).mimetype || ''
                let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
                const stream = await downloadContentFromMessage(quoted, messageType)
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                let type = await FileType.fromBuffer(buffer)
                trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
                    // save to file
                await fs.writeFileSync(trueFileName, buffer)
                return trueFileName
            }	      
   
  
const quot = mek.msg.contextInfo.quotedMessage.viewOnceMessageV2;
if(quot)
{
if(quot.message.imageMessage) 
{ console.log("Quot Entered") 
   let cap =quot.message.imageMessage.caption;
   let anu = await conn.downloadAndSaveMediaMessage(quot.message.imageMessage)
   return conn.sendMessage(from,{image:{url : anu},caption : cap })
}
if(quot.message.videoMessage) 
{
   let cap =quot.message.videoMessage.caption;
   let anu = await conn.downloadAndSaveMediaMessage(quot.message.videoMessage)
   return conn.sendMessage(from,{video:{url : anu},caption : cap })
}
 
}
//else citel.reply("```This is Not A ViewOnce Message```") 
       
       
if(!mek.quoted) return mek.reply("```Uh Please Reply A ViewOnce Message```")           
if(mek.quoted.mtype === "viewOnceMessage")
{ console.log("ViewOnce Entered") 
 if(mek.quoted.message.imageMessage )
{ 
  let cap = mek.quoted.message.imageMessage.caption;
  let anu = await conn.downloadAndSaveMediaMessage(mek.quoted.message.imageMessage)
  conn.sendMessage(from,{image:{url : anu},caption : cap })
}
else if(mek.quoted.message.videoMessage )
{
  let cap =mek.quoted.message.videoMessage.caption;
  let anu = await conn.downloadAndSaveMediaMessage(mek.quoted.message.videoMessage)
  conn.sendMessage(from,{video:{url : anu},caption : cap })
}

}
else return mek.reply("```This is Not A ViewOnce Message```")
await conn.sendMessage(from, { react: { text: `鉁卄, key: mek.key }}) 
}catch(e){
console.log(e)
reply(`*THERE IS AN ERRER鈽癸笍*`)
}
})


cmd({
    pattern: "owner",
    react: "馃憫", // Reaction emoji when the command is triggered
    alias: ["rashu", "king"],
    desc: "Get owner number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from }) => {
    try {
        // Owner's contact info
        const ownerNumber = '+94727319036'; // Replace this with the actual owner number
        const ownerName = '> *饾悙饾悢饾毜饾毜饾悕 饾悜饾毇饾悞饾悋饾悢 饾悓饾悆*'; // Replace this with the owner's name
        const organization = '饾悙饾悢饾毜饾毜饾悕 饾悜饾毇饾悞饾悋饾悢 饾悓饾悆'; // Optional: replace with the owner's organization

        // Create a vCard (contact card) for the owner
        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  // Full Name
                      `ORG:${organization};\n` +  // Organization (Optional)
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` +  // WhatsApp ID and number
                      'END:VCARD';

        // Send the vCard first
        const sentVCard = await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Send a reply message that references the vCard
        await conn.sendMessage(from, {
            text: `This is the owner's contact: ${ownerName}\n\n\> *漏 饾櫩饾櫨饾殕饾櫞饾櫚饾殎饾櫝 饾櫛饾殘 饾殌饾殑饾櫞饾櫞饾櫧 饾殎饾櫚饾殏饾櫡饾殑 饾櫦饾櫝 鉁�*`,
            contextInfo: {
                mentionedJid: [ownerNumber.replace('+94727319036') + '+94727319036@s.whatsapp.net'], // Mention the owner
                quotedMessageId: sentVCard.key.id // Reference the vCard message
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { text: 'Sorry, there was an error fetching the owner contact.' }, { quoted: mek聽});
聽聽聽聽}
});


cmd({
    pattern: "system",
    alias: ["status","botinfo"],
    desc: "Check up time , ram usage and more",
    category: "main",
    react: "🎛️",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let status = `*𝐐𝐔𝚵𝚵𝐍 𝐑𝚫𝐒𝐇𝐔 𝐌𝐃 𝐒𝐘𝐒𝐓𝐄𝐀𝐌*\n\n\n\n* Ram usage:- *${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB*\n\n* Run Time:- *_${runtime(process.uptime())}_*\n\n\* Platform:- *${os.hostname()}\n\n\* Owners:- *Nipun Harshana*\n\n\* Version:- *1.0.0*\n\n\> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*
`
return reply(`${status}`)
  
}catch(e){
console.log(e)
reply(`${e}`)

}
})

cmd({
    pattern: "boom",
    desc: "Send a custom message any number of times (owner only).",
    category: "main",
    react: "💣",
    filename: __filename
},
async (conn, mek, m, { from, args, senderNumber, isOwner, reply }) => {
    try {
        if (!isOwner) {
            return reply('❌ This command is restricted to the owner only.');
        }
        const count = parseInt(args[0]) || 10;
        const customText = args.slice(1).join(' ') || 'Boom!';
        for (let i = 0; i < count; i++) {
            await conn.sendMessage(from, { text: customText });
        }
        reply(`✅ Sent ${count} messages.`);
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


cmd({
    pattern: "ping",
    alias: "speed",
    desc: "Check bot's response time.",
    category: "main",
    react: "🍭",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        const startTime = Date.now();

        // Add a short delay
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

        const endTime = Date.now();
        const ping = endTime - startTime;

        // Send the ping result
        await conn.sendMessage(from, { 
            text: `*𝐐𝐔𝚵𝚵𝐍 𝐑𝚫𝐒𝐇𝐔 𝐌𝐃 𝐒𝐏𝐄𝐄𝐃 : ${ping}ms*\n\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`, 
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363368882758119@newsletter',
                    newsletterName: 'QUEEN-RASHU-MD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
  pattern: "videopro",
  alias: ["ytvidpro", "ytvpro", 'ytvideopro'],
  react: '📹',
  desc: "Download videos from YouTube by searching for keywords.",
  category: "video",
  use: ".vidx <keywords>",
  filename: __filename
}, async (conn, msg, m, { from, args, reply }) => {
  try {
    const query = args.join(" ");
    if (!query) {
      return reply("*Please provide a video title or URL*");
    }

    await reply("> 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Searching Video... Please Wait...");
    
    const results = await yts(query);
    if (!results.videos || results.videos.length === 0) {
      return reply(" No results found for \"" + query + "\".");
    }

    const video = results.videos[0];
    const url = video.url;
    const apiURL = "https://api.davidcyriltech.my.id/youtube/mp4?url=" + url;

    await reply("> 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Downloading Video... Please Wait...");

    const response = await axios.get(apiURL);
    if (!response.data.success) {
      return reply(" Failed to fetch video for \"" + query + "\".");
    }

    const downloadURL = response.data.result.download_url;
    await reply("> 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Sending Video... Please Wait...");
    
    await conn.sendMessage(from, { video: { url: downloadURL }, mimetype: "video/mp4" }, { quoted: msg });
    
    await reply(" Video sent successfully!");
  } catch (error) {
    console.error(error);
    reply(" An error occurred while processing your request.");
  }
});


// Audio Download Command here

cmd({
pattern: "songpro",
alias: ["ytapro", "ytplaypro"],
react: '🎶',
desc: "Download audio from YouTube by searching for keywords.",
category: "music",
use: ".playpro <keywords>",
filename: __filename
}, async (conn, msg, m, { from, args, reply }) => {
try {
const query = args.join(" ");
if (!query) {
return reply("_Please provide an audio title or URL_");
}

await reply("> 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Searching Song... Please Wait...");

const results = await yts(query);
if (!results.videos || results.videos.length === 0) {
  return reply(" No results found for \"" + query + "\".");
}

const video = results.videos[0];
const url = video.url;
const apiURL = "https://api.davidcyriltech.my.id/youtube/mp3?url=" + url;

await reply("> 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Searching For The Song...");

const response = await axios.get(apiURL);
if (!response.data.success) {
  return reply(" Failed to fetch audio for \"" + query + "\".");
}

const downloadURL = response.data.result.download_url;
await reply("> 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Sending Song Wait...");

await conn.sendMessage(from, { audio: { url: downloadURL }, mimetype: 'audio/mpeg', ptt: false }, { quoted: msg });

await reply(" Song sent successfully!");

} catch (error) {
console.error(error);
reply(" An error occurred while processing your request.");
}
});


cmd({
  pattern: 'qrcode',
  alias: ['qr'],
  react: '🔄',
  desc: 'Generate a QR code.',
  category: 'main',
  filename: __filename
}, async (conn, mek, m, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) return reply('Please provide text to generate QR code.');
    await reply('> * 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Generating QR code...🧩*');
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(q)}&size=200x200`;
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    
    await conn.sendMessage(m.chat, { image: buffer }, { quoted: m, caption: 'QR Code By Queen Rashu Md' });
  } catch (error) {
    console.error(error);
    reply(`An error occurred: ${error.message}`);
  }
});

cmd({
    pattern: "repo",
    alias: ["sc","mrrashu","deploy","reposity","github","info2"],
    desc: "Check The Queen Rashu Md Bot github",
    category: "main",
    react: "🌟",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Generate system status message
        const status = `*╭┉┉※𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 𝐈𝐍𝐅𝐎※┉┉╮*\n\n\n*☬ ʋҽɾƚισɳ              :* _v0.1_\n*☬ ԃҽʋҽʅσρҽɾ        :* _Nipun Harshana_\n*☬ ɾҽρσ υʂҽɾɳαɱҽ :* _NipunHarshana0_\n\n*╭┉┉┉┉┉┉┉┉※ 𝐋𝐈𝐍𝐊𝐒 ※┉┉┉┉┉┉┉┉╮*\n\n* *𝑩𝑶𝑻 𝑮𝑰𝑻𝑯𝑼𝑩*
> https://github.com/NipunHarshana0/QUEEN-RASHU-MD-V1\n* *𝑾𝑯𝑨𝑻𝑺𝑨𝑷𝑷 𝑮𝑹𝑶𝑼𝑷*\n> https://chat.whatsapp.com/LmfWnYTjh605xVz5J1tgnq\n* *𝑶𝑾𝑵𝑬𝑹 𝑪𝑶𝑵𝑻𝑨𝑪𝑻*\n> wa.me/94727319036\n* *𝒀𝑶𝑼𝑻𝑼𝑩𝑬 𝑪𝑯𝑨𝑵𝑵𝑬𝑳*\n> https://youtube.com/@rashumodz_0715?si=5pg_wumwy6VzizMP\n\n~𝘽𝙊𝙏 𝘾𝙊𝙈𝙈𝙄𝙉𝙂 𝙎𝙊𝙊𝙉~\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*
`;

        // Send the status message with an image
        await conn.sendMessage(from, { 
            image: { url: `https://i.ibb.co/BsjkCDP/9555.jpg` },  // Image URL
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363368882758119@newsletter',
                    newsletterName: 'QUEEN-RASHU-MD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in repo command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

cmd({
    pattern: "settings",
    alias: ["setting","st"],
    desc: "settings the bot",
    category: "owner",
    react: "⚙",
    filename: __filename


},
async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    try {
        let desc = `*╭───╎◈𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃◈╎────╮*

> *🍒💗 QUEEN RASHU MD SETTING PANEL*

- *🔢 Reply Below Number*

✤ ============================ ✤

* *1️⃣ 𝐌𝐎𝐃𝐄*
*1.1 ╎ ⛭  PUBLIC 🗃️*
*1.2 ╎ ⛭  PRIVATE 🔐*
*1.3 ╎ ⛭  GROUPS 🎛️*
*1.4 ╎ ⛭  INBOX 🎭*
✤ ============================ ✤

* *2️⃣ 𝐀𝐔𝐓𝐎 𝐕𝐎𝐈𝐂𝐄*
*2.1 ╎ ⛭ TRUE 🔑*
*2.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤

* *3️⃣ 𝐀𝐔𝐓𝐎 𝐒𝐓𝐀𝐓𝐔𝐒 𝐒𝐄𝐄𝐍*
*3.1 ╎ ⛭ TRUE 🔑*
*3.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤

* *4️⃣ 𝐀𝐔𝐓𝐎 𝐒𝐓𝐈𝐂𝐊𝐄𝐑*
*4.1 ╎ ⛭ TRUE 🔑*
*4.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤

* *5️⃣ 𝐀𝐔𝐓𝐎 𝐑𝐄𝐏𝐋𝐘*
*5.1 ╎ ⛭ TRUE 🔑*
*5.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤

* *6️⃣ 𝐁𝐎𝐓 𝐎𝐍𝐋𝐈𝐍𝐄 𝐎𝐅𝐅𝐋𝐈𝐍𝐄*
*6.1 ╎ ⛭ TRUE 🔑*
*6.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤

* *7️⃣ 𝐌𝐒𝐆 𝐑𝐄𝐀𝐃*
*7.1 ╎ ⛭ TRUE 🔑*
*7.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤

* *8️⃣ 𝐌𝐒𝐆 𝐑𝐄𝐀𝐂𝐓*
*8.1 ╎ ⛭ TRUE 🔑*
*8.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤

* *9️⃣ 𝐀𝐍𝐓𝐈 𝐋𝐈𝐍𝐊*
*9.1 ╎ ⛭ TRUE 🔑*
*9.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤

* *1️⃣0️⃣ 𝐀𝐍𝐓𝐈 𝐁𝐎𝐓*
*10.1 ╎ ⛭ TRUE 🔑*
*10.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤

* *1️⃣1️⃣ 𝐀𝐔𝐓𝐎 𝐒𝐓𝐀𝐓𝐔𝐒 𝐑𝐄𝐏𝐋𝐘*
*11.1 ╎ ⛭ TRUE 🔑*
*11.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤

* *1️⃣1️⃣ 𝐀𝐔𝐓𝐎 𝐒𝐓𝐀𝐓𝐔𝐒 𝐑𝐄𝐀𝐂𝐓*
*12.1 ╎ ⛭ TRUE 🔑*
*12.2 ╎ ⛭ FALSE 🔐*
✤ ============================ ✤


> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`;

        const vv = await conn.sendMessage(from, { image: { url: "https://i.ibb.co/BsjkCDP/9555.jpg"}, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1.1':
                        reply(".update MODE:public" );
                        reply(".restart" );
                        break;
                    case '1.2':               
                        reply(".update MODE:private");
                        reply(".restart" );
                        break;
                    case '1.3':               
                          reply(".update MODE:group");
                        reply(".restart" );
                      break;
                    case '1.4':     
                        reply(".update MODE:inbox");
                        reply(".restart" );
                      break;
                    case '2.1':     
                        reply(".update AUTO_VOICE:true");
                        reply(".restart" );
                        break;
                    case '2.2':     
                        reply(".update AUTO_VOICE:false");
                        reply(".restart" );
                    break;
                    case '3.1':    
                        reply(".update AUTO_READ_STATUS:true");
                        reply(".restart" );
                    break;
                    case '3.2':    
                        reply(".update AUTO_READ_STATUS:false");
                        reply(".restart" );
                    break;                    
                    case '4.1':    
                        reply(".update AUTO_STICKER:true");
                        reply(".restart" );
                    break;
                    case '4.2':    
                        reply(".update AUTO_STICKER:false");
                        reply(".restart" );
                    break;                                        
                    case '5.1':    
                        reply(".update AUTO_REPLY:true");
                        reply(".restart" );
                    break;
                    case '5.2':    
                        reply(".update AUTO_REPLY:false");
                        reply(".restart" );
                    break;                        
                    case '6.1':    
                        reply(".update ALLWAYS_OFFLINE:true");
                        reply(".restart" );
                    break; 
                    case '6.2':    
                        reply(".update ALLWAYS_OFFLINE:false");
                        reply(".restart" );
                    break;                       
                    case '7.1':    
                        reply(".update READ_MESSAGE:true");
                        reply(".restart" );
                    break;
                    case '7.2':    
                        reply(".update READ_MESSAGE:false");
                        reply(".restart" );
                    break;
                    case '8.1':    
                        reply(".update AUTO_REACT:true");
                        reply(".restart" );
                    break;
                    case '8.2':    
                        reply(".update AUTO_REACT:false");
                        reply(".restart" );
                    break;
                    case '9.1':    
                        reply(".update ANTI_LINK:true");
                        reply(".update ANTI_LINKK:false");
                        reply(".restart" );
                    break;
                    case '9.2':    
                        reply(".update ANTI_LINKK:true");
                        reply(".update ANTI_LINK:false");
                        reply(".restart" );
                    break;
                    case '9.3':    
                        reply(".update ANTI_LINK:false");
                        reply(".update ANTI_LINKK:false");
                        reply(".restart" );
                    break;
                        case '10.1':     
                        reply(".update ANTI_BOT:true");
                        reply(".restart" );
                        break;
                    case '10.2':     
                        reply(".update ANTI_BOT:false");
                        reply(".restart" );
                    break;
                    case '11.1':     
                        reply(".update AUTO_STATUS_REPLY:true");
                        reply(".restart" );
                        break;
                    case '11.2':     
                        reply(".update AUTO_STATUS_REPLY:false");
                        reply(".restart" );
                    break;
                    case '12.1':    
                        reply(".update AUTO_REACT_STATUS:true");
                        reply(".restart" );
                    break;
                    case '12.2':    
                        reply(".update AUTO_REACT_STATUS:false");
                        reply(".restart" );
                    break;
                    default:
                        reply("Invalid option. Please select a valid option🔴");
                }

            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request.');
    }
});

cmd({
  pattern: 'tinyurl',
  alias: ['tiny', 'shorten', 'short', 'shorturl'],
  react: '🍒',
  desc: 'Shorten a URL using TinyURL or ShortURL.',
  category: 'main',
  filename: __filename
}, async (conn, mek, m, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) return reply('Please provide a URL to shorten.');

    await reply('> *Queen Rashu Md Processing...*');

    let apiUrl = '';
    if (command === 'tiny' || command === 'tinyurl') {
      apiUrl = `https://api.giftedtech.web.id/api/tools/tinyurl?apikey=gifted&url=${encodeURIComponent(q)}`;
    } else {
      apiUrl = `https://api.giftedtech.web.id/api/tools/shorturl?apikey=gifted&url=${encodeURIComponent(q)}`;
    }

    await reply('> *Queen Rashu Md Shortening URL...*');

    const response = await fetchJson(apiUrl);
    const result = response.result;

    const caption = ` \`QUEEN RASHU MD URL SHORTENER\` \n\n\n*Original Link:* ${q}\n\n*Shortened Link:* ${result}\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`;

   /* await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
  } catch (error) {
    console.error(error);
    reply(`An error occurred: ${error.message}`);
  }
});
*/
 // Send the status message with an image
        await conn.sendMessage(from, { 
            image: { url: `https://i.ibb.co/BsjkCDP/9555.jpg` },  // Image URL
            caption: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363368882758119@newsletter',
                    newsletterName: '『 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 』',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in shortining URL:", e);
        reply(`An error occurred: ${e.message}`);
    }
});


cmd({
    pattern: "update",
    alias: ["undefined"],
    desc: "Check and update environment variables",
    react: "⚙",
    category: "owner",
    filename: __filename,
},
async (conn, mek, m, { from, q, reply, isOwner }) => {
    
    if (!isOwner) return;

    if (!q) {
        return reply("🙇‍♂️ *Please provide the environment variable and its new value.* \n\nExample: `.update ALIVE_MSG: hello i am prabath kumara`");
    }

    // Find the position of the first colon or comma
    const colonIndex = q.indexOf(':');
    const commaIndex = q.indexOf(',');

    // Ensure we have a valid delimiter index
    const delimiterIndex = colonIndex !== -1 ? colonIndex : commaIndex;
    if (delimiterIndex === -1) {
        return reply("🫠 *Invalid format. Please use the format:* `.update KEY:VALUE`");
    }

    // Extract key and value
    const key = q.substring(0, delimiterIndex).trim();
    const value = q.substring(delimiterIndex + 1).trim();
    
    // Extract mode if provided
    const parts = value.split(/\s+/).filter(part => part.trim());
    const newValue = value; // Use the full value as provided by the user
    const mode = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';
    
    const validModes = ['public', 'private', 'groups', 'inbox'];
    const finalMode = validModes.includes(mode) ? mode : '';

    if (!key || !newValue) {
        return reply("🫠 *Invalid format. Please use the format:* `.update KEY:VALUE`");
    }

    // Specific checks for MODE, ALIVE_IMG, and AUTO_READ_STATUS
    if (key === 'MODE' && !validModes.includes(newValue)) {
        return reply(`😒 *Invalid mode. Valid modes are: ${validModes.join(', ')}*`);
    }

    if (key === 'ALIVE_IMG' && !newValue.startsWith('https://')) {
        return reply("😓 *Invalid URL format. PLEASE GIVE ME IMAGE URL*");
    }

    if (key === 'AUTO_READ_STATUS' && !['true', 'false'].includes(newValue)) {
        return reply("😓 *Invalid value for AUTO_READ_STATUS. Please use `true` or `false`.*");
    }

    try {
        // Check if the environment variable exists
        const envVar = await EnvVar.findOne({ key: key });

        if (!envVar) {
            // If the variable does not exist, fetch and list all existing env vars
            const allEnvVars = await EnvVar.find({});
            const envList = allEnvVars.map(env => `${env.key}: ${env.value}`).join('\n');
            return reply(`❌ *The environment variable ${key} does not exist.*\n\n*Here are the existing environment variables:*\n\n${envList}`);
        }

        // Update the environment variable
        await updateEnv(key, newValue, finalMode);
        reply(`✅ *Environment variable updated.*\n\n🗃️ *${key}* ➠ ${newValue} ${finalMode ? `\n*Mode:* ${finalMode}` : ''}`);
        
    } catch (err) {
        console.error('Error updating environment variable:' + err.message);
        reply("🙇‍♂️ *Failed to update the environment variable. Please try again.*" + err);
    }
});


// Command to activate the general news service in the group
cmd({
    pattern: "startnews",
    desc: "Enable Sri Lankan news updates in this group",
    isGroup: true,
    react: "📰",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, participants }) => {
    try {
        if (isGroup) {
            const isAdmin = participants.some(p => p.id === mek.sender && p.admin);
            const isBotOwner = mek.sender === conn.user.jid;

            if (isAdmin || isBotOwner) {
                if (!activeGroups[from]) {
                    activeGroups[from] = true;

                    await conn.sendMessage(from, { text: "*𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Auto 24/7 News Activatrd 🌟🗞️🇱🇰*\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*" });

                    if (!activeGroups['interval']) {
                        activeGroups['interval'] = setInterval(async () => {
                            for (const groupId in activeGroups) {
                                if (activeGroups[groupId] && groupId !== 'interval') {
                                    await checkAndPostNews(conn, groupId);
                                }
                            }
                        }, 60000); // Check for news every 60 seconds
                    }

                } else {
                    await conn.sendMessage(from, { text: "*𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Auto 24/7 News Already Activatrd ✅*\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*" });
                }
            } else {
                await conn.sendMessage(from, { text: "🚫 This command can only be used by group admins or the bot owner." });
            }
        } else {
            await conn.sendMessage(from, { text: "This command can only be used in groups." });
        }
    } catch (e) {
        console.error(`Error in news command: ${e.message}`);
        await conn.sendMessage(from, { text: "Failed to activate the news service." });
    }
});

// stop news
cmd({
    pattern: "stopnews",
    desc: "Disable Sri Lankan news updates in this group",
    isGroup: true,
    react: "🛑",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, participants }) => {
    try {
        if (isGroup) {
            const isAdmin = participants.some(p => p.id === mek.sender && p.admin);
            const isBotOwner = mek.sender === conn.user.jid;

            if (isAdmin || isBotOwner) {
                if (activeGroups[from]) {
                    delete activeGroups[from];
                    await conn.sendMessage(from, { text: "*🚫 Disable Sri Lankan news updates in this group*" });

                    if (Object.keys(activeGroups).length === 1 && activeGroups['interval']) {
                        clearInterval(activeGroups['interval']);
                        delete activeGroups['interval'];
                    }
                } else {
                    await conn.sendMessage(from, { text: "*🛑 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Auto News Is Not Active In This Group.*\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*" });
                }
            } else {
                await conn.sendMessage(from, { text: "🚫 This command can only be used by group admins or the bot owner." });
            }
        } else {
            await conn.sendMessage(from, { text: "This command can only be used in groups." });
        }
    } catch (e) {
        console.error(`Error in news command: ${e.message}`);
        await conn.sendMessage(from, { text: "Failed to deactivate the news service." });
    }
});


// AutoBIO feature variables
let autoBioInterval;

// 1. Set AutoBIO
cmd({
    pattern: "setautobio",
    desc: "Enable or disable the AutoBIO feature.",
    category: "owner",
    react: "👨‍💻",
    filename: __filename
}, async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    config.autoBioEnabled = !config.autoBioEnabled;

    if (config.autoBioEnabled) {
        reply("👨‍💻 AutoBIO feature has been *enabled*! 🔄");
        startAutoBio(conn);
    } else {
        reply("👨‍💻 AutoBIO feature has been *disabled*! 🚫");
        stopAutoBio();
    }
});

// 2. Start AutoBIO
function startAutoBio(conn) {
    // Clear any existing interval to avoid duplicates
    if (autoBioInterval) clearInterval(autoBioInterval);

    // Set a new interval to update the bio every minute (or any preferred time)
    autoBioInterval = setInterval(async () => {
        const time = new Date().toLocaleTimeString();  // Get the current time
        const bioText = `💗𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃🍒🔐 [${time}]`;  // Set the bio text with time
        await conn.updateProfileStatus(bioText);  // Update the bot's bio
    }, 60 * 1000);  // 1 minute interval
}

// 3. Stop AutoBIO
function stopAutoBio() {
    if (autoBioInterval) {
        clearInterval(autoBioInterval);  // Stop the interval
        autoBioInterval = null;
        console.log("👨‍💻 AutoBIO feature stopped.");  // Log the stopping of the feature
    }
          }

cmd({
    pattern: "add2",
    alias: ["aja"],
    react: "➕",
    desc: "Adds a user to the group.",
    category: "group",
    filename: __filename,
    use: '<number>',
},           
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Check if the command is used in a group
        if (!m.isGroup) return reply(`This command is only for groups.`);
        
        // Check if the bot has admin privileges
        if (!isBotAdmins) return reply(`I need admin privileges to add users.`);
        
        // Check if the number is provided (from q or args)
        if (!q || isNaN(q)) return reply('Please provide a valid phone number to add.');
        
        const userToAdd = `${q}@s.whatsapp.net`;  // Format the phone number
        // Add the user to the group
        await conn.groupParticipantsUpdate(m.chat, [userToAdd], "add");
        // Confirm the addition
        reply(`User ${q} has been added to the group.`);
    } catch (e) {
        console.error('Error adding user:', e);
        reply('An error occurred while adding the user. Please make sure the number is correct and they are not already in the group.');
    }
})

cmd({
    pattern: "setgoodbye2",
    desc: "Set the goodbye message for the group.",
    category: "group",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group.')
        if (!isBotAdmins) return reply('Bot must be an admin to use this command.')
        if (!isAdmins) return reply('You must be an admin to use this command.')

        const goodbye = q
        if (!goodbye) return reply('Please provide a goodbye message.')

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: goodbye })
        await reply('Goodbye message has been set.')
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

cmd({
    pattern: "setwelcome2",
    desc: "Set the welcome message for the group.",
    category: "group",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group.')
        if (!isBotAdmins) return reply('Bot must be an admin to use this command.')
        if (!isAdmins) return reply('You must be an admin to use this command.')

        const welcome = q
        if (!welcome) return reply('Please provide a welcome message.')

        await conn.sendMessage(from, { image: { url: config.ALIVE_IMG }, caption: welcome })
        await reply('Welcome message has been set.')
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
});


const cmdDetails = {
  pattern: "lankadeepa",
  alias: ["lanka", "news4"],
  react: "📑",
  desc: '',
  category: "search",
  use: ".lankadeepa",
  filename: __filename
};

cmd(cmdDetails, async (bot, message, args, { from, quoted, reply }) => {
  try {
    // Fetch news from the Lankadeepa source
    const newsData = await newss.lankadeepa();

    // Format the message
    const newsMessage = `
      📑 *QUEEN RASHU MD LANKADEEPA NEWS* 📑
           
• *Title* - ${newsData.result.title}

• *News* - ${newsData.result.desc}

• *Date* - ${newsData.result.date}

• *Link* - ${newsData.result.url}

> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`;

    // Prepare the image and caption
    const imageDetails = {
      url: newsData.result.image || ''
    };

    const messageDetails = {
      image: imageDetails,
      caption: newsMessage
    };

    const options = {
      quoted: message
    };

    // Send the message
    await bot.sendMessage(from, messageDetails, options);
  } catch (error) {
    console.error(error);
    reply(`Error:${e}`);
  }
});

const sirasaNewsCommand = {
  pattern: "sirasanews",
  alias: ["sirasa", "news2"],
  react: "🔺",
  desc: '',
  category: "search",
  use: ".sirasa",
  filename: __filename
};

cmd(sirasaNewsCommand, async (client, message, args, { from, quoted, reply }) => {
  try {
    const newsData = await newss.sirasa(); // Fetch Sirasa news
    const newsMessage = `
      🔺 *QUEEN RASHU MD SIRASA NEWS* 🔺
       
• *Title* - ${newsData.result.title}

• *News* - ${newsData.result.desc}

• *Link* - ${newsData.result.url} 

> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`;

    const imageDetails = {
      url: newsData.result.image || ''
    };

    const messageDetails = {
      image: imageDetails,
      caption: newsMessage
    };

    const options = {
      quoted: message
    };

    // Send the message with news details
    await client.sendMessage(from, messageDetails, options);
  } catch (error) {
    console.log(error);
    reply(error);
  }
});


cmd({
  pattern: "stablediffussion",
  alias: ['sd', "imagine2"],
  react: '🎉',
  desc: "Generate an image using AI API.",
  category: "fun",
  filename: __filename
}, async (message, match, metadata, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) {
      return reply("Please provide a prompt for the image.");
    }
    await reply("Queen Rashu Md Diffussing Your image...");
    let response = await fetchJson("https://api.giftedtech.web.id/api/ai/fluximg?apikey=gifted&prompt=" + q);
    const imageUrl = response.result;
    await message.sendMessage(metadata.chat, {
      image: {
        url: imageUrl
      }
    });
  } catch (error) {
    console.error(error);
    reply("An error occurred: " + error.message);
  }
});

//=================( )=================


cmd({
  pattern: "pixel",
  alias: ["sd2", "imagine2"],
  react: '🌟',
  desc: "Generate an image using AI.",
  category: "main",
  filename: __filename
}, async (message, match, metadata, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) {
      return reply("Please provide a prompt for the image.");
    }
    await reply("> *Queen Rashu Imagining Your image...*");
    let response = await fetchJson("https://api.giftedtech.web.id/api/ai/fluximg?apikey=gifted&prompt=" + q);
    const imageUrl = response.result;
    await message.sendMessage(metadata.chat, {
      image: {
        url: imageUrl,
        caption: "Generated by Queen Rashu Modz"
      }
    });
  } catch (error) {
    console.error(error);
    reply("An error occurred: " + error.message);
  }
});

cmd({
  pattern: 'ai',
  alias: ["chatgpt", "gpt"],
  react: '🤖',
  desc: "AI chat.",
  category: "main",
  filename: __filename
}, async (_context, _event, _args, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) {
      return reply("Please ask a question or provide input for the AI.");
    }
    const aiResponse = await fetchJson('https://api.davidcyriltech.my.id/ai/gpt4omini?text=' + q);
    console.log(aiResponse);
    if (!aiResponse.message) {
      return reply("No response from the AI.");
    }
    return reply(" `🤖 QUEEN RASHU MD AI RESPONSE:` \n\n" + aiResponse.message);
  } catch (error) {
    console.error(error);
    reply("An error occurred: " + error.message);
  }
});

//=================( )=================

cmd({
  pattern: "mistraai",
  alias: ["mistra", "zimai"],
  react: '🪄',
  desc: "AI chat.",
  category: "main",
  filename: __filename
}, async (_context, _event, _args, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) {
      return reply("Please ask a question or provide input for the AI.");
    }
    const aiResponse = await fetchJson('https://pikabotzapi.vercel.app/ai/mistral/?apikey=anya-md&message=' + q);
    console.log(aiResponse);
    if (!aiResponse.message) {
      return reply("No response from the AI.");
    }
    return reply(" `🤖 QUEEN RASHU MD MISTRA AI:` \n\n" + aiResponse.message);
  } catch (error) {
    console.error(error);
    reply("An error occurred: " + error.message);
  }
});

//=================( )=================

cmd({
  pattern: "gpt3",
  alias: ["gptturbo", "chatgpt3"],
  react: '😇',
  desc: "AI chat.",
  category: "main",
  filename: __filename
}, async (_context, _event, _args, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) {
      return reply("Please ask a question or provide input for the AI.");
    }
    const aiResponse = await fetchJson("https://api.davidcyriltech.my.id/ai/gpt3?text=" + q);
    console.log(aiResponse);
    if (!aiResponse.message) {
      return reply("No response from the AI.");
    }
    return reply(" `🤖 QUEEN RASHU MD CHATGPT 3:` \n\n" + aiResponse.message);
  } catch (error) {
    console.error(error);
    reply("An error occurred: " + error.message);
  }
});

//=================( )=================

cmd({
  pattern: 'gpt4',
  alias: ['ai4', 'chatgpt4'],
  react: '🪄',
  desc: "AI chat.",
  category: "main",
  filename: __filename
}, async (message, match, metadata, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) {
      return reply("Please ask a question or provide input for the AI.");
    }
    const response = await fetchJson(`https://api.davidcyriltech.my.id/ai/gpt4omini?text=${q}`);
    console.log(response);
    if (!response.message) {
      return reply("No response from the AI.");
    }
    return reply(`🤖 QUEEN RASHU MD CHATGPT 4: \n\n${response.message}`);
  } catch (error) {
    console.error(error);
    reply(`An error occurred: ${error.message}`);
  }
});

//=================( )=================

cmd({
  pattern: "llama3",
  alias: ["llama", "model3"],
  react: '✅',
  desc: "AI chat.",
  category: 'main',
  filename: __filename
}, async (message, match, metadata, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) {
      return reply("Please ask a question or provide input for the AI.");
    }
    const response = await fetchJson(`https://api.davidcyriltech.my.id/ai/llama3?text=${q}`);
    console.log(response);
    if (!response.message) {
      return reply("No response from the AI.");
    }
    return reply(`🤖 QUEEN RASHU MD LLAM AI: \n\n${response.message}`);
  } catch (error) {
    console.error(error);
    reply(`An error occurred: ${error.message}`);
  }
});

//=================( )=================

cmd({
  pattern: "metai",
  alias: ["meta", "llama2"],
  react: '🔄',
  desc: "AI chat.",
  category: "main",
  filename: __filename
}, async (message, match, metadata, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) {
      return reply("Please ask a question or provide input for the AI.");
    }
    const response = await fetchJson(`https://api.davidcyriltech.my.id/ai/metaai?text=${q}`);
    console.log(response);
    if (!response.message) {
      return reply("No response from the AI.");
    }
    return reply(`🤖 QUEEN RASHU MD META AI: \n\n${response.message}`);
  } catch (error) {
    console.error(error);
    reply(`An error occurred: ${error.message}`);
  }
});

//=================( )=================

cmd({
  pattern: 'gpt4o',
  alias: ['ai4', 'chatgpt4'],
  react: '🟢',
  desc: "AI chat.",
  category: "main",
  filename: __filename
}, async (message, match, metadata, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) {
      return reply("Please ask a question or provide input for the AI.");
    }
    const response = await fetchJson("https://api.davidcyriltech.my.id/ai/gpt4omini?text=" + q);
    console.log(response);
    if (!response.message) {
      return reply("No response from the AI.");
    }
    return reply(`🤖 QUEEN RASHU MD CHATGPT 4o: \n\n${response.message}`);
  } catch (error) {
    console.error(error);
    reply(`An error occurred: ${error.message}`);
  }
});

cmd({
  pattern: "gemini",
  alias: ['bard', 'bing'],
  react: '⏳',
  desc: "AI chat.",
  category: "main",
  filename: __filename
}, async (message, match, metadata, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!q) {
      return reply("Please ask a question or provide input for the AI.");
    }
    const response = await fetchJson('https://api.davidcyriltech.my.id/ai/gpt4omini?text=' + q);
    console.log(response);
    if (!response.message) {
      return reply("No response from the AI.");
    }
    return reply(`🤖 QUEEN RASHU MD GOOGLE AI: \n\n${response.message}`);
  } catch (error) {
    console.error(error);
    reply(`An error occurred: ${error.message}`);
  }
});
cmd({
  'pattern': "hand",
  'desc': "Displays a dynamic edit msg for fun.",
  'category': "tools",
  'react': '👊',
  'filename': __filename
}, async (_0x45cd83, _0x286d49, _0x19855e, {
  from: _0x96d404,
  reply: _0x47c6bc
}) => {
  try {
    const _0x1d39fa = await _0x45cd83.sendMessage(_0x96d404, {
      'text': "👊 *STARTED...* 💦"
    });
    const _0x3eccb1 = ['8👊===D', "8=👊==D", "8==👊=D", "8===👊D", "8==👊=D", "8=👊==D", "8👊===D", "8=👊==D", "8==👊=D", '8===👊D', "8==👊=D", "8=👊==D", '8👊===D', "8=👊==D", "8==👊=D", "8===👊D", "8==👊=D", '8=👊==D', "8👊===D", '8=👊==D', "8==👊=D", "8===👊D 💦", "8==👊=D💦 💦", "8=👊==D 💦💦 💦"];
    for (const _0x406c5e of _0x3eccb1) {
      await new Promise(_0x2b41ff => setTimeout(_0x2b41ff, 0x3e8));
      await _0x45cd83.relayMessage(_0x96d404, {
        'protocolMessage': {
          'key': _0x1d39fa.key,
          'type': 0xe,
          'editedMessage': {
            'conversation': _0x406c5e
          }
        }
      }, {});
    }
  } catch (_0x57d8ae) {
    console.log(_0x57d8ae);
    _0x47c6bc("❌ *Error!* " + _0x57d8ae.message);
  }
});
cmd({
  'pattern': "hpy",
  'desc': "Displays a dynamic edit msg for fun.",
  'category': "tools",
  'react': '😁',
  'filename': __filename
}, async (_0x353111, _0x52aa7e, _0x362309, {
  from: _0x3d98dd,
  reply: _0x46f413
}) => {
  try {
    const _0xce6d4d = await _0x353111.sendMessage(_0x3d98dd, {
      'text': '😂'
    });
    const _0x47a009 = ['😃', '😄', '😁', '😊', '😎', '🥳', '😸', '😹', '🌞', '🌈', '😃', '😄', '😁', '😊', '😎', '🥳', '😸', '😹', '🌞', '🌈', '😃', '😄', '😁', '😊'];
    for (const _0x445d2a of _0x47a009) {
      await new Promise(_0x3a1a76 => setTimeout(_0x3a1a76, 0x320));
      await _0x353111.relayMessage(_0x3d98dd, {
        'protocolMessage': {
          'key': _0xce6d4d.key,
          'type': 0xe,
          'editedMessage': {
            'conversation': _0x445d2a
          }
        }
      }, {});
    }
  } catch (_0x3d2162) {
    console.log(_0x3d2162);
    _0x46f413("❌ *Error!* " + _0x3d2162.message);
  }
});
cmd({
  'pattern': "hrt",
  'desc': "Displays a dynamic edit msg for fun.",
  'category': "tools",
  'react': '🫀',
  'filename': __filename
}, async (_0x468a9f, _0x3a7e90, _0xac39dc, {
  from: _0x53a037,
  reply: _0x542a66
}) => {
  try {
    const _0x39d571 = await _0x468a9f.sendMessage(_0x53a037, {
      'text': '❤️'
    });
    const _0x52271e = ['💖', '💗', '💕', '❤️', '💛', '💚', '🫀', '💙', '💜', '🖤', '♥️', '🤍', '🤎', '💗', '💞', '💓', '💘', '💝', '♥️', '💟', '🫀', '❤️'];
    for (const _0x42a679 of _0x52271e) {
      await new Promise(_0xc0ed08 => setTimeout(_0xc0ed08, 0x1f4));
      await _0x468a9f.relayMessage(_0x53a037, {
        'protocolMessage': {
          'key': _0x39d571.key,
          'type': 0xe,
          'editedMessage': {
            'conversation': _0x42a679
          }
        }
      }, {});
    }
  } catch (_0x2f7fbb) {
    console.log(_0x2f7fbb);
    _0x542a66("❌ *Error!* " + _0x2f7fbb.message);
  }
});
cmd({
  'pattern': "anger",
  'desc': "Displays a dynamic edit msg for fun.",
  'category': "tools",
  'react': '🤡',
  'filename': __filename
}, async (_0x4c63a0, _0x2a2d0f, _0xfd1920, {
  from: _0x7c1f05,
  reply: _0x2fc617
}) => {
  try {
    const _0x471762 = await _0x4c63a0.sendMessage(_0x7c1f05, {
      'text': '🤡'
    });
    const _0x4383e5 = ['😡', '😠', '🤬', '😤', '😾', '😡', '😠', '🤬', '😤', '😾'];
    for (const _0x562bf3 of _0x4383e5) {
      await new Promise(_0x2be7c0 => setTimeout(_0x2be7c0, 0x3e8));
      await _0x4c63a0.relayMessage(_0x7c1f05, {
        'protocolMessage': {
          'key': _0x471762.key,
          'type': 0xe,
          'editedMessage': {
            'conversation': _0x562bf3
          }
        }
      }, {});
    }
  } catch (_0x44a0c5) {
    console.log(_0x44a0c5);
    _0x2fc617("❌ *Error!* " + _0x44a0c5.message);
  }
});
cmd({
  'pattern': "syd",
  'desc': "Displays a dynamic edit msg for fun.",
  'category': "tools",
  'react': '😫',
  'filename': __filename
}, async (_0x33fcee, _0x1876fe, _0xc17cb8, {
  from: _0x15bb18,
  reply: _0xee066f
}) => {
  try {
    const _0x4c06fd = await _0x33fcee.sendMessage(_0x15bb18, {
      'text': '😭'
    });
    const _0x2d9a88 = ['🥺', '😟', '😕', '😖', '😫', '🙁', '😩', '😥', '😓', '😪', '😢', '😔', '😞', '😭', '💔', '😭', '😿'];
    for (const _0x336d71 of _0x2d9a88) {
      await new Promise(_0x6eece4 => setTimeout(_0x6eece4, 0x3e8));
      await _0x33fcee.relayMessage(_0x15bb18, {
        'protocolMessage': {
          'key': _0x4c06fd.key,
          'type': 0xe,
          'editedMessage': {
            'conversation': _0x336d71
          }
        }
      }, {});
    }
  } catch (_0x345651) {
    console.log(_0x345651);
    _0xee066f("❌ *Error!* " + _0x345651.message);
  }
});
cmd({
  'pattern': 'shyy',
  'desc': "Displays a dynamic edit msg for fun.",
  'category': "tools",
  'react': '😳',
  'filename': __filename
}, async (_0x5cfd31, _0x13a257, _0x4fe9cd, {
  from: _0x453318,
  reply: _0x138a01
}) => {
  try {
    const _0x361884 = await _0x5cfd31.sendMessage(_0x453318, {
      'text': "> *𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃*"
    });
    const _0x206081 = ['😳', '😊', '😶', '🙈', '🙊', '😳', '😊', '😶', '🙈', '🙊'];
    for (const _0x5ccb6e of _0x206081) {
      await new Promise(_0x23b67b => setTimeout(_0x23b67b, 0x3e8));
      await _0x5cfd31.relayMessage(_0x453318, {
        'protocolMessage': {
          'key': _0x361884.key,
          'type': 0xe,
          'editedMessage': {
            'conversation': _0x5ccb6e
          }
        }
      }, {});
    }
  } catch (_0x3775a4) {
    console.log(_0x3775a4);
    _0x138a01("❌ *Error!* " + _0x3775a4.message);
  }
});
cmd({
  'pattern': "mon",
  'desc': "Displays a dynamic edit msg for fun.",
  'category': 'tools',
  'react': '🌙',
  'filename': __filename
}, async (_0x2adc05, _0x574382, _0xe7924c, {
  from: _0x10f877,
  reply: _0x1797ef
}) => {
  try {
    const _0x16fb04 = await _0x2adc05.sendMessage(_0x10f877, {
      'text': '🌙'
    });
    const _0x226056 = ['🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕', "🌚🌝"];
    for (const _0x3ad6c8 of _0x226056) {
      await new Promise(_0x1eba41 => setTimeout(_0x1eba41, 0x3e8));
      await _0x2adc05.relayMessage(_0x10f877, {
        'protocolMessage': {
          'key': _0x16fb04.key,
          'type': 0xe,
          'editedMessage': {
            'conversation': _0x3ad6c8
          }
        }
      }, {});
    }
  } catch (_0x31361e) {
    console.log(_0x31361e);
    _0x1797ef("❌ *Error!* " + _0x31361e.message);
  }
});
cmd({
  'pattern': "cunfuzed",
  'desc': "Displays a dynamic edit msg for fun.",
  'category': 'tools',
  'react': '🙀',
  'filename': __filename
}, async (_0x4e5dcf, _0x197ed7, _0x4e6e55, {
  from: _0x419892,
  reply: _0x1f258d
}) => {
  try {
    const _0x566b9e = await _0x4e5dcf.sendMessage(_0x419892, {
      'text': '🙀'
    });
    const _0x35a517 = ['😕', '😟', '😵', '🤔', '😖', '😲', '😦', '🤷', "🤷‍♂️", '🤷‍♀️'];
    for (const _0x177123 of _0x35a517) {
      await new Promise(_0x19e7ff => setTimeout(_0x19e7ff, 0x3e8));
      await _0x4e5dcf.relayMessage(_0x419892, {
        'protocolMessage': {
          'key': _0x566b9e.key,
          'type': 0xe,
          'editedMessage': {
            'conversation': _0x177123
          }
        }
      }, {});
    }
  } catch (_0x3914f5) {
    console.log(_0x3914f5);
    _0x1f258d("❌ *Error!* " + _0x3914f5.message);
  }
});
cmd({
  'pattern': 'kiss',
  'desc': "Displays a dynamic edit msg for fun.",
  'category': "tools",
  'react': '♥️',
  'filename': __filename
}, async (_0x5534d6, _0xea351e, _0x4a659, {
  from: _0x3549d3,
  reply: _0x38bcdd
}) => {
  try {
    const _0x3d3056 = await _0x5534d6.sendMessage(_0x3549d3, {
      'text': '♥️'
    });
    const _0x548d62 = ['🥵', '❤️', '💋', '😫', '🤤', '😋', '🥵', '🥶', '🙊', '😻', '🙈', '💋', '🫂', '🫀', '👅', '👄', '💋'];
    for (const _0x2ae417 of _0x548d62) {
      await new Promise(_0x3260b1 => setTimeout(_0x3260b1, 0x3e8));
      await _0x5534d6.relayMessage(_0x3549d3, {
        'protocolMessage': {
          'key': _0x3d3056.key,
          'type': 0xe,
          'editedMessage': {
            'conversation': _0x2ae417
          }
        }
      }, {});
    }
  } catch (_0x1763fc) {
    console.log(_0x1763fc);
    _0x38bcdd("❌ *Error!* " + _0x1763fc.message);
  }
});
cmd({
  'pattern': 'nikal',
  'desc': "Displays a dynamic edit msg for fun.",
  'category': "tools",
  'react': '🗿',
  'filename': __filename
}, async (_0x125191, _0x3f957c, _0xb9d01a, {
  from: _0x3ae285,
  reply: _0x30a5f5
}) => {
  try {
    const _0x19567b = await _0x125191.sendMessage(_0x3ae285, {
      'text': "> *𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 💗*"
    });
    const _0x1c80f3 = ["⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀⠀⠀⠀     ⢳⡀⠀⡏⠀⠀⠀   ⠀  ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀⠀⠀  ⠀    ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲     ⣿  ⣸   Queen   ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀⠀      ⣿  ⢹⠀          ⡇\n  ⠙⢿⣯⠄⠀⠀⠀__⠀   ⠀   ⡿ ⠀⡇⠀⠀⠀⠀    ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀⠀⠀⠀⠀⠀`", "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀⠀⠀⠀  ⠀  ⢳⡀⠀⡏⠀⠀⠀   ⠀  ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀⠀⠀       ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲     ⣿  ⣸   Rashu   ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀⠀      ⣿  ⢹⠀          ⡇\n  ⠙⢿⣯⠄⠀⠀|__|⠀⠀   ⡿ ⠀⡇⠀⠀⠀⠀    ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀⠀⠀⠀⠀⠀`", "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀     ⠀   ⢳⡀⠀⡏⠀⠀    ⠀  ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀⠀⠀⠀      ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲    ⣿  ⣸   Md   ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀⠀     ⣿  ⢹⠀           ⡇\n  ⠙⢿⣯⠄⠀⠀(P)⠀⠀     ⡿ ⠀⡇⠀⠀⠀⠀    ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀⠀⠀⠀⠀⠀`", "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀     ⠀   ⢳⡀⠀⡏⠀⠀    ⠀  ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀   ⠀     ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲    ⣿  ⣸  WhatsApp  ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀        ⣿  ⢹⠀          ⡇\n  ⠙⢿⣯⠄⠀⠀⠀__ ⠀  ⠀   ⡿ ⠀⡇⠀⠀⠀⠀    ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀⠀⠀⠀⠀⠀`", "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀⠀⠀⠀      ⢳⡀⠀⡏⠀⠀    ⠀  ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀⠀ ⠀      ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲    ⣿  ⣸  User   ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀⠀       ⣿  ⢹⠀          ⡇\n  ⠙⢿⣯⠄⠀⠀|__| ⠀    ⡿ ⠀⡇⠀⠀⠀⠀    ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀⠀⠀⠀⠀⠀`", "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ⠀⣴⠿⠏⠀⠀⠀⠀   ⠀  ⠀⢳⡀⠀⡏⠀⠀       ⢷\n⢠⣟⣋⡀⢀⣀⣀⡀⠀⣀⡀   ⣧⠀⢸⠀  ⠀       ⡇\n⢸⣯⡭⠁⠸⣛⣟⠆⡴⣻⡲   ⣿  ⣸   Queen   ⡇\n ⣟⣿⡭⠀⠀⠀⠀⠀⢱⠀       ⣿  ⢹⠀           ⡇\n  ⠙⢿⣯⠄⠀⠀Bot⠀   ⡿ ⠀⡇⠀⠀⠀⠀   ⡼\n⠀⠀⠀⠹⣶⠆⠀⠀⠀⠀⠀  ⡴⠃⠀   ⠘⠤⣄⣠⠞⠀\n⠀⠀⠀⠀⢸⣷⡦⢤⡤⢤⣞⣁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⢀⣤⣴⣿⣏⠁⠀⠀⠸⣏⢯⣷⣖⣦⡀⠀⠀⠀⠀⠀⠀\n⢀⣾⣽⣿⣿⣿⣿⠛⢲⣶⣾⢉⡷⣿⣿⠵⣿⠀⠀⠀⠀⠀⠀\n⣼⣿⠍⠉⣿⡭⠉⠙⢺⣇⣼⡏⠀⠀ ⠀⣄⢸⠀"];
    for (const _0x77af75 of _0x1c80f3) {
      await new Promise(_0x40d3fb => setTimeout(_0x40d3fb, 0x5dc));
      await _0x125191.relayMessage(_0x3ae285, {
        'protocolMessage': {
          'key': _0x19567b.key,
          'type': 0xe,
          'editedMessage': {
            'conversation': _0x77af75
          }
        }
      }, {});
    }
  } catch (_0x61a6ba) {
    console.log(_0x61a6ba);
    _0x30a5f5("❌ *Error!* " + _0x61a6ba.message);
  }
});

const _0x235552 = {
  'pattern': 'joinr',
  'desc': "Get list of participants who requested to join the group",
  'react': '📋',
  'category': 'group',
  'filename': __filename
};
cmd(_0x235552, async (_0x5627f6, _0x3c9922, _0x196741, {
  from: _0x152438,
  q: _0x5b5aa4,
  reply: _0x56da10,
  isGroup: _0x163e8c
}) => {
  if (!_0x163e8c) {
    return _0x56da10("This command can only be used in a group chat.");
  }
  try {
    console.log("Attempting to fetch pending requests for group: " + _0x152438);
    const _0x1cec50 = await _0x5627f6.groupRequestParticipantsList(_0x152438);
    console.log(_0x1cec50);
    if (_0x1cec50.length > 0x0) {
      let _0x23374c = "Pending Requests to Join the Group:\n";
      let _0x17317a = [];
      _0x1cec50.forEach(_0x5e1d24 => {
        const _0x35ec96 = _0x5e1d24.jid;
        _0x23374c += "😻 @" + _0x35ec96.split('@')[0x0] + "\n";
        _0x17317a.push(_0x35ec96);
      });
      const _0x3d4716 = {
        'text': _0x23374c,
        'mentions': _0x17317a
      };
      await _0x5627f6.sendMessage(_0x152438, _0x3d4716);
    } else {
      _0x56da10("No pending requests to join the group.");
    }
  } catch (_0x4cac9e) {
    console.error("Error fetching participant requests: " + _0x4cac9e.message);
    _0x56da10("⚠️ An error occurred while fetching the pending requests. Please try again later.");
  }
});
const _0x485005 = {
  'pattern': "allreq",
  'desc': "Approve or reject all join requests",
  'react': '✅',
  'category': "group",
  'filename': __filename
};
cmd(_0x485005, async (_0x49ae26, _0xcdfa27, _0x2d27f9, {
  from: _0x249d9d,
  reply: _0x2c52c1,
  isGroup: _0x303374
}) => {
  if (!_0x303374) {
    return _0x2c52c1("This command can only be used in a group chat.");
  }
  const _0x5e0937 = _0x2d27f9.body.includes("approve") ? "approve" : "reject";
  try {
    const _0x495e05 = await _0x49ae26.groupRequestParticipantsList(_0x249d9d);
    if (_0x495e05.length === 0x0) {
      return _0x2c52c1("There are no pending requests to manage.");
    }
    let _0x1b4d8b = "Pending Requests to Join the Group:\n";
    let _0x5bd4ee = [];
    let _0x701413 = [];
    _0x495e05.forEach(_0x2e9edd => {
      const _0x17c569 = _0x2e9edd.jid;
      _0x1b4d8b += "😻 @" + _0x17c569.split('@')[0x0] + "\n";
      _0x5bd4ee.push(_0x17c569);
      _0x701413.push(_0x17c569);
    });
    const _0x56c60b = {
      'text': _0x1b4d8b,
      'mentions': _0x5bd4ee
    };
    await _0x49ae26.sendMessage(_0x249d9d, _0x56c60b);
    const _0x40e74d = await _0x49ae26.groupRequestParticipantsUpdate(_0x249d9d, _0x701413, _0x5e0937);
    console.log(_0x40e74d);
    _0x2c52c1("Successfully " + _0x5e0937 + "ed all join requests.");
  } catch (_0x2a4b2c) {
    console.error("Error updating participant requests: " + _0x2a4b2c.message);
    _0x2c52c1("⚠️ An error occurred while processing the request. Please try again later.");
  }
});
const _0x3bcce0 = {
  'pattern': "disappear",
  'react': "🌪️",
  'alias': ['dm'],
  'desc': "Turn on/off disappearing messages.",
  'category': "main",
  'filename': __filename
};
cmd(_0x3bcce0, async (_0x4981f9, _0x1ac44e, _0x59ef0d, {
  from: _0xde58d3,
  isGroup: _0x3ea2c4,
  isAdmins: _0x5aae90,
  args: _0x17b0ab
}) => {
  if (!_0x3ea2c4) {
    const _0x3038c7 = {
      'text': "This command can only be used in groups."
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x3038c7);
    return;
  }
  if (!_0x5aae90) {
    const _0x19d9ef = {
      'text': "Only admins can turn on/off disappearing messages."
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x19d9ef);
    return;
  }
  const _0x2c3dbc = _0x17b0ab[0x0];
  if (_0x2c3dbc === 'on') {
    const _0x1d6174 = _0x17b0ab[0x1];
    let _0x1de4ca;
    switch (_0x1d6174) {
      case "24h":
        _0x1de4ca = 0x15180;
        break;
      case '7d':
        _0x1de4ca = 0x93a80;
        break;
      case "90d":
        _0x1de4ca = 0x76a700;
        break;
      default:
        const _0x497298 = {
          'text': "Invalid duration! Use `24h`, `7d`, or `90d`."
        };
        await _0x4981f9.sendMessage(_0xde58d3, _0x497298);
        return;
    }
    const _0x18601c = {
      'disappearingMessagesInChat': _0x1de4ca
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x18601c);
    const _0x4b59f0 = {
      'text': "Disappearing messages are now ON for " + _0x1d6174 + '.'
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x4b59f0);
  } else {
    if (_0x2c3dbc === "off") {
      const _0x5951ff = {
        'disappearingMessagesInChat': false
      };
      await _0x4981f9.sendMessage(_0xde58d3, _0x5951ff);
      const _0x3b5871 = {
        'text': "Disappearing messages are now OFF."
      };
      await _0x4981f9.sendMessage(_0xde58d3, _0x3b5871);
    } else {
      const _0x957b6e = {
        'text': "Please use `!disappear on <duration>` or `!disappear off`."
      };
      await _0x4981f9.sendMessage(_0xde58d3, _0x957b6e);
    }
  }
});
const _0x592aaf = {
  'pattern': "senddm",
  'react': "🌪️",
  'alias': ["senddisappear"],
  'desc': "Send a disappearing message.",
  'category': "main",
  'filename': __filename
};
cmd(_0x592aaf, async (_0x43277d, _0x49a4bf, _0x1a9eee, {
  from: _0x4121e3,
  isGroup: _0x130587,
  isAdmins: _0x1f5a32,
  args: _0x59db09
}) => {
  if (!_0x130587) {
    const _0x3db64e = {
      'text': "This command can only be used in groups."
    };
    await _0x43277d.sendMessage(_0x4121e3, _0x3db64e);
    return;
  }
  if (!_0x59db09.length) {
    const _0xab756b = {
      'text': "Please provide a message to send."
    };
    await _0x43277d.sendMessage(_0x4121e3, _0xab756b);
    return;
  }
  const _0x378c1a = _0x59db09.join(" ");
  const _0x57700b = {
    'text': _0x378c1a
  };
  const _0x236fb8 = {
    'ephemeralExpiration': 0x93a80
  };
  await _0x43277d.sendMessage(_0x4121e3, _0x57700b, _0x236fb8);
});
const _0x4f6b5b = {
  'pattern': 'mute',
  'react': '🔇',
  'alias': ["close", "f_mute"],
  'desc': "Change to group settings to only admins can send messages.",
  'category': "group",
  'use': '.mute',
  'filename': __filename
};
cmd(_0x4f6b5b, async (_0x1db32, _0x1034bb, _0x25ca2a, {
  from: _0x3eb37e,
  l: _0xb9c9be,
  quoted: _0x29d293,
  body: _0x2db992,
  isCmd: _0x500c26,
  command: _0x4fc99e,
  args: _0x59c2e4,
  q: _0x8908a8,
  isGroup: _0x5b1d5a,
  sender: _0x1a5d9d,
  senderNumber: _0x403beb,
  botNumber2: _0x2649be,
  botNumber: _0x357b82,
  pushname: _0x46f320,
  isMe: _0x2189c8,
  isOwner: _0x404021,
  groupMetadata: _0x501cc6,
  groupName: _0x29b9be,
  participants: _0x3bf764,
  groupAdmins: _0x23192c,
  isBotAdmins: _0x3113e1,
  isCreator: _0x3a14cd,
  isDev: _0x536689,
  isAdmins: _0x183163,
  reply: _0x58a333
}) => {
  try {
    const _0x500a97 = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
    if (!_0x5b1d5a) {
      return _0x58a333(_0x500a97.only_gp);
    }
    if (!_0x183163) {
      const _0x2f558f = {
        'quoted': _0x1034bb
      };
      if (!_0x536689) {
        _0x58a333(_0x500a97.you_adm);
        return _0x2f558f;
      }
    }
    if (!_0x3113e1) {
      return _0x58a333(_0x500a97.give_adm);
    }
    await _0x1db32.groupSettingUpdate(_0x3eb37e, 'announcement');
    const _0x36519b = {
      'text': "*Group Chat closed by Admin " + _0x46f320 + "* 🔇"
    };
    const _0x4744ef = {
      'quoted': _0x1034bb
    };
    await _0x1db32.sendMessage(_0x3eb37e, _0x36519b, _0x4744ef);
  } catch (_0xa7a872) {
    const _0x521c5e = {
      'text': '❌',
      'key': _0x1034bb.key
    };
    const _0x2837a2 = {
      'react': _0x521c5e
    };
    await _0x1db32.sendMessage(_0x3eb37e, _0x2837a2);
    console.log(_0xa7a872);
    _0x58a333("❌ *Error Accurated !!*\n\n" + _0xa7a872);
  }
});
const _0x87e572 = {
  'pattern': 'unmute',
  'react': '🔇',
  'alias': ["open", 'f_unmute'],
  'desc': "Change to group settings to all members can send messages.",
  'category': "group",
  'use': ".unmute",
  'filename': __filename
};
cmd(_0x87e572, async (_0x25e894, _0x173e12, _0x5cc272, {
  from: _0xeeb31b,
  l: _0x58264a,
  quoted: _0x81dda4,
  body: _0x2ccf26,
  isCmd: _0x2347d3,
  command: _0x42a3e4,
  args: _0x5a986a,
  q: _0x1dfbee,
  isGroup: _0x2d3d91,
  sender: _0x4f63db,
  senderNumber: _0x2d4d48,
  botNumber2: _0x1577ce,
  botNumber: _0x210cd0,
  pushname: _0x165f81,
  isMe: _0x296039,
  isOwner: _0x486497,
  groupMetadata: _0x2b0178,
  groupName: _0x5317ab,
  participants: _0x1138a8,
  groupAdmins: _0x4ec8e3,
  isBotAdmins: _0x351607,
  isCreator: _0x353ee1,
  isDev: _0x41f549,
  isAdmins: _0x5bcb46,
  reply: _0x3b61c9
}) => {
  try {
    const _0x132ae2 = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
    if (!_0x2d3d91) {
      return _0x3b61c9(_0x132ae2.only_gp);
    }
    if (!_0x5bcb46) {
      const _0x48b9a1 = {
        'quoted': _0x173e12
      };
      if (!_0x41f549) {
        _0x3b61c9(_0x132ae2.you_adm);
        return _0x48b9a1;
      }
    }
    if (!_0x351607) {
      return _0x3b61c9(_0x132ae2.give_adm);
    }
    await _0x25e894.groupSettingUpdate(_0xeeb31b, "not_announcement");
    const _0x37b570 = {
      'text': "*Group Chat Opened by Admin " + _0x165f81 + "* 🔇"
    };
    const _0xfed4bb = {
      'quoted': _0x173e12
    };
    await _0x25e894.sendMessage(_0xeeb31b, _0x37b570, _0xfed4bb);
  } catch (_0x23da8f) {
    const _0x2c4198 = {
      'text': '❌',
      'key': _0x173e12.key
    };
    const _0x3d6c71 = {
      'react': _0x2c4198
    };
    await _0x25e894.sendMessage(_0xeeb31b, _0x3d6c71);
    console.log(_0x23da8f);
    _0x3b61c9("❌ *Error Accurated !!*\n\n" + _0x23da8f);
  }
});
const _0x2bff43 = {
  'pattern': "lockgs",
  'react': '🔇',
  'alias': ["lockgsettings"],
  'desc': "Change to group settings to only admins can edit group info",
  'category': "group",
  'use': '.lockgs',
  'filename': __filename
};
cmd(_0x2bff43, async (_0x1544c8, _0x3a8967, _0x3a98a6, {
  from: _0x498d74,
  l: _0x242d02,
  quoted: _0x36365b,
  body: _0x6eab77,
  isCmd: _0x304a8f,
  command: _0x354db8,
  args: _0x3c3dde,
  q: _0x2751b9,
  isGroup: _0x3469a1,
  sender: _0x2a2cfe,
  senderNumber: _0x5ba54c,
  botNumber2: _0x13db3b,
  botNumber: _0x147018,
  pushname: _0x4a7385,
  isMe: _0x58cf74,
  isOwner: _0x4b72ad,
  groupMetadata: _0x2e602b,
  groupName: _0x4814c6,
  participants: _0x50dfe6,
  groupAdmins: _0x4e1045,
  isBotAdmins: _0x50a963,
  isCreator: _0x4d04a5,
  isDev: _0x21193e,
  isAdmins: _0x3d7529,
  reply: _0x5ed333
}) => {
  try {
    const _0x1039b6 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x3469a1) {
      return _0x5ed333(_0x1039b6.only_gp);
    }
    if (!_0x3d7529) {
      const _0x155d21 = {
        'quoted': _0x3a8967
      };
      if (!_0x21193e) {
        _0x5ed333(_0x1039b6.you_adm);
        return _0x155d21;
      }
    }
    if (!_0x50a963) {
      return _0x5ed333(_0x1039b6.give_adm);
    }
    await _0x1544c8.groupSettingUpdate(_0x498d74, 'locked');
    const _0x5db9eb = {
      'text': "*Group Settings Locked* 🔒\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*"
    };
    const _0x3d6f8d = {
      'quoted': _0x3a8967
    };
    await _0x1544c8.sendMessage(_0x498d74, _0x5db9eb, _0x3d6f8d);
  } catch (_0x16dbea) {
    const _0x8a66fe = {
      'text': '❌',
      'key': _0x3a8967.key
    };
    const _0x5d8236 = {
      'react': _0x8a66fe
    };
    await _0x1544c8.sendMessage(_0x498d74, _0x5d8236);
    console.log(_0x16dbea);
    _0x5ed333("❌ *Error Accurated !!*\n\n" + _0x16dbea);
  }
});
const _0x285abb = {
  'pattern': 'unlockgs',
  'react': '🔓',
  'alias': ['unlockgsettings'],
  'desc': "Change to group settings to all members can edit group info",
  'category': 'group',
  'use': '.unlockgs',
  'filename': __filename
};
cmd(_0x285abb, async (_0x5b301d, _0x3b7b70, _0x2cc26e, {
  from: _0x4d3c01,
  l: _0x176622,
  quoted: _0x37c3f2,
  body: _0x3fbb36,
  isCmd: _0x51482e,
  command: _0xd3f200,
  args: _0x509332,
  q: _0x44f8fa,
  isGroup: _0x1e2ad3,
  sender: _0x41c2a2,
  senderNumber: _0x53d357,
  botNumber2: _0x29bf53,
  botNumber: _0x2a719b,
  pushname: _0x4d9f7c,
  isMe: _0x3aee0d,
  isOwner: _0x71e650,
  groupMetadata: _0xe73a5f,
  groupName: _0x2f6917,
  participants: _0x43c59f,
  groupAdmins: _0x3d8f6f,
  isBotAdmins: _0x3d74ba,
  isCreator: _0x414dbd,
  isDev: _0x2c354b,
  isAdmins: _0xff1420,
  reply: _0xbc1d4c
}) => {
  try {
    const _0x5091d1 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x1e2ad3) {
      return _0xbc1d4c(_0x5091d1.only_gp);
    }
    if (!_0xff1420) {
      const _0x1f11d9 = {
        'quoted': _0x3b7b70
      };
      if (!_0x2c354b) {
        _0xbc1d4c(_0x5091d1.you_adm);
        return _0x1f11d9;
      }
    }
    if (!_0x3d74ba) {
      return _0xbc1d4c(_0x5091d1.give_adm);
    }
    await _0x5b301d.groupSettingUpdate(_0x4d3c01, "unlocked");
    const _0x53e034 = {
      'text': "*Group settings Unlocked* 🔓\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*"
    };
    const _0x3fc266 = {
      'quoted': _0x3b7b70
    };
    await _0x5b301d.sendMessage(_0x4d3c01, _0x53e034, _0x3fc266);
  } catch (_0x3b7c9f) {
    const _0x371437 = {
      'text': '❌',
      'key': _0x3b7b70.key
    };
    const _0x37fa5b = {
      'react': _0x371437
    };
    await _0x5b301d.sendMessage(_0x4d3c01, _0x37fa5b);
    console.log(_0x3b7c9f);
    _0xbc1d4c("❌ *Error Accurated !!*\n\n" + _0x3b7c9f);
  }
});
const _0x2ad4fd = {
  'pattern': "left",
  'react': '🔓',
  'alias': ["leftme", "remove", 'nnnnn', "ppppppppopo", "ttttttttttttttttt"],
  'desc': "To leave from the group",
  'category': "group",
  'use': ".kuch nahi",
  'filename': __filename
};
cmd(_0x2ad4fd, async (_0x57ca03, _0x3887fa, _0x4fce7e, {
  from: _0xc68888,
  l: _0x1282e3,
  quoted: _0x57ed20,
  body: _0x10f606,
  isCmd: _0xe8fc04,
  command: _0x1a8e92,
  args: _0x4f8537,
  q: _0xdfea9b,
  isGroup: _0x4a4781,
  sender: _0x365a0c,
  senderNumber: _0x46d54a,
  botNumber2: _0x3be42d,
  botNumber: _0x5463fe,
  pushname: _0xb5c3cd,
  isMe: _0xca9405,
  isOwner: _0x3d58af,
  groupMetadata: _0x160843,
  groupName: _0x4b3e84,
  participants: _0x2c85cd,
  groupAdmins: _0x5d97cf,
  isBotAdmins: _0x25501b,
  isCreator: _0x50edb5,
  isDev: _0x23245,
  isAdmins: _0x237aa4,
  reply: _0x4da4af
}) => {
  try {
    const _0x21c4f5 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x4a4781) {
      return _0x4da4af(_0x21c4f5.only_gp);
    }
    if (!_0x237aa4) {
      if (!_0x23245) {
        return _0x4da4af(_0x21c4f5.you_adm);
      }
    }
    const _0x51bec9 = {
      'text': "*𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 𝐁𝐎𝐓 Left This Group*\n\n_Good Bye All💗🥺👋_"
    };
    const _0x57034a = {
      'quoted': _0x3887fa
    };
    await _0x57ca03.sendMessage(_0xc68888, _0x51bec9, _0x57034a);
    await _0x57ca03.groupLeave(_0xc68888);
  } catch (_0x2f90a5) {
    const _0x3b1e22 = {
      'text': '❌',
      'key': _0x3887fa.key
    };
    const _0x342f73 = {
      'react': _0x3b1e22
    };
    await _0x57ca03.sendMessage(_0xc68888, _0x342f73);
    console.log(_0x2f90a5);
    _0x4da4af("❌ *Error Accurated !!*\n\n" + _0x2f90a5);
  }
});
const _0x293215 = {
  'pattern': "updategname",
  'react': '🔓',
  'alias': ["upgname", 'gname'],
  'desc': "To Change the group name",
  'category': 'group',
  'use': '.updategname',
  'filename': __filename
};
cmd(_0x293215, async (_0x2aa48a, _0x3602cd, _0x1cbce2, {
  from: _0x45ad08,
  l: _0xa090a9,
  quoted: _0x140510,
  body: _0xd8ae2d,
  isCmd: _0x437e3b,
  command: _0x40ca0c,
  args: _0x41b4fb,
  q: _0x48b32f,
  isGroup: _0x3c8a42,
  sender: _0x2d52ff,
  senderNumber: _0x326df8,
  botNumber2: _0x376078,
  botNumber: _0x336b9f,
  pushname: _0x566409,
  isMe: _0x77a2fd,
  isOwner: _0x281739,
  groupMetadata: _0x26008d,
  groupName: _0x133a26,
  participants: _0x355c6d,
  groupAdmins: _0x3307cd,
  isBotAdmins: _0x21be18,
  isCreator: _0x1f3260,
  isDev: _0x67bfd1,
  isAdmins: _0x41f9b9,
  reply: _0x5a7586
}) => {
  try {
    const _0x14b230 = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
    if (!_0x3c8a42) {
      return _0x5a7586(_0x14b230.only_gp);
    }
    if (!_0x41f9b9) {
      const _0x4d9f16 = {
        'quoted': _0x3602cd
      };
      if (!_0x67bfd1) {
        _0x5a7586(_0x14b230.you_adm);
        return _0x4d9f16;
      }
    }
    if (!_0x21be18) {
      return _0x5a7586(_0x14b230.give_adm);
    }
    if (!_0x48b32f) {
      return _0x5a7586("*Please write the new Group Subject* 🖊️");
    }
    await _0x2aa48a.groupUpdateSubject(_0x45ad08, _0x48b32f);
    const _0x2b8140 = {
      'text': "✔️ *Group name Updated*"
    };
    const _0x51ea6e = {
      'quoted': _0x3602cd
    };
    await _0x2aa48a.sendMessage(_0x45ad08, _0x2b8140, _0x51ea6e);
  } catch (_0x34ae8f) {
    const _0x2bfcde = {
      'text': '❌',
      'key': _0x3602cd.key
    };
    const _0x1de2ed = {
      'react': _0x2bfcde
    };
    await _0x2aa48a.sendMessage(_0x45ad08, _0x1de2ed);
    console.log(_0x34ae8f);
    _0x5a7586("❌ *Error Accurated !!*\n\n" + _0x34ae8f);
  }
});
const _0x19cdd8 = {
  'pattern': "updategdesc",
  'react': '🔓',
  'alias': ['upgdesc', "gdesc"],
  'desc': "To Change the group description",
  'category': "group",
  'use': ".updategdesc",
  'filename': __filename
};
cmd(_0x19cdd8, async (_0x3b5d59, _0x500dad, _0xdfb924, {
  from: _0x516246,
  l: _0x19ec9a,
  quoted: _0x1819d0,
  body: _0x30fdcc,
  isCmd: _0x515c22,
  command: _0x1fd1cd,
  args: _0x4e0bf3,
  q: _0x556f9f,
  isGroup: _0x13d490,
  sender: _0x1df8c1,
  senderNumber: _0x3a2430,
  botNumber2: _0x220610,
  botNumber: _0x591fe3,
  pushname: _0x2b36ae,
  isMe: _0x606490,
  isOwner: _0x526323,
  groupMetadata: _0x384f6d,
  groupName: _0x5f5794,
  participants: _0x264fd2,
  groupAdmins: _0xba3383,
  isBotAdmins: _0x3cae00,
  isCreator: _0x502deb,
  isDev: _0x50102c,
  isAdmins: _0x504a32,
  reply: _0x2d0d35
}) => {
  try {
    const _0x22a47e = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x13d490) {
      return _0x2d0d35(_0x22a47e.only_gp);
    }
    if (!_0x504a32) {
      const _0x16afa8 = {
        'quoted': _0x500dad
      };
      if (!_0x50102c) {
        _0x2d0d35(_0x22a47e.you_adm);
        return _0x16afa8;
      }
    }
    if (!_0x3cae00) {
      return _0x2d0d35(_0x22a47e.give_adm);
    }
    if (!_0x556f9f) {
      return _0x2d0d35("*Please write the new Group Description* 🖊️");
    }
    await _0x3b5d59.groupUpdateDescription(_0x516246, _0x556f9f);
    const _0x49e14d = {
      'text': "✔️ *Group Description Updated*"
    };
    const _0x543531 = {
      'quoted': _0x500dad
    };
    await _0x3b5d59.sendMessage(_0x516246, _0x49e14d, _0x543531);
  } catch (_0x57cb62) {
    const _0x31e856 = {
      'text': '❌',
      'key': _0x500dad.key
    };
    const _0x308db1 = {
      'react': _0x31e856
    };
    await _0x3b5d59.sendMessage(_0x516246, _0x308db1);
    console.log(_0x57cb62);
    _0x2d0d35("❌ *Error Accurated !!*\n\n" + _0x57cb62);
  }
});
const _0x53f490 = {
  'pattern': "join",
  'react': '📬',
  'alias': ["joinme", "f_join"],
  'desc': "To Join a Group from Invite link",
  'category': "group",
  'use': ".join < Group Link >",
  'filename': __filename
};
cmd(_0x53f490, async (_0x47c9d7, _0x35ca33, _0x4e5ffe, {
  from: _0x15bbf1,
  l: _0x2b246e,
  quoted: _0x439d00,
  body: _0x12d064,
  isCmd: _0x5bd4dd,
  command: _0x1d9eb2,
  args: _0x283da0,
  q: _0x1f1cc7,
  isGroup: _0x456f2e,
  sender: _0x2595cc,
  senderNumber: _0x53fe6b,
  botNumber2: _0x1fe6e4,
  botNumber: _0x4d1c42,
  pushname: _0x3c2ff7,
  isMe: _0x39e0e1,
  isOwner: _0x55939f,
  groupMetadata: _0x55d05e,
  groupName: _0xe82872,
  participants: _0x5b2e7d,
  groupAdmins: _0x84a5f3,
  isBotAdmins: _0x5ee4f7,
  isCreator: _0x571c2f,
  isDev: _0x29ee1,
  isAdmins: _0x19b4d1,
  reply: _0x12d263
}) => {
  try {
    const _0x12bb44 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x571c2f && !_0x29ee1 && !_0x55939f && !_0x39e0e1) {
      return _0x12d263(_0x12bb44.own_cmd);
    }
    if (!_0x1f1cc7) {
      return _0x12d263("*Please write the Group Link*️ 🖇️");
    }
    let _0x28e07b = _0x283da0[0x0].split('https://chat.whatsapp.com/')[0x1];
    await _0x47c9d7.groupAcceptInvite(_0x28e07b);
    const _0x3f0d45 = {
      'text': "✔️ *Successfully Joined*"
    };
    const _0x2e8dca = {
      'quoted': _0x35ca33
    };
    await _0x47c9d7.sendMessage(_0x15bbf1, _0x3f0d45, _0x2e8dca);
  } catch (_0x39c9f4) {
    const _0x2dd285 = {
      'text': '❌',
      'key': _0x35ca33.key
    };
    const _0x172b23 = {
      'react': _0x2dd285
    };
    await _0x47c9d7.sendMessage(_0x15bbf1, _0x172b23);
    console.log(_0x39c9f4);
    _0x12d263("❌ *Error Accurated !!*\n\n" + _0x39c9f4);
  }
});
const _0x4df201 = {
  'pattern': "invite",
  'react': "🖇️",
  'alias': ['grouplink', "glink","link"],
  'desc': "To Get the Group Invite link",
  'category': "group",
  'use': ".invite",
  'filename': __filename
};
cmd(_0x4df201, async (_0x5ca0b3, _0x1d2aac, _0x5ae3b9, {
  from: _0x17b97f,
  l: _0x320435,
  quoted: _0x32016d,
  body: _0x2afdd5,
  isCmd: _0x226900,
  command: _0x155d31,
  args: _0x29a67f,
  q: _0x4862f2,
  isGroup: _0x2e5d88,
  sender: _0x253057,
  senderNumber: _0x461579,
  botNumber2: _0x2dcc66,
  botNumber: _0x3dac62,
  pushname: _0x46651c,
  isMe: _0x43878c,
  isOwner: _0x2db519,
  groupMetadata: _0x5ccd53,
  groupName: _0x142c7c,
  participants: _0x457d22,
  groupAdmins: _0x27605d,
  isBotAdmins: _0x29764e,
  isCreator: _0x27414b,
  isDev: _0x7de5ca,
  isAdmins: _0x3f2992,
  reply: _0x4b7e40
}) => {
  try {
    const _0x5ab1ee = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x2e5d88) {
      return _0x4b7e40(_0x5ab1ee.only_gp);
    }
    if (!_0x3f2992) {
      const _0x1ff13e = {
        'quoted': _0x1d2aac
      };
      if (!_0x7de5ca) {
        _0x4b7e40(_0x5ab1ee.you_adm);
        return _0x1ff13e;
      }
    }
    if (!_0x29764e) {
      return _0x4b7e40(_0x5ab1ee.give_adm);
    }
    const _0x191ef8 = await _0x5ca0b3.groupInviteCode(_0x17b97f);
    const _0x29587e = {
      'text': "🖇️ *Group Link*\n\nhttps://chat.whatsapp.com/" + _0x191ef8
    };
    const _0x125136 = {
      'quoted': _0x1d2aac
    };
    await _0x5ca0b3.sendMessage(_0x17b97f, _0x29587e, _0x125136);
  } catch (_0x63c156) {
    const _0x476c01 = {
      'text': '❌',
      'key': _0x1d2aac.key
    };
    const _0x537f80 = {
      'react': _0x476c01
    };
    await _0x5ca0b3.sendMessage(_0x17b97f, _0x537f80);
    console.log(_0x63c156);
    _0x4b7e40("❌ *Error Accurated !!*\n\n" + _0x63c156);
  }
});
const _0x34bd2a = {
  'pattern': "revoke",
  'react': "🖇️",
  'alias': ["revokegrouplink", "resetglink", "revokelink", "f_revoke"],
  'desc': "To Reset the group link",
  'category': 'group',
  'use': '.revoke',
  'filename': __filename
};
cmd(_0x34bd2a, async (_0xd64721, _0x5b20b2, _0x2bf8dd, {
  from: _0x2a4c3b,
  l: _0x38cd01,
  quoted: _0x207ad7,
  body: _0x523130,
  isCmd: _0x7343fe,
  command: _0x288b13,
  args: _0x4157cf,
  q: _0x250059,
  isGroup: _0x7863dd,
  sender: _0x92a6a8,
  senderNumber: _0x2fee70,
  botNumber2: _0x238294,
  botNumber: _0x549be0,
  pushname: _0x302895,
  isMe: _0x6e68f8,
  isOwner: _0xffeee0,
  groupMetadata: _0xe2b0b4,
  groupName: _0x18bb6f,
  participants: _0x527bd5,
  groupAdmins: _0xd1b113,
  isBotAdmins: _0x242d35,
  isCreator: _0x2dd9e1,
  isDev: _0x4361df,
  isAdmins: _0x2050dd,
  reply: _0x1ae877
}) => {
  try {
    const _0x5ba157 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x7863dd) {
      return _0x1ae877(_0x5ba157.only_gp);
    }
    if (!_0x2050dd) {
      const _0x166031 = {
        'quoted': _0x5b20b2
      };
      if (!_0x4361df) {
        _0x1ae877(_0x5ba157.you_adm);
        return _0x166031;
      }
    }
    if (!_0x242d35) {
      return _0x1ae877(_0x5ba157.give_adm);
    }
    await _0xd64721.groupRevokeInvite(_0x2a4c3b);
    const _0x56209b = {
      'text': "*Group link Reseted* ⛔"
    };
    const _0x3abb77 = {
      'quoted': _0x5b20b2
    };
    await _0xd64721.sendMessage(_0x2a4c3b, _0x56209b, _0x3abb77);
  } catch (_0x1d9b7d) {
    const _0x11ba01 = {
      'text': '❌',
      'key': _0x5b20b2.key
    };
    const _0x1c73fc = {
      'react': _0x11ba01
    };
    await _0xd64721.sendMessage(_0x2a4c3b, _0x1c73fc);
    console.log(_0x1d9b7d);
    _0x1ae877("❌ *Error Accurated !!*\n\n" + _0x1d9b7d);
  }
});
const _0x57538f = {
  'pattern': "kick",
  'react': '🥏',
  'alias': ["remove"],
  'desc': "To Remove a participant from Group",
  'category': "group",
  'use': ".kick",
  'filename': __filename
};
cmd(_0x57538f, async (_0xdf818e, _0xa69965, _0x290fe5, {
  from: _0x277530,
  l: _0x1424d7,
  quoted: _0xc99b4e,
  body: _0x5195f3,
  isCmd: _0x1a81a4,
  command: _0x1ee878,
  mentionByTag: _0x383b10,
  args: _0x2e0664,
  q: _0x3bfd97,
  isGroup: _0x2af926,
  sender: _0x4ff03c,
  senderNumber: _0x374722,
  botNumber2: _0x5e6e97,
  botNumber: _0x28b955,
  pushname: _0x511cf4,
  isMe: _0x59c181,
  isOwner: _0x3fc01d,
  groupMetadata: _0xfdebc1,
  groupName: _0x4f1621,
  participants: _0x45edd7,
  groupAdmins: _0x91732c,
  isBotAdmins: _0x54a5f9,
  isCreator: _0x32ceb6,
  isDev: _0x58a57b,
  isAdmins: _0x5ad85f,
  reply: _0x3823f7
}) => {
  try {
    const _0x10dd83 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x2af926) {
      return _0x3823f7(_0x10dd83.only_gp);
    }
    if (!_0x5ad85f) {
      const _0x5787bc = {
        'quoted': _0xa69965
      };
      if (!_0x58a57b) {
        _0x3823f7(_0x10dd83.you_adm);
        return _0x5787bc;
      }
    }
    if (!_0x54a5f9) {
      return _0x3823f7(_0x10dd83.give_adm);
    }
    let _0x1bed6a = _0xa69965.mentionedJid ? _0xa69965.mentionedJid[0x0] : _0xa69965.msg.contextInfo.participant || false;
    if (!_0x1bed6a) {
      return _0x3823f7("*Couldn't find any user in context* ❌");
    }
    await _0xdf818e.groupParticipantsUpdate(_0x277530, [_0x1bed6a], "remove");
    const _0x46ed61 = {
      'text': "*Successfully removed*  ✔️"
    };
    const _0x281eec = {
      'quoted': _0xa69965
    };
    await _0xdf818e.sendMessage(_0x277530, _0x46ed61, _0x281eec);
  } catch (_0x5212f6) {
    const _0x310822 = {
      'text': '❌',
      'key': _0xa69965.key
    };
    const _0x3053a8 = {
      'react': _0x310822
    };
    await _0xdf818e.sendMessage(_0x277530, _0x3053a8);
    console.log(_0x5212f6);
    _0x3823f7("❌ *Error Accurated !!*\n\n" + _0x5212f6);
  }
});
const _0xd699f4 = {
  'pattern': "promote",
  'react': '🥏',
  'alias': ["addadmin"],
  'desc': "To Add a participatant as a Admin",
  'category': 'group',
  'use': ".promote",
  'filename': __filename
};
cmd(_0xd699f4, async (_0x4924ea, _0x5010b3, _0x3c1d65, {
  from: _0x49e602,
  l: _0x33cb28,
  quoted: _0x5c131b,
  body: _0x56af54,
  isCmd: _0x2c4d1d,
  command: _0x5c9432,
  mentionByTag: _0x866e04,
  args: _0x21c205,
  q: _0xa50d6e,
  isGroup: _0x411587,
  sender: _0x343c09,
  senderNumber: _0x4205b9,
  botNumber2: _0x430b16,
  botNumber: _0x385106,
  pushname: _0x56aa61,
  isMe: _0xe7e204,
  isOwner: _0x30c7e8,
  groupMetadata: _0x3c38bf,
  groupName: _0x588879,
  participants: _0xe3d0b3,
  groupAdmins: _0x153505,
  isBotAdmins: _0x4091e7,
  isCreator: _0x22a9c2,
  isDev: _0x5d9c32,
  isAdmins: _0x233034,
  reply: _0x542673
}) => {
  try {
    const _0x4208b6 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x411587) {
      return _0x542673(_0x4208b6.only_gp);
    }
    if (!_0x233034) {
      const _0x30c355 = {
        'quoted': _0x5010b3
      };
      if (!_0x5d9c32) {
        _0x542673(_0x4208b6.you_adm);
        return _0x30c355;
      }
    }
    if (!_0x4091e7) {
      return _0x542673(_0x4208b6.give_adm);
    }
    let _0x43bdf3 = _0x5010b3.mentionedJid ? _0x5010b3.mentionedJid[0x0] : _0x5010b3.msg.contextInfo.participant || false;
    if (!_0x43bdf3) {
      return _0x542673("*Couldn't find any user in context* ❌");
    }
    const _0x58b5eb = await getGroupAdmins(_0xe3d0b3);
    if (_0x58b5eb.includes(_0x43bdf3)) {
      return _0x542673("❗ *User Already an Admin*  ✔️");
    }
    await _0x4924ea.groupParticipantsUpdate(_0x49e602, [_0x43bdf3], "promote");
    const _0x2a97e1 = {
      'text': "*User promoted as an Admin*  ✔️"
    };
    const _0x47980e = {
      'quoted': _0x5010b3
    };
    await _0x4924ea.sendMessage(_0x49e602, _0x2a97e1, _0x47980e);
  } catch (_0x3cdda4) {
    const _0x5d1425 = {
      'text': '❌',
      'key': _0x5010b3.key
    };
    const _0x183397 = {
      'react': _0x5d1425
    };
    await _0x4924ea.sendMessage(_0x49e602, _0x183397);
    console.log(_0x3cdda4);
    _0x542673("❌ *Error Accurated !!*\n\n" + _0x3cdda4);
  }
});
const _0x10f253 = {
  'pattern': "demote",
  'react': '🥏',
  'alias': ["removeadmin"],
  'desc': "To Demote Admin to Member",
  'category': "group",
  'use': ".demote",
  'filename': __filename
};
cmd(_0x10f253, async (_0x100559, _0x26bd3b, _0x19d9e3, {
  from: _0x23fa85,
  l: _0x5d6046,
  quoted: _0x2ccaeb,
  body: _0x5b3e9b,
  isCmd: _0x286195,
  command: _0x58a518,
  mentionByTag: _0x465dce,
  args: _0x37c9f5,
  q: _0x23caef,
  isGroup: _0x472133,
  sender: _0x4d20bd,
  senderNumber: _0x3dcd8c,
  botNumber2: _0x403a3e,
  botNumber: _0x543e39,
  pushname: _0x4f7e0c,
  isMe: _0x2a1784,
  isOwner: _0x1ec34f,
  groupMetadata: _0x26a272,
  groupName: _0xb5af0c,
  participants: _0x2d8ac7,
  groupAdmins: _0x2571d5,
  isBotAdmins: _0x270691,
  isCreator: _0x2c64c3,
  isDev: _0x795a5f,
  isAdmins: _0x576070,
  reply: _0x391013
}) => {
  try {
    const _0xaf2bbe = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x472133) {
      return _0x391013(_0xaf2bbe.only_gp);
    }
    if (!_0x576070) {
      const _0x15e5c1 = {
        'quoted': _0x26bd3b
      };
      if (!_0x795a5f) {
        _0x391013(_0xaf2bbe.you_adm);
        return _0x15e5c1;
      }
    }
    if (!_0x270691) {
      return _0x391013(_0xaf2bbe.give_adm);
    }
    let _0x4261f8 = _0x26bd3b.mentionedJid ? _0x26bd3b.mentionedJid[0x0] : _0x26bd3b.msg.contextInfo.participant || false;
    if (!_0x4261f8) {
      return _0x391013("*Couldn't find any user in context* ❌");
    }
    const _0xc25d0c = await getGroupAdmins(_0x2d8ac7);
    if (!_0xc25d0c.includes(_0x4261f8)) {
      return _0x391013("❗ *User Already not an Admin*");
    }
    await _0x100559.groupParticipantsUpdate(_0x23fa85, [_0x4261f8], "demote");
    const _0x3cd26a = {
      'text': "*User No longer an Admin*  ✔️"
    };
    const _0x59c923 = {
      'quoted': _0x26bd3b
    };
    await _0x100559.sendMessage(_0x23fa85, _0x3cd26a, _0x59c923);
  } catch (_0x29a8ff) {
    const _0x271890 = {
      'text': '❌',
      'key': _0x26bd3b.key
    };
    const _0x1d1d66 = {
      'react': _0x271890
    };
    await _0x100559.sendMessage(_0x23fa85, _0x1d1d66);
    console.log(_0x29a8ff);
    _0x391013("❌ *Error Accurated !!*\n\n" + _0x29a8ff);
  }
});
const _0x53a4af = {
  'pattern': "tagall",
  'react': '🔊',
  'alias': ["f_tagall"],
  'desc': "To Tag all Members",
  'category': "group",
  'use': ".tagall",
  'filename': __filename
};
cmd(_0x53a4af, async (_0x4b7a1c, _0x355fbd, _0xc06583, {
  from: _0x43cf50,
  l: _0x1274f4,
  quoted: _0x68b28c,
  body: _0x128cda,
  isCmd: _0x39b2e3,
  command: _0x4b97ec,
  mentionByTag: _0x17f382,
  args: _0x28acb9,
  q: _0x6f0c26,
  isGroup: _0x88d6b,
  sender: _0x57c54c,
  senderNumber: _0x17e523,
  botNumber2: _0x5bf942,
  botNumber: _0x5a4bfe,
  pushname: _0x5be918,
  isMe: _0x5d664d,
  isOwner: _0x5737c9,
  groupMetadata: _0x2e5eaa,
  groupName: _0x112cbc,
  participants: _0x31686b,
  groupAdmins: _0x3cb5d5,
  isBotAdmins: _0x24571c,
  isCreator: _0x2399d3,
  isDev: _0x8e90d9,
  isAdmins: _0x594511,
  reply: _0x40eeee
}) => {
  try {
    const _0x472cc7 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x88d6b) {
      return _0x40eeee(_0x472cc7.only_gp);
    }
    if (!_0x594511) {
      const _0x2411d9 = {
        'quoted': _0x355fbd
      };
      if (!_0x8e90d9) {
        _0x40eeee(_0x472cc7.you_adm);
        return _0x2411d9;
      }
    }
    if (!_0x24571c) {
      return _0x40eeee(_0x472cc7.give_adm);
    }
    let _0x345955 = "💱 *HI ALL ! GIVE YOUR ATTENTION PLEASE* \n \n";
    for (let _0x8937a1 of _0x31686b) {
      _0x345955 += "> ᴅᴇᴀʀ 🫂 @" + _0x8937a1.id.split('@')[0x0] + "\n";
    }
    const _0x9c4934 = {
      'quoted': _0x355fbd
    };
    _0x4b7a1c.sendMessage(_0x43cf50, {
      'text': _0x345955,
      'mentions': _0x31686b.map(_0x2f0953 => _0x2f0953.id)
    }, _0x9c4934);
  } catch (_0x511eaf) {
    const _0x3be813 = {
      'text': '❌',
      'key': _0x355fbd.key
    };
    const _0x11890d = {
      'react': _0x3be813
    };
    await _0x4b7a1c.sendMessage(_0x43cf50, _0x11890d);
    console.log(_0x511eaf);
    _0x40eeee("❌ *Error Accurated !!*\n\n" + _0x511eaf);
  }
});
const _0x3220aa = {
  'pattern': "hidetag",
  'react': '🔊',
  'alias': ["tag", "f_tag"],
  'desc': "To Tag all Members for Message",
  'category': "group",
  'use': ".tag Hi",
  'filename': __filename
};
cmd(_0x3220aa, async (_0x101a30, _0x3470bb, _0x2d7d33, {
  from: _0x58bb66,
  l: _0x1ca49f,
  quoted: _0x58edb8,
  body: _0x6e7c1,
  isCmd: _0x38ae4f,
  command: _0x48672f,
  mentionByTag: _0x5acb96,
  args: _0x1d6a92,
  q: _0x43f681,
  isGroup: _0x351100,
  sender: _0x3115eb,
  senderNumber: _0x145528,
  botNumber2: _0x59e71b,
  botNumber: _0x220e3e,
  pushname: _0x29f641,
  isMe: _0x47d4e3,
  isOwner: _0x82d151,
  groupMetadata: _0x58afad,
  groupName: _0xbeee21,
  participants: _0x5a381b,
  groupAdmins: _0x330d81,
  isBotAdmins: _0x24643c,
  isCreator: _0x4ed033,
  isDev: _0x2f2923,
  isAdmins: _0xbdcb4,
  reply: _0x3798d6
}) => {
  try {
    const _0x4a181e = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x351100) {
      return _0x3798d6(_0x4a181e.only_gp);
    }
    if (!_0xbdcb4) {
      const _0x206ddc = {
        'quoted': _0x3470bb
      };
      if (!_0x2f2923) {
        _0x3798d6(_0x4a181e.you_adm);
        return _0x206ddc;
      }
    }
    if (!_0x24643c) {
      return _0x3798d6(_0x4a181e.give_adm);
    }
    if (!_0x43f681) {
      return _0x3798d6("*Please add a Message* ℹ️");
    }
    let _0x5cbff2 = '' + _0x43f681;
    const _0x2515b9 = {
      'quoted': _0x3470bb
    };
    _0x101a30.sendMessage(_0x58bb66, {
      'text': _0x5cbff2,
      'mentions': _0x5a381b.map(_0x301d5f => _0x301d5f.id)
    }, _0x2515b9);
  } catch (_0xc17467) {
    const _0x275155 = {
      'text': '❌',
      'key': _0x3470bb.key
    };
    const _0x3a041e = {
      'react': _0x275155
    };
    await _0x101a30.sendMessage(_0x58bb66, _0x3a041e);
    console.log(_0xc17467);
    _0x3798d6("❌ *Error Accurated !!*\n\n" + _0xc17467);
  }
});
const _0x446ca7 = {
  'pattern': "tagx",
  'react': '🔊',
  'alias': ['taggc', 'mentionall'],
  'desc': "To Tag all Members for Message",
  'category': "group",
  'use': ".tag Hi",
  'filename': __filename
};
cmd(_0x446ca7, async (_0x4ccc2b, _0x46df43, _0x157a68, {
  from: _0x4a3586,
  l: _0x1849a7,
  quoted: _0x49f20b,
  body: _0x289938,
  isCmd: _0x387e0e,
  command: _0x1d628a,
  mentionByTag: _0x4afa07,
  args: _0x1c76ca,
  q: _0x1b7262,
  isGroup: _0x134b12,
  sender: _0x3ddba6,
  senderNumber: _0x435739,
  botNumber2: _0x67152b,
  botNumber: _0x1a2845,
  pushname: _0x5aef84,
  isMe: _0x2b7832,
  isOwner: _0x356f37,
  groupMetadata: _0x3fc316,
  groupName: _0x14b7ff,
  participants: _0x2f6187,
  groupAdmins: _0x3a1e2e,
  isBotAdmins: _0x252cf3,
  isCreator: _0x284fda,
  isDev: _0xab165f,
  isAdmins: _0x2ec0d4,
  reply: _0x4bdb4a
}) => {
  try {
    if (!_0x157a68.quoted) {
      return _0x4bdb4a("*Please mention a message* ℹ️");
    }
    if (!_0x1b7262) {
      return _0x4bdb4a("*Please add a Group Jid* ℹ️");
    }
    let _0x5c2939 = '' + _0x157a68.quoted.msg;
    const _0x1dc222 = {
      'quoted': _0x46df43
    };
    _0x4ccc2b.sendMessage(_0x1b7262, {
      'text': _0x5c2939,
      'mentions': _0x2f6187.map(_0x7b549a => _0x7b549a.id)
    }, _0x1dc222);
  } catch (_0x1589ce) {
    const _0x58dd2e = {
      'text': '❌',
      'key': _0x46df43.key
    };
    const _0x3ec251 = {
      'react': _0x58dd2e
    };
    await _0x4ccc2b.sendMessage(_0x4a3586, _0x3ec251);
    console.log(_0x1589ce);
    _0x4bdb4a("❌ *Error Accurated !!*\n\n" + _0x1589ce);
  }
});
const _0x4c04aa = {
  'pattern': 'ginfo',
  'react': '🥏',
  'alias': ["groupinfo"],
  'desc': "Get group informations.",
  'category': "group",
  'use': ".ginfo",
  'filename': __filename
};
cmd(_0x4c04aa, async (_0x231979, _0x12b151, _0x116356, {
  from: _0x2d7057,
  l: _0x1f51d6,
  quoted: _0xfa3403,
  body: _0x4b72e9,
  isCmd: _0x40eeb4,
  command: _0x3805b6,
  args: _0x261d7b,
  q: _0x2663b3,
  isGroup: _0x14a404,
  sender: _0x36a844,
  senderNumber: _0xc77a65,
  botNumber2: _0xeebe6c,
  botNumber: _0xd4f7c,
  pushname: _0x47d89f,
  isMe: _0x34e197,
  isOwner: _0x5aed14,
  groupMetadata: _0x4c2ba5,
  groupName: _0x3145fd,
  participants: _0x2ef24c,
  groupAdmins: _0x333eb7,
  isBotAdmins: _0x246965,
  isCreator: _0x2ddfa0,
  isDev: _0x3d31de,
  isAdmins: _0x680b41,
  reply: _0x4db5ec
}) => {
  try {
    const _0x181fef = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x14a404) {
      return _0x4db5ec(_0x181fef.only_gp);
    }
    if (!_0x680b41) {
      const _0x21957c = {
        'quoted': _0x12b151
      };
      if (!_0x3d31de) {
        _0x4db5ec(_0x181fef.you_adm);
        return _0x21957c;
      }
    }
    if (!_0x246965) {
      return _0x4db5ec(_0x181fef.give_adm);
    }
    const _0x317a58 = await _0x231979.groupMetadata(_0x2d7057);
    let _0x6938e7 = await _0x231979.profilePictureUrl(_0x2d7057, "image");
    const _0x880de0 = "\n*" + _0x317a58.subject + "*\n\n🐉 *Group Jid* - " + _0x317a58.id + "\n\n📬 *Participant Count* - " + _0x317a58.size + "\n\n👤 *Group Creator* - " + _0x317a58.owner + "\n\n📃 *Group Description* - " + _0x317a58.desc + "\n\n";
    const _0x3e18be = {
      'url': _0x6938e7
    };
    const _0x3b6023 = {
      'quoted': _0x12b151
    };
    await _0x231979.sendMessage(_0x2d7057, {
      'image': _0x3e18be,
      'caption': _0x880de0 + config.FOOTER
    }, _0x3b6023);
  } catch (_0xb01bf8) {
    const _0x45b478 = {
      'text': '❌',
      'key': _0x12b151.key
    };
    const _0x49ee31 = {
      'react': _0x45b478
    };
    await _0x231979.sendMessage(_0x2d7057, _0x49ee31);
    console.log(_0xb01bf8);
    _0x4db5ec("❌ *Error Accurated !!*\n\n" + _0xb01bf8);
  }
});

const _0x235552 = {
  'pattern': 'joinr',
  'desc': "Get list of participants who requested to join the group",
  'react': '📋',
  'category': 'group',
  'filename': __filename
};
cmd(_0x235552, async (_0x5627f6, _0x3c9922, _0x196741, {
  from: _0x152438,
  q: _0x5b5aa4,
  reply: _0x56da10,
  isGroup: _0x163e8c
}) => {
  if (!_0x163e8c) {
    return _0x56da10("This command can only be used in a group chat.");
  }
  try {
    console.log("Attempting to fetch pending requests for group: " + _0x152438);
    const _0x1cec50 = await _0x5627f6.groupRequestParticipantsList(_0x152438);
    console.log(_0x1cec50);
    if (_0x1cec50.length > 0x0) {
      let _0x23374c = "Pending Requests to Join the Group:\n";
      let _0x17317a = [];
      _0x1cec50.forEach(_0x5e1d24 => {
        const _0x35ec96 = _0x5e1d24.jid;
        _0x23374c += "😻 @" + _0x35ec96.split('@')[0x0] + "\n";
        _0x17317a.push(_0x35ec96);
      });
      const _0x3d4716 = {
        'text': _0x23374c,
        'mentions': _0x17317a
      };
      await _0x5627f6.sendMessage(_0x152438, _0x3d4716);
    } else {
      _0x56da10("No pending requests to join the group.");
    }
  } catch (_0x4cac9e) {
    console.error("Error fetching participant requests: " + _0x4cac9e.message);
    _0x56da10("⚠️ An error occurred while fetching the pending requests. Please try again later.");
  }
});
const _0x485005 = {
  'pattern': "allreq",
  'desc': "Approve or reject all join requests",
  'react': '✅',
  'category': "group",
  'filename': __filename
};
cmd(_0x485005, async (_0x49ae26, _0xcdfa27, _0x2d27f9, {
  from: _0x249d9d,
  reply: _0x2c52c1,
  isGroup: _0x303374
}) => {
  if (!_0x303374) {
    return _0x2c52c1("This command can only be used in a group chat.");
  }
  const _0x5e0937 = _0x2d27f9.body.includes("approve") ? "approve" : "reject";
  try {
    const _0x495e05 = await _0x49ae26.groupRequestParticipantsList(_0x249d9d);
    if (_0x495e05.length === 0x0) {
      return _0x2c52c1("There are no pending requests to manage.");
    }
    let _0x1b4d8b = "Pending Requests to Join the Group:\n";
    let _0x5bd4ee = [];
    let _0x701413 = [];
    _0x495e05.forEach(_0x2e9edd => {
      const _0x17c569 = _0x2e9edd.jid;
      _0x1b4d8b += "😻 @" + _0x17c569.split('@')[0x0] + "\n";
      _0x5bd4ee.push(_0x17c569);
      _0x701413.push(_0x17c569);
    });
    const _0x56c60b = {
      'text': _0x1b4d8b,
      'mentions': _0x5bd4ee
    };
    await _0x49ae26.sendMessage(_0x249d9d, _0x56c60b);
    const _0x40e74d = await _0x49ae26.groupRequestParticipantsUpdate(_0x249d9d, _0x701413, _0x5e0937);
    console.log(_0x40e74d);
    _0x2c52c1("Successfully " + _0x5e0937 + "ed all join requests.");
  } catch (_0x2a4b2c) {
    console.error("Error updating participant requests: " + _0x2a4b2c.message);
    _0x2c52c1("⚠️ An error occurred while processing the request. Please try again later.");
  }
});
const _0x3bcce0 = {
  'pattern': "disappear",
  'react': "🌪️",
  'alias': ['dm'],
  'desc': "Turn on/off disappearing messages.",
  'category': "main",
  'filename': __filename
};
cmd(_0x3bcce0, async (_0x4981f9, _0x1ac44e, _0x59ef0d, {
  from: _0xde58d3,
  isGroup: _0x3ea2c4,
  isAdmins: _0x5aae90,
  args: _0x17b0ab
}) => {
  if (!_0x3ea2c4) {
    const _0x3038c7 = {
      'text': "This command can only be used in groups."
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x3038c7);
    return;
  }
  if (!_0x5aae90) {
    const _0x19d9ef = {
      'text': "Only admins can turn on/off disappearing messages."
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x19d9ef);
    return;
  }
  const _0x2c3dbc = _0x17b0ab[0x0];
  if (_0x2c3dbc === 'on') {
    const _0x1d6174 = _0x17b0ab[0x1];
    let _0x1de4ca;
    switch (_0x1d6174) {
      case "24h":
        _0x1de4ca = 0x15180;
        break;
      case '7d':
        _0x1de4ca = 0x93a80;
        break;
      case "90d":
        _0x1de4ca = 0x76a700;
        break;
      default:
        const _0x497298 = {
          'text': "Invalid duration! Use `24h`, `7d`, or `90d`."
        };
        await _0x4981f9.sendMessage(_0xde58d3, _0x497298);
        return;
    }
    const _0x18601c = {
      'disappearingMessagesInChat': _0x1de4ca
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x18601c);
    const _0x4b59f0 = {
      'text': "Disappearing messages are now ON for " + _0x1d6174 + '.'
    };
    await _0x4981f9.sendMessage(_0xde58d3, _0x4b59f0);
  } else {
    if (_0x2c3dbc === "off") {
      const _0x5951ff = {
        'disappearingMessagesInChat': false
      };
      await _0x4981f9.sendMessage(_0xde58d3, _0x5951ff);
      const _0x3b5871 = {
        'text': "Disappearing messages are now OFF."
      };
      await _0x4981f9.sendMessage(_0xde58d3, _0x3b5871);
    } else {
      const _0x957b6e = {
        'text': "Please use `!disappear on <duration>` or `!disappear off`."
      };
      await _0x4981f9.sendMessage(_0xde58d3, _0x957b6e);
    }
  }
});
const _0x592aaf = {
  'pattern': "senddm",
  'react': "🌪️",
  'alias': ["senddisappear"],
  'desc': "Send a disappearing message.",
  'category': "main",
  'filename': __filename
};
cmd(_0x592aaf, async (_0x43277d, _0x49a4bf, _0x1a9eee, {
  from: _0x4121e3,
  isGroup: _0x130587,
  isAdmins: _0x1f5a32,
  args: _0x59db09
}) => {
  if (!_0x130587) {
    const _0x3db64e = {
      'text': "This command can only be used in groups."
    };
    await _0x43277d.sendMessage(_0x4121e3, _0x3db64e);
    return;
  }
  if (!_0x59db09.length) {
    const _0xab756b = {
      'text': "Please provide a message to send."
    };
    await _0x43277d.sendMessage(_0x4121e3, _0xab756b);
    return;
  }
  const _0x378c1a = _0x59db09.join(" ");
  const _0x57700b = {
    'text': _0x378c1a
  };
  const _0x236fb8 = {
    'ephemeralExpiration': 0x93a80
  };
  await _0x43277d.sendMessage(_0x4121e3, _0x57700b, _0x236fb8);
});
const _0x4f6b5b = {
  'pattern': 'mute1',
  'react': '🔇',
  'alias': ["close", "f_mute"],
  'desc': "Change to group settings to only admins can send messages.",
  'category': "group",
  'use': '.mute',
  'filename': __filename
};
cmd(_0x4f6b5b, async (_0x1db32, _0x1034bb, _0x25ca2a, {
  from: _0x3eb37e,
  l: _0xb9c9be,
  quoted: _0x29d293,
  body: _0x2db992,
  isCmd: _0x500c26,
  command: _0x4fc99e,
  args: _0x59c2e4,
  q: _0x8908a8,
  isGroup: _0x5b1d5a,
  sender: _0x1a5d9d,
  senderNumber: _0x403beb,
  botNumber2: _0x2649be,
  botNumber: _0x357b82,
  pushname: _0x46f320,
  isMe: _0x2189c8,
  isOwner: _0x404021,
  groupMetadata: _0x501cc6,
  groupName: _0x29b9be,
  participants: _0x3bf764,
  groupAdmins: _0x23192c,
  isBotAdmins: _0x3113e1,
  isCreator: _0x3a14cd,
  isDev: _0x536689,
  isAdmins: _0x183163,
  reply: _0x58a333
}) => {
  try {
    const _0x500a97 = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
    if (!_0x5b1d5a) {
      return _0x58a333(_0x500a97.only_gp);
    }
    if (!_0x183163) {
      const _0x2f558f = {
        'quoted': _0x1034bb
      };
      if (!_0x536689) {
        _0x58a333(_0x500a97.you_adm);
        return _0x2f558f;
      }
    }
    if (!_0x3113e1) {
      return _0x58a333(_0x500a97.give_adm);
    }
    await _0x1db32.groupSettingUpdate(_0x3eb37e, 'announcement');
    const _0x36519b = {
      'text': "*Group Chat closed by Admin " + _0x46f320 + "* 🔇"
    };
    const _0x4744ef = {
      'quoted': _0x1034bb
    };
    await _0x1db32.sendMessage(_0x3eb37e, _0x36519b, _0x4744ef);
  } catch (_0xa7a872) {
    const _0x521c5e = {
      'text': '❌',
      'key': _0x1034bb.key
    };
    const _0x2837a2 = {
      'react': _0x521c5e
    };
    await _0x1db32.sendMessage(_0x3eb37e, _0x2837a2);
    console.log(_0xa7a872);
    _0x58a333("❌ *Error Accurated !!*\n\n" + _0xa7a872);
  }
});
const _0x87e572 = {
  'pattern': 'unmute1',
  'react': '🔇',
  'alias': ["open", 'f_unmute'],
  'desc': "Change to group settings to all members can send messages.",
  'category': "group",
  'use': ".unmute",
  'filename': __filename
};
cmd(_0x87e572, async (_0x25e894, _0x173e12, _0x5cc272, {
  from: _0xeeb31b,
  l: _0x58264a,
  quoted: _0x81dda4,
  body: _0x2ccf26,
  isCmd: _0x2347d3,
  command: _0x42a3e4,
  args: _0x5a986a,
  q: _0x1dfbee,
  isGroup: _0x2d3d91,
  sender: _0x4f63db,
  senderNumber: _0x2d4d48,
  botNumber2: _0x1577ce,
  botNumber: _0x210cd0,
  pushname: _0x165f81,
  isMe: _0x296039,
  isOwner: _0x486497,
  groupMetadata: _0x2b0178,
  groupName: _0x5317ab,
  participants: _0x1138a8,
  groupAdmins: _0x4ec8e3,
  isBotAdmins: _0x351607,
  isCreator: _0x353ee1,
  isDev: _0x41f549,
  isAdmins: _0x5bcb46,
  reply: _0x3b61c9
}) => {
  try {
    const _0x132ae2 = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
    if (!_0x2d3d91) {
      return _0x3b61c9(_0x132ae2.only_gp);
    }
    if (!_0x5bcb46) {
      const _0x48b9a1 = {
        'quoted': _0x173e12
      };
      if (!_0x41f549) {
        _0x3b61c9(_0x132ae2.you_adm);
        return _0x48b9a1;
      }
    }
    if (!_0x351607) {
      return _0x3b61c9(_0x132ae2.give_adm);
    }
    await _0x25e894.groupSettingUpdate(_0xeeb31b, "not_announcement");
    const _0x37b570 = {
      'text': "*Group Chat Opened by Admin " + _0x165f81 + "* 🔇"
    };
    const _0xfed4bb = {
      'quoted': _0x173e12
    };
    await _0x25e894.sendMessage(_0xeeb31b, _0x37b570, _0xfed4bb);
  } catch (_0x23da8f) {
    const _0x2c4198 = {
      'text': '❌',
      'key': _0x173e12.key
    };
    const _0x3d6c71 = {
      'react': _0x2c4198
    };
    await _0x25e894.sendMessage(_0xeeb31b, _0x3d6c71);
    console.log(_0x23da8f);
    _0x3b61c9("❌ *Error Accurated !!*\n\n" + _0x23da8f);
  }
});
const _0x2bff43 = {
  'pattern': "lockgs",
  'react': '🔇',
  'alias': ["lockgsettings"],
  'desc': "Change to group settings to only admins can edit group info",
  'category': "group",
  'use': '.lockgs',
  'filename': __filename
};
cmd(_0x2bff43, async (_0x1544c8, _0x3a8967, _0x3a98a6, {
  from: _0x498d74,
  l: _0x242d02,
  quoted: _0x36365b,
  body: _0x6eab77,
  isCmd: _0x304a8f,
  command: _0x354db8,
  args: _0x3c3dde,
  q: _0x2751b9,
  isGroup: _0x3469a1,
  sender: _0x2a2cfe,
  senderNumber: _0x5ba54c,
  botNumber2: _0x13db3b,
  botNumber: _0x147018,
  pushname: _0x4a7385,
  isMe: _0x58cf74,
  isOwner: _0x4b72ad,
  groupMetadata: _0x2e602b,
  groupName: _0x4814c6,
  participants: _0x50dfe6,
  groupAdmins: _0x4e1045,
  isBotAdmins: _0x50a963,
  isCreator: _0x4d04a5,
  isDev: _0x21193e,
  isAdmins: _0x3d7529,
  reply: _0x5ed333
}) => {
  try {
    const _0x1039b6 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x3469a1) {
      return _0x5ed333(_0x1039b6.only_gp);
    }
    if (!_0x3d7529) {
      const _0x155d21 = {
        'quoted': _0x3a8967
      };
      if (!_0x21193e) {
        _0x5ed333(_0x1039b6.you_adm);
        return _0x155d21;
      }
    }
    if (!_0x50a963) {
      return _0x5ed333(_0x1039b6.give_adm);
    }
    await _0x1544c8.groupSettingUpdate(_0x498d74, 'locked');
    const _0x5db9eb = {
      'text': "*Group settings Locked* 🔒"
    };
    const _0x3d6f8d = {
      'quoted': _0x3a8967
    };
    await _0x1544c8.sendMessage(_0x498d74, _0x5db9eb, _0x3d6f8d);
  } catch (_0x16dbea) {
    const _0x8a66fe = {
      'text': '❌',
      'key': _0x3a8967.key
    };
    const _0x5d8236 = {
      'react': _0x8a66fe
    };
    await _0x1544c8.sendMessage(_0x498d74, _0x5d8236);
    console.log(_0x16dbea);
    _0x5ed333("❌ *Error Accurated !!*\n\n" + _0x16dbea);
  }
});
const _0x285abb = {
  'pattern': 'unlockgs',
  'react': '🔓',
  'alias': ['unlockgsettings'],
  'desc': "Change to group settings to all members can edit group info",
  'category': 'group',
  'use': '.unlockgs',
  'filename': __filename
};
cmd(_0x285abb, async (_0x5b301d, _0x3b7b70, _0x2cc26e, {
  from: _0x4d3c01,
  l: _0x176622,
  quoted: _0x37c3f2,
  body: _0x3fbb36,
  isCmd: _0x51482e,
  command: _0xd3f200,
  args: _0x509332,
  q: _0x44f8fa,
  isGroup: _0x1e2ad3,
  sender: _0x41c2a2,
  senderNumber: _0x53d357,
  botNumber2: _0x29bf53,
  botNumber: _0x2a719b,
  pushname: _0x4d9f7c,
  isMe: _0x3aee0d,
  isOwner: _0x71e650,
  groupMetadata: _0xe73a5f,
  groupName: _0x2f6917,
  participants: _0x43c59f,
  groupAdmins: _0x3d8f6f,
  isBotAdmins: _0x3d74ba,
  isCreator: _0x414dbd,
  isDev: _0x2c354b,
  isAdmins: _0xff1420,
  reply: _0xbc1d4c
}) => {
  try {
    const _0x5091d1 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x1e2ad3) {
      return _0xbc1d4c(_0x5091d1.only_gp);
    }
    if (!_0xff1420) {
      const _0x1f11d9 = {
        'quoted': _0x3b7b70
      };
      if (!_0x2c354b) {
        _0xbc1d4c(_0x5091d1.you_adm);
        return _0x1f11d9;
      }
    }
    if (!_0x3d74ba) {
      return _0xbc1d4c(_0x5091d1.give_adm);
    }
    await _0x5b301d.groupSettingUpdate(_0x4d3c01, "unlocked");
    const _0x53e034 = {
      'text': "*Group settings Unlocked* 🔓"
    };
    const _0x3fc266 = {
      'quoted': _0x3b7b70
    };
    await _0x5b301d.sendMessage(_0x4d3c01, _0x53e034, _0x3fc266);
  } catch (_0x3b7c9f) {
    const _0x371437 = {
      'text': '❌',
      'key': _0x3b7b70.key
    };
    const _0x37fa5b = {
      'react': _0x371437
    };
    await _0x5b301d.sendMessage(_0x4d3c01, _0x37fa5b);
    console.log(_0x3b7c9f);
    _0xbc1d4c("❌ *Error Accurated !!*\n\n" + _0x3b7c9f);
  }
});
const _0x2ad4fd = {
  'pattern': "djdjdjdjdjdjdjdjdj",
  'react': '🔓',
  'alias': ["ayeeeeeeeeee", "lllllllllllllll", 'nnnnn', "ppppppppopo", "ttttttttttttttttt"],
  'desc': "To leave from the group",
  'category': "group",
  'use': ".kuch nahi",
  'filename': __filename
};
cmd(_0x2ad4fd, async (_0x57ca03, _0x3887fa, _0x4fce7e, {
  from: _0xc68888,
  l: _0x1282e3,
  quoted: _0x57ed20,
  body: _0x10f606,
  isCmd: _0xe8fc04,
  command: _0x1a8e92,
  args: _0x4f8537,
  q: _0xdfea9b,
  isGroup: _0x4a4781,
  sender: _0x365a0c,
  senderNumber: _0x46d54a,
  botNumber2: _0x3be42d,
  botNumber: _0x5463fe,
  pushname: _0xb5c3cd,
  isMe: _0xca9405,
  isOwner: _0x3d58af,
  groupMetadata: _0x160843,
  groupName: _0x4b3e84,
  participants: _0x2c85cd,
  groupAdmins: _0x5d97cf,
  isBotAdmins: _0x25501b,
  isCreator: _0x50edb5,
  isDev: _0x23245,
  isAdmins: _0x237aa4,
  reply: _0x4da4af
}) => {
  try {
    const _0x21c4f5 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x4a4781) {
      return _0x4da4af(_0x21c4f5.only_gp);
    }
    if (!_0x237aa4) {
      if (!_0x23245) {
        return _0x4da4af(_0x21c4f5.you_adm);
      }
    }
    const _0x51bec9 = {
      'text': "*Good Bye All* 👋🏻"
    };
    const _0x57034a = {
      'quoted': _0x3887fa
    };
    await _0x57ca03.sendMessage(_0xc68888, _0x51bec9, _0x57034a);
    await _0x57ca03.groupLeave(_0xc68888);
  } catch (_0x2f90a5) {
    const _0x3b1e22 = {
      'text': '❌',
      'key': _0x3887fa.key
    };
    const _0x342f73 = {
      'react': _0x3b1e22
    };
    await _0x57ca03.sendMessage(_0xc68888, _0x342f73);
    console.log(_0x2f90a5);
    _0x4da4af("❌ *Error Accurated !!*\n\n" + _0x2f90a5);
  }
});
const _0x293215 = {
  'pattern': "updategname",
  'react': '🔓',
  'alias': ["upgname", 'gname'],
  'desc': "To Change the group name",
  'category': 'group',
  'use': '.updategname',
  'filename': __filename
};
cmd(_0x293215, async (_0x2aa48a, _0x3602cd, _0x1cbce2, {
  from: _0x45ad08,
  l: _0xa090a9,
  quoted: _0x140510,
  body: _0xd8ae2d,
  isCmd: _0x437e3b,
  command: _0x40ca0c,
  args: _0x41b4fb,
  q: _0x48b32f,
  isGroup: _0x3c8a42,
  sender: _0x2d52ff,
  senderNumber: _0x326df8,
  botNumber2: _0x376078,
  botNumber: _0x336b9f,
  pushname: _0x566409,
  isMe: _0x77a2fd,
  isOwner: _0x281739,
  groupMetadata: _0x26008d,
  groupName: _0x133a26,
  participants: _0x355c6d,
  groupAdmins: _0x3307cd,
  isBotAdmins: _0x21be18,
  isCreator: _0x1f3260,
  isDev: _0x67bfd1,
  isAdmins: _0x41f9b9,
  reply: _0x5a7586
}) => {
  try {
    const _0x14b230 = (await fetchJson('https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
    if (!_0x3c8a42) {
      return _0x5a7586(_0x14b230.only_gp);
    }
    if (!_0x41f9b9) {
      const _0x4d9f16 = {
        'quoted': _0x3602cd
      };
      if (!_0x67bfd1) {
        _0x5a7586(_0x14b230.you_adm);
        return _0x4d9f16;
      }
    }
    if (!_0x21be18) {
      return _0x5a7586(_0x14b230.give_adm);
    }
    if (!_0x48b32f) {
      return _0x5a7586("*Please write the new Group Subject* 🖊️");
    }
    await _0x2aa48a.groupUpdateSubject(_0x45ad08, _0x48b32f);
    const _0x2b8140 = {
      'text': "✔️ *Group name Updated*"
    };
    const _0x51ea6e = {
      'quoted': _0x3602cd
    };
    await _0x2aa48a.sendMessage(_0x45ad08, _0x2b8140, _0x51ea6e);
  } catch (_0x34ae8f) {
    const _0x2bfcde = {
      'text': '❌',
      'key': _0x3602cd.key
    };
    const _0x1de2ed = {
      'react': _0x2bfcde
    };
    await _0x2aa48a.sendMessage(_0x45ad08, _0x1de2ed);
    console.log(_0x34ae8f);
    _0x5a7586("❌ *Error Accurated !!*\n\n" + _0x34ae8f);
  }
});
const _0x19cdd8 = {
  'pattern': "updategdesc",
  'react': '🔓',
  'alias': ['upgdesc', "gdesc"],
  'desc': "To Change the group description",
  'category': "group",
  'use': ".updategdesc",
  'filename': __filename
};
cmd(_0x19cdd8, async (_0x3b5d59, _0x500dad, _0xdfb924, {
  from: _0x516246,
  l: _0x19ec9a,
  quoted: _0x1819d0,
  body: _0x30fdcc,
  isCmd: _0x515c22,
  command: _0x1fd1cd,
  args: _0x4e0bf3,
  q: _0x556f9f,
  isGroup: _0x13d490,
  sender: _0x1df8c1,
  senderNumber: _0x3a2430,
  botNumber2: _0x220610,
  botNumber: _0x591fe3,
  pushname: _0x2b36ae,
  isMe: _0x606490,
  isOwner: _0x526323,
  groupMetadata: _0x384f6d,
  groupName: _0x5f5794,
  participants: _0x264fd2,
  groupAdmins: _0xba3383,
  isBotAdmins: _0x3cae00,
  isCreator: _0x502deb,
  isDev: _0x50102c,
  isAdmins: _0x504a32,
  reply: _0x2d0d35
}) => {
  try {
    const _0x22a47e = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x13d490) {
      return _0x2d0d35(_0x22a47e.only_gp);
    }
    if (!_0x504a32) {
      const _0x16afa8 = {
        'quoted': _0x500dad
      };
      if (!_0x50102c) {
        _0x2d0d35(_0x22a47e.you_adm);
        return _0x16afa8;
      }
    }
    if (!_0x3cae00) {
      return _0x2d0d35(_0x22a47e.give_adm);
    }
    if (!_0x556f9f) {
      return _0x2d0d35("*Please write the new Group Description* 🖊️");
    }
    await _0x3b5d59.groupUpdateDescription(_0x516246, _0x556f9f);
    const _0x49e14d = {
      'text': "✔️ *Group Description Updated*"
    };
    const _0x543531 = {
      'quoted': _0x500dad
    };
    await _0x3b5d59.sendMessage(_0x516246, _0x49e14d, _0x543531);
  } catch (_0x57cb62) {
    const _0x31e856 = {
      'text': '❌',
      'key': _0x500dad.key
    };
    const _0x308db1 = {
      'react': _0x31e856
    };
    await _0x3b5d59.sendMessage(_0x516246, _0x308db1);
    console.log(_0x57cb62);
    _0x2d0d35("❌ *Error Accurated !!*\n\n" + _0x57cb62);
  }
});
const _0x53f490 = {
  'pattern': "join1",
  'react': '📬',
  'alias': ["joinme", "f_join"],
  'desc': "To Join a Group from Invite link",
  'category': "group",
  'use': ".join < Group Link >",
  'filename': __filename
};
cmd(_0x53f490, async (_0x47c9d7, _0x35ca33, _0x4e5ffe, {
  from: _0x15bbf1,
  l: _0x2b246e,
  quoted: _0x439d00,
  body: _0x12d064,
  isCmd: _0x5bd4dd,
  command: _0x1d9eb2,
  args: _0x283da0,
  q: _0x1f1cc7,
  isGroup: _0x456f2e,
  sender: _0x2595cc,
  senderNumber: _0x53fe6b,
  botNumber2: _0x1fe6e4,
  botNumber: _0x4d1c42,
  pushname: _0x3c2ff7,
  isMe: _0x39e0e1,
  isOwner: _0x55939f,
  groupMetadata: _0x55d05e,
  groupName: _0xe82872,
  participants: _0x5b2e7d,
  groupAdmins: _0x84a5f3,
  isBotAdmins: _0x5ee4f7,
  isCreator: _0x571c2f,
  isDev: _0x29ee1,
  isAdmins: _0x19b4d1,
  reply: _0x12d263
}) => {
  try {
    const _0x12bb44 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x571c2f && !_0x29ee1 && !_0x55939f && !_0x39e0e1) {
      return _0x12d263(_0x12bb44.own_cmd);
    }
    if (!_0x1f1cc7) {
      return _0x12d263("*Please write the Group Link*️ 🖇️");
    }
    let _0x28e07b = _0x283da0[0x0].split('https://chat.whatsapp.com/')[0x1];
    await _0x47c9d7.groupAcceptInvite(_0x28e07b);
    const _0x3f0d45 = {
      'text': "✔️ *Successfully Joined*"
    };
    const _0x2e8dca = {
      'quoted': _0x35ca33
    };
    await _0x47c9d7.sendMessage(_0x15bbf1, _0x3f0d45, _0x2e8dca);
  } catch (_0x39c9f4) {
    const _0x2dd285 = {
      'text': '❌',
      'key': _0x35ca33.key
    };
    const _0x172b23 = {
      'react': _0x2dd285
    };
    await _0x47c9d7.sendMessage(_0x15bbf1, _0x172b23);
    console.log(_0x39c9f4);
    _0x12d263("❌ *Error Accurated !!*\n\n" + _0x39c9f4);
  }
});
const _0x4df201 = {
  'pattern': "invite1",
  'react': "🖇️",
  'alias': ['grouplink', "glink"],
  'desc': "To Get the Group Invite link",
  'category': "group",
  'use': ".invite",
  'filename': __filename
};
cmd(_0x4df201, async (_0x5ca0b3, _0x1d2aac, _0x5ae3b9, {
  from: _0x17b97f,
  l: _0x320435,
  quoted: _0x32016d,
  body: _0x2afdd5,
  isCmd: _0x226900,
  command: _0x155d31,
  args: _0x29a67f,
  q: _0x4862f2,
  isGroup: _0x2e5d88,
  sender: _0x253057,
  senderNumber: _0x461579,
  botNumber2: _0x2dcc66,
  botNumber: _0x3dac62,
  pushname: _0x46651c,
  isMe: _0x43878c,
  isOwner: _0x2db519,
  groupMetadata: _0x5ccd53,
  groupName: _0x142c7c,
  participants: _0x457d22,
  groupAdmins: _0x27605d,
  isBotAdmins: _0x29764e,
  isCreator: _0x27414b,
  isDev: _0x7de5ca,
  isAdmins: _0x3f2992,
  reply: _0x4b7e40
}) => {
  try {
    const _0x5ab1ee = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x2e5d88) {
      return _0x4b7e40(_0x5ab1ee.only_gp);
    }
    if (!_0x3f2992) {
      const _0x1ff13e = {
        'quoted': _0x1d2aac
      };
      if (!_0x7de5ca) {
        _0x4b7e40(_0x5ab1ee.you_adm);
        return _0x1ff13e;
      }
    }
    if (!_0x29764e) {
      return _0x4b7e40(_0x5ab1ee.give_adm);
    }
    const _0x191ef8 = await _0x5ca0b3.groupInviteCode(_0x17b97f);
    const _0x29587e = {
      'text': "🖇️ *Group Link*\n\nhttps://chat.whatsapp.com/" + _0x191ef8
    };
    const _0x125136 = {
      'quoted': _0x1d2aac
    };
    await _0x5ca0b3.sendMessage(_0x17b97f, _0x29587e, _0x125136);
  } catch (_0x63c156) {
    const _0x476c01 = {
      'text': '❌',
      'key': _0x1d2aac.key
    };
    const _0x537f80 = {
      'react': _0x476c01
    };
    await _0x5ca0b3.sendMessage(_0x17b97f, _0x537f80);
    console.log(_0x63c156);
    _0x4b7e40("❌ *Error Accurated !!*\n\n" + _0x63c156);
  }
});
const _0x34bd2a = {
  'pattern': "revoke1",
  'react': "🖇️",
  'alias': ["revokegrouplink", "resetglink", "revokelink", "f_revoke"],
  'desc': "To Reset the group link",
  'category': 'group',
  'use': '.revoke',
  'filename': __filename
};
cmd(_0x34bd2a, async (_0xd64721, _0x5b20b2, _0x2bf8dd, {
  from: _0x2a4c3b,
  l: _0x38cd01,
  quoted: _0x207ad7,
  body: _0x523130,
  isCmd: _0x7343fe,
  command: _0x288b13,
  args: _0x4157cf,
  q: _0x250059,
  isGroup: _0x7863dd,
  sender: _0x92a6a8,
  senderNumber: _0x2fee70,
  botNumber2: _0x238294,
  botNumber: _0x549be0,
  pushname: _0x302895,
  isMe: _0x6e68f8,
  isOwner: _0xffeee0,
  groupMetadata: _0xe2b0b4,
  groupName: _0x18bb6f,
  participants: _0x527bd5,
  groupAdmins: _0xd1b113,
  isBotAdmins: _0x242d35,
  isCreator: _0x2dd9e1,
  isDev: _0x4361df,
  isAdmins: _0x2050dd,
  reply: _0x1ae877
}) => {
  try {
    const _0x5ba157 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x7863dd) {
      return _0x1ae877(_0x5ba157.only_gp);
    }
    if (!_0x2050dd) {
      const _0x166031 = {
        'quoted': _0x5b20b2
      };
      if (!_0x4361df) {
        _0x1ae877(_0x5ba157.you_adm);
        return _0x166031;
      }
    }
    if (!_0x242d35) {
      return _0x1ae877(_0x5ba157.give_adm);
    }
    await _0xd64721.groupRevokeInvite(_0x2a4c3b);
    const _0x56209b = {
      'text': "*Group link Reseted* ⛔"
    };
    const _0x3abb77 = {
      'quoted': _0x5b20b2
    };
    await _0xd64721.sendMessage(_0x2a4c3b, _0x56209b, _0x3abb77);
  } catch (_0x1d9b7d) {
    const _0x11ba01 = {
      'text': '❌',
      'key': _0x5b20b2.key
    };
    const _0x1c73fc = {
      'react': _0x11ba01
    };
    await _0xd64721.sendMessage(_0x2a4c3b, _0x1c73fc);
    console.log(_0x1d9b7d);
    _0x1ae877("❌ *Error Accurated !!*\n\n" + _0x1d9b7d);
  }
});
const _0x57538f = {
  'pattern': "kick1",
  'react': '🥏',
  'alias': ["remove"],
  'desc': "To Remove a participant from Group",
  'category': "group",
  'use': ".kick",
  'filename': __filename
};
cmd(_0x57538f, async (_0xdf818e, _0xa69965, _0x290fe5, {
  from: _0x277530,
  l: _0x1424d7,
  quoted: _0xc99b4e,
  body: _0x5195f3,
  isCmd: _0x1a81a4,
  command: _0x1ee878,
  mentionByTag: _0x383b10,
  args: _0x2e0664,
  q: _0x3bfd97,
  isGroup: _0x2af926,
  sender: _0x4ff03c,
  senderNumber: _0x374722,
  botNumber2: _0x5e6e97,
  botNumber: _0x28b955,
  pushname: _0x511cf4,
  isMe: _0x59c181,
  isOwner: _0x3fc01d,
  groupMetadata: _0xfdebc1,
  groupName: _0x4f1621,
  participants: _0x45edd7,
  groupAdmins: _0x91732c,
  isBotAdmins: _0x54a5f9,
  isCreator: _0x32ceb6,
  isDev: _0x58a57b,
  isAdmins: _0x5ad85f,
  reply: _0x3823f7
}) => {
  try {
    const _0x10dd83 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x2af926) {
      return _0x3823f7(_0x10dd83.only_gp);
    }
    if (!_0x5ad85f) {
      const _0x5787bc = {
        'quoted': _0xa69965
      };
      if (!_0x58a57b) {
        _0x3823f7(_0x10dd83.you_adm);
        return _0x5787bc;
      }
    }
    if (!_0x54a5f9) {
      return _0x3823f7(_0x10dd83.give_adm);
    }
    let _0x1bed6a = _0xa69965.mentionedJid ? _0xa69965.mentionedJid[0x0] : _0xa69965.msg.contextInfo.participant || false;
    if (!_0x1bed6a) {
      return _0x3823f7("*Couldn't find any user in context* ❌");
    }
    await _0xdf818e.groupParticipantsUpdate(_0x277530, [_0x1bed6a], "remove");
    const _0x46ed61 = {
      'text': "*Successfully removed*  ✔️"
    };
    const _0x281eec = {
      'quoted': _0xa69965
    };
    await _0xdf818e.sendMessage(_0x277530, _0x46ed61, _0x281eec);
  } catch (_0x5212f6) {
    const _0x310822 = {
      'text': '❌',
      'key': _0xa69965.key
    };
    const _0x3053a8 = {
      'react': _0x310822
    };
    await _0xdf818e.sendMessage(_0x277530, _0x3053a8);
    console.log(_0x5212f6);
    _0x3823f7("❌ *Error Accurated !!*\n\n" + _0x5212f6);
  }
});
const _0xd699f4 = {
  'pattern': "promote1",
  'react': '🥏',
  'alias': ["addadmin"],
  'desc': "To Add a participatant as a Admin",
  'category': 'group',
  'use': ".promote",
  'filename': __filename
};
cmd(_0xd699f4, async (_0x4924ea, _0x5010b3, _0x3c1d65, {
  from: _0x49e602,
  l: _0x33cb28,
  quoted: _0x5c131b,
  body: _0x56af54,
  isCmd: _0x2c4d1d,
  command: _0x5c9432,
  mentionByTag: _0x866e04,
  args: _0x21c205,
  q: _0xa50d6e,
  isGroup: _0x411587,
  sender: _0x343c09,
  senderNumber: _0x4205b9,
  botNumber2: _0x430b16,
  botNumber: _0x385106,
  pushname: _0x56aa61,
  isMe: _0xe7e204,
  isOwner: _0x30c7e8,
  groupMetadata: _0x3c38bf,
  groupName: _0x588879,
  participants: _0xe3d0b3,
  groupAdmins: _0x153505,
  isBotAdmins: _0x4091e7,
  isCreator: _0x22a9c2,
  isDev: _0x5d9c32,
  isAdmins: _0x233034,
  reply: _0x542673
}) => {
  try {
    const _0x4208b6 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x411587) {
      return _0x542673(_0x4208b6.only_gp);
    }
    if (!_0x233034) {
      const _0x30c355 = {
        'quoted': _0x5010b3
      };
      if (!_0x5d9c32) {
        _0x542673(_0x4208b6.you_adm);
        return _0x30c355;
      }
    }
    if (!_0x4091e7) {
      return _0x542673(_0x4208b6.give_adm);
    }
    let _0x43bdf3 = _0x5010b3.mentionedJid ? _0x5010b3.mentionedJid[0x0] : _0x5010b3.msg.contextInfo.participant || false;
    if (!_0x43bdf3) {
      return _0x542673("*Couldn't find any user in context* ❌");
    }
    const _0x58b5eb = await getGroupAdmins(_0xe3d0b3);
    if (_0x58b5eb.includes(_0x43bdf3)) {
      return _0x542673("❗ *User Already an Admin*  ✔️");
    }
    await _0x4924ea.groupParticipantsUpdate(_0x49e602, [_0x43bdf3], "promote");
    const _0x2a97e1 = {
      'text': "*User promoted as an Admin*  ✔️"
    };
    const _0x47980e = {
      'quoted': _0x5010b3
    };
    await _0x4924ea.sendMessage(_0x49e602, _0x2a97e1, _0x47980e);
  } catch (_0x3cdda4) {
    const _0x5d1425 = {
      'text': '❌',
      'key': _0x5010b3.key
    };
    const _0x183397 = {
      'react': _0x5d1425
    };
    await _0x4924ea.sendMessage(_0x49e602, _0x183397);
    console.log(_0x3cdda4);
    _0x542673("❌ *Error Accurated !!*\n\n" + _0x3cdda4);
  }
});
const _0x10f253 = {
  'pattern': "demote1",
  'react': '🥏',
  'alias': ["removeadmin"],
  'desc': "To Demote Admin to Member",
  'category': "group",
  'use': ".demote",
  'filename': __filename
};
cmd(_0x10f253, async (_0x100559, _0x26bd3b, _0x19d9e3, {
  from: _0x23fa85,
  l: _0x5d6046,
  quoted: _0x2ccaeb,
  body: _0x5b3e9b,
  isCmd: _0x286195,
  command: _0x58a518,
  mentionByTag: _0x465dce,
  args: _0x37c9f5,
  q: _0x23caef,
  isGroup: _0x472133,
  sender: _0x4d20bd,
  senderNumber: _0x3dcd8c,
  botNumber2: _0x403a3e,
  botNumber: _0x543e39,
  pushname: _0x4f7e0c,
  isMe: _0x2a1784,
  isOwner: _0x1ec34f,
  groupMetadata: _0x26a272,
  groupName: _0xb5af0c,
  participants: _0x2d8ac7,
  groupAdmins: _0x2571d5,
  isBotAdmins: _0x270691,
  isCreator: _0x2c64c3,
  isDev: _0x795a5f,
  isAdmins: _0x576070,
  reply: _0x391013
}) => {
  try {
    const _0xaf2bbe = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x472133) {
      return _0x391013(_0xaf2bbe.only_gp);
    }
    if (!_0x576070) {
      const _0x15e5c1 = {
        'quoted': _0x26bd3b
      };
      if (!_0x795a5f) {
        _0x391013(_0xaf2bbe.you_adm);
        return _0x15e5c1;
      }
    }
    if (!_0x270691) {
      return _0x391013(_0xaf2bbe.give_adm);
    }
    let _0x4261f8 = _0x26bd3b.mentionedJid ? _0x26bd3b.mentionedJid[0x0] : _0x26bd3b.msg.contextInfo.participant || false;
    if (!_0x4261f8) {
      return _0x391013("*Couldn't find any user in context* ❌");
    }
    const _0xc25d0c = await getGroupAdmins(_0x2d8ac7);
    if (!_0xc25d0c.includes(_0x4261f8)) {
      return _0x391013("❗ *User Already not an Admin*");
    }
    await _0x100559.groupParticipantsUpdate(_0x23fa85, [_0x4261f8], "demote");
    const _0x3cd26a = {
      'text': "*User No longer an Admin*  ✔️"
    };
    const _0x59c923 = {
      'quoted': _0x26bd3b
    };
    await _0x100559.sendMessage(_0x23fa85, _0x3cd26a, _0x59c923);
  } catch (_0x29a8ff) {
    const _0x271890 = {
      'text': '❌',
      'key': _0x26bd3b.key
    };
    const _0x1d1d66 = {
      'react': _0x271890
    };
    await _0x100559.sendMessage(_0x23fa85, _0x1d1d66);
    console.log(_0x29a8ff);
    _0x391013("❌ *Error Accurated !!*\n\n" + _0x29a8ff);
  }
});
const _0x53a4af = {
  'pattern': "tagall1",
  'react': '🔊',
  'alias': ["f_tagall"],
  'desc': "To Tag all Members",
  'category': "group",
  'use': ".tagall",
  'filename': __filename
};
cmd(_0x53a4af, async (_0x4b7a1c, _0x355fbd, _0xc06583, {
  from: _0x43cf50,
  l: _0x1274f4,
  quoted: _0x68b28c,
  body: _0x128cda,
  isCmd: _0x39b2e3,
  command: _0x4b97ec,
  mentionByTag: _0x17f382,
  args: _0x28acb9,
  q: _0x6f0c26,
  isGroup: _0x88d6b,
  sender: _0x57c54c,
  senderNumber: _0x17e523,
  botNumber2: _0x5bf942,
  botNumber: _0x5a4bfe,
  pushname: _0x5be918,
  isMe: _0x5d664d,
  isOwner: _0x5737c9,
  groupMetadata: _0x2e5eaa,
  groupName: _0x112cbc,
  participants: _0x31686b,
  groupAdmins: _0x3cb5d5,
  isBotAdmins: _0x24571c,
  isCreator: _0x2399d3,
  isDev: _0x8e90d9,
  isAdmins: _0x594511,
  reply: _0x40eeee
}) => {
  try {
    const _0x472cc7 = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x88d6b) {
      return _0x40eeee(_0x472cc7.only_gp);
    }
    if (!_0x594511) {
      const _0x2411d9 = {
        'quoted': _0x355fbd
      };
      if (!_0x8e90d9) {
        _0x40eeee(_0x472cc7.you_adm);
        return _0x2411d9;
      }
    }
    if (!_0x24571c) {
      return _0x40eeee(_0x472cc7.give_adm);
    }
    let _0x345955 = "💱 *HI ALL ! GIVE YOUR ATTENTION PLEASE* \n \n";
    for (let _0x8937a1 of _0x31686b) {
      _0x345955 += "> ᴅᴇᴀʀ 🫂 @" + _0x8937a1.id.split('@')[0x0] + "\n";
    }
    const _0x9c4934 = {
      'quoted': _0x355fbd
    };
    _0x4b7a1c.sendMessage(_0x43cf50, {
      'text': _0x345955,
      'mentions': _0x31686b.map(_0x2f0953 => _0x2f0953.id)
    }, _0x9c4934);
  } catch (_0x511eaf) {
    const _0x3be813 = {
      'text': '❌',
      'key': _0x355fbd.key
    };
    const _0x11890d = {
      'react': _0x3be813
    };
    await _0x4b7a1c.sendMessage(_0x43cf50, _0x11890d);
    console.log(_0x511eaf);
    _0x40eeee("❌ *Error Accurated !!*\n\n" + _0x511eaf);
  }
});
const _0x3220aa = {
  'pattern': "hidetag1",
  'react': '🔊',
  'alias': ["tag", "f_tag"],
  'desc': "To Tag all Members for Message",
  'category': "group",
  'use': ".tag Hi",
  'filename': __filename
};
cmd(_0x3220aa, async (_0x101a30, _0x3470bb, _0x2d7d33, {
  from: _0x58bb66,
  l: _0x1ca49f,
  quoted: _0x58edb8,
  body: _0x6e7c1,
  isCmd: _0x38ae4f,
  command: _0x48672f,
  mentionByTag: _0x5acb96,
  args: _0x1d6a92,
  q: _0x43f681,
  isGroup: _0x351100,
  sender: _0x3115eb,
  senderNumber: _0x145528,
  botNumber2: _0x59e71b,
  botNumber: _0x220e3e,
  pushname: _0x29f641,
  isMe: _0x47d4e3,
  isOwner: _0x82d151,
  groupMetadata: _0x58afad,
  groupName: _0xbeee21,
  participants: _0x5a381b,
  groupAdmins: _0x330d81,
  isBotAdmins: _0x24643c,
  isCreator: _0x4ed033,
  isDev: _0x2f2923,
  isAdmins: _0xbdcb4,
  reply: _0x3798d6
}) => {
  try {
    const _0x4a181e = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x351100) {
      return _0x3798d6(_0x4a181e.only_gp);
    }
    if (!_0xbdcb4) {
      const _0x206ddc = {
        'quoted': _0x3470bb
      };
      if (!_0x2f2923) {
        _0x3798d6(_0x4a181e.you_adm);
        return _0x206ddc;
      }
    }
    if (!_0x24643c) {
      return _0x3798d6(_0x4a181e.give_adm);
    }
    if (!_0x43f681) {
      return _0x3798d6("*Please add a Message* ℹ️");
    }
    let _0x5cbff2 = '' + _0x43f681;
    const _0x2515b9 = {
      'quoted': _0x3470bb
    };
    _0x101a30.sendMessage(_0x58bb66, {
      'text': _0x5cbff2,
      'mentions': _0x5a381b.map(_0x301d5f => _0x301d5f.id)
    }, _0x2515b9);
  } catch (_0xc17467) {
    const _0x275155 = {
      'text': '❌',
      'key': _0x3470bb.key
    };
    const _0x3a041e = {
      'react': _0x275155
    };
    await _0x101a30.sendMessage(_0x58bb66, _0x3a041e);
    console.log(_0xc17467);
    _0x3798d6("❌ *Error Accurated !!*\n\n" + _0xc17467);
  }
});
const _0x446ca7 = {
  'pattern': "tagx1",
  'react': '🔊',
  'alias': ['taggc', 'mentionall'],
  'desc': "To Tag all Members for Message",
  'category': "group",
  'use': ".tag Hi",
  'filename': __filename
};
cmd(_0x446ca7, async (_0x4ccc2b, _0x46df43, _0x157a68, {
  from: _0x4a3586,
  l: _0x1849a7,
  quoted: _0x49f20b,
  body: _0x289938,
  isCmd: _0x387e0e,
  command: _0x1d628a,
  mentionByTag: _0x4afa07,
  args: _0x1c76ca,
  q: _0x1b7262,
  isGroup: _0x134b12,
  sender: _0x3ddba6,
  senderNumber: _0x435739,
  botNumber2: _0x67152b,
  botNumber: _0x1a2845,
  pushname: _0x5aef84,
  isMe: _0x2b7832,
  isOwner: _0x356f37,
  groupMetadata: _0x3fc316,
  groupName: _0x14b7ff,
  participants: _0x2f6187,
  groupAdmins: _0x3a1e2e,
  isBotAdmins: _0x252cf3,
  isCreator: _0x284fda,
  isDev: _0xab165f,
  isAdmins: _0x2ec0d4,
  reply: _0x4bdb4a
}) => {
  try {
    if (!_0x157a68.quoted) {
      return _0x4bdb4a("*Please mention a message* ℹ️");
    }
    if (!_0x1b7262) {
      return _0x4bdb4a("*Please add a Group Jid* ℹ️");
    }
    let _0x5c2939 = '' + _0x157a68.quoted.msg;
    const _0x1dc222 = {
      'quoted': _0x46df43
    };
    _0x4ccc2b.sendMessage(_0x1b7262, {
      'text': _0x5c2939,
      'mentions': _0x2f6187.map(_0x7b549a => _0x7b549a.id)
    }, _0x1dc222);
  } catch (_0x1589ce) {
    const _0x58dd2e = {
      'text': '❌',
      'key': _0x46df43.key
    };
    const _0x3ec251 = {
      'react': _0x58dd2e
    };
    await _0x4ccc2b.sendMessage(_0x4a3586, _0x3ec251);
    console.log(_0x1589ce);
    _0x4bdb4a("❌ *Error Accurated !!*\n\n" + _0x1589ce);
  }
});
const _0x4c04aa = {
  'pattern': 'ginfo1',
  'react': '🥏',
  'alias': ["groupinfo"],
  'desc': "Get group informations.",
  'category': "group",
  'use': ".ginfo",
  'filename': __filename
};
cmd(_0x4c04aa, async (_0x231979, _0x12b151, _0x116356, {
  from: _0x2d7057,
  l: _0x1f51d6,
  quoted: _0xfa3403,
  body: _0x4b72e9,
  isCmd: _0x40eeb4,
  command: _0x3805b6,
  args: _0x261d7b,
  q: _0x2663b3,
  isGroup: _0x14a404,
  sender: _0x36a844,
  senderNumber: _0xc77a65,
  botNumber2: _0xeebe6c,
  botNumber: _0xd4f7c,
  pushname: _0x47d89f,
  isMe: _0x34e197,
  isOwner: _0x5aed14,
  groupMetadata: _0x4c2ba5,
  groupName: _0x3145fd,
  participants: _0x2ef24c,
  groupAdmins: _0x333eb7,
  isBotAdmins: _0x246965,
  isCreator: _0x2ddfa0,
  isDev: _0x3d31de,
  isAdmins: _0x680b41,
  reply: _0x4db5ec
}) => {
  try {
    const _0x181fef = (await fetchJson("https://raw.githubusercontent.com/JawadYTX/KHAN-DATA/refs/heads/main/MSG/mreply.json")).replyMsg;
    if (!_0x14a404) {
      return _0x4db5ec(_0x181fef.only_gp);
    }
    if (!_0x680b41) {
      const _0x21957c = {
        'quoted': _0x12b151
      };
      if (!_0x3d31de) {
        _0x4db5ec(_0x181fef.you_adm);
        return _0x21957c;
      }
    }
    if (!_0x246965) {
      return _0x4db5ec(_0x181fef.give_adm);
    }
    const _0x317a58 = await _0x231979.groupMetadata(_0x2d7057);
    let _0x6938e7 = await _0x231979.profilePictureUrl(_0x2d7057, "image");
    const _0x880de0 = "\n*" + _0x317a58.subject + "*\n\n🐉 *Group Jid* - " + _0x317a58.id + "\n\n📬 *Participant Count* - " + _0x317a58.size + "\n\n👤 *Group Creator* - " + _0x317a58.owner + "\n\n📃 *Group Description* - " + _0x317a58.desc + "\n\n";
    const _0x3e18be = {
      'url': _0x6938e7
    };
    const _0x3b6023 = {
      'quoted': _0x12b151
    };
    await _0x231979.sendMessage(_0x2d7057, {
      'image': _0x3e18be,
      'caption': _0x880de0 + config.FOOTER
    }, _0x3b6023);
  } catch (_0xb01bf8) {
    const _0x45b478 = {
      'text': '❌',
      'key': _0x12b151.key
    };
    const _0x49ee31 = {
      'react': _0x45b478
    };
    await _0x231979.sendMessage(_0x2d7057, _0x49ee31);
    console.log(_0xb01bf8);
    _0x4db5ec("❌ *Error Accurated !!*\n\n" + _0xb01bf8);
  }
});

