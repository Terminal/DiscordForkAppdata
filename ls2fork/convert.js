const input = require('./in.json');
const fs = require('fs');

input.forEach((data) => {
  let output = '---\n';
  if (data.id) {
    // Export the client_id without any characters
    output += `client_id: ${data.id.replace(/[^0-9]/g, '')}\n`;
  }

  if (data.name) {
    output += `pagename: '${data.name.replace(/'/g, "''")}'\n`;
  }

  if (data.shortDesc) {
    output += `description: '${data.shortDesc.replace(/'/g, "''")}'\n`;
  }

  if (data.avatar) {
    output += `avatar: '${data.avatar.replace(/'/g, "''")}'\n`;
  }

  if (data.invite) {
    output += `link: '${data.invite.replace(/'/g, "''")}'\n`
  }

  if (data.prefix) {
    output += `prefix: '${data.prefix.replace(/'/g, "''")}'\n`;
  }
  
  output += '---\n';

  if (data.type === 'markdown') {
    output += data.longDesc;
  } else if (data.type === 'html') {
    output += data.longDesc;
  } else if (data.type === 'iframe') {
    output += `<iframe src="${data.longDesc}" class="ls-iframe">`;
  }

  output += '\n<!--\nThis data was imported from ls.terminal.ink\n-->\n';

  fs.writeFileSync(`_bots/${data.id}.md`, output);
});
