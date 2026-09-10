import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { artifacts, challenges, missions, starterNotes } from "./content.mjs";
import { buildHandoff, createStore, exportProgress, freshState, materializePrompt, transition } from "./state.mjs";

test("curriculum covers all twelve missions with valid references and safe manual paths", () => {
    assert.deepEqual(missions.map((m) => m.id), ["setup", "brief", "modes", "plan", "artifacts", "dashboard", "deliver", "review", "customize", "automate", "cloud", "safety"]);
    assert.deepEqual(missions.filter((m) => m.optional).map((m) => m.id), ["cloud"]);
    const ids = new Set(artifacts.map((a) => a.id));
    assert.equal(ids.size, artifacts.length);
    for (const mission of missions) {
        assert.ok(mission.instructions.length);
        assert.ok(mission.checks.length);
        assert.ok(mission.sourceAnchor);
        assert.ok(challenges[mission.id]);
        assert.ok(challenges[mission.id].question);
        assert.equal(challenges[mission.id].options.filter((option) => option.best).length, 1);
        assert.equal(new Set(challenges[mission.id].options.map((option) => option.id)).size, challenges[mission.id].options.length);
        assert.equal(new Set(mission.checks.map((c) => c.id)).size, mission.checks.length);
        assert.equal(new Set(mission.prompts.map((p) => p.id)).size, mission.prompts.length);
        for (const prompt of mission.prompts) {
            assert.ok(["project", "chat", "manual"].includes(prompt.target));
            for (const id of [...(prompt.requires ?? []), ...(prompt.produces ?? [])]) assert.ok(ids.has(id), id);
            if (prompt.text.includes("/fleet")) assert.equal(prompt.target, "manual");
        }
    }
    for (const artifact of artifacts) assert.ok(missions.some((m) => m.id === artifact.mission));
});

test("mission decisions persist feedback without completing checkpoints", () => {
    const state = freshState();
    const challenge = challenges.setup;
    const best = challenge.options.find((option) => option.best);
    const next = transition(state, { type: "answer", missionId: "setup", optionId: best.id });
    assert.equal(next.answers.setup.optionId, best.id);
    assert.equal(next.answers.setup.best, true);
    assert.deepEqual(next.checks, {});
    assert.throws(() => transition(state, { type: "answer", missionId: "setup", optionId: "not-real" }), /Unknown challenge answer/);
    assert.throws(() => transition(state, { type: "answer", missionId: "not-real", optionId: best.id }), /Unknown mission challenge/);
    assert.match(exportProgress(next), /The same local project folder \(recommended\)/);
});

test("business profile and practice activities persist safely", () => {
    let state = freshState();
    state = transition(state, { type: "view", businessView: false });
    assert.equal(state.profile.businessView, false);
    state = transition(state, {
        type: "workspace",
        workspace: "launch-room",
        notes: "PROJECT\nNorth Star",
        role: "Operations leader",
        capabilities: { automations: "available", github: "unavailable", canvas: "unknown", cloud: "unavailable" },
    });
    assert.equal(state.profile.role, "Operations leader");
    assert.equal(state.profile.capabilities.github, "unavailable");
    state = transition(state, { type: "activity", activity: "readiness", value: "red" });
    state = transition(state, { type: "activity", activity: "risk", riskId: "sev1", priority: "critical" });
    state = transition(state, { type: "activity", activity: "automation", cadence: "weekly", project: "launch-room", output: "weekly-status.md" });
    assert.equal(state.activities.readiness, "red");
    assert.equal(state.activities.risks.sev1, "critical");
    assert.equal(state.activities.automation.cadence, "weekly");
    assert.match(exportProgress(state), /Role: Operations leader/);
    assert.throws(() => transition(state, { type: "activity", activity: "risk", riskId: "sev1", priority: "ignore" }), /Invalid risk priority/);
});

test("checkpoint updates are reversible and independent from artifacts", () => {
    const state = freshState();
    const input = { type: "checkpoint", missionId: "setup", checkId: missions[0].checks[0].id, complete: true };
    const next = transition(state, input);
    assert.equal(next.checks[`setup:${input.checkId}`], true);
    assert.deepEqual(state.checks, {});
    assert.deepEqual(next.artifacts, {});
    assert.equal(transition(next, { ...input, complete: false }).checks[`setup:${input.checkId}`], false);
    assert.throws(() => transition(state, { ...input, checkId: "not-real" }), /Unknown checkpoint/);
    assert.throws(() => transition(state, { ...input, complete: "true" }), /must be true or false/);
});

