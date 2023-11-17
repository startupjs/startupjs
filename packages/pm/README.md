# startupjs pm

> project management automation and guidelines for github projects

## Installation

This meant to be used from the main `cli` package (the main `startupjs` cli)

After you've created a new startupjs project and pushed it to a new github repo,
execute the following command from the root of your project:

```sh
npx startupjs init-pm
```

This will create the GitHub project with the same name as your github repo from
our private Template. You have to have access to our private Template in order
to use it. For access please contact @cray0000

It will also add the following helper scripts `yarn pr` and `yarn task ISSUE_NUMBER`
to your `package.json` which you'll need to use doing all the development work going
forward.

The whole process of development and how to use the helper scripts is described
in separate guidelines files.
Please make sure all developers, designers, team leads and project managers are strictly
following their according guidelines:

[**StartupJS Project Management Guidelines**](./guidelines.md)

## License

MIT

(c) Decision Mapper - http://decisionmapper.com
