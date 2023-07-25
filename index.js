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
    console.log(`Pattern: ${pattern}`);

    const useRegex = core.getInput('use-regex');
    console.log(`Use Regex: ${useRegex}`);

    const replacement = core.getInput('replacement');
    console.log(`Replacement: ${replacement}`);

    const files = core.getInput('files').split(',');
    console.log(`Files: ${files}`);

    // Loop over each file and replace content
    for (const filePath of files) {
      const fullPath = path.resolve(filePath.trim());
      console.log(`Full path: ${fullPath}`);

      const content = await readFileAsync(fullPath, 'utf8');
      console.log(`Original content: ${content}`);

      let newContent;
      if (useRegex) {
        const regex = new RegExp(pattern, 'g');
        newContent = content.replace(regex, replacement);
      } else {
        newContent = content.split(pattern).join(replacement);
      }

      console.log(`New content: ${newContent}`);

      // Write new content to file
      await writeFileAsync(fullPath, newContent, 'utf8');
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    core.setFailed(error.message);
  }
}

run();
