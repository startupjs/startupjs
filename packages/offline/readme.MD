# startupjs offline

## installation
### step 0
Create your app using
```
npx startupjs init myapp -v next
```

### step 1
Install offline required packages
```
yarn add @startupjs/offline
yarn add @react-native-community/async-storage
yarn add http://github.com/zag2art/react-native-threads/tarball/rn61-fixes
npx rn-nodeify --hack --install "stream,buffer,process" --yarn
```

### step 2
Modify project

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

Add `import com.reactlibrary.RNThreadPackage;` to the imports at the top of the file

Add packages.add(new RNThreadPackage(mReactNativeHost, new AsyncStoragePackage()));``` to getPackages method before return.

Append the following lines to android/settings.gradle:
```
include ':react-native-threads'
project(':react-native-threads').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-threads/android')
```

Insert the following lines inside the dependencies block in android/app/build.gradle:
```
compile project(':react-native-threads')
```

Just in case take a look here - https://github.com/joltup/react-native-threads#android-1 and here - https://github.com/joltup/react-native-threads/issues/79

## How to upload/update readonly collections into thread

```
  const collections = {
     'games': {
       'id1': { /* */ }, /** doc as in mongo like in the next comment
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
