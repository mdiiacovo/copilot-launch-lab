const app = document.querySelector("#app");
const notice = document.querySelector("#notice");
const workspaceDialog = document.querySelector("#workspace-dialog");
const sendDialog = document.querySelector("#send-dialog");
const phaseCelebration = document.querySelector("#phase-celebration");
const phaseCelebrationKicker = document.querySelector("#phase-celebration-kicker");
const phaseCelebrationTitle = document.querySelector("#phase-celebration-title");
const phaseCelebrationCopy = document.querySelector("#phase-celebration-copy");
const token = location.pathname.split("/")[1];
let data;
let activeTab = "mission";
let selectedPrompt = "";
let pendingSend;
let toastTimer;
let refreshRunning = false;
let mutationCount = 0;
let connectionLost = false;
let celebrationTimer;

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const currentMission = () => data.missions.find((item) => item.id === data.state.selectedMission);
const completed = (mission) => mission.checks.every((check) => data.state.checks[`${mission.id}:${check.id}`]);
const readyCount = () => data.artifacts.filter((item) => data.state.artifacts[item.id]?.status === "ready").length;
const artifactName = (id) => data.artifacts.find((item) => item.id === id)?.name ?? id;
const artifactLabel = (id) => data.artifacts.find((item) => item.id === id)?.label ?? artifactName(id);
const promptText = (prompt) => prompt.text.replaceAll("{{NOTES}}", () => data.state.notes);
const answerFor = (missionId) => data.state.answers?.[missionId];
const challengeFor = (missionId) => data.challenges?.[missionId];
const projectName = () => data.state.notes.match(/(?:^|\n)PROJECT\s*\n([^\n]+)/i)?.[1]?.trim() || data.state.workspace || "Your project";
const businessView = () => data.state.profile?.businessView !== false;
const capability = (name) => data.state.profile?.capabilities?.[name] ?? "unknown";

function toast(message, error = false) {
    clearTimeout(toastTimer);
    notice.textContent = message;
    notice.classList.toggle("error", error);
    notice.hidden = false;
    toastTimer = setTimeout(() => { notice.hidden = true; }, error ? 10000 : 5500);
}

