const fs = require('fs');
const fm = require('front-matter');

const allFiles = [];

const done = () => {
  fs.writeFileSync('out.json', JSON.stringify(allFiles, null, 2));
}

fs.readdir('files', (err, files) => {
  files.forEach((file, index) => {
    fs.readFile(`files/${file}`, {
      encoding: 'utf8',
    }, (err1, text) => {
      const content = fm(text);
      // const output = {
      //   authors: [],
      //   contents: {
      //     en: {
      //       description: content.attributes.description,
      //       name: content.attributes.pagename,
      //       page: content.body
      //     }
      //   },
      //   github: {
      //     owner: content.attributes.github ? content.attributes.github.owner || null : null,
      //     repo: content.attributes.github ? content.attributes.github.repo || null : null
      //   },
      //   id: file.slice(0, -3),
      //   invite: content.attributes.link,
      //   oauth: null,
      //   trigger: {
      //     customisable: content.attributes.prefix ? content.attributes.prefix.includes('custom') : false,
      //     mentionable: false,
      //     prefix: content.attributes.prefix ? [...content.attributes.prefix.split(/ or /g)] : []
      //   }
      // }
      const output = {
        id: file.slice(0, -3),
        avatar: content.attributes.avatar
      }
      allFiles.push(output);
      if (index === files.length - 1) done();
    })
  })
})


