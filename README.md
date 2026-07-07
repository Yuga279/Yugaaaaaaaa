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
│   └── bugfix.md            # reproduction-first bug fixing
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

## Commands

| Command | What it does |
| --- | --- |
| `claude-engineer init` | Scaffold the setup into the current repo |
| `claude-engineer learn` | Launch Claude Code with `/learn-codebase` |
| `claude-engineer standards` | Launch Claude Code with `/write-standards` |
| `claude-engineer review` | Launch Claude Code with `/review` |
| `claude-engineer sync` | Update managed files (commands/prompts/rules) to the latest template version — never touches CLAUDE.md, AGENTS.md, or docs/ |
| `claude-engineer doctor` | Verify the setup is complete and current |

## Recommended flow for a new repo

```bash
npx @yugarajan/claude-engineer init
claude-engineer learn        # Claude studies the codebase
claude-engineer standards    # generates docs/CODEBASE_STANDARDS.md
git add -A && git commit -m "Add Claude engineering setup"
```

After upgrading the package, run `claude-engineer sync` in each repo to pull in the latest prompts, then `claude-engineer doctor` to confirm.

## Requirements

- Node.js >= 20
- [Claude Code](https://claude.com/claude-code) installed for `learn` / `standards` / `review`

## License

MIT
