# Read-only macOS inspection

Run only selected commands against the verified, authorized Mac. These are examples for the target's installed tools, not an unattended collection script. Check local `man`/help and `sw_vers`: flags, background-task tooling, log retention and privacy behavior vary by macOS version. Do not automatically install missing tools or escalate privileges. Root does not universally bypass TCC. Record denied/unavailable checks as gaps, never as absence of malware.

## Baseline and volatile state

```sh
/usr/bin/sw_vers
/usr/bin/uname -m
/bin/date -u '+%Y-%m-%dT%H:%M:%SZ'
/bin/date '+%Y-%m-%dT%H:%M:%S%z'
/usr/bin/id
/bin/hostname
/bin/ps -axo pid,ppid,uid,lstart,comm
/usr/sbin/lsof -nP -iTCP -sTCP:ESTABLISHED
/usr/sbin/lsof -nP -iUDP
/usr/sbin/netstat -rn
```

Start with executable names (`comm`), not full command lines: arguments can contain secrets. If a specific process needs argument inspection, collect it privately and redact any displayed output. An IP connection or unsigned program is not itself malicious. Socket results are instantaneous and may omit processes without sufficient access; DNS, VPNs and shared infrastructure weaken attribution.

For remote inspection, use an existing authorized account and verified host key. The following only queries OS and clock; replace the host/account with the approved target:

```sh
ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -o ForwardAgent=no \
  -o ClearAllForwardings=yes analyst@approved-host \
  '/usr/bin/sw_vers; /bin/date -u +%Y-%m-%dT%H:%M:%SZ; /usr/bin/id'
```

Authentication and the remote shell can themselves create logs or execute configured login hooks. Document that limitation. Stop on an unknown/changed host key and verify it independently; never accept it automatically or request a private SSH key in chat.

## Persistence and accounts

Resolve the affected account's home and UID with scoped directory-service reads before these examples. `HOME`, `~`, and `id -u` in an SSH session describe the investigator, not necessarily the affected account. Set `AFFECTED_HOME` and `AFFECTED_UID` to verified values; treat an unavailable GUI domain as a visibility gap. `EVIDENCE` below must be an already approved, access-restricted collection directory. Redirect raw secret-bearing output there, not into tool/chat output; redact a working copy before displaying it.

```sh
/bin/ls -laOe@ "$AFFECTED_HOME/Library/LaunchAgents" /Library/LaunchAgents /Library/LaunchDaemons
/bin/launchctl list
/usr/bin/crontab -l
/usr/bin/dscl . -list /Users UniqueID
/usr/bin/dscl . -read /Groups/admin GroupMembership
/usr/bin/last -10
```

`crontab -l` reads the current account’s crontab only; run it in an already authorized affected-account context, or use an explicitly approved privileged `crontab -u AFFECTED_USER -l` check. Do not silently substitute the SSH operator’s result. `launchctl list` describes the current session’s domain, not all users or the system domain. Do not dump whole launchctl domains or job environments. Even targeted `launchctl print` output may contain secrets; do not capture it without prior review of the collection scope and a safe field-selection method. If another domain requires investigation, use an approved account/context and inspect only necessary non-secret fields with tooling verified for that OS. Report uninspected domains as gaps. `last` and local directory listings are incomplete account histories. Record unexpected accounts, but check IT/MDM provisioning before calling them attacker-created.

On macOS 13 and later, use `/usr/bin/sfltool dumpbtm` when available to inspect modern background items. Do not use reset commands. Review System Settings > General > Login Items (labels vary by version), profiles/MDM, and browser extensions only as scoped follow-ups. Shell startup files and scheduled tasks are possible persistence; do not source them. Avoid indiscriminate recursive searches.

## Illustrative article indicators

Here `~` means the verified affected user’s home, not the investigator’s. Check metadata, without printing contents, for:

- `~/.mainhelper`
- `~/.pass`
- `~/.id`
- `~/.agent`
- `/Library/LaunchDaemons/com.finder.helper.plist`

These are weak example indicators from an unverified incident narrative, not a malware signature set. `.pass` may contain credentials: do not print it. A mismatch does not clear the host. A matching plist label or filename does not establish maliciousness or actor attribution.

For an exact approved path, quote it and inspect metadata before deciding whether content acquisition is necessary:

```sh
p='/Library/LaunchDaemons/com.finder.helper.plist'
/bin/ls -ldOe@ "$p"
/usr/bin/stat -f 'path=%N size=%z uid=%u gid=%g mode=%Sp birth=%SB mtime=%Sm ctime=%Sc' \
  -t '%Y-%m-%dT%H:%M:%S%z' "$p"
/usr/bin/readlink "$p"
```

`readlink` failing for a regular file is expected. Record symlinks; do not blindly follow them outside approved scope. For a confirmed regular plist, `/usr/bin/plutil -p "$p" > "$EVIDENCE/plist.txt" 2>&1` parses without running the job, but may expose arguments or environment secrets: retain privately and show a redacted view. Inspect `Program`, `ProgramArguments`, `RunAtLoad`, `KeepAlive`, `UserName` and referenced paths. Do not execute the program. A `~` inside a plist is not necessarily expanded; launchd does not automatically apply shell expansion. Verify whether a shell and its command arguments actually resolve it and under which user's home directory.

For a confirmed regular executable already in scope, metadata checks can include:

```sh
/usr/bin/shasum -a 256 '/absolute/approved/file'
/usr/bin/file '/absolute/approved/file'
/usr/bin/codesign -dv --verbose=4 '/absolute/approved/file' 2>&1
/usr/bin/codesign --verify --strict --verbose=2 '/absolute/approved/file' 2>&1
/usr/bin/xattr '/absolute/approved/file'
```

Do not treat signature validity/notarization as proof of safety or lack of signature as proof of malware. Parse suspicious content only with trusted patched tools, ideally on a protected copy. Do not use Quick Look or open the suspect application.

## Historical logs and limits

Use a bounded window and narrow predicate, adjusting syntax to the installed OS. For example:

```sh
/usr/bin/log show --last 2h --style json \
  --predicate 'process == "sshd" OR subsystem == "com.apple.backgroundtaskmanagement"' \
  > "$EVIDENCE/unified-log.json" 2>&1
```

Unified logs can be redacted, rolled over or absent, and reads can be expensive. Prefer the smallest useful interval. Do not enable private-data logging or reset privacy settings to recover missing history. GUI terminal access and SSH sessions can have different TCC permissions; Full Disk Access is broad and must be an explicitly approved user-controlled step, not a default fix.

Official references:
- [Apple file-access privacy controls](https://support.apple.com/guide/security/controlling-app-access-to-files-secddd1d86a6/web)
- [Apple background-task inspection, including dumpbtm](https://support.apple.com/guide/deployment/manage-login-items-background-tasks-mac-depdca572563/1/web/1.0)
