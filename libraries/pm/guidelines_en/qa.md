# TODO: Write up QA guidelines

    - either move it further to `✅ Ready for Prod`, or return it back to `❤️ Changes requested` and write in the task comments what needs to be changed.

11. After a sufficient number of tasks have been tested in dev, the team lead deploys them to production. It is preferable to do this when there are none (or almost none) of the tasks with the status `❗️ Merged. Testing in Dev`, to avoid deploying tasks to production that haven't been tested in dev.

    After the deployment, the team lead changes the status of all tasks `✅ Ready for Prod` and `❗️ Merged. Testing in Dev` (if there are any) to the status `🔴 Deployed. Testing in Prod`.

    Obviously, if a task was not tested in dev and went straight to prod, then testing it in dev is no longer sensible, and it should be tested directly in prod.

12. The QA team tests the `🔴 Deployed. Testing in Prod` task and either moves it to `✅ Done`, or returns it to `❤️ Changes requested`, commenting on what needs to be changed.
