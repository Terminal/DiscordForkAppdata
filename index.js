const Eris = require('eris');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const config = require('./config.json');

const client = new Eris.Client(config.token);

// If forkdata doesn't exist, clone
if (!fs.existsSync(path.join(__dirname, 'forkdata'))) {
  child_process.exec(`git clone ${config.github} -b gh-pages forkdata`);
  child_process.exec('git config user.name "DiscordForkAppdata"', {
    cwd: path.join(__dirname, 'forkdata')
  });
  child_process.exec('git config user.email "terminal@discordmail.com"', {
    cwd: path.join(__dirname, 'forkdata')
  });
}

client.on('ready', () => {
  console.log('Ready!');
});

const nullThen = () => {};

client.on('messageCreate', (message) => {
  if (message.author.id === client.user.id) return;
  if (config.owners.includes(message.author.id) && message.content === '£push') {
    child_process.exec('git add .', {
      cwd: path.join(__dirname, 'forkdata')
    });
    child_process.exec(`git commit -m "Manual push by ${message.author.username.replace(/"/g, '\\"')} via Discord"`, {
      cwd: path.join(__dirname, 'forkdata')
    });
    child_process.exec('git push', {
      cwd: path.join(__dirname, 'forkdata')
    }, (error, stdout, stderr) => {
      if (error) {
        message.channel.createMessage(`Error running command:\n${error.message}`).then(nullThen).catch(nullThen);
      } else {
        message.channel.createMessage(`\`\`\`\nstdout\n${stdout}\n\nstderr\n${stderr}\`\`\``).then(nullThen).catch(nullThen);
      }
    });
  } else {
    try {
      const inData = JSON.parse(message.content);
  
      if (typeof inData === 'object' && inData.for === config.for) {
        const outData = {};
        const botCount = parseInt(inData.botCount) || 0;
        if (botCount) outData.botCount = botCount;
  
        const fileData = JSON.stringify(outData) + '\n';
  
        fs.writeFile(path.join(__dirname, 'forkdata', `${message.author.id}.json`), fileData, { encoding: 'utf8' }, (error) => {
          if (error) {
            message.channel.createMessage(`Error writing to file:\n${error.message}`).then(nullThen).catch(nullThen);
          } else {
            message.channel.createMessage(`Successfully wrote to file:\n${fileData}`).then(nullThen).catch(nullThen);
          }
        })
      }
    } catch (e) {
      console.log(e);
      // message.channel.createMessage(`Error encountered:\n${e.message}`);
    }
  }
});

client.connect();
