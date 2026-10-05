# QIQC Challenge Participant Guide

Agentic Quantum Coding Challenge | GaugeForge | 2026-10-04.1

Build the system around the model. Design an agent harness that plans experiments, uses quantum tools, responds to evidence and produces a verifiable result. Every official entrant uses **Hunyuan 4 Preview (HY4)**. The challenge starts on **8 November 2026**; the final submission deadline is **10 November 2026** and Demo Day is **12 November 2026**. Registration opening time is To be announced.

This guide separates confirmed conditions from a **proposed competition protocol**. The detailed protocol will be frozen before registration and official submissions open. No event upload API, registration form or Hunyuan 4 Preview starter adapter is claimed to be live in this edition.

## Who can enter

Teams have **1–3 members**, with no academic or professional qualification requirement. Entry is free under the current event brief. Participation and prize payment remain subject to applicable law and valid consent; any minor-consent process will be disclosed before registration. Proposed fairness rule: one person belongs to one team and all accounts belonging to that team share the same allowance.

You may improve an existing harness or build your own. Your contribution is the orchestration, tool use, experiment strategy and reliable execution, not a different foundation model. Quantum expertise is useful, but the public tasks and documentation provide a starting point for agent developers.

## Participation flow

1. Read this guide and explore the five released Quantum-Harbor tasks.
2. Form a team and contact shenhao.miao@gauge-forge.com with questions. This email is an inquiry channel, not a confirmed registration.
3. Register when the official form and consent terms are announced.
4. Install the public environment, run the no-key check, then develop your harness with the announced model adapter.
5. Validate dependencies and submit a frozen candidate through the announced submission service.
6. Use up to **3 complete official evaluations**, select the final candidate under the frozen rules, and retain reproducibility evidence.
7. Review provisional results and appeal a specific scoring or process error within the published window.

<!-- page -->

## Install and run the public environment

The following interface is verified against Quantum-Harbor commit `1f03d78e959cf02469568250f61f9af88a53146f`. It is a local practice workflow, not a contest submission command. Use Linux or a Linux environment through WSL2 on Windows, Docker with Linux containers, git, uv and Python 3.11 or newer. The first image build downloads several GB; the repository estimates about 20 minutes, depending on your connection and machine.

```bash
uv tool install 'harbor==0.18.0'
git clone https://github.com/GaugeForge/Quantum-Harbor
cd Quantum-Harbor
git checkout 1f03d78e959cf02469568250f61f9af88a53146f
uv sync
docker build -t qiqcbench-agent docker/agent/
uv run python tools/build_qsim_images.py --tasks time_budgeted_hamlearn_10q
harbor run -p harbor_tasks/time_budgeted_hamlearn_10q -a nop
harbor view jobs
```

The `nop` agent requires no API key and does no science. For this task, reward **0 is the expected installation-check result**, not a failed installation. Build all public verifier images with `uv run python tools/build_qsim_images.py` before running the whole public directory.

The repository includes `configs/harbor/time_budgeted_hamlearn_10q_codex.yaml` as a working example of a Harbor agent configuration. It is a Codex example, **not the official Hunyuan 4 Preview starter harness**. The event adapter will be announced once the exact API and tool-calling behavior are validated. Do not simply rename the model string. Harbor 0.18.0 model overrides require both `-a` and `-m`; check the pinned `harbor run --help`.

## Five public practice tasks

| Repository task | Engineering objective |
| --- | --- |
| `time_budgeted_hamlearn_10q` | Estimate a sparse Hamiltonian from budgeted 10-qubit probes |
| `time_budgeted_shadow_surrogate_60q` | Learn pair-correlation predictions from bounded measurements |
| `tunable_coupler_cz_netzero` | Calibrate a controlled-Z pulse through a realistic control stack |
| `logical_cnot_decoder_calibration` | Calibrate decoders for memory and logical CNOT experiments |
| `adaptive_clustered_clbcs_h2o` | Design measurements and estimate molecular energy with uncertainty |

