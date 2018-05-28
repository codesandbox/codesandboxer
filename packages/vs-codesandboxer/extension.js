// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const csb = require('codesandboxer-fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.vs-codesandboxer', function () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let filePath = vscode.window.activeTextEditor.document.fileName;

        csb.assembleFilesAndPost(filePath).then(sandboxInfo => {
            vscode.window.showInformationMessage(`[Open file in codesandbox](${sandboxInfo.sandboxUrl})`);
        }).catch(e => {
          console.log('an error was thrown', e);
        });
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;
