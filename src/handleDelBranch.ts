const initGit = require('./utils/initGit')
const { showLoading, hideLoading } = require('./utils/ui')
import { QuickPickItem } from 'vscode'

interface CustomBranchItem extends QuickPickItem {
    value: Boolean;
}

const delBranchOptions: CustomBranchItem[] = [
    {
        label: '是',
        value: true,
    },
    {
        label: '否',
        value: false,
    },
]


const handleDelBranch = async (vscode: any) => {
    const git = await initGit(vscode)
    if (!git) {
        return
    }

    try {
        showLoading('同步远程仓库中...')
        await git.fetch(['-p'])
        hideLoading()
    } catch (ex:any) {
        vscode.window.showInformationMessage(`同步远程仓库失败:${ex.message}`)
        hideLoading()
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

    if (!deletingBranches || deletingBranches.length === 0) {
        return
    }

    for (let i = 0; i < deletingBranches.length; i++) {
        const branchName = deletingBranches[i].label
        if (branchName === currentBranch) {
            vscode.window.showErrorMessage(`当前分支${currentBranch}不能删除，请选择其他分支`)
            return
        }
    }

    const isDelRemote = await vscode.window.showQuickPick(delBranchOptions, {
        placeHolder: '请选择是否要删除对应的远端分支',
    })

    const deleteBranches = deletingBranches.map((branch: QuickPickItem) => branch.label)

    try {
        showLoading('分支删除中...')

        await git.deleteLocalBranches(deleteBranches, true)
        if (isDelRemote && isDelRemote.value) {
            const remoteBranchResult = await git.branch(['-r'])
            const remoteBranches = remoteBranchResult.all.map((branchName: string) => {
                return branchName.replace('origin/', '')
            })

            for (let i = 0; i < deleteBranches.length; i++) {
                if (remoteBranches.includes(deleteBranches[i])) {
                    await git.push('origin', deleteBranches[i], ['--delete'])
                }
            }
        }
        vscode.window.showInformationMessage('删除分支成功')
    } catch(ex:any) {
        vscode.window.showInformationMessage(`删除分支失败:${ex.message}`)
    } finally {
        hideLoading()
    }
}

module.exports = handleDelBranch
