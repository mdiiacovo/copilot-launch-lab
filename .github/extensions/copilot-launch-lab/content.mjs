export const sourceUrl = 'https://copilot-academy.github.io/labs/getting-work-done-with-copilot-app';

export const starterNotes = `PROJECT
Pulse Analytics
Project manager: Maya Patel
Executive sponsor: Elena Rodriguez, VP, Product
Target launch: October 15 (year not specified)

GOAL AND SUCCESS MEASURES
- Launch to all Business and Enterprise customers.
- Help customer teams see adoption, usage trends, and risk signals in real time.
- Activate 40% of eligible accounts within 60 days.
- Keep product-related support tickets below 150 during launch week.

TEAM UPDATES
- Product: core experience finished; two launch requirements still need decisions.
- Engineering: three defects remain open—one severity 1 dashboard-loading defect and two severity 2 export defects.
- Marketing: announcement, landing page, and customer email drafted; final screenshots depend on the release candidate.
- Sales enablement: pitch deck drafted; account-team training not yet scheduled.
- Support: launch coverage assigned; troubleshooting documentation unfinished.
- Legal: product name approved; data-retention wording still awaiting approval.
- Security: review finished; one medium-severity follow-up must be completed before launch.
- Finance: pricing approved; billing-system configuration not yet validated.

MILESTONES (TARGETS, NOT EVIDENCE OF COMPLETION)
- September 25: release candidate available.
- September 30: internal dogfood complete.
- October 3–7: sales and support training.
- October 10: go/no-go review.
- October 15: production launch.
- October 22: executive launch review.

RISKS AND UNANSWERED QUESTIONS
- Can Engineering fix and retest the severity 1 loading defect before go/no-go?
- Who has final approval of the data-retention wording?
- No confirmed owner for billing validation.
- Support needs the troubleshooting guide at least five business days before launch.
- The customer email overlaps another major product announcement.
- A rollback communication template does not yet exist.

MEETING REQUESTS AND CONSTRAINTS
- Elena wants a concise Red/Yellow/Green view rather than a lengthy status deck.
- Engineering considers October 15 achievable if scope stays unchanged.
- Marketing needs a committed screenshot date by Friday; that Friday's calendar date is unspecified.
- Sales leadership needs confirmation that demo accounts will be ready for training.
- The team has not agreed on precise go/no-go criteria.
- Individual task owners are unspecified unless explicitly named above. Maya's and Elena's roles do not make them owners of every unassigned task.`;

export const artifacts = [
  {
    id: 'brief',
    label: 'Launch readiness brief',
    name: 'launch-readiness-brief.md',
    description: 'Expected one-page brief with evidence-based readiness, milestones, and unresolved decisions.',
    mission: 'brief',
  },
  {
    id: 'plan',
    label: 'Reviewed workstream plan',
    name: 'launch-readiness-plan.md',
    description: 'Expected reviewed handoff plan; saving it does not execute its workstreams.',
    mission: 'plan',
  },
  {
    id: 'action-tracker',
    label: 'Action tracker',
    name: 'action-tracker.csv',
    description: 'Expected reusable tracker; an in-app spreadsheet view is an optional extra.',
    mission: 'artifacts',
  },
  {
    id: 'executive-summary',
    label: 'Executive presentation',
    name: 'executive-summary.md',
    description: 'Expected five-slide source document, later refreshed with a justified go/no-go recommendation.',
    mission: 'artifacts',
  },
  {
    id: 'dashboard',
    label: 'Launch dashboard',
    name: 'Launch dashboard',
    description: 'Accept either a separate working launch-readiness canvas or launch-readiness-dashboard.md. This training canvas is not the output.',
    mission: 'dashboard',
  },
  {
    id: 'risk-register',
    label: 'Risk register',
    name: 'risk-register.csv',
    description: 'Expected risk register preserving unknown owners, mitigation proposals, and go/no-go impact.',
    mission: 'deliver',
  },
  {
    id: 'stakeholder-update',
    label: 'Stakeholder update',
    name: 'stakeholder-update.md',
    description: 'Expected local draft for Elena Rodriguez; creating it does not send a message.',
    mission: 'deliver',
  },
  {
    id: 'issue-backlog',
    label: 'Follow-up backlog',
    name: 'issue-backlog.md',
    description: 'Expected local equivalent of the optional GitHub issue path. Review remains core; remote posting is optional.',
    mission: 'review',
  },
  {
    id: 'weekly-status',
    label: 'Weekly status report',
    name: 'weekly-status.md',
    description: 'Expected weekly report. An on-demand preview alone does not prove that recurring automation is configured.',
    mission: 'automate',
  },
];