test("ready artifacts require evidence and reject invalid identifiers", () => {
    const state = freshState();
    const input = { type: "artifact", artifactId: artifacts[0].id, status: "ready", evidence: "" };
    assert.throws(() => transition(state, input), /location or review note/);
    const next = transition(state, { ...input, evidence: "/learner/launch-readiness-brief.md reviewed" });
    assert.equal(next.artifacts[input.artifactId].status, "ready");
    assert.throws(() => transition(state, { ...input, artifactId: "__proto__" }), /Unknown artifact/);
    assert.throws(() => transition(state, { ...input, status: "verified" }), /Invalid artifact/);
});

test("project requests require a named workspace and reviewed prerequisites", () => {
    let state = freshState();
    const mission = missions.find((m) => m.id === "brief");
    const prompt = mission.prompts.find((p) => p.target === "project");
    assert.throws(() => buildHandoff(state, mission.id, prompt.id, "unit-test"), /exact learner project/);
    state = transition(state, { type: "workspace", workspace: "product-launch-readiness", notes: "Edited scenario notes." });
    const handoff = buildHandoff(state, mission.id, prompt.id, "unit-test");
    assert.match(handoff, /Edited scenario notes/);
    assert.match(handoff, /has NOT changed/);
    assert.match(handoff, /Never launch Fleet/);
    assert.match(handoff, /Do not mark learning checkpoints/);
    const downstream = missions.find((m) => m.prompts.some((p) => p.target === "project" && p.requires?.length));
    const blocked = downstream.prompts.find((p) => p.target === "project" && p.requires?.length);
    assert.throws(() => buildHandoff(state, downstream.id, blocked.id, "unit-test"), /required artifacts first/);
    for (const id of blocked.requires) state = transition(state, { type: "artifact", artifactId: id, status: "ready", evidence: "Reviewed in learner session." });
    assert.ok(buildHandoff(state, downstream.id, blocked.id, "unit-test"));
});

test("manual paths never become executable handoffs", () => {
    for (const mission of missions) {
        for (const prompt of mission.prompts.filter((p) => p.target === "manual")) {
            assert.throws(() => buildHandoff(freshState(), mission.id, prompt.id, "unit-test"), /must be started manually/);
        }
    }
});

test("custom scenario notes substitute literally without interpreting replacement patterns", () => {
    const mission = missions.find((m) => m.id === "brief");
    const prompt = mission.prompts.find((p) => p.text.includes("{{NOTES}}"));
    assert.ok(prompt, "Brief prompt must include starter notes");
    const state = freshState();
    state.notes = "Literal user content: $& $` $' {{NOTES}}";
    const output = materializePrompt(state, mission.id, prompt.id);
    assert.ok(output.includes(state.notes));
});

test("dispatch receipts do not mark artifacts or checks complete", () => {
    const mission = missions.find((m) => m.prompts.length);
    const state = transition(freshState(), { type: "dispatch", missionId: mission.id, promptId: mission.prompts[0].id });
    assert.equal(state.dispatches.length, 1);
    assert.deepEqual(state.checks, {});
    assert.deepEqual(state.artifacts, {});
});

test("serialized atomic writes survive reopening and rejected updates", async () => {
    const directory = await mkdtemp(join(tmpdir(), "copilot-launch-lab-test-"));
    try {
        const file = join(directory, "progress.json");
        const store = await createStore(file);
        await store.update({ type: "workspace", workspace: "My lab", notes: starterNotes });
        await assert.rejects(store.update({ type: "select", missionId: "bad" }), /Unknown mission/);
        const first = store.update({ type: "checkpoint", missionId: "setup", checkId: missions[0].checks[0].id, complete: true });
        const second = store.update({ type: "select", missionId: "brief" });
        await first;
        await second;
        const reopened = await createStore(file);
        assert.deepEqual(reopened.get(), store.get());
        assert.equal(reopened.get().revision, 3);
        assert.equal(JSON.parse(await readFile(file, "utf8")).selectedMission, "brief");
        assert.match(exportProgress(reopened.get()), /learner-reported/);
    } finally {
        await rm(directory, { recursive: true });
    }
});

test("corrupt saved progress is surfaced rather than silently reset", async () => {
    const directory = await mkdtemp(join(tmpdir(), "copilot-launch-lab-test-"));
    try {
        const file = join(directory, "progress.json");
        await writeFile(file, "{bad json");
        await assert.rejects(createStore(file), SyntaxError);
        assert.equal(await readFile(file, "utf8"), "{bad json");
    } finally {
        await rm(directory, { recursive: true });
    }
});
