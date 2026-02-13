# startupjs offline
## description

Startupjs offline creates an additional Thread (a la WebWorker) in background.

This thread has (we will call it offline backend):
  1. sharedb backend
  2. mingo
  3. async-storage (to store data)

Client sharedb connection is also modified. It can communicate with regular web server (via websocket) and
with the thread offline-"backend". So, if web-server is available the client connects to the web-server otherwise it
connects to offline server. Moreover going offline the socket copy all the current client sharedb data
into the offline-server. Reconnecting it synchronizes data back from 'offline'-server to 'online'.

Also the offline-backend allows to have "readonly collections". F.e. it could be metadata about games, stages,
exercises etc. To have the data prefetched on the client in case the user is offline.

### Possible scenarios

#### Serverless app

We can create mobile apps without server storing all the data in the "offline"-backend. Pros here is that we
can use our tech-stack without any changes: sharedb, mongo etc.

#### App with offline mode

We can design our app for full featured offline mode.
The main task is to design it the way to have all the necessary data in offline. So, developer
should decide which data should be read-only (usually it's necessary resources
like game/stage/exercise metadata) and provide sincronization/update code
(see example int the last section).

## installation
### step 0
Create your app using
```
npx startupjs init myapp -v latest
```

### step 1
Install offline required packages
```
yarn add @startupjs/offline @react-native-community/async-storage http://github.com/zag2art/react-native-threads/tarball/rn61-fixes
npx rn-nodeify --hack --install "stream,buffer,process" --yarn
```

### step 2
Modify project

#### add to index.js in the root of your app
```
import './shim' // the first line in the file
```
#### add to App.js
```
import offlineInitPlugin from '@startupjs/offline/lib/offlineInitPlugin'

/**
 * All params are optional
 *
 * @param subscribeDoc fn take collectionName, docId  - we need this to count refs and load/unload docs correctly
 * @param unsubscribeDoc fn take collectionName, docId - we need this to count refs and load/unload docs correctly
 * @param options.readOnlyCollections [String] - an array of names of collections with readonly data
*/
const socketParams = {
  // ...
}

init({ baseUrl: BASE_URL, orm, plugins: [offlineInitPlugin], socketParams })
```

#### create worker.thread.js in the root of your app
```
import './shim'
import '@startupjs/offline/lib/offlineThread'
```

#### create react-native.config.js in the root of your app
```
// react-native.config.js
module.exports = {
  dependencies: {
    'react-native-threads': {
      platforms: {
        android: null, // disable Android platform, other platforms will still autolink if provided
      },
    },
  },
};
```

### step 3
Manually link react-native-threads for android

Open up android/app/src/main/java/[...]/MainApplication.java:

Add the lines

```
import com.reactlibrary.RNThreadPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
```

to the imports at the top of the file

Add `packages.add(new RNThreadPackage(mReactNativeHost, new AsyncStoragePackage()));` to getPackages method before return.

Append the following lines to android/settings.gradle:
```
include ':react-native-threads'
project(':react-native-threads').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-threads/android')
```

Insert the following lines inside the dependencies block in android/app/build.gradle:
```
  implementation project(':react-native-threads')
```

Just in case take a look here - https://github.com/joltup/react-native-threads#android-1 and here - https://github.com/joltup/react-native-threads/issues/79

## How to upload/update readonly collections into thread

```
  const collections = {
     'games': {
       'id1': { /* */ }, /** doc as in mongo like in the comment
       'id2': { /* */ }  /**
     }
  }

  // doc example
  // {
  //   	"_id" : "65e74553-c7d7-4ace-9e1a-68b4e4600e62",
  // 	"name" : "",
  // 	"title" : "",
  // 	"_type" : "http://sharejs.org/types/JSONv0",
  // 	"_v" : 1,
  // 	"_m" : {
  // 		"ctime" : 1560842384760,
  // 		"mtime" : 1560842384760
  // 	},
  // 	"_o" : ObjectId("5d089090b49a8f7740f4a77d")
  // }


  // rm all the previous content of "games" and fill it with the new docs
  await model.socket.rpc.run('updateDocumentsFull', collections )
  or
  // await model.connection.socket....
  // need to check
```
