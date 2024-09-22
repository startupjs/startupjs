# Guidelines for Team Leads and Project Managers

## When you want to add a new task:

1. Just create a new Issue on GitHub.
2. After creation, it will automatically receive the `👽 New` status.
3. You'll see this new task in `👽 New` column in Project's `📅 𝙿𝙻𝙰𝙽𝙽𝙸𝙽𝙶` tab.

## When you plan the next sprint:

Go to `📅 𝙿𝙻𝙰𝙽𝙽𝙸𝙽𝙶` tab.

### Review the tasks in `ᴜx: ✅ Ready to code` column:

> These are UX tasks which are finished and approved (reviewed) and awaiting to be implemented in code.

If the task is complex and requires you to add more information regarding how to implement it in code, then:

1. change its status to `✅ Done`;
2. create one or more new tasks in `👽 New` column for developers and link the design task there in description so that devs can refer to it if needed.

If the task is relatively straightforward and does not require any additional research to be implemented in code, then just reuse the existing task going forward:

1. unassign it from the designer who worked on it;
2. move it to `👽 New` column;
3. add more info for developers by editing the description of the task.

### Review the tasks in `👽 New` column:

> These are the new tasks which you have to decide whether you'll work on them in the coming month or not.

1. If you really have to work on the task during the next month, move it to `🌱 Important`.
2. Otherwise, **if you are not 100% sure** you have to implement it during the next month, move it to `🚫 Not important`.

### Review the tasks in `🌱 Important` column:

> These are the tasks you plan to work on during the **next MONTH**, so only tasks from here can go into the next sprint (which is **next WEEK**).

> Next sprint (**next WEEK**) is all the tasks in `Todo` columns (`ᴜx: 🎴 Todo` and `ᴅᴇᴠ: 🎁 Todo`)

1. Set the `Priority` of each task:

    - `🔥 １` - URGENT (critical bug) (**DO NOT set it for all tasks**)
    - `💣 ２` - important (priority feature or bug) (**DO NOT set it for all tasks**)
    - `☀️ ３` - normal task (**this should be your default priority for most tasks**)
    - `❄️ ４` - lower priority for the current sprint

2. According to priority, assign the tasks for people to work on during the next sprint (**ONLY NEXT WEEK**):

    - for design tasks change the status to `ᴜx: 🎴 Todo`;
    - for coding tasks change the status to `ᴅᴇᴠ: 🎁 Todo`.

3. Ask your designers and developers to estimate the tasks you assigned to them:

    - only the person who's gonna actually work on the task (who you assigned it to) should estimate it.
    - "estimating the task" means that they have to set the `Hours` for each task with a maximum of `8 hours` and split large tasks into smaller ones if needed.

### Review the tasks in `🚫 Not important` column:

> These are the tasks you did not originally planned to work on during the next month.

1. Quickly glance through the tasks in this column.
2. If the situation changed and you are 100% sure now that the task has to be implemented during the next month, then move it to `🌱 Important`.
