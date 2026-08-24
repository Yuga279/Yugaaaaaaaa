#!/usr/bin/env node

const { spawnSync } = require("child_process");
const crypto = require("crypto");
const https = require("https");
const os = require("os");
const path = require("path");

const chalk = require("chalk");
const { Command } = require("commander");
const fse = require("fs-extra");
const prompts = require("prompts");

const PKG = require("../package.json");
const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
const CONFIG_FILE = ".claude-engineer.json";

if (!fse.existsSync(TEMPLATES_DIR)) {
  console.error(chalk.red("Templates directory is missing: ") + TEMPLATES_DIR);
  console.error("This install looks corrupted — try reinstalling the package.");
  process.exit(1);
}

// Each supported AI tool owns a set of template files. `detect` is the path
// whose presence in a repo means that tool is configured there — sync and
// doctor only operate on tools a repo actually uses.
const TOOLS = {
  claude: {
    label: "Claude Code",
    hint: ".claude/ commands & prompts + CLAUDE.md",
    detect: ".claude",
    match: (rel) => rel.startsWith(".claude" + path.sep) || rel === "CLAUDE.md",
  },
  cursor: {
    label: "Cursor",
    hint: ".cursor/rules/*.mdc",
    detect: ".cursor",
    match: (rel) => rel.startsWith(".cursor" + path.sep),
  },
  agents: {
    label: "AGENTS.md",
    hint: "generic instructions for Copilot, Codex & other agents",
    detect: "AGENTS.md",
    match: (rel) => rel === "AGENTS.md",
  },
};

// Installed regardless of tool selection — the standards doc is the shared
// source of truth every tool points to.
const SHARED_FILES = [path.join("docs", "CODEBASE_STANDARDS.md")];

// Files owned by this tool: `sync` may overwrite these with the latest
// template version. Everything else (CLAUDE.md, AGENTS.md, docs/) belongs
// to the repo once created and is never overwritten by sync.
const MANAGED_PREFIXES = [
  path.join(".claude", "commands"),
  path.join(".claude", "prompts"),
  path.join(".cursor", "rules"),
];

/** Recursively list template files as paths relative to the templates root. */
function listTemplateFiles(dir = TEMPLATES_DIR, base = TEMPLATES_DIR) {
  const entries = fse.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listTemplateFiles(full, base));
    } else {
      files.push(path.relative(base, full));
    }
  }
  return files;
}

function isManaged(rel) {
  return MANAGED_PREFIXES.some((p) => rel.startsWith(p + path.sep));
}

function hashFile(file) {
  return crypto.createHash("sha256").update(fse.readFileSync(file)).digest("hex");
}

/** Does the on-disk copy of a managed template differ from the shipped version? */
function isStale(rel) {
  const dest = path.join(process.cwd(), rel);
  if (!fse.existsSync(dest)) return false;
  return hashFile(dest) !== hashFile(path.join(TEMPLATES_DIR, rel));
}

/** Read this repo's .claude-engineer.json, or null if it has none yet. */
function readConfig() {
  const file = path.join(process.cwd(), CONFIG_FILE);
  if (!fse.existsSync(file)) return null;
  try {
    return fse.readJsonSync(file);
  } catch {
    return null;
  }
}

/** Record which tools/scope this repo was configured with and at what package version. */
function writeConfig(patch) {
  const file = path.join(process.cwd(), CONFIG_FILE);
  const existing = readConfig() || {};
  const config = { ...existing, ...patch, version: PKG.version };
  fse.writeJsonSync(file, config, { spaces: 2 });
}

/** Minimal line-based diff (LCS), enough to preview a template update — not a full unified diff. */
function diffLines(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ type: "-", line: a[i] });
      i++;
    } else {
      out.push({ type: "+", line: b[j] });
      j++;
    }
  }
  while (i < n) out.push({ type: "-", line: a[i++] });
  while (j < m) out.push({ type: "+", line: b[j++] });
  return out;
}

function printDiff(rel) {
  const current = fse.readFileSync(path.join(process.cwd(), rel), "utf8").split("\n");
  const incoming = fse.readFileSync(path.join(TEMPLATES_DIR, rel), "utf8").split("\n");
  console.log(chalk.bold(`  --- ${rel}`));
  for (const { type, line } of diffLines(current, incoming)) {
    console.log(type === "-" ? chalk.red(`    - ${line}`) : chalk.green(`    + ${line}`));
  }
}

/** Best-effort, non-blocking check against the npm registry — silently skipped if offline. */
function checkForUpdate() {
  return new Promise((resolve) => {
    const req = https.get(
      `https://registry.npmjs.org/${PKG.name}/latest`,
      { timeout: 1500, headers: { "user-agent": PKG.name } },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const latest = JSON.parse(body).version;
            if (latest && latest !== PKG.version) {
              console.log(
                chalk.yellow(`\nUpdate available: ${PKG.version} → ${latest}`) +
                chalk.gray(`  (npm install -g ${PKG.name})`)
              );
            }
          } catch {
            /* malformed response — ignore */
          }
          resolve();
        });
      }
    );
    req.on("error", () => resolve());
    req.on("timeout", () => {
      req.destroy();
      resolve();
    });
  });
}

function fileBelongsTo(rel, toolKeys) {
  if (SHARED_FILES.indexOf(rel) !== -1) return true;
  return toolKeys.some((k) => TOOLS[k].match(rel));
}

/** Tools already configured in the current repo, judged by their marker paths. */
function detectedTools() {
  return Object.keys(TOOLS).filter((k) =>
    fse.existsSync(path.join(process.cwd(), TOOLS[k].detect))
  );
}

function toolLabels(keys) {
  return keys.map((k) => TOOLS[k].label).join(", ");
}

/** Decide which tools init targets: flags win, then interactive prompt, then all. */
async function resolveTools(opts) {
  if (opts.all) return Object.keys(TOOLS);

  const flagged = Object.keys(TOOLS).filter((k) => opts[k]);
  if (flagged.length) return flagged;

  if (!process.stdin.isTTY) {
    console.log(
      chalk.gray("Non-interactive terminal — configuring all tools. Use --claude / --cursor / --agents to choose explicitly.")
    );
    return Object.keys(TOOLS);
  }

  const detected = detectedTools();
  const response = await prompts(
    {
      type: "multiselect",
      name: "tools",
      message: "Which AI tools should this repository be configured for?",
      instructions: false,
      hint: "space to select, enter to confirm",
      min: 1,
      choices: Object.keys(TOOLS).map((k) => ({
        title: TOOLS[k].label,
        description: TOOLS[k].hint,
        value: k,
        selected: k === "claude" || detected.indexOf(k) !== -1,
      })),
    },
    {
      onCancel: () => {
        console.log(chalk.red("Cancelled — nothing was created."));
        process.exit(1);
      },
    }
  );
  return response.tools;
}

/** Where should Claude commands live: in this repo, in ~/.claude, or both? */
async function resolveScope(opts, tools) {
  if (opts.global) return "global";
  if (tools.indexOf("claude") === -1) return "project";
  if (!process.stdin.isTTY) return "project";

  const response = await prompts(
    {
      type: "select",
      name: "scope",
      message: "Where should the Claude Code commands be installed?",
      choices: [
        { title: "This project", description: ".claude/ in this repo — shared with the team via git", value: "project" },
        { title: "Globally", description: "~/.claude/commands — available when you type / in every repo on this machine", value: "global" },
        { title: "Both", description: "project files for the team + global commands for you", value: "both" },
      ],
    },
    {
      onCancel: () => {
        console.log(chalk.red("Cancelled — nothing was created."));
        process.exit(1);
      },
    }
  );
  return response.scope;
}

/**
 * Install the slash commands into ~/.claude so they appear in every repo.
 * These are tool-managed files, so re-running always updates them in place.
 */
function installGlobal() {
  const home = os.homedir();
  const created = [];
  const updated = [];

  const entries = fse
    .readdirSync(path.join(TEMPLATES_DIR, ".claude", "commands"))
    .map((f) => path.join("commands", f));
  // /write-standards falls back to this copy when a repo has no local prompts.
  entries.push(path.join("prompts", "codebase-standards.md"));

  for (const rel of entries) {
    const src = path.join(TEMPLATES_DIR, ".claude", rel);
    const dest = path.join(home, ".claude", rel);
    const exists = fse.existsSync(dest);
    try {
      fse.ensureDirSync(path.dirname(dest));
      fse.copySync(src, dest, { overwrite: true });
    } catch (err) {
      console.error(chalk.red(`  failed   ${path.join("~", ".claude", rel)}: ${err.message}`));
      continue;
    }
    (exists ? updated : created).push(path.join("~", ".claude", rel));
  }
  return { created, updated, skipped: [] };
}

function copyTemplates({ tools, force = false, managedOnly = false }) {
  const cwd = process.cwd();
  const created = [];
  const skipped = [];
  const updated = [];

  for (const rel of listTemplateFiles()) {
    if (!fileBelongsTo(rel, tools)) continue;
    if (managedOnly && !isManaged(rel)) continue;

    const src = path.join(TEMPLATES_DIR, rel);
    const dest = path.join(cwd, rel);
    const exists = fse.existsSync(dest);

    if (exists && !force && !managedOnly) {
      skipped.push(rel);
      continue;
    }

    if (managedOnly && exists && !isStale(rel)) {
      continue;
    }

    fse.ensureDirSync(path.dirname(dest));
    fse.copySync(src, dest, { overwrite: true });
    (exists ? updated : created).push(rel);
  }

  return { created, updated, skipped };
}

function report({ created, updated, skipped }) {
  created.forEach((f) => console.log(chalk.green("  created  ") + f));
  updated.forEach((f) => console.log(chalk.cyan("  updated  ") + f));
  skipped.forEach((f) => console.log(chalk.gray("  skipped  ") + f + chalk.gray(" (already exists)")));
  if (!created.length && !updated.length) {
    console.log(chalk.gray("  nothing to do — all files already in place"));
  }
}

/** Launch the Claude Code CLI with a slash command, streaming the session. */
function runClaude(slashCommand) {
  const result = spawnSync("claude", [slashCommand], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error || result.status === null) {
    console.error(chalk.red("Could not launch the `claude` CLI."));
    console.error("Install Claude Code first: https://claude.com/claude-code");
    console.error('Then run manually inside your repo:  claude "' + slashCommand + '"');
    process.exit(1);
  }
  process.exit(result.status || 0);
}

const program = new Command();

program
  .name("claude-engineer")
  .description("Bootstrap and maintain a shared AI engineering setup (Claude Code, Cursor, AGENTS.md) in any repository.")
  .version(PKG.version);

program
  .command("init")
  .description("Scaffold AI tool configuration into the current repo (asks which tools unless flags are given)")
  .option("--claude", "configure Claude Code (.claude/ + CLAUDE.md)")
  .option("--cursor", "configure Cursor (.cursor/rules)")
  .option("--agents", "configure AGENTS.md for other agents (Copilot, Codex, ...)")
  .option("--all", "configure everything without asking")
  .option("-g, --global", "install the Claude commands to ~/.claude/commands so they appear in every repo")
  .option("-f, --force", "overwrite files that already exist", false)
  .action(async (opts) => {
    const tools = await resolveTools(opts);
    const scope = await resolveScope(opts, tools);

    if (scope === "global" || scope === "both") {
      console.log(chalk.bold("\nInstalling global Claude commands:\n"));
      report(installGlobal());
    }

    // Global-only installs still write Cursor/AGENTS.md files if selected —
    // those have no global equivalent and always live in the repo.
    const projectTools = scope === "global" ? tools.filter((t) => t !== "claude") : tools;
    if (projectTools.length) {
      console.log(chalk.bold("\nConfiguring this repo for: ") + toolLabels(projectTools) + "\n");
      report(copyTemplates({ tools: projectTools, force: opts.force }));
      writeConfig({ tools, scope });
    }

    console.log(
      "\n" + chalk.bold("Next steps:") +
      (scope !== "project" ? "\n  •  Restart Claude Code (or start a new session) — then type / to see the commands" : "") +
      "\n  1. Run " + chalk.yellow("claude-engineer learn") + " to have Claude study this codebase" +
      "\n  2. Run " + chalk.yellow("claude-engineer standards") + " to generate docs/CODEBASE_STANDARDS.md" +
      "\n  3. Commit the generated files so your whole team shares the same setup"
    );
  });

program
  .command("sync")
  .description("Update managed files (.claude/commands, .claude/prompts, .cursor/rules) to the latest template version")
  .option("--dry-run", "show what would change without writing", false)
  .option("--diff", "with --dry-run, show a line diff for each changed managed file", false)
  .action((opts) => {
    const tools = detectedTools();
    if (!tools.length) {
      console.log(chalk.red("No AI tool configuration found in this repo.") + " Run " + chalk.yellow("claude-engineer init") + " first.");
      process.exitCode = 1;
      return;
    }
    console.log(chalk.bold("Syncing managed files for: ") + toolLabels(tools) + "\n");
    if (opts.dryRun) {
      const cwd = process.cwd();
      let changes = 0;
      for (const rel of listTemplateFiles()) {
        if (!isManaged(rel) || !fileBelongsTo(rel, tools)) continue;
        const exists = fse.existsSync(path.join(cwd, rel));
        if (exists && !isStale(rel)) continue;
        changes++;
        console.log((exists ? chalk.cyan("  would update  ") : chalk.green("  would create  ")) + rel);
        if (opts.diff && exists) printDiff(rel);
      }
      if (!changes) console.log(chalk.gray("  nothing to do — all managed files are current"));
      return;
    }
    report(copyTemplates({ tools, managedOnly: true }));
    if (readConfig()) writeConfig({});
    console.log(chalk.gray("\nCLAUDE.md, AGENTS.md and docs/ are yours — sync never touches them."));
  });

program
  .command("doctor")
  .description("Check that the AI engineering setup in this repo is complete")
  .option("--skip-update-check", "don't check npm for a newer version of this CLI", false)
  .action(async (opts) => {
    const tools = detectedTools();
    if (!tools.length) {
      console.log(chalk.red("No AI tool configuration found in this repo.") + " Run " + chalk.yellow("claude-engineer init") + " first.");
      process.exitCode = 1;
      return;
    }
    console.log(chalk.bold("Checking setup for: ") + toolLabels(tools) + "\n");

    const config = readConfig();
    if (config && config.version && config.version !== PKG.version) {
      console.log(
        chalk.yellow(`  note     `) +
        `this repo was last synced with claude-engineer ${config.version}, you're running ${PKG.version} — run ` +
        chalk.yellow("claude-engineer sync") + " to catch it up\n"
      );
    }

    let missing = 0;
    let outdated = 0;
    const required = SHARED_FILES.slice();
    if (tools.indexOf("claude") !== -1) required.push(".claude", path.join(".claude", "commands"), path.join(".claude", "prompts"), "CLAUDE.md");
    if (tools.indexOf("cursor") !== -1) required.push(path.join(".cursor", "rules"));
    if (tools.indexOf("agents") !== -1) required.push("AGENTS.md");

    for (const rel of required) {
      const exists = fse.existsSync(path.join(process.cwd(), rel));
      if (!exists) missing++;
      console.log((exists ? chalk.green("  ok       ") : chalk.red("  missing  ")) + rel);
    }
    for (const rel of listTemplateFiles()) {
      if (!isManaged(rel) || !fileBelongsTo(rel, tools)) continue;
      const dest = path.join(process.cwd(), rel);
      if (!fse.existsSync(dest)) {
        missing++;
        console.log(chalk.red("  missing  ") + rel);
      } else if (isStale(rel)) {
        outdated++;
        console.log(chalk.yellow("  outdated ") + rel + chalk.gray(" (run `claude-engineer sync`)"));
      }
    }
    if (!missing && !outdated) {
      console.log("\n" + chalk.green("Everything looks good."));
    } else {
      console.log(
        "\n" + chalk.red(`Problems found: ${missing} missing, ${outdated} outdated.`) + " Run " +
        chalk.yellow("claude-engineer init") + " or " + chalk.yellow("claude-engineer sync") + " to fix."
      );
      process.exitCode = 1;
    }

    if (!opts.skipUpdateCheck) await checkForUpdate();
  });

program
  .command("learn")
  .description("Launch Claude Code with /learn-codebase to study this repository")
  .action(() => runClaude("/learn-codebase"));

program
  .command("standards")
  .description("Launch Claude Code with /write-standards to create or update docs/CODEBASE_STANDARDS.md")
  .action(() => runClaude("/write-standards"));

program
  .command("review")
  .description("Launch Claude Code with /review to review the current branch against your standards")
  .action(() => runClaude("/review"));

program.parse();
