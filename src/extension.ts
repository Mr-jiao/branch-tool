import * as vscode from 'vscode'
const handleCreate = require('./handleCreate')
const handleMergeToTest = require('./handleMergeToTest')

export function activate(context: vscode.ExtensionContext) {
	const createDisposable = vscode.commands.registerCommand('heye-branch-tool.createBranch', () => {
		handleCreate(vscode)
	});

	const mergeDisposable = vscode.commands.registerCommand('heye-branch-tool.mergeToTest', () => {
		handleMergeToTest(vscode)
	});

	context.subscriptions.push(createDisposable)
	context.subscriptions.push(mergeDisposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
