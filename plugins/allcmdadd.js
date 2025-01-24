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
const { ytsearch, ytmp3 } = require('@dark-yasiya/yt-dl.js');
const crypto = require('crypto');
const Esana = require("@sl-code-lords/esana-news");
const Hiru = require('hirunews-scrap');
const path = require('path');
const yts = require("yt-search");
const dl = require('@bochilteam/scraper')  
const ytdl = require('yt-search');
var videotime = 60000 // 1000 min
const { updateEnv, readEnv } = require('../lib/database');
const os = require("os")
const EnvVar = require('../lib/mongodbenv');
var api = new Esana();
const DYXT_NEWS = require("@dark-yasiya/news-scrap");
const newss = new DYXT_NEWS();

// Function to download YouTube videos in MP4 format
async function ytmp4(url, format) {
  try {
    if (!url || !format) {
      throw new Error("URL and format parameters are required.");
    }

    // Parse the format (e.g., "720p" -> 720)
    const parsedFormat = parseInt(format.replace('p', ''), 10);

    // Request parameters for the download API
    const downloadParams = {
      button: 1,
      start: 1,
      end: 1,
      format: parsedFormat,
      url: url,
    };

    // Headers for the API request
    const headers = {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
      Origin: "https://loader.to",
      Referer: "https://loader.to",
      "Sec-Ch-Ua": '"Not-A.Brand";v="99", "Chromium";v="124"',
      "Sec-Ch-Ua-Mobile": "?1",
      "Sec-Ch-Ua-Platform": '"Android"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
    };

    // Send a request to initiate the download process
    const response = await axios.get(
      "https://ab.cococococ.com/ajax/download.php",
      {
        params: downloadParams,
        headers: headers,
      }
    );

    // Get the ID from the response
    const downloadId = response.data.id;

    // Function to check the download progress
    const checkProgress = async () => {
      const progressParams = { id: downloadId };

      try {
        const progressResponse = await axios.get(
          "https://p.oceansaver.in/ajax/progress.php",
          {
            params: progressParams,
            headers: headers,
          }
        );

        const {
          progress,
          download_url: downloadUrl,
          text: statusText,
        } = progressResponse.data;

        // If the download is finished, return the download URL
        if (statusText === "Finished") {
          return downloadUrl;
        }

        // Otherwise, wait 1 second and check again
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return checkProgress();
      } catch (error) {
        throw new Error("Error in progress check: " + error.message);
      }
    };

    // Wait for the download to complete and return the final URL
    return await checkProgress();
  } catch (error) {
    console.error("Error:", error);
    return {
      error: error.message,
    };
  }
}

// Export the function for external use
module.exports = {
  ytmp4,
};

