# 在 Claude Code 或 Claude Cowork 安裝與使用本專案的 Skills

本文件分別說明 Claude Code 的 filesystem 安裝，以及 Claude Chat／Claude Desktop／Claude Cowork 的 ZIP 上傳方式。以下安裝的是本專案 skills，不是 Claude 應用程式本身。

## 需求

- Claude Code：已可執行 `claude`，並已安裝 Git。
- Claude Chat 或 Cowork：帳號已啟用 Skills 與 Code execution and file creation。Team 通常預設啟用；Enterprise 可能需要組織管理員先開啟。
- 安裝前先檢視各 skill 的 `SKILL.md` 與 bundled resources。接受 workspace trust 或執行 skill 內建程式前，確認來源可信。

## 取得專案

```bash
git clone https://github.com/twlongzai/agent-skill.git
cd agent-skill
REPO="$(pwd)"
```

## Claude Code 安裝

### 專案範圍

將 skills 複製到目標專案的 `.claude/skills/`：

```bash
TARGET="/path/to/your-project"
mkdir -p "$TARGET/.claude/skills"
cp -R "$REPO"/skills/* "$TARGET/.claude/skills/"
```

Claude Code 會從啟動目錄向上掃描到 repository root，也可在處理子目錄檔案時發現巢狀 `.claude/skills/`。

### 個人範圍

```bash
mkdir -p "$HOME/.claude/skills"
cp -R "$REPO"/skills/* "$HOME/.claude/skills/"
```

個人 skill 套用到所有 Claude Code 專案。Claude Code v2.1.203 以上也支援以 symbolic link 指向本專案的個別 skill；可套用 [Codex 文件中的 link 迴圈](CODEX.md#以-symbolic-link-追蹤更新)，但將目標改成 `~/.claude/skills`。

Windows 可用 PowerShell 複製：

```powershell
$repo = (Resolve-Path "C:\path\to\agent-skill").Path
$target = Join-Path $HOME ".claude\skills"
New-Item -ItemType Directory -Force -Path $target | Out-Null
Get-ChildItem (Join-Path $repo "skills") -Directory | ForEach-Object {
  Copy-Item $_.FullName -Destination $target -Recurse -Force
}
```

## Claude Code 驗證與設定

啟動 `claude` 後輸入：

```text
What skills are available?
```

也可以輸入 `/`，確認五個 skill 名稱出現在選單。Claude Code 會監看既有 skill 目錄中的 `SKILL.md` 變更；如果 session 啟動時 discovery 目錄尚不存在，建立後請重新啟動 Claude Code。

若使用 Claude Agent SDK 且自行指定 `settingSources`／`setting_sources`，必須包含 `"user"` 或 `"project"` 才會載入 filesystem skills；`skills: "all"` 可啟用所有已發現的 skills。

## Claude Chat／Cowork 上傳

Claude 的上傳格式是一個 skill 一個 ZIP，而且 ZIP 根層必須包含 skill 資料夾，不能把 `SKILL.md` 直接放在 ZIP 根層。在本專案根目錄執行：

```bash
mkdir -p dist/claude-skills
for skill in skills/*; do
  name="$(basename "$skill")"
  git archive --format=zip \
    --output="$PWD/dist/claude-skills/$name.zip" \
    HEAD:skills "$name"
done
```

接著對 `dist/claude-skills/` 中的每個 ZIP 執行：

1. 在 Claude 或 Cowork 開啟 `Customize > Skills`。
2. 按 `+`，選擇上傳自訂 skill。
3. 上傳 ZIP 並啟用。
4. 在 Cowork 可輸入 `/` 或按 `+` 確認 skill 已出現。

若要提供整個組織使用，請由 Team／Enterprise 管理員依組織 Skills 設定佈署。

## 使用

Claude 會依工作內容與 `description` 自動觸發，也可以在 Claude Code、Chat 或 Cowork 用 `/skill-name` 明確指定：

| Skill | 明確指定範例 |
| --- | --- |
| `apple-foundation-models-skill` | `/apple-foundation-models-skill review this Foundation Models session design` |
| `static-website-builder` | `/static-website-builder build a bilingual documentation site from these Markdown files` |
| `swiftui-expert-skill` | `/swiftui-expert-skill review this view's state ownership and navigation` |
| `web-design-engineer` | `/web-design-engineer improve this dashboard's visual hierarchy and interactions` |
| `write-like-human` | `/write-like-human revise this report without changing its claims` |

## 更新與移除

- Claude Code symbolic link：在來源專案執行 `git pull`；必要時重新開啟 session。
- Claude Code 複製安裝：`git pull` 後重新執行複製指令。
- Claude Chat／Cowork：重新產生 ZIP，再於 `Customize > Skills` 更新或重新上傳。
- 移除：Claude Code 刪除 discovery 目錄中的對應資料夾／link；Chat 或 Cowork 在 `Customize > Skills` 停用或刪除。

## 官方參考

- [Claude Code：Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Claude Help Center：Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
- [Claude Help Center：How to create custom skills](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)
- [Agent Skills 開放規格](https://agentskills.io/)

本文件依 2026-07-13 可取得的官方文件撰寫；若產品介面或 discovery 路徑改變，以上游官方文件為準。
