# 在 Codex 安裝與使用本專案的 Skills

本文件適用於 ChatGPT 桌面版中的 Codex、Codex CLI 與 Codex IDE extension。以下指令安裝的是本專案 skills，不是 Codex 應用程式本身。

## 需求

- 已可正常使用 Codex。
- 已安裝 Git。
- 安裝前先檢視各 skill 的 `SKILL.md`、references、assets 與 scripts。本專案未在 `SKILL.md` 預先授權 shell 工具；實際工具權限仍由 Codex 設定與使用者核准控制。

## 取得專案

```bash
git clone https://github.com/twlongzai/agent-skill.git
cd agent-skill
REPO="$(pwd)"
```

## 安裝

### 專案範圍

要讓 skills 只在某個工作專案內可用，將它們複製到該專案根目錄的 `.agents/skills/`：

```bash
TARGET="/path/to/your-project"
mkdir -p "$TARGET/.agents/skills"
cp -R "$REPO"/skills/* "$TARGET/.agents/skills/"
```

Codex 從目前工作目錄一路掃描到 Git repository root 之間的 `.agents/skills/`。請從目標專案或其子目錄啟動 Codex。

### 個人範圍

要讓 skills 在所有專案可用，複製到個人的共用 Agent Skills 目錄：

```bash
mkdir -p "$HOME/.agents/skills"
cp -R "$REPO"/skills/* "$HOME/.agents/skills/"
```

`~/.agents/skills/` 也可供 Gemini CLI 與 Copilot CLI 使用，因此同一份個人安裝可由三者共用。

### 以 symbolic link 追蹤更新

在支援 symbolic link 的系統，可以連結每個 skill，之後在來源專案執行 `git pull` 即可更新。執行前先確認目的地沒有同名 skill：

```bash
TARGET="$HOME/.agents/skills"
mkdir -p "$TARGET"
for skill in "$REPO"/skills/*; do
  name="$(basename "$skill")"
  if [ ! -e "$TARGET/$name" ]; then
    ln -s "$skill" "$TARGET/$name"
  fi
done
```

Windows 若未啟用 symbolic link，請使用 PowerShell 複製：

```powershell
$repo = (Resolve-Path "C:\path\to\agent-skill").Path
$target = Join-Path $HOME ".agents\skills"
New-Item -ItemType Directory -Force -Path $target | Out-Null
Get-ChildItem (Join-Path $repo "skills") -Directory | ForEach-Object {
  Copy-Item $_.FullName -Destination $target -Recurse -Force
}
```

## 驗證與設定

安裝後開啟新 task。在 CLI 或 IDE 輸入 `/skills`，或輸入 `$` 後搜尋下列名稱。若新 skill 未出現，重新啟動 Codex。

Codex 預設會依 `description` 自動選用 skill。若只想停用某一個 skill，可在 `~/.codex/config.toml` 加入：

```toml
[[skills.config]]
path = "/absolute/path/to/skill/SKILL.md"
enabled = false
```

變更 `config.toml` 後重新啟動 Codex。skill 內的 `agents/openai.yaml` 只提供 Codex/ChatGPT UI metadata，不影響其他 agent。

## 使用

Codex 可以依工作內容自動觸發 skill，也可以用 `$skill-name` 明確指定：

| Skill | 明確指定範例 |
| --- | --- |
| `apple-foundation-models-skill` | `使用 $apple-foundation-models-skill 檢查這個 LanguageModelSession 的生命週期。` |
| `static-website-builder` | `使用 $static-website-builder 將這些 Markdown 做成雙語靜態文件網站。` |
| `swiftui-expert-skill` | `使用 $swiftui-expert-skill review 這個 SwiftUI feature 的 state 與 navigation。` |
| `web-design-engineer` | `使用 $web-design-engineer 改善這個 dashboard 的視覺與互動。` |
| `write-like-human` | `使用 $write-like-human 改寫這封 email，保留原意但更自然。` |

也可以組合 skills，例如：

```text
同時使用 $static-website-builder 與 $write-like-human，把這批技術筆記整理成易讀的文件網站。
```

## 更新與移除

- symbolic link 安裝：在本專案執行 `git pull`，再開新 task；必要時重新啟動 Codex。
- 複製安裝：`git pull` 後重新執行相同的 `cp -R` 或 PowerShell `Copy-Item` 指令。
- 移除：刪除對應 discovery 目錄中的 skill 資料夾或 symbolic link，不要刪除工作專案中的其他同名資料。

## 官方參考

- [OpenAI Codex：Build skills](https://developers.openai.com/codex/skills)
- [Agent Skills 開放規格](https://agentskills.io/)

本文件依 2026-07-13 可取得的官方文件撰寫；若產品介面或 discovery 路徑改變，以上游官方文件為準。
