const checkGit = async (git: any, vscode: any) => {
    const gitInfo = await git.version()
    if (!gitInfo.installed) {
        vscode.window.showInformationMessage('未安装git')
        return false
    }

    try {
        await git.status()
    } catch (ex:any) {
        vscode.window.showInformationMessage(`当前路径不是git仓库:${ex.message}`)
        return false
    }

    return true
}

module.exports = {
    checkGit,
}