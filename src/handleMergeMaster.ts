const { simpleGit } = require('simple-git')
const { checkGit } = require('./utils/check')

const handleMergeMaster = async (vscode: any) => {
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

    const mergingBranchName: string[] = await vscode.window.showQuickPick(localBranch.all, {
        placeHolder: '请选择要合并的分支',
    })
}

module.exports = handleMergeMaster