Read each task's `instruction.md` for its actual tools, budgets and answer schema. Existing local tasks can take from 30 minutes to 3 hours at their configured agent timeout. A full `nop` run has a documented caveat: the 60-qubit surrogate task can report missing evidence as an infrastructure failure with no reward. Do not treat a missing reward file as scientific zero.

<!-- page -->

## Harness and tools

Quantum-Harbor runs the agent and the simulated device in separate environments. The agent uses MCP tools to read device specifications, request experiments, retrieve raw results and submit a final answer. A separate verifier grades the outcome using recorded evidence. This is simulated quantum engineering; no participant needs to own quantum hardware.

For example, the public Hamiltonian task uses `run_hamiltonian_probe_batch` and `submit_final_answer`. Its answer is a coefficient vector with uncertainties, following the public instruction schema. Other tasks require different payloads. A task-level final answer is not the same as submitting the harness to the competition.

Proposed tool policy: Python and other declared local code, scientific libraries, deterministic optimization, and the task's approved MCP tools are allowed. Multiple agent roles may use the same approved Hunyuan 4 Preview endpoint within the shared budget. Other inference models, human intervention in an official run, undeclared remote services, changing verifiers, and reading materials outside the permitted agent environment are not allowed. Development assistance must be disclosed where it contributes code or data; the runtime restriction applies to all model calls made by the submitted system.

Dependencies must be pinned and legally redistributable. Declare system packages, model-facing tools, hardware requirements and all network destinations. The proposed official environment has no general Internet access during a run; dependencies are installed in a controlled build stage. No privileged containers, Docker socket access or embedded credentials. Exact CPU, RAM, disk, package policy and build limits will be published before official submission.

## Model version and budgets

Competition model: **Hunyuan 4 Preview (HY4)**. Tencent provider candidate; exact API ID, frozen snapshot and development allowance: To be announced. Tencent is the expected provider, but the event does not claim a confirmed sponsorship. The organizer will freeze the endpoint, model ID, version, reasoning settings, context/output limits and per-task resource budgets before official evaluation.

Each team has at most **3 complete official benchmark evaluations**. Any provider-supported development allowance is separate and has not been confirmed. Unlimited API credits, if agreed, do not remove experiment shot/job limits, timeouts or the official three-evaluation cap.

Proposed submission accounting: preflight checks that do not execute the benchmark do not consume an evaluation; a valid accepted run does, including failures caused by entrant code. Organizer infrastructure failures rerun the same immutable submission without consuming a new evaluation. Exact duplicate submissions use the existing receipt. Changing code requires a new candidate and, if evaluated, another allowance unit.

<!-- page -->

## Proposed submission specification

**This is a proposed package contract, not an implemented upload API.** No `submit` command or endpoint exists in this guide. The event will publish its authenticated upload route, limits and adapter contract before accepting submissions.

Submit an archive or a repository commit containing source, a Dockerfile if required by the final runner, locked dependencies, `README.md`, the AGPL license, and `submission.json`. Use the exact frozen code to reproduce an official result. Include setup/run instructions and a smoke-check log. Exclude API keys, private datasets and generated private evaluation outputs.

```json
{
  "schema_version": "proposal-1",
  "team_slug": "your-team-slug",
  "source_commit": "FULL_GIT_COMMIT_SHA",
  "license": "AGPL-3.0-only",
  "dependency_lock": "uv.lock",
  "runner_contract": "to-be-published",
  "network_requirements": [],
  "entrypoint_documentation": "README.md"
}
```

The example's license version is proposed pending rule freeze. Placeholder values in this schema illustrate fields; they are not credentials or a usable event configuration. The final contract must define how task input, model access, logs and termination are delivered. The repository currently uses Harbor to run tasks; it does not define this event archive schema.

