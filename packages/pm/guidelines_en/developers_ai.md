# Developers working with AI agents (Codex, Claude Code, etc.):

The process is the same as in the [Developers guidelines](./developers.md) — same project tabs, statuses, `Hours`, `yarn task` and `yarn pr`. The difference is that the code is written by an AI agent, while **you** stay responsible for the task: you estimate it, you check the result, you open the PR and you answer the review.

**IMPORTANT:** The AI agent must never merge or approve PRs, change `Priority`, `Hours` or assignees, or post anything to GitHub (PRs, comments, reviews, issues) without your explicit OK.

## When you want to add a new task:

1. Create a new Issue on GitHub (you can ask the agent to draft it for you, but read it before creating).
2. After creation, it will automatically receive the `👽 New` status.
3. You'll see this new task in `👽 New` column in Project's `📅 𝙿𝙻𝙰𝙽𝙽𝙸𝙽𝙶` tab.
4. If your Team Lead or Project Manager asked to work on it this sprint (this or next week), then assign it to yourself and change its status to `ᴅᴇᴠ: 🎁 Todo`.
5. The agent only knows what is written in the task and in the code, so the description should include:

    ```
    ## Goal
    What should be possible after this is done.

    ## Acceptance criteria
    - [ ] concrete, checkable statement
    - [ ] ...

    ## Context
    Links to design, related tasks and PRs, files where it probably lives.

    ## Out of scope
    What NOT to do in this task.
    ```

## When you want to work on a new task:

1. Go to the `🧑 𝙼𝚈 𝚃𝙰𝚂𝙺𝚂` tab in the GitHub Project -- it will only show the tasks assigned to you.

2. If you don't see any tasks in `ᴅᴇᴠ: 🎁 Todo` section:

    - go to `🚀 𝙳𝙴𝚅` tab in the GitHub Project;
    - assign some tasks to yourself;
    - return back to `🧑 𝙼𝚈 𝚃𝙰𝚂𝙺𝚂` tab.

3. Estimate how long **each** task in `ᴅᴇᴠ: 🎁 Todo` section will take you:

    - Estimate **your** time, not the agent's: prompting, reading the code it wrote, testing it manually. Don't estimate "the AI will do it in 5 minutes".
    - Set the `Hours` value for the task (`🩵 𝟷ℎ`, `💚 𝟸ℎ`, `💛 𝟺ℎ`, `🧡 𝟾ℎ`).
    - If the task is too large (more than 8 hours), set the `Hours` value to `💕 N` and break it down into smaller ones, the same way as described in [developers.md](./developers.md).
    - A good size for a sub-task is one where you can carefully read the resulting diff in 15-20 minutes. If you can't review it properly, your reviewers can't either.

4. Pick a task you are going to work on next from the `ᴅᴇᴠ: 🎁 Todo` section.

5. Run command `yarn task <number>` (yourself or ask the agent to do it) to create a feature branch for it.

    - Same as usual: it creates a branch named `<number>` from the latest master (or switches to it) and changes the status to `ᴅᴇᴠ: 🚀 In progress`.
    - Your working tree must be clean -- the command switches to `master` first.

6. Start a **new** agent session for this task and ask it for a plan first:

    ```
    We are working on task #<number>. Read it with `gh issue view <number> --comments`.
    Explore the relevant code and give me a short plan: which files you'll change,
    the approach, and how you'll verify it. List any unclear points.
    Don't change any code until I approve the plan.
    ```

    - Check the plan. It's the cheapest moment to catch a wrong approach.
    - If something in the task is unclear -- don't let the agent guess. Ask your Team Lead or PM and write the answer in the task comments.
    - Use one session for one task only. Don't let the agent fix unrelated things "along the way" -- create new tasks for them instead.

7. Let the agent implement the plan:

    ```
    Plan approved. Implement it, keep changes minimal and within task #<number>.
    When done, run lint and tests and show me the output. For UI changes, run the app and check it.
    ```

    - Stop it early if it goes in the wrong direction.
    - Don't accept "it works" -- ask for the actual test/lint output or check it yourself.

8. Review the result yourself **before** creating a PR, as if it were written by a new junior developer:

    - Read the whole diff (`git diff master...`) and make sure you understand every line -- you'll be the one answering reviewers.
    - Watch out for: changes outside the task, invented functions/props that don't exist, duplicated helpers, deleted or skipped tests, silently swallowed errors, leftover `console.log`s, new dependencies you didn't ask for.
    - Test the task manually against every acceptance criterion.

9. When the code is ready to be reviewed -- commit it and run `yarn pr` to create a Pull Request.

    - Same as usual: the task gets converted into a PR, reviewers are requested and the status changes to `ᴅᴇᴠ: 🔍 On review`.
    - Add to the PR description how you verified it and mention which AI agent was used, plus any parts you're not fully sure about -- it saves reviewers' time.

10. When reviewers request changes:

    - The task will automatically change status to `ᴅᴇᴠ: ❤️ Changes requested`.
    - Switch back to your task branch using `yarn task <number>`.
    - Ask the agent to read the review and propose fixes:

        ```
        Read the review comments on PR #<number>
        (`gh pr view <number> --comments` and `gh api repos/{owner}/{repo}/pulls/<number>/comments`).
        For each comment propose a fix. Don't change code yet.
        ```

    - Decide on each point yourself. If you disagree with a reviewer -- **you** answer them, not the agent.
    - Let the agent apply the fixes, check the diff again (as in step 8), `git push`, then run `yarn pr` to request the review again. The status will change to `ᴅᴇᴠ: 🔍 On review`.

11. After your PR has received the necessary minimum approvals (usually `2`), your task will automatically change status to `ᴅᴇᴠ: ✅ Ready to be merged`.

12. When your team lead merges the PR, the task will automatically change its status to `ǫᴀ: 🛖 Merged. Test Dev`, and QA team tests it in the dev environment.

13. If there are any bugs to fix or improvements, you (or your PMs or Team Leads) should create new tasks to fix them. That's it! The task is considered to be done by you at this point.

## When you work on several tasks in parallel:

Agents make it possible to work on more than one task at a time. Only do it if the tasks don't touch the same files and you have time to properly review all of them.

1. Use a separate folder (git worktree) for each task so agents don't overwrite each other's changes:

    ```sh
    git fetch origin master
    git worktree add ../<project>-<number> -b <number> origin/master
    ```

2. `yarn task` doesn't work inside a worktree (it tries to switch to `master`, which is already used in the main folder), so change the task status to `ᴅᴇᴠ: 🚀 In progress` manually.
3. Run a separate agent session in each folder. `yarn pr` works there as usual.
4. After the PR is merged, remove the folder: `git worktree remove ../<project>-<number>`.

## Before running `yarn pr` check that:

- [ ] all changes are within the scope of the task
- [ ] you've read the whole diff and can explain every change
- [ ] lint and tests pass (you've seen the output)
- [ ] the task is manually tested against every acceptance criterion
- [ ] there are no secrets, debug logs, unrelated refactors or unapproved dependencies
