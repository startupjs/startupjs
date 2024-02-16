# create-startupjs

Bootstrap a new StartupJS application by adding it into an existing expo (or pure react-native) project.

## Usage

1. Create a new Expo (or pure React Native) project from any template.

2. Add startupjs to it by executing:

    ```
    npm init startupjs
    ```

3. Wrap the root of your application into `<StartupjsProvider>` component:

    ```jsx
    import { StartupjsProvider } from 'startupjs'

    // ...
    return (
      <StartupjsProvider>
        ...
      </StartupjsProvider>
    )
    ```

    For example, if you are using Expo with `expo-router`, you'll need to do it in `app/_layout.tsx`

4. Start the app the same way as you would usually start Expo or React Native app.

5. To test the production server run `yarn build && yarn start-production`
