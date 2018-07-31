const Eris = require('eris');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const config = require('./config.json');

const client = new Eris.Client(config.token);

// If forkdata doesn't exist, clone
if (!fs.existsSync(path.join(__dirname, 'forkdata'))) {

}

client.on('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', (message) => {
  if (message.channel.id !== '353911657665396736') return;
  if (message.author.id === client.user.id) return;
  try {
    const inData = JSON.parse(message.content);

    if (typeof inData === 'object') {
      const outData = {};
      const botCount = parseInt(inData.botCount) || 0;
      if (botCount) outData.botCount = botCount;

      const fileData = JSON.stringify(outData);

      fs.writeFile(path.join(__dirname, 'forkdata', `${message.author.id}.json`), fileData, { encoding: 'utf8' }, (error) => {
        if (error) {
          message.channel.createMessage(`Error writing to file:\n${error.message}`);
        } else {
          message.channel.createMessage(`Successfully wrote to file:\n${fileData}`);
        }
      })
    }
  } catch (e) {
    message.channel.createMessage(`Error encountered:\n${e.message}`);
  }
});

client.connect();
