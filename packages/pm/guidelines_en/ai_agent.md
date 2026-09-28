# AI agent: processing tasks via GitHub API

> These are instructions for an AI agent (Codex, Claude Code, etc.). Give it this file (or reference it from `AGENTS.md` / `CLAUDE.md`) and it will work on the project tasks the same way developers do in [developers.md](./developers.md), using `gh` and the GitHub API instead of the web UI.

You are working on behalf of a developer (below: **"the developer"**). Tasks are GitHub issues, tracked in a GitHub Project with a `Status` field. Follow the same process as human developers — the statuses have to move exactly the same way, because Team Leads, reviewers and QA rely on them.

## Rules

1. Only work on tasks assigned to the developer (or the task number the developer gave you).
2. One task = one branch named after the task number (`1205`) = one PR with the same number.
3. Stay within the scope of the task. If you find other problems -- report them to the developer (or draft a new task, see below), don't fix them in this branch.
4. **Ask the developer before** each of these, unless they explicitly told you to do it without asking:
    - creating issues, commenting on issues/PRs;
    - committing, `git push`, creating a PR, requesting reviews;
    - setting `Hours`.
5. **Never:** merge or approve PRs, change `Priority` or assignees, move tasks into statuses owned by other people (`✅ Ready to be merged`, `ǫᴀ: ...`, `✅ Done`), force-push, or push to `master`.
6. Never claim the task is done without evidence: show lint/test output and describe how you verified the behaviour.

## Setup: find the project

Run once per session and remember the values:

```sh
# owner and repo (the project has the same title as the repo)
gh repo view --json owner,name -q '.owner.login + " " + .name'

# project number
gh project list --owner <owner> --format json -q '.projects[] | select(.title == "<repo>") | .number'

# fields and their options (Status, Hours, Priority) -- use the option names exactly as returned
gh project field-list <projectNumber> --owner <owner> --format json

# developer's github login
gh api user -q .login
```

`gh` must be logged in with the `project` scope. If a project command fails with a scope error -- ask the developer to run `gh auth refresh -s project`.

To change a field of a task (used in all steps below):

```sh
gh project item-edit <projectNumber> --owner <owner> \
  --url https://github.com/<owner>/<repo>/issues/<number> \
  --field "Status" --value "<exact option name>"
```

(Use `/pull/<number>` in the URL once the task has been converted into a PR.)

## Statuses

| Status | Who moves the task here | How |
| --- | --- | --- |
| `👽 New` | automatic | on issue creation |
| `ᴅᴇᴠ: 🎁 Todo` | Team Lead / developer | manually |
| `ᴅᴇᴠ: 🚀 In progress` | **you** | when you start the task (step 4) |
| `ᴅᴇᴠ: 🔍 On review` | **you** | when you create the PR or re-request review (steps 9, 10) |
| `ᴅᴇᴠ: ❤️ Changes requested` | automatic | reviewer requests changes |
| `ᴅᴇᴠ: ✅ Ready to be merged` | automatic | enough approvals |
| `ǫᴀ: 🛖 Merged. Test Dev` and later | automatic / Team Lead / QA | never touch |

## When you are asked to add a new task:

1. Draft the issue and show it to the developer first:

    ```
    ## Goal
    What should be possible after this is done.

    ## Acceptance criteria
    - [ ] concrete, checkable statement

    ## Context
    Links to design, related tasks and PRs, files where it probably lives.

    ## Out of scope
    What NOT to do in this task.
    ```

2. After approval, create it: `gh issue create --title "..." --body-file <file>`. It automatically gets the `👽 New` status.
3. If the task is too big (more than 8 hours of work) -- propose splitting it into several tasks.
4. Do not assign it or change its status unless the developer asks you to.

## When you work on a task:

1. **Find the task.** If the developer didn't give you a number, list their tasks in `ᴅᴇᴠ: 🎁 Todo`:

    ```sh
    gh project item-list <projectNumber> --owner <owner> --limit 200 --format json \
      -q '.items[] | select(.status == "<exact Todo option name>")
          | select(.assignees // [] | index("<login>"))
          | "\(.content.number)  \(.content.title)"'
    ```

    Show the list to the developer and let them choose (they may prefer a different order than you would).

2. **Read the task** fully, including comments, linked issues and designs:

    ```sh
    gh issue view <number> --comments
    ```

    If the acceptance criteria are unclear or missing -- stop and ask the developer. Don't guess.

