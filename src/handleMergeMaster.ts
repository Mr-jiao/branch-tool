const initGit = require('./utils/initGit')
const { showLoading, hideLoading } = require('./utils/ui')

const handleMergeMaster = async (vscode: any) => {
    const git = await initGit(vscode)
    if (!git) {
        return
    }

    const localBranch = await git.branchLocal()
    const currentBranch = localBranch.current

    const mergingBranchName: string = await vscode.window.showQuickPick(localBranch.all, {
        placeHolder: '请选择要反合master的分支',
    })

    if (!mergingBranchName) {
        return
    }

    showLoading('合并中...')

    // 拉取 master 分支最新代码
    if (currentBranch !== 'master') {
        try {
            await git.checkout('master')
        } catch (ex:any) {
            hideLoading()
            vscode.window.showInformationMessage(`切换到master失败:${ex.message}`)
            return
        }
    }

    try {
        await git.pull()
    } catch (ex:any) {
        hideLoading()
        vscode.window.showInformationMessage(`拉取master分支失败:${ex.message}`)
        return
    }

    try {
        await git.checkout(mergingBranchName)
    } catch (ex:any) {
        hideLoading()
        vscode.window.showInformationMessage(`切换到${mergingBranchName}分支失败:${ex.message}`)
        return
    }

    try {
        const mergeResult = await git.merge(['master', '--no-ff'])

        if (mergeResult && mergeResult.result === 'success') {
            hideLoading()
            vscode.window.showInformationMessage(`${mergingBranchName} 反合 master 分支成功`)
        }
    } catch (ex: any) {
        hideLoading()
        vscode.window.showInformationMessage(`反合 master 分支失败:${ex.message}`)
        return
    }

    await git.checkout(mergingBranchName)
}

module.exports = handleMergeMaster
