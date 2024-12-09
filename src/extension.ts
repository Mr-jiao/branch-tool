import * as vscode from 'vscode'
const handleCreate = require('./handleCreate')

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('branch-tool.createBranch', () => {
		handleCreate(vscode)
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
