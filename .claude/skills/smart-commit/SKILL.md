# Smart Commit Skill

## Description
Context-aware git commit that retrieves session memory, reviews changes, and generates a conventional commit message.

## Invocation
`/smart-commit` or `/smart-commit "<optional scope hint>"`

## Workflow

### Step 1: Gather Context
Search claude-mem for current session context to understand what work was done:
```
mcp__plugin_claude-mem_mcp-search__search with query about recent changes
```
This provides the "why" behind the changes for the commit message.

### Step 2: Review Changes
Run these commands to understand what will be committed:
```bash
git status
git diff --staged
git diff
```
If nothing is staged, identify modified files and suggest what to stage. Ask the user to confirm before staging.

### Step 3: Generate Commit Message
Based on the memory context and actual diff, generate a conventional commit message:

**Format:**
```
<type>(<scope>): <short description>

<body explaining why, not what>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

**Types:** `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`, `perf`

**Rules:**
- Subject line under 72 characters
- Body explains motivation, not mechanics (the diff shows mechanics)
- Scope should be the primary area affected (e.g., `ui`, `events`, `layout`, `forms`)
- Reference memory observations when relevant for traceability

### Step 4: Commit
Stage files (specific files, not `git add -A`) and create the commit using a HEREDOC:
```bash
git commit -m "$(cat <<'EOF'
<message>
EOF
)"
```

### Step 5: Verify
Run `git status` and `git log --oneline -3` to confirm the commit succeeded.

Report the commit hash and message to the user.

## Safety
- Never use `git add -A` or `git add .`
- Never commit `.env`, credentials, or secrets
- Never force push
- Always show the user what will be committed before committing
