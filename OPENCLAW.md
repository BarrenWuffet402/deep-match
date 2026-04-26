# Developing DeepMatch with OpenClaw

This project was built using an autonomous coding loop via [OpenClaw](https://openclaw.ai) — an open-source agent orchestration platform that lets you delegate coding tasks to AI agents (Claude Code, Codex, etc.) and control them via Telegram.

This document explains how to set up your own OpenClaw instance to continue developing this project autonomously.

---

## What is a ralph loop?

A ralph loop is a self-iterating coding workflow where the agent:

1. Reads the codebase and generates a set of issues
2. Implements solutions for those issues
3. Reviews what was built
4. Notifies you on Telegram for approval
5. Repeats for N iterations

You stay in the loop via Telegram — approve, redirect, or stop at any point.

---

## Prerequisites

- [OpenClaw](https://openclaw.ai) installed (`npm install -g openclaw` or via Homebrew)
- A Telegram bot token (create one via [@BotFather](https://t.me/BotFather))
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- Docker (for sandboxed execution)
- `claude` CLI installed (`npm install -g @anthropic-ai/claude-code`)

---

## Setup

**1. Configure OpenClaw**
```bash
openclaw configure
```
Follow the wizard — set your Anthropic API key, Telegram bot token, and workspace path.

**2. Enable the sandbox**

Edit `~/.openclaw/openclaw.json` and add to your agent config:
```json
"sandbox": {
  "mode": "all",
  "workspaceAccess": "rw"
}
```
Then restart the gateway:
```bash
openclaw gateway restart
```

**3. Point the workspace at this project**

Set your OpenClaw workspace to the directory containing this repo, or clone the repo into `~/.openclaw/workspace/deep-match`.

**4. Start the gateway**
```bash
openclaw gateway start
```

**5. Pair your Telegram account**

DM your bot on Telegram — it will send you a pairing code. Approve it:
```bash
openclaw pairing approve telegram <CODE>
```

---

## Running a coding loop

Send this prompt to your bot on Telegram to start a 3-iteration ralph loop:

```
/coding-agent

Run a 3-iteration ralph loop on the DeepMatch project at /workspace/deep-match.

For each iteration:
1. Generate 3-5 specific, buildable issues based on the current state of the codebase
2. Implement all issues
3. Write a short review of what was built
4. Send me a Telegram summary and wait for my approval before the next iteration

Stack: React 18, TypeScript, Vite, Tailwind CSS v3, React Router v6, Express (Node)

[Describe what you want built in this session]
```

---

## Tips

- **Review between iterations** — the agent waits for your Telegram reply before continuing. Use this to steer direction.
- **Be specific in your prompt** — the more context you give about what to build, the better the output.
- **Check the workspace** — all files are written to `/workspace/deep-match` inside the sandbox, mapped to your local workspace folder.
- **Sandbox isolation** — the agent runs inside a Docker container. It cannot access files outside the workspace mount.

---

## Recommended server setup

For autonomous operation without tying up your personal machine, run OpenClaw on a VPS:

- **Provider:** Hetzner, DigitalOcean, or similar (~$5-10/month)
- **OS:** Ubuntu 24.04
- **Install:** OpenClaw + Docker + claude CLI
- **Control:** entirely via Telegram from any device

This keeps the agent running 24/7 without affecting your local environment.

---

## Resources

- [OpenClaw docs](https://docs.openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw-ai/openclaw)
- [Anthropic API](https://console.anthropic.com)