Proposed candidate rule: your **last valid accepted full evaluation** before the final deadline is your final candidate. The public board reflects that candidate's public-task score. Hidden scores are withheld, so teams cannot choose their best hidden result out of three. Preflight rejection does not overwrite an earlier valid candidate. Every accepted candidate gets a server timestamp and digest receipt; late compute completion does not invalidate a submission accepted before the deadline.

## Public and hidden evaluation

The public board shows the five designated public-task scores. Hidden evaluation scores appear only after the submission deadline and reproducibility checks. The competition uses all 49 QIQCBench tasks; five are public and the remaining 44 are hidden during the event.

Published paper tasks and repository examples are accessible learning material and may have appeared in training or development. “Hidden” means withheld during the event, **not proven uncontaminated**. Teams must disclose known prior use of benchmark material and follow the final data policy. Official evaluation should use frozen conditions and independently verifiable evidence. Do not claim a scientific generalization beyond the tested conditions.

<!-- page -->

## Proposed scoring and ranking

Each of the 49 tasks contributes a normalized score q_i in [0,1]. Existing released tasks produce binary reward 0 or 1. If a continuous-score task is included, the organizer will publish its direction, thresholds and mapping before competition; scores will not be normalized against the best or worst entrant after the event.

**Final automated score = 100 × sum of all 49 task scores / 49.** Public and hidden tasks are equally weighted per task. The public board uses the same formula over its five public tasks. It is not a 50:50 average of the two leaderboards. For example, 3/5 public passes and 32/44 hidden passes gives public score 60 and combined score 71.43.

Proposed tie order: unrounded total score descending, then total effective task runtime ascending. Queue time and verified organizer outages are excluded; a timed-out task contributes its full task time limit. If these remain exactly equal, earlier final-candidate acceptance wins, then receipt ID lexicographic order. The same rules resolve the fifth-place boundary.

Only eligible, reproducible entries remain on the final automated ranking. Its top **5** progress to expert review; if a team is disqualified, the next eligible team advances. If fewer qualify, the panel reviews the available teams. A task invalidated by an organizer defect must be removed or rerun consistently for all teams and the Astra baseline, with the denominator adjusted consistently.

<!-- page -->

## Expert final and Challenger Award

Experts decide the order **within the five finalists**, with no blended automatic/jury formula. Proposed rubric: scientific reliability 40%, harness design and evidence 30%, reusability 20%, clarity 10%. At least three non-conflicted judges score each team. Each team presents one successful and one failed trajectory, with an 8-minute demonstration and 7-minute question period. Expert ties resolve by reliability, then harness evidence, then automated rank. The automated leaderboard remains a separate published result.

Confirmed Challenger Award criterion: only the **first qualifying team** whose HY4 entry strictly exceeds the organizer's frozen **GPT-6 Astra hidden leaderboard score** wins USD 15,000. Proposed hidden score = 100 × sum of hidden-task scores / hidden-task count. Public-task scores do not decide this award. Astra is an organizer-run comparison, not a model entrants may call. The baseline API version, harness, resource limits and comparison procedure must be frozen before competition. No baseline score is announced yet.

Proposed first-place clock for this award: compare server acceptance timestamps of eligible, reproducible qualifying submissions across the three official attempts, not job completion times; exact ties use receipt ID order. Hidden results remain embargoed until the common release, when the first qualifying submission is identified retrospectively. Whether a later final candidate must also qualify and whether this award stacks with placement prizes will be resolved before registration. These details are proposals, not already approved conditions.

## Reproduction and appeals

Retain the source commit, image digest, dependencies, config and permitted logs. Organizer re-execution uses the frozen candidate; no edits or human intervention are allowed. A missing reward caused by infrastructure is held for investigation rather than converted to zero. Reproduction tolerance and any repeated-run aggregation will be fixed in the final rules; no best-of-reruns substitution.

