const axios = require("axios");
const fetch = require("node-fetch");
const {
  sleep
} = require("../lib/functions");
const {
  cmd,
  commands
} = require('../command');
cmd({
  pattern: "alive2",
  desc: "bbh.",
  category: "loading alive",
  react: '👋',
  filename: __filename
}, async (client, message, args, { from, reply }) => {
  try {
    const sentMessage = await client.sendMessage(from, { text: '> *𝐐𝐔𝐄𝐄𝐍 𝐑𝐀𝐒𝐇𝐔 𝐌𝐃 𝐀𝐋𝐈𝐕𝐄*' });
    const heartSequence = ['Loading . . . ', 'Nipun Harshana', '▰▰▰▱▱▱▱▱▱▱▱▱ 10%', '▰▰▰▰▱▱▱▱▱▱▱▱ 20%', '▰▰▰▰▰▱▱▱▱▱▱▱ 30%', '▰▰▰▰▰▰▱▱▱▱▱▱ 40%', '▰▰▰▰▰▰▰▱▱▱▱▱ 50%', '▰▰▰▰▰▰▰▰▱▱▱▱ 60%', '▰▰▰▰▰▰▰▰▰▱▱▱ 70%', '▰▰▰▰▰▰▰▰▰▰▱▱ 80%', '▰▰▰▰▰▰▰▰▰▰▰▱ 90%', '▰▰▰▰▰▰▰▰▰▰▰▰ 100%', 'COMPLETE LOADING ☘️👋','ALIVE NOW', '𝐻𝑦𝑒 👋 𝐼 𝐴𝑚 𝑸𝒖𝒆𝒆𝒏 𝑹𝒂𝒔𝒉𝒖 𝑴𝒅\n\n\n* *𝕆𝕎ℕ𝔼ℝ ℕ𝕌𝕄𝔹𝔼ℝ𝕊 :* _wa.me/94727319036_\n* *𝕆𝕎ℕ𝔼ℝ ℕ𝔸𝕄𝔼 :* _𝘊𝘠𝘉𝘌𝘙 𝘙𝘜𝘚𝘏 𝘔𝘖𝘋𝘡_\n* *𝔹𝕆𝕋 ℕ𝔸𝕄𝔼 :* _𝘘𝘜𝘌𝘌𝘕 𝘙𝘈𝘚𝘏𝘜 𝘔𝘋_\n\n> *𝙿𝙾𝚆𝙴𝙰𝚁𝙳 𝙱𝚈 𝚀𝚄𝙴𝙴𝙽 𝚁𝙰𝚂𝙷𝚄 𝙼𝙳 ❀*'];

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
    reply("❌ *Error!* " + error.message);
  }
});