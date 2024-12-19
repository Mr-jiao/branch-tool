const initGit = require('./utils/initGit')

const handleMergeToTest = async (vscode: any) => {
    const git = await initGit(vscode)
    if (!git) {
        return
    }

    const localBranch = await git.branchLocal()
    const currentBranch = localBranch.current

    const mergingBranchName: string = await vscode.window.showQuickPick(localBranch.all, {
        placeHolder: '请选择要合并的分支',
    })

    if(!mergingBranchName) {
        return
    }

    vscode.window.setStatusBarMessage('合并中...')

    if (currentBranch !== 'test') {
        try {
            await git.checkout('test')
        } catch (ex: any) {
            vscode.window.setStatusBarMessage('')
            vscode.window.showInformationMessage(`切换到test分支失败:${ex.message}`)
            return
        }
    }

    try {
        await git.pull()
    } catch (ex: any) {
        vscode.window.setStatusBarMessage('')
        vscode.window.showInformationMessage(`拉取test分支失败:${ex.message}`)
        return
    }

    try {
        const mergeResult = await git.merge([mergingBranchName, '--no-ff'])

        if (mergeResult && mergeResult.result === 'success') {
            vscode.window.setStatusBarMessage('')
            vscode.window.showInformationMessage(`${mergingBranchName}合并到test分支成功`)
        }
    } catch (ex: any) {
        vscode.window.setStatusBarMessage('')
        vscode.window.showInformationMessage(`合并分支失败:${ex.message}`)
        return
    }

    try {
        vscode.window.setStatusBarMessage('推送中...')
        await git.push('origin', 'test')
        vscode.window.setStatusBarMessage('')
        vscode.window.showInformationMessage('推送test分支成功')
    } catch (ex: any) {
        vscode.window.setStatusBarMessage('')
        vscode.window.showInformationMessage(`推送test分支失败:${ex.message}`)
    }

    await git.checkout(currentBranch)
}

module.exports = handleMergeToTest
