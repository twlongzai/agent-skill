# 在 GitHub Copilot 安裝與使用本專案的 Skills

本文件適用於 Copilot cloud agent、Copilot code review、Copilot CLI、GitHub Copilot app，以及 VS Code／JetBrains 的 agent mode。要讓雲端 agent 與 code review 讀到 skill，必須將 project skills 納入目標 repository；個人 filesystem 安裝主要供本機 Copilot surfaces 使用。

## 需求

- 已有支援 Agent Skills 的 GitHub Copilot 方案與 surface。
- 使用 Copilot CLI 時，已可執行 `copilot`。
- 已安裝 Git。
- 安裝前先檢視各 skill。這些 skills 未設定 Copilot 的 `allowed-tools`，因此不會藉由 skill frontmatter 預先核准 shell 或 bash。

## 取得專案

```bash
git clone https://github.com/twlongzai/agent-skill.git
cd agent-skill
REPO="$(pwd)"
```

## 安裝

### Project skills：建議用於團隊、cloud agent 與 code review

在目標 repository 根目錄執行：

```bash
cd /path/to/your-project
mkdir -p .agents/skills
cp -R "$REPO"/skills/* .agents/skills/
git add .agents/skills
```

檢視變更後再依團隊流程 commit。Copilot 也辨識 `.github/skills/` 與 `.claude/skills/`，但 `.agents/skills/` 可同時供 Codex、Gemini CLI 與 Google Antigravity 使用。

### Personal skills：Copilot CLI

讓 Copilot CLI 加入本機 skills 來源：

```bash
copilot skill add "$REPO/skills"
```

也可用 filesystem 複製，供所有本機專案使用：

```bash
mkdir -p "$HOME/.agents/skills"
cp -R "$REPO"/skills/* "$HOME/.agents/skills/"
```

Copilot CLI 也辨識 `~/.copilot/skills/`。選用 `~/.agents/skills/` 可和 Codex、Gemini CLI 共用同一份個人 skills。

Windows 可使用 PowerShell：

```powershell
$repo = (Resolve-Path "C:\path\to\agent-skill").Path
$target = Join-Path $HOME ".agents\skills"
New-Item -ItemType Directory -Force -Path $target | Out-Null
Get-ChildItem (Join-Path $repo "skills") -Directory | ForEach-Object {
  Copy-Item $_.FullName -Destination $target -Recurse -Force
}
```

## 驗證與設定

在 Copilot CLI session 中執行：

```text
/skills reload
/skills list
/skills info swiftui-expert-skill
```

也可以在 shell 執行：

```bash
copilot skill list
```

Copilot 會依 skill description 自動決定是否載入。CLI 的 `/skills` 選單可以啟用或停用個別 skill；`/skills add` 可增加其他來源，`/skills remove` 可移除直接加入的來源。

## 使用

自然描述工作即可讓 Copilot 自動觸發。要明確指定時，在 prompt 使用 `/skill-name`：

| Skill | 明確指定範例 |
| --- | --- |
| `apple-foundation-models-skill` | `Use the /apple-foundation-models-skill skill to review this Foundation Models feature.` |
| `static-website-builder` | `Use the /static-website-builder skill to build a text-first docs site.` |
| `swiftui-expert-skill` | `Use the /swiftui-expert-skill skill to review this SwiftUI architecture.` |
| `web-design-engineer` | `Use the /web-design-engineer skill to improve this landing page.` |
| `write-like-human` | `Use the /write-like-human skill to revise this release note naturally.` |

Project skills 隨 repository 一起提供給 Copilot cloud agent、code review 及支援的 IDE agent mode；personal skills 不會自動上傳到 GitHub repository。

## 更新與移除

- `copilot skill add` 指向本機來源：在本專案執行 `git pull`，再輸入 `/skills reload`。
- 複製安裝：`git pull` 後重新執行複製指令。
- Project skills：在目標 repository 更新 `.agents/skills/` 並依團隊流程 commit。
- 移除：Copilot CLI 可用 `/skills remove SKILL-DIRECTORY` 或對應的 `copilot skill` 子命令；filesystem 安裝則刪除 discovery 目錄中的對應資料夾。

## 官方參考

- [GitHub Docs：About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [GitHub Docs：Adding agent skills for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills)
- [Agent Skills 開放規格](https://agentskills.io/)

本文件依 2026-07-13 可取得的官方文件撰寫；若產品介面或 discovery 路徑改變，以上游官方文件為準。