3. **Estimate.** If `Hours` is not set, propose one of `1h`, `2h`, `4h`, `8h` (the developer's total time including review and testing, not your coding time). If it's more than 8h -- propose a breakdown as a checkbox list with hours per item (see [developers.md](./developers.md)). Set `Hours` only after the developer confirms.

4. **Start the task.** Working tree must be clean. Create the branch from the latest `master`, or switch to it if it already exists:

    ```sh
    git fetch origin
    git switch <number> 2>/dev/null \
      || git switch -c <number> --track origin/<number> 2>/dev/null \
      || git switch -c <number> origin/master
    ```

    If the branch did not exist yet (neither locally nor on origin) -- change the status to `ᴅᴇᴠ: 🚀 In progress`.

    > `yarn task <number>` does the same (checkout master, pull, create/switch branch, change status). You can use it instead, except inside a git worktree.

5. **Plan.** Explore the code and give the developer a short plan: files to change, approach, how you'll verify it. Wait for approval before editing code.

6. **Implement** the plan. Keep the diff minimal, match the style of the surrounding code, don't add dependencies without asking. Add or update tests for logic changes.

7. **Verify.** Run lint and tests, and for UI changes run the app and check the result. Go through every acceptance criterion. Show the developer the output.

8. **Self-review** the full diff (`git diff origin/master...`) before handing over. Remove debug logs, unrelated changes, and anything you are not able to explain. Tell the developer which parts deserve their extra attention.

9. **Create the PR** (after the developer approves). This is what `yarn pr` does, so you can just run `yarn pr <number>`. Via the API:

    ```sh
    # 1. commit and push
    git push -u origin HEAD

    # 2. remember the issue's project item fields (Hours, Priority) -- they are lost when the issue is converted
    gh project item-list <projectNumber> --owner <owner> --limit 200 --format json \
      -q '.items[] | select(.content.number == <number>)'

    # 3. convert the issue into a PR (keeps the same number)
    gh api repos/<owner>/<repo>/pulls -f head=<number> -f base=master -F issue=<number>

    # 4. make sure the PR is in the project, restore Hours and Priority
    gh project item-add <projectNumber> --owner <owner> --url https://github.com/<owner>/<repo>/pull/<number>
    gh project item-edit ... --url .../pull/<number> --field "Hours" --value "<old value>"
    gh project item-edit ... --url .../pull/<number> --field "Priority" --value "<old value>"

    # 5. request reviews from the reviewers in .github/github.config.json (except the developer)
    gh pr edit <number> --add-reviewer user1,user2

    # 6. status -> On review
    gh project item-edit ... --url .../pull/<number> --field "Status" --value "<exact On review option name>"
    ```

    Then add to the PR description (`gh pr edit <number> --body-file <file>`, keep the existing text):

    - if `branchesDomain` is set in `.github/github.config.json`, the first line: `> 🕹️ ᴛᴇsᴛ ʜᴇʀᴇ: [<number>.<domain>](https://<number>.<domain>)`;
    - **How it was verified**: commands run and their results, manual checks;
    - **AI**: which agent made the changes, and which parts need extra attention.

10. **When reviewers request changes** (status `ᴅᴇᴠ: ❤️ Changes requested`):

    - Switch to the branch (step 4) and pull it.
    - Read the whole review:

        ```sh
        gh pr view <number> --comments
        gh api repos/<owner>/<repo>/pulls/<number>/reviews
        gh api repos/<owner>/<repo>/pulls/<number>/comments
        ```

    - For each comment propose a fix to the developer. If you think a reviewer is wrong -- tell the developer, don't argue on GitHub.
    - Apply the approved fixes, verify again (steps 7-8), push with a normal `git push`.
    - Re-request the review (`gh api -X POST repos/<owner>/<repo>/pulls/<number>/requested_reviewers -f 'reviewers[]=user1'`) and change the status to `ᴅᴇᴠ: 🔍 On review` -- or just run `yarn pr`.

11. After this the task moves on automatically (approvals → `ᴅᴇᴠ: ✅ Ready to be merged` → merge → QA). Your part is done. If QA or reviewers find new bugs, they become new tasks.

## When the developer asks you to work on several tasks in parallel:

Use a separate git worktree per task, so the work of one task never mixes with another:

```sh
git fetch origin
git worktree add ../<repo>-<number> -b <number> origin/master
```

Change the status to `ᴅᴇᴠ: 🚀 In progress` via the API (`yarn task` doesn't work in a worktree). Don't take tasks in parallel if they change the same files. Remove the worktree after the PR is merged: `git worktree remove ../<repo>-<number>`.

## Report to the developer

At the end of each step that needs their decision, give a short report:

- task number and title, current status;
- what you did and the verification output;
- what you need from them (approve plan / approve PR creation / answer a question).
