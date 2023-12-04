# startupjs pm

> Project management automation and guidelines for github projects

## Installation

> This is meant to be used to manage a startupjs project.
> 
> For using this NOT in a startupjs project, read the according section below.

After you've created a new startupjs project **and pushed it to a new github repo**,
you need to:

1. create a new GitHub project with the same name as your github repo from
our [Project Management Template](https://github.com/orgs/startupjs/projects/2)

    **IMPORTANT**: You have to be a member of the organization where the repo is located
to have rights to create a new GitHub project.

1. link it to the repository in repository's `Projects` tab
1. add `"task": "npx startupjs task"` and `"pr": "npx startupjs pr"` into `scripts` of your `package.json`

Instead of manually performing the 3 steps above, we provide a simple command which
you can run once:

```sh
npx startupjs init-pm
```

The whole process of development and how to use the helper scripts is described
in separate guidelines files.
Please make sure all developers, designers, team leads and project managers are strictly
following their according guidelines:

[**StartupJS Project Management Guidelines**](./guidelines.md)

## Usage NOT in a StartupJS project

1. You have to have the repo on github
1. Install the module with scripts:

    ```sh
    yarn add @startupjs/pm
    ```

1. create a new GitHub project with the same name as your github repo from
our [Project Management Template](https://github.com/orgs/startupjs/projects/2)

    **IMPORTANT**: You have to be a member of the organization where the repo is located
to have rights to create a new GitHub project.

1. link it to the repository in repository's `Projects` tab
1. add to `scripts` in your `package.json`:

    ```sh
    "task": "sh ./node_modules/@startupjs/pm/scripts.sh task",
    "pr": "sh ./node_modules/@startupjs/pm/scripts.sh pr"
    ```

## License

MIT

(c) Decision Mapper - http://decisionmapper.com
