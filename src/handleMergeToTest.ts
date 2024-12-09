const { simpleGit } = require('simple-git')
const { checkGit } = require('./utils/check')

const handleMergeToTest = async (vscode: any) => {
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

    if (currentBranch !== 'test') {
        try {
            await git.checkout('test')
        } catch (ex: any) {
            vscode.window.showInformationMessage(`切换到test分支失败:${ex.message}`)
            return
        }
    }

    try {
        await git.pull()
    } catch (ex: any) {
        vscode.window.showInformationMessage(`拉取test分支失败:${ex.message}`)
        return
    }

    try {
        const mergeResult = await git.merge([mergingBranchName, '--no-ff'])

        if (mergeResult && mergeResult.result === 'success') {
            vscode.window.showInformationMessage(`${mergingBranchName}合并到test分支成功`)
        }
    } catch (ex: any) {
        vscode.window.showInformationMessage(`合并分支失败:${ex.message}`)
        return
    }

    try {
        await git.push('origin', 'test')
        vscode.window.showInformationMessage('推送test分支成功')
    } catch (ex: any) {
        vscode.window.showInformationMessage(`推送test分支失败:${ex.message}`)
    }

    await git.checkout(currentBranch)
}

module.exports = handleMergeToTest
