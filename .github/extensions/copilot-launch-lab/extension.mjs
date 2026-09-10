import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { join } from "node:path";
import { joinSession, createCanvas } from "@github/copilot-sdk/extension";
import { artifacts, challenges, missions, sourceUrl } from "./content.mjs";
import { buildHandoff, createStore, exportProgress, InputError, materializePrompt } from "./state.mjs";

const servers = new Map();
let store;
let session;
let sending = false;

function objectSchema(properties, required = Object.keys(properties)) {
    return { type: "object", properties, required, additionalProperties: false };
}
const string = { type: "string" };
const missionId = { type: "string", enum: missions.map((mission) => mission.id) };
const artifactId = { type: "string", enum: artifacts.map((artifact) => artifact.id) };
const status = { type: "string", enum: ["missing", "draft", "ready"] };

function payload() {
    return { state: store.get(), missions, artifacts, challenges, sourceUrl };
}

async function sendTask(input, instanceId) {
    if (sending) throw new InputError("A handoff is already being sent. Please wait.");
    const prompt = buildHandoff(store.get(), input.missionId, input.promptId, instanceId);
    sending = true;
    try {
        await session.send({ prompt });
        try {
            await store.update({ type: "dispatch", missionId: input.missionId, promptId: input.promptId });
        } catch (error) {
            await session.log(`Launch Lab sent the task but could not save its receipt: ${error.message}`, { level: "error" });
            return { sent: true, warning: "Task sent, but the receipt could not be saved. Do not resend it." };
        }
        return { sent: true };
    } finally {
        sending = false;
    }
}

async function sendCoach(input, instanceId) {
    if (sending) throw new InputError("A handoff is already being sent. Please wait.");
    const mission = missions.find((item) => item.id === input.missionId);
    if (!mission) throw new InputError("Unknown mission.");
    if (!["explain", "check", "stuck"].includes(input.coachType)) throw new InputError("Unknown coaching request.");
    const state = store.get();
    const role = state.profile?.role ?? "Project manager";
    const outputs = [...new Set(mission.prompts.flatMap((prompt) => prompt.produces ?? []))]
        .map((id) => artifacts.find((artifact) => artifact.id === id))
        .filter(Boolean);
    const routing = input.coachType === "check" && state.workspace
        ? `The learner selected this project name: ${JSON.stringify(state.workspace)}. Resolve that exact configured project and perform a read-only review there. If it is ambiguous or unavailable, ask the learner to select it.`
        : "Keep this response in the current conversation. Do not create or modify files.";
    const request = input.coachType === "explain"
        ? `Explain this mission to a ${role} in plain business language. Define unfamiliar terms, state the immediate action, and give one concrete example. Do not perform the task.`
        : input.coachType === "check"
            ? `Help the learner check their real work for this mission. Expected outputs: ${outputs.length ? outputs.map((item) => `${item.label} (${item.name})`).join(", ") : "no required file output"}. Use the mission checkpoints as a concise review rubric. Report what is supported, what is missing, and the next correction. Do not modify anything or mark the mission complete.`
            : `The learner is stuck on this mission. Ask one focused diagnostic question at a time, beginning with the most likely blocker involving project selection, run location, prerequisites, feature availability, or missing evidence. Do not restart or perform the task until the learner answers.`;
    const prompt = `The learner explicitly clicked a Copilot Coach action in the GitHub Copilot Launch Lab canvas.
Canvas instance: ${JSON.stringify(instanceId)}.
Mission ${mission.number}: ${mission.title}.
Mission objective: ${mission.objective}
Role: ${role}.
${routing}
${request}
Do not mark checkpoints or artifacts complete, publish anything, schedule automation, launch parallel agents, or infer that a dispatched task succeeded.`;
    sending = true;
    try {
        await session.send({ prompt });
        return { sent: true };
    } finally {
        sending = false;
    }
}

async function readBody(request) {
    let size = 0;
    const chunks = [];
    for await (const chunk of request) {
        size += chunk.length;
        if (size > 100000) throw new InputError("Request exceeds the 100 KB limit.");
        chunks.push(chunk);
    }
    try {
        return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
        throw new InputError("Request must contain valid JSON.");
    }
}