// Function to extract the YouTube video ID from a URL
function extractYouTubeId(url) {
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

// Function to convert a YouTube link to a standard format
function convertYouTubeLink(link) {
  const videoId = extractYouTubeId(link);
  if (videoId) {
    return "https://www.youtube.com/watch?v=" + videoId;
  }
  return link;
}
cmd({
  'pattern': 'play',
  'alias': "play11",
  'desc': "To download songs.",
  'react': '🎵',
  'category': 'download',
  'filename': __filename
}, async (_0xd441b6, _0x3cb21e, _0x58977b, {
  from: _0x1089ae,
  quoted: _0x448006,
  body: _0x295cbb,
  isCmd: _0x53c084,
  command: _0x23fac9,
  args: _0x9bafe3,
  q: _0x44c273,
  isGroup: _0x1465c1,
  sender: _0x19219b,
  senderNumber: _0x2ed57b,
  botNumber2: _0x2b2181,
  botNumber: _0x4ff04d,
  pushname: _0x181cf5,
  isMe: _0x4b2e8c,
  isOwner: _0x13afbe,
  groupMetadata: _0x4a3b13,
  groupName: _0x4dbc72,
  participants: _0x348e11,
  groupAdmins: _0x40d1da,
  isBotAdmins: _0x117d8e,
  isAdmins: _0x5d8ab2,
  reply: _0x1f0567
}) => {
  try {
    if (!_0x44c273) {
      return _0x1f0567("Please give me a URL or title.");
    }
    _0x44c273 = convertYouTubeLink(_0x44c273);
    const _0x5d23a1 = await yts(_0x44c273);
    const _0x592bc6 = _0x5d23a1.videos[0x0];
    const _0x52614c = _0x592bc6.url;
    let _0x34af34 = "\n*𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 𝐌𝐔𝐒𝐈𝐂*\n┏━━━━━━━━━━━━━\n*Qᴜᴇᴇɴ ʀᴀꜱʜᴜ ᴍᴅ ꜱᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅ*\n┗━━━━━━━━━━━━━\n┏━━━━━━━━━━━━━━\n*❍ᴛɪᴛʟᴇ :* " + _0x592bc6.title + "\n*❍ᴅᴜʀᴀᴛɪᴏɴ :* " + _0x592bc6.timestamp + "\n*❍ᴠɪᴇᴡꜱ :* " + _0x592bc6.views + "\n*❍ᴜᴘʟᴏᴀᴅ ᴏɴ :* " + _0x592bc6.ago + "\n┗━━━━━━━━━━━━━━━\n\n\n🔢 *ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴛᴏ*\n*ᴅᴏᴡɴʟᴏᴀᴅ ꜰʀᴏᴍᴀᴛ*\n\n*ᴅᴏᴡɴʟᴏᴀᴅ ᴀᴜᴅɪᴏ 🎧*\n\n*1*     ┃  *ᴀᴜᴅɪᴏ*\n\n*ᴅᴏᴡɴʟᴏᴀᴅ ᴅᴏᴄᴜᴍᴇɴᴛ 📁*\n\n*2*     ┃  *ᴅᴏᴄᴜᴍᴇɴᴛ*\n\n> *𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ❀*\n";
    const _0x465005 = await _0xd441b6.sendMessage(_0x1089ae, {
      'image': {
        'url': _0x592bc6.thumbnail
      },
      'caption': _0x34af34
    }, {
      'quoted': _0x3cb21e
    });
    const _0x39b395 = _0x465005.key.id;
    _0xd441b6.ev.on('messages.upsert', async _0x5f1d1c => {
      const _0x1d729a = _0x5f1d1c.messages[0x0];
      if (!_0x1d729a.message) {
        return;
      }
      const _0x21b8a6 = _0x1d729a.message.conversation || _0x1d729a.message.extendedTextMessage?.["text"];
      const _0x480efc = _0x1d729a.key.remoteJid;
      const _0x117939 = _0x1d729a.message.extendedTextMessage && _0x1d729a.message.extendedTextMessage.contextInfo.stanzaId === _0x39b395;
      if (_0x117939) {
        await _0xd441b6.sendMessage(_0x480efc, {
          'react': {
            'text': '⬇️',
            'key': _0x1d729a.key
          }
        });
        const _0x410255 = await fetchJson("https://www.dark-yasiya-api.site/download/ytmp3?url=" + _0x52614c);
        const _0x5bcd73 = _0x410255.result.dl_link;
        await _0xd441b6.sendMessage(_0x480efc, {
          'delete': _0x465005.key
        });
        await _0xd441b6.sendMessage(_0x480efc, {
          'react': {
            'text': '⬆️',
            'key': _0x1d729a.key
          }
        });
        if (_0x21b8a6 === '1') {
          await _0xd441b6.sendMessage(_0x480efc, {
            'audio': {
              'url': _0x5bcd73
            },
            'mimetype': "audio/mpeg",
            'contextInfo': {
              'externalAdReply': {
                'title': _0x592bc6.title,
                'body': _0x592bc6.videoId,
                'mediaType': 0x1,
                'sourceUrl': _0x592bc6.url,
                'thumbnailUrl': _0x592bc6.thumbnail,
                'renderLargerThumbnail': true,
                'showAdAttribution': true
              }
            }
          }, {
            'quoted': _0x1d729a
          });
          await _0xd441b6.sendMessage(_0x480efc, {
            'react': {
              'text': '✅',
              'key': _0x1d729a.key
            }
          });
        } else if (_0x21b8a6 === '2') {
          await _0xd441b6.sendMessage(_0x480efc, {
            'document': {
              'url': _0x5bcd73
            },
            'mimetype': 'audio/mp3',
            'fileName': _0x592bc6.title + ".mp3",
            'caption': "\n*©regards frediezra*\n "
          }, {
            'quoted': _0x1d729a
          });
          await _0xd441b6.sendMessage(_0x480efc, {
            'react': {
              'text': '✅',
              'key': _0x1d729a.key
            }
          });
        }
      }
    });
  } catch (_0x2f7fdf) {
    console.log(_0x2f7fdf);
    _0x1f0567('' + _0x2f7fdf);
  }
});

cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: '.yts sameer kutti',
    react: "🔎",
    desc: "Search and get details from youtube.",
    category: "search",
    filename: __filename

},

