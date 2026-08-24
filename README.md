# @yugarajan/claude-engineer

Bootstrap any repository with a shared engineering setup for **Claude Code** and **Cursor**: slash commands, prompts, rules, and a codebase-standards workflow — consistent across every repo your team touches.

## Usage

```bash
npx @yugarajan/claude-engineer init
```

You'll be asked which AI tools to configure (space to select, enter to confirm):

```text
? Which AI tools should this repository be configured for?
◉ Claude Code   .claude/ commands & prompts + CLAUDE.md
◯ Cursor        .cursor/rules/*.mdc
◯ AGENTS.md     generic instructions for Copilot, Codex & other agents
```

If Claude Code is selected, you're then asked where its commands should live:

```text
? Where should the Claude Code commands be installed?
❯ This project   .claude/ in this repo — shared with the team via git
  Globally       ~/.claude/commands — available when you type / in every repo
  Both           project files for the team + global commands for you
```

For scripts/CI, skip the prompts with flags: `init --all`, any combination of `--claude --cursor --agents`, and `--global` / `-g` for the global install. Re-running `init --global` updates the global commands in place — that's also how you upgrade them after a new package version.

Selecting everything scaffolds:

```text
.claude/
├── commands/
│   ├── learn-codebase.md    # study the repo → architecture notes
│   ├── write-standards.md   # derive real conventions → standards doc
│   ├── implement.md         # standards-driven feature work
│   ├── review.md            # review branch against the standards
│   ├── bugfix.md            # reproduction-first bug fixing
│   └── change-request.md    # change an existing feature, with a per-folder changelog
└── prompts/
    ├── codebase-standards.md
    └── architecture.md
.cursor/
└── rules/
    ├── coding.mdc
    ├── architecture.mdc
    └── review.mdc
docs/
└── CODEBASE_STANDARDS.md
AGENTS.md
CLAUDE.md
```

Existing files are never overwritten (use `--force` to override). `docs/CODEBASE_STANDARDS.md` is always included — it is the shared source of truth every tool points to.

`sync` and `doctor` automatically detect which tools a repo uses (by the presence of `.claude/`, `.cursor/`, `AGENTS.md`) and only manage those.

## CLI commands

| Command | What it does |
| --- | --- |
| `claude-engineer init [--claude] [--cursor] [--agents] [--all] [-g, --global] [-f, --force]` | Scaffold the setup into the current repo. No flags → interactive prompts. `--all` configures every tool non-interactively; `--global` installs Claude commands to `~/.claude/commands`; `--force` overwrites files that already exist |
| `claude-engineer sync [--dry-run] [--diff]` | Update managed files (`.claude/commands`, `.claude/prompts`, `.cursor/rules`) to the version shipped in the installed package — never touches `CLAUDE.md`, `AGENTS.md`, or `docs/`. `--dry-run` previews what would change without writing; add `--diff` to also print the line-level diff for each drifted file |
| `claude-engineer doctor [--skip-update-check]` | Verify the setup is complete, flag any managed file that has drifted from its template (edited by hand or left behind by an upgrade), and check npm for a newer CLI version. Use `--skip-update-check` in CI or offline |
| `claude-engineer learn` | Launch Claude Code with `/learn-codebase` |
| `claude-engineer standards` | Launch Claude Code with `/write-standards` |
| `claude-engineer review` | Launch Claude Code with `/review` |

`init` records the tools/scope you chose, plus the package version, in `.claude-engineer.json` at the repo root — commit it so `doctor` can tell your team which template version a repo was last synced against.

## Slash commands (inside Claude Code)

Once `.claude/commands/` is installed, these are available by typing `/` in a Claude Code session:

| Command | What it does |
| --- | --- |
| `/learn-codebase` | Studies the repo and its git history, writes `.claude/prompts/architecture.md` |
| `/write-standards` | Derives real conventions from code and history, writes `docs/CODEBASE_STANDARDS.md` |
| `/implement <feature description>` | Implements a new feature following the standards doc, with a compliance check before finishing |
| `/review [base branch]` | Reviews the current branch's diff against the standards |
| `/bugfix <bug description>` | Reproduction-first bug fixing — reproduces the bug before proposing a fix |
| `/change-request <folder> <change description>` | Changes an existing feature: reads the folder's existing docs/code first, restates its understanding of the change, implements it, then appends a dated entry to `CHANGELOG.md` in that folder recording what was asked, understood, and changed |

## Use cases

**Bootstrapping a brand-new repo for the team**
```bash
npx @yugarajan/claude-engineer init --all
claude-engineer learn        # Claude studies the codebase
claude-engineer standards    # generates docs/CODEBASE_STANDARDS.md
git add -A && git commit -m "Add Claude engineering setup"
```

**Rolling out an upgraded template version across many repos**
```bash
npm install -g @yugarajan/claude-engineer@latest
claude-engineer sync --dry-run --diff   # review exactly what changed before writing
claude-engineer sync                    # apply it
claude-engineer doctor                  # confirm the repo is current
```

**Checking a repo you didn't set up yourself**
```bash
claude-engineer doctor
# reports missing files, files edited/drifted from the shipped template,
# which claude-engineer version the repo was last synced with, and whether
# a newer CLI version is available
```

**Making a scoped change to an existing feature**

Inside Claude Code, run:
```
/change-request src/billing/invoices  "Add a due-date reminder email sent 3 days before invoices are due"
```
Claude reads `src/billing/invoices/CHANGELOG.md` (if present) and the existing code first, confirms its understanding of the current behavior and the requested change, implements it following the repo's standards, and appends a new dated entry to that `CHANGELOG.md` — so the next person (or agent) to touch that feature has a record of what was asked, what was understood, and what changed.

**Getting the slash commands on every repo you open, without committing them**
```bash
claude-engineer init --claude --global
```

## Requirements

- Node.js >= 20
- [Claude Code](https://claude.com/claude-code) installed for `learn` / `standards` / `review` and to use the slash commands

## License

MIT
