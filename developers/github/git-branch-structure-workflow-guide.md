---
title: Git Branch Structure & Workflow Guide
path: GitHub
---
# Git Branch Structure & Workflow Guide

This project uses a structured, versioned Git branching model to help organize development, releases, bugfixes, and hotfixes for each Minecraft version.

Branches follow the naming pattern:

```
mc<VERSION>/<TYPE>/<NAME>
```

For example:

* `mc1.20.1/feature/#72`
* `mc1.20.1/dev`
* `mc1.20.1/main`

## Branch Types

| Branch Type      | Purpose                              | Example                         |
| ---------------- | ------------------------------------ | ------------------------------- |
| `main`           | Stable, released code                | `mc1.20.1/main`                 |
| `dev`            | Ongoing development                  | `mc1.20.1/dev`                  |
| `feature/<name>` | New features or experimental ideas   | `mc1.20.1/feature/#72`   |
| `bugfix/<name>`  | Bug fixes during development         | `mc1.20.1/bugfix/#71`   |
| `hotfix/<name>`  | Critical fixes for released versions | `mc1.20.1/hotfix/0.5.4` |
| `release/<name>` | Prepares a release candidate         | `mc1.20.1/release/1.2.0`       |

---

## Automating Branch Management

To simplify working with branches, you can use the provided shell script to **create**, **merge**, and **delete** branches in the correct structure.

### Prerequisites

* Ensure the script is executable:

  ```bash
  chmod +x gitflow.sh
  ```
* Run it from your project directory.

---

## Usage Examples

### Start a new feature

```bash
./gitflow.sh start feature 1.20.1 "#72"
```

Creates and switches to `mc1.20.1/feature/#72` from `mc1.20.1/dev`.

### Finish a feature

```bash
./gitflow.sh finish feature 1.20.1 "#72"
```

Merges it into `mc1.20.1/dev` and deletes the branch.

---

### Start a bugfix

```bash
./gitflow.sh start bugfix 1.20.1 "#71"
```

### Finish a bugfix

```bash
./gitflow.sh finish bugfix 1.20.1 "#71"
```

---

### Start a release

```bash
./gitflow.sh start release 1.20.1 "1.2.0"
```

### Finish a release

```bash
./gitflow.sh finish release 1.20.1 "1.2.0"
```

Merges into `mc1.20.1/main` and `mc1.20.1/dev`, then deletes the release branch.

---

### Start a hotfix

```bash
./gitflow.sh start hotfix 1.20.1 "0.5.4"
```

### Finish a hotfix

```bash
./gitflow.sh finish hotfix 1.20.1 "0.5.4"
```

Merges into `main` and `dev`, then deletes the hotfix branch.

---

### Switch to a branch

```bash
./gitflow.sh checkout dev 1.20.1
./gitflow.sh checkout feature 1.20.1 "#72"
```

---

### Push all branches

```bash
./gitflow.sh push all
```

Pushes all local branches that start with `mc` to the remote.

---

## Notes

* All branches are scoped to a specific **Minecraft version** using the `mc<version>` prefix.
* Merges use `--no-ff` for clarity in the Git history.
* Always pull before merging or starting new branches to ensure you are up to date.
* Feature, bugfix, and release branches are automatically deleted after merging.
