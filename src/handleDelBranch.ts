const { simpleGit } = require('simple-git')
const { checkGit } = require('./utils/check')


const handleDelBranch = async (vscode: any) => {
    // 获取工作区路径
    const filePath = vscode.workspace.workspaceFolders[0].uri.path
    const git = simpleGit(filePath, {
        binary: 'git',
    })

    const isPass = await checkGit(git, vscode)
    if (!isPass) {
        return
    }

    const localBranch = await git.branchLocal()
    const currentBranch = localBranch.current
    const deletingBranches: string[] = await vscode.window.showQuickPick(localBranch.all, {
        placeHolder: '请选择要删除的分支',
        canPickMany: true,
    })

    if (deletingBranches.includes(currentBranch)) {
        vscode.window.showErrorMessage(`当前分支${currentBranch}不能删除，请选择其他分支`)
        return
    }

    try {
        await git.deleteLocalBranches(deletingBranches, true)
        vscode.window.showInformationMessage('删除分支成功')
    } catch(ex:any) {
        vscode.window.showInformationMessage(`删除分支失败:${ex.message}`)
    }
}

module.exports = handleDelBranch
