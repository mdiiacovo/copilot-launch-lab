# GitHub Copilot Launch Lab

A business-friendly, hands-on lab for learning GitHub Copilot App through a realistic product-launch readiness scenario. The lab opens as an interactive canvas with 12 guided missions, ready-to-run prompts, decision exercises, checkpoints, and artifact tracking. No coding or terminal experience is required.

## What you will learn

The missions build one connected launch workflow instead of a collection of isolated demos:

1. Set up a reusable Copilot project.
2. Create an evidence-based launch brief.
3. Choose between chats, sessions, modes, and models.
4. Review a plan before implementation.
5. Produce a tracker and executive story.
6. Build a separate, bidirectional launch dashboard or an honest markdown fallback.
7. Create connected risk and stakeholder deliverables.
8. Review outputs and capture follow-up work safely.
9. Understand skills, MCP servers, plugins, custom agents, and canvases.
10. Design, run, and refine a recurring automation.
11. Evaluate an optional cloud-agent automation path.
12. Apply safety, session-management, and go/no-go practices.

The default Pulse Analytics scenario is fictional, but the files and decisions you create are real. You can replace the starter notes with an approved business scenario.

## Prerequisites

- [GitHub Copilot App](https://github.com/features/copilot) installed and signed in.
- Access to GitHub Copilot and project extensions in the app.
- Permission to add a local folder or GitHub repository as a Copilot project.
- A local learner project where the lab can create reusable artifacts.

GitHub write access, Automations, canvas creation, and cloud-agent execution are optional. The lab provides safe local fallbacks when those features are unavailable.

## Add this repository as a Copilot project

This repository contains a project-scoped extension at `.github/extensions/copilot-launch-lab`. When the repository is added to GitHub Copilot App as a project, the app automatically loads the extension for sessions in that project.

1. Optionally [fork this repository](https://github.com/mdiiacovo/copilot-launch-lab/fork) if you want your own copy.
2. In GitHub Copilot App, add `mdiiacovo/copilot-launch-lab` or your fork as a GitHub repository project.
3. Alternatively, clone the repository locally and use **Add project from → Local folder or repository** to select the clone.
4. Start a Copilot session in that project.
5. Enter this exact prompt:

   > Open the GitHub Copilot Launch Lab canvas

The canvas guides you to create the learner artifacts in a separate project. In Mission 6, the launch dashboard you create is a distinct output; this training canvas is not the dashboard deliverable.

## Install the extension directly

You can also install the canvas extension directly from:

<https://github.com/mdiiacovo/copilot-launch-lab/tree/main/.github/extensions/copilot-launch-lab>

In GitHub Copilot App, ask Copilot to install the extension from that URL, then enter:

> Open the GitHub Copilot Launch Lab canvas

Direct installation is useful for trying the lab outside this repository. Adding or cloning the repository is the recommended way to use its project-scoped extension as published.

## Progress and privacy

Learner progress is stored per Copilot session in that session's workspace. It is not committed to this repository, shared with other sessions automatically, or proof that a learner artifact or external automation exists. The canvas only records checkpoints and evidence the learner explicitly supplies.

Use only information you are permitted to share, and follow your organization's data, repository, automation, and cloud-execution policies.

## Source and attribution

This experience adapts the original Copilot Academy lab:

<https://copilot-academy.github.io/labs/getting-work-done-with-copilot-app>

The repository is licensed under the [MIT License](LICENSE). The lab uses an original rocket icon rather than GitHub or Copilot logos. The bundled Mona Sans font retains its original license and attribution in [THIRD-PARTY-NOTICES.txt](.github/extensions/copilot-launch-lab/THIRD-PARTY-NOTICES.txt).