async function api(path, input) {
    const response = await fetch(`./api/${path}`, input === undefined ? {} : {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Lab-Token": token },
        body: JSON.stringify(input),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
    return result;
}

async function update(input, rerender = true) {
    mutationCount += 1;
    try {
        data = await api("update", input);
        if (rerender) render();
    } finally {
        mutationCount -= 1;
    }
}

function progress() {
    const core = data.missions.filter((item) => !item.optional);
    const count = core.filter(completed).length;
    return { count, total: core.length, percent: Math.round(count / core.length * 100) };
}

function commandCenter() {
    const mission = currentMission();
    const ready = readyCount();
    const decisions = Object.keys(data.state.answers ?? {}).length;
    const finalAnswer = answerFor("safety");
    const finalOption = challengeFor("safety")?.options.find((option) => option.id === finalAnswer?.optionId);
    const recommendation = finalAnswer?.best ? finalOption?.commandLabel : finalAnswer ? "Needs revision" : "Pending review";
    const recommendationNote = finalAnswer?.best
        ? "supported by the final scenario"
        : finalAnswer
            ? "revisit the Mission 12 decision"
            : "complete Mission 12 to decide";
    const evidence = ready === 0 ? "Not recorded" : ready < 5 ? "Building" : ready < data.artifacts.length ? "Reviewing" : "Decision-ready";
    return `<section class="command-center" aria-label="Launch command center">
        <div class="command-center-head"><div><span class="eyebrow">${escapeHtml(projectName().toUpperCase())} / LAUNCH COMMAND CENTER</span><h2>Your project is taking shape.</h2></div><span class="command-phase">${escapeHtml(mission.phase)}</span></div>
        <div class="command-grid">
            <div><span>Current mission</span><strong>${String(mission.number).padStart(2, "0")} / ${data.missions.length}</strong><small>${escapeHtml(mission.title)}</small></div>
            <div><span>Launch kit</span><strong>${ready} / ${data.artifacts.length}</strong><small>artifacts recorded ready</small></div>
            <div><span>Evidence posture</span><strong>${evidence}</strong><small>${decisions} mission decision${decisions === 1 ? "" : "s"} explored</small></div>
            <div class="recommendation"><span>Executive recommendation</span><strong>${escapeHtml(recommendation)}</strong><small>${escapeHtml(recommendationNote)}</small></div>
        </div>
    </section>`;
}

function nextAction(mission) {
    if (!answerFor(mission.id)) {
        return { target: `challenge-${mission.id}`, label: "Make the scenario decision", copy: "Choose the response that best protects the project outcome." };
    }
    const prompt = mission.prompts[0];
    const produced = [...new Set(mission.prompts.flatMap((item) => item.produces ?? []))];
    if (prompt && produced.some((id) => data.state.artifacts[id]?.status !== "ready")) {
        return { target: `prompt-${mission.id}`, label: `Create ${artifactLabel(produced.find((id) => data.state.artifacts[id]?.status !== "ready") ?? produced[0])}`, copy: "Review the prompt, send it to the correct place, then inspect the real output." };
    }
    const unchecked = mission.checks.find((check) => !data.state.checks[`${mission.id}:${check.id}`]);
    if (unchecked) {
        return { target: `checkpoint-${mission.id}`, label: "Verify the evidence", copy: unchecked.label };
    }
    return { target: "mission-footer", label: "Continue when ready", copy: "This mission’s evidence is recorded. Move forward or revisit any decision." };
}

function capabilityNote(mission) {
    const mapping = {
        dashboard: ["canvas", "Canvas creation"],
        review: ["github", "GitHub publishing"],
        automate: ["automations", "Automations"],
        cloud: ["cloud", "Cloud automation"],
    };
    const match = mapping[mission.id];
    if (!match) return "";
    const status = capability(match[0]);
    const message = status === "available"
        ? `${match[1]} is marked available. Follow the mission and still review permissions and results.`
        : status === "unavailable"
            ? `${match[1]} is marked unavailable. Use the mission’s local fallback and leave unavailable checks incomplete.`
            : `${match[1]} is marked Not sure. Start with the safe local path and confirm availability before enabling anything.`;
    return `<div class="capability-note ${status}"><span>${escapeHtml(match[1])}</span><p>${escapeHtml(message)}</p><button class="button ghost" type="button" data-workspace>Update readiness</button></div>`;
}

function doNowCard(mission) {
    const action = nextAction(mission);
    return `<section class="do-now" aria-label="Do this now"><div><span class="eyebrow">DO THIS NOW</span><h3>${escapeHtml(action.label)}</h3><p>${escapeHtml(action.copy)}</p></div><div class="do-now-actions"><button class="button primary" type="button" data-jump-to="${escapeHtml(action.target)}">Take me there</button><button class="button ghost" type="button" data-coach="explain">Explain this</button><button class="button ghost" type="button" data-coach="check">Check my work</button><button class="button ghost" type="button" data-coach="stuck">I’m stuck</button></div></section>`;
}

function sidebar() {
    const stats = progress();
    const currentPhase = currentMission().phase;
    const phases = [...new Set(data.missions.map((mission) => mission.phase))];
    const navigation = phases.map((phase) => {
        const phaseMissions = data.missions.filter((mission) => mission.phase === phase);
        const requiredMissions = phaseMissions.filter((mission) => !mission.optional);
        const phaseComplete = requiredMissions.filter(completed).length;
        const missionLinks = phaseMissions.map((mission) => `<button class="mission-link ${mission.id === data.state.selectedMission ? "active" : ""} ${completed(mission) ? "completed" : ""}" data-mission="${mission.id}" aria-label="Mission ${mission.number}: ${escapeHtml(mission.title)}${completed(mission) ? ", complete" : ""}" ${mission.id === data.state.selectedMission ? 'aria-current="step"' : ""}>
            <span class="mission-number">${completed(mission) ? "&#10003;" : String(mission.number).padStart(2, "0")}</span>
            <span class="mission-label">${escapeHtml(mission.title)}</span>${mission.optional ? '<span class="optional-dot">OPT</span>' : ""}</button>`).join("");
        return `<details class="phase-group" ${phase === currentPhase ? "open" : ""}><summary><span>${escapeHtml(phase)}</span><small>${phaseComplete}/${requiredMissions.length}</small></summary>${missionLinks}</details>`;
    }).join("");
    return `<aside class="sidebar"><div class="brand"><img class="brand-symbol" src="./rocket.svg" alt="" width="36" height="36"><div><strong>GitHub</strong><small>Copilot Launch Lab</small></div></div>
        <div class="sidebar-label"><img class="launch-icon" src="./rocket.svg" alt="" width="18" height="18"><span>Learn by doing</span><span class="lab-label">LAB</span></div>
        <div class="journey-stat"><div class="stat-row"><span>Your progress</span><strong>${stats.percent}%</strong></div><progress class="progress" value="${stats.percent}" max="100" aria-label="Core lab completion">${stats.percent}%</progress><div class="stat-row progress-caption"><span>${stats.count} of ${stats.total} core missions</span><span>75&ndash;90 min</span></div></div>
        <nav class="chapter-nav" aria-label="Lab chapters and missions">${navigation}</nav>
        <div class="sidebar-footer"><strong>Build with GitHub Copilot.</strong><br>No code or terminal required.<br><a href="${escapeHtml(data.sourceUrl)}" target="_blank" rel="noopener noreferrer">Copilot Academy source lab &nearr;</a></div></aside>`;
}

function hero() {
    return `<section class="hero" aria-label="Lab introduction"><div class="hero-copy"><span class="product-lockup"><img class="launch-icon" src="./rocket.svg" alt="" width="24" height="24">GitHub Copilot<span class="lab-label">HANDS-ON LAB</span></span><h1>Less busywork.<br><span>More work that matters.</span></h1><p>Turn scattered launch notes into a plan, decision-ready artifacts, and a repeatable workflow. Get hands-on with GitHub Copilot App, one real mission at a time.</p><div class="hero-facts"><span><strong>12</strong> guided missions</span><span><strong>9</strong> deliverables</span><span>No code required</span></div></div>
        <div class="hero-visual" aria-hidden="true"><div class="rocket-orbit"><div class="rocket-emblem"><img src="./rocket.svg" alt="" width="64" height="64"></div><span class="orbit-point point-one"></span><span class="orbit-point point-two"></span></div><span class="visual-caption">IDEA &rarr; PLAN &rarr; SHIP</span></div></section>`;
}

function promptPanel(mission) {
    if (!mission.prompts.length) {
        return `<section class="card empty-prompt"><span class="badge purple">LEARN THE APP</span><h3>This step happens in Copilot App.</h3><p>Follow the mission steps, then check off what you've done. The canvas stays here as your guide &mdash; it doesn't simulate app navigation.</p><button class="button secondary" data-workspace>Set your learner workspace</button></section>`;
    }
    const prompt = mission.prompts.find((item) => item.id === selectedPrompt) ?? mission.prompts[0];
    selectedPrompt = prompt.id;
    const prerequisites = (prompt.requires ?? []);
    const missing = prerequisites.filter((id) => data.state.artifacts[id]?.status !== "ready");
    const last = [...data.state.dispatches].reverse().find((item) => item.missionId === mission.id && item.promptId === prompt.id);
    return `<section class="card prompt-card" aria-label="Ready-to-run prompt"><div class="card-header"><h3>Your next conversation</h3><span class="badge purple">${mission.prompts.length} prompt${mission.prompts.length === 1 ? "" : "s"}</span></div>
        <select class="prompt-select" id="prompt-select" aria-label="Choose an activity prompt">${mission.prompts.map((item) => `<option value="${item.id}" ${item.id === prompt.id ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}</select>
        <div class="prompt-meta"><span class="badge">${escapeHtml(prompt.mode)} mode</span><span class="badge">${escapeHtml(prompt.model)}</span><span class="badge">${prompt.target === "chat" ? "Chat" : prompt.target === "manual" ? "Start in the app" : "Project session"}</span></div>
        <details class="prompt-reveal"><summary><span>Review the full prompt</span><small>Open before sending</small></summary><pre class="prompt-text" id="prompt-content" tabindex="0">${escapeHtml(promptText(prompt))}</pre></details>
        ${prerequisites.length ? `<div class="requirements">Needs: ${prerequisites.map((id) => `${data.state.artifacts[id]?.status === "ready" ? "&#10003;" : "&#9675;"} ${escapeHtml(artifactLabel(id))}`).join(" &middot; ")}</div>` : ""}
        <div class="prompt-actions"><button class="button primary" data-copy>Copy prompt</button>${prompt.target !== "manual" ? '<button class="button secondary" data-run>Ask Copilot to help &nearr;</button>' : ""}</div>
        ${prompt.caution ? `<div class="caution">${escapeHtml(prompt.caution)}</div>` : ""}
        <p class="prompt-help">${prompt.target === "manual" ? "Copy this prompt and follow the app steps. The canvas will not schedule, publish, or start parallel agents for you." : missing.length ? 'Review the prerequisite files and record them in <strong>Your artifacts</strong> before sending a handoff. You can always copy the prompt yourself.' : "Copy into your learner session, or ask Copilot to route the task. You stay in control of approvals."}${last ? `<br><strong>Last sent ${escapeHtml(new Date(last.sentAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }))}.</strong> Confirm the result in Copilot; this is a receipt, not a completed task.` : ""}</p></section>`;
}

function challengePanel(mission) {
    const challenge = challengeFor(mission.id);
    if (!challenge) return "";
    const answer = answerFor(mission.id);
    const selected = challenge.options.find((option) => option.id === answer?.optionId);
    return `<section class="card challenge-card" aria-labelledby="challenge-title-${mission.id}">
        <div class="card-header"><div><span class="eyebrow">${escapeHtml(challenge.kicker)}</span><h3 id="challenge-title-${mission.id}">Make the call</h3></div>${answer ? `<span class="badge ${answer.best ? "green" : "amber"}">${answer.best ? "Strong choice" : "Revisit"}</span>` : '<span class="badge purple">Interactive</span>'}</div>
        <p class="challenge-question">${escapeHtml(challenge.question)}</p>
        <div class="challenge-options">${challenge.options.map((option) => `<button class="challenge-option ${answer?.optionId === option.id ? "selected" : ""}" type="button" data-answer="${option.id}" aria-pressed="${answer?.optionId === option.id}"><span>${escapeHtml(option.label)}</span></button>`).join("")}</div>
        <div class="challenge-feedback ${answer?.best ? "best" : ""}" role="status">${selected ? escapeHtml(selected.feedback) : "Choose an answer to reveal the reasoning. You can change your decision."}</div>
    </section>`;
}

function activityPanel(mission) {
    if (mission.id === "brief") {
        const selected = data.state.activities?.readiness;
        return `<section class="card activity-card" aria-labelledby="readiness-vote-title"><div class="card-header"><div><span class="eyebrow">Your first read</span><h3 id="readiness-vote-title">Vote before Copilot does</h3></div><span class="badge">Red / Yellow / Green</span></div>
            <p>Based only on the source notes, how ready does the launch feel right now?</p>
            <div class="readiness-vote">${[["red", "Red"], ["yellow", "Yellow"], ["green", "Green"]].map(([value, label]) => `<button type="button" class="${value} ${selected === value ? "selected" : ""}" data-readiness="${value}" aria-pressed="${selected === value}">${label}</button>`).join("")}</div>
            <div class="activity-feedback">${selected ? selected === "green" ? "Revisit the evidence: a severity 1 defect and several unresolved approvals make Green unsupported." : "Good instinct. Keep this vote, then compare it with the evidence-based brief Copilot produces." : "Record your instinct now. The goal is to compare it with evidence, not to guess the final answer."}</div>
        </section>`;
    }
    if (mission.id === "deliver") {
        const risks = [
            ["sev1", "Severity 1 dashboard-loading defect"],
            ["legal", "Data-retention wording approval"],
            ["billing", "Billing validation has no owner"],
            ["support", "Troubleshooting guide is incomplete"],
            ["communications", "Customer email timing conflict"],
        ];
        return `<section class="card activity-card" aria-labelledby="risk-priority-title"><div class="card-header"><div><span class="eyebrow">Risk room</span><h3 id="risk-priority-title">Prioritize the launch risks</h3></div><span class="badge purple">Business decision</span></div>
            <p>Sort each known risk into the attention level you would bring to the executive review.</p>
            <form class="risk-form" data-risk-form>${risks.map(([id, label]) => `<label><span>${escapeHtml(label)}</span><select name="${id}"><option value="">Choose priority</option>${[["critical", "Critical now"], ["watch", "Watch closely"], ["later", "Address later"]].map(([value, text]) => `<option value="${value}" ${data.state.activities?.risks?.[id] === value ? "selected" : ""}>${text}</option>`).join("")}</select></label>`).join("")}<button class="button secondary" type="submit">Save risk priorities</button></form>
            <div class="activity-feedback">The source does not support putting the severity 1 defect in “Later.” Your prioritization should remain visible as judgment, not be presented as resolved work.</div>
        </section>`;
    }
    if (mission.id === "automate") {
        const draft = data.state.activities?.automation;
        return `<section class="card activity-card" aria-labelledby="automation-builder-title"><div class="card-header"><div><span class="eyebrow">Automation rehearsal</span><h3 id="automation-builder-title">Design the recurring task first</h3></div><span class="badge amber">Simulation only</span></div>
            <p>Practice the choices before opening the real Automations area. Saving this card does not create a schedule.</p>
            <form class="automation-builder" data-automation-form>
                <label>Cadence<select name="cadence"><option value="manual" ${draft?.cadence === "manual" ? "selected" : ""}>Manual preview</option><option value="daily" ${draft?.cadence === "daily" ? "selected" : ""}>Daily</option><option value="weekly" ${!draft || draft?.cadence === "weekly" ? "selected" : ""}>Weekly</option></select></label>
                <label>Project<input name="project" maxlength="250" value="${escapeHtml(draft?.project || data.state.workspace || "product-launch-readiness")}"></label>
                <label>Expected output<input name="output" maxlength="250" value="${escapeHtml(draft?.output || "weekly-status.md")}"></label>
                <button class="button secondary" type="submit">Save rehearsal choices</button>
            </form>
            <div class="activity-feedback">${draft ? `Rehearsal saved: ${escapeHtml(draft.cadence)} for ${escapeHtml(draft.project)}, producing ${escapeHtml(draft.output)}. Now configure and verify the real automation in the app.` : "A real automation still requires a selected project, trigger, time zone, saved prompt, and inspected run."}</div>
        </section>`;
    }
    return "";
}

function outputPanel(mission) {
    const ids = [...new Set(mission.prompts.flatMap((prompt) => prompt.produces ?? []))];
    if (!ids.length) return "";
    return `<section class="card"><div class="card-header"><h3>What you'll leave with</h3></div><div class="output-list">${ids.map((id) => `<div class="output-item"><span><strong>${escapeHtml(artifactLabel(id))}</strong><small class="technical-detail">${escapeHtml(artifactName(id))}</small></span><span class="badge ${data.state.artifacts[id]?.status === "ready" ? "green" : ""}">${data.state.artifacts[id]?.status === "ready" ? "Recorded" : "Expected"}</span></div>`).join("")}</div><p class="self-reported">Outputs are created in your learner project, not inside this training canvas.</p></section>`;
}

function missionView() {
    const mission = currentMission();
    const index = data.missions.indexOf(mission);
    const doneChecks = mission.checks.filter((check) => data.state.checks[`${mission.id}:${check.id}`]).length;
    return `<section aria-labelledby="mission-title"><div class="mission-head"><div><div class="badges"><span class="badge purple">MISSION ${String(mission.number).padStart(2, "0")}</span><span class="badge">${escapeHtml(mission.phase)}</span><span class="badge">~${mission.minutes} min</span>${mission.optional ? '<span class="badge amber">Optional extension</span>' : ""}${completed(mission) ? '<span class="badge green">Checkpoint complete</span>' : ""}</div><h2 id="mission-title" tabindex="-1">${escapeHtml(mission.title)}</h2><p>${escapeHtml(mission.objective)}</p></div></div>
        <div class="mission-brief-grid"><div><span>Challenge</span><strong>${escapeHtml(mission.subtitle)}</strong></div><div><span>Why it matters</span><strong>${escapeHtml(mission.takeaway)}</strong></div><div><span>Evidence to collect</span><strong>${mission.checks.length} checkpoint${mission.checks.length === 1 ? "" : "s"} + real output review</strong></div></div>
        ${doNowCard(mission)}${capabilityNote(mission)}
        <div class="content-grid"><div class="stack"><section id="playbook-${mission.id}" class="card playbook-card"><div class="card-header"><h3>Your playbook</h3><a class="hint" href="${escapeHtml(data.sourceUrl)}#${escapeHtml(mission.sourceAnchor)}" target="_blank" rel="noopener noreferrer">Source &nearr;</a></div><details class="mission-playbook"><summary><span>Open the detailed steps</span><small>${mission.instructions.length} steps</small></summary><ol class="step-list">${mission.instructions.map((instruction) => `<li>${escapeHtml(instruction)}</li>`).join("")}</ol></details></section>
        <section id="checkpoint-${mission.id}" class="card checkpoint-card"><div class="card-header"><h3>Your checkpoint</h3><span class="badge">${doneChecks}/${mission.checks.length}</span></div>${mission.checks.map((check) => `<label class="checkpoint"><input type="checkbox" data-check="${check.id}" ${data.state.checks[`${mission.id}:${check.id}`] ? "checked" : ""}><span>${escapeHtml(check.label)}</span></label>`).join("")}<p class="self-reported">Check these yourself after doing the work. Copilot never auto-completes a learning checkpoint.</p></section></div>
        <div class="stack"><div id="challenge-${mission.id}">${challengePanel(mission)}</div>${activityPanel(mission)}<div id="prompt-${mission.id}">${promptPanel(mission)}</div>${outputPanel(mission)}${mission.id === "setup" ? '<div class="callout"><strong>Already signed in?</strong><br>You are using Copilot App right now. Complete the project-folder setup, then move on to your first real task.</div>' : ""}</div></div>
        <div id="mission-footer" class="mission-footer"><button class="button secondary" data-previous ${index === 0 ? "disabled" : ""}>&larr; Previous</button><small>${completed(mission) ? "Mission evidence recorded. Check the decision card, then continue." : "Explore freely; your unchecked items stay saved."}</small>${index < data.missions.length - 1 ? `<button class="button primary" data-next>${mission.optional && !completed(mission) ? "Skip optional mission" : "Next mission"} &rarr;</button>` : '<button class="button primary" data-tab="artifacts">Review your outcomes &rarr;</button>'}</div></section>`;
}

function launchKitMap() {
    return `<div class="launch-kit-map" aria-label="Launch kit progression">${data.artifacts.map((artifact, index) => {
        const record = data.state.artifacts[artifact.id] ?? { status: "missing" };
        return `<button class="launch-kit-node ${record.status}" data-mission="${artifact.mission}" type="button"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(artifact.label)}</strong><small>${record.status === "ready" ? "Ready for review" : record.status === "draft" ? "Draft in progress" : "Not started"}<b class="technical-detail">${escapeHtml(artifact.name)}</b></small></button>`;
    }).join("")}</div>`;
}

function artifactsView() {
    return `<section><div class="mission-head"><div><div class="badges"><span class="badge purple">YOUR REAL-WORLD OUTPUTS</span><span class="badge">${readyCount()}/${data.artifacts.length} recorded ready</span></div><h2>Your launch kit</h2><p>The goal isn't a checked box. It's something useful you can review and share.</p></div></div>
        <p class="section-intro">Track the files and canvases you actually create in your learner project. Add a location or review note before marking anything ready. This inventory is <strong>self-reported</strong>; it doesn't scan your folders or create sample files.</p>
        ${launchKitMap()}
        <div class="artifact-grid">${data.artifacts.map((artifact) => {
            const record = data.state.artifacts[artifact.id] ?? { status: "missing", evidence: "" };
            return `<section class="card artifact-card"><div class="card-header"><span class="badge ${record.status === "ready" ? "green" : record.status === "draft" ? "amber" : ""}">${record.status === "ready" ? "Ready for review" : record.status === "draft" ? "Draft in progress" : "Not started"}</span><button class="button ghost" data-mission="${artifact.mission}">Go to mission &nearr;</button></div><h3>${escapeHtml(artifact.label)}</h3><code class="artifact-filename technical-detail">${escapeHtml(artifact.name)}</code><p>${escapeHtml(artifact.description)}</p>
                <form class="artifact-form" data-artifact="${artifact.id}"><label for="status-${artifact.id}">STATUS</label><select id="status-${artifact.id}" name="status">${[["missing", "Not started"], ["draft", "Draft"], ["ready", "Ready"]].map(([value, label]) => `<option value="${value}" ${record.status === value ? "selected" : ""}>${label}</option>`).join("")}</select><label for="evidence-${artifact.id}">FILE LOCATION OR REVIEW NOTE</label><input id="evidence-${artifact.id}" name="evidence" maxlength="2000" placeholder="e.g. product-launch-readiness/action-tracker.csv" value="${escapeHtml(record.evidence)}"><button class="button secondary" type="submit">Save artifact status</button></form></section>`;
        }).join("")}</div></section>`;
}

function guideView() {
    const cards = [
        ["Chat or project session?", "Use a chat to think something through with self-contained context. Use a project session when Copilot needs to read, create, or update the files in your learner workspace."],
        ["Choose your autonomy", "Interactive is a collaborative conversation. Plan separates agreement from implementation. Autopilot keeps working with less intervention. Review the plan before authorizing execution."],
        ["Protect the handoff", "Keep the brief, plan, and reusable sources in the same learner project. A separate worktree is an isolated copy, not a guarantee that your latest local files came along."],
        ["Use models intentionally", "Auto fits summaries, trackers, and short updates. A higher-reasoning model can help with connected deliverables or a custom canvas. Availability and cost depend on your plan and policy."],
        ["Canvas is a shared surface", "This canvas is your training guide. In mission 6 you create a separate launch dashboard with controls for you and matching actions for Copilot. The two canvases have different jobs."],
        ["Automation is a separate step", "Producing weekly-status.md once is not the same as saving a recurring automation. Choose the project, schedule, time zone, and permissions in the app, then inspect a real run."],
        ["Optional means optional", "Fleet, GitHub issue publishing, and cloud automation need extra setup and can have cost or sharing implications. The local path teaches the core workflow without them."],
        ["Keep control", "Check evidence before marking an output ready. Unknown owners, pending approvals, and open risks stay unresolved until supported by new information. Never let a generated brief invent progress."],
    ];
    const glossary = [
        ["Project", "The folder or repository where Copilot keeps the files for a piece of work."],
        ["Repository", "A version-tracked folder. GitHub remembers changes over time."],
        ["Session", "A working conversation with its own project context and progress."],
        ["Worktree", "A separate working copy used to keep one line of changes isolated."],
        ["Artifact", "A useful output such as a brief, tracker, presentation, or dashboard."],
        ["MCP server", "An approved connection that gives Copilot access to another tool or data source."],
    ];
    return `<section><div class="badges"><span class="badge purple">KEEP THIS NEARBY</span></div><h2>Your field guide</h2><p class="section-intro">The habits behind the buttons. App labels and available features change; use the closest matching option and check the linked source when needed.</p><div class="guide-grid">${cards.map(([title, text]) => `<section class="card"><h3>${title}</h3><p>${text}</p></section>`).join("")}</div>
        <section class="card glossary"><div class="card-header"><h3>Plain-language glossary</h3><span class="badge">No jargon required</span></div><dl>${glossary.map(([term, definition]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>`).join("")}</dl></section></section>`;
}

function render() {
    const focus = document.activeElement;
    const focusId = focus?.id;
    const focusCheck = focus?.dataset?.check;
    const focusMission = focus?.dataset?.mission;
    const focusAnswer = focus?.dataset?.answer;
    app.innerHTML = `<div class="layout ${businessView() ? "business-view" : "detailed-view"}">${sidebar()}<div class="main-shell"><header class="topbar"><div class="breadcrumb"><span>GitHub Copilot</span><span aria-hidden="true">/</span><strong>Launch Lab</strong></div><div class="topbar-actions"><button class="button ghost view-toggle" type="button" data-view-toggle>${businessView() ? "Business view: On" : "Detailed view: On"}</button><button class="button secondary workspace-button ${data.state.workspace ? "configured" : ""}" data-workspace>${escapeHtml(data.state.workspace || "Set learner workspace")}</button><a class="button ghost" href="./api/export" download="copilot-launch-lab-progress.md">Export progress &darr;</a></div></header>
        <main id="main" class="main">${currentMission().id === "setup" ? hero() : ""}${commandCenter()}<div class="tabs" role="tablist" aria-label="Lab views">${[["mission", "Your mission"], ["artifacts", "Your artifacts"], ["guide", "Field guide"]].map(([id, title]) => `<button class="tab ${activeTab === id ? "active" : ""}" id="tab-${id}" data-tab="${id}" role="tab" aria-selected="${activeTab === id}" aria-controls="view-panel" tabindex="${activeTab === id ? "0" : "-1"}">${title}${id === "artifacts" ? `<span class="tab-count">${readyCount()}</span>` : ""}</button>`).join("")}</div>
        ${progress().count === progress().total ? '<div class="callout finished"><strong>Core learning journey complete.</strong> You built the workflow, recorded its evidence, and made the executive decision. Review the launch kit and export your progress as a reusable handoff.</div>' : ""}
        <div id="view-panel" role="tabpanel" aria-labelledby="tab-${activeTab}">${activeTab === "mission" ? missionView() : activeTab === "artifacts" ? artifactsView() : guideView()}</div>
        <footer class="page-footer"><span class="footer-brand"><img class="launch-icon" src="./rocket.svg" alt="" width="20" height="20">GitHub Copilot Launch Lab</span><span>Project canvas &middot; Session progress saved</span><a href="${escapeHtml(data.sourceUrl)}" target="_blank" rel="noopener noreferrer">Adapted from Copilot Academy &nearr;</a></footer></main></div></div>`;
    if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
    else if (focusCheck) app.querySelector(`[data-check="${CSS.escape(focusCheck)}"]`)?.focus({ preventScroll: true });
    else if (focusMission) app.querySelector(`[data-mission="${CSS.escape(focusMission)}"]`)?.focus({ preventScroll: true });
    else if (focusAnswer) app.querySelector(`[data-answer="${CSS.escape(focusAnswer)}"]`)?.focus({ preventScroll: true });
}

function showPhaseCelebration(mission) {
    clearTimeout(celebrationTimer);
    const messages = {
        Orient: ["Orientation complete", "Your workspace and Copilot controls are ready."],
        Build: ["Launch kit taking shape", "You turned source evidence into connected planning artifacts."],
        Coordinate: ["Coordination phase complete", "The project now has reviewable decisions and follow-up work."],
        Repeat: ["Launch Lab complete", "You built a repeatable workflow and kept the final decision human."],
    };
    const [title, copy] = messages[mission.phase] ?? ["Phase complete", "Your progress has been saved."];
    phaseCelebrationKicker.textContent = mission.phase === "Repeat" ? "Core journey complete" : `${mission.phase} phase complete`;
    phaseCelebrationTitle.textContent = title;
    phaseCelebrationCopy.textContent = copy;
    phaseCelebration.hidden = false;
    requestAnimationFrame(() => phaseCelebration.classList.add("active"));
    celebrationTimer = setTimeout(() => {
        phaseCelebration.classList.remove("active");
        setTimeout(() => { phaseCelebration.hidden = true; }, 250);
    }, 3600);
}

async function navigate(id) {
    activeTab = "mission";
    selectedPrompt = "";
    await update({ type: "select", missionId: id });
    document.querySelector("#mission-title").focus({ preventScroll: true });
}

function openWorkspace() {
    document.querySelector("#workspace-name").value = data.state.workspace;
    document.querySelector("#learner-role").value = data.state.profile?.role ?? "Project manager";
    for (const key of ["automations", "github", "canvas", "cloud"]) {
        document.querySelector(`[name="${key}"]`).value = capability(key);
    }
    document.querySelector("#scenario-notes").value = data.state.notes;
    workspaceDialog.showModal();
}

function openSend() {
    const mission = currentMission();
    const prompt = mission.prompts.find((item) => item.id === selectedPrompt);
    if (prompt.target === "project" && !data.state.workspace) {
        openWorkspace();
        toast("Save your learner project name first, then choose Ask Copilot again.");
        return;
    }
    const missing = (prompt.requires ?? []).filter((id) => data.state.artifacts[id]?.status !== "ready");
    if (missing.length) {
        toast(`Record these reviewed artifacts first: ${missing.map(artifactName).join(", ")}.`, true);
        return;
    }
    pendingSend = { kind: "task", missionId: mission.id, promptId: prompt.id };
    document.querySelector("#send-summary").innerHTML = `<strong>${escapeHtml(prompt.title)}</strong><br>Destination: ${escapeHtml(prompt.target === "chat" ? "This chat (no project file changes)" : data.state.workspace)}<br>Recommended: ${escapeHtml(prompt.mode)} / ${escapeHtml(prompt.model)}`;
    document.querySelector("#send-detail").textContent = prompt.target === "project"
        ? "The request goes to the conversation hosting this canvas. Copilot will resolve the learner project before doing file-based work and may ask you to confirm the destination."
        : "The request stays in the conversation hosting this canvas and does not create project files.";
    sendDialog.showModal();
}

function openCoach(coachType) {
    const mission = currentMission();
    if (coachType === "check" && !data.state.workspace) {
        openWorkspace();
        toast("Add your learner project before asking Copilot to check project work.");
        return;
    }
    const labels = {
        explain: ["Explain this mission", "Plain-language explanation in this conversation"],
        check: ["Check my real work", `Read-only review in ${data.state.workspace}`],
        stuck: ["Help me get unstuck", "One focused diagnostic question at a time"],
    };
    pendingSend = { kind: "coach", missionId: mission.id, coachType };
    document.querySelector("#send-summary").innerHTML = `<strong>${escapeHtml(labels[coachType][0])}</strong><br>Mission: ${escapeHtml(mission.title)}<br>${escapeHtml(labels[coachType][1])}`;
    document.querySelector("#send-detail").textContent = coachType === "check"
        ? "Copilot will locate the learner project and perform a read-only review. It will not modify files or complete the mission."
        : "The coaching request stays in this conversation. It explains or diagnoses the step without performing it.";
    sendDialog.showModal();
}

app.addEventListener("click", async (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    try {
        if (button.dataset.mission) await navigate(button.dataset.mission);
        else if (button.dataset.tab) { activeTab = button.dataset.tab; render(); document.getElementById(`tab-${activeTab}`).focus(); }
        else if (button.hasAttribute("data-workspace")) openWorkspace();
        else if (button.hasAttribute("data-view-toggle")) await update({ type: "view", businessView: !businessView() });
        else if (button.dataset.jumpTo) {
            const target = document.getElementById(button.dataset.jumpTo);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
                target.querySelector("button, summary, input, select")?.focus({ preventScroll: true });
            }
        }
        else if (button.dataset.coach) openCoach(button.dataset.coach);
        else if (button.hasAttribute("data-previous")) await navigate(data.missions[data.missions.indexOf(currentMission()) - 1].id);
        else if (button.hasAttribute("data-next")) await navigate(data.missions[data.missions.indexOf(currentMission()) + 1].id);
        else if (button.hasAttribute("data-run")) openSend();
        else if (button.dataset.answer) {
            await update({ type: "answer", missionId: currentMission().id, optionId: button.dataset.answer });
        } else if (button.dataset.readiness) {
            await update({ type: "activity", activity: "readiness", value: button.dataset.readiness });
        } else if (button.hasAttribute("data-copy")) {
            const prompt = currentMission().prompts.find((item) => item.id === selectedPrompt);
            try {
                await navigator.clipboard.writeText(promptText(prompt));
                toast("Prompt copied. Paste it into the indicated chat or project session.");
            } catch {
                const range = document.createRange();
                range.selectNodeContents(document.querySelector("#prompt-content"));
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                toast("Clipboard permission is unavailable. Prompt selected; use your keyboard Copy command.", true);
            }
        }
    } catch (error) { toast(error.message, true); }
});

app.addEventListener("keydown", (event) => {
    if (event.target.getAttribute("role") !== "tab" || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = ["mission", "artifacts", "guide"];
    const index = tabs.indexOf(activeTab);
    activeTab = event.key === "Home" ? tabs[0] : event.key === "End" ? tabs[2] : tabs[(index + (event.key === "ArrowRight" ? 1 : 2)) % 3];
    render();
    document.getElementById(`tab-${activeTab}`).focus();
});

app.addEventListener("change", async (event) => {
    try {
        if (event.target.id === "prompt-select") { selectedPrompt = event.target.value; render(); }
        else if (event.target.dataset.check) {
            const mission = currentMission();
            const missionIndex = data.missions.indexOf(mission);
            const wasComplete = completed(mission);
            const complete = event.target.checked;
            const willComplete = mission.checks.every((check) => check.id === event.target.dataset.check
                ? complete
                : Boolean(data.state.checks[`${mission.id}:${check.id}`]));
            event.target.disabled = true;
            try {
                await update({ type: "checkpoint", missionId: currentMission().id, checkId: event.target.dataset.check, complete });
                const nextMission = data.missions[missionIndex + 1];
                if (!wasComplete && willComplete && (!nextMission || nextMission.phase !== mission.phase)) {
                    showPhaseCelebration(mission);
                }
            } catch (error) {
                render();
                throw error;
            }
        }
    } catch (error) { toast(error.message, true); }
});

app.addEventListener("submit", async (event) => {
    const riskForm = event.target.closest("[data-risk-form]");
    if (riskForm) {
        event.preventDefault();
        const fields = new FormData(riskForm);
        try {
            const updates = [...fields.entries()].filter(([, priority]) => priority);
            if (!updates.length) throw new Error("Choose at least one risk priority.");
            for (const [riskId, priority] of updates) {
                await update({ type: "activity", activity: "risk", riskId, priority }, false);
            }
            render();
            toast("Risk priorities saved as your current judgment.");
        } catch (error) { toast(error.message, true); }
        return;
    }
    const automationForm = event.target.closest("[data-automation-form]");
    if (automationForm) {
        event.preventDefault();
        const fields = new FormData(automationForm);
        try {
            await update({
                type: "activity",
                activity: "automation",
                cadence: fields.get("cadence"),
                project: fields.get("project"),
                output: fields.get("output"),
            });
            toast("Automation rehearsal saved. No real schedule was created.");
        } catch (error) { toast(error.message, true); }
        return;
    }
    const form = event.target.closest("[data-artifact]");
    if (!form) return;
    event.preventDefault();
    const fields = new FormData(form);
    try {
        await update({ type: "artifact", artifactId: form.dataset.artifact, status: fields.get("status"), evidence: fields.get("evidence") });
        toast("Artifact status saved with your review note.");
    } catch (error) { toast(error.message, true); }
});

document.querySelector("#workspace-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = new FormData(event.target);
    try {
        await update({
            type: "workspace",
            workspace: fields.get("workspace"),
            notes: fields.get("notes"),
            role: fields.get("role"),
            capabilities: {
                automations: fields.get("automations"),
                github: fields.get("github"),
                canvas: fields.get("canvas"),
                cloud: fields.get("cloud"),
            },
        });
        workspaceDialog.close();
        toast("Learning profile saved. Existing outputs are still in your learner project.");
    } catch (error) { toast(error.message, true); }
});

document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelector("#confirm-send").addEventListener("click", async (event) => {
    const button = event.target;
    button.disabled = true;
    button.textContent = "Sending...";
    try {
        const result = await api(pendingSend.kind === "coach" ? "coach" : "launch", pendingSend);
        sendDialog.close();
        toast(result.warning || (pendingSend.kind === "coach"
            ? "Copilot Coach request sent. Continue in the conversation; your progress stays unchanged."
            : "Request sent to Copilot. Continue in the conversation; your checkpoints stay unchanged."), Boolean(result.warning));
        data = await api("state");
        render();
    } catch (error) { toast(error.message, true); }
    finally { button.disabled = false; button.textContent = "Send to Copilot"; }
});

async function refresh() {
    if (!data || document.hidden || refreshRunning || mutationCount ||
        document.querySelector("dialog[open]") ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
    refreshRunning = true;
    try {
        const next = await api("state");
        if (next.state.revision > data.state.revision) {
            data = next;
            render();
        }
        if (connectionLost) { connectionLost = false; toast("Connection restored. Your saved progress is available."); }
    } catch {
        if (!connectionLost) {
            connectionLost = true;
            toast("The canvas connection was lost. Reopen Launch Lab from Copilot if the extension was reloaded. Saved progress is on disk.", true);
        }
    } finally { refreshRunning = false; }
}

api("state").then((result) => {
    data = result;
    render();
    setInterval(refresh, 2500);
}).catch((error) => {
    app.innerHTML = `<div class="loading"><h1>The lab couldn't open.</h1><p>${escapeHtml(error.message)}</p><button class="button primary" id="retry">Try again</button></div>`;
    document.querySelector("#retry").addEventListener("click", () => location.reload());
});
