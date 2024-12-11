const { simpleGit } = require('simple-git')
const { checkGit } = require('./utils/check')
import { QuickPickItem } from 'vscode'


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

    try {
        vscode.window.setStatusBarMessage('同步远程仓库中...')
        await git.fetch(['-p'])
        vscode.window.setStatusBarMessage('')
    } catch (ex:any) {
        vscode.window.showInformationMessage(`同步远程仓库失败:${ex.message}`)
        vscode.window.setStatusBarMessage('')
        return
    }

    const localBranch = await git.branchLocal()
    const currentBranch = localBranch.current

    // 获取已合并到master的分支
    const result = await git.branch(['--merged', 'origin/master'])
    const allLocalBranches = localBranch.all || []
    const mergedBranches: string[] = result.all.filter((branchName: string) => branchName !== 'master')

    const allLocalBranchesWithStatus: QuickPickItem[] = allLocalBranches.map((branchName: string) => {
        if (mergedBranches.includes(branchName)) {
            return {
                label: branchName,
                description: 'merged',
            }
        }

        return {
            label: branchName,
        }
    })

    const deletingBranches: QuickPickItem[] = await vscode.window.showQuickPick(allLocalBranchesWithStatus, {
        placeHolder: '请选择要删除的分支',
        canPickMany: true,
    })

    for (let i = 0; i < deletingBranches.length; i++) {
        const branchName = deletingBranches[i].label
        if (branchName === currentBranch) {
            vscode.window.showErrorMessage(`当前分支${currentBranch}不能删除，请选择其他分支`)
            return
        }
    }

    const deleteBranches = deletingBranches.map((branch: QuickPickItem) => branch.label)

    try {
        await git.deleteLocalBranches(deleteBranches, true)
        vscode.window.showInformationMessage('删除分支成功')
    } catch(ex:any) {
        vscode.window.showInformationMessage(`删除分支失败:${ex.message}`)
    }
}

module.exports = handleDelBranch
