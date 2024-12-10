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
        placeHolder: '请选择要反合master的分支',
    })

    // 拉取 master 分支最新代码
    if (currentBranch !== 'master') {
        try {
            await git.checkout('master')
        } catch (ex:any) {
            vscode.window.showInformationMessage(`切换到master失败:${ex.message}`)
            return
        }
    }

    try {
        await git.pull()
    } catch (ex:any) {
        vscode.window.showInformationMessage(`拉取master分支失败:${ex.message}`)
        return
    }

    try {
        await git.checkout(mergingBranchName)
    } catch (ex:any) {
        vscode.window.showInformationMessage(`切换到${mergingBranchName}分支失败:${ex.message}`)
        return
    }

    try {
        const mergeResult = await git.merge(['master', '--no-ff'])

        if (mergeResult && mergeResult.result === 'success') {
            vscode.window.showInformationMessage(`${mergingBranchName} 反合 master 分支成功`)
        }
    } catch (ex: any) {
        vscode.window.showInformationMessage(`反合 master 分支失败:${ex.message}`)
        return
    }

    await git.checkout(mergingBranchName)
}

module.exports = handleMergeMaster