Proposed appeal windows: 24 hours after provisional automated results for a specific scoring, eligibility or infrastructure error, and 24 hours after expert review for procedural errors or undisclosed conflicts. Email shenhao.miao@gauge-forge.com with team/receipt IDs and a concise evidence-based claim. The organizer will appoint an independent reviewer and publish the reason for any correction. Private evaluation content must not be posted publicly.

<!-- page -->

## Open source and data use

Submitted harness code must be released as **AGPL open source**. The proposed exact version is AGPL-3.0-only, to be confirmed before registration. Include corresponding source, build instructions, changes and third-party notices. The MIT-licensed Quantum-Harbor repository retains its own license; the contest does not relicense upstream code. You must have rights to contribute your code and dependencies.

The organizer and participating partner organizations are intended to have usage rights in submitted data and execution trajectories. The registration terms must identify recipients, purposes, scope, retention and publication policy before you consent. Proposed purposes include evaluation, reproducibility research and event reporting. Any model-training or commercial reuse requires explicit scope in that grant; it is not inferred from AGPL or from participation. AGPL alone is not a license for personal data or confidential third-party data.

The entrant retains underlying ownership subject to the applicable open-source license and agreed data grant. Do not submit employer secrets, proprietary lab records, credentials or identifiable third-party data without permission. Public source release and public trajectory release are distinct decisions. Selected case studies should use redacted records and the published attribution choice.

## Privacy

The event site currently has no registration backend, account creation, analytics tracker or upload form. Clicking an email link opens your mail application and sends nothing automatically. Information sent by email is handled by GaugeForge for responding to the inquiry. Contact shenhao.miao@gauge-forge.com for access, correction or deletion requests, subject to necessary event records and applicable law.

When registration opens, collect only identity/contact information needed to run the event, team details, consent records, and technical submissions/logs. Public boards should use the chosen team name. The final notice must name data recipients, processing region, retention, payment-data handling and any training use. Proposed default: remove routine registration contact data 90 days after event close, keep de-identified research records only as permitted by the agreed grant, and retain finance records as legally required. This retention schedule is proposed, not an undisclosed present practice.

<!-- page -->

## Awards

| Award | USD |
| --- | --- |
| Champion | 1,500 |
| Second place | 700 |
| Third place | 700 |
| Fourth place | 500 |
| Fifth place | 500 |

A **USD 15,000 Challenger Award** goes only to the **strict first qualifying Hunyuan 4 Preview (HY4) team to exceed a fixed GPT-6 Astra baseline on the hidden leaderboard**. There is one winning team, not a shared pool or an award for every qualifying team. If no team exceeds the baseline, it is not paid. Timestamp policy, whether it stacks with placement awards, payment terms and exact baseline are **To be announced**. Placement awards follow the final expert ordering after appeals.

## FAQ

**Do I need a quantum computer?** No. The released environment simulates quantum devices and verifies recorded results.

**Can I use a different model or a multi-agent system?** Official inference uses only the frozen Hunyuan 4 Preview (HY4). Multiple roles using that endpoint are allowed under the proposed shared-budget rule.

**Is the starter ready?** Public Quantum-Harbor examples are available. The competition-specific Hunyuan 4 Preview adapter and submission service are not yet released.

**Does a zero in the no-key check mean failure?** No. `nop` performs no experiment; zero is expected on the recommended Hamiltonian smoke check.

**Are development calls unlimited?** Not confirmed. The official allowance is three full evaluations per team regardless of any future provider development offer.

**Will you use all 49 paper tasks?** Yes. Five tasks are public; 44 tasks are hidden during the event.

**Can I register now?** The registration link is TBA. Ask shenhao.miao@gauge-forge.com for participation information; visiting the benchmark page does not register a team.

**Where can I inspect the technical basis?** [Pinned repository](https://github.com/GaugeForge/Quantum-Harbor/tree/1f03d78e959cf02469568250f61f9af88a53146f), [benchmark](https://gauge-forge.com/qiqc), and [paper](https://arxiv.org/abs/2609.17439). These references are research resources, not alternative contest rules.
