const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');
const util = require('util');

// Promisify the fs.readFile function
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function run() {
  try {
    // Get inputs
    const pattern = core.getInput('pattern');
    const useRegex = core.getInput('use-regex');
    const replacement = core.getInput('replacement');
    const files = core.getInput('files').split(',');

    // Loop over each file and replace content
    for (const filePath of files) {
      const fullPath = path.resolve(filePath.trim());
      const content = await readFileAsync(fullPath, 'utf8');

      let newContent;
      if (useRegex) {
        const regex = new RegExp(pattern, 'g');
        newContent = content.replace(regex, replacement);
      } else {
        newContent = content.split(pattern).join(replacement);
      }

      // Write new content to file
      await writeFileAsync(fullPath, newContent, 'utf8');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
