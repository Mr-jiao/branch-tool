const checkGit = async (git: any, vscode: any) => {
    const gitInfo = await git.version()
    if (!gitInfo.installed) {
        vscode.window.showInformationMessage('未安装git')
        return {
            valid: false,
        }
    }

    try {
        await git.status()
    } catch (ex:any) {
        vscode.window.showInformationMessage('请选择一个git仓库')

        const result = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: '应用',
        })
        if (!result) {
            return {
                valid: false,
            }
        }

        const selectedPath = result[0].path

        if (!selectedPath) {
            return {
                valid: false,
            }
        }

        return {
            valid: true,
            filePath: selectedPath,
        }
    }

    return {
        valid: true,
    }
}

module.exports = {
    checkGit,
}