async function startServer(instanceId) {
    const token = randomBytes(24).toString("hex");
    let origin;
    const server = createServer(async (request, response) => {
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("Referrer-Policy", "no-referrer");
        response.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self'; base-uri 'none'; form-action 'none'");
        const json = (code, body) => {
            response.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
            response.end(JSON.stringify(body));
        };
        try {
            if (request.headers.host !== new URL(origin).host) return json(403, { error: "Invalid host." });
            const url = new URL(request.url, origin);
            const prefix = `/${token}/`;
            if (!url.pathname.startsWith(prefix)) return json(404, { error: "Not found." });
            const path = url.pathname.slice(prefix.length);
            if (request.method === "GET") {
                if (path === "api/state") return json(200, payload());
                if (path === "api/export") {
                    response.writeHead(200, {
                        "Content-Type": "text/markdown; charset=utf-8",
                        "Content-Disposition": 'attachment; filename="copilot-launch-lab-progress.md"',
                    });
                    return response.end(exportProgress(store.get()));
                }
                const assets = {
                    "": ["index.html", "text/html"],
                    "app.js": ["app.js", "text/javascript"],
                    "styles.css": ["styles.css", "text/css"],
                    "rocket.svg": ["rocket.svg", "image/svg+xml"],
                    "mona-sans.ttf": ["mona-sans.ttf", "font/ttf"],
                };
                const asset = Object.hasOwn(assets, path) ? assets[path] : null;
                if (!asset) return json(404, { error: "Not found." });
                const bytes = await readFile(new URL(`./public/${asset[0]}`, import.meta.url));
                response.writeHead(200, { "Content-Type": `${asset[1]}; charset=utf-8` });
                return response.end(bytes);
            }
            if (request.method !== "POST") return json(405, { error: "Method not allowed." });
            if (request.headers.origin !== origin || request.headers["x-lab-token"] !== token ||
                !request.headers["content-type"]?.startsWith("application/json")) {
                return json(403, { error: "This request must originate from the lab canvas." });
            }
            const input = await readBody(request);
            if (!input || typeof input !== "object" || Array.isArray(input)) {
                throw new InputError("Request must contain a JSON object.");
            }
            if (path === "api/update") {
                if (input.type === "dispatch") throw new InputError("Dispatch receipts are managed by Copilot.");
                await store.update(input);
                return json(200, payload());
            }
            if (path === "api/launch") return json(200, await sendTask(input, instanceId));
            if (path === "api/coach") return json(200, await sendCoach(input, instanceId));
            return json(404, { error: "Not found." });
        } catch (error) {
            const expected = error instanceof InputError;
            if (!expected) await session.log(`Launch Lab: ${error.message}`, { level: "error" });
            if (!response.headersSent) json(expected ? 400 : 500, { error: expected ? error.message : "The canvas could not finish that operation. See the Copilot timeline for details." });
            else response.end();
        }
    });
    await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", resolve);
    });
    origin = `http://127.0.0.1:${server.address().port}`;
    return { server, url: `${origin}/${token}/` };
}

session = await joinSession({
    canvases: [createCanvas({
        id: "copilot-launch-lab",
        displayName: "GitHub Copilot Launch Lab",
        description: "A rocket-themed hands-on lab for learning Copilot App through a launch-readiness project, with 12 guided missions, real-work prompts, saved checkpoints, and artifact tracking.",
        inputSchema: objectSchema({ missionId }, []),
        actions: [
            {
                name: "get_state",
                description: "Read the curriculum, selected learner project, self-reported checkpoints, and artifact evidence. Sending a prompt is not proof of completion.",
                inputSchema: objectSchema({}),
                handler: () => payload(),
            },
            {
                name: "select_mission",
                description: "Navigate the learner to a mission without changing completion.",
                inputSchema: objectSchema({ missionId }),
                handler: (ctx) => store.update({ type: "select", missionId: ctx.input.missionId }),
            },
            {
                name: "set_checkpoint",
                description: "Update a learning checkpoint only when the learner explicitly confirms they completed it.",
                inputSchema: objectSchema({ missionId, checkId: string, complete: { type: "boolean" } }),
                handler: (ctx) => store.update({ type: "checkpoint", ...ctx.input }),
            },
            {
                name: "set_artifact",
                description: "Record an artifact's status and location/review evidence. Ready requires evidence; never infer completion just from sending a task.",
                inputSchema: objectSchema({ artifactId, status, evidence: string }),
                handler: (ctx) => store.update({ type: "artifact", ...ctx.input }),
            },
            {
                name: "get_prompt",
                description: "Read a mission prompt with the learner's scenario notes substituted. Does not execute it.",
                inputSchema: objectSchema({ missionId, promptId: string }),
                handler: (ctx) => ({ prompt: materializePrompt(store.get(), ctx.input.missionId, ctx.input.promptId) }),
            },
            {
                name: "update_workspace",
                description: "Save the learner's exact configured project name and scenario notes; this does not create a project or change app settings.",
                inputSchema: objectSchema({ workspace: string, notes: string }),
                handler: (ctx) => store.update({ type: "workspace", ...ctx.input }),
            },
        ],
        open: async (ctx) => {
            if (!store) {
                if (!session.workspacePath) throw new Error("Launch Lab requires a persistent session workspace.");
                store = await createStore(join(session.workspacePath, "files", "copilot-launch-lab-progress.json"));
            }
            if (ctx.input?.missionId) await store.update({ type: "select", missionId: ctx.input.missionId });
            let entry = servers.get(ctx.instanceId);
            if (!entry) {
                entry = await startServer(ctx.instanceId);
                servers.set(ctx.instanceId, entry);
            }
            return { title: "GitHub Copilot Launch Lab", url: entry.url };
        },
        onClose: async (ctx) => {
            const entry = servers.get(ctx.instanceId);
            if (entry) {
                servers.delete(ctx.instanceId);
                entry.server.closeAllConnections();
                await new Promise((resolve) => entry.server.close(resolve));
            }
        },
    })],
});
