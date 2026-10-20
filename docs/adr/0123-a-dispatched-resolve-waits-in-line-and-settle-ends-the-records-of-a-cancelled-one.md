# A dispatched `resolve` waits in line, and `settle` ends the records of a cancelled one

> Amends 0025 (the split workflow's `resolve` uses `queue: max` again), 0035 (`settle` also runs when `resolve` was cancelled) and 0074 (the check warns about a `resolve` group without `queue: max` or with `cancel-in-progress`, and about a `settle` that skips a cancelled `resolve`).

Found on 2026-10-20 on a repo that runs the split workflow. Twice, a tick through the Sluiceway app (0116) opened a record for the run it dispatched, as 0109 and 0122 describe. Each time the `resolve` job of that run ended as cancelled about ten seconds later without a runner and without a step. Its record stayed queued, its row said deploying, and nothing deployed. A manual re-run of the cancelled run deployed it.

The jobs of the runs around it show the cause. The app's tick also edits the dashboard, so an `issues` run's `resolve` held `sluiceway-resolve` when the dispatched run arrived, and the dispatched `resolve` waited in the group. A second edit of the dashboard a few seconds later started a third run. Its `resolve` queued in the same group, and GitHub keeps one waiting job per group: it cancelled the older waiting one, the dispatched `resolve`. `cancel-in-progress` played no part. The workflow did not set it, and the cancelled job never started.

0025 chose that group without `queue: max` because any `resolve` handles every ticked box, so a replaced run lost nothing. That stopped being true for dispatched runs. Only the `resolve` of the run a record names hands that record on (0109), and the dispatched `resolve` is also what starts a stack that waited behind another (0056) or for its window (0104). An `issues` run's `resolve` does neither. So a replaced dispatched `resolve` loses its deploy. `settle` did not help, because its `if:` ran it only when `resolve` handed something on, and a cancelled `resolve` hands nothing on. The record stayed open until a render after the end of the run ended it as `the run ended without a result`. In a dispatched run that waited for a long scan, that was the next push or the next day's scan.

## Decision

- **The split workflow's `resolve` waits in line with `queue: max`.** Its group is `sluiceway-resolve` as before, in the long form with `queue: max`, so every waiting `resolve` runs, in order, one at a time. Never `cancel-in-progress`. The cost is an `issues` run per edit of the dashboard by a person, each a few seconds on a hosted runner. The workflow token's own writes start no run (0017), so the line holds people's edits and dispatches only.
- **`settle` also runs when `resolve` was cancelled.** Its `if:` gains `needs.resolve.result == 'cancelled'` as one more way in. It ends every open record of its run, as it always does, with the failure on the row and a full scan after it (0035, 0113). A run that was cancelled by hand, or a `resolve` that waited past a timeout, ends loudly within its own run and does not stay deploying until a later scan. A run with nothing open costs `settle` one request per environment name, as before.
- **`settle` ends such a record. It does not dispatch the workflow again.** With `queue: max`, a newer run no longer cancels a `resolve`. Only a person or a timeout does, and a deploy that a person cancelled must not start again by itself. The failure line says the deploy did not go out, and a fresh tick deploys it.
- **The check warns about each part.** A split `resolve` whose group has no `queue: max`, a split `resolve` whose group has `cancel-in-progress`, and a `settle` that waits for `resolve` and whose `if:` is not `always()` alone and does not read `needs.<resolve>.result`. Each warning names what is lost and the line to add.
- **The scan keeps its group without `queue: max`.** A replaced scan loses nothing: a merge waits for any scan (0054, 0064), and a full scan runs again on the next push, the schedule or the rescan box.
- **The one-step workflow is unchanged.** Its one group already has `queue: max` (0077), and its post step settles a cancelled run.

## Considered

- **A group per event, `sluiceway-resolve-${{ github.event_name }}`.** Rejected: two app ticks in a row are two dispatched runs, and the newer one's `resolve` would still drop the older one's, with its record.
- **A group per run for dispatched runs.** Rejected: two `resolve` jobs would then write the dashboard at the same time, which the group exists to avoid.
- **Dispatching the run again from `settle`, or from the next render, when its `resolve` was cancelled.** Rejected for the reason above. A cancel by a person is an answer, and a deploy that starts again after it is a surprise.
- **Running `settle` on `always()` alone.** Rejected: every edit of the dashboard and every push would start one more job that finds nothing. The `result` of `resolve` says when one is needed.

## Consequences

- `docs/split-workflow.md` shows `resolve` with `queue: max` and the wider `if:` of `settle`, in the workflow and in the merge and deploy section, and says why each is there.
- The check has three new warnings: `resolve-no-queue`, `resolve-cancels` and `settle-skips-cancelled-resolve`.
- A repo on the split workflow sees those warnings in the check until it adds the two lines. Nothing in the action changes, so its runs keep working, and the gap stays open until the workflow changes.
- The e2e run gains two steps on the split workflow. An app's tick whose dispatched `resolve` runs after the `resolve` of a later edit still deploys. An app's tick whose dispatched `resolve` was cancelled is ended by `settle`, with the failure line on its row.
