const vscode = require('vscode');

const outputChannel = vscode.window.createOutputChannel('codesandboxer');

function log(msg) {
    console.log(msg);
    outputChannel.appendLine(msg);
}

module.exports = log;