export const challenges = Object.freeze({
  setup: {
    kicker: 'Choose the foundation',
    question: 'Where should the core lab artifacts live so every later mission can find them?',
    options: [
      { id: 'same-local', label: 'The same local project folder', best: true, feedback: 'Exactly. One local project keeps the brief, plan, trackers, and later outputs available across sessions.' },
      { id: 'random-chat', label: 'A new chat for every artifact', feedback: 'Chats are useful for discussion, but they do not provide one shared project workspace for the files.' },
      { id: 'unrelated-worktree', label: 'Any unrelated repository worktree', feedback: 'A worktree is an isolated copy of a specific repository. It will not automatically contain this lab’s earlier local-folder artifacts.' },
    ],
  },
  brief: {
    kicker: 'Direct the first move',
    question: 'The brief session is running. What is the most useful thing to do next?',
    options: [
      { id: 'tour-and-return', label: 'Tour the app, then return and inspect the saved brief', best: true, feedback: 'Right. You learn the interface while useful work is happening, then review the actual output against the source notes.' },
      { id: 'assume-success', label: 'Mark the mission complete as soon as the prompt is sent', feedback: 'Sending is only a dispatch receipt. Completion requires opening the file and checking its facts, blockers, and unknowns.' },
      { id: 'start-over', label: 'Open another session and regenerate immediately', feedback: 'First inspect the running session and its output. Recreating work can hide a run-location or project-selection problem.' },
    ],
  },
  modes: {
    kicker: 'Pick the right control point',
    question: 'You need agreement on launch workstreams before any deliverables are created. Which mode fits best?',
    options: [
      { id: 'interactive', label: 'Interactive', feedback: 'Interactive is useful for close collaboration, but it does not create as explicit a plan-before-implementation checkpoint.' },
      { id: 'plan', label: 'Plan', best: true, feedback: 'Exactly. Plan mode separates agreeing on the approach from authorizing implementation.' },
      { id: 'autopilot', label: 'Autopilot', feedback: 'Autopilot is better after the direction and boundaries are already clear. It is not the best first step for unresolved workstreams.' },
    ],
  },
  plan: {
    kicker: 'Protect the handoff',
    question: 'The proposed workstreams look good. What should happen before another session executes them?',
    options: [
      { id: 'save-reviewed', label: 'Exit without implementation and save the reviewed plan', best: true, feedback: 'Correct. The saved plan becomes a durable, reviewable handoff without prematurely creating its deliverables.' },
      { id: 'approve-everything', label: 'Approve all implementation immediately', feedback: 'That skips the deliberate planning handoff and authorizes work before the reviewed plan is preserved.' },
      { id: 'new-plan', label: 'Start a fresh session and ask it to remember the review', feedback: 'A fresh session does not automatically know the unsaved plan review. Save the reviewed plan from the planning session first.' },
    ],
  },
  artifacts: {
    kicker: 'Keep evidence honest',
    question: 'The tracker needs an owner for billing validation, but the notes name none. What belongs in the Owner column?',
    options: [
      { id: 'unassigned', label: 'Unassigned', best: true, feedback: 'Correct. Preserve the gap so the team can make a real ownership decision.' },
      { id: 'maya', label: 'Maya Patel', feedback: 'Maya is the project manager, but that does not make her the owner of every unresolved task.' },
      { id: 'elena', label: 'Elena Rodriguez', feedback: 'Elena is the executive sponsor. Assigning her without evidence would turn a role into an invented commitment.' },
    ],
  },
  dashboard: {
    kicker: 'Prove the canvas is real',
    question: 'Which observation best demonstrates a bidirectional dashboard canvas?',
    options: [
      { id: 'shared-state', label: 'A human change persists and Copilot can read and update the same state', best: true, feedback: 'Exactly. Shared persistent state and working controls distinguish a canvas from a static report.' },
      { id: 'looks-polished', label: 'The dashboard looks polished in a screenshot', feedback: 'Appearance alone does not prove that controls work, changes persist, or Copilot can update the same data.' },
      { id: 'markdown-only', label: 'A markdown table is displayed in a browser', feedback: 'Markdown is a useful fallback, but it should be described honestly as a file rather than an interactive canvas.' },
    ],
  },
  deliver: {
    kicker: 'Separate output from progress',
    question: 'Copilot created the risk register and stakeholder update. What does that prove?',
    options: [
      { id: 'documents-created', label: 'The requested documents exist and still need review', best: true, feedback: 'Correct. Producing decision artifacts does not fix the severity 1 defect, approve legal language, or validate billing.' },
      { id: 'launch-ready', label: 'The launch is now ready', feedback: 'Documents can describe readiness; they do not resolve the underlying blockers.' },
      { id: 'all-green', label: 'Every readiness area can be marked Green', feedback: 'The source still contains unresolved technical, legal, billing, and support work. Green would invent progress.' },
    ],
  },
  review: {
    kicker: 'Choose the safe publishing path',
    question: 'You do not have a suitable GitHub repository with write access. How should you capture blocked follow-up work?',
    options: [
      { id: 'local-backlog', label: 'Create issue-backlog.md in the local project', best: true, feedback: 'Right. The local backlog preserves the follow-up intent without requiring remote publication or repository permissions.' },
      { id: 'unrelated-repo', label: 'Post issues to any repository you can find', feedback: 'That risks publishing project details to the wrong destination and creating unrelated work.' },
      { id: 'skip-review', label: 'Skip blocked and unowned actions', feedback: 'Those actions are exactly what the review must preserve. Use the local fallback instead.' },
    ],
  },
  customize: {
    kicker: 'Know what you installed',
    question: 'Which item counts as the dashboard deliverable from Mission 6?',
    options: [
      { id: 'learner-dashboard', label: 'The separate learner dashboard or its markdown fallback', best: true, feedback: 'Correct. This Launch Lab canvas teaches the workflow; it is not the project dashboard you were asked to create.' },
      { id: 'training-canvas', label: 'This Launch Lab training canvas', feedback: 'The training canvas and learner dashboard are separate extensions with different purposes.' },
      { id: 'any-plugin', label: 'Any installed plugin', feedback: 'A plugin may add capabilities, but it does not automatically satisfy the dashboard’s required state and controls.' },
    ],
  },
  automate: {
    kicker: 'Prove the repetition',
    question: 'weekly-status.md was generated once. What still must happen to complete the automation mission?',
    options: [
      { id: 'save-run-refine', label: 'Save a recurring automation, inspect a run, refine it, and run again', best: true, feedback: 'Exactly. A generated report is only a preview; recurring work requires a saved trigger and verified run history.' },
      { id: 'file-is-enough', label: 'Nothing—the file proves the automation exists', feedback: 'A file cannot prove that a schedule was saved or that an automation ran.' },
      { id: 'describe-schedule', label: 'Write the desired schedule in the report', feedback: 'Describing a schedule is not the same as configuring and testing one in Automations.' },
    ],
  },
  cloud: {
    kicker: 'Check before going remote',
    question: 'The project is only a local folder and cloud-agent automation is not enabled. What is the right choice?',
    options: [
      { id: 'stay-local', label: 'Keep the verified local automation and skip this optional mission', best: true, feedback: 'Correct. The local path already teaches the core skill without inventing repository access, policy approval, or cloud capability.' },
      { id: 'force-cloud', label: 'Enable cloud execution anyway', feedback: 'Cloud execution has repository, access, policy, cost, visibility, and source-availability prerequisites.' },
      { id: 'assume-files', label: 'Assume the cloud run can read files from the computer', feedback: 'A cloud workspace cannot silently read local-only files or locally stored canvas state.' },
    ],
  },
  safety: {
    kicker: 'Executive go/no-go simulation',
    question: 'The severity 1 defect, legal wording, billing validation, support guidance, and go/no-go criteria remain unresolved. What is the most supportable recommendation?',
    options: [
      { id: 'conditional', label: 'Conditional Go, with explicit evidence gates before launch', best: true, commandLabel: 'Conditional Go', feedback: 'Strong choice. It keeps the target visible while refusing to treat unresolved blockers as completed. A No-Go can also be justified if the evidence gates cannot be met in time.' },
      { id: 'go', label: 'Go—the target date and drafted documents are enough', commandLabel: 'Go', feedback: 'A date and completed documents are not evidence that critical blockers are resolved. An unconditional Go is not supportable.' },
      { id: 'green', label: 'Green—most teams have started their work', commandLabel: 'Green', feedback: 'Started work is not completed exit criteria. The current evidence cannot support a Green status.' },
    ],
  },
});