async(conn, mek, m,{from, l, quoted, body, isCmd, umarmd, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!q) return reply('*Please give me words to search*')
try {
let yts = require("yt-search")
var arama = await yts(q);
} catch(e) {
    l(e)
return await conn.sendMessage(from , { text: '*Error !!*' }, { quoted: mek } )
}
var mesaj = '';
arama.all.map((video) => {
mesaj += ' *📍' + video.title + '*\n🌟📃 ' + video.url + '\n\n\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*'
});
await conn.sendMessage(from , { text:  mesaj }, { quoted: mek } )
} catch (e) {
    l(e)
  reply('*Error !!*')
}
});

cmd({
  'pattern': "video999999999999999999",
  'desc': "To download videos.",
  'react': '🎥',
  'category': "download",
  'filename': __filename
}, async (_0x12976e, _0x2a3b25, _0x5c4c02, {
  from: _0x27b1b7,
  quoted: _0x21397c,
  body: _0x5e42b7,
  isCmd: _0xce8649,
  command: _0x338d66,
  args: _0x2d3e67,
  q: _0x5aa0b2,
  isGroup: _0x3c88ab,
  sender: _0x5932f6,
  senderNumber: _0x4eac87,
  botNumber2: _0x58efd9,
  botNumber: _0x54ed3d,
  pushname: _0x21c577,
  isMe: _0x72c003,
  isOwner: _0x20026d,
  groupMetadata: _0x52226e,
  groupName: _0x2b5bf8,
  participants: _0xb68b13,
  groupAdmins: _0x305183,
  isBotAdmins: _0x1e8337,
  isAdmins: _0x54abb9,
  reply: _0x26c04d
}) => {
  try {
    if (!_0x5aa0b2) {
      return _0x26c04d("Please give me a URL or title.");
    }
    _0x5aa0b2 = convertYouTubeLink(_0x5aa0b2);
    const _0x3c79a1 = await yts(_0x5aa0b2);
    const _0x30702a = _0x3c79a1.videos[0x0];
    const _0x3af288 = _0x30702a.url;
    let _0x5ed924 = "\n*✧FREDI MD✧ VIDEO*\n\n┏━━━━━━━━━━━━━\n┃*Rhodvick ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅ ✻*\n┗━━━━━━━━━━━━━\n┏━━━━━━━━━━━━━━\n❍*ᴛɪᴛʟᴇ :* " + _0x30702a.title + "\n*❍ᴅᴜʀᴀᴛɪᴏɴ :* " + _0x30702a.timestamp + "\n❍*ᴠɪᴇᴡꜱ :* " + _0x30702a.views + "\n❍*ᴜᴘʟᴏᴀᴅ ᴏɴ :* " + _0x30702a.ago + "\n━━━━━━━━━━━━━━━\n\n\n🔢 *ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴛᴏ*\n*ᴅᴏᴡɴʟᴏᴀᴅ ꜰʀᴏᴍᴀᴛ*\n\n*ᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏ 🎬*\n\n*1.1*     ┃  *360ᴘ*\n*1.2*     ┃  *480ᴘ*\n*1.3*     ┃  *720ᴘ*\n*1.4*     ┃  *1080ᴘ*\n\n*ᴅᴏᴡɴʟᴏᴀᴅ ᴅᴏᴄᴜᴍᴇɴᴛ 📁*\n\n*2.1*     ┃  *360ᴘ*\n*2.2*     ┃  *480ᴘ*\n*2.3*     ┃  *720ᴘ*\n*2.4*     ┃  *1080ᴘ*\n\n> *©regards frediezra♡*\n";
    const _0x1d50f1 = await _0x12976e.sendMessage(_0x27b1b7, {
      'image': {
        'url': _0x30702a.thumbnail
      },
      'caption': _0x5ed924
    }, {
      'quoted': _0x2a3b25
    });
    ;
    const _0x1f40a6 = _0x1d50f1.key.id;
    _0x12976e.ev.on('messages.upsert', async _0x293b2b => {
      const _0x1411c6 = _0x293b2b.messages[0x0];
      if (!_0x1411c6.message) {
        return;
      }
      const _0x1a87a3 = _0x1411c6.message.conversation || _0x1411c6.message.extendedTextMessage?.["text"];
      const _0x607759 = _0x1411c6.key.remoteJid;
      const _0x1639d9 = _0x1411c6.message.extendedTextMessage && _0x1411c6.message.extendedTextMessage.contextInfo.stanzaId === _0x1f40a6;
      if (_0x1639d9) {
        await _0x12976e.sendMessage(_0x607759, {
          'react': {
            'text': '⬇️',
            'key': _0x1411c6.key
          }
        });
        if (_0x1a87a3 === "1.1") {
          const _0x3b3014 = await ytmp4('' + _0x3af288, "360p");
          await _0x12976e.sendMessage(_0x607759, {
            'delete': _0x1d50f1.key
          });
          await _0x12976e.sendMessage(_0x607759, {
            'react': {
              'text': '⬆️',
              'key': _0x1411c6.key
            }
          });
          await _0x12976e.sendMessage(_0x607759, {
            'video': {
              'url': _0x3b3014
            },
            'caption': "\n> *©regards FrediEzra*\n"
          }, {
            'quoted': _0x1411c6
          });
          await _0x12976e.sendMessage(_0x607759, {
            'react': {
              'text': '✅',
              'key': _0x1411c6.key
            }
          });
        } else {
          if (_0x1a87a3 === "1.2") {
            const _0x2f1c03 = await ytmp4('' + _0x3af288, "480");
            await _0x12976e.sendMessage(_0x607759, {
              'delete': _0x1d50f1.key
            });
            await _0x12976e.sendMessage(_0x607759, {
              'react': {
                'text': '⬆️',
                'key': _0x1411c6.key
              }
            });
            await _0x12976e.sendMessage(_0x607759, {
              'video': {
                'url': _0x2f1c03
              },
              'caption': "\n> *©regards frediezra*\n"
            }, {
              'quoted': _0x1411c6
            });
            await _0x12976e.sendMessage(_0x607759, {
              'react': {
                'text': '✅',
                'key': _0x1411c6.key
              }
            });
          } else {
            if (_0x1a87a3 === "1.3") {
              const _0x28e0f3 = await ytmp4('' + _0x3af288, '720');
              await _0x12976e.sendMessage(_0x607759, {
                'delete': _0x1d50f1.key
              });
              await _0x12976e.sendMessage(_0x607759, {
                'react': {
                  'text': '⬆️',
                  'key': _0x1411c6.key
                }
              });
              await _0x12976e.sendMessage(_0x607759, {
                'video': {
                  'url': _0x28e0f3
                },
                'caption': "\n> *©regards frediezra*\n"
              }, {
                'quoted': _0x1411c6
              });
              await _0x12976e.sendMessage(_0x607759, {
                'react': {
                  'text': '✅',
                  'key': _0x1411c6.key
                }
              });
            } else {
              if (_0x1a87a3 === '1.4') {
                const _0x153d70 = await ytmp4('' + _0x3af288, "1080");
                await _0x12976e.sendMessage(_0x607759, {
                  'delete': _0x1d50f1.key
                });
                await _0x12976e.sendMessage(_0x607759, {
                  'react': {
                    'text': '⬆️',
                    'key': _0x1411c6.key
                  }
                });
                await _0x12976e.sendMessage(_0x607759, {
                  'video': {
                    'url': _0x153d70
                  },
                  'caption': "\n> *©regards frediezra*\n"
                }, {
                  'quoted': _0x1411c6
                });
                await _0x12976e.sendMessage(_0x607759, {
                  'react': {
                    'text': '✅',
                    'key': _0x1411c6.key
                  }
                });
              } else {
                if (_0x1a87a3 === '2.1') {
                  const _0x416b0c = await ytmp4('' + _0x3af288, '360');
                  await _0x12976e.sendMessage(_0x607759, {
                    'delete': _0x1d50f1.key
                  });
                  await _0x12976e.sendMessage(_0x607759, {
                    'react': {
                      'text': '⬆️',
                      'key': _0x1411c6.key
                    }
                  });
                  await _0x12976e.sendMessage(_0x607759, {
                    'document': {
                      'url': _0x416b0c
                    },
                    'mimetype': "video/mp4",
                    'fileName': _0x30702a.title + ".mp4",
                    'caption': "\n> *©regards frediezra*\n"
                  }, {
                    'quoted': _0x1411c6
                  });
                  await _0x12976e.sendMessage(_0x607759, {
                    'react': {
                      'text': '✅',
                      'key': _0x1411c6.key
                    }
                  });
                } else {
                  if (_0x1a87a3 === "2.2") {
                    const _0x31f905 = await ytmp4('' + _0x3af288, "480");
                    await _0x12976e.sendMessage(_0x607759, {
                      'delete': _0x1d50f1.key
                    });
                    await _0x12976e.sendMessage(_0x607759, {
                      'react': {
                        'text': '⬆️',
                        'key': _0x1411c6.key
                      }
                    });
                    await _0x12976e.sendMessage(_0x607759, {
                      'document': {
                        'url': _0x31f905
                      },
                      'mimetype': "video/mp4",
                      'fileName': _0x30702a.title + '.mp4',
                      'caption': "\n> *©regards frediezra*\n"
                    }, {
                      'quoted': _0x1411c6
                    });
                    await _0x12976e.sendMessage(_0x607759, {
                      'react': {
                        'text': '✅',
                        'key': _0x1411c6.key
                      }
                    });
                  } else {
                    if (_0x1a87a3 === '2.3') {
                      const _0x213ca9 = await ytmp4('' + _0x3af288, "720");
                      await _0x12976e.sendMessage(_0x607759, {
                        'delete': _0x1d50f1.key
                      });
                      await _0x12976e.sendMessage(_0x607759, {
                        'react': {
                          'text': '⬆️',
                          'key': _0x1411c6.key
                        }
                      });
                      await _0x12976e.sendMessage(_0x607759, {
                        'document': {
                          'url': _0x213ca9
                        },
                        'mimetype': "video/mp4",
                        'fileName': _0x30702a.title + '.mp4',
                        'caption': "\n> *©regards frediezra*\n"
                      }, {
                        'quoted': _0x1411c6
                      });
                      await _0x12976e.sendMessage(_0x607759, {
                        'react': {
                          'text': '✅',
                          'key': _0x1411c6.key
                        }
                      });
                    } else {
                      if (_0x1a87a3 === "2.4") {
                        const _0x4d2276 = await ytmp4('' + _0x3af288, "1080");
                        await _0x12976e.sendMessage(_0x607759, {
                          'delete': _0x1d50f1.key
                        });
                        await _0x12976e.sendMessage(_0x607759, {
                          'react': {
                            'text': '⬆️',
                            'key': _0x1411c6.key
                          }
                        });
                        await _0x12976e.sendMessage(_0x607759, {
                          'document': {
                            'url': _0x4d2276
                          },
                          'mimetype': "video/mp4",
                          'fileName': _0x30702a.title + ".mp4",
                          'caption': "\n> *©regards frediezra*\n"
                        }, {
                          'quoted': _0x1411c6
                        });
                        await _0x12976e.sendMessage(_0x607759, {
                          'react': {
                            'text': '✅',
                            'key': _0x1411c6.key
                          }
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  } catch (_0x50fc65) {
    console.log(_0x50fc65);
    _0x26c04d('' + _0x50fc65);
  }
});
cmd({
  'pattern': "yta",
  'alias': "ytmp3",
  'react': '⬇️',
  'dontAddCommandList': true,
  'filename': __filename
}, async (_0x260936, _0x133e2e, _0x4417dd, {
  from: _0x4be619,
  q: _0x38df3a,
  reply: _0x25afc5
}) => {
  try {
    if (!_0x38df3a) {
      return await _0x25afc5("*Need a YouTube URL!*");
    }
    const _0xc7919b = await fetchJson("https://www.dark-yasiya-api.site/download/ytmp3?url=" + _0x38df3a);
    const _0x50409b = _0xc7919b.result.dl_link;
    await _0x260936.sendMessage(_0x4be619, {
      'audio': {
        'url': _0x50409b
      },
      'mimetype': "audio/mpeg"
    }, {
      'quoted': _0x133e2e
    });
  } catch (_0x42ce9e) {
    console.log("First attempt failed:", _0x42ce9e);
    try {
      const _0x10e500 = await dlyta(_0x38df3a);
      await _0x260936.sendMessage(_0x4be619, {
        'audio': {
          'url': _0x10e500.dl_link
        },
        'mimetype': 'audio/mpeg'
      }, {
        'quoted': _0x133e2e
      });
    } catch (_0x154bfe) {
      console.log("Second attempt failed:", _0x154bfe);
      await _0x25afc5("*Failed to process the request. Please try again later!*");
    }
  }
});

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
    pattern: "video123456789",
    alias: ["video2253728191", "ytvideo3627181910", "ytdl152666556677789000"],
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

cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner }) => {
    if (config.AUTO_TYPING === 'true') {
        await conn.sendPresenceUpdate('composing', from); // send typing 
    }
});

cmd({
  on: "body"
},
async (conn,mek, m, { from, body, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
    try {
    
        const badWords = ["wtf", "mia", "xxx","fuck","sex","huththa","pakaya","ponnaya","hutto"]
        if (!isGroup || isAdmins || !isBotAdmins) return; // Skip if not in group, or sender is admin, or bot is not admin
      
        const lowerCaseMessage = body.toLowerCase();
        const containsBadWord = badWords.some(word => lowerCaseMessage.includes(word));
        
        if (containsBadWord & config.ANTI_BAD_WORD === 'true') {
          await conn.sendMessage(from, { delete: mek.key }, { quoted: mek });
          await conn.sendMessage(from, { text: "🚫 ⚠️BAD WORDS NOT ALLOWED⚠️ 🚫" }, { quoted: mek });
        }
    } catch (error) {
        console.error(error)
        reply("An error occurred while processing the message.")
    }
})


const linkPatterns = [
    /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,   // WhatsApp group or chat links
    /wa\.me\/\S+/gi,                                      // wa.me links without https
    /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,           // Telegram links
    /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,           // YouTube links
    /https?:\/\/youtu\.be\/\S+/gi,                        // YouTube short links
    /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,          // Facebook links
    /https?:\/\/fb\.me\/\S+/gi,                           // Facebook short links
    /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,         // Instagram links
    /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,           // Twitter links
    /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,            // TikTok links
    /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,          // LinkedIn links
    /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,          // Snapchat links
    /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,         // Pinterest links
    /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,            // Reddit links
    /https?:\/\/ngl\/\S+/gi,                              // NGL links
    /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,           // Discord links
    /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,             // Twitch links
    /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,             // Vimeo links
    /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,       // Dailymotion links
    /https?:\/\/(?:www\.)?medium\.com\/\S+/gi             // Medium links
];

cmd({
    on: "body"
}, async (conn, mek, m, { from, body, sender, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup || isAdmins || !isBotAdmins) return; // Skip if not in group, or sender is admin, or bot is not admin

        const containsLink = linkPatterns.some(pattern => pattern.test(body));

        if (containsLink && config.ANTI_LINK === 'true') {
            // Delete the message
            await conn.sendMessage(from, { delete: mek.key }, { quoted: mek });

            // Warn the user
            await conn.sendMessage(from, { text: `⚠️ Links are not allowed in this group.\n@${sender.split('@')[0]} has been removed. 🚫`, mentions: [sender] }, { quoted: mek });

            // Remove the user from the group
            await conn.groupParticipantsUpdate(from, [sender], 'remove');
        }
    } catch (error) {
        console.error(error);
        reply("An error occurred while processing the message.");
    }
});

// play2

cmd({
    pattern: "song999999999999",
    alias: ["audio255567788","ytdl245667889","ytsong2778000"],
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

const command = {
  pattern: "removebg",
  alias: ["rbg", "bgremove"],
  react: "🖇",
  desc: "Remove the background from an image.",
  category: "image",
  use: ".removebg",
  filename: __filename
};

cmd(command, async (client, message, args, { from, quoted, reply }) => {
  try {
    let quotedMessage = quoted ? quoted : message;
    let mimetype = quotedMessage.msg?.mimetype || '';

    if (!mimetype || !mimetype.startsWith("image/")) {
      throw "🌻 Please reply to an image.";
    }

    let downloadedImage = await quotedMessage.download();
    if (!downloadedImage) {
      throw "Failed to download the image. Please try again.";
    }

    const path = require("path");
    const FormData = require("form-data");
    const axios = require("axios");
    const os = require("os");
    const fs = require("fs");

    let tempFilePath = path.join(os.tmpdir(), "tempImage.png");
    fs.writeFileSync(tempFilePath, downloadedImage);

    let formData = new FormData();
    formData.append("image", fs.createReadStream(tempFilePath));

    let uploadResponse = await axios.post("https://api.imgbb.com/1/upload?key=06d00f0e4520243a32b58138765a2ecc", formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    if (!uploadResponse.data || !uploadResponse.data.data.url) {
      fs.unlinkSync(tempFilePath);
      throw "❌ Error uploading the file. Please try again.";
    }

    let imageUrl = uploadResponse.data.data.url;
    let removeBgApiUrl = `https://api.nexoracle.com/image-processing/remove-bg?apikey=RDB9bTxrjAf71NFHd&img=${imageUrl}`;

    const imagePayload = {
      url: removeBgApiUrl
    };
    const messagePayload = {
      image: imagePayload,
      caption: "> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*"
    };
    const sendMessageOptions = {
      quoted: message
    };

    await client.sendMessage(from, messagePayload, sendMessageOptions);
    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error(error);
    reply("❌ An error occurred: " + (error.message || error));
  }
});

const img2UrlCommand = {
  pattern: "img2url",
  react: "🔗",
  alias: ["tourl","url","imgurl","telegraph","imgtourl"]
};

function helperFunction(param1, param2, param3, param4, param5) {
  return someOtherFunction(param4 - 0xe8, param3); // Needs context for `someOtherFunction`
}

img2UrlCommand.category = "convert";
img2UrlCommand.use = ".img2url <reply image>";
img2UrlCommand.filename = __filename;

cmd(img2UrlCommand, async (context, args, utils, { reply, quoted }) => {
  try {
    const { image2url } = require("@dark-yasiya/imgbb.js");
    const isViewOnceMessage = quoted ? quoted.type === "viewOnceMessage" : false;
    const isImageMessage = quoted
      ? quoted.type === "imageMessage" || (isViewOnceMessage ? quoted.msg.type === "imageMessage" : false)
      : false;

    if (utils.type === "imageMessage" || isImageMessage) {
      const randomFileName = getRandom('');
      const downloadedFile = isImageMessage
        ? await quoted.download(randomFileName)
        : await utils.download(randomFileName);
      const fileType = await require('file-type').fromBuffer(downloadedFile);

      if (!fileType || (fileType.ext !== "jpg" && fileType.ext !== "png")) {
        return reply("Only JPG or PNG images are supported!");
      }

      const savedFilePath = `./${randomFileName}.${fileType.ext}`;
      await require('fs').promises.writeFile(savedFilePath, downloadedFile);

      const uploadedImageUrl = await image2url(savedFilePath);
      console.log(uploadedImageUrl);
      await reply(
        `📍 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 𝐔𝐑𝐋 𝐆𝐄𝐍𝐀𝐑𝐀𝐓𝐄𝐃:\n\n\n${uploadedImageUrl.result.url}\n\n\n> *© 𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ✾*`
      );

      await require('fs').promises.unlink(savedFilePath);
    } else {
      reply("⚠️ Please reply to an image message.");
    }
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing the image.");
  }
});


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
│ ➽ *botupdate*
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
    alias: ["botupdate1111"],
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
    return reply("❌ You Are Not The 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 Owner !");
  }
      const { exec } = require("child_process");
      reply("Restarting And Updating 𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃...");
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
    pattern: "owner",
    react: "☠️", // Reaction emoji when the command is triggered
    alias: ["rashu", "king"],
    desc: "Get owner number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from }) => {
    try {
        // Owner's contact info
        const ownerNumber = '+94727319036'; // Replace this with the actual owner number
        const ownerName = '> *𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃*'; // Replace this with the owner's name
        const organization = '*𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 WHATSAPP BOT DEVALOPER 💗🧚‍♂️'; // Optional: replace with the owner's organization

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
            text: `This is the owner's contact: ${ownerName}\n\n\ > *𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ❀*`,
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
    pattern: "setautobio123456",
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
