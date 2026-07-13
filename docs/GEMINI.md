# 在 Gemini CLI 或 Google Antigravity 安裝與使用本專案的 Skills

本文件涵蓋 Gemini CLI 與 Google Antigravity 的 Agent Skills。Gemini CLI 官方頁面已公告部分使用者方案轉往 Antigravity CLI；兩者目前都支援開放的 `SKILL.md` 格式，但個人範圍的 discovery 目錄不同。

## 需求

- 已可正常使用 Gemini CLI 或 Google Antigravity。
- 已安裝 Git。
- 安裝前先檢視各 skill 與 bundled resources。Gemini CLI 啟用 skill 時會顯示其名稱、用途及將取得存取權的目錄，請在同意前核對路徑。

## 取得專案

```bash
git clone https://github.com/twlongzai/agent-skill.git
cd agent-skill
REPO="$(pwd)"
```

## Gemini CLI 安裝

### 使用內建 install 指令

個人範圍，供所有 workspace 使用：

```bash
gemini skills install "$REPO/skills" --scope user
```

Workspace 範圍，請先切換到目標專案再執行：

```bash
cd /path/to/your-project
gemini skills install "$REPO/skills" --scope workspace
```

Gemini CLI 會列出找到的五個 skills 與安裝目的地；檢視後再同意。支援 `skills link` 的新版 CLI 也可用下列方式直接追蹤本機來源更新：

```bash
gemini skills link "$REPO/skills" --scope user
```

也可以直接用 filesystem 安裝：

```bash
# Workspace 範圍
mkdir -p .agents/skills
cp -R "$REPO"/skills/* .agents/skills/

# 個人範圍
mkdir -p "$HOME/.agents/skills"
cp -R "$REPO"/skills/* "$HOME/.agents/skills/"
```

Gemini CLI 也辨識 `.gemini/skills/` 與 `~/.gemini/skills/`，但 `.agents/skills/` 是官方提供的跨 agent alias，且同一層級發生同名衝突時優先權較高。

### 驗證與設定

```bash
gemini skills list --all
```

在互動 session 中可使用：

```text
/skills list
/skills reload
```

Gemini CLI 預設啟用已發現的 skills。可用 `gemini skills enable <name>`、`gemini skills disable <name>`，或互動式 `/skills enable`／`/skills disable` 調整。

## Google Antigravity 安裝

Workspace 範圍使用與其他 agent 共通的 `.agents/skills/`：

```bash
TARGET="/path/to/your-workspace"
mkdir -p "$TARGET/.agents/skills"
cp -R "$REPO"/skills/* "$TARGET/.agents/skills/"
```

個人全域範圍使用 Antigravity 的 global skills 目錄：

```bash
mkdir -p "$HOME/.gemini/config/skills"
cp -R "$REPO"/skills/* "$HOME/.gemini/config/skills/"
```

在 Antigravity 中開啟 `/skills`，確認五個 skills 已載入。若使用 workspace skills，請確保目前開啟的 workspace root 正是包含 `.agents/skills/` 的目錄。

Windows 可用 PowerShell 將 `$target` 分別設為專案的 `.agents\skills` 或 `$HOME\.gemini\config\skills` 後複製：

```powershell
$repo = (Resolve-Path "C:\path\to\agent-skill").Path
$target = Join-Path $HOME ".gemini\config\skills"
New-Item -ItemType Directory -Force -Path $target | Out-Null
Get-ChildItem (Join-Path $repo "skills") -Directory | ForEach-Object {
  Copy-Item $_.FullName -Destination $target -Recurse -Force
}
```

## 使用

Gemini／Antigravity 會先讀取 skill 的名稱與 description，相關時再啟用完整內容。直接在 prompt 指定名稱可提高確定性：

| Skill | 明確指定範例 |
| --- | --- |
| `apple-foundation-models-skill` | `Use the apple-foundation-models-skill to review this tool-calling session.` |
| `static-website-builder` | `Use the static-website-builder skill to turn these notes into a multilingual docs site.` |
| `swiftui-expert-skill` | `Use the swiftui-expert-skill to refactor state ownership in this feature.` |
| `web-design-engineer` | `Use the web-design-engineer skill to redesign this interactive dashboard.` |
| `write-like-human` | `Use the write-like-human skill to revise this proposal while preserving every fact.` |

Gemini CLI 可能在 activation 時要求同意；檢查顯示的 skill 路徑後再核准。

## 更新與移除

- `skills link`：在本專案執行 `git pull`，再執行 `/skills reload`。
- `skills install` 或複製安裝：`git pull` 後重新執行安裝／複製指令。
- Gemini CLI 內建安裝可用 `gemini skills uninstall <name>`；filesystem 安裝則刪除 discovery 目錄中的對應資料夾或 link。
- Antigravity 可從 `/skills` 檢查狀態；移除 filesystem skill 後重新載入 workspace 或開啟新 session。

## 官方參考

- [Gemini CLI：Agent Skills](https://geminicli.com/docs/cli/skills/)
- [Google Antigravity：Agent Skills](https://antigravity.google/docs/skills)
- [Agent Skills 開放規格](https://agentskills.io/)

本文件依 2026-07-13 可取得的官方文件撰寫；若產品介面、方案或 discovery 路徑改變，以上游官方文件為準。