export const missions = [
  {
    id: 'setup',
    number: 1,
    title: 'Set up your workspace',
    subtitle: 'A real local folder is enough; no coding or repository required.',
    phase: 'Orient',
    minutes: 5,
    optional: false,
    objective: 'Connect a project where the lab will save real, reusable files.',
    instructions: [
      'Open the GitHub Copilot app and sign in to GitHub; finish plan/provider onboarding if prompted. Installation help is linked from the source lab. No terminal or CLI setup is required.',
      'In the sidebar, choose + beside Sessions → Add project from → Local folder or repository. In Documents, create product-launch-readiness and open/select it.',
      'Select that project for this lab. For every core file task, use Local or Local repository and the same folder—not a cloud session or a separate worktree. A worktree is an isolated copy; a branch is a separate line of tracked changes.',
      'Read and, if desired, edit the starter notes before starting. The default case is fictional, but you will create real project artifacts. With your own notes, use only information you are allowed to share; those notes supersede the sample names and dates. Labels may vary by app version.',
    ],
    takeaway: 'A project supplies the workspace; a plain folder supports the core workflow.',
    prompts: [],
    checks: [
      { id: 'signed-in', label: 'I am signed in and can use Copilot in the app.' },
      { id: 'local-folder', label: 'product-launch-readiness, or my chosen equivalent, appears as a project.' },
      { id: 'selected-project', label: 'The lab targets that same local folder, and I reviewed the starter notes.' },
    ],
    sourceAnchor: 'exercise-1--install-sign-in-and-add-your-project',
  },
  {
    id: 'brief',
    number: 2,
    title: 'Create a brief, then tour the app',
    subtitle: 'Start useful work before exploring the interface.',
    phase: 'Orient',
    minutes: 7,
    optional: false,
    objective: 'Save a launch brief and locate the app surfaces you will use next.',
    instructions: [
      'Choose + beside Sessions → your project → Local or Local repository. Set Interactive and Auto, then send the brief prompt with your selected notes. Shift+Enter adds a line; Enter sends.',
      'While the agent works, find Sessions, Chats, My work (or Needs Your Attention), Automations, and Customize in the sidebar. My work covers your account’s repositories; unrelated items are not lab tasks.',
      'Return to the running session. Open its side panel to inspect the plan/to-dos, file tree, and changes when available. Review any requested approval before allowing the file write.',
      'Open launch-readiness-brief.md and check facts against the notes. If a later session cannot find it, verify the local run location and project folder before recreating anything.',
    ],
    takeaway: 'A session can produce files while you inspect its live progress and changes.',
    prompts: [
      {
        id: 'create-brief',
        title: 'Create the readiness brief',
        text: `Act as the project manager for the selected launch. Turn the following notes into a concise, one-page launch-readiness-brief.md in the root of this project. Include launch goal, success measures, team readiness, milestones, open decisions, top risks, and an overall Red/Yellow/Green assessment with evidence and rationale.

The sample project is Pulse Analytics, managed by Maya Patel, with Elena Rodriguez (VP, Product) as executive sponsor and an October 15 launch. If the supplied notes replace those details, use the supplied notes instead. Do not invent a year, task owners, dates, approvals, or completed work. Keep unknowns explicitly open. Target milestones do not prove completion. With the sample's unresolved severity 1 defect, legal approval, billing validation, and support guidance, do not label the overall launch Green. Treat go/no-go criteria as proposals until approved. Save only the brief; do not perform external actions.

SELECTED NOTES
{{NOTES}}`,
        mode: 'Interactive',
        model: 'Auto',
        target: 'project',
        requires: [],
        produces: ['brief'],
      },
    ],
    checks: [
      { id: 'saved-brief', label: 'I opened the saved brief in the project file tree.' },
      { id: 'reviewed-evidence', label: 'Readiness reflects evidence; blockers and unknown owners remain open.' },
      { id: 'sidebar-tour', label: 'I found the five sidebar areas and inspected the session side panel.' },
    ],
    sourceAnchor: 'exercise-2--kick-off-your-first-session-then-tour-the-app',
  },
  {
    id: 'modes',
    number: 3,
    title: 'Choose chat, mode, and model',
    subtitle: 'Conversation and file work need different homes.',
    phase: 'Orient',
    minutes: 5,
    optional: false,
    objective: 'Distinguish conversational chat from workspace sessions and choose the right autonomy.',
    instructions: [
      'Open Chats → new chat and try the self-contained question. Chats do not have a dedicated project workspace: include the facts, and do not expect the chat to read your brief or create its files.',
      'Return to the local project session and locate the mode picker near the composer. Interactive supports back-and-forth approval; Plan proposes a direction for review before implementation; Autopilot continues tool work with less step-by-step input.',
      'Find the separate model picker. Use Auto for focused summaries and trackers. For complex planning or canvas building, choose an available higher-reasoning model and higher effort if offered; use Auto if unavailable or restricted by your plan or organization.',
      'Decide which mode you would use for a risky launch plan versus a bounded document update. Autopilot is not permission to publish, schedule, or resolve business decisions.',
    ],
    takeaway: 'Mode controls autonomy; model controls reasoning choice; neither gives a chat a workspace.',
    prompts: [
      {
        id: 'discuss-threat',
        title: 'Discuss the biggest launch threat',
        text: 'Talk through the biggest launch threat without creating files or using project tools. In this fictional Pulse Analytics case, Maya Patel is project manager, Elena Rodriguez is executive sponsor, and launch targets October 15. A severity 1 loading defect is open, data-retention wording awaits approval, billing validation has no confirmed owner, and support guidance is incomplete. Which risk most threatens launch, what evidence would you need, and how might the risks interact? Do not assume any blocker is resolved. This question is self-contained; if I use a different project, ask me to supply its facts here rather than assuming access to its files.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'chat',
        requires: [],
        produces: [],
      },
    ],
    checks: [
      { id: 'chat-compared', label: 'I tried the chat and can explain why file tasks belong in a project session.' },
      { id: 'modes-compared', label: 'I can distinguish Interactive, Plan, and Autopilot.' },
      { id: 'model-chosen', label: 'I located the model picker and know when Auto is sufficient.' },
    ],
    sourceAnchor: 'exercise-3--chat-vs-session-and-session-modes',
  },
  {
    id: 'plan',
    number: 4,
    title: 'Plan parallel workstreams',
    subtitle: 'Review the approach, then save a handoff—not its deliverables.',
    phase: 'Build',
    minutes: 8,
    optional: false,
    objective: 'Produce an approved, reusable workstream plan without prematurely executing it.',
    instructions: [
      'Start a new session in the same local project. Choose Plan and an available higher-reasoning model, or Auto, and send “Propose the workstreams.”',
      'Review the plan and live to-do list in the side panel. Check dependencies, realistic exit criteria, unresolved owners, and proposed go/no-go criteria. Ask for revisions—for example, consolidate stakeholder communication into one stream.',
      'Exit Plan without implementation using the matching approval option. Switch that SAME planning session to Interactive. Paste “Save only the reviewed plan” into it; a fresh session will not automatically know your unsaved review.',
      'Open launch-readiness-plan.md. Confirm that it preserves the reviewed decisions and open questions but has not created the action tracker or other deliverables. The next exercise deliberately uses a new session to test the handoff.',
    ],
    takeaway: 'A saved, reviewed plan carries context across sessions without authorizing execution.',
    prompts: [
      {
        id: 'propose-plan',
        title: 'Propose the workstreams',
        text: 'Read launch-readiness-brief.md in this project. For Pulse Analytics—or the replacement project recorded in that brief—propose parallel readiness workstreams: Product and Engineering; Marketing and Sales; Support and Enablement; and Legal, Security, and Billing. Specify confirmed owner or explicitly Unassigned, exit criteria, dependencies, open decisions, and concrete deliverables for each. Distinguish evidence from proposed actions and proposed go/no-go criteria. Do not invent owners, a year, or completed milestones. Show a plan and to-dos for my review only; do not implement it, create deliverables, publish, or start parallel agents.',
        mode: 'Plan',
        model: 'Higher reasoning',
        target: 'project',
        requires: ['brief'],
        produces: [],
      },
      {
        id: 'save-reviewed-plan',
        title: 'Save only the reviewed plan',
        text: 'In this same planning session, save only the plan I have reviewed as launch-readiness-plan.md in the project root. Preserve its workstreams, confirmed owners or Unassigned labels, exit criteria, dependencies, unresolved decisions, and deliverables. Mark proposed criteria and ownership suggestions as unapproved. Do not execute the plan or create any other deliverables. If my reviewed plan is not available in this session, stop and ask me to return to the planning session or provide that reviewed plan; do not substitute a newly invented one.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'project',
        requires: ['brief'],
        produces: ['plan'],
        caution: 'Paste into the original planning session after exiting Plan without implementation; do not run in a fresh session.',
      },
    ],
    checks: [
      { id: 'reviewed-plan', label: 'I reviewed and, where necessary, revised the proposed workstreams.' },
      { id: 'saved-plan', label: 'The reviewed plan is saved as launch-readiness-plan.md in the same folder.' },
      { id: 'no-implementation', label: 'Only the plan was saved; its deliverables were not implemented yet.' },
    ],
    sourceAnchor: 'exercise-4--plan-the-launch-as-parallel-workstreams',
  },
  {
    id: 'artifacts',
    number: 5,
    title: 'Create a tracker and executive story',
    subtitle: 'Use portable files, with richer editing surfaces when available.',
    phase: 'Build',
    minutes: 8,
    optional: false,
    objective: 'Execute the saved handoff as an action tracker and five-slide executive source.',
    instructions: [
      'Create a new Interactive session in the same Local/Local repository project, using Auto. Confirm the file tree contains both the brief and reviewed plan.',
      'Run the tracker prompt, then the executive prompt. Inspect and correct the outputs rather than treating a successful run as evidence that the launch is ready.',
      'Open action-tracker.csv and executive-summary.md in the file tree. Spreadsheet or presentation surfaces are optional; CSV and slide-heading markdown are the complete fallback.',
      'Use the project menu to reveal the folder in Finder or File Explorer if helpful. Keep reusable source files in this project root for the dashboard and later sessions.',
    ],
    takeaway: 'Portable source artifacts keep a multi-session workflow usable across app versions.',
    prompts: [
      {
        id: 'create-tracker',
        title: 'Create the action tracker',
        text: 'Read launch-readiness-brief.md and launch-readiness-plan.md. Create action-tracker.csv in the project root with Readiness Area, Action, Owner, Due Date, Status, Blocker, and Go/No-Go Impact columns. Use the selected project facts; default sample is Pulse Analytics. Preserve all unresolved launch requirements and dependencies. Use Unassigned when no owner is confirmed, and distinguish proposed dates/actions from commitments. Do not infer a year or a calendar date for Friday; preserve the five-business-day support requirement without inventing a calendar. Do not mark a milestone complete because its date has passed. Save valid CSV; open the same tracker in an editable spreadsheet surface if available, but the CSV must remain usable independently.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'project',
        requires: ['brief', 'plan'],
        produces: ['action-tracker'],
      },
      {
        id: 'create-executive-summary',
        title: 'Draft the executive presentation',
        text: 'Using launch-readiness-brief.md, launch-readiness-plan.md, and action-tracker.csv, draft executive-summary.md in the project root as five slide-style sections: goal and success measures; readiness by team; critical path; leading risks; and sponsor decisions/asks. Address Pulse Analytics executive sponsor Elena Rodriguez unless the project sources identify a replacement. Preserve the 40% activation-in-60-days and below-150 launch-week ticket measures when using the sample. Keep unresolved blockers visible and distinguish proposals from confirmed decisions. Do not label the sample Green or claim blockers are fixed without evidence. Open a presentation surface if available, while retaining one markdown heading per slide as the reusable source. Do not send or publish it.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'project',
        requires: ['brief', 'plan', 'action-tracker'],
        produces: ['executive-summary'],
      },
    ],
    checks: [
      { id: 'tracker-opened', label: 'I opened the CSV and verified actions, unassigned owners, and blockers.' },
      { id: 'slides-opened', label: 'I opened the five-section executive source and reviewed the sponsor asks.' },
      { id: 'sources-persisted', label: 'Both reusable files are in the same project root, regardless of richer surfaces.' },
    ],
    sourceAnchor: 'exercise-5--produce-your-first-artifacts',
  },
  {
    id: 'dashboard',
    number: 6,
    title: 'Build your own launch dashboard',
    subtitle: 'A separate work surface—not a redesign of this training canvas.',
    phase: 'Build',
    minutes: 10,
    optional: false,
    objective: 'Create and test a bidirectional readiness canvas, or an honest markdown fallback.',
    instructions: [
      'Start a new Interactive session in the same local project. Choose an available higher-reasoning model, or Auto. Request a separate dashboard using /create-canvas; do not edit this installed training lab.',
      'If asked about scope, choose User for a personal dashboard or Project for a team-shared extension. User scope lives in ~/.copilot/extensions; project scope lives in .github/extensions and is shared only when you deliberately commit/share it.',
      'If canvas creation is not offered, request launch-readiness-dashboard.md with the same information and continue locally. A markdown table is a fallback, not an interactive canvas; later prompts must update the file instead.',
      'On the new dashboard, test a human control by recording a still-open question or an evidence-supported status with rationale. Then ask the agent to read that actual change and update the same state and tracker. Never mark a blocker resolved just to test a button.',
      'Request Red/Yellow/Green counts and prominent unresolved decisions. Reopen the dashboard or fallback to confirm changes persist. A claimed UI without functioning controls is not a completed canvas.',
    ],
    takeaway: 'A real canvas shares state between human controls and agent actions; markdown preserves the fallback.',
    prompts: [
      {
        id: 'create-dashboard',
        title: 'Create a separate launch dashboard',
        text: '/create-canvas Create a NEW, SEPARATE Pulse Analytics launch-readiness dashboard using launch-readiness-brief.md, launch-readiness-plan.md, action-tracker.csv, and executive-summary.md from this local project. If those files describe a replacement project, use it. Do not modify or replace the installed Copilot launch training canvas or its extension. Show evidence-based overall Red/Yellow/Green status; cards for Product and Engineering, Marketing and Sales, Support and Enablement, and Legal, Security, and Billing; confirmed owners or Unassigned; exit criteria; blockers; risks; and open go/no-go decisions. Unknown readiness must remain explicitly unknown, not silently Green. Preserve unresolved blockers and proposed criteria. Provide persistent human controls to change status with evidence/rationale, add a risk, and record a decision or an explicitly open question, plus matching agent read/update actions over the SAME state. Confirm scope before creating the new extension, following the app canvas-authoring workflow. Keep project-data access scoped to this selected project. Test persistence and both interaction directions. If /create-canvas or canvas support is unavailable, instead save launch-readiness-dashboard.md in this project root with equivalent tables and sections, clearly labeled noninteractive. Do not install unrelated tools or publish anything.',
        mode: 'Interactive',
        model: 'Higher reasoning',
        target: 'project',
        requires: ['brief', 'plan', 'action-tracker', 'executive-summary'],
        produces: ['dashboard'],
        caution: 'Creates a separate learner dashboard only. Review scope and extension-file changes; never alter this training canvas.',
      },
      {
        id: 'iterate-dashboard',
        title: 'Connect dashboard changes to the tracker',
        text: 'Read the actual current state and my recorded change on the separate learner launch dashboard; if the canvas is unavailable, read launch-readiness-dashboard.md instead. Do not invent a click, a status change, or a resolved blocker. Using the project evidence, ensure action-tracker.csv includes the unfinished troubleshooting guide and its requirement to be ready at least five business days before launch; preserve any existing equivalent row instead of duplicating it. In the dashboard or fallback, record the high-impact risk of missing that requirement, keep final data-retention approval and go/no-go criteria open unless new evidence resolves them, add counts of Red/Yellow/Green areas, and make unresolved decisions prominent. Unknown areas must be listed separately, not counted as Green. Use the canvas agent actions over the same state when available, then verify I can see the update. Do not modify the installed training canvas or claim fallback markdown has live controls.',
        mode: 'Interactive',
        model: 'Higher reasoning',
        target: 'project',
        requires: ['brief', 'plan', 'action-tracker', 'dashboard'],
        produces: ['action-tracker', 'dashboard'],
      },
    ],
    checks: [
      { id: 'separate-output', label: 'I opened a separate working dashboard, or the named markdown fallback.' },
      { id: 'interaction-tested', label: 'I tested human → agent and agent → human updates; for markdown, I reviewed an actual file edit instead.' },
      { id: 'dashboard-persisted', label: 'Counts, open decisions, support risk, and tracker updates persisted without invented resolutions.' },
    ],
    sourceAnchor: 'exercise-6--build-a-custom-project-dashboard-canvas',
  },
  {
    id: 'deliver',
    number: 7,
    title: 'Finish the launch deliverables',
    subtitle: 'Complete the local path; parallel-agent exploration is optional.',
    phase: 'Coordinate',
    minutes: 8,
    optional: false,
    objective: 'Create connected decision artifacts without confusing document production with launch progress.',
    instructions: [
      'Start a new local project session in Autopilot with an available higher-reasoning model, or Auto. Use the bounded local deliverables prompt; review the resulting files and changes afterward.',
      'Open risk-register.csv, stakeholder-update.md, and the refreshed executive-summary.md. Verify the dashboard or fallback agrees with them. A new document is not proof that a defect, approval, or business task is complete.',
      'Optional Fleet path, manual only: check Settings → Experimental Flags for Agent tools / Fleet mode if needed. Use a Git-backed copy containing the existing brief, plan, tracker, and executive source; otherwise skip. Confirm those files are available in the agents’ branches/worktrees before starting.',
      'Only after reviewing extra AI consumption, manually select Approve and implement with Fleet in a reviewed Plan session, or enter the optional /fleet prompt in an active session. Inspect its isolated draft reviews in Sessions. Keep the canonical local files from the core path; do not auto-merge or publish optional drafts.',
    ],
    takeaway: 'Connected local outputs are the core result; Fleet adds optional isolated review work and consumption.',
    prompts: [
      {
        id: 'complete-deliverables',
        title: 'Produce the remaining local artifacts',
        text: 'Read this project’s launch-readiness-brief.md, launch-readiness-plan.md, action-tracker.csv, executive-summary.md, and separate learner dashboard or launch-readiness-dashboard.md. Complete only these local outputs: (1) risk-register.csv with Risk, Likelihood, Impact, Owner, Mitigation, Trigger, and Go/No-Go Impact; (2) stakeholder-update.md drafted for Elena Rodriguez, unless the source project names another sponsor, with readiness, evidenced changes since the meeting, decisions needed, and executive risks; (3) refresh executive-summary.md with a justified Go, Conditional Go, or No-Go recommendation, clearly separating proposed conditions from approved criteria; (4) update the learner dashboard through its supported actions, or its markdown fallback. Keep reusable files in the project root. Preserve unassigned ownership and unknown dates; never infer a year. Where no new progress evidence exists, say so. Document creation is not blocker resolution, and the sample’s unresolved blockers cannot support Green or an unconditional Go. Do not modify the training canvas, start parallel agents, schedule anything, send messages, publish, or change external systems.',
        mode: 'Autopilot',
        model: 'Higher reasoning',
        target: 'project',
        requires: ['brief', 'plan', 'action-tracker', 'executive-summary', 'dashboard'],
        produces: ['risk-register', 'stakeholder-update', 'executive-summary', 'dashboard'],
      },
      {
        id: 'optional-fleet-reviews',
        title: 'Optional: manually try Fleet reviews',
        text: '/fleet In this verified Git-backed COPY of the Pulse Analytics launch project, read launch-readiness-brief.md, launch-readiness-plan.md, action-tracker.csv, and executive-summary.md. If they describe my replacement project, use its facts. Produce independent review drafts for tracker quality, risk gaps, stakeholder-message clarity, and executive recommendation quality. Keep unknown owners and unresolved blockers explicit. Each agent must have the source artifacts in its own workspace; stop if they are missing. Do not overwrite the canonical local lab files, merge branches, publish, or post messages. Return the drafts for my review.',
        mode: 'Plan',
        model: 'Higher reasoning',
        target: 'manual',
        requires: ['brief', 'plan', 'action-tracker', 'executive-summary'],
        produces: [],
        caution: 'Optional and manual only: Fleet can consume substantial additional AI credits. Requires a Git-backed project with source artifacts visible to every worktree. Review costs and explicitly approve before launching.',
      },
    ],
    checks: [
      { id: 'remaining-files', label: 'I opened the local risk register and stakeholder update.' },
      { id: 'recommendation-reviewed', label: 'The refreshed executive recommendation distinguishes evidence from proposed conditions.' },
      { id: 'outputs-consistent', label: 'The tracker, dashboard, risks, and update agree; no blocker was silently closed.' },
    ],
    sourceAnchor: 'exercise-7--produce-the-remaining-artifacts-and-try-fleet',
  },
  {
    id: 'review',
    number: 8,
    title: 'Review outputs and draft follow-up work',
    subtitle: 'Local review is core; GitHub posting is your optional decision.',
    phase: 'Coordinate',
    minutes: 6,
    optional: false,
    objective: 'Turn blocked or unowned actions into reviewable follow-up items.',
    instructions: [
      'Open My work or Needs Your Attention. It shows account-wide repository issues and pull requests, not automatically your local-folder files. Do not act on unrelated items.',
      'For the core path, return to the same local project, choose Interactive and Auto, and create issue-backlog.md. Review each blocked or unowned action against the tracker.',
      'Optional GitHub path: choose a suitable repository you can write to. Copy the launch artifacts into its folder using Finder/File Explorer and verify action-tracker.csv in its file tree. A repository is a version-tracked folder; an issue tracks a task, while a pull request proposes a change for review.',
      'Manually paste the GitHub prompt only in that repository’s session. Review exact issue drafts and repository, then explicitly authorize posting. Inspect approved new issues in My work and optionally start a session from one. The local backlog satisfies this exercise without remote access.',
    ],
    takeaway: 'An actionable local backlog captures the same follow-up intent without requiring publication.',
    prompts: [
      {
        id: 'create-local-backlog',
        title: 'Create the local issue backlog',
        text: 'Read action-tracker.csv, launch-readiness-plan.md, and risk-register.csv in this local project. Save issue-backlog.md containing one checklist item per blocked or unowned launch action. Include title, readiness area, short description, dependencies, go/no-go impact, and confirmed owner or Unassigned. You may identify a suggested responsible team, clearly marked Proposed—not an assignment; do not invent a named owner or assign Maya Patel or Elena Rodriguez simply because they lead the sample launch. Preserve open decisions and avoid duplicate items. Use the selected project’s actual source facts. Create a local file only; do not post GitHub issues or contact anyone.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'project',
        requires: ['plan', 'action-tracker', 'risk-register'],
        produces: ['issue-backlog'],
      },
      {
        id: 'optional-github-issues',
        title: 'Optional: review and publish GitHub issues manually',
        text: 'In the GitHub repository I deliberately selected, confirm its exact owner/name and my write access, then read action-tracker.csv and the repository’s default issue template if present. Draft one issue per blocked or unowned launch-readiness action, including readiness area and go/no-go impact. Compare with existing issues to avoid duplicates. Keep owners unassigned unless confirmed; do not invent assignees. Show the destination and complete drafts, and wait for my explicit approval of those exact issues before posting anything. After approval, create only the approved issues and return their links. Do not publish other files, open pull requests, or change unrelated issues.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'manual',
        requires: ['action-tracker'],
        produces: [],
        caution: 'Optional remote write, manual only. Requires a suitable repository containing the tracker, write access, and explicit approval of the destination and exact issue drafts before posting.',
      },
    ],
    checks: [
      { id: 'my-work-reviewed', label: 'I inspected My work and can distinguish repository work from local project files.' },
      { id: 'follow-ups-saved', label: 'I reviewed the saved local backlog, or explicitly approved and verified equivalent GitHub issues.' },
      { id: 'ownership-honest', label: 'Blocked work is covered, and proposed owners are not represented as confirmed assignments.' },
    ],
    sourceAnchor: 'exercise-8--review-outputs-and-connect-to-github-optional',
  },
  {
    id: 'customize',
    number: 9,
    title: 'Find your customization tools',
    subtitle: 'Know where capabilities live without installing anything new.',
    phase: 'Repeat',
    minutes: 4,
    optional: false,
    objective: 'Locate the app’s extension surfaces and distinguish this lesson from your project dashboard.',
    instructions: [
      'Open Customize in the sidebar and visit Skills, MCP servers, Plugins, Custom agents, and Canvas using your version’s closest matching tabs.',
      'Skills supply task-specific instructions/resources; MCP servers connect tools and data; plugins bundle capabilities; custom agents specialize behavior and can be selected in the agent picker or with /agent.',
      'In Canvas → Installed, identify this project-scoped training canvas. Separately find the launch dashboard YOU produced in Exercise 6. They are different extensions with different jobs; this training canvas does not count as the dashboard output.',
      'If you used markdown instead of creating a dashboard, record that the learner dashboard is a project file, not an installed canvas. No new installations, credentials, or connections are needed for this tour.',
    ],
    takeaway: 'Customize manages capabilities; installing a lesson does not create its expected project outputs.',
    prompts: [],
    checks: [
      { id: 'customize-tabs', label: 'I located Skills, MCP servers, Plugins, Custom agents, and Canvas.' },
      { id: 'canvases-distinguished', label: 'I can distinguish this installed training canvas from my separate dashboard or markdown fallback.' },
    ],
    sourceAnchor: 'exercise-9--tour-customize',
  },
  {
    id: 'automate',
    number: 10,
    title: 'Save and test a weekly automation',
    subtitle: 'A preview creates a report; only a saved schedule creates recurring work.',
    phase: 'Repeat',
    minutes: 10,
    optional: false,
    objective: 'Configure a real local recurring task, inspect its first run, and refine the saved prompt.',
    instructions: [
      'Optionally run “Preview weekly report” in the same local project with Interactive and Auto. It writes weekly-status.md now; it does not create an automation or satisfy the recurring-task checks.',
      'Manually open Automations → New automation. Name it Weekly Pulse Analytics Launch Readiness (or your project name), choose Weekly, and select your own day, time, and time zone. If the UI inherits a zone, verify it before saving; this lesson assumes none.',
      'Select the SAME local project and local environment, leave Run in the cloud off, and use Auto. Paste “Weekly automation workload” into the automation prompt. Review the scope and overwrite behavior, then choose Create → Create and run, or save and use the card’s play button.',
      'Verify the automation is saved with a recurring trigger, inspect its first run, and open the actual weekly-status.md in the project root. A schedule is a saved prompt plus trigger, separate from project files and from GitHub Actions.',
      'Edit the SAVED automation prompt: require at most 150 words, begin with overall Red/Yellow/Green status, and end with the most important go/no-go decision. Save and click play again; verify the refinement. If local scheduling is unavailable in your version/policy, keep the preview but leave the actual-automation checks incomplete.',
    ],
    takeaway: 'Recurring work is proven by a saved automation and verified runs—not by a generated report alone.',
    prompts: [
      {
        id: 'preview-weekly-report',
        title: 'Preview weekly report',
        text: 'Create an ON-DEMAND PREVIEW only in this selected local project. Read launch-readiness-brief.md, launch-readiness-plan.md, action-tracker.csv, risk-register.csv, executive-summary.md, stakeholder-update.md, and the separate learner dashboard through its supported read action or launch-readiness-dashboard.md. If weekly-status.md already exists, read it before replacing it. Write weekly-status.md in the project root with overall Red/Yellow/Green status and rationale, evidence-backed changes since the previous report, readiness by team, critical risks, decisions needed, and actions due before go/no-go. Use Pulse Analytics facts unless the sources describe a replacement project. When no prior report or new progress evidence exists, say so; do not manufacture progress or treat dates as completed milestones. Preserve unresolved blockers, unknown owners, and unspecified year. If a canvas cannot be read, disclose that gap and use accessible source files instead of inventing dashboard state. This is one local file update, not an automation: do not create a trigger, schedule, cloud run, message, or external action, and do not claim recurring automation now exists.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'project',
        requires: ['brief', 'plan', 'action-tracker', 'risk-register', 'executive-summary', 'stakeholder-update', 'dashboard'],
        produces: ['weekly-status'],
        caution: 'Overwrites weekly-status.md after reading any existing version. This preview does not configure or validate a schedule.',
      },
      {
        id: 'weekly-automation-workload',
        title: 'Weekly automation workload',
        text: 'In the local launch-readiness project selected for this automation, read launch-readiness-brief.md, launch-readiness-plan.md, action-tracker.csv, risk-register.csv, executive-summary.md, stakeholder-update.md, and the learner launch dashboard if readable through its supported actions, otherwise launch-readiness-dashboard.md. Read any existing weekly-status.md before overwriting it. Save a fresh weekly-status.md in the same project root covering overall Red/Yellow/Green status and rationale, evidence-backed changes since the last report, team readiness, critical risks, decisions needed, and actions due before the go/no-go review. Use the source project facts, defaulting to the fictional Pulse Analytics case only where the files do. If no prior report or new evidence exists, state that. Keep unresolved blockers and unknown owners explicit, do not invent a year, and do not treat elapsed target dates as proof of completion. Disclose inaccessible dashboard data and use available files instead. Only update the local report; do not create further automations, publish, send messages, or change external systems.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'manual',
        requires: ['brief', 'plan', 'action-tracker', 'risk-register', 'executive-summary', 'stakeholder-update', 'dashboard'],
        produces: ['weekly-status'],
        caution: 'Paste into Automations manually. You must select the local project, recurring day/time/time zone, and explicitly save/run it. Recurring runs consume usage and overwrite weekly-status.md.',
      },
      {
        id: 'refine-saved-automation',
        title: 'Refine the saved automation',
        text: 'Additional report constraints: limit weekly-status.md to 150 words. Start with the overall readiness status—Red, Yellow, or Green—and a short evidence-based rationale. End with the single most important decision needed before the go/no-go review. Retain the existing source-reading, uncertainty, local-only, and no-publication requirements; concision must not hide unresolved blockers or invent progress.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'manual',
        requires: ['weekly-status'],
        produces: ['weekly-status'],
        caution: 'Append to the SAVED automation prompt manually, save, then run its play button and inspect the new report. Editing a chat prompt alone does not refine the automation.',
      },
    ],
    checks: [
      { id: 'recurring-saved', label: 'I saved an actual Weekly automation for the correct local project and verified its day, time, and time zone.' },
      { id: 'first-run-verified', label: 'I inspected the saved automation’s first run and its real weekly-status.md output—not just the preview.' },
      { id: 'refinement-verified', label: 'I edited and saved the automation prompt, reran it, and verified the refined report.' },
    ],
    sourceAnchor: 'exercise-10--automate-a-weekly-project-status',
  },
  {
    id: 'cloud',
    number: 11,
    title: 'Optional: explore cloud automation',
    subtitle: 'Keep the local automation unless access, policy, cost, and visibility fit.',
    phase: 'Repeat',
    minutes: 6,
    optional: true,
    objective: 'Evaluate and, only if appropriate, manually verify a cloud-run reporting task.',
    instructions: [
      'Check current app and organization availability before changing anything. The source lab requires a private or internal GitHub repository, write access, Copilot cloud agent enabled for it, and organization permission for cloud agent automations. A plain local folder is not enough.',
      'Confirm a suitable connected repository contains the approved source artifacts. Local-only files and locally stored dashboard state do not automatically exist in a cloud workspace; include the reviewed markdown dashboard fallback if needed. Publishing/copying to a remote repository is your separate manual, approved action.',
      'Review costs and visibility: the source lab says cloud runs can continue while your computer is off and consume Actions minutes and AI credits; repository collaborators can see run sessions/logs. Verify your actual limits and policy before enabling.',
      'Manually create a separate automation or edit one intentionally: choose the connected repository, enable Run in the cloud, and review tools with least privilege. For report-only output prefer read access; saving a repository file or opening a pull request needs separately approved write capability. Do not assume a local write target exists.',
      'Choose the trigger and, for a schedule, your own time zone; save and run once manually. Inspect the run and agreed output destination. If any prerequisite is absent, skip this optional mission—the verified local automation completes the core skill.',
    ],
    takeaway: 'Remote execution changes prerequisites, billing, visibility, and where the output can live.',
    prompts: [
      {
        id: 'cloud-report-workload',
        title: 'Optional: cloud report workload',
        text: 'For this manually configured cloud automation, read the approved launch-readiness sources available in the selected repository, including the markdown dashboard fallback when the local user canvas is unavailable. Summarize evidence-based overall Red/Yellow/Green status, changes supported by source evidence, team readiness, critical risks, decisions needed, and go/no-go actions. Keep unknown owners, unresolved blockers, and missing evidence explicit; do not invent a year or progress. Return the report in this run’s output by default. Do not assume access to files on my computer. Do not publish, modify repository files, open pull requests, or send messages unless the saved automation has an explicit approved output destination and the necessary narrowly scoped write permission. Do not change the automation configuration or request broader tools.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'manual',
        requires: ['brief', 'action-tracker', 'risk-register', 'executive-summary', 'stakeholder-update', 'dashboard'],
        produces: [],
        caution: 'Optional and manual only. Verify current app/org support, private/internal repository, write access, cloud-agent enablement, source availability, Actions-minute/AI-credit costs, collaborator-visible logs, and explicit approval before saving or running.',
      },
    ],
    checks: [
      { id: 'cloud-prerequisites', label: 'If attempting cloud: I verified repository, source artifacts, access, current availability, and organization policy.' },
      { id: 'cloud-scope-approved', label: 'If attempting cloud: I reviewed cost, log visibility, trigger/time zone, least privilege, and output destination.' },
      { id: 'cloud-run-verified', label: 'If attempting cloud: I manually saved and ran the cloud automation, then verified its output.' },
    ],
    sourceAnchor: 'exercise-11--optional-cloud-automation-for-a-connected-repository',
  },
  {
    id: 'safety',
    number: 12,
    title: 'Finish with safe, reviewable work',
    subtitle: 'Keep the evidence, narrow the permissions, and tidy the sessions.',
    phase: 'Repeat',
    minutes: 5,
    optional: false,
    objective: 'Verify your real outputs and adopt safe approval, automation, and session habits.',
    instructions: [
      'Reopen the local project file tree and learner dashboard/fallback. Verify the expected artifacts actually exist and reflect source evidence. A checked lesson box, successful prompt launch, or training dashboard is not proof of completed work.',
      'Review plans before approval and restrict unattended tasks to the files/tools they need. Keep business approvals, publication, issue posting, scheduling, and optional parallel-agent launches deliberate; do not interpret missing evidence as readiness.',
      'Open Manage sessions from the Sessions area or its menu. Try search/filter to locate your planning and reporting sessions. Manually archive a finished, unneeded session or chat only after checking its work is preserved; prefer archive over deletion for retained history.',
      'Confirm sharing boundaries: a project-scoped canvas can travel with a committed repository, while a user-scoped canvas is personal to this machine. Automations are private to their creator, but cloud-run sessions/logs can be visible to repository collaborators. Do not assume local training progress or files are published.',
      'Inspect your saved recurring automation and verified runs once more. Keep useful sessions and source artifacts available for the next real update; disable unneeded recurring work manually rather than leaving accidental consumption running.',
    ],
    takeaway: 'Completion means verified artifacts and deliberate automation—not assumed success or hidden side effects.',
    prompts: [
      {
        id: 'audit-local-handoff',
        title: 'Check the local handoff',
        text: 'Perform a read-only handoff review of this local launch project. Check launch-readiness-brief.md, launch-readiness-plan.md, action-tracker.csv, executive-summary.md, risk-register.csv, stakeholder-update.md, issue-backlog.md (or note if I deliberately used approved GitHub issues instead), weekly-status.md, and the separate learner dashboard or launch-readiness-dashboard.md. Report missing outputs, contradictory readiness, invented owners/dates, unsupported blocker resolutions, and differences between proposed versus approved go/no-go criteria. Use selected project evidence, not assumed Pulse Analytics progress. Report in this session only; do not modify files, query unrelated systems, publish, create schedules, or archive/delete sessions. File existence cannot prove that a recurring automation is saved or ran; tell me to verify its configuration and run history manually.',
        mode: 'Interactive',
        model: 'Auto',
        target: 'project',
        requires: ['brief', 'plan'],
        produces: [],
      },
    ],
    checks: [
      { id: 'handoff-verified', label: 'I opened the expected local outputs/dashboard and reviewed remaining evidence gaps.' },
      { id: 'approvals-scoped', label: 'I understand approval boundaries, automation scope, consumption, and what is shared.' },
      { id: 'sessions-managed', label: 'I used Manage sessions to find my work and chose what to keep or safely archive.' },
      { id: 'recurring-confirmed', label: 'I verified the real recurring automation and run history; any unavailable step remains incomplete.' },
    ],
    sourceAnchor: 'exercise-12--safety-approvals-and-session-management',
  },
];
