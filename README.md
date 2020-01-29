# StartupJS

> :fire: React **Native + Web** framework with the isomorphic realtime storage engine and observables

## Introduction

StartupJS is a full-stack framework which uses isomorphic web/native React frontend and NodeJS + MongoDB on the backend.

StartupJS stack is built on top of the following libraries and technologies:

- [React Router](https://reacttraining.com/react-router/) for routing and navigation with ability to separate project to [multi apps](https://github.com/dmapper/startupjs/blob/master/packages/app)
- [React-ShareDB](https://github.com/dmapper/startupjs/blob/master/packages/react-sharedb) - a [ShareDB](https://derbyjs.com/docs/derby-0.10/models) real-time collaborative database integration into React. This allows to sync data between your local state (similar to Redux) and the DB. And also brings in collaboration functionality similar to Google Docs, where multiple users can edit the same data simultaneously.
- [Model](https://derbyjs.com/docs/derby-0.10/models) based on [Racer](https://github.com/derbyjs/racer) with an ability to create [custom ORM methods](https://github.com/dmapper/startupjs/blob/master/packages/orm)
- [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) for the backend.
- [MongoDB](https://docs.mongodb.com/manual/installation/) as the database.
- [Redis](https://redis.io/) for the pub/sub (required by ShareDB) and locking functionality.
- [CodePush](https://github.com/Microsoft/react-native-code-push) to be able to dynamically push JS-only updates to the React Native apps in production.
- Code Quality
  - [Flow] (https://flow.org/en/docs/react/)
  - [ESLint] (https://eslint.org/)

## Requirements

- [Node](https://nodejs.org/) >= 12.0
- [Yarn](https://yarnpkg.com/)
- [MongoDB](https://docs.mongodb.com/manual/installation/) 4.0
- [Redis](https://redis.io/) 5.0
- [Android SDK](https://developer.android.com/sdk/) *optional* for Android development
- [Xcode](https://developer.apple.com/xcode/) *optional* for iOS Development

**OR**

- [Docker](https://docs.docker.com/install/) (Instead of *Quick start*, follow the instructions in [Docker development Quick Start](#docker-development-quick-start) section)

## Quick start

1. Initialize a new [`simple` boilerplate](#boilerplate-templates) project. Change `myapp` to your project name (use lower case).

    ```
    npx startupjs init myapp
    ```

2. Go into the created project folder and start the web application with:

    ```
    yarn start
    ```

3. Open http://localhost:3000 and start developing!

## Boilerplate templates

Following templates are available:

1. `simple` (default)
2. `routing` - plugs in [`@startupjs/app`](/packages/app) which provides a `react-router` routing implementation

By default `init` creates a project using the `simple` template.

To use a template with built-in routing, specify it using the `-t` option:

```
... init myapp -t routing
```

Each template initializes on top of a default `react-native init` application.

If you want to use an RC version (`next`) of `react-native`, specify it using the `-v` option:

```
... init myapp -v next
```

You can combine `-t` and `-v` options together. `react-native init` will run first and afterwards the boilerplate template will be  copied over.

## Running on mobile

`yarn start` actually combines 2 commands together: `yarn server` and `yarn web`.

In order to develop your app on mobile, you'll have to open a bunch of tabs anyways, so it makes sense
to also run `server` and `web` separately instead of using the `yarn start`.

Here is the list of commands to run all platforms at the same time:

1. Start **server** (required) *in a separate terminal tab*

    ```
    yarn server
    ```

2. Start **web** (optional) *in a separate terminal tab*

    ```
    yarn web
    ```

3. Start **metro** (required for Android and/or iOS) *in a separate terminal tab*

    ```
    yarn metro
    ```

5. Run **android** (optional) *in a separate terminal tab*

    ```
    yarn android
    ```

6. Run **ios** (optional) *in a separate terminal tab*

    ```
    yarn ios
    ```

## Docker development Quick Start

Alternatively you can run a docker development image which has node, yarn, mongo and redis already built in.
You only need `docker` for this. And it works everywhere -- Windows, MacOS, Linux.

Keep in mind though that since docker uses its own driver to mount folders,
performance (especially when installing modules) might be considerably slower compared
to the native installation when working with the large amount of files.

1. Initialize a new [`simple` boilerplate](#boilerplate-templates) project. Change `myapp` at the end to your project name (use lower case).

    ```
    docker run --rm -it -v ${PWD}:/ws:delegated startupjs/dev init myapp
    ```

2. Go into the created project folder. Then run the development docker container with:

    ```
    ./docker
    ```

3. While inside the running container, start your app with:

    ```
    yarn start
    ```

4. Open http://localhost:3000 and start developing!

5. When you want to open an additional terminal window, you can quickly exec into the running container using:

    ```
    ./docker exec
    ```

## IDE configuration

### Visual Studio Code

#### Step 1: Add support for PUG syntax highlighting

1. Install extension [`vscode-react-pug`](https://github.com/kaminaly/vscode-react-pug)
2. Restart VS Code

#### Step 2: Add support for ESLint errors highlighting

1. Install extension `ESLint`
2. Restart VS Code

### Atom

#### Step 1: Add support for PUG syntax highlighting

1.  Install packages [language-babel](https://atom.io/packages/language-babel) and [language-pug](https://atom.io/packages/language-pug)
2.  Open settings of `language-babel` in atom
3.  Find the field under "JavaScript Tagged Template Literal Grammar Extensions"
4.  Enter: `pug:source.pug`
5.  Go to `Core` settings of atom.
6.  Uncheck `Use Tree Sitter Parsers`
7.  Restart Atom

#### Step 2: Add support for ESLint errors highlighting

1.  Install pagkage `linter-eslint`
2.  Restart Atom

## Packages

- [App](https://github.com/dmapper/startupjs/blob/master/packages/app)
- [Backend](https://github.com/dmapper/startupjs/blob/master/packages/backend)
- [Bundler](https://github.com/dmapper/startupjs/blob/master/packages/bundler)
- [CLI](https://github.com/dmapper/startupjs/blob/master/packages/cli)
- [Cron](https://github.com/dmapper/startupjs/blob/master/packages/cron)
- [Init](https://github.com/dmapper/startupjs/blob/master/packages/init)
- [Model](https://github.com/dmapper/startupjs/blob/master/packages/model)
- [Offline](https://github.com/dmapper/startupjs/blob/master/packages/offline)
- [ORM](https://github.com/dmapper/startupjs/blob/master/packages/orm)
- [React sharedb](https://github.com/dmapper/startupjs/blob/master/packages/react-sharedb)
- [Routes middleware](https://github.com/dmapper/startupjs/blob/master/packages/routes-middleware)
- [Server](https://github.com/dmapper/startupjs/blob/master/packages/server)
- [StartupJS](https://github.com/dmapper/startupjs/blob/master/packages/startupjs)

## CodePush

[CodePush](https://github.com/Microsoft/react-native-code-push) is a cloud service that enables React Native developers to deploy mobile app updates instantly to all the devices of users.

It's built-in into the [`@startupjs/app`](/packages/app), which is included to the [`routing` template](#boilerplate-templates).

Do the following steps to configure it for your project:

1. Install CodePush CLI
  ```
  npm install -g code-push-cli
  ```
2. Create/Login a CodePush account
  ```
  // Register
  code-push register

  // Login if registered already
  code-push login
  ```
3. Register your app
  ```
  // For Android
  code-push app add <App-Name-Android> android react-native

  // For iOS
  code-push app add <App-Name-Ios> ios react-native
  ```

**For Android**

1. Add empty `reactNativeCodePush_androidDeploymentKey` string item to `/path_to_your_app/android/app/src/main/res/values/strings.xml`. It may looks like this:

```xml
<resources>
  <string name="reactNativeCodePush_androidDeploymentKey" moduleConfig="true"></string>
  <string name="app_name">Lingua.Live</string>
</resources>
```

2. Get keys using `code-push deployment ls <App-Name-Android> --displayKeys` and copy both Debug and Release key in `/path_to_your_app/android/app/build.gradle`

![codepush android](docs/img/codepush-android.png)

3. Go to `/path_to_your_app/android/app/src/main/java/com/lingua/MainApplication.java` and add code which set keys. It may looks like this:

```java
@Override
protected List<ReactPackage> getPackages() {
  @SuppressWarnings("UnnecessaryLocalVariable")
  List<ReactPackage> packages = new PackageList(this).getPackages();
  // Set CodePush deployment keys here, because
  // we can't set different keys for debug and
  // release on strings.xml (reactNativeCodePush_androidDeploymentKey)
  for(ReactPackage reactPackage: packages) {
    if (reactPackage instanceof CodePush) {
      ((CodePush)reactPackage).setDeploymentKey(BuildConfig.CODEPUSH_KEY);
    }
  }
  return packages;
}
```

**For iOS**

1. Add `CodePushDeploymentKey` string item with value `$(CODEPUSH_KEY)` to `/path_to_your_app/ios/your_app/Info.plist`. It may looks like this:

```xml
<plist version="1.0">
<dict>
<!-- ...other configs... -->
<key>CFBundleVersion</key>
<string>1</string>
<key>CodePushDeploymentKey</key>
<string>$(CODEPUSH_KEY)</string>
<key>LSRequiresIPhoneOS</key>
<!-- ...other configs... -->
</dict>
</plist>
```

2. Get keys using code-push deployment ls <App-Name-Ios> --displayKeys then open `/path_to_your_app/ios` using `Xcode` and copy both Debug and Release key in

![codepush ios](docs/img/codepush-ios.png)

## Troubleshooting

If you have any problem, search for the issues in this repository. If you don't find anything, you can raise an issue [here](https://github.com/dmapper/startupjs/issues).

## References

- [Generating keystores](https://coderwall.com/p/r09hoq/android-generate-release-debug-keystores)
- [CodePush](http://microsoft.github.io/code-push/docs/cli.html)
- [Checklist for deploying app](https://medium.com/the-react-native-log/checklist-to-deploy-react-native-to-production-47157f8f85ed)

## Licence

(MIT)
