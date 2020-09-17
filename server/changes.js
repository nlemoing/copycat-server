const { resolve } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const { execSync } = require('child_process');

const { transform } = require('@codemod/core');

const SRC_DIR = resolve("./buyflow-client/src");

function handleChanges(body) {
    const changesByFile = {};
    body.changes.forEach(({ location, text: change }) => {
        let [filename, line, column] = location.split(':');
        filename = resolve(SRC_DIR, filename);
        line = parseInt(line);
        column = parseInt(column);
        
        if (filename in changesByFile) {
            changesByFile[filename].push({ line, column, change });
        } else {
            changesByFile[filename] = [{ line, column, change }];
        }
    })

    Object.entries(changesByFile).forEach(([filename, changes]) => {
        const code = readFileSync(filename, "utf-8");
        const output = transform(code, {
            plugins: [
                [ resolve(__dirname, "./plugin.js"), { changes } ],
            ]
        });
        writeFileSync(filename, output.code);
    });

    if (body.branch) {
        execSync(`./scripts/commit_to_branch.sh ${body.branch}`)
    }
}

module.exports = {
    handleChanges,
};
