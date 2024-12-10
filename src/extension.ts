import * as vscode from 'vscode'
const handleCreate = require('./handleCreate')
const handleMergeToTest = require('./handleMergeToTest')
const handleMergeMaster = require('./handleMergeMaster')

export function activate(context: vscode.ExtensionContext) {
	const createDisposable = vscode.commands.registerCommand('heye-branch-tool.createBranch', () => {
		handleCreate(vscode)
	})

	const mergeToTestDisposable = vscode.commands.registerCommand('heye-branch-tool.mergeToTest', () => {
		handleMergeToTest(vscode)
	})

	const mergeMasterDisposable = vscode.commands.registerCommand('heye-branch-tool.mergeMaster', () => {
		handleMergeMaster(vscode)
	})

	context.subscriptions.push(createDisposable)
	context.subscriptions.push(mergeToTestDisposable)
	context.subscriptions.push(mergeMasterDisposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
