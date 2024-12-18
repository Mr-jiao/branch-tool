const ncp = require('copy-paste')
const initGit = require('./utils/initGit')

const handleCopyBranch = async (vscode: any) => {
    const git = await initGit(vscode)
    if (!git) {
        return
    }

    const localBranch = await git.branchLocal()

    const branchName: string = await vscode.window.showQuickPick(localBranch.all, {
        placeHolder: '请选择要复制的分支',
    })

    if (!branchName) {
        return
    }

    try {
        await ncp.copy(branchName)
        vscode.window.showInformationMessage('复制分支成功')
    } catch(ex: any) {
        vscode.window.showInformationMessage(`复制分支失败:${ex.message}`)
    }
}

module.exports = handleCopyBranch