#!/usr/bin/env node
/**
 * End-to-end smoke test: runs the built CLI against a throwaway temp repo
 * and asserts init / doctor / sync (incl. drift detection) behave.
 */
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const CLI = path.join(__dirname, "..", "bin", "claude-engineer.js");

function run(args, cwd) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: "utf8",
    shell: false,
  });
}

function makeTmpRepo() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "claude-engineer-smoke-"));
}

function test(name, fn) {
  try {
    fn();
    console.log(`ok   - ${name}`);
  } catch (err) {
    console.error(`FAIL - ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

const repo = makeTmpRepo();

test("init --all scaffolds every tool", () => {
  const res = run(["init", "--all"], repo);
  assert.strictEqual(res.status, 0, res.stderr || res.stdout);
  assert.ok(fs.existsSync(path.join(repo, ".claude", "commands", "learn-codebase.md")));
  assert.ok(fs.existsSync(path.join(repo, ".cursor", "rules", "coding.mdc")));
  assert.ok(fs.existsSync(path.join(repo, "AGENTS.md")));
  assert.ok(fs.existsSync(path.join(repo, "docs", "CODEBASE_STANDARDS.md")));
});

test("doctor passes right after init", () => {
  const res = run(["doctor"], repo);
  assert.strictEqual(res.status, 0, res.stdout + res.stderr);
  assert.ok(/Everything looks good/.test(res.stdout));
});

test("doctor flags a hand-edited managed file as outdated", () => {
  const managed = path.join(repo, ".claude", "commands", "review.md");
  fs.appendFileSync(managed, "\n<!-- local edit -->\n");
  const res = run(["doctor"], repo);
  assert.strictEqual(res.status, 1);
  assert.ok(/outdated/.test(res.stdout), res.stdout);
});

test("sync --dry-run reports the drifted file without writing", () => {
  const managed = path.join(repo, ".claude", "commands", "review.md");
  const before = fs.readFileSync(managed, "utf8");
  const res = run(["sync", "--dry-run"], repo);
  assert.strictEqual(res.status, 0, res.stdout + res.stderr);
  assert.ok(/would update.*review\.md/.test(res.stdout), res.stdout);
  assert.strictEqual(fs.readFileSync(managed, "utf8"), before);
});

test("sync restores the drifted managed file and doctor passes again", () => {
  run(["sync"], repo);
  const res = run(["doctor"], repo);
  assert.strictEqual(res.status, 0, res.stdout + res.stderr);
});

test("init does not clobber untouched files without --force", () => {
  const claudeMd = path.join(repo, "CLAUDE.md");
  fs.appendFileSync(claudeMd, "\ncustom notes\n");
  run(["init", "--all"], repo);
  assert.ok(fs.readFileSync(claudeMd, "utf8").includes("custom notes"));
});

fs.rmSync(repo, { recursive: true, force: true });

if (process.exitCode) {
  console.error("\nSmoke tests failed.");
  process.exit(1);
}
console.log("\nAll smoke tests passed.");
