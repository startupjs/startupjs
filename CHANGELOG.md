## [0.50.10](https://github.com/startupjs/startupjs/compare/v0.50.9...v0.50.10) (2023-01-18)


### Features

* **observer:** add throttle for useForceUpdate ([#1010](https://github.com/startupjs/startupjs/issues/1010)) ([0a5fbc8](https://github.com/startupjs/startupjs/commit/0a5fbc813a38141b87e207e2bbcd6498c8055e4f))



## [0.50.9](https://github.com/startupjs/startupjs/compare/v0.50.8...v0.50.9) (2023-01-10)



## [0.50.8](https://github.com/startupjs/startupjs/compare/v0.50.7...v0.50.8) (2023-01-05)



## [0.50.7](https://github.com/startupjs/startupjs/compare/v0.50.6...v0.50.7) (2022-12-28)



## [0.50.6](https://github.com/startupjs/startupjs/compare/v0.50.5...v0.50.6) (2022-12-27)



## [0.50.5](https://github.com/startupjs/startupjs/compare/v0.50.4...v0.50.5) (2022-12-27)



## [0.50.4](https://github.com/startupjs/startupjs/compare/v0.50.2...v0.50.4) (2022-12-27)



## [0.49.5](https://github.com/startupjs/startupjs/compare/v0.49.4...v0.49.5) (2022-12-26)


### Bug Fixes

* **Sidebar:** revert broken changes in [#997](https://github.com/startupjs/startupjs/issues/997) ([dfb1d27](https://github.com/startupjs/startupjs/commit/dfb1d27e37a1289b8407f09460d51525c3cd607f))



## [0.49.4](https://github.com/startupjs/startupjs/compare/v0.49.3...v0.49.4) (2022-12-25)


### Bug Fixes

* **ui/Div:** reset hover/active state when disabled ([4595f4b](https://github.com/startupjs/startupjs/commit/4595f4b9e3fcb672e8525c7a3ee89f5d5f4e6b6f))



## [0.49.3](https://github.com/startupjs/startupjs/compare/v0.49.2...v0.49.3) (2022-12-22)


### Features

* **auth-local/RegisterForm:** add 'complexPassword' option ([#992](https://github.com/startupjs/startupjs/issues/992)) ([e9161d7](https://github.com/startupjs/startupjs/commit/e9161d733524ca40d33c6e2213a754a544ffbf65))



## [0.49.2](https://github.com/startupjs/startupjs/compare/v0.49.1...v0.49.2) (2022-12-14)


### Bug Fixes

* **Sidebar:** fix height shrink ([b57633c](https://github.com/startupjs/startupjs/commit/b57633ccc582322f48b0be9c533f6cb13191cc8c))



## [0.49.1](https://github.com/startupjs/startupjs/compare/v0.49.0...v0.49.1) (2022-12-06)


### Bug Fixes

* **auth:** always set 'loggedIn' to session ([40cb5aa](https://github.com/startupjs/startupjs/commit/40cb5aa90edbf9e97f02fd9c0ae6a868f670c1e7))



# [0.49.0](https://github.com/startupjs/startupjs/compare/v0.48.6...v0.49.0) (2022-11-24)


### Features

* **ui/Multiselect:** add property to limit the number of selected tags ([#990](https://github.com/startupjs/startupjs/issues/990)) ([3a54967](https://github.com/startupjs/startupjs/commit/3a54967293ca9cc3966aa80641a675f58a6ad891))


### BREAKING CHANGES

* [See 0.49 migration guide](/docs/migration-guides/0.49.md)



## [0.48.6](https://github.com/startupjs/startupjs/compare/v0.48.5...v0.48.6) (2022-11-10)


### Bug Fixes

* **Div:** remove flex-basis: 0 from 'full' variant ([2bf433a](https://github.com/startupjs/startupjs/commit/2bf433aba10595601f0a85676fe1055c64085be2))



## [0.48.5](https://github.com/startupjs/startupjs/compare/v0.48.4...v0.48.5) (2022-11-08)


### Bug Fixes

* **app:** restore url when app starts only once ([bcd1778](https://github.com/startupjs/startupjs/commit/bcd1778ac6afd382f545be18a1a54aaf0409f5fc))



## [0.48.4](https://github.com/startupjs/startupjs/compare/v0.48.3...v0.48.4) (2022-10-24)


### Bug Fixes

* **AutoSuggest:** recover input value when close without selection ([ad2059e](https://github.com/startupjs/startupjs/commit/ad2059e0885cd5152c543416bd663b7f85461673))



## [0.48.3](https://github.com/startupjs/startupjs/compare/v0.48.2...v0.48.3) (2022-10-24)


### Bug Fixes

* **AutoSuggest:** reset selected index when select item using keyboard ([551e429](https://github.com/startupjs/startupjs/commit/551e42921e45c90f7c225c0df5f7b27b10cd65e1))



## [0.48.2](https://github.com/startupjs/startupjs/compare/v0.48.1...v0.48.2) (2022-10-21)


### Features

* **AutoSuggest:** add ability to make input disabled and readonly ([c5ead0b](https://github.com/startupjs/startupjs/commit/c5ead0b7f8e1c5952e8c699811758ef3b5d7f29b))



## [0.48.1](https://github.com/startupjs/startupjs/compare/v0.48.0...v0.48.1) (2022-10-21)


### Bug Fixes

* **ObjectInput:** add ability to make 'disabled' and 'readonly' ([b5b8dc5](https://github.com/startupjs/startupjs/commit/b5b8dc5cfeac247caee3ae3bcb94c368d4a0672a))
* **recaptcha:** move 'react-native-webview' to peerDependencies ([#987](https://github.com/startupjs/startupjs/issues/987)) ([63f3d58](https://github.com/startupjs/startupjs/commit/63f3d58c91ed0b27fadde01b2fbe341cf34b0364))



# [0.48.0](https://github.com/startupjs/startupjs/compare/v0.47.7...v0.48.0) (2022-10-06)


### Bug Fixes

* **ui/AutoSuggest:** add ability to delete input value ([#985](https://github.com/startupjs/startupjs/issues/985)) ([72fa048](https://github.com/startupjs/startupjs/commit/72fa048e707d2d734fdbb0a86c9b84396d5ee9bf))


### Features

* support DEPLOYMENTS env var ([#984](https://github.com/startupjs/startupjs/issues/984)) ([6b7678c](https://github.com/startupjs/startupjs/commit/6b7678c167430951c0efd7fb36312adad2a74a10))


### BREAKING CHANGES

* [See 0.48 migration guide](/docs/migration-guides/0.48.md)



## [0.47.7](https://github.com/startupjs/startupjs/compare/v0.47.6...v0.47.7) (2022-10-06)


### DEPRECATED

This version is **DEPRECATED**, use `0.48.0` version instead.



## [0.47.6](https://github.com/startupjs/startupjs/compare/v0.47.5...v0.47.6) (2022-10-03)


### Bug Fixes

* **plugins:** fix crashes for dynamic plugins ([c89ff0b](https://github.com/startupjs/startupjs/commit/c89ff0b73b9770b0e46a67d867e3b93347296540))


### Features

* **ui/dialogs:** add support for standard DOM api for alert(), confirm(), prompt() ([2725e07](https://github.com/startupjs/startupjs/commit/2725e07d26ca5e46ce9ee9117ab4aa15f01d4eda))



## [0.47.5](https://github.com/startupjs/startupjs/compare/v0.47.4...v0.47.5) (2022-09-21)


### Bug Fixes

* **auth/AuthForm:** use ui layout instead of custom implementation ([2a2cfff](https://github.com/startupjs/startupjs/commit/2a2cfff25489ff5120ffbb7c4000cfdafb6f5f8d))



## [0.47.4](https://github.com/startupjs/startupjs/compare/v0.47.3...v0.47.4) (2022-09-21)


### Bug Fixes

* **bundler:** add 'json' to metro extensions ([d212b01](https://github.com/startupjs/startupjs/commit/d212b018f5822efa68b014f521ff16ed86949c99))



## [0.47.3](https://github.com/startupjs/startupjs/compare/v0.47.2...v0.47.3) (2022-09-15)


### Bug Fixes

* **NumberInput:** prevent write words ([e2ee2c0](https://github.com/startupjs/startupjs/commit/e2ee2c046889f79922265ace2b31b3b36c17ae56))



## [0.47.2](https://github.com/startupjs/startupjs/compare/v0.47.1...v0.47.2) (2022-09-12)


### Features

* **auth-local/RegisterForm:** add ability to add hidden form fields ([d7a51de](https://github.com/startupjs/startupjs/commit/d7a51ded743a16b3ab30b7e740d226d2368d1851))



## [0.47.1](https://github.com/startupjs/startupjs/compare/v0.47.0...v0.47.1) (2022-09-06)


### Features

* **auth-local:** add ability to handle confirm registration step ([fae2216](https://github.com/startupjs/startupjs/commit/fae22164a27cf0c7dcb09ee4ae54482f08b212dd))



# [0.47.0](https://github.com/startupjs/startupjs/compare/v0.46.5...v0.47.0) (2022-09-05)


### BREAKING CHANGES

* [See 0.47 migration guide](/docs/migration-guides/0.47.md)



## [0.46.5](https://github.com/startupjs/startupjs/compare/v0.46.4...v0.46.5) (2022-09-02)


### Bug Fixes

* **ui/ObjectInput:** fix 'style' usage ([96e0d09](https://github.com/startupjs/startupjs/commit/96e0d094304702d9e37a443050a37f13f966a2a0))



## [0.46.4](https://github.com/startupjs/startupjs/compare/v0.46.3...v0.46.4) (2022-08-30)


### Bug Fixes

* **auth-linkedin:** fix dependency @dmapper/passport-linkedin-oauth2 ([#979](https://github.com/startupjs/startupjs/issues/979)) ([60097ca](https://github.com/startupjs/startupjs/commit/60097ca63d97ffc531b178da9dd0251c7850ff07))
* improve error displaying ([#978](https://github.com/startupjs/startupjs/issues/978)) ([f819678](https://github.com/startupjs/startupjs/commit/f819678a5bc91317e2f025e9b4011e5517dc5cbb))
* **Item:** prevent multiline text ([4ec2b2b](https://github.com/startupjs/startupjs/commit/4ec2b2b546a91432fc6d891d7a9042e4b65aeeac))



## [0.46.3](https://github.com/startupjs/startupjs/compare/v0.46.2...v0.46.3) (2022-08-15)


### Features

* **auth-linkedin:** add ability to get client dynamically ([#975](https://github.com/startupjs/startupjs/issues/975)) ([e5b6831](https://github.com/startupjs/startupjs/commit/e5b6831d115011e6cb650ec1b842d9ac697a6f97))



## [0.46.2](https://github.com/startupjs/startupjs/compare/v0.46.1...v0.46.2) (2022-08-09)


### Bug Fixes

* **patches:** add patch for 'react-router-native-stack' that removes 'ViewPropTypes' that are removed in new versions of react-native ([#974](https://github.com/startupjs/startupjs/issues/974)) ([28d8943](https://github.com/startupjs/startupjs/commit/28d894382edaa92743cdb1640b0cc500f22ff2d2))
* **react-sharedb-hooks:** batch queries example. ([#972](https://github.com/startupjs/startupjs/issues/972)) ([3c90272](https://github.com/startupjs/startupjs/commit/3c90272f126699db247539da590c88dda39e82fe))
* **ui docs:** correct font() mixin sizes. ([#973](https://github.com/startupjs/startupjs/issues/973)) ([86635d9](https://github.com/startupjs/startupjs/commit/86635d9eac9bdd5db42a4394f323f56690e3d10f))



## [0.46.1](https://github.com/startupjs/startupjs/compare/v0.46.0...v0.46.1) (2022-08-02)


### Bug Fixes

* add missing import of 'RangeInput' ([e840a3f](https://github.com/startupjs/startupjs/commit/e840a3f07bd45e332aafb7741e560261ea009f3a))
* **Divider:** always fill the entire space of parent block ([06087a4](https://github.com/startupjs/startupjs/commit/06087a4ed43fd09b86c6ecec29d7175a236f0c4a))
* **sharedb-access:** fix tests ([#970](https://github.com/startupjs/startupjs/issues/970)) ([125c75e](https://github.com/startupjs/startupjs/commit/125c75e9093f5c638973ff77f734ceac856e26a4))

## [0.46.0](https://github.com/startupjs/startupjs/compare/v0.45.6...v0.46.0) (2022-07-27)


### Bug Fixes

* fix errors that happens when generating new project


### Features

* **mailgun:** add package ([#969](https://github.com/startupjs/startupjs/issues/969))



## [0.45.6](https://github.com/startupjs/startupjs/compare/v0.45.5...v0.45.6) (2022-07-20)


### Bug Fixes

* don't change url() to absolute urls in css-loader ([ec8b214](https://github.com/startupjs/startupjs/commit/ec8b214dbefb3cce887a21134368de6e581abe9c))
* fix crashes when importing styl file in styl file for mode web ([2e93aed](https://github.com/startupjs/startupjs/commit/2e93aedaf53652edb718b86319b417dc7e821d66))



## [0.45.5](https://github.com/startupjs/startupjs/compare/v0.45.4...v0.45.5) (2022-07-14)


### Bug Fixes

* **bundler:** fix regexp that replace backslash for windows support ([#966](https://github.com/startupjs/startupjs/issues/966)) ([1c26478](https://github.com/startupjs/startupjs/commit/1c26478a007291a7aa132298a0897f62b4c7dc6c))



## [0.45.4](https://github.com/startupjs/startupjs/compare/v0.45.3...v0.45.4) (2022-07-13)


### Bug Fixes

* **bundler:** change dependency type for cross-env and rimraf ([#965](https://github.com/startupjs/startupjs/issues/965)) ([5db7782](https://github.com/startupjs/startupjs/commit/5db778271611ebf48c99b758acb43cc908d36c35))
* **plugin/PluginsProvider:** do nothing when no registered plugins ([ec6d071](https://github.com/startupjs/startupjs/commit/ec6d071b68c52170a6f6aed4db43680f8950b88f))
* **ui/NumberInput:** fix bug related to blocking input value cleanup when 'min' property exists ([2822fda](https://github.com/startupjs/startupjs/commit/2822fdab1d74dadaa9733557e7e8640506a85edb))



## [0.45.3](https://github.com/startupjs/startupjs/compare/v0.45.2...v0.45.3) (2022-07-13)


### Bug Fixes

* **bundler:** fix replacing backslash ([d138e0b](https://github.com/startupjs/startupjs/commit/d138e0bce4ddb11386b052e848b4a4ca562c97ff))



## [0.45.2](https://github.com/startupjs/startupjs/compare/v0.45.1...v0.45.2) (2022-07-13)

### Features

* **build:** bump node version in Dockerfile's ([b6a4e91](https://github.com/startupjs/startupjs/commit/b6a4e917cfa1d3239fdd5ab953100b8da7d3b1ec))



## [0.45.1](https://github.com/startupjs/startupjs/compare/v0.45.0...v0.45.1) (2022-07-12)


### Bug Fixes

* **plugin:** fix crashes when plugins are not provided for a module ([#963](https://github.com/startupjs/startupjs/issues/963)) ([f48ddf7](https://github.com/startupjs/startupjs/commit/f48ddf79cb63a24d4d90c87f7354f476e57ccb96))
* **worker:** fix memoryleaks ([83eb493](https://github.com/startupjs/startupjs/commit/83eb493b3ebf35455b030c479e7725fe55400759))


### Features

* **ui/Sidebar|SmartSidebar|DrawerSidebar:** add ability for lazy content rendering ([#959](https://github.com/startupjs/startupjs/issues/959)) ([47f28c9](https://github.com/startupjs/startupjs/commit/47f28c912e94ab8f558f3dfb51a3b01069783566))



# [0.45.0](https://github.com/startupjs/startupjs/compare/v0.44.28...v0.45.0) (2022-06-16)

### BREAKING CHANGES

* [See 0.38 migration guide](/docs/migration-guides/0.45.md)



## [0.44.28](https://github.com/startupjs/startupjs/compare/v0.44.27...v0.44.28) (2022-06-14)


### Bug Fixes

* **ui/Layout:** disable scroll for web ([#957](https://github.com/startupjs/startupjs/issues/957)) ([8686c40](https://github.com/startupjs/startupjs/commit/8686c40bb2069780687e22e0c0aaf201e0d95f1a))


### Features

* **ui/RangeInput:** add range input ([#952](https://github.com/startupjs/startupjs/issues/952)) ([7c10b02](https://github.com/startupjs/startupjs/commit/7c10b02f15159b1bb9b2c168d3ac2b7706f63ffd))
* **ui:** add rank input ([#958](https://github.com/startupjs/startupjs/issues/958)) ([388b205](https://github.com/startupjs/startupjs/commit/388b20562a2e8244e8842fd93cb3a1ea7974afa1))



## [0.44.27](https://github.com/startupjs/startupjs/compare/v0.44.26...v0.44.27) (2022-06-06)


### Bug Fixes

* **ui/Dropdown:** add disabled property to disable caption click ([d35ae4e](https://github.com/startupjs/startupjs/commit/d35ae4e1af20ee7084f177f85c54ea95feca3cc0))



## [0.44.26](https://github.com/startupjs/startupjs/compare/v0.44.25...v0.44.26) (2022-06-02)


### Bug Fixes

* **Dropdown:** add ability to hide responder for drawer ([1832cf9](https://github.com/startupjs/startupjs/commit/1832cf952e5e35b785c728007dbabe6ebcd0b3ba))


### Features

* **ui/Progress:** add ability to customize progress parts ([1079f78](https://github.com/startupjs/startupjs/commit/1079f789cbfa43256800ffcda23617eef4e710cb))



## [0.44.25](https://github.com/startupjs/startupjs/compare/v0.44.24...v0.44.25) (2022-05-30)


### Bug Fixes

* **Div:** fix incorrect hyphenate in the tooltip text when the text is small ([b6c803c](https://github.com/startupjs/startupjs/commit/b6c803c4e5e8bc11cf76361af6d9c4f9babe303f))



## [0.44.24](https://github.com/startupjs/startupjs/compare/v0.44.23...v0.44.24) (2022-05-24)


### Bug Fixes

* **ui/NumberInput:** remove color for arrows ([e85d62b](https://github.com/startupjs/startupjs/commit/e85d62b9bb311c2fbfadd4de2493c45a44385bfd))
* **ui/TextInput:** move font size to config ([24ce740](https://github.com/startupjs/startupjs/commit/24ce740051a085eeb5a1ab25dc1069d3d4608fa4))



## [0.44.23](https://github.com/startupjs/startupjs/compare/v0.44.22...v0.44.23) (2022-05-22)


### Bug Fixes

* **babel-plugin-rn-stylename-to-style:** Fix dynamic updates of CSS [@media](https://github.com/media) when cache is used ([#951](https://github.com/startupjs/startupjs/issues/951)) ([2f22c76](https://github.com/startupjs/startupjs/commit/2f22c76fd8721fd8e279cc693b178890ee61eeb1))



## [0.44.22](https://github.com/startupjs/startupjs/compare/v0.44.21...v0.44.22) (2022-05-20)


### Bug Fixes

* **auth-telegram:** fix getting an avatar when it's absent ([#950](https://github.com/startupjs/startupjs/issues/950)) ([ff75716](https://github.com/startupjs/startupjs/commit/ff75716b869d43104958b89d4893c52343f8f94c))



## [0.44.21](https://github.com/startupjs/startupjs/compare/v0.44.20...v0.44.21) (2022-05-19)


### Features

* **auth-local:** add request email confirmation slide ([#948](https://github.com/startupjs/startupjs/issues/948)) ([9297589](https://github.com/startupjs/startupjs/commit/9297589eadc4c2b919ce769f8273a0d5a4be3abb))



## [0.44.20](https://github.com/startupjs/startupjs/compare/v0.44.19...v0.44.20) (2022-05-18)


### Bug Fixes

* **auth-local:** set correct `confirmationExpiresAt` to auth ([#947](https://github.com/startupjs/startupjs/issues/947)) ([12dc2e4](https://github.com/startupjs/startupjs/commit/12dc2e47b7abe02f823f1fd450bed370fcd264ec))


### Features

* **auth-local:** implements email confirmation ([#942](https://github.com/startupjs/startupjs/issues/942)) ([949dfda](https://github.com/startupjs/startupjs/commit/949dfda9f7a24c1e367f8a48c366f1a833ac24ec))



## [0.44.19](https://github.com/startupjs/startupjs/compare/v0.44.18...v0.44.19) (2022-05-17)


### Bug Fixes

* **ui/TextInput:** add ability to change placeholder text color ([f8e26fa](https://github.com/startupjs/startupjs/commit/f8e26fa7482e3bd168615d549ff2beab788d26cf))



## [0.44.18](https://github.com/startupjs/startupjs/compare/v0.44.17...v0.44.18) (2022-05-16)


### Features

* **ui/Icon:** add ability to pass custom width and height for custom icon ([066023a](https://github.com/startupjs/startupjs/commit/066023a49e99d59e4468d62f1ae43b65eeef1fd3))



## [0.44.17](https://github.com/startupjs/startupjs/compare/v0.44.16...v0.44.17) (2022-05-13)


### Bug Fixes

* **bundler:** fix rare usecase of npm module in web production being not inside node_modules ([38b21dd](https://github.com/startupjs/startupjs/commit/38b21ddab0a207a6111e688f95fca9a978281146))



## [0.44.16](https://github.com/startupjs/startupjs/compare/v0.44.15...v0.44.16) (2022-05-13)


### Bug Fixes

* **babel-plugin-dotenv:** return condition ([#944](https://github.com/startupjs/startupjs/issues/944)) ([bc45a02](https://github.com/startupjs/startupjs/commit/bc45a025ff7f206206f0c1be790f3cf63ee0e463))
* **react-native-gesture-handler:** fix crashing of ios app because of cycle imports ([#856](https://github.com/startupjs/startupjs/issues/856)) ([1e22da0](https://github.com/startupjs/startupjs/commit/1e22da0c4892ee2cbce54c08785f528e89b3becf))
* **ui/Content:** use `Div` component as root instead of react-native `View` ([#945](https://github.com/startupjs/startupjs/issues/945)) ([212e880](https://github.com/startupjs/startupjs/commit/212e880625fb475736371c5a09bda2b1fb3246f8))



## [0.44.15](https://github.com/startupjs/startupjs/compare/v0.44.14...v0.44.15) (2022-04-25)


### Bug Fixes

* **cli:** fix axios version. New one requires a webpack polyfill for 'url', we'll deal with it later. ([17d8c7d](https://github.com/startupjs/startupjs/commit/17d8c7d34d11476416c30aea12935e9f3529926e))



## [0.44.14](https://github.com/startupjs/startupjs/compare/v0.44.13...v0.44.14) (2022-04-22)


### Bug Fixes

* **babel-plugin-rn-stylename-to-style:** Fix search for the react component function. This fixes using css part attribute within loops and nested arrow functions ([d860627](https://github.com/startupjs/startupjs/commit/d860627a494145d9d6f212debc8441b2f6b0ee0d))



## [0.44.13](https://github.com/startupjs/startupjs/compare/v0.44.12...v0.44.13) (2022-04-21)


### Bug Fixes

* **ui/NumberInput:** fix input responsiveness ([1f55bfe](https://github.com/startupjs/startupjs/commit/1f55bfec0ade49b4f9364b3a3b8f36318d199c84))



## [0.44.12](https://github.com/startupjs/startupjs/compare/v0.44.11...v0.44.12) (2022-04-21)


### Bug Fixes

* **auth:** add better validatation for email field when user reset a password ([5e449b7](https://github.com/startupjs/startupjs/commit/5e449b7cbcbd60b5bd5ce887116412cbbb9edfb4))
* **ui/NumberInput:** fix responsiveness of input wrapper ([660b714](https://github.com/startupjs/startupjs/commit/660b7149fd9373e51e844205acfad4cc77727514))



## [0.44.11](https://github.com/startupjs/startupjs/compare/v0.44.10...v0.44.11) (2022-04-19)


### Features

* **select:** add ability to change empty item label ([#938](https://github.com/startupjs/startupjs/issues/938)) ([f89ea01](https://github.com/startupjs/startupjs/commit/f89ea019f3129a03cce56e33a7a9f2a08b3c5db4))
* **ui/Select:** add ability to change empty value label ([#940](https://github.com/startupjs/startupjs/issues/940)) ([91ed975](https://github.com/startupjs/startupjs/commit/91ed975e9e4b12a0e220f1cb4a51257a9a7ff0f0))


### Reverts

* Revert "feat(select): add ability to change empty item label (#938)" (#939) ([b0bb7a0](https://github.com/startupjs/startupjs/commit/b0bb7a0a9d7be3aa9c411ffd9db9f9f4a9c8470d)), closes [#938](https://github.com/startupjs/startupjs/issues/938) [#939](https://github.com/startupjs/startupjs/issues/939)



## [0.44.10](https://github.com/startupjs/startupjs/compare/v0.44.9...v0.44.10) (2022-04-18)



## [0.44.9](https://github.com/startupjs/startupjs/compare/v0.44.8...v0.44.9) (2022-04-18)


### Bug Fixes

* return back localhost instead of 127.0.0.1 ([0501f6d](https://github.com/startupjs/startupjs/commit/0501f6dd0341eafdab0ca8991210846faa9bee75))



## [0.44.8](https://github.com/startupjs/startupjs/compare/v0.44.7...v0.44.8) (2022-04-14)


### Bug Fixes

* **auth-local/RegisterForm:** fix validation ([1325cf3](https://github.com/startupjs/startupjs/commit/1325cf381c6b5a63c1f1398212f0d0916bfda474))
* change mongo url from localhost to 127.0.0.1 (node 17+) ([3eef903](https://github.com/startupjs/startupjs/commit/3eef9036c6161de6bfc7937a4557cf10b174a080))


### Features

* **auth:** add more hooks ([#937](https://github.com/startupjs/startupjs/issues/937)) ([ce8ae58](https://github.com/startupjs/startupjs/commit/ce8ae58f6e37aaf8f10b74b5b0664b98ef4823b2))



## [0.44.7](https://github.com/startupjs/startupjs/compare/v0.44.6...v0.44.7) (2022-04-13)


### Features

* **ui/Radio:** do not render info block if there is no label ([#936](https://github.com/startupjs/startupjs/issues/936)) ([001a932](https://github.com/startupjs/startupjs/commit/001a932df739ae18a7f6af420dee2f27f61305d8))



## [0.44.6](https://github.com/startupjs/startupjs/compare/v0.44.5...v0.44.6) (2022-04-12)


### Bug Fixes

* **auth-local/RegisterForm:** close recaptcha only when it's enabled ([d560344](https://github.com/startupjs/startupjs/commit/d560344d7ddf049bd91dc057b445a7fa8615edfb))
* **recaptcha:** reset recaptcha with some delay because of bug in google script ([bd7b412](https://github.com/startupjs/startupjs/commit/bd7b412e946637e20dde6b53e71f1888a4e2894a))


### Features

* **auth:** add ability to override provider methods ([#929](https://github.com/startupjs/startupjs/issues/929)) ([efc6a36](https://github.com/startupjs/startupjs/commit/efc6a364374dee4c0da944e566f543e3bab63b3e))


### Reverts

* Revert "feat(auth): add ability to override provider methods (#929)" (#934) ([18a84b2](https://github.com/startupjs/startupjs/commit/18a84b27999869c641a7fff38089f2f0e71eaefc)), closes [#929](https://github.com/startupjs/startupjs/issues/929) [#934](https://github.com/startupjs/startupjs/issues/934)



## [0.44.5](https://github.com/startupjs/startupjs/compare/v0.44.4...v0.44.5) (2022-03-31)


### Bug Fixes

* **auth-lti:** fix package name in package.json ([704175b](https://github.com/startupjs/startupjs/commit/704175b048a4d065aeeb10868930d8f489deb4ba))


### Features

* **auth-lti:** add page to manage schools ([#930](https://github.com/startupjs/startupjs/issues/930)) ([1a8749f](https://github.com/startupjs/startupjs/commit/1a8749f9f7e89befb0410ccb17fec14c13efd31d))



## [0.44.4](https://github.com/startupjs/startupjs/compare/v0.44.3...v0.44.4) (2022-03-25)


### Bug Fixes

* **auth-lti:** add ability to pass redirect url ([#928](https://github.com/startupjs/startupjs/issues/928)) ([2c0dd60](https://github.com/startupjs/startupjs/commit/2c0dd60ef4f7db9917bc7a47412ec956fa84e5b6))
* **cli:** delete the deprecated '--inspect' log because the package cannot use `NODE_OPTIONS` ([bfde808](https://github.com/startupjs/startupjs/commit/bfde80819222fbc2a9d1b955657b92bb27b50c2b))


### Features

* **auth-lti:** add ability to link account ([#927](https://github.com/startupjs/startupjs/issues/927)) ([f204fa8](https://github.com/startupjs/startupjs/commit/f204fa8ebe127410f756515a142bb1542bc36b40))



## [0.44.3](https://github.com/startupjs/startupjs/compare/v0.44.2...v0.44.3) (2022-03-22)


### Features

* **auth-lti:** add auth lti strategy ([#925](https://github.com/startupjs/startupjs/issues/925)) ([abd53f6](https://github.com/startupjs/startupjs/commit/abd53f6c40818128e47ce3c6c9ca72ce76a5422c))



## [0.44.2](https://github.com/startupjs/startupjs/compare/v0.44.1...v0.44.2) (2022-03-22)


### Bug Fixes

* **ui/Input:** change 'focus' state when input becomes readonly or disabled ([7c3a07f](https://github.com/startupjs/startupjs/commit/7c3a07f7bd2f1cc678bc32e6388409a6181c487a))


### Features

* **auth:** handling google auth token error ([#922](https://github.com/startupjs/startupjs/issues/922)) ([259cbf2](https://github.com/startupjs/startupjs/commit/259cbf2aff51f211c58dc33ef177ef9ac4f89d2b))
* **ui/DateTimePicker:** add ability to controll visibility ([#919](https://github.com/startupjs/startupjs/issues/919)) ([2d1f4d9](https://github.com/startupjs/startupjs/commit/2d1f4d98b929988cf9fcfa8bd5d56eaa1a14ba7b))



## [0.44.1](https://github.com/startupjs/startupjs/compare/v0.44.0...v0.44.1) (2022-03-15)


### Bug Fixes

* **ui/Input:** pass 'readonly' and 'disabled' props to the target input ([818279e](https://github.com/startupjs/startupjs/commit/818279efdf3ae76efb720c7a32b14884914963f4))



# [0.44.0](https://github.com/startupjs/startupjs/compare/v0.43.8...v0.44.0) (2022-03-14)


## RELEASE NOTES

**No** breaking changes

Fix multiple `useValue` hook initialization at each rendering. Now the hook works like `useState` in react.

```js
const [value, $value] = useValue(Math.random())

return pug`
  Button(onPress=() => $value.set(value + 1)) Increment
`
```

In this example, the `value` did not increase when the button was clicked because the next initialization was performed with a new `Math.random()` value.



## [0.43.8](https://github.com/startupjs/startupjs/compare/v0.43.7...v0.43.8) (2022-03-14)


### Bug Fixes

* **ui/Input:** fix passing  to object and array inputs ([5617601](https://github.com/startupjs/startupjs/commit/5617601c6478a48109171bcf81dd2e8347e03413))



## [0.43.7](https://github.com/startupjs/startupjs/compare/v0.43.6...v0.43.7) (2022-03-11)


### Bug Fixes

* **routes-middleware:** fix duplicating websocket connection ([#920](https://github.com/startupjs/startupjs/issues/920)) ([d6a4e24](https://github.com/startupjs/startupjs/commit/d6a4e24fa69abc965ec4b036aeb93d0b98f65310))
* **ui/Div:** pass missing 'event' to press handlers ([13c8d35](https://github.com/startupjs/startupjs/commit/13c8d35e510a4086e4c2789f183cb80a9fa2e567))



## [0.43.6](https://github.com/startupjs/startupjs/compare/v0.43.5...v0.43.6) (2022-03-10)


### Bug Fixes

* **ui/Input:** fix 'readonly' view of label ([5ca66e6](https://github.com/startupjs/startupjs/commit/5ca66e6425e9043b71b383e86046c2e2592650a2))
* **ui/Input:** prevent passing redundant props to inputs ([41664a4](https://github.com/startupjs/startupjs/commit/41664a444ece560369ddbb88987d1afd2388c33a))


### Features

* **ui/Div:** move tooltip to separate hook ([#918](https://github.com/startupjs/startupjs/issues/918)) ([74dac21](https://github.com/startupjs/startupjs/commit/74dac2193b058cfff6341fc39574447c5ddb24d6))



## [0.43.5](https://github.com/startupjs/startupjs/compare/v0.43.4...v0.43.5) (2022-02-24)


### Bug Fixes

* **ui/DateTimePicker:** don't close the picker when the blur event is fired ([554449d](https://github.com/startupjs/startupjs/commit/554449dbad4269ee497e9c7c79730698c7e37b04))
* **ui/NumberInput:** add indent for 'units' on readonly mode ([#916](https://github.com/startupjs/startupjs/issues/916)) ([3c98190](https://github.com/startupjs/startupjs/commit/3c981901332d291848696371be558794fe313cdb))



## [0.43.4](https://github.com/startupjs/startupjs/compare/v0.43.3...v0.43.4) (2022-02-22)


### Bug Fixes

* **ui/NumberInput:** add readonly view ([#912](https://github.com/startupjs/startupjs/issues/912)) ([63e3a0f](https://github.com/startupjs/startupjs/commit/63e3a0fe202680e59a0c70729fb99dc8768b5ebf))



## [0.43.3](https://github.com/startupjs/startupjs/compare/v0.43.2...v0.43.3) (2022-02-21)


### Bug Fixes

* **backend:** downgrade 'redlock' version because of issue [#65](https://github.com/startupjs/startupjs/issues/65) in 'redlock' library ([6adacbb](https://github.com/startupjs/startupjs/commit/6adacbb8c324add74aea2d23c74067b820ef9831))



## [0.43.2](https://github.com/startupjs/startupjs/compare/v0.43.1...v0.43.2) (2022-02-18)


### Bug Fixes

* **ui/forms:** improve interaction ([#904](https://github.com/startupjs/startupjs/issues/904)) ([640115c](https://github.com/startupjs/startupjs/commit/640115c91ecc6acf349624de4b6370da5dbaacb6))



## [0.43.1](https://github.com/startupjs/startupjs/compare/v0.43.0...v0.43.1) (2022-02-16)


### Bug Fixes

* **ui/NumberInput:** fix bug related to set zero when value is empty string ([5b6ca14](https://github.com/startupjs/startupjs/commit/5b6ca1464a17f4faf3e9a2573b316217b4648555))



# [0.43.0](https://github.com/startupjs/startupjs/compare/v0.42.20...v0.43.0) (2022-02-14)


### Release Notes

**No** breaking changes

Added automatic caching for styles and creation of scoped models during react render.

This is considered to be an experimental feature. By default it's turned `OFF` so nothing should break whatsoever.

To turn in `ON`, pass `observerCache: true` to the `startupjs` preset in `babel.config.js`:

```js
    ['startupjs/babel.cjs', {
      ...,
      observerCache: true
    }]
```

To make sure caching is enabled, check the value of `window.__startupjs__.DEBUG.cacheEnabled` in browser console.

Cache will be enabled for all components. You can explicitly prohibit a specific component from using cache by passing `{ cache: false }` to its `observer()`:

```js
export default observer(function Test ({ frequentlyChangedRandomColor }) {
  return pug`
    Div(style={ backgroundColor: frequentlyChangedRandomColor })
  `
}, { cache: false })
```

After enabling caching you must carefully test your whole application because some components might have been relying on excessive renderings to function properly. So you might have to fix some things in your codebase to account for optimized rerenders.

Examples:

1. cache pure `style`. This will only work if you have `observer` imported in the current file, this way we don't screw up the 3rd-party libraries which don't use startupjs.
    ```js
    export default observer(function Test () {
      return pug`
        Div(style={ backgroundColor: 'red' })
      `
    })
    ```

1. cache pure `styleName` or any combination of `part`, `style`, `*Style`, `*StyleName`
    ```js
    export default observer(function Test () {
      return pug`
        Div.div
      `
      styl`
        .div
          background-color red
      `
    })
    ```

1. cache scoped model created with `.at()` and `.scope()`
    ```js
    export default observer(function Games () {
      const [games, $games] = useQuery('games', { active: true })
      return pug`
        each game in games
          Game($game=$games.at(game.id))
      `
    })
    const Game = observer(({ $game }) => {
      const game = $game.get()
      return pug`
        Span= game.title
      `
    })
    ```

The last example is especially important since writing code in this way simplifies code a lot in many places. Now you can (and should) pass models whenever possible to child components as arguments, instead of passing an `id` and using `useDoc` or `useLocalDoc`.

Earlier in situations when you run `useQuery` in the parent component and then render each item as a separate component the only way to do it easily and properly was to pass an item id and then do a `useLocalDoc`. And you had to use `useLocalDoc`, otherwise `useDoc` will create an additional doc-only subscription and wait for it. Now this usecase is handled for you automatically, you just create a scoped model for the item inline using `$items.at(item.id)` and pass it as `$item` into the child component.

So this change alone will save you from making extra queries in many situations and will make the code easier to follow and more performant overall.


### Bug Fixes

* **babel-plugin-rn-styrename-to-style:** default useImport to true ([c5e312e](https://github.com/startupjs/startupjs/commit/c5e312e773c712244941fe84ef13e1cac531c829))


### Features

* implement caching for styles (TODO for model). Rewrite observer loader to babel. Add debug module and debug babel plugin to debug memory leaks in observer() ([#890](https://github.com/startupjs/startupjs/issues/890))



## [0.42.20](https://github.com/startupjs/startupjs/compare/v0.42.19...v0.42.20) (2022-02-08)


### Bug Fixes

* **auth-local:** fix lastname setter ([#887](https://github.com/startupjs/startupjs/issues/887)) ([04bc442](https://github.com/startupjs/startupjs/commit/04bc4428d39b3f01bbee78044214a19f99d208e8))
* **bundler:** make alive css-modules for .css files ([#888](https://github.com/startupjs/startupjs/issues/888)) ([2215b51](https://github.com/startupjs/startupjs/commit/2215b5159e8d760ce7a68db769a0ab9f7faf6266))



## [0.42.19](https://github.com/startupjs/startupjs/compare/v0.42.18...v0.42.19) (2022-02-05)


### Bug Fixes

* **ui/Input:** fix whitespace of description and error when description is on 'top' in 'rows' -- in ObjectInput and ArrayInput ([0a9f900](https://github.com/startupjs/startupjs/commit/0a9f900cb27cfd14d877d16befdbf519b78f19c8))



## [0.42.18](https://github.com/startupjs/startupjs/compare/v0.42.17...v0.42.18) (2022-02-04)


### Bug Fixes

* **backend:** replace used conf vars to process vars ([#885](https://github.com/startupjs/startupjs/issues/885)) ([69aba6b](https://github.com/startupjs/startupjs/commit/69aba6b4f895c53e9e05a5c4e737276ebdc03e81))



## [0.42.17](https://github.com/startupjs/startupjs/compare/v0.42.16...v0.42.17) (2022-02-04)


### Bug Fixes

* **ui/DateTimePicker:** don't show the date in the text input, when it is `undefined` ([#886](https://github.com/startupjs/startupjs/issues/886)) ([450304a](https://github.com/startupjs/startupjs/commit/450304acfaaa3ec0323360cae8575636778fd286))



## [0.42.16](https://github.com/startupjs/startupjs/compare/v0.42.15...v0.42.16) (2022-02-02)


### Bug Fixes

* **app:** fix back button redirect url ([#881](https://github.com/startupjs/startupjs/issues/881)) ([52b0d89](https://github.com/startupjs/startupjs/commit/52b0d8965c81b33accba500844931701c664e1a4))
* **auth-local:** prevent crashing app because of missing `recaptchaRef` on `onSubmit` method when use `renderActions` ([#884](https://github.com/startupjs/startupjs/issues/884)) ([bab8b87](https://github.com/startupjs/startupjs/commit/bab8b8775a72e19436c6f2afc3fd74d1e3f7e476))



## [0.42.15](https://github.com/startupjs/startupjs/compare/v0.42.14...v0.42.15) (2022-01-31)


### Bug Fixes

* **ui/Menu:** Allow using Menu.Item without wrapping it into Menu. Fix icon color of Menu.Item ([8442915](https://github.com/startupjs/startupjs/commit/8442915c9c9012b671eef7a44212f63abd4c1809))



## [0.42.14](https://github.com/startupjs/startupjs/compare/v0.42.13...v0.42.14) (2022-01-30)


### Features

* **ui/Content:** change default max-width to 'tablet' ([48ec823](https://github.com/startupjs/startupjs/commit/48ec823bf69cee31beb346a1979346874673b8f6))



## [0.42.13](https://github.com/startupjs/startupjs/compare/v0.42.12...v0.42.13) (2022-01-30)


### Features

* **ui/Div, ui/Span:** Add 'full' convenience-prop which gives 'flex: 1' to the element. Useful for quickly building layouts together with Row. ([fa1b3e5](https://github.com/startupjs/startupjs/commit/fa1b3e53362a3c760bc68809481f85042d733dc4))



## [0.42.12](https://github.com/startupjs/startupjs/compare/v0.42.11...v0.42.12) (2022-01-30)


### Features

* **ui/ObjectInput:** Add 'row' flag to show nested inputs in a row ([b784b4d](https://github.com/startupjs/startupjs/commit/b784b4d7a6f0d0647a7fa73d47e46ebd1622b189))



## [0.42.11](https://github.com/startupjs/startupjs/compare/v0.42.10...v0.42.11) (2022-01-30)


### Bug Fixes

* **ui/Menu:** pass props to the underlying Div ([fe98ec5](https://github.com/startupjs/startupjs/commit/fe98ec5ebd8dfcac6f8e97bb5645358039568b2d))



## [0.42.10](https://github.com/startupjs/startupjs/compare/v0.42.9...v0.42.10) (2022-01-29)


### Bug Fixes

* **ui/Item:** fix missing Item -- re-export it in @startupjs/ui ([3857beb](https://github.com/startupjs/startupjs/commit/3857bebdd7876370264a2d064d378d8d5c95aa32))



## [0.42.9](https://github.com/startupjs/startupjs/compare/v0.42.8...v0.42.9) (2022-01-29)


### Bug Fixes

* **react-sharedb-hooks:** re-import model-hooks. This fixes previous patch version. ([5d38fd6](https://github.com/startupjs/startupjs/commit/5d38fd6166e5870bf4e22166a5d2f740b3806c93))



## [0.42.8](https://github.com/startupjs/startupjs/compare/v0.42.7...v0.42.8) (2022-01-29)


### Features

* **react-sharedb-hooks:** Add model-only hooks alternatives for each hook which returns scoped model as a second param. See [react-sharedb-hooks readme](https://github.com/startupjs/startupjs/tree/master/packages/react-sharedb-hooks#optimizing-rerenders-with--hooks) for documentation. ([29ee41c](https://github.com/startupjs/startupjs/commit/29ee41c3bf85d942da7febb0bdedb6315a20f827))

    Before (leads to re-renders):

    ```js
    const [, $visible] = useValue(false)
    ```

    After (no extra re-renders anymore):

    ```js
    const $visible = useValue$(false)
    ```

## [0.42.7](https://github.com/startupjs/startupjs/compare/v0.42.6...v0.42.7) (2022-01-29)


### Features

* support running without MongoDB when no MONGO_URL specified or when NO_MONGO is passed. Mingo is used instead ([9b71429](https://github.com/startupjs/startupjs/commit/9b7142930e0c78b6468c99ad9d8d2ee983dc34b1))



## [0.42.6](https://github.com/startupjs/startupjs/compare/v0.42.5...v0.42.6) (2022-01-29)


### Dependencies

* upgrade racer, sharedb, sharedb-mongo, racer-highway to newer version. Upgrade mongodb driver to v4 ([11bcc46](https://github.com/startupjs/startupjs/commit/11bcc4676d3575da6bb42147e2d71f93be3b2cf9))

### Bug Fixes

* **ui/Icon:** use pure react version of fontawesome on web. This fixes errors in console about unsupported attributes. ([624c85d](https://github.com/startupjs/startupjs/commit/624c85de381422d61a7009ebdc5477dc877376a5))



## [0.42.5](https://github.com/startupjs/startupjs/compare/v0.42.4...v0.42.5) (2022-01-25)


### Features

* **backend:** pass more params to 'backend' event ([e908bc8](https://github.com/startupjs/startupjs/commit/e908bc8a191dd700b68aa19dbc1ddbefc3b82b37))



## [0.42.4](https://github.com/startupjs/startupjs/compare/v0.42.3...v0.42.4) (2022-01-25)


### Bug Fixes

* **worker:** init executor sync ([398b3bd](https://github.com/startupjs/startupjs/commit/398b3bdeb5ffc20191eb7f16655e1c878939c761))



## [0.42.3](https://github.com/startupjs/startupjs/compare/v0.42.2...v0.42.3) (2022-01-25)


### Bug Fixes

* **ui/NumberInput:** add margin only if units exist ([460be2e](https://github.com/startupjs/startupjs/commit/460be2e7fd67594b6d60556c12e555d9ed12faaa))



## [0.42.2](https://github.com/startupjs/startupjs/compare/v0.42.1...v0.42.2) (2022-01-25)



## [0.42.1](https://github.com/startupjs/startupjs/compare/v0.42.0...v0.42.1) (2022-01-21)


### Bug Fixes

* **react-shraredb-hooks:** fix ts types ([#879](https://github.com/startupjs/startupjs/issues/879)) ([8593fa7](https://github.com/startupjs/startupjs/commit/8593fa773c9fbc88e2f830230fde9cf86caf4733))
* **ui/Multiselect:** remove non-working checkbox and add icon instead, fix suggestions scroll ([#878](https://github.com/startupjs/startupjs/issues/878)) ([b718b06](https://github.com/startupjs/startupjs/commit/b718b06b3c632c43275be028aefaedb491703815))


### Features

* **ui/NumberInput:** add ability to display units ([#877](https://github.com/startupjs/startupjs/issues/877)) ([58d6056](https://github.com/startupjs/startupjs/commit/58d60563fd8119465d304d88809bf5c1ed83794d))
* **ui/Tag:** add `onIconPress` and `onSecondaryIconPress` props ([#868](https://github.com/startupjs/startupjs/issues/868)) ([9988a24](https://github.com/startupjs/startupjs/commit/9988a24aff0fce697863a4513e3de339d3172022))



# [0.42.0](https://github.com/startupjs/startupjs/compare/v0.41.5...v0.42.0) (2022-01-17)


### Release Notes

**No** breaking changes

Fix compilation of `web` mode for pure web projects


### Bug Fixes

* fix compilation for mode 'web' ([#876](https://github.com/startupjs/startupjs/issues/876)) ([548bbe0](https://github.com/startupjs/startupjs/commit/548bbe066f465f3bfb571154f237990a04ec78d5))
* **ui/TextInput:** Click through the icon if it doesn't have a handler ([d55f395](https://github.com/startupjs/startupjs/commit/d55f39528c0a1c7a8b2c4cb5145bf232866b91b1))



## [0.41.5](https://github.com/startupjs/startupjs/compare/v0.41.4...v0.41.5) (2022-01-12)


### Bug Fixes

* **routes-middleware:** add missing styles to page <head> for mode 'web' ([35a249c](https://github.com/startupjs/startupjs/commit/35a249cd3d85cdb10b37871fca7dfdf9e494ae27))
* **ui/Input:** fix setting value for broken inputs ([310a250](https://github.com/startupjs/startupjs/commit/310a2503287a8a79ea576d1e8be0ac3e7c1fc3ee))



## [0.41.4](https://github.com/startupjs/startupjs/compare/v0.41.3...v0.41.4) (2022-01-12)


### Bug Fixes

* **bundler:** fix incorrect postcss plugin usage ([6e6203d](https://github.com/startupjs/startupjs/commit/6e6203d6a4b5bbb229784a054d8130b99fa48225))



## [0.41.3](https://github.com/startupjs/startupjs/compare/v0.41.2...v0.41.3) (2022-01-12)


### Bug Fixes

* **ui/Modal:** pass missing props to content when use Modal.Content ([aebaef9](https://github.com/startupjs/startupjs/commit/aebaef9e8fcaa4044906ff326a65a1ee6211f133))



## [0.41.2](https://github.com/startupjs/startupjs/compare/v0.41.1...v0.41.2) (2022-01-12)


### Bug Fixes

* **auth-local/RegisterForm:** fix bug related to not clickable submit button when error happens ([1259bba](https://github.com/startupjs/startupjs/commit/1259bba9e411f70fe99feb549041bcb3137c99be))



## [0.41.1](https://github.com/startupjs/startupjs/compare/v0.41.0...v0.41.1) (2022-01-11)


### Features

* **mdx:** add 'bash' and 'sh' languages support to code blocks. Treat code blocks without language specified as 'txt' ([944fed8](https://github.com/startupjs/startupjs/commit/944fed86dceca663f84073236013646fe6d43d7a))



# [0.41.0](https://github.com/startupjs/startupjs/compare/v0.40.18...v0.41.0) (2022-01-11)


### Bug Fixes

* **auth-local/RegisterForm:** improve 'name' field error message ([370d474](https://github.com/startupjs/startupjs/commit/370d474cefb73311c1a9856607363cbc9f351de0))


### Features

* Improve TypeScript support ([#871](https://github.com/startupjs/startupjs/issues/871)) ([b1c9bf0](https://github.com/startupjs/startupjs/commit/b1c9bf043a45d4710e75cf69a3e36f275d57d94a))

### DEPRECATED

1. You should not use `pug` function without importing it anymore. Import it from `startupjs` module:

    ```js
    import React from 'react'
    import { pug, observer } from 'startupjs'
    import { Span } from '@startupjs/ui'

    export default observer(() => pug`
      Span Hello World
    `)
    ```

### BREAKING CHANGES

1. Update linter configuration to use new babel parser module

    1. Replace `babel-eslint` dependency with a new one. Run:

        ```bash
        yarn remove babel-eslint && yarn add -D @babel/eslint-parser
        ```

    2. Replace `"parser"` in your `.eslintrc.json`:

        ```js
        // replace line:
        "parser": "babel-eslint",
        // with the following:
        "parser": "@babel/eslint-parser",
        ```

1. For proper TypeScript support copy the following `tsconfig.json` file to the root of your project:

    [startupjs/packages/startupjs/templates/simple/tsconfig.json](https://github.com/startupjs/startupjs/blob/v0.41.0/packages/startupjs/templates/simple/tsconfig.json)


## [0.40.18](https://github.com/startupjs/startupjs/compare/v0.40.17...v0.40.18) (2022-01-11)


### Bug Fixes

* **ui/DateTimePicker:** reset seconds and milliseconds ([f475c47](https://github.com/startupjs/startupjs/commit/f475c4777268e3da36239fc9202a4ea836f55b1c))



## [0.40.17](https://github.com/startupjs/startupjs/compare/v0.40.16...v0.40.17) (2022-01-11)


### Bug Fixes

* **docker/deploy-aks:** remove env file on the last step if it was used ([b00a0d9](https://github.com/startupjs/startupjs/commit/b00a0d9109dfddddc6d2cfd8994e35e2ee046ec4))
* **ui/DateTimePicker:** add ability years dropdown, remove months and years views ([fdcda7a](https://github.com/startupjs/startupjs/commit/fdcda7a6d6cdd8702b40dcf10e9e86ff1f978d9a))
* **ui/DateTimePicker:** pass error to input component ([6b64c9a](https://github.com/startupjs/startupjs/commit/6b64c9ad60586173e9471e299a20a478a217f952))


### Features

* **docker/deploy-aks:** add bitbucket-pipelines.yml sample ([c06ae4a](https://github.com/startupjs/startupjs/commit/c06ae4a5121cde3237d840a43613854e02accc71))



## [0.40.16](https://github.com/startupjs/startupjs/compare/v0.40.15...v0.40.16) (2022-01-07)


### Bug Fixes

* **templates/simple:** use python3 in Dockerfile because there is no python in alpine anymore ([8acd46f](https://github.com/startupjs/startupjs/commit/8acd46f3e5973b25e4aa5b7bb5b7fffca87d5b45))



## [0.40.15](https://github.com/startupjs/startupjs/compare/v0.40.14...v0.40.15) (2022-01-07)


### Features

* **deploy:** Implement universal docker container for CI/CD to deploy to AKS ([#870](https://github.com/startupjs/startupjs/issues/870)) ([2b8e586](https://github.com/startupjs/startupjs/commit/2b8e586650a7e312b7dd5e73ba3f07172d52bed8))
* improve docker workflow for local development ([#869](https://github.com/startupjs/startupjs/issues/869)) ([e38137e](https://github.com/startupjs/startupjs/commit/e38137ebc637dea181b93ec725be3dd30922d159))



## [0.40.14](https://github.com/startupjs/startupjs/compare/v0.40.13...v0.40.14) (2021-12-30)


### Bug Fixes

* **ObjectInput/ArrayInput:** fix crashing native mobiles because of lazy import ([#865](https://github.com/startupjs/startupjs/issues/865)) ([e49b2c7](https://github.com/startupjs/startupjs/commit/e49b2c7636a745dc4717f28a1fea83770644e59c))



## [0.40.13](https://github.com/startupjs/startupjs/compare/v0.40.12...v0.40.13) (2021-12-24)


### Bug Fixes

* **ui/DrawerSidebar:** prevent infinite loop when open state chages several times in a short period of time ([102d92e](https://github.com/startupjs/startupjs/commit/102d92e4d93f894a13441d35e75f00724fa93e6b))



## [0.40.12](https://github.com/startupjs/startupjs/compare/v0.40.11...v0.40.12) (2021-12-23)


### Bug Fixes

* **ui/Input:** fix passing value for date inputs ([48de38f](https://github.com/startupjs/startupjs/commit/48de38f7d176f6787e9d3494a04563f21bd6a2bf))



## [0.40.11](https://github.com/startupjs/startupjs/compare/v0.40.10...v0.40.11) (2021-12-22)


### Bug Fixes

* **ui/Div:** fix tooltip selection typo ([1250395](https://github.com/startupjs/startupjs/commit/12503951c41ee663b0ba033bda42e89186fbeefb))



## [0.40.10](https://github.com/startupjs/startupjs/compare/v0.40.9...v0.40.10) (2021-12-22)


### Bug Fixes

* **ui/Input:** fix getting wrong property for input getter ([#867](https://github.com/startupjs/startupjs/issues/867)) ([6241dfb](https://github.com/startupjs/startupjs/commit/6241dfb1ec1749ba22e034ec3698444e90eacf00))



## [0.40.9](https://github.com/startupjs/startupjs/compare/v0.40.8...v0.40.9) (2021-12-21)


### Bug Fixes

* **ui/Modal:** DEPRECATE `onChange` property
* **ui/Badge:** dont display badge when label is typeof string with value 0 ([ac1c662](https://github.com/startupjs/startupjs/commit/ac1c6623bf99f889450e1e352c9f4ec22f46fe8e))
* **ui/DateTimePicker:** fix disappearing time items when scrolling ([#860](https://github.com/startupjs/startupjs/issues/860)) ([8d6fc42](https://github.com/startupjs/startupjs/commit/8d6fc425fc199bcfa12cbb03c7a01b290151c563))
* **ui/Input:** improve `onLabelPress` for inputs that have label   ([#855](https://github.com/startupjs/startupjs/issues/855)) ([2fd5178](https://github.com/startupjs/startupjs/commit/2fd51782b644c4043702e0ae43db79e295863386))
* **ui/Popover:** cut off outside content ([d3c9d41](https://github.com/startupjs/startupjs/commit/d3c9d4142986985d54e61c6cba0d5a12da4094c1))


### Features

* **app:** add ability to change blocked user view using `renderBlocked` property ([#859](https://github.com/startupjs/startupjs/issues/859)) ([71c37ca](https://github.com/startupjs/startupjs/commit/71c37cadf78463a74c8f10e74ee83e3b3efff7e0))
* **ui/Collapse:** inherit `react-native-collapsible` props ([#864](https://github.com/startupjs/startupjs/issues/864)) ([8edd897](https://github.com/startupjs/startupjs/commit/8edd8978c8a9aa80aaadcbc5b0ff872d9aba9e62))



## [0.40.8](https://github.com/startupjs/startupjs/compare/v0.40.7...v0.40.8) (2021-12-10)


### Bug Fixes

* **app:** do not set client error when `ERR_DOC_ALREADY_CREATED` sharedb error occurs ([#858](https://github.com/startupjs/startupjs/issues/858)) ([f70f87f](https://github.com/startupjs/startupjs/commit/f70f87f58945095a703b1d737f6c3d2f0626db66))
* **mdx:** implement support for blockquotes ([c83c145](https://github.com/startupjs/startupjs/commit/c83c145526153b7af0e18bd50290651ba1c6fa93))
* **ui/Tooltip:** DEPRECATE `renderTooltip` and remove redundant props ([#854](https://github.com/startupjs/startupjs/issues/854)) ([a071816](https://github.com/startupjs/startupjs/commit/a0718164b50981303a5bd5caf29344f5906f4e49))
* **ui:** add refs to `Carousel` children ([#857](https://github.com/startupjs/startupjs/issues/857)) ([428334a](https://github.com/startupjs/startupjs/commit/428334a57e748080e632a1c8ebfa96ffd7639d73))


### Features

* **ui/DateTimepicker:** deprecate renderContent propert, use renderInput property to customize input ([1453348](https://github.com/startupjs/startupjs/commit/145334879aad540c78e497ddf47de1db50af8297))



## [0.40.7](https://github.com/startupjs/startupjs/compare/v0.40.6...v0.40.7) (2021-12-01)


### Bug Fixes

* **auth-local:** make autocomplete better for login and register forms ([#828](https://github.com/startupjs/startupjs/issues/828)) ([70edbed](https://github.com/startupjs/startupjs/commit/70edbedfb59d2b2688a9a524d2be37987f5ba7c1))


### Features

* **ui/Radio:** add ability to display description for radio input option ([#853](https://github.com/startupjs/startupjs/issues/853)) ([4315c10](https://github.com/startupjs/startupjs/commit/4315c10ae242b2e4daacb773e39764271104046f))



## [0.40.6](https://github.com/startupjs/startupjs/compare/v0.40.5...v0.40.6) (2021-11-25)


### Bug Fixes

* **backend:** Use pure redis instead of redis-url. Update sharedb-redis-pubsub to latest ([7acb1bf](https://github.com/startupjs/startupjs/commit/7acb1bfaf9a99b0181d3e58d4ac02c79a1429a43))
* bring back process prefixes for 'npm start'. Had to disable webpack 'Progress' because of this though ([9f797e1](https://github.com/startupjs/startupjs/commit/9f797e1f43aa55b1b76478ca9c06ec175dc3da30))
* **ui/TextInput:** fix indent of secondary icon ([#851](https://github.com/startupjs/startupjs/issues/851)) ([db9b1cd](https://github.com/startupjs/startupjs/commit/db9b1cd566539fd9fc8ce3bde1e970a66a23849b))


### Features

* **backend:** Implement proper flushing of redis db, use prefix for redis keys in sharedb ([#852](https://github.com/startupjs/startupjs/issues/852)) ([964e33b](https://github.com/startupjs/startupjs/commit/964e33b8d430d592cb22645f13eb7e6a8ab190e2))



## [0.40.5](https://github.com/startupjs/startupjs/compare/v0.40.4...v0.40.5) (2021-11-24)


### Bug Fixes

* **MenuItem:** add ability to change text color ([6ab7232](https://github.com/startupjs/startupjs/commit/6ab7232826ecdca3e87c2f2e8ed1ac2b537237eb))



## [0.40.4](https://github.com/startupjs/startupjs/compare/v0.40.3...v0.40.4) (2021-11-24)


### Bug Fixes

* **recaptcha:** pass missing prop badge to render function ([54ee897](https://github.com/startupjs/startupjs/commit/54ee897b9877e4ef02118e0ca15d493104c2e2ee))



## [0.40.3](https://github.com/startupjs/startupjs/compare/v0.40.2...v0.40.3) (2021-11-22)


### Bug Fixes

* **auth-telegram:** add ability to pass custom callback url  ([#847](https://github.com/startupjs/startupjs/issues/847)) ([440b85e](https://github.com/startupjs/startupjs/commit/440b85e64ae3ecc503df3241cc72a189bc0b173b))
* **recaptcha:** add 'badge' to propType for mobile devices ([2fc0f66](https://github.com/startupjs/startupjs/commit/2fc0f66e4204cb3a19d4ae13449cd1082d5efb64))
* **ui/NumberInput:** change value if provided value is invalid ([3c5d74e](https://github.com/startupjs/startupjs/commit/3c5d74e4c0c0ad252681ed24305ab63b05bd4efa))
* **ui/Popover:** make vertical paddings bigger ([02d1b12](https://github.com/startupjs/startupjs/commit/02d1b121d78403a7b78719100102f5816ddca1fb))



## [0.40.2](https://github.com/startupjs/startupjs/compare/v0.40.1...v0.40.2) (2021-11-19)


### Bug Fixes

* **auth-local:** add indent before recaptcha ([fe38c7d](https://github.com/startupjs/startupjs/commit/fe38c7d910ce31ad339b6a6fe2ab696ea5c980f4))
* **ui/Alert:** pipe 'style' to root element ([b2b4b5a](https://github.com/startupjs/startupjs/commit/b2b4b5a1a0cbba2b09f0131bf84430e43a9ef0e5))
* **ui/DateTimePicker:** fix date format memoization ([90f63a6](https://github.com/startupjs/startupjs/commit/90f63a6248ba7e5ebbbdd3eeaaafe7e84bb44fa8))
* **ui/DateTimePicker:** remove horizontal time select for mobile devices ([36fb412](https://github.com/startupjs/startupjs/commit/36fb41261a343b2b43174224a88229863ae861ee))
* **ui/Div:** remove the ability to pass number type for 'renderTooltip' property ([#842](https://github.com/startupjs/startupjs/issues/842)) ([28e4045](https://github.com/startupjs/startupjs/commit/28e4045f429da310b1ccbaad14a964074be83588))
* **ui:** skip changing cursor style for native mobiles ([8eae554](https://github.com/startupjs/startupjs/commit/8eae55444efbb4dff6e35a7bfe1dbf27bf7dfba5))
* upgrade packages for webpack 5 ([e1f87e8](https://github.com/startupjs/startupjs/commit/e1f87e8cc15b5e63e8e648f228559532705220ea))


### Features

* **auth-local:** add ability to reposition the reCAPTCHA badge for RegisterForm ([4f25d60](https://github.com/startupjs/startupjs/commit/4f25d60f44b82ab0aeeddc10f4d4abcb1d99e06d))
* **recaptcha:** add ability to reposiion the reCAPTCHA badge ([e751964](https://github.com/startupjs/startupjs/commit/e751964c095db926187f2ab2754cd4a4a1998150))
* **ui/User:** add prop that controls number of description lines ([7b7adac](https://github.com/startupjs/startupjs/commit/7b7adaca8990c4ea368bd6d8a0f235b008eef785))



## [0.40.1](https://github.com/startupjs/startupjs/compare/v0.40.0...v0.40.1) (2021-11-12)


Dummy patch that publish v0.40.0 version because we forgot to merge the `next` branch before publish v0.40.0.



# [0.40.0](https://github.com/startupjs/startupjs/compare/v0.39.11...v0.40.0) (2021-11-12)


### Features

* upgrade to webpack 5 ([#831](https://github.com/startupjs/startupjs/issues/831)) ([23308c5](https://github.com/startupjs/startupjs/commit/23308c5de150fba478110da5fdc9d7f614bd234c))


### BREAKING CHANGES

1. You can't use named imports from `.json` files anymore. Instead import the whole json file and then do the manual destructuring:

    ```js
    // OLD
    import { BORDER_WIDTH, STRIPE_PUBLIC_KEY } from './constants.json'

    // NEW
    import CONSTANTS from './constants.json'
    const { BORDER_WIDTH, STRIPE_PUBLIC_KEY } = CONSTANTS
    ```

2. Webpack 5 changed the way it parses modules to use ESM modules wherever possible. Because of this some `default` imports from old CommonJS modules might be imported not directly but inside the `.default` field.

    If you receive errors from React that it can't render something because it received an `object` -- this probably means that you need to get your default import from `.default` field manually:

    ```js
    // OLD
    import DrawerLayout from 'react-native-drawer-layout-polyfill'

    // NEW
    import DrawerLayoutModule from 'react-native-drawer-layout-polyfill'
    const DrawerLayout = DrawerLayoutModule.default || DrawerLayoutModule
    ```

    Same goes for errors like `object is not a function` when your default import is actually expected to be a function. You'll have to do the same trick as above.


## [0.39.11](https://github.com/startupjs/startupjs/compare/v0.39.10...v0.39.11) (2021-11-12)


### Bug Fixes

* **ui/Checkbox:** fix incorrect usage of 'readonly' property ([#830](https://github.com/startupjs/startupjs/issues/830)) ([1f65b7a](https://github.com/startupjs/startupjs/commit/1f65b7aa138f867a95573d72b1b19fd05c069f71))


### Features

* **auth-telegram:** implement authentication on web ([#840](https://github.com/startupjs/startupjs/issues/840)) ([283b745](https://github.com/startupjs/startupjs/commit/283b74548a1f1c007a2bd34c31a26fd84ecf5b5d))



## [0.39.10](https://github.com/startupjs/startupjs/compare/v0.39.9...v0.39.10) (2021-10-28)


### Bug Fixes

* **auth:** fix find user by email ([0d3b9e5](https://github.com/startupjs/startupjs/commit/0d3b9e5e747494e52a2cbf5f9c7f404baf4b02c7))
* **ui/Input:** prevent checkbox label click when disabled ([78e7b40](https://github.com/startupjs/startupjs/commit/78e7b40e0d25b1236dec77f2c591537c46040308))


### Features

* **ui/Item:** add component ([#808](https://github.com/startupjs/startupjs/issues/808)) ([2e44540](https://github.com/startupjs/startupjs/commit/2e44540ca543a6aa26458c7bc0f8c326a8699d76))



## [0.39.9](https://github.com/startupjs/startupjs/compare/v0.39.8...v0.39.9) (2021-10-26)


### Bug Fixes

* **vite:** fix `vite-plugin-startupjs` extensions


## [0.39.8](https://github.com/startupjs/startupjs/compare/v0.39.6...v0.39.8) (2021-10-26)


### Bug Fixes

* **ui/Modal:** fix condition that checks usage way of component ([#826](https://github.com/startupjs/startupjs/issues/826)) ([399e2b3](https://github.com/startupjs/startupjs/commit/399e2b368a717233cd66e888349633fc5dfb97ed))


### Features

* **vite-plugin-startupjs:** Rewrite vite plugin for the latest stable vite version ([#827](https://github.com/startupjs/startupjs/issues/827)) ([bc556b0](https://github.com/startupjs/startupjs/commit/bc556b0961ab7616eb6a4e1731cb4900114fed07))



## [0.39.6](https://github.com/startupjs/startupjs/compare/v0.39.5...v0.39.6) (2021-10-24)


### Bug Fixes

* add 'react-native-gesture-handler' to peer dependencies of ui and to cli ([bce4099](https://github.com/startupjs/startupjs/commit/bce40995be1e71e489be6e3c2102630504b8c7b7))



## [0.39.5](https://github.com/startupjs/startupjs/compare/v0.39.4...v0.39.5) (2021-10-21)


### Bug Fixes

* **ui/Div:** better check of `renderTooltip` ([#819](https://github.com/startupjs/startupjs/issues/819)) ([1ab951b](https://github.com/startupjs/startupjs/commit/1ab951b64820882eeea72cfd850aa687abd625e4))
* **ui/Modal:** fix height of `fullscreen` variant ([#823](https://github.com/startupjs/startupjs/issues/823)) ([13ab19f](https://github.com/startupjs/startupjs/commit/13ab19f13682812db3a5d12cbd0b3bf3d620db5c))
* **ui/Multiselect:** fix option `key` prop value ([#815](https://github.com/startupjs/startupjs/issues/815)) ([3312853](https://github.com/startupjs/startupjs/commit/3312853f6eca8688a66263ef0317c5e1ffef2379))
* **ui/NumberInput:** check if value is null or undefined ([b679cc9](https://github.com/startupjs/startupjs/commit/b679cc9262a33ca77becbe2cdbd278eeb51e0453))


### Features

* **backend:** add 'pollDebounce' option to reduce load on the database ([8c5cd9f](https://github.com/startupjs/startupjs/commit/8c5cd9f36c7f8857f0dce5f25f0a17f32c5a237e))
* **dnd:** add basic support ([#600](https://github.com/startupjs/startupjs/issues/600)) ([9f273e1](https://github.com/startupjs/startupjs/commit/9f273e1a73420ac1006ab4530d5d273fb2224211))



## [0.39.4](https://github.com/startupjs/startupjs/compare/v0.39.3...v0.39.4) (2021-10-16)


### Bug Fixes

* **bundler:** Remove observer replacer from .mdx chain in 'web' webpack since state of components in .mdx is lost on hot reloading in any case, so there is no benefit in having it. ([520f2ca](https://github.com/startupjs/startupjs/commit/520f2ca135d69b2574658da5070f7c5031da1b40))
* **ui/AutoSuggest:** prevent automatically dismiss keyboard  ([#810](https://github.com/startupjs/startupjs/issues/810)) ([7e4b0dd](https://github.com/startupjs/startupjs/commit/7e4b0dd33a0bb71a3c74400bbb0375482c914716))


### Features

* **babel-plugin-rn-stylename-to-style:** do JSON.parse() When styles are imported as a JSON string (for example in Vite) ([#813](https://github.com/startupjs/startupjs/issues/813)) ([ee34332](https://github.com/startupjs/startupjs/commit/ee343328fcbf8ea08e6dad416c0909feb6624ac5))
* **ui/Radio:** add ability to display radio button in row ([38b0397](https://github.com/startupjs/startupjs/commit/38b03977c5fbdf90bc97161ada044f8065fa7f19))



## [0.39.3](https://github.com/startupjs/startupjs/compare/v0.39.2...v0.39.3) (2021-10-01)


### Bug Fixes

* **ui/Input:** prevent checkbox label click when disabled ([0eea489](https://github.com/startupjs/startupjs/commit/0eea4899df55b3c271efc5310fe080e127eede4b))


### Features

* **app:** add prevUrl to '' ([004067a](https://github.com/startupjs/startupjs/commit/004067a969a32bd84f1d2957990e947c3c94ca30))



## [0.39.2](https://github.com/startupjs/startupjs/compare/v0.39.1...v0.39.2) (2021-09-23)


### Bug Fixes

* **ui/TextInput:** fix using a broken focus handler ([e49a786](https://github.com/startupjs/startupjs/commit/e49a7867bf9c104da4b5564386fd4e9d2ba2e730))



## [0.39.1](https://github.com/startupjs/startupjs/compare/v0.39.0...v0.39.1) (2021-09-22)


### Bug Fixes

* **ui/Input:** fix passing ref to target input component ([5a5bb9c](https://github.com/startupjs/startupjs/commit/5a5bb9cc8a369fa7e83b3d15d4b3b4c2e678ef19))



# [0.39.0](https://github.com/startupjs/startupjs/compare/v0.38.5...v0.39.0) (2021-09-21)


### Bug Fixes

* **hooks/useBind:** remove `default` property ([73ea6ec](https://github.com/startupjs/startupjs/commit/73ea6ec2efcf07197f1cb7e29b8077df394ed91f))
* **mdx:** fix warning of broken styles ([31c41b4](https://github.com/startupjs/startupjs/commit/31c41b451cb9220bbfaf2ccab4ddc65e7a32fdb4))
* **Popover:** fix detection of usage method ([996afbe](https://github.com/startupjs/startupjs/commit/996afbedbcdc251e160672636e2e303844c6d030))
* **ui:** remove breaking 'useCallback' from components ([581c5c7](https://github.com/startupjs/startupjs/commit/581c5c7decee49fa076ad349f174eff28f9393a4))
* **ui/AbstractPopover:** add z-index ([b3327ca](https://github.com/startupjs/startupjs/commit/b3327ca135ae254367186865261d969994314719))
* **ui/DateTimepicker:** display placeholder if not value and prevent editable input ([9423cad](https://github.com/startupjs/startupjs/commit/9423cad366190778cbe475412d004cf04f60714d))
* **ui/DateTimePicker:** fix opening on native ([c090881](https://github.com/startupjs/startupjs/commit/c090881b26914d96d365b0b0947af409f0ab8f90))
* **ui/DateTimePicker:** fix the bug related to inability to switch years ([d04e34f](https://github.com/startupjs/startupjs/commit/d04e34f6444bdbc38fbb00ff7ac0ca5887f5f5ea))
* **ui/DateTimePicker:** pass props to render content function ([fb61dd9](https://github.com/startupjs/startupjs/commit/fb61dd98f195439f65ea578c25707c8c9fac4c6d))
* **ui/DeprecatedPopover:** fix portal crashing when component is unmounted ([6e81fe4](https://github.com/startupjs/startupjs/commit/6e81fe4571169188aa81f2c895ba4c311f53e492))
* **ui/Div:** extend tooltip properties ([18a78a2](https://github.com/startupjs/startupjs/commit/18a78a20ca51be8ffd89ae9a1c9db8ef3bdc518e))
* **ui/Modal:** fix crashing app when close modal without closing popups ([6312625](https://github.com/startupjs/startupjs/commit/6312625cff5768cb761b5a78936652085986706c))
* **ui/Popover:** prevent crashing when 'renderContent' is not passed ([50b12f9](https://github.com/startupjs/startupjs/commit/50b12f9bffc4602dfcd28d5ebbbd43303eadc835))
* **ui/Portal:** fix elements order ([#806](https://github.com/startupjs/startupjs/issues/806)) ([fea800b](https://github.com/startupjs/startupjs/commit/fea800bf5a6cdaa3219c0e664c4e25964d1b82c6))
* **ui/TextInput:** fix focus and blur handlers ([4652ee5](https://github.com/startupjs/startupjs/commit/4652ee56a7a1bff079291c8fccb300e618023190))


### BREAKING CHANGES

* **hooks/useBind:** The `default` property was removed because it does not make any sense considering that it also worked incorrectly. If you used it then fix it by declaring the value manually after calling the hook.



## [0.38.5](https://github.com/startupjs/startupjs/compare/v0.38.4...v0.38.5) (2021-09-15)


### Bug Fixes

* **babel-preset-startupjs:** pass options to babel-plugin-i18n-extract ([e42c87b](https://github.com/startupjs/startupjs/commit/e42c87b6ee497729e5a289f778c89768cb6a4b8d))
* **ui/AbstractPopover:** fix geometry calculation ([1e93ed2](https://github.com/startupjs/startupjs/commit/1e93ed2b4db9166e2525e35e78f46c19d7c5a5c2))
* **ui/Modal:** standardize usage ways ([b070c48](https://github.com/startupjs/startupjs/commit/b070c48d656c0972b8c9619094546147e2ba5d13))
* **ui/Popover:** standardize usage ways ([c4496b3](https://github.com/startupjs/startupjs/commit/c4496b3821e0281e169ff06bb3f750cc7deb01a8))
* **ui/useBind:** fix check of empty value ([9a9fbdd](https://github.com/startupjs/startupjs/commit/9a9fbdd89b477ffb8751b5b34364b4d5dfc4a4f8))



## [0.38.4](https://github.com/startupjs/startupjs/compare/v0.38.3...v0.38.4) (2021-09-13)

* **ui/DateTimePicker:** deprecate `renderCaption`, use `renderContent` instead


## [0.38.3](https://github.com/startupjs/startupjs/compare/v0.38.2...v0.38.3) (2021-09-13)


### Bug Fixes

* **babel-preset-startupjs:** add i18n plugin for native mobiles and collect translations only for web build ([26edfe6](https://github.com/startupjs/startupjs/commit/26edfe6a3e3683729dccdfff27a7e30bd500f95f))
* **i18n:** encode dot in key param of 't' function ([0864cee](https://github.com/startupjs/startupjs/commit/0864cee3d7c1cbf0d1138f0de7d013c393e991ab))
* **i18n:** fix broken usage of 'languageDetector' ([23360d8](https://github.com/startupjs/startupjs/commit/23360d8f22caa4a495e21663349077eba75ac5ae))
* **i18n:** reload a page when change language ([00deb80](https://github.com/startupjs/startupjs/commit/00deb80837a843cec5e954b8e13fdd5f98aeb758))
* **ui/DateTimePicker:** remove redundant label property ([122fc2c](https://github.com/startupjs/startupjs/commit/122fc2cfcc20dcacfdd277cb3467fd4bfa8ebbe7))
* **ui/Popover:** remove redundant padding ([04fa3aa](https://github.com/startupjs/startupjs/commit/04fa3aa5dd8543e2db7b90b862f4ea78a8cd8791))


### Features

* **babel-plugin-i18n-extract:** collect translations for all extensions ([769978c](https://github.com/startupjs/startupjs/commit/769978c6d8bf081466f2fb77c09341e3f94bae4f))
* **docs:** add ability to pass extra parameters to `Sandbox` for comonent properties ([#799](https://github.com/startupjs/startupjs/issues/799)) ([f54f5ac](https://github.com/startupjs/startupjs/commit/f54f5ac23378baf5feb512fd8b5ee763311e8165))



## [0.38.2](https://github.com/startupjs/startupjs/compare/v0.38.1...v0.38.2) (2021-09-06)


### Bug Fixes

* **app:** fix incorrect route update when change url ([8220ec3](https://github.com/startupjs/startupjs/commit/8220ec38f6cfccc9d978c0469a8374582952829f))
* **auth:** change error messages for password recovery ([#793](https://github.com/startupjs/startupjs/issues/793)) ([3871103](https://github.com/startupjs/startupjs/commit/38711031db9095826aa67b8276644fcbfc4b026a))
* **babel-plugin-rn-stylename-inline:** prevent build crashing when there are no other imports except `styl` ([#778](https://github.com/startupjs/startupjs/issues/778)) ([48c9261](https://github.com/startupjs/startupjs/commit/48c926129a9cf110fdee0bf09ff8884276516f64))
* **ui/Sidebar:** fix typo of incorrect name for `disabled` property in `propTypes` validation ([#789](https://github.com/startupjs/startupjs/issues/789)) ([f3a4aa0](https://github.com/startupjs/startupjs/commit/f3a4aa0272d8769d34190629cc62520cb17eed4c))
* **ui/Input:** add two-way data binding for `date`, `datetime` and `time` types ([#795](https://github.com/startupjs/startupjs/issues/795)) ([68d1441](https://github.com/startupjs/startupjs/commit/68d1441855379111d641370cf1f6e39e8b40815e))
* **ui/NumberInput:** fix `step` property and validation of initial value ([#787](https://github.com/startupjs/startupjs/issues/787)) ([6b5e4a7](https://github.com/startupjs/startupjs/commit/6b5e4a71356eba3d9f74107148aba64749ef503e))
* **ui/NumberInput:** fix validation of `max` and `min` properties ([#794](https://github.com/startupjs/startupjs/issues/794)) ([79fd26e](https://github.com/startupjs/startupjs/commit/79fd26ec8594eb00b019cb0d66c3398a4fca82a2))
* **ui/Select:** add ability to work with objects ([#797](https://github.com/startupjs/startupjs/issues/797)) ([da3374e](https://github.com/startupjs/startupjs/commit/da3374eece5066d90ce080fb02180f94589f5640))



## [0.38.1](https://github.com/startupjs/startupjs/compare/v0.38.0...v0.38.1) (2021-08-27)


### Bug Fixes

* **docs:** fix IconSelect ([#786](https://github.com/startupjs/startupjs/issues/786)) ([d5e3955](https://github.com/startupjs/startupjs/commit/d5e395570ea4b8592ece4eeb4543cfedf77e3c4d))
* **ui/dialogs:** fix error displaying in prompt ([#783](https://github.com/startupjs/startupjs/issues/783)) ([7266baa](https://github.com/startupjs/startupjs/commit/7266baa5b8440e12ab2e79b6177111b1de6a6ab4))
* **ui/Input:** fix types 'select', 'multiselect' ([#785](https://github.com/startupjs/startupjs/issues/785)) ([131a828](https://github.com/startupjs/startupjs/commit/131a828ab1ba3e6b24a3e5a750d1503dd81d457a))



# [0.38.0](https://github.com/startupjs/startupjs/compare/v0.37.8...v0.38.0) (2021-08-26)


### Bug Fixes

* **app:** move dialogs to ui library ([#714](https://github.com/startupjs/startupjs/issues/714)) ([ba66a1a](https://github.com/startupjs/startupjs/commit/ba66a1a0df43d9f96b261c18eda286e273ed8e1a))
* **ui:** update `react-native-collapsible` ([040a945](https://github.com/startupjs/startupjs/commit/040a945f99436235e3b6b107f978792076275e8c))
* **ui/Collapse:** remove default shadow ([cbfa85a](https://github.com/startupjs/startupjs/commit/cbfa85ae7c368b40467c8d8a8382f0921db5a7a7))


### Features

* **backend:** deny access to db by default ([#703](https://github.com/startupjs/startupjs/issues/703)) ([247d066](https://github.com/startupjs/startupjs/commit/247d066d322c2b66183e62f05b53dfea88bbec21))
* **ui/Popover:** rework comonent api ([#684](https://github.com/startupjs/startupjs/issues/684)) ([eb1bada](https://github.com/startupjs/startupjs/commit/eb1bada098cd5db94557251e62fc0fdafddad512))
* **ui/Tooltip:** deprecate popover and tooltip current api ([#768](https://github.com/startupjs/startupjs/issues/768)) ([002c60e](https://github.com/startupjs/startupjs/commit/002c60e8a6241b7f3fd3e1e19aacb57ab1ce1c8f))


### ref

* **ui/DatePicker:** timezone ([#701](https://github.com/startupjs/startupjs/issues/701)) ([8c95184](https://github.com/startupjs/startupjs/commit/8c951848b54afde18d6248b65df82aea58722bf9))


### BREAKING CHANGES

* [See 0.38 migration guide](/docs/migration-guides/0.38.md)



## [0.37.8](https://github.com/startupjs/startupjs/compare/v0.37.7...v0.37.8) (2021-08-24)


### Bug Fixes

* **mdx:** fix highlighting of sublanguages (styl, css, pug) ([#765](https://github.com/startupjs/startupjs/issues/765)) ([8002081](https://github.com/startupjs/startupjs/commit/800208108a65cd6717b5fff3cae1f0ae05a2208f))
* **ui/Input:** fix bug related to crash when use 'object' or 'array' inputs ([#777](https://github.com/startupjs/startupjs/issues/777)) ([b92f456](https://github.com/startupjs/startupjs/commit/b92f4566840de32d1c8d715afeb9004eb63eb587))
* **ui/uiAppPlugin:** move to root from helpers ([#774](https://github.com/startupjs/startupjs/issues/774)) ([41e6b4f](https://github.com/startupjs/startupjs/commit/41e6b4f7445a440a34972c4e4b87ffc42661ad99))


### Features

* **ui/Toasts:** add component ([#687](https://github.com/startupjs/startupjs/issues/687)) ([8d93172](https://github.com/startupjs/startupjs/commit/8d93172c8358388a8d4bc383cf055eb80278fefc))



## [0.37.7](https://github.com/startupjs/startupjs/compare/v0.37.6...v0.37.7) (2021-08-20)


### Bug Fixes

* **docs/Sandbox:** fix crashing for circular structure of props ([#764](https://github.com/startupjs/startupjs/issues/764)) ([50f5b13](https://github.com/startupjs/startupjs/commit/50f5b1398c2e10a4506a1f8a4ff43a469624bfde))
* **i18n:** fix updating the value of the 't' function when changing the language ([fd42d1f](https://github.com/startupjs/startupjs/commit/fd42d1f665a21ed87e8ac31c889aaedc5e2699a7))


### Features

* **cli:** replace `config.json` varaibles when generate a new project ([#772](https://github.com/startupjs/startupjs/issues/772)) ([6016fb3](https://github.com/startupjs/startupjs/commit/6016fb3bd929207c69745daa50e280a94953530c))
* **docs/Sandbox:** add ability to pass styles for renderer ([#773](https://github.com/startupjs/startupjs/issues/773)) ([0c3e931](https://github.com/startupjs/startupjs/commit/0c3e931437db070b6252408561deafccf7ec0bff))



## [0.37.6](https://github.com/startupjs/startupjs/compare/v0.37.5...v0.37.6) (2021-08-19)


### Bug Fixes

* **i18n:** fix bug in 't' function related to missing filename in key param ([#771](https://github.com/startupjs/startupjs/issues/771)) ([6661905](https://github.com/startupjs/startupjs/commit/666190544cdfbcaba3837b0c8ebecfb7ca7ca851))
* **ui/Menu:** fix parsing children for mdx ([#762](https://github.com/startupjs/startupjs/issues/762)) ([9ef1c8b](https://github.com/startupjs/startupjs/commit/9ef1c8bea589caf7a3083d496d2fe8e238419649))


### Features

* **mdx:** add horizontal scroll to example block ([#767](https://github.com/startupjs/startupjs/issues/767)) ([cd15259](https://github.com/startupjs/startupjs/commit/cd152592b43c4ad6b9890614cecd6c50b33f7c6e))



## [0.37.5](https://github.com/startupjs/startupjs/compare/v0.37.4...v0.37.5) (2021-08-18)


### Bug Fixes

* **docs:** add horizontal scroll to `Sandbox` preview ([#761](https://github.com/startupjs/startupjs/issues/761)) ([88cf2fa](https://github.com/startupjs/startupjs/commit/88cf2fa8dfca48ebaedaebbb5b7f3b4df5ee75a4))
* **docs:** fix re-rendering of the sidebar content when open/close it ([8005c32](https://github.com/startupjs/startupjs/commit/8005c32d3205bb4f9f360f699d0717d0a8ce9ab8))
* **docs/Sandbox:** add two-way data binding for props ([#754](https://github.com/startupjs/startupjs/issues/754)) ([8528bad](https://github.com/startupjs/startupjs/commit/8528bad49c18ac2c6f152ff2d87367c721161041))
* **mdx:** improve code block view ([#746](https://github.com/startupjs/startupjs/issues/746)) ([392c54a](https://github.com/startupjs/startupjs/commit/392c54a34b2f1cd00240f2b91fc7f15deb108e46))
* **ui:** specify component name for themed in components ([f86e3cc](https://github.com/startupjs/startupjs/commit/f86e3cc3d1d7fc941a17164ed1347adf53000cc2))
* memoize codepush and back handler listeners ([#758](https://github.com/startupjs/startupjs/issues/758)) ([f9f9252](https://github.com/startupjs/startupjs/commit/f9f92524b7bbf5c152565fa98d3b08222c13caf6))
* **ui/Tag:** add missing propTypes ([#763](https://github.com/startupjs/startupjs/issues/763)) ([4ff5102](https://github.com/startupjs/startupjs/commit/4ff510269e176e13f31f328481ec768bbad99028))


### Features

* **bundler:** add ability to pass flag to mdx example ([3f82f0e](https://github.com/startupjs/startupjs/commit/3f82f0eede8ce962f06e574a419b9063e9d81183))



## [0.37.4](https://github.com/startupjs/startupjs/compare/v0.37.3...v0.37.4) (2021-08-06)


### Bug Fixes

* **Alert:** fix icon property ([#735](https://github.com/startupjs/startupjs/issues/735)) ([e4ccbf6](https://github.com/startupjs/startupjs/commit/e4ccbf6a6b9edb1c6830057b40a7d1d30d8899ac))
* **Avatar:** log an error instead of throw when no component for status ([#736](https://github.com/startupjs/startupjs/issues/736)) ([61bc68b](https://github.com/startupjs/startupjs/commit/61bc68b00dcb8d54cb2f12a9b421d4472c8b591f))
* **Badge:** fix dot variant styles when redundant label exist ([#737](https://github.com/startupjs/startupjs/issues/737)) ([84d515e](https://github.com/startupjs/startupjs/commit/84d515edb354e5d41a1efccb4e8e9976075f68b1))
* **Collapse:**  animate icon if exist ([#738](https://github.com/startupjs/startupjs/issues/738)) ([98fcc96](https://github.com/startupjs/startupjs/commit/98fcc968a55c4b3120459038db52da579d32fdd3))
* **SmartSidebar:** fix typo in propType 'disabled'  ([#743](https://github.com/startupjs/startupjs/issues/743)) ([c58f55b](https://github.com/startupjs/startupjs/commit/c58f55bda0615237983d4f2979c3f12ae9ee5d3c))
* **ui/Carousel:** prevent swipe outside ([#745](https://github.com/startupjs/startupjs/issues/745)) ([3c30184](https://github.com/startupjs/startupjs/commit/3c3018427c87c5936888190ee5dbe0746ad6efa1))
* **ui/sidebars:** fix incorrect behaviour of 'disabled' property ([c050c00](https://github.com/startupjs/startupjs/commit/c050c00decf3340beeb5d840df62e601a4355040))
* refactor usage of deprecated 'font' mixin ([bb716af](https://github.com/startupjs/startupjs/commit/bb716af905a695e9981d693a03a65dfc317c164c))


### Features

* **Sandbox:** improve constructor inputs ([#733](https://github.com/startupjs/startupjs/issues/733)) ([1030ad7](https://github.com/startupjs/startupjs/commit/1030ad73c99c4627e69052d6022547a7b35a9b87))



## [0.37.3](https://github.com/startupjs/startupjs/compare/v0.37.2...v0.37.3) (2021-07-30)


### Bug Fixes

* **auth:** replace `$where` to `$or` with all providers in register query to support mongo less 4.4 version and greater 4.4 version ([#724](https://github.com/startupjs/startupjs/issues/724)) ([47a1a75](https://github.com/startupjs/startupjs/commit/47a1a7514814bfd52d9aa9f1b1501bd7979fddb0))
* **docs:** show 'page not found' for incorrect url ([45bacfb](https://github.com/startupjs/startupjs/commit/45bacfb11656277df89cd8605ce2e81584812a53))
* **mdx:** fix link scrolling to anchor ([#732](https://github.com/startupjs/startupjs/issues/732)) ([27c0493](https://github.com/startupjs/startupjs/commit/27c0493859ce2a3685f81ec7119fb902e256b42b))
* **orm:** remove unsued 'childrenName' in associations ([8f7ef37](https://github.com/startupjs/startupjs/commit/8f7ef37d0287654679e583413df84e1a0e1405ab))
* **ui/SmartSidebar:** don't open desktop sidebar when disabled ([#731](https://github.com/startupjs/startupjs/issues/731)) ([1835623](https://github.com/startupjs/startupjs/commit/1835623e8c8b9c3a6786895a607f04aa46e46cd9))


### Features

* **ui/Modal:** add ability to pass default values for props ([#729](https://github.com/startupjs/startupjs/issues/729)) ([ac801e2](https://github.com/startupjs/startupjs/commit/ac801e2628aaf727bf0a781a3d7912ab978912e9))



## [0.37.2](https://github.com/startupjs/startupjs/compare/v0.37.1...v0.37.2) (2021-07-06)


### Bug Fixes

* **ui/Modal:** pass missing `style` to modal content root element ([#720](https://github.com/startupjs/startupjs/issues/720)) ([b9abd57](https://github.com/startupjs/startupjs/commit/b9abd5785e26b55d460ccc86a85900ccd0ac5b5d))



## [0.37.1](https://github.com/startupjs/startupjs/compare/v0.37.0...v0.37.1) (2021-07-01)


### Bug Fixes

* **auth strategies:** add default baseUrl from `@env` ([#718](https://github.com/startupjs/startupjs/issues/718)) ([52cc0b4](https://github.com/startupjs/startupjs/commit/52cc0b4fbdb3eaa684cc71084dcc2d0c94fcd3f7))
* **ui/Alert:** fix broken styles for info alert ([a010d96](https://github.com/startupjs/startupjs/commit/a010d96b765cf26c28c4a5565d13a7b642b674c7))



# [0.37.0](https://github.com/startupjs/startupjs/compare/v0.36.4...v0.37.0) (2021-06-30)


### Bug Fixes

* **app:** move dialogs to ui library ([#707](https://github.com/startupjs/startupjs/issues/707)) ([4aae10a](https://github.com/startupjs/startupjs/commit/4aae10a03261a8fce3b90ecce69825a18aca9651))
* **auth:** improve account linking ([#706](https://github.com/startupjs/startupjs/issues/706)) ([42a5115](https://github.com/startupjs/startupjs/commit/42a51159c0f059b1db0e45720b003dfd046499d5))


### Features

* **ui:** add ability to specify label and description for forms components ([#717](https://github.com/startupjs/startupjs/issues/717)) ([5756dc0](https://github.com/startupjs/startupjs/commit/5756dc01b003a7c1e539d3efdb66312bdefd4da5))
* **ui/Carousel:** add component ([#715](https://github.com/startupjs/startupjs/issues/715)) ([674fd58](https://github.com/startupjs/startupjs/commit/674fd584249ead0bc60e076e5bdf5c04ab21adf8))


### BREAKING CHANGES

* **startupjs/ui/forms:** label font size was changed to smaller

* **startupjs/ui/typography:** default text font weight was changed from `700` to `600`



## [0.36.4](https://github.com/startupjs/startupjs/compare/v0.36.3...v0.36.4) (2021-06-21)


### Bug Fixes

* **themed:** fix accumulation of styles ([#710](https://github.com/startupjs/startupjs/issues/710)) ([0cc325d](https://github.com/startupjs/startupjs/commit/0cc325d47cc8b768a7456305250996c725ebc286))
* **ui:** fix form components crashes ([#705](https://github.com/startupjs/startupjs/issues/705)) ([23e7092](https://github.com/startupjs/startupjs/commit/23e70922cda5998553d8b808ab206511ecc27c35))
* **ui/NumberInput:** fix non-dynamic `value` property ([#709](https://github.com/startupjs/startupjs/issues/709)) ([9dd3417](https://github.com/startupjs/startupjs/commit/9dd3417421e12ce8ec8f69e4a997ac4034ede41e))



## [0.36.3](https://github.com/startupjs/startupjs/compare/v0.36.2...v0.36.3) (2021-06-11)


### Bug Fixes

* use font family mixin in components ([874c6d2](https://github.com/startupjs/startupjs/commit/874c6d25f79b8be9ac820b715bb08eba2c79d911))
* **ui/Alert:** fix popping actions ([d470c97](https://github.com/startupjs/startupjs/commit/d470c97fdeb30bf0e9dcd3da0c6c92d3ec582394))
* **ui/Alert:** fix vertical align ([#691](https://github.com/startupjs/startupjs/issues/691)) ([923cc59](https://github.com/startupjs/startupjs/commit/923cc59c11b206f551ffe6729d66dd5825a80dc4))



## [0.36.2](https://github.com/startupjs/startupjs/compare/v0.36.1...v0.36.2) (2021-06-08)


### Bug Fixes

* **mdx:** fix code example indents ([ffd7ae3](https://github.com/startupjs/startupjs/commit/ffd7ae3db3045a83a065e9a9d8e1c657f4e209df))
* **Menu:** menu item can shrink ([9b46a42](https://github.com/startupjs/startupjs/commit/9b46a4278b9061eddb54318380f149af2673a351))
* **typography/fonts:** fix detection of custom font ([154763d](https://github.com/startupjs/startupjs/commit/154763d563f962e76fa9b3b54afd228f587578b7))



## [0.36.1](https://github.com/startupjs/startupjs/compare/v0.36.0...v0.36.1) (2021-06-08)


### Bug Fixes

* **babel-preset-startupjs:** add missing 'babel-plugin-i18n-extract' dependency ([b308596](https://github.com/startupjs/startupjs/commit/b308596ba786e764d89ae25787ee3a705b2f1d10))



# [0.36.0](https://github.com/startupjs/startupjs/compare/v0.35.10...v0.36.0) (2021-06-08)


### Bug Fixes

* **mdx:** fix code block indents ([b2cc572](https://github.com/startupjs/startupjs/commit/b2cc572f6fed577f69ffead6fa3e5355ae3f551b))
* **templates/ui:** fix require of i18n app ([29f1513](https://github.com/startupjs/startupjs/commit/29f151361d26119d3bc06cd11e87cddde0c2e551))
* **typography/fonts:** add default font 'System' for android and ios ([bca528c](https://github.com/startupjs/startupjs/commit/bca528cdf89b95f13cd651ef46ac668307cc9b2c))
* **ui:** add ui plugin to module map file ([2a73171](https://github.com/startupjs/startupjs/commit/2a7317176bc5d84045ddf86d8ac1bfb102476697))
* **ui/Hr:** remove deprecated component ([#695](https://github.com/startupjs/startupjs/issues/695)) ([b9639af](https://github.com/startupjs/startupjs/commit/b9639afdf50aafe2bdbaae5c3fc8476ebe02e0b7))
* **ui/Select:** fix Android crash with empty value ([#677](https://github.com/startupjs/startupjs/issues/677)) ([6bccb35](https://github.com/startupjs/startupjs/commit/6bccb35953a5de09bbb18d930bb7854ec007de12))
* **ui/themed:** pass 'ref' to target component ([#699](https://github.com/startupjs/startupjs/issues/699)) ([3b79fa3](https://github.com/startupjs/startupjs/commit/3b79fa32af5e3a8f8b07e8e462b44d80654d8664))


### Documentation

* **ui:** improve docs ([#643](https://github.com/startupjs/startupjs/issues/643)) ([ca69839](https://github.com/startupjs/startupjs/commit/ca698396f94d71808bb61632c9e946e16776e878))


### Features

* **2fa-push-notification-provider:** add package ([#694](https://github.com/startupjs/startupjs/issues/694)) ([dccae3a](https://github.com/startupjs/startupjs/commit/dccae3af49c0ea60ada2815801ad90f113cc8266))
* **i18n:** add package ([#698](https://github.com/startupjs/startupjs/issues/698)) ([f98768e](https://github.com/startupjs/startupjs/commit/f98768edace7e7b79ff3ae1b8045df4a30953743))
* **typography/fonts:** split font families by platforms ([#675](https://github.com/startupjs/startupjs/issues/675)) ([f57f36d](https://github.com/startupjs/startupjs/commit/f57f36d18c6aeaaf3b1d87c716bf355d8b66fe88))


### BREAKING CHANGES

* **typography/fonts:** The structure of `$UI.fontFamilies` was changed. Now it accepts platform-specific keys `web`, `android`, `ios`, `windows`, `macos`, `native` to override fonts on a particular platform and one special key `default` to override fonts simultaneously for all platforms. If you are using fonts in your project then [see docs](/docs/foundation/Fonts#font-family) to understand how to migrate your config.

* **ui/Breadcrumbs:** no longer supports `Link` component properties for `route`

* **ui/Badge:** `size='s'` now shows content, if you don't want to show content, then use the `variant='dot'` property

* **ui/Select:** fix error on Android with conditional rendering `Picker.Item` when using the `Select` property `showEmptyValue = {false}`. Need to update `@react-native-picker/picker` library to version 1.16.1.

* **ui/Hr:** remove deprecated `Hr` component, use `Divider` instead



## [0.35.10](https://github.com/startupjs/startupjs/compare/v0.35.9...v0.35.10) (2021-06-02)


### Bug Fixes

* **worker:** commit  version ([c0bef34](https://github.com/startupjs/startupjs/commit/c0bef34743ecb5128dd20ee51874f144e81cc0cb))


### Features

* **push-notifications:** add `push-notifications` package ([#656](https://github.com/startupjs/startupjs/issues/656)) ([7019c08](https://github.com/startupjs/startupjs/commit/7019c0881f53df89c73a8a13be3c4d36ad806de5))



## [0.35.9](https://github.com/startupjs/startupjs/compare/v0.35.8...v0.35.9) (2021-06-02)


### Bug Fixes

* **bundler:** Move vite to peerDeps. TODO: upgrade vite and vite plugin to the latest version and test that it's actually working on the most recent code. ([a007a24](https://github.com/startupjs/startupjs/commit/a007a24b03e0908483d3522b704bd1ba4e454ea9))
* **cli:** fix linking when init a new project ([#683](https://github.com/startupjs/startupjs/issues/683)) ([8f39684](https://github.com/startupjs/startupjs/commit/8f3968437c8447031c12f15ba2b3cb6c813e9372))
* **typography/headers:** add missing font color ([#692](https://github.com/startupjs/startupjs/issues/692)) ([d616e60](https://github.com/startupjs/startupjs/commit/d616e60ddd0183b47553e808fd78d4f1643c6c8f))


### Features

* use `mongodb` 3.x ([#689](https://github.com/startupjs/startupjs/issues/689)) ([e9726ce](https://github.com/startupjs/startupjs/commit/e9726cef7d2184422645dc1373427540ef97a07a))



## [0.35.8](https://github.com/startupjs/startupjs/compare/v0.35.7...v0.35.8) (2021-05-26)


### Bug Fixes

* **auth-idg:** pass `req` to `findOrCreateUser` function

## [0.35.7](https://github.com/startupjs/startupjs/compare/v0.35.6...v0.35.7) (2021-05-25)


### Bug Fixes

* **ui/Span:** add missing default font size ([b81a718](https://github.com/startupjs/startupjs/commit/b81a71810a9ace3fdeb8b92e7ab6b02625ace9d7))


### Features

* **cli:** add common command `link` instead `android-link` ([#674](https://github.com/startupjs/startupjs/issues/674)) ([d42641a](https://github.com/startupjs/startupjs/commit/d42641acb8f284a918a7dc24d2bd344a0e8316f8))
* **mdx:** add action `collapse`, `copy code` for code block ([#652](https://github.com/startupjs/startupjs/issues/652)) ([da57909](https://github.com/startupjs/startupjs/commit/da57909674e67b775514e274c734747ef8f2dee5))
* **ui:** add ability to override ui styles ([#668](https://github.com/startupjs/startupjs/issues/668)) ([e943bb3](https://github.com/startupjs/startupjs/commit/e943bb3d09f29d6502f21f2a1b8a901b1dd44084))



## [0.35.6](https://github.com/startupjs/startupjs/compare/v0.35.5...v0.35.6) (2021-05-21)


### Bug Fixes

* **auth-local:** fix bugs related to using recaptcha when it is not enabled ([#671](https://github.com/startupjs/startupjs/issues/671)) ([88ddbb0](https://github.com/startupjs/startupjs/commit/88ddbb08cc9b9d327454112836abd8dcae59e6d9))


### Features

* **ui/DateTimePicker:** add disabled styles ([#673](https://github.com/startupjs/startupjs/issues/673)) ([d8bbbb9](https://github.com/startupjs/startupjs/commit/d8bbbb9e3b1f56b68f3393cd73e3f10bc290eacf))



## [0.35.5](https://github.com/startupjs/startupjs/compare/v0.35.4...v0.35.5) (2021-05-20)


### Bug Fixes

* **auth-google, auth-facebook:** add default params for `onLogin` ([#667](https://github.com/startupjs/startupjs/issues/667)) ([614a1e1](https://github.com/startupjs/startupjs/commit/614a1e19b3a705538870b1e86500d7e3ec4a967d))
* **scrollable-anchors:** fix getting incorrect position ([ddf3f1c](https://github.com/startupjs/startupjs/commit/ddf3f1cea607b5ea5e372cd98bbd9553fed2be6e))
* **worker:** fix broken custom initialization ([6de6282](https://github.com/startupjs/startupjs/commit/6de62822ba7fa927bc035b2f012aae5d4aa29c14))



## [0.35.4](https://github.com/startupjs/startupjs/compare/v0.35.3...v0.35.4) (2021-05-17)


### Bug Fixes

* **ui/Span:** add missing default font color ([e092166](https://github.com/startupjs/startupjs/commit/e09216692dfeb197e4d80fe5718ae109e48abece))



## [0.35.3](https://github.com/startupjs/startupjs/compare/v0.35.2...v0.35.3) (2021-05-14)


### Features

* **auth-local:** add ability to override `getUserData` method ([#664](https://github.com/startupjs/startupjs/issues/664)) ([33d6b80](https://github.com/startupjs/startupjs/commit/33d6b8057112c0db684ef43b80bb0393f344e5ac))



## [0.35.2](https://github.com/startupjs/startupjs/compare/v0.35.1...v0.35.2) (2021-05-14)


### Bug Fixes

* **recaptcha:** make web force compiled ([#663](https://github.com/startupjs/startupjs/issues/663)) ([5b2d710](https://github.com/startupjs/startupjs/commit/5b2d710f2186c8dc0255094e8a58006c9e1668a3))


### Features

* **2fa-manager:** add `2fa-manager` package ([#624](https://github.com/startupjs/startupjs/issues/624)) ([6b78dd3](https://github.com/startupjs/startupjs/commit/6b78dd37b13cf63e884f0725aa3d487050968105))



## [0.35.1](https://github.com/startupjs/startupjs/compare/v0.35.0...v0.35.1) (2021-05-13)


### Bug Fixes

* **auth-local:** fix saving user data ([c6c8b23](https://github.com/startupjs/startupjs/commit/c6c8b230b7ab9d88738419ec57ecefffeea78469))



# [0.35.0](https://github.com/startupjs/startupjs/compare/v0.34.10...v0.35.0) (2021-05-13)


### Bug Fixes

* **auth:** don't save auth data in the user collection ([#654](https://github.com/startupjs/startupjs/issues/654)) ([0336f19](https://github.com/startupjs/startupjs/commit/0336f19744f0a047924833c6d29ec1aabfff3d20))
* **Table:** fix paddings ([#626](https://github.com/startupjs/startupjs/issues/626)) ([f338d44](https://github.com/startupjs/startupjs/commit/f338d44c244d6495c18467423b4491ea5d6b8794))
* **ui/ArrayInput:** remove redundant props 'value' ([58b57ac](https://github.com/startupjs/startupjs/commit/58b57acdc9aa6b5b2507cb1b2e76947b2a1d07b5))
* **ui/AutoSuggest:** don't clean input on blur if correct value is not set ([#642](https://github.com/startupjs/startupjs/issues/642)) ([1444a9a](https://github.com/startupjs/startupjs/commit/1444a9a7e5c9863eaac3d06fc0e8aac277de7f14))
* **ui/Modal:** change `Modal.Actions` behaviour ([225982a](https://github.com/startupjs/startupjs/commit/225982acb674a8915d57bd1b39667c20866a907f))
* **ui/Modal:** dont render content if modal isnt visible ([#613](https://github.com/startupjs/startupjs/issues/613)) ([e43f1a5](https://github.com/startupjs/startupjs/commit/e43f1a532e0546eb0e8e12b4fe6a6297a84847c2))
* **ui/Modal:** fix bug related to opening modal using ref ([#650](https://github.com/startupjs/startupjs/issues/650)) ([a851b4c](https://github.com/startupjs/startupjs/commit/a851b4cc8cbb4b0702bdf8aff6723eb49c57f8d7))
* **ui/ObjectInput:** remove redundant props 'value' ([653a4f6](https://github.com/startupjs/startupjs/commit/653a4f6fb4f5ffe12766d8c183ea04f8e1666e14))
* **ui/Popover:** rework animations ([#623](https://github.com/startupjs/startupjs/issues/623)) ([d2cad4a](https://github.com/startupjs/startupjs/commit/d2cad4a94d7c48eea20198e7b5ccdedd73297855))
* **worker:** make worker compatible with webpack compilation ([cae2cf4](https://github.com/startupjs/startupjs/commit/cae2cf4eedd5ff38fc0f3e757a1942e691b0c230))


### Features

* **app:** add alert, confirm, prompt boxes ([#638](https://github.com/startupjs/startupjs/issues/638)) ([0168a88](https://github.com/startupjs/startupjs/commit/0168a88baadc55f393d4f283514d9208a156bab2))
* **docs/Sandbox:** display `required` label for required props ([#644](https://github.com/startupjs/startupjs/issues/644)) ([1d1de4f](https://github.com/startupjs/startupjs/commit/1d1de4f35d4b831d37d7220801c07afea072dfe0))
* **recaptcha:** add enterprise recaptcha ([#653](https://github.com/startupjs/startupjs/issues/653)) ([d722ab1](https://github.com/startupjs/startupjs/commit/d722ab1ede850da79fd5910b0a2f0d72eaab66dd))
* **typography:** add `fontFamily` mixin ([#597](https://github.com/startupjs/startupjs/issues/597)) ([09158bc](https://github.com/startupjs/startupjs/commit/09158bc8efeec1efd1678319a27cfa87c5ef1610))
* **ui/typography:** add semantic font size names ([#632](https://github.com/startupjs/startupjs/issues/632)) ([3c562bc](https://github.com/startupjs/startupjs/commit/3c562bc943ab7bb441e249eec458eeff26d2d691))


### BREAKING CHANGES

### `startupjs/ui/Popover`
- remove `default` variant from animateType prop
- rename `slide` to `opacity` in animateType prop

### `startupjs/ui/Tr`
- remove paddings

### `startupjs/ui/Th`
- increase horizontal paddings to 16px

### `startupjs/ui/Td`
- increase horizontal paddings to 16px

### `@startupjs/ui/Modal`

- Now, the cancel button is always displayed along with the confirm button. If you want display one button use `onCancel`.

### `Fonts`

Default font family for `Span` and `H1-H6` components were changed from `Cochin` to

```
system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Ubuntu, 'Helvetica Neue', sans-serif
```

If you want to use custom fonts read [this](https://startupjs-ui.dmapper.co/docs/foundation/Fonts).

### `@startupjs/auth`

- Fix save password, hash, salt, unconfirmed in users collection

- To remove unnecessary data use this code:

```js
async function (model) {
  const $users = model.query('users', {
    $or: [
      { password: { $exists: true } },
      { confirm: { $exists: true } },
      { hash: { $exists: true } },
      { salt: { $exists: true } },
      { unconfirmed: { $exists: true } }
    ]
  })

  await $users.fetch()

  for (const user of $users.get()) {
    await Promise.all([
      model.del(`users.${user.id}.password`),
      await model.del(`users.${user.id}.confirm`),
      await model.del(`users.${user.id}.hash`),
      await model.del(`users.${user.id}.salt`),
      await model.del(`users.${user.id}.unconfirmed`)
    ])
  }
}
```
* **ui/Modal:** Now, the cancel button is always displayed along with the confirm button. If you want display one button use `onCancel`.
* **Table:** Move horizontal paddings from `Tr` to `Th, Td`.



## [0.34.10](https://github.com/startupjs/startupjs/compare/v0.34.9...v0.34.10) (2021-05-12)


### Bug Fixes

* **auth:** fix resend auth form ([#658](https://github.com/startupjs/startupjs/issues/658)) ([a6ac19e](https://github.com/startupjs/startupjs/commit/a6ac19efd3135bb426af09e083b9105b3d06c118))
* **auth-local:** fix reassign const ([#651](https://github.com/startupjs/startupjs/issues/651)) ([3c37e5a](https://github.com/startupjs/startupjs/commit/3c37e5a06528ce21daf093d6bf618351d423ce16))
* **ui/ArrayInput:** remove redundant props 'value' ([abe2724](https://github.com/startupjs/startupjs/commit/abe2724f6fb8056171b68c4a3bbef31e7e86de8e))
* **ui/Modal:** fix bug related to opening modal using ref ([#650](https://github.com/startupjs/startupjs/issues/650)) ([f65f09e](https://github.com/startupjs/startupjs/commit/f65f09e8262d45b13b1e0299abdf95f477392f46))
* **ui/ObjectInput:** remove redundant props 'value' ([787444d](https://github.com/startupjs/startupjs/commit/787444df87f9af493fed4d055301be9c11a92ea9))


### Features

* **docs/Sandbox:** display `required` label for required props ([#644](https://github.com/startupjs/startupjs/issues/644)) ([3c93431](https://github.com/startupjs/startupjs/commit/3c9343120fc6bd5e91a9a60966a159675c0fbc26))
* **mdx:** add local urls support ([#655](https://github.com/startupjs/startupjs/issues/655)) ([3dad5b3](https://github.com/startupjs/startupjs/commit/3dad5b3b18685290e6beec903c7f4e0f1abf3317))
* **react-sharedb:** add typescript declaration files ([#648](https://github.com/startupjs/startupjs/issues/648)) ([5911df6](https://github.com/startupjs/startupjs/commit/5911df633d5456f903f966403866b085ee4b6fe0))



## [0.34.9](https://github.com/startupjs/startupjs/compare/v0.34.8...v0.34.9) (2021-04-30)


### Bug Fixes

* **auth-local:** move email case to lower case ([#640](https://github.com/startupjs/startupjs/issues/640)) ([c8affa6](https://github.com/startupjs/startupjs/commit/c8affa6ce98b6002434c3ace7b07be68c79c1dbb))
* **docs:** make topbar non-overlapping content ([#635](https://github.com/startupjs/startupjs/issues/635)) ([c82e5c3](https://github.com/startupjs/startupjs/commit/c82e5c324817c7bb0b58e55d902e640d33932042))
* **ui/AutoSuggest:** don't clean input on blur if correct value is not set ([#642](https://github.com/startupjs/startupjs/issues/642)) ([1c869a3](https://github.com/startupjs/startupjs/commit/1c869a396ba6f03ec527d8232e22f270314b8cf9))
* **ui/Modal:** deprecate , use  instead ([6c3222d](https://github.com/startupjs/startupjs/commit/6c3222dcbf026a7e1965dd1f4b5cd9fcfbb78504))
* **ui/Modal:** fix  triggering on first rendering ([2ff7c9d](https://github.com/startupjs/startupjs/commit/2ff7c9d101fc05f09f6dd65ece8898ef16897b55))


### Features

* **auth-google:** pass login options to google auth library ([#634](https://github.com/startupjs/startupjs/issues/634)) ([1c05776](https://github.com/startupjs/startupjs/commit/1c05776fbf3bdf0bb308b34268cdfea32bf3b7f7))



## [0.34.8](https://github.com/startupjs/startupjs/compare/v0.34.7...v0.34.8) (2021-04-26)


### Bug Fixes

* **auth:** error format in res ([2017532](https://github.com/startupjs/startupjs/commit/20175320053ba22d2646d47ead0039bc35cdd709))


### Features

* **mdx:** add md table support and jsx pure-example ([#631](https://github.com/startupjs/startupjs/issues/631)) ([ea8b34d](https://github.com/startupjs/startupjs/commit/ea8b34d5014e43c148225615e06acc8002982ee3))



## [0.34.7](https://github.com/startupjs/startupjs/compare/v0.34.6...v0.34.7) (2021-04-21)


### Bug Fixes

* **auth:** Update local provider id ([e8e254b](https://github.com/startupjs/startupjs/commit/e8e254b43f3b27ca5b3e55eb32f79ae711a9d228))



## [0.34.6](https://github.com/startupjs/startupjs/compare/v0.34.5...v0.34.6) (2021-04-21)


### Features

* **auth:** Email update feature ([59ddca5](https://github.com/startupjs/startupjs/commit/59ddca5d27db69237db8575606ac772e8c34ec9f))



## [0.34.5](https://github.com/startupjs/startupjs/compare/v0.34.4...v0.34.5) (2021-04-20)


### Bug Fixes

* **ui/DateTimePicker:** add container that take styles ([#628](https://github.com/startupjs/startupjs/issues/628)) ([0407bc4](https://github.com/startupjs/startupjs/commit/0407bc4862db543f9cc69776af350ba11454d6a8))
* **ui/Tabs:** fix passing props to `TabBar` ([#619](https://github.com/startupjs/startupjs/issues/619)) ([83316cb](https://github.com/startupjs/startupjs/commit/83316cbc7427b5d9a70220f878c65a08d6f5fd5c))



## [0.34.4](https://github.com/startupjs/startupjs/compare/v0.34.3...v0.34.4) (2021-04-16)


### Bug Fixes

* **anchors:** prevent chilfren rerendering ([5aed489](https://github.com/startupjs/startupjs/commit/5aed489f95a7dde4f5846df2195ade5f3a1f6ac5))



## [0.34.3](https://github.com/startupjs/startupjs/compare/v0.34.2...v0.34.3) (2021-04-15)


### Bug Fixes

* Recalc anchors pos on height change ([706e2d0](https://github.com/startupjs/startupjs/commit/706e2d0542bff3d7fbf34892f9d17b82d37994c6))
* **anchors:** Raceconditions for el registering ([ab66425](https://github.com/startupjs/startupjs/commit/ab66425b18a707ce001a955d43ba6e4704b9a75c))
* **ui/Autosuggest:** fix search with non-letter characters ([#617](https://github.com/startupjs/startupjs/issues/617)) ([2b0fd0b](https://github.com/startupjs/startupjs/commit/2b0fd0b58630231fbb9dbeab9095a1e0fdc5252e))



## [0.34.2](https://github.com/startupjs/startupjs/compare/v0.34.1...v0.34.2) (2021-04-14)


### Bug Fixes

* **auth-local:** fix bugs related to displaying incorrect fields in forms ([#606](https://github.com/startupjs/startupjs/issues/606)) ([97fa11d](https://github.com/startupjs/startupjs/commit/97fa11db67bc59b91cb5eb50df01066737cd381a))
* **styleguide:** fix android ([4c7d6b5](https://github.com/startupjs/startupjs/commit/4c7d6b55bbf10cfc33b091de23bd5888d5a3f41b))
* **ui/Div:** remove onClick from propTypes ([afd6d9e](https://github.com/startupjs/startupjs/commit/afd6d9e280b4f9f1a36a6371118433be23805621))
* **ui/Modal:** dont render content if modal isnt visible ([#613](https://github.com/startupjs/startupjs/issues/613)) ([#618](https://github.com/startupjs/startupjs/issues/618)) ([f81140d](https://github.com/startupjs/startupjs/commit/f81140d48321a09d650be07fcb32c4399fb0bd74))



## [0.34.1](https://github.com/startupjs/startupjs/compare/v0.34.0...v0.34.1) (2021-04-08)


### Bug Fixes

* **ui/User:** adjust sizes according to Avatar component changes ([2a1b23b](https://github.com/startupjs/startupjs/commit/2a1b23b222ae03f75b8313a4370ae20323ea2305))


### Features

* **ui/User:** add support for custom status icons (components) ([5dc7d4b](https://github.com/startupjs/startupjs/commit/5dc7d4b4392cc36aaffd9607d6dfc6d634b5cfde))



# [0.34.0](https://github.com/startupjs/startupjs/compare/v0.33.8...v0.34.0) (2021-04-08)


### Bug Fixes

* **app:** fix restart for web ([fb0a397](https://github.com/startupjs/startupjs/commit/fb0a397deec68a01a4be9adb0c643a4ba577ed93))
* **auth:** remove `AuthModal` ([#594](https://github.com/startupjs/startupjs/issues/594)) ([cd9a0d4](https://github.com/startupjs/startupjs/commit/cd9a0d4843bb95a1e4b9315f10d3f8caae5b1491))
* **auth:** setup default arguments for `onLogout` ([#605](https://github.com/startupjs/startupjs/issues/605)) ([7cac079](https://github.com/startupjs/startupjs/commit/7cac079c944194dc996e6d7eba80bf6c933171a7))
* **recaptcha:** set a specific version `react-native-webview` ([#601](https://github.com/startupjs/startupjs/issues/601)) ([e7afe44](https://github.com/startupjs/startupjs/commit/e7afe44238367d718eb9a4f106f12ec314113a80))
* **ui/Avatar:** add ability to specify size and remove extra sizes ([#590](https://github.com/startupjs/startupjs/issues/590)) ([fbcb977](https://github.com/startupjs/startupjs/commit/fbcb97705e2ae7caeacabf418d8fc90cff52bd7d))
* **ui/Div:** make event bubbling consistent for web and mobile ([#608](https://github.com/startupjs/startupjs/issues/608)) ([52c2406](https://github.com/startupjs/startupjs/commit/52c240606ea200ebdf5150425016c3e3ad385dec))
* **ui/Div:** remove redundant web only `onClick` property ([#593](https://github.com/startupjs/startupjs/issues/593)) ([a5d36cd](https://github.com/startupjs/startupjs/commit/a5d36cd890b28ad348f4088ea44262bda9da02ac))
* **ui/PasswordInput:** remove `secureTextEntry` property ([#570](https://github.com/startupjs/startupjs/issues/570)) ([1597219](https://github.com/startupjs/startupjs/commit/15972193b4be6221ae1af837ff291b2d07be7a1e))


### Features

* **auth:** implement recaptcha for register and reset forms ([#596](https://github.com/startupjs/startupjs/issues/596)) ([ec54280](https://github.com/startupjs/startupjs/commit/ec54280e37dc8b24948386308575eafa7e6b427e))
* **ui/Avatar:** Add support for custom status icons (components) ([e52af23](https://github.com/startupjs/startupjs/commit/e52af2356079b11747beaad26a1d0e9057574568))
* **ui/Tag:** add `size` property ([#592](https://github.com/startupjs/startupjs/issues/592)) ([ccd4f4a](https://github.com/startupjs/startupjs/commit/ccd4f4abd8e195c7005b220e2ae6c43809348456))


### BREAKING CHANGES

* **ui/Tag:**
  * remove `iconPosition` property. For the icon on the left, use the `icon` property and `iconStyle` to style it, for the icon on the right, use the `secondaryIcon` and `secondaryIconStyle` properties, and all these properties to use two icons
  * no more support loading indicator for async action
  * the default component size has become larger
  * add `size` property
* **auth:** Remove `AuthModal` component. Instead use `Modal` + `AuthForm`.
* **ui/PasswordInput:** The property `secureTextEntry` was removed because it is redundant.
* **Button:** the `variant` property no longer supported `shadowed` value



## [0.33.8](https://github.com/startupjs/startupjs/compare/v0.33.7...v0.33.8) (2021-04-06)


### Bug Fixes

* **TextInput:** fix `numberOfLines` property reactivity ([#599](https://github.com/startupjs/startupjs/issues/599)) ([c4090c4](https://github.com/startupjs/startupjs/commit/c4090c47803b5ba8d89436d4d8b1d5bd124bcc2d))



## [0.33.7](https://github.com/startupjs/startupjs/compare/v0.33.6...v0.33.7) (2021-04-02)


### Bug Fixes

* **auth:** check if private file exists ([#586](https://github.com/startupjs/startupjs/issues/586)) ([24a3d2a](https://github.com/startupjs/startupjs/commit/24a3d2af5314b419fcbccb9ede7a27753ffc7030))
* **auth:** remove private config and private keys ([#585](https://github.com/startupjs/startupjs/issues/585)) ([d785dba](https://github.com/startupjs/startupjs/commit/d785dbab509987dedd06285eecbd6575f3bb05cd))
* **DateTimePicker:** fix iOS drawer buttons and height ([#583](https://github.com/startupjs/startupjs/issues/583)) ([ef93c4e](https://github.com/startupjs/startupjs/commit/ef93c4e2d9b2c9f6780ab47868bd67b4947b37bd))
* **docs/Sandbox:** skip private props ([#580](https://github.com/startupjs/startupjs/issues/580)) ([db0dca3](https://github.com/startupjs/startupjs/commit/db0dca3cdd94eee76ddd9c5e2faabb5b19d3f6f5))
* **mdx:** fix header anchor jumps on hover ([#581](https://github.com/startupjs/startupjs/issues/581)) ([b70e483](https://github.com/startupjs/startupjs/commit/b70e483a56c55485ff11402e86e52b8f623881f9))
* **recaptcha:** fix error when adding two invisible captchas ([#595](https://github.com/startupjs/startupjs/issues/595)) ([e06d71c](https://github.com/startupjs/startupjs/commit/e06d71c6fa6d0ea3cafd95c79b58c34d543a7c63))
* **ui/Span:** remove redundant description prop ([#582](https://github.com/startupjs/startupjs/issues/582)) ([ea368d3](https://github.com/startupjs/startupjs/commit/ea368d33ddaffd45c253a66a483039e5ee1725f6))


### Features

* add `@startupjs/recaptcha` package ([#579](https://github.com/startupjs/startupjs/issues/579)) ([eb35f60](https://github.com/startupjs/startupjs/commit/eb35f60dbb22be713e7fac67f5b6734be6b99cdc))
* **sharedb-access:** implementation for factory ([#578](https://github.com/startupjs/startupjs/issues/578)) ([ef88f3b](https://github.com/startupjs/startupjs/commit/ef88f3bdd803e55935d9651198ef7c8cb4a5206c))



## [0.33.6](https://github.com/startupjs/startupjs/compare/v0.33.5...v0.33.6) (2021-03-25)


### Bug Fixes

* **app:** don't restore url if it is current url ([#577](https://github.com/startupjs/startupjs/issues/577)) ([98a45b7](https://github.com/startupjs/startupjs/commit/98a45b70f6b2e6f9c4fd6aab681eec0b508c031a))



## [0.33.5](https://github.com/startupjs/startupjs/compare/v0.33.4...v0.33.5) (2021-03-24)


### Bug Fixes

* **auth:** add `renderForm` for AuthModal and fix `auth-google` migration guide ([#576](https://github.com/startupjs/startupjs/issues/576)) ([50b9d3d](https://github.com/startupjs/startupjs/commit/50b9d3df878bd522fae3c5cae0992337de8a1e9d))


### Features

* **auth:** Add testIds to Login form ([b1ee31d](https://github.com/startupjs/startupjs/commit/b1ee31d5674a4bba251c950e68472396e202a08a))



## [0.33.4](https://github.com/startupjs/startupjs/compare/v0.33.3...v0.33.4) (2021-03-23)


### Features

* **2fa:** add 2fa package ([#569](https://github.com/startupjs/startupjs/issues/569)) ([5e091c5](https://github.com/startupjs/startupjs/commit/5e091c5bc31aafc93e610cbbd6d3d117e23334d6))
* **2fa:** add error handler on serverside and add docs ([#575](https://github.com/startupjs/startupjs/issues/575)) ([ac3993b](https://github.com/startupjs/startupjs/commit/ac3993bba8b58a781b3904e0498d29dfbca6d36e))
* **ui/Input:** add ability to display an error ([#568](https://github.com/startupjs/startupjs/issues/568)) ([e042c24](https://github.com/startupjs/startupjs/commit/e042c2467baa45e25d6fc549f485f13f7e51242d))



## [0.33.3](https://github.com/startupjs/startupjs/compare/v0.33.2...v0.33.3) (2021-03-18)


### Bug Fixes

* **auth:** Add req to onAfterPasswordReset ([ead38c7](https://github.com/startupjs/startupjs/commit/ead38c7f26e8f78fee3dba7bedff9cbf07ece3b9))



## [0.33.2](https://github.com/startupjs/startupjs/compare/v0.33.1...v0.33.2) (2021-03-18)


### Bug Fixes

* **auth:** Return some callbacks to forms ([d254e09](https://github.com/startupjs/startupjs/commit/d254e0933e4eb046c1310d5bdde003d32504b37d))



## [0.33.1](https://github.com/startupjs/startupjs/compare/v0.33.0...v0.33.1) (2021-03-17)


### Bug Fixes

* remove alpha version of startupjs from peer deps ([2901631](https://github.com/startupjs/startupjs/commit/290163197798dbd428b9f434e20606f08cb63277))
* replace route for filter redirect  ([#567](https://github.com/startupjs/startupjs/issues/567)) ([836cb96](https://github.com/startupjs/startupjs/commit/836cb96caf1a0a593e8b6af4f4b63285cdeae7cd))



# [0.33.0](https://github.com/startupjs/startupjs/compare/v0.33.0-alpha.4...v0.33.0) (2021-03-14)


### Bug Fixes

* **auth:** supplement new api ([#553](https://github.com/startupjs/startupjs/issues/553)) ([05d4d64](https://github.com/startupjs/startupjs/commit/05d4d6417bf1cc98e795c71bb3cada25730752e6))
* **plugins:** fix rendering on ios because of slot memoization ([#556](https://github.com/startupjs/startupjs/issues/556)) ([8f87f7e](https://github.com/startupjs/startupjs/commit/8f87f7e5dbbc1dce4c5ea7efcab60f487375f28b))
* **styleguide:** add yarn start script ([#554](https://github.com/startupjs/startupjs/issues/554)) ([88d1df1](https://github.com/startupjs/startupjs/commit/88d1df12813cac090182bfec64feec4f1c9aef84))
* **Div:** prevent event bubbling when disabled ([#544](https://github.com/startupjs/startupjs/issues/544)) ([d705c13](https://github.com/startupjs/startupjs/commit/d705c1312a76e1f36fd0c744e76d7c11be9d16a3))


### Features

* **app:** add ability to restart app ([#543](https://github.com/startupjs/startupjs/issues/543)) ([947251f](https://github.com/startupjs/startupjs/commit/947251ff39aa236477cb538225f69ee0d718b3c8))
* **app:** add ability to restore url after reload app ([#539](https://github.com/startupjs/startupjs/issues/539)) ([a508bbd](https://github.com/startupjs/startupjs/commit/a508bbd79c5e61fbf319c61049a938a63c79c896))
* **app:** use 'LayoutWrapper' plugin to decorate app Layout ([#545](https://github.com/startupjs/startupjs/issues/545)) ([6558efc](https://github.com/startupjs/startupjs/commit/6558efc2d87fb58b3a15615ae40fd8da26bb9df8))
* **auth:** add ability to customize forms ([#525](https://github.com/startupjs/startupjs/issues/525)) ([0bacc86](https://github.com/startupjs/startupjs/commit/0bacc8695cef7ca059cba3ba244bc302316a8bad))
* **plugin:** add frontend api ([#535](https://github.com/startupjs/startupjs/issues/535)) ([b73f7f2](https://github.com/startupjs/startupjs/commit/b73f7f2a8ffa032640f5bad2bcd3b200a94e48ea))
* **app/error:** add message to custom error ([#562](https://github.com/startupjs/startupjs/issues/562)) ([6b97466](https://github.com/startupjs/startupjs/commit/6b974668a7982a7ae3c18ce09632515d6b1873d7))
* **auth:** Pass req to some hooks ([d4d2ca5](https://github.com/startupjs/startupjs/commit/d4d2ca505cfc731be7bfbe02331cd31b56c493f0))
* **e2e:** compare sreenshots ([#559](https://github.com/startupjs/startupjs/issues/559)) ([7c6e05d](https://github.com/startupjs/startupjs/commit/7c6e05d1e199fe95dfa0030c1e04cc3113601e1a))
* **sharedb-schema:** implement schema for factory ORM ([#560](https://github.com/startupjs/startupjs/issues/560)) ([0479b2f](https://github.com/startupjs/startupjs/commit/0479b2f35558ebab58dc4039aa1f05ad568213f1))
* update `racer` to `1.0.0` version


### BREAKING CHANGES

* [See 0.33 migration guide](/docs/migration-guides/0.33.md)



# [0.33.0-alpha.4](https://github.com/startupjs/startupjs/compare/v0.32.11...v0.33.0-alpha.4) (2021-03-12)


### Bug Fixes

* **auth:** supplement new api ([#553](https://github.com/startupjs/startupjs/issues/553)) ([05d4d64](https://github.com/startupjs/startupjs/commit/05d4d6417bf1cc98e795c71bb3cada25730752e6))
* **plugins:** fix rendering on ios because of slot memoization ([#556](https://github.com/startupjs/startupjs/issues/556)) ([8f87f7e](https://github.com/startupjs/startupjs/commit/8f87f7e5dbbc1dce4c5ea7efcab60f487375f28b))
* **styleguide:** add yarn start script ([#554](https://github.com/startupjs/startupjs/issues/554)) ([88d1df1](https://github.com/startupjs/startupjs/commit/88d1df12813cac090182bfec64feec4f1c9aef84))


### Features

* **app/error:** add message to custom error ([#562](https://github.com/startupjs/startupjs/issues/562)) ([6b97466](https://github.com/startupjs/startupjs/commit/6b974668a7982a7ae3c18ce09632515d6b1873d7))
* **auth:** Pass req to some hooks ([d4d2ca5](https://github.com/startupjs/startupjs/commit/d4d2ca505cfc731be7bfbe02331cd31b56c493f0))
* **e2e:** compare sreenshots ([#559](https://github.com/startupjs/startupjs/issues/559)) ([7c6e05d](https://github.com/startupjs/startupjs/commit/7c6e05d1e199fe95dfa0030c1e04cc3113601e1a))
* **sharedb-schema:** implement schema for factory ORM ([#560](https://github.com/startupjs/startupjs/issues/560)) ([0479b2f](https://github.com/startupjs/startupjs/commit/0479b2f35558ebab58dc4039aa1f05ad568213f1))



# [0.33.0-alpha.3](https://github.com/startupjs/startupjs/compare/v0.33.0-alpha.2...v0.33.0-alpha.3) (2021-03-09)

### Bug Fixes

* update peer deps of react and fix peer deps for ui template ([7bc03cc](https://github.com/startupjs/startupjs/commit/7bc03ccfd43ecfdcaed97703687f0b82e87ecac0))


# [0.33.0-alpha.2](https://github.com/startupjs/startupjs/compare/v0.33.0-alpha.1...v0.33.0-alpha.2) (2021-03-09)

### Bug Fixes

* update peer deps, fix react-native-tab-view dep for cli package ([b867bc7](https://github.com/startupjs/startupjs/commit/b867bc74157fa335678f7307cb0f16f4381a76ba))


# [0.33.0-alpha.1](https://github.com/startupjs/startupjs/compare/v0.33.0-alpha.0...v0.33.0-alpha.1) (2021-03-09)


### Bug Fixes

* fix broken compilation process ([263caa5](https://github.com/startupjs/startupjs/commit/263caa5d1cda63f136ec48b530493f8bfd950f08))



# [0.33.0-alpha.0](https://github.com/startupjs/startupjs/compare/v0.32.9...v0.33.0-alpha.0) (2021-03-09)


### Bug Fixes


* **cli/link:** fix getting app name for android ([#546](https://github.com/startupjs/startupjs/issues/546)) ([c77e843](https://github.com/startupjs/startupjs/commit/c77e84359a04b5b8351d3263233d8d900e9afd78))
* **Div:** prevent event bubbling when disabled ([#544](https://github.com/startupjs/startupjs/issues/544)) ([d705c13](https://github.com/startupjs/startupjs/commit/d705c1312a76e1f36fd0c744e76d7c11be9d16a3))


### Features

* **app:** add ability to restart app ([#543](https://github.com/startupjs/startupjs/issues/543)) ([947251f](https://github.com/startupjs/startupjs/commit/947251ff39aa236477cb538225f69ee0d718b3c8))
* **app:** add ability to restore url after reload app ([#539](https://github.com/startupjs/startupjs/issues/539)) ([a508bbd](https://github.com/startupjs/startupjs/commit/a508bbd79c5e61fbf319c61049a938a63c79c896))
* **app:** use 'LayoutWrapper' plugin to decorate app Layout ([#545](https://github.com/startupjs/startupjs/issues/545)) ([6558efc](https://github.com/startupjs/startupjs/commit/6558efc2d87fb58b3a15615ae40fd8da26bb9df8))
* **auth:** add ability to customize forms ([#525](https://github.com/startupjs/startupjs/issues/525)) ([0bacc86](https://github.com/startupjs/startupjs/commit/0bacc8695cef7ca059cba3ba244bc302316a8bad))
* **plugin:** add frontend api ([#535](https://github.com/startupjs/startupjs/issues/535)) ([b73f7f2](https://github.com/startupjs/startupjs/commit/b73f7f2a8ffa032640f5bad2bcd3b200a94e48ea))


### BREAKING CHANGES

* **app:** Remove version restriction of `react` and `react-native`.



## [0.32.11](https://github.com/startupjs/startupjs/compare/v0.32.10...v0.32.11) (2021-03-10)


### Bug Fixes

* **cli/link:** fix getting app name for android ([12588ff](https://github.com/startupjs/startupjs/commit/12588ff8f553f56da28570f4d54d46528d5d22d5))



## [0.32.10](https://github.com/startupjs/startupjs/compare/v0.32.9...v0.32.10) (2021-03-10)

### Bug Fixes

* **startupjs:** fix eslint in startupjs ui template ([#557](https://github.com/startupjs/startupjs/issues/557)) ([0926cfd](https://github.com/startupjs/startupjs/commit/0926cfdd4e4d530eb922425a22ed9bd788294e77))



## [0.32.9](https://github.com/startupjs/startupjs/compare/v0.32.8...v0.32.9) (2021-02-26)


### Bug Fixes

* **Button:** dont display loading for immediately resloved promise ([#538](https://github.com/startupjs/startupjs/issues/538)) ([c78c660](https://github.com/startupjs/startupjs/commit/c78c6607d03091e057e368aa76be109302d00f84))
* **mdx:** getTextChildren fn ([acbb4ac](https://github.com/startupjs/startupjs/commit/acbb4ac514e6bd982140dcb2f841d271fd1b39e1))
* **ui/Button:** verify children ([#537](https://github.com/startupjs/startupjs/issues/537)) ([38215b4](https://github.com/startupjs/startupjs/commit/38215b4c15319a16ae6826e6ad28d39e3f0cf253))



## [0.32.8](https://github.com/startupjs/startupjs/compare/v0.32.7...v0.32.8) (2021-02-24)


### Features

* **deploy:** Add support for deploying 'cron' microservice ([0d58ef4](https://github.com/startupjs/startupjs/commit/0d58ef427593fc07847509460bb75ed6ac03e029))
* **mdx:** add component for image ([#510](https://github.com/startupjs/startupjs/issues/510)) ([345aa91](https://github.com/startupjs/startupjs/commit/345aa916a576801903dbf6fd5acbbb0887078f4b))
* **server-aggregate:** forward error from model to router ([#534](https://github.com/startupjs/startupjs/issues/534)) ([90de1b7](https://github.com/startupjs/startupjs/commit/90de1b7cba2f13b30ce1de3b1ac7e86133039a97))



## [0.32.7](https://github.com/startupjs/startupjs/compare/v0.32.6...v0.32.7) (2021-02-22)


### Bug Fixes

* **scrollable:** Rm integer validation ([2e9511f](https://github.com/startupjs/startupjs/commit/2e9511f75bc4fbd9035dd7127c430f5c92209c8e))



## [0.32.6](https://github.com/startupjs/startupjs/compare/v0.32.5...v0.32.6) (2021-02-22)


### Bug Fixes

* **scrollable:** Return accidentally removed changes ([a81968c](https://github.com/startupjs/startupjs/commit/a81968cf72e11929c5b7f6e2bbb50e2c116d6bd8))



## [0.32.5](https://github.com/startupjs/startupjs/compare/v0.32.4...v0.32.5) (2021-02-22)


### Bug Fixes

* **App:** remove UI components ([#536](https://github.com/startupjs/startupjs/issues/536)) ([a329d44](https://github.com/startupjs/startupjs/commit/a329d44077b059f06b1a59c25224a1c1eb781909))
* **auth:** Rm duplicated line ([49469eb](https://github.com/startupjs/startupjs/commit/49469ebb11c72f0888cda8c5fb71e54cad667726))
* **mdx:** break-word for anchors ([457ced7](https://github.com/startupjs/startupjs/commit/457ced7b0d4fc26c00d7d972691ea2c89840f234))
* **scrollable:** Crash on android ([b2f5ee6](https://github.com/startupjs/startupjs/commit/b2f5ee668ba4fcc1896cf0162edc71b2d21c76e8))


### Features

* **acrollable:** Add ability to pass scrollview props ([878113b](https://github.com/startupjs/startupjs/commit/878113b078de02497084eb26f28e2759e988539e))



## [0.32.4](https://github.com/startupjs/startupjs/compare/v0.32.3...v0.32.4) (2021-02-19)


### Bug Fixes

* **scrollable:** Crach on unregisterArea ([39e4f9b](https://github.com/startupjs/startupjs/commit/39e4f9bd5330bc02c4785f1a1e3cab7a99c90a36))



## [0.32.3](https://github.com/startupjs/startupjs/compare/v0.32.2...v0.32.3) (2021-02-19)


### Bug Fixes

* **scrollable:** Scroll top without animation ([15d37fa](https://github.com/startupjs/startupjs/commit/15d37fa578eee2fc704a2880d33a4205b67b00f9))
* **scrollable:** Typo ([d87ab9f](https://github.com/startupjs/startupjs/commit/d87ab9f28e111a6edab6f7a75342b5fd53199391))
* **scrollable:** Update module deps ([194aa63](https://github.com/startupjs/startupjs/commit/194aa63677438447fff9063502368deef384b01c))


### Features

* **doc:** closing the sidebar after selecting a menu item ([#533](https://github.com/startupjs/startupjs/issues/533)) ([adbecfa](https://github.com/startupjs/startupjs/commit/adbecfa7677dadec24e49c2677217d7df883db6b))



## [0.32.2](https://github.com/startupjs/startupjs/compare/v0.32.1...v0.32.2) (2021-02-18)


### Bug Fixes

* **scrollable:** Decode hash from URL ([fc4e249](https://github.com/startupjs/startupjs/commit/fc4e249a416a35a609f0db3b9a9b58c76260a75d))



## [0.32.1](https://github.com/startupjs/startupjs/compare/v0.32.0...v0.32.1) (2021-02-18)


### Bug Fixes

* **mdx:** Improve inlineCode styles, add bigger margin before h2 ([701db87](https://github.com/startupjs/startupjs/commit/701db879f0aba45ddc167004f343b86ad6c60b64))
* **plugin:** Use a replacement library instead of require.resolve() to have it working in ESM environments ([ea80fb3](https://github.com/startupjs/startupjs/commit/ea80fb3e967c7415892062f3ff3f8690bef9c2dc))
* **ui/Popover:** multiple popover close bug ([#527](https://github.com/startupjs/startupjs/issues/527)) ([d9b8d23](https://github.com/startupjs/startupjs/commit/d9b8d2330dfc38ef36886712f7267655ad96d046))



# [0.32.0](https://github.com/startupjs/startupjs/compare/v0.31.30...v0.32.0) (2021-02-17)


### BREAKING CHANGES

* [See 0.32 migration guide](/docs/migration-guides/0.32.md)


### Features

* **detox:** add package ([#522](https://github.com/startupjs/startupjs/issues/522)) ([13414c0](https://github.com/startupjs/startupjs/commit/13414c0ea2569728160986ca1946768c536e0a44))



## [0.31.30](https://github.com/startupjs/startupjs/compare/v0.31.29...v0.31.30) (2021-02-12)


### Bug Fixes

* **cli:** commit react-native-gesture-handler version ([#517](https://github.com/startupjs/startupjs/issues/517)) ([46859bf](https://github.com/startupjs/startupjs/commit/46859bfa20e4adb68b1292c727cd8bdcfc73a349))
* **ui/MenuItem:** fix flex growing ([#513](https://github.com/startupjs/startupjs/issues/513)) ([da4052b](https://github.com/startupjs/startupjs/commit/da4052b26b40a36c835d72a565877fd2751f7d38))



## [0.31.29](https://github.com/startupjs/startupjs/compare/v0.31.28...v0.31.29) (2021-02-10)


### Bug Fixes

* **orm/associations:** fix typo 'association' -> 'associations' ([3c999ea](https://github.com/startupjs/startupjs/commit/3c999ea05525dcad5406fc2e845f9c0b49b8466b))



## [0.31.28](https://github.com/startupjs/startupjs/compare/v0.31.27...v0.31.28) (2021-02-10)


### Bug Fixes

* **orm/associations:** add default value ([976b7b2](https://github.com/startupjs/startupjs/commit/976b7b2abd23cb49fa6b95977ff6b243fe411bc6))



## [0.31.27](https://github.com/startupjs/startupjs/compare/v0.31.26...v0.31.27) (2021-02-09)


### Bug Fixes

* **orm:** add fallback to get collection for factory ORM ([#509](https://github.com/startupjs/startupjs/issues/509)) ([cd8a85f](https://github.com/startupjs/startupjs/commit/cd8a85f95cd5dac89730b12bf4578aa49b984166))
* **ui/Badge:** fix positioning on android ([#507](https://github.com/startupjs/startupjs/issues/507)) ([77c1ddf](https://github.com/startupjs/startupjs/commit/77c1ddf06471125539a546f518d1a3f72c7ad3e3))


### Features

* **app:** add ability to customize error page ([#473](https://github.com/startupjs/startupjs/issues/473)) ([a2e2d28](https://github.com/startupjs/startupjs/commit/a2e2d2840a655fe9957306be4f42588e99cc367a))
* **auth-common:** add ([#501](https://github.com/startupjs/startupjs/issues/501)) ([b9d9abf](https://github.com/startupjs/startupjs/commit/b9d9abffc4ff87e49264b0630ee540e0af0ee6be))
* **orm:** set associations in both directions (parent and child) ([#508](https://github.com/startupjs/startupjs/issues/508)) ([3d08205](https://github.com/startupjs/startupjs/commit/3d08205cdbc8dc71acdcd1204a824d2eec413cbf))



## [0.31.26](https://github.com/startupjs/startupjs/compare/v0.31.19...v0.31.26) (2021-02-04)


### Bug Fixes

* **backend:** add counter of users connections to fix memory leaks ([#505](https://github.com/startupjs/startupjs/issues/505)) ([007c26d](https://github.com/startupjs/startupjs/commit/007c26d5175db04a4433a332bbf56ac365623f93))


### Features

* **auth-apple:** linking ([#504](https://github.com/startupjs/startupjs/issues/504)) ([8707d9b](https://github.com/startupjs/startupjs/commit/8707d9ba1176a4ef672b349dd28868884b7487cd))
* **auth-idg:** add ([#503](https://github.com/startupjs/startupjs/issues/503)) ([efbfdb7](https://github.com/startupjs/startupjs/commit/efbfdb716c345d112b0b4939f6ccd4199acd7cf0))


## [0.31.25](https://github.com/startupjs/startupjs/compare/v0.31.24...v0.31.25) (2021-02-02)


### Performance Improvements

* **backend:** update `sharedb-mongo` package to the same version with monorepo ([#502](https://github.com/startupjs/startupjs/issues/502)) ([d42dd4a](https://github.com/startupjs/startupjs/commit/d42dd4af53635292a15b368335391dcd0df3226c))



## [0.31.24](https://github.com/startupjs/startupjs/compare/v0.31.23...v0.31.24) (2021-01-31)


### Features

* **babel-plugin-rn-stylename-to-style:** Add limited support for dynamic `part` attribute, similar to `styleName`. ([0c146d2](https://github.com/startupjs/startupjs/commit/0c146d2378c4fdffb2c7db39986d76ba0f575b9f))



## [0.31.23](https://github.com/startupjs/startupjs/compare/v0.31.22...v0.31.23) (2021-01-31)


### Bug Fixes

* **babel-plugin-rn-stylename-to-style:** fix using 'part' attribute in a compoment which has destructured ...props in its attributes ([4a17213](https://github.com/startupjs/startupjs/commit/4a17213379727fe00ecfee20c4db9340963b7af3))



## [0.31.22](https://github.com/startupjs/startupjs/compare/v0.31.21...v0.31.22) (2021-01-29)


### Bug Fixes

* **app:** refresh hash when change ([fa2c1d8](https://github.com/startupjs/startupjs/commit/fa2c1d8c18213c33c024eb102eea0369160a13ae))


### Features

* **DateTimePicker:** add internalization ([#500](https://github.com/startupjs/startupjs/issues/500)) ([c044b0d](https://github.com/startupjs/startupjs/commit/c044b0d2f545b62806cf5a5a3e1a60cbe0f813b0))



## [0.31.21](https://github.com/startupjs/startupjs/compare/v0.31.20...v0.31.21) (2021-01-27)


### Bug Fixes

* **orm:** add default 'collection' field based on ORM path only if it does not exist ([d57bba7](https://github.com/startupjs/startupjs/commit/d57bba7b55a148d97f247d252609b0eb320e0109))


### Features

* **ui/Multiselect:** add InputComponent prop ([#497](https://github.com/startupjs/startupjs/issues/497)) ([8c09c17](https://github.com/startupjs/startupjs/commit/8c09c1765f4809e38343062c268b0ff48690158f))



## [0.31.20](https://github.com/startupjs/startupjs/compare/v0.31.19...v0.31.20) (2021-01-26)


### Bug Fixes

* **auth:** Get extra data from parseUserCreationData ([a561168](https://github.com/startupjs/startupjs/commit/a561168dc98dc6f5f4c12563710493f9a46e36fd))



## [0.31.19](https://github.com/startupjs/startupjs/compare/v0.31.18...v0.31.19) (2021-01-25)


### Bug Fixes

* **orm-associations:** return missed ORM entity ([c91bc5c](https://github.com/startupjs/startupjs/commit/c91bc5c7af1a0f679cf1253895088162bfdad8ba))


## [0.31.18](https://github.com/startupjs/startupjs/compare/v0.31.15...v0.31.18) (2021-01-25)


### Features

* **orm:** add associations decorators ([#496](https://github.com/startupjs/startupjs/issues/496)) ([f18f15d](https://github.com/startupjs/startupjs/commit/f18f15d41391677e6b00b7d67fb190e191d84178))



## [0.31.17](https://github.com/startupjs/startupjs/compare/v0.31.16...v0.31.17) (2021-01-25)


### Features

* **ui/Multiselect:** add `renderList` item prop ([#495](https://github.com/startupjs/startupjs/issues/495)) ([fa5002e](https://github.com/startupjs/startupjs/commit/fa5002eec260a3cc5a9a34f6bbe7fece4fd8a192))

## [0.31.16](https://github.com/startupjs/startupjs/compare/v0.31.15...v0.31.16) (2021-01-22)


### Bug Fixes

* **ui/popups:** node measure ([#494](https://github.com/startupjs/startupjs/issues/494)) ([9d056b9](https://github.com/startupjs/startupjs/commit/9d056b99a124366178e3fc9f4215af8fb1a8f73f))



## [0.31.15](https://github.com/startupjs/startupjs/compare/v0.31.8...v0.31.15) (2021-01-19)


### Bug Fixes

* **cli:** fix android link ([#491](https://github.com/startupjs/startupjs/issues/491)) ([b1994d3](https://github.com/startupjs/startupjs/commit/b1994d3e785958815f1ca5eeb735959c6f0ed490))
* **ui/NumberInput:** add ability to style button ([#490](https://github.com/startupjs/startupjs/issues/490)) ([0d99589](https://github.com/startupjs/startupjs/commit/0d99589941852d093f1bfadfaba8e81bf6f26c5f))
* **ui/NumberInput:** update input value when `undefined` ([#492](https://github.com/startupjs/startupjs/issues/492)) ([f4eff97](https://github.com/startupjs/startupjs/commit/f4eff9707aa26e0a66803e70224f3e43134a4cb1))
* **ui/Portal:** add init docs ([#489](https://github.com/startupjs/startupjs/issues/489)) ([3839d1f](https://github.com/startupjs/startupjs/commit/3839d1ff6309d4e9859f6084c6f4512813b16129))


### Features

* **Docs/Tutorial:** add ru/en StartupJS Tutorial ([#486](https://github.com/startupjs/startupjs/issues/486)) ([f17f681](https://github.com/startupjs/startupjs/commit/f17f6818f43a0a4ea01072e4eae38b791f0a6583))



## [0.31.14](https://github.com/startupjs/startupjs/compare/v0.31.13...v0.31.14) (2021-01-18)


### Bug Fixes

* **auth:** Props order for AuthForm ([71f186b](https://github.com/startupjs/startupjs/commit/71f186b55bf6361c2a587e6d7e627967e5db29dc))
* **ui/Popover:** arrow position ([#485](https://github.com/startupjs/startupjs/issues/485)) ([9873caf](https://github.com/startupjs/startupjs/commit/9873caf4ff157915c14277c740f8c1d3b947f869))



## [0.31.13](https://github.com/startupjs/startupjs/compare/v0.31.11...v0.31.13) (2021-01-18)


### Bug Fixes

* **ui/AutoSuggest:** on scroll end event ([#487](https://github.com/startupjs/startupjs/issues/487)) ([e3c31c9](https://github.com/startupjs/startupjs/commit/e3c31c9bfd175f160151eafdf806f6821dad161a))
* **ui/Dropdown:** add style and disabled props in item ([#481](https://github.com/startupjs/startupjs/issues/481)) ([20b0039](https://github.com/startupjs/startupjs/commit/20b003970297d5049494672e327a41b9ed50c0d1))



## [0.31.11](https://github.com/startupjs/startupjs/compare/v0.31.10...v0.31.11) (2021-01-15)


### Bug Fixes

* **ui/Portal:** destroy state ([#483](https://github.com/startupjs/startupjs/issues/483)) ([9a44143](https://github.com/startupjs/startupjs/commit/9a44143d408988be6ce89cb0fcd24e88878b512f))



## [0.31.10](https://github.com/startupjs/startupjs/compare/v0.31.9...v0.31.10) (2021-01-14)


### Bug Fixes

* **ui/Dropdown:** remove required onChange ([#480](https://github.com/startupjs/startupjs/issues/480)) ([0ca809e](https://github.com/startupjs/startupjs/commit/0ca809e4f4fac9e47144f47523bbab6e644be992))
* **ui/Multiselect:** add `hasCaptionWidth` property ([#479](https://github.com/startupjs/startupjs/issues/479)) ([81d11ef](https://github.com/startupjs/startupjs/commit/81d11ef3a91f157231d89636d7c1038941d04c6a))



## [0.31.9](https://github.com/startupjs/startupjs/compare/v0.31.8...v0.31.9) (2021-01-14)


### Bug Fixes

* **auth:** fix passing baseURL param ([#477](https://github.com/startupjs/startupjs/issues/477)) ([e6b68ff](https://github.com/startupjs/startupjs/commit/e6b68ffda1ed215e8ed5d85419dee8f71a21941e))
* **auth:** Generate redirect url based on  host req ([5160fdc](https://github.com/startupjs/startupjs/commit/5160fdca7d03f159c48b544269fc2a02c7da8c00))



## [0.31.8](https://github.com/startupjs/startupjs/compare/v0.31.5...v0.31.8) (2021-01-13)


### Bug Fixes

* **auth:** Fastfix for local loadAuthData ([265090a](https://github.com/startupjs/startupjs/commit/265090a6a8759871a3b9fc08eb9969ee896a5365))
* **Popover:** fix geometry ([#467](https://github.com/startupjs/startupjs/issues/467)) ([a414769](https://github.com/startupjs/startupjs/commit/a4147695ef239cf6286393d778c0f972bc4cbc64))
* **ui/Dropdown:** onChange ([#478](https://github.com/startupjs/startupjs/issues/478)) ([1c91a68](https://github.com/startupjs/startupjs/commit/1c91a68fb47b607a4c9a70936380076ae15d550a))
* **ui/Multiselect:** fix max-height ([#475](https://github.com/startupjs/startupjs/issues/475)) ([4196e31](https://github.com/startupjs/startupjs/commit/4196e314523b1bacb3ded19816fbe3cfe8d86585))



## [0.31.7](https://github.com/startupjs/startupjs/compare/v0.31.6...v0.31.7) (2021-01-13)


### Bug Fixes

* **auth:** Fastfix for local loadAuthData ([265090a](https://github.com/startupjs/startupjs/commit/265090a6a8759871a3b9fc08eb9969ee896a5365))
* **ui/Multiselect:** fix max-height ([#475](https://github.com/startupjs/startupjs/issues/475)) ([4196e31](https://github.com/startupjs/startupjs/commit/4196e314523b1bacb3ded19816fbe3cfe8d86585))



## [0.31.6](https://github.com/startupjs/startupjs/compare/v0.31.5...v0.31.6) (2021-01-13)



## [0.31.5](https://github.com/startupjs/startupjs/compare/v0.31.4...v0.31.5) (2021-01-12)


### Bug Fixes

* **docs:** move portal over Layout instead of App ([#471](https://github.com/startupjs/startupjs/issues/471)) ([4f1beb0](https://github.com/startupjs/startupjs/commit/4f1beb04067787de1b0e65b37c1464f7cf8b5222))
* **Link:** make preventDefault work for async handler ([59ce7e8](https://github.com/startupjs/startupjs/commit/59ce7e8cd31648f3a9d2c01eb953bea354b65d15))
* **Modal:** make preventDefault work for async handlers ([2e8dbfc](https://github.com/startupjs/startupjs/commit/2e8dbfc41548cdbacbda52a390e63bc353646c72))
* **Multiselect:** make popover width as caption width ([96711a9](https://github.com/startupjs/startupjs/commit/96711a98bf5f928d3337aeebbc15f4c96ea754b0))
* **ui/Modal:** fix fullscreen modal for iOS ([#472](https://github.com/startupjs/startupjs/issues/472)) ([01feb18](https://github.com/startupjs/startupjs/commit/01feb1878aa0e88b705c7159fb3a3f53b170771a))
* **ui/MultiSelect:** fix passing styles to Popover ([#470](https://github.com/startupjs/startupjs/issues/470)) ([a08c586](https://github.com/startupjs/startupjs/commit/a08c5860f1af7b444ca06e44edc94c88d5c06222))



## [0.31.4](https://github.com/startupjs/startupjs/compare/v0.31.3...v0.31.4) (2021-01-05)


### Features

* **auth:** Implement auth modal ([#465](https://github.com/startupjs/startupjs/issues/465)) ([8cccbec](https://github.com/startupjs/startupjs/commit/8cccbecbc155756080872a3d00a14ad5a373c82e))



## [0.31.3](https://github.com/startupjs/startupjs/compare/v0.31.2...v0.31.3) (2021-01-05)


### Bug Fixes

* **auth:** Closure issue onEnterPress ([6b95b5d](https://github.com/startupjs/startupjs/commit/6b95b5d7ed03550cbddd08064b6312bcea0f0247))



## [0.31.2](https://github.com/startupjs/startupjs/compare/v0.31.1...v0.31.2) (2021-01-05)


### Bug Fixes

* **babel-plugin-rn-stylename-inline:** Search magic preprocessors imports in all 'startupjs' imports (there might be multiple, for example in our .mdx files) ([498331b](https://github.com/startupjs/startupjs/commit/498331b04afb8426b9ff11e17b5159072a3f5900))
* **DateTimePicker:** fixed zIndex, added property InputComponent ([#459](https://github.com/startupjs/startupjs/issues/459)) ([dafec10](https://github.com/startupjs/startupjs/commit/dafec1050538e1cd70d7e3d54188ade15ef435a1))


### Features

* **Breadcrumbs:** jsx separator ([#463](https://github.com/startupjs/startupjs/issues/463)) ([15c57cb](https://github.com/startupjs/startupjs/commit/15c57cb6d9557b0ee36172c0346773fb4e24a2d5))
* **mdx:** pug example ([#462](https://github.com/startupjs/startupjs/issues/462)) ([e0d432d](https://github.com/startupjs/startupjs/commit/e0d432dfdf60093d5ce5175c30044dee4dc12a67))
* **mdx:** Rewrite pug template string highlighting to a full sub-language highlighting support. Support styl/css/pug highlighting as subtemplates. ([28d8eef](https://github.com/startupjs/startupjs/commit/28d8eef2cba666e250a2d11d6b815e7aa1a7bf08))



## [0.31.1](https://github.com/startupjs/startupjs/compare/v0.31.0...v0.31.1) (2020-12-30)


### Bug Fixes

* **Popover:** add caption style ([#461](https://github.com/startupjs/startupjs/issues/461)) ([8245481](https://github.com/startupjs/startupjs/commit/82454815f789ac38061048e20f4392d7bf23a941))
* **Tabs:** move style property to tabs wrapper style and add tabsStyle for tabs instead ([d48e5b4](https://github.com/startupjs/startupjs/commit/d48e5b4329a2ab8dc1b73491da57f5854d8d7e0b))



# [0.31.0](https://github.com/startupjs/startupjs/compare/v0.30.6...v0.31.0) (2020-12-29)


### BREAKING CHANGES

* [See 0.31 migration guide](/docs/migration-guides/0.31.md)


### Bug Fixes

* **auth:** Change pathmane to href for web ([64e18ce](https://github.com/startupjs/startupjs/commit/64e18ce105b8a351f4d3361e27ac3c6af97f7f5e))
* **auth:** Fastfix for mobile logout helper ([123c6bb](https://github.com/startupjs/startupjs/commit/123c6bb34a5ca6746d67c9a18c2443775fa11c1b))
* **auth:** remove duplicated import ([66ba6d2](https://github.com/startupjs/startupjs/commit/66ba6d28dbbdef3a0f0e94582234cb288c8c24f6))
* **auth-apple:** button name ([#451](https://github.com/startupjs/startupjs/issues/451)) ([5810d16](https://github.com/startupjs/startupjs/commit/5810d166445d3140ca21ebe9aa8815211c31be1e))
* **Modal:** dont call  when the modal is closed ([fd3f21a](https://github.com/startupjs/startupjs/commit/fd3f21a92b57b4cd4c65daa6cd47bb482890e812))
* **Modal:** prevent appears when visible is ([f83a398](https://github.com/startupjs/startupjs/commit/f83a3989d0732dad24f53432bede04e37a12aaf6))
* **ui/Modal:** pass style and modalStyle correctly ([4e1c23e](https://github.com/startupjs/startupjs/commit/4e1c23e9072e68caecfe39551bab3688c7c95180))


### Features

* **babel-preset-startupjs:** Add APP_ENV variable to override which .env file to use. For example with APP_ENV=qa the '.env.qa' will be used ([1abb468](https://github.com/startupjs/startupjs/commit/1abb468ce187371d899e3e99d7167570c4ef0da2))
* **ui/Portal**: add component


## [0.30.10](https://github.com/startupjs/startupjs/compare/v0.30.9...v0.30.10) (2020-12-23)


### Bug Fixes

* **auth:** Fastfix for mobile logout helper ([123c6bb](https://github.com/startupjs/startupjs/commit/123c6bb34a5ca6746d67c9a18c2443775fa11c1b))



## [0.30.9](https://github.com/startupjs/startupjs/compare/v0.30.8...v0.30.9) (2020-12-23)


### Bug Fixes

* **auth:** Change pathmane to href for web ([64e18ce](https://github.com/startupjs/startupjs/commit/64e18ce105b8a351f4d3361e27ac3c6af97f7f5e))
* **ui/Modal:** pass style and modalStyle correctly ([4e1c23e](https://github.com/startupjs/startupjs/commit/4e1c23e9072e68caecfe39551bab3688c7c95180))



## [0.30.8](https://github.com/startupjs/startupjs/compare/v0.30.7...v0.30.8) (2020-12-22)


### Bug Fixes

* **auth:** remove duplicated import ([66ba6d2](https://github.com/startupjs/startupjs/commit/66ba6d28dbbdef3a0f0e94582234cb288c8c24f6))



## [0.30.7](https://github.com/startupjs/startupjs/compare/v0.30.6...v0.30.7) (2020-12-22)



## [0.30.6](https://github.com/startupjs/startupjs/compare/v0.30.5...v0.30.6) (2020-12-21)


### Bug Fixes

* **Link:** dont prevent event for case when button in link ([8b284ed](https://github.com/startupjs/startupjs/commit/8b284ede74679d272dff71493d3b3de636017df0))
* prevent warnings ([#438](https://github.com/startupjs/startupjs/issues/438)) ([0464027](https://github.com/startupjs/startupjs/commit/0464027bac1a003c4bcd3f4191f17d18890bb9fb))
* **auth:** Prevent server error on login without provider ([10c9b4a](https://github.com/startupjs/startupjs/commit/10c9b4af04b8dfd63f9438a9ac34dd3215822187))


### Features

* **auth:** Add  config prop for auth forms ([#445](https://github.com/startupjs/startupjs/issues/445)) ([835f78f](https://github.com/startupjs/startupjs/commit/835f78f58eb643e8640312a76dfa10da68d1ccfb))
* **auth:** apple ([#414](https://github.com/startupjs/startupjs/issues/414)) ([94aa118](https://github.com/startupjs/startupjs/commit/94aa1189f3d4c583862bea6ea0f88c7684cf8bb0))
* **ui/Checkbox:** add icon property ([#441](https://github.com/startupjs/startupjs/issues/441)) ([82702cc](https://github.com/startupjs/startupjs/commit/82702cc29fec127f2d3264c32c2f1bb79d5e0831))



## [0.30.5](https://github.com/startupjs/startupjs/compare/v0.30.4...v0.30.5) (2020-12-21)


### Features

* **auth:** Add  config prop for auth forms ([#445](https://github.com/startupjs/startupjs/issues/445)) ([835f78f](https://github.com/startupjs/startupjs/commit/835f78f58eb643e8640312a76dfa10da68d1ccfb))
* **auth:** apple ([#414](https://github.com/startupjs/startupjs/issues/414)) ([94aa118](https://github.com/startupjs/startupjs/commit/94aa1189f3d4c583862bea6ea0f88c7684cf8bb0))
* **ui/Checkbox:** add icon property ([#441](https://github.com/startupjs/startupjs/issues/441)) ([82702cc](https://github.com/startupjs/startupjs/commit/82702cc29fec127f2d3264c32c2f1bb79d5e0831))



## [0.30.4](https://github.com/startupjs/startupjs/compare/v0.30.3...v0.30.4) (2020-12-21)


### Bug Fixes

* **ui/Modal:** fix closing by default ([#440](https://github.com/startupjs/startupjs/issues/440)) ([41f9108](https://github.com/startupjs/startupjs/commit/41f910872ae98b066129b36471ab3d4838a46691))



## [0.30.3](https://github.com/startupjs/startupjs/compare/v0.30.2...v0.30.3) (2020-12-18)


### Bug Fixes

* **Link:** dont prevent event when Link using Div ([#439](https://github.com/startupjs/startupjs/issues/439)) ([48dc78b](https://github.com/startupjs/startupjs/commit/48dc78baebb7184fd7a52171ea0d9940cc087b9c))



## [0.30.2](https://github.com/startupjs/startupjs/compare/v0.30.1...v0.30.2) (2020-12-18)


### Bug Fixes

* **Div:** prevent default browser behavior for click inside Link component, to make it similar as behavior of the native mobiles ([#437](https://github.com/startupjs/startupjs/issues/437)) ([96b4da6](https://github.com/startupjs/startupjs/commit/96b4da6912597f5c1cf8410e5a5cbd710df9c918))



## [0.30.1](https://github.com/startupjs/startupjs/compare/v0.30.0...v0.30.1) (2020-12-17)


### Bug Fixes

* **auth:** Android finish auth stuck ([#435](https://github.com/startupjs/startupjs/issues/435)) ([353a72d](https://github.com/startupjs/startupjs/commit/353a72d59cde0d6e71306150cf40a2c0e204d046))



# [0.30.0](https://github.com/startupjs/startupjs/compare/v0.29.1...v0.30.0) (2020-12-16)


### BREAKING CHANGES

* [See 0.30 migration guide](/docs/migration-guides/0.30.md)


### Bug Fixes

* **bundler:** don't use generic index.js file anymore, must require a specific configuration from now on to prevent mixing envs. ([#429](https://github.com/startupjs/startupjs/issues/429)) ([6da0d7f](https://github.com/startupjs/startupjs/commit/6da0d7ffd1a076eb670dd1b1827ff1c43584a3b0))
* **ui/Button:** don't update loading state if the component is unmounted ([#431](https://github.com/startupjs/startupjs/issues/431)) ([5d774cb](https://github.com/startupjs/startupjs/commit/5d774cb8bf29a3a99b0be445fe437c4bbde8c294))
* **ui:** use plugin api to mark 'ui' library to be force compiled on server (needed for date picker styles init) ([6e504c4](https://github.com/startupjs/startupjs/commit/6e504c43471a2d26ec68e5252d1c776719466778))
* **ui/Tooltip:** web event window ([#427](https://github.com/startupjs/startupjs/issues/427)) ([828b218](https://github.com/startupjs/startupjs/commit/828b2186c474b7302f957c32daa0234ab227ddcf))
* minor ([59a9ccc](https://github.com/startupjs/startupjs/commit/59a9cccb556c2c80d03f0124baf06dad1944d2cf))
* **ui/Dropdown:** style ([#413](https://github.com/startupjs/startupjs/issues/413)) ([077cac1](https://github.com/startupjs/startupjs/commit/077cac17ee5785638419f607385b6da4b8e230ba))


### Features

* **sharedb-access:** create global models for each user instead of using backend ([#400](https://github.com/startupjs/startupjs/issues/400)) ([0b578a8](https://github.com/startupjs/startupjs/commit/0b578a8c0db98b2b8f0cdec43c412ae7a3241ad1))
* **ui/NumberInput:** features doc ([#425](https://github.com/startupjs/startupjs/issues/425)) ([f273e6d](https://github.com/startupjs/startupjs/commit/f273e6d61857d3109e88853a5ed07341c4361689))
* Remake DateTimePicker for web to always use a library. Add support for date format ([#402](https://github.com/startupjs/startupjs/issues/402)) ([76b206c](https://github.com/startupjs/startupjs/commit/76b206cd28f505e31f519eaa122d11fddace337e)), closes [#373](https://github.com/startupjs/startupjs/issues/373) [#381](https://github.com/startupjs/startupjs/issues/381) [#362](https://github.com/startupjs/startupjs/issues/362) [#2](https://github.com/startupjs/startupjs/issues/2) [#390](https://github.com/startupjs/startupjs/issues/390) [#389](https://github.com/startupjs/startupjs/issues/389) [#391](https://github.com/startupjs/startupjs/issues/391) [#384](https://github.com/startupjs/startupjs/issues/384) [#385](https://github.com/startupjs/startupjs/issues/385) [#382](https://github.com/startupjs/startupjs/issues/382) [#387](https://github.com/startupjs/startupjs/issues/387)


## [0.29.16](https://github.com/startupjs/startupjs/compare/v0.29.14...v0.29.16) (2020-12-16)


## [0.29.15](https://github.com/startupjs/startupjs/compare/v0.29.14...v0.29.15) (2020-12-16)


### Features

* Add redirectUrl param to finish auth ([#432](https://github.com/startupjs/startupjs/issues/432)) ([04e0b98](https://github.com/startupjs/startupjs/commit/04e0b98578002cf3a5db71ad8639d2e7e73c588f))



## [0.29.14](https://github.com/startupjs/startupjs/compare/v0.29.13...v0.29.14) (2020-12-16)


### Bug Fixes

* pod install ([#428](https://github.com/startupjs/startupjs/issues/428)) ([9b762f3](https://github.com/startupjs/startupjs/commit/9b762f3ccfb572272fac3d52c124453a5c4c62a0))
* **auth-azuread:** doc https ([#421](https://github.com/startupjs/startupjs/issues/421)) ([b573951](https://github.com/startupjs/startupjs/commit/b573951666af8dc03ddac4cd756f30f399291bc2))



## [0.29.13](https://github.com/startupjs/startupjs/compare/v0.29.12...v0.29.13) (2020-12-13)


### Bug Fixes

* **docs, mdx:** Improve documentation styles ([a110fdb](https://github.com/startupjs/startupjs/commit/a110fdbcb753b7a0b948e7ae2d0b758ccd91fcc1))


### Reverts

* Revert "chore: generate changelog using lerna" ([1b73cb4](https://github.com/startupjs/startupjs/commit/1b73cb4ecff3368c5c01fe30960c3a0935395e49))



## [0.29.12](https://github.com/startupjs/startupjs/compare/v0.29.11...v0.29.12) (2020-12-12)


### Features

* Implement initial plugins architecture. https://github.com/startupjs/startupjs/wiki/Plugins ([afa8e47](https://github.com/startupjs/startupjs/commit/afa8e47f5fe51cf49ca144a1f38ade44f79d50b8))



## [0.29.11](https://github.com/startupjs/startupjs/compare/v0.29.10...v0.29.11) (2020-12-11)


### Bug Fixes

* **orm:** return racer function's sync result from promise ([443d780](https://github.com/startupjs/startupjs/commit/443d7800ad1dc17d6bf19d9c0cc19ee4d648f807))



## [0.29.10](https://github.com/startupjs/startupjs/compare/v0.29.9...v0.29.10) (2020-12-11)


### Bug Fixes

* **replaceObserver:** improve logic of searching for options ([#419](https://github.com/startupjs/startupjs/issues/419)) ([d29f85c](https://github.com/startupjs/startupjs/commit/d29f85c4e4e647ce05093593d9e07d0294ddc98c))


### Features

* **app:** set '.platform' during globalInit ([a2e403b](https://github.com/startupjs/startupjs/commit/a2e403baa77079c3c72e3ccd50142d21ccce83ca))
* **app/AccessDeny:** fix styles ([#423](https://github.com/startupjs/startupjs/issues/423)) ([ef0f8e7](https://github.com/startupjs/startupjs/commit/ef0f8e7f31ca0fe82516afc52fdfaa52bcbe162d))



## [0.29.9](https://github.com/startupjs/startupjs/compare/v0.29.8...v0.29.9) (2020-12-11)


### Bug Fixes

* **templates:** minor, change title to App ([41524e0](https://github.com/startupjs/startupjs/commit/41524e0589b3be83de81dc85a618011a32d9ae78))



## [0.29.8](https://github.com/startupjs/startupjs/compare/v0.29.7...v0.29.8) (2020-12-10)


### Bug Fixes

* **auth:** fix layout
* **ui/Button:** fix hover and active styles ([f4683e8](https://github.com/startupjs/startupjs/commit/f4683e8cc2f71c32c1908604b5ee03710ce2b943))



## [0.29.7](https://github.com/startupjs/startupjs/compare/v0.29.6...v0.29.7) (2020-12-10)



## [0.29.6](https://github.com/startupjs/startupjs/compare/v0.29.5...v0.29.6) (2020-12-10)


### Bug Fixes

* **auth:** Change func to arrow func (context issue) ([324b316](https://github.com/startupjs/startupjs/commit/324b3162778fca7ab50e8df1e6ee33e01e2f1e33))
* **auth-local:** email to lower case ([#410](https://github.com/startupjs/startupjs/issues/410)) ([aa99d0d](https://github.com/startupjs/startupjs/commit/aa99d0de322c2e60eb464911196e98bddca91056))
* **docs:** fix anchors in inline code headers in mdx files ([#407](https://github.com/startupjs/startupjs/issues/407)) ([b8ce7ee](https://github.com/startupjs/startupjs/commit/b8ce7ee74a39a6b2c19ae938ac7d891f692cf14a))
* **ui/Popover:** visible true ([#415](https://github.com/startupjs/startupjs/issues/415)) ([25e9e24](https://github.com/startupjs/startupjs/commit/25e9e24dd7f8a97988f7ce7f951357bed26777ce))
* **ui/Select:** fix select text and caret when focussed with Tab ([#405](https://github.com/startupjs/startupjs/issues/405)) ([2dfa138](https://github.com/startupjs/startupjs/commit/2dfa138c1fff6d67601ae9a61a9037e2200b8f10))


### Features

* **auth:** Add signInPageUrl opt ([759253f](https://github.com/startupjs/startupjs/commit/759253f005b95489dae4bb4791885a697008ca92))
* **auth:** Save email to each strategy + ResetPassword form ([#416](https://github.com/startupjs/startupjs/issues/416)) ([43494ca](https://github.com/startupjs/startupjs/commit/43494caf5278bc64b53eff69108ba294ebc98b14))
* **auth:** Update hooks params according to Lingua auth flow ([#412](https://github.com/startupjs/startupjs/issues/412)) ([826f379](https://github.com/startupjs/startupjs/commit/826f37942e86b6032f54218f2bc02a2122ac1e62))
* **ui/Dropdown:** add prop to ([#409](https://github.com/startupjs/startupjs/issues/409)) ([9bfdd36](https://github.com/startupjs/startupjs/commit/9bfdd366ab055f7a4a9c009f02ebdc3cdc84649e))



## [0.29.5](https://github.com/startupjs/startupjs/compare/v0.29.4...v0.29.5) (2020-12-06)


### Bug Fixes

* **ui/Input:** Add missing types to propTypes. Fix performance issues in the example. ([ebb937d](https://github.com/startupjs/startupjs/commit/ebb937d644fa0ccd568f859146cd71aa20bac5f8))


### Features

* **ui:** add ArrayInput component to fully cover json-schema form rendering. ([6fd6a61](https://github.com/startupjs/startupjs/commit/6fd6a612af20c49b2a17cdf065f337cf98a2dcbb))
* **ui/Input:** add 'date' support ([887b23e](https://github.com/startupjs/startupjs/commit/887b23ec2df86c3d88fa609f40e0dcdcd1a77b67))
* **ui:** add datetime and time inputs
* **ui:** date input by default uses mode 'date' of DateTimePicker ([905dce8](https://github.com/startupjs/startupjs/commit/905dce83d53e45b4dc1aa5d7d05607e6d92d21a1))



## [0.29.4](https://github.com/startupjs/startupjs/compare/v0.29.3...v0.29.4) (2020-12-03)


### Bug Fixes

* **react-sharedb-util:** add aggregationName support to useQuery ([d42cc1e](https://github.com/startupjs/startupjs/commit/d42cc1e2c8e43c955897b7da37a22fbf5dd4ad23))
* **ui/Tooltip:** show ([#386](https://github.com/startupjs/startupjs/issues/386)) ([c5d0be7](https://github.com/startupjs/startupjs/commit/c5d0be723ee061d298a58835e45c3a2f4261767e))



## [0.29.3](https://github.com/startupjs/startupjs/compare/v0.29.2...v0.29.3) (2020-12-01)


### Bug Fixes

* **init-local:** Add helper 'yarn testapp' command to run 'yarn' commands from within testapp folder. Add success instructions describing how to use it. ([990d927](https://github.com/startupjs/startupjs/commit/990d92703c11d4a0d24e137f9447cb827408953a))
* **init-local:** Ignore changes to code made by lerna. Control failure status. ([dd6769d](https://github.com/startupjs/startupjs/commit/dd6769d49578e5d3a2044c6da7b4b31e02724f4d))
* minor ([d54c603](https://github.com/startupjs/startupjs/commit/d54c60335badab6c3b20b2bee90602e907bb1d96))
* **init-local:** Use memory cache for storage, don't cache any npm packages, fix permissions on install, remove unpublishing since it's no longer needed. ([9499ea4](https://github.com/startupjs/startupjs/commit/9499ea47825c7db180bbf792565a02b638fe8109))
* **yarn init-local:** properly find scripts folder ([b1536c5](https://github.com/startupjs/startupjs/commit/b1536c52a3408c1b9e8302107b3911e9fad33d6b))
* ignore /testapp created by init-local ([87dd66b](https://github.com/startupjs/startupjs/commit/87dd66bacd99153ce78b6666870e46b5bac8ed2d))


### Features

* **auth:** Add additional hooks, implement auth lock ([#399](https://github.com/startupjs/startupjs/issues/399)) ([4d52e87](https://github.com/startupjs/startupjs/commit/4d52e87129a315b0e53835c5983613d61de56cb0))
* **ui/AutoSuggest and Dropdown:** key events ([#394](https://github.com/startupjs/startupjs/issues/394)) ([5539f59](https://github.com/startupjs/startupjs/commit/5539f598ee9886ba700daabc69f35f6ed3ad52d5))
* **cli:** init local ([#393](https://github.com/startupjs/startupjs/issues/393)) ([959ee30](https://github.com/startupjs/startupjs/commit/959ee3053356567ebdb8017de94bfde9cee2e1e9))
* **ui:** add number input
* **docs/Sandbox:** fix parsing prop-types. feat(ObjectInput) ([b0796da](https://github.com/startupjs/startupjs/commit/b0796da848cdcb5b19bb9503249ca209ed325a05))



## [0.29.2](https://github.com/startupjs/startupjs/compare/v0.29.1...v0.29.2) (2020-11-30)


### Bug Fixes

* **auth:** fix console errors, update AD config ([f088eb7](https://github.com/startupjs/startupjs/commit/f088eb7715ee130bb2058b97236d97e9c46761da))
* **auth:** local linkedin strategy ([7b7ded1](https://github.com/startupjs/startupjs/commit/7b7ded12ac937e7452b9dc1253174abea0b6f6c0))


### Features

* **auth:** base global hooks ([aa59c4f](https://github.com/startupjs/startupjs/commit/aa59c4ffaa8ecdd31402b795aef86ce959727cc5))
* **auth:** async parseUserCreationData ([22d2bea](https://github.com/startupjs/startupjs/commit/22d2beac8310c5497bf385d3a61250c2d0470de0))
* **auth:** hooks ([9b95c45](https://github.com/startupjs/startupjs/commit/9b95c45a157e2c7b735a8cece3a8e23c2a808831))
* **auth:** onBeforeLogintHook, parseUserCreationData ([131f02f](https://github.com/startupjs/startupjs/commit/131f02f36ba7af13ad55dcb6f3c7b53b47618284))
* **auth:** docs ([#368](https://github.com/startupjs/startupjs/issues/368)) ([53a50f3](https://github.com/startupjs/startupjs/commit/53a50f3a3f07fa6ec72cbc61d8b30249ce2ee38f))
* **auth:** facebook ([32aaf8a](https://github.com/startupjs/startupjs/commit/32aaf8adf1e7273fbc5349483f71537081101dba))
* **auth:** google ([76f3309](https://github.com/startupjs/startupjs/commit/76f33098d42214f2b7d7dcd6b9996774234dd20d))
* **auth:** Linkedin web auth ([6df92d2](https://github.com/startupjs/startupjs/commit/6df92d270e6bf6cd38eacf95d1c303af10fc80fb))
* **auth:** micro frontend ([#361](https://github.com/startupjs/startupjs/issues/361)) ([5fbab60](https://github.com/startupjs/startupjs/commit/5fbab60349bff1692c4d8fbd82b7b9b16d83c385))


### Reverts

* **auth:** Revert some Azure AD creds ([8200e8e](https://github.com/startupjs/startupjs/commit/8200e8e4c89f6ea2ba060421eeadabbbed6527fe))



## [0.29.1](https://github.com/startupjs/startupjs/compare/v0.29.0...v0.29.1) (2020-11-26)


### Bug Fixes

* **docs:** open sidebar by default ([#396](https://github.com/startupjs/startupjs/issues/396)) ([c7db93e](https://github.com/startupjs/startupjs/commit/c7db93e9ac08bd62c6e0ebb825d5cf133d2bbe4f))



# [0.29.0](https://github.com/startupjs/startupjs/compare/v0.28.1...v0.29.0) (2020-11-26)


### BREAKING CHANGES

* [See 0.29 migration guide](/docs/migration-guides/0.29.md)


### Bug Fixes

* **auth:** azuread in prod ([#377](https://github.com/startupjs/startupjs/issues/377)) ([91a2dbe](https://github.com/startupjs/startupjs/commit/91a2dbe27ddff0ef2605f54f7e8430865df6ebd0))
* **auth:** tab event ([#384](https://github.com/startupjs/startupjs/issues/384)) ([54987f1](https://github.com/startupjs/startupjs/commit/54987f17881b3629dc5b3babbfe5add3dffc7b8e))
* **ui/Link:** fix non-clickability on native when link is like a button ([#382](https://github.com/startupjs/startupjs/issues/382)) ([710dd76](https://github.com/startupjs/startupjs/commit/710dd764e02b94d39318bff57a27a44c4bbf3560))
* **ui/SmartSidebar:** remove default open for drawer ([#385](https://github.com/startupjs/startupjs/issues/385)) ([9c47f21](https://github.com/startupjs/startupjs/commit/9c47f21b56a2355953a0444b11765dda153bbfad))
* **ui/Tag:** remove proptypes ([#375](https://github.com/startupjs/startupjs/issues/375)) ([ce4cdfc](https://github.com/startupjs/startupjs/commit/ce4cdfcbb94344034433c7163d67f4878b7a9bf4))
* **ui/TextInput:** fix passing styles in TextInput component ([#374](https://github.com/startupjs/startupjs/issues/374)) ([a80304b](https://github.com/startupjs/startupjs/commit/a80304b162ee51e8389ec7775a6ee05ef933238e))
* make link text size as common text ([#366](https://github.com/startupjs/startupjs/issues/366)) ([aa7a6df](https://github.com/startupjs/startupjs/commit/aa7a6df5b6993978038155fcd7671860f405619e))
* **ui/Popover:** propTypes ([#359](https://github.com/startupjs/startupjs/issues/359)) ([42b7968](https://github.com/startupjs/startupjs/commit/42b7968034795d0ee0582b6e04a7fd9f9e1239f0))



## [0.28.1](https://github.com/startupjs/startupjs/compare/v0.28.0...v0.28.1) (2020-11-12)


### Bug Fixes

* move restore scroll to separate component ([#357](https://github.com/startupjs/startupjs/issues/357)) ([a25df41](https://github.com/startupjs/startupjs/commit/a25df41f146e79702fa38856c0daac08c201d726))



# [0.28.0](https://github.com/startupjs/startupjs/compare/v0.27.0...v0.28.0) (2020-11-11)


### BREAKING CHANGES

* [See 0.28 migration guide](/docs/migration-guides/0.28.md)


### Bug Fixes

* **docs:** fix inline code view on android ([#354](https://github.com/startupjs/startupjs/issues/354)) ([5ca2f57](https://github.com/startupjs/startupjs/commit/5ca2f5734f5dcb5023ad18ff3fd529852c866e5b))
* **docs/useRestoreScroll:** don't scroll to top of the page on initial render if you are scrolled or don't scroll page yet ([#355](https://github.com/startupjs/startupjs/issues/355)) ([fdb88dc](https://github.com/startupjs/startupjs/commit/fdb88dc5031226d08aca40e8b777bd33f272aa84))
* add scroll view to docs sidebar ([9b32b2f](https://github.com/startupjs/startupjs/commit/9b32b2fd507b44c48b5ba0c8b0945ccc2fa594cb))
* **ui/Checkbox:** fix mobile readonly ([#347](https://github.com/startupjs/startupjs/issues/347)) ([b3cb994](https://github.com/startupjs/startupjs/commit/b3cb99413ec8ba5e94aed7dc58bffb2cc77d7dfe))
* **ui/shadows:** change level 0 in shadows because of ios ([89ba799](https://github.com/startupjs/startupjs/commit/89ba799d314c44e18ec3bc444a6683de5691c29b))



# [0.27.0](https://github.com/startupjs/startupjs/compare/v0.26.9...v0.27.0) (2020-11-09)


### BREAKING CHANGES

* [See 0.27 migration guide](/docs/migration-guides/0.27.md)


### Bug Fixes

* remove cycle imports, fix checkbox view on initial render, remove deprecation in sidebars, close dropdown on caption click ([5fa58c0](https://github.com/startupjs/startupjs/commit/5fa58c05b8e6ce4092fba6f8b5c96359e1a1b436))


### Features

* **ui:** DateTimePicker Component ([#335](https://github.com/startupjs/startupjs/issues/335)) ([b2431b0](https://github.com/startupjs/startupjs/commit/b2431b04cc5b4c491c07e8a89b4ab6f6bb24e64e))


### Reverts

* Revert "Added backend and collection parameters to callback function (#331)" (#336) ([77aee63](https://github.com/startupjs/startupjs/commit/77aee6345eb93b6982826a2da230a2f742b8f67d)), closes [#331](https://github.com/startupjs/startupjs/issues/331) [#336](https://github.com/startupjs/startupjs/issues/336)



## [0.26.9](https://github.com/startupjs/startupjs/compare/v0.26.8...v0.26.9) (2020-11-06)


### Bug Fixes

* **cli:** fix postinstall ([46ce4b5](https://github.com/startupjs/startupjs/commit/46ce4b53457e7a5a05661612ffa8079900c2e22e))



## [0.26.8](https://github.com/startupjs/startupjs/compare/v0.26.7...v0.26.8) (2020-11-04)


### Bug Fixes

* **cli:** postinstall must be a separate script which runs other scripts ([1b0ba5d](https://github.com/startupjs/startupjs/commit/1b0ba5d82f3e214db2b50b311acabe1aba96fd75))


### Features

* **ui:** add Tooltip ([ffad643](https://github.com/startupjs/startupjs/commit/ffad643f5863907b2e3e091d7b1f8495b333fd7d))
* **ui:** add Tooltip + refactor Popover ([761b353](https://github.com/startupjs/startupjs/commit/761b353721ba0171add3845e0fc1371eadbd8c09))



## [0.26.7](https://github.com/startupjs/startupjs/compare/v0.26.6...v0.26.7) (2020-11-03)


### Bug Fixes

* rollback // and /* workaround for comments inside observer(). Need to improve it since it conflicts with things like http:// ([a77652c](https://github.com/startupjs/startupjs/commit/a77652c51a9b8cb100a2335bb272e50f5e74cbba))
* **cli:** postinstall ([#332](https://github.com/startupjs/startupjs/issues/332)) ([139d55d](https://github.com/startupjs/startupjs/commit/139d55d01b9b2058daa6c5d327c313f3e6a4fde3))


### Features

* **Button:** add async functionality ([#327](https://github.com/startupjs/startupjs/issues/327)) ([f15475d](https://github.com/startupjs/startupjs/commit/f15475dfb30553715633d99016c3df80d607a6dc))



## [0.26.6](https://github.com/startupjs/startupjs/compare/v0.26.5...v0.26.6) (2020-10-28)


### Bug Fixes

* **ui/Button:** remove default onPress ([c0cb1b0](https://github.com/startupjs/startupjs/commit/c0cb1b002a881a5ad8b88a2cc07f8626ff0f6ef3))



## [0.26.5](https://github.com/startupjs/startupjs/compare/v0.26.4...v0.26.5) (2020-10-27)



## [0.26.4](https://github.com/startupjs/startupjs/compare/v0.26.3...v0.26.4) (2020-10-26)



## [0.26.3](https://github.com/startupjs/startupjs/compare/v0.26.2...v0.26.3) (2020-10-26)


### Bug Fixes

* **template:** rename dummy filename in fonts folder to .gitallowed so that it's not ignored by npm ([f0cab00](https://github.com/startupjs/startupjs/commit/f0cab00b4ca1fc931491578ef604801023672194))


### Features

* **cli:** add 'yarn init-project' executed from the monorepo root which creates a test project at './temp/app' ([40c7fa5](https://github.com/startupjs/startupjs/commit/40c7fa5d3e5c1881c3ab8269d4356de03f5dea4b))
* **ui:** add Tabs component ([#319](https://github.com/startupjs/startupjs/issues/319)) ([581b676](https://github.com/startupjs/startupjs/commit/581b67685cd40128aecf2f9a065ddc28326bc804))
* **ui:** custom tag for Multiselect + docs ([#317](https://github.com/startupjs/startupjs/issues/317)) ([4a3b8d7](https://github.com/startupjs/startupjs/commit/4a3b8d7a08c90b601e300df3381a286ea0c49625))



## [0.26.2](https://github.com/startupjs/startupjs/compare/v0.26.1...v0.26.2) (2020-10-23)


### Bug Fixes

* **ui/Button:** rollback Button background fix. Functionality degradation: hover and active states of filled buttons are not working. ([1ed5810](https://github.com/startupjs/startupjs/commit/1ed5810b9cdcdd2212b78a3098668e92ddad47a5))



## [0.26.1](https://github.com/startupjs/startupjs/compare/v0.26.0...v0.26.1) (2020-10-23)


### Bug Fixes

* **cli:** fix font files generation ([33455da](https://github.com/startupjs/startupjs/commit/33455daf245da2030628657bf38ade1d10668d5a))
* **mdx:** support second level of ordered list nesting, improve styles of list marks. ([358168e](https://github.com/startupjs/startupjs/commit/358168e5ec9d5d8bab926652e2771bf8f0583991))



# [0.26.0](https://github.com/startupjs/startupjs/compare/v0.25.2...v0.26.0) (2020-10-23)


### BREAKING CHANGES

* [See 0.26 migration guide](/docs/migration-guides/0.26.md)


### Bug Fixes

* **Menu:** remove redundant ([#323](https://github.com/startupjs/startupjs/issues/323)) ([820f1a4](https://github.com/startupjs/startupjs/commit/820f1a408227bb211e031286dc52e39b5a200ad5))



## [0.25.2](https://github.com/startupjs/startupjs/compare/v0.25.1...v0.25.2) (2020-10-22)


### Bug Fixes

* **ui/shadows:** Add missing shadow opacity ([f0047d7](https://github.com/startupjs/startupjs/commit/f0047d79b7a5da0d9b8dbcaaffc8fe1c0921dc70))



## [0.25.1](https://github.com/startupjs/startupjs/compare/v0.25.0...v0.25.1) (2020-10-22)


### Bug Fixes

* **Button:** add hoverStyle and activeStyle for outlined and text variants ([#322](https://github.com/startupjs/startupjs/issues/322)) ([760a404](https://github.com/startupjs/startupjs/commit/760a4046ecdf5fc2441676d1786f7ab12dbf22a3))
* **constructor:** fix variable name conflicts ([#321](https://github.com/startupjs/startupjs/issues/321)) ([acd4633](https://github.com/startupjs/startupjs/commit/acd4633396d67ff573eeac07e866c6689f9cb6f6))
* **ui/Sidebar:** remove animations to improve UX and performance.
* **docs:** add topbar with the button to toggle sidebar. deps: upgrade react-native-web to 14.x ([2b349cc](https://github.com/startupjs/startupjs/commit/2b349cc020d74585aba0b77bd6bdd8773c665803))


### Features

* **fonts:** automation ([#318](https://github.com/startupjs/startupjs/issues/318)) ([2f863e3](https://github.com/startupjs/startupjs/commit/2f863e3068260f64eeac444e8222bf625bdc6bdf))



# [0.25.0](https://github.com/startupjs/startupjs/compare/v0.24.4...v0.25.0) (2020-10-20)


### BREAKING CHANGES

* [See 0.25 migration guide](/docs/migration-guides/0.25.md)


### Bug Fixes

* **bundler:** improve replaceObserverLoader to ignore comments.
* **vite:** remove duplicated loaders ([58562e8](https://github.com/startupjs/startupjs/commit/58562e80f6f0d00bf18e053c7423a76623fc9fea))
* **docs:** prevent save scroll when route change ([#316](https://github.com/startupjs/startupjs/issues/316)) ([0e49625](https://github.com/startupjs/startupjs/commit/0e496250b68b783e6396d1fa7ab5535327ba5754))
* **docs/Constructor:** use value as object due to a racer patch ([#311](https://github.com/startupjs/startupjs/issues/311)) ([d470f0e](https://github.com/startupjs/startupjs/commit/d470f0e089b43ae196ddb200f3833d10a9d0e9ef))
* **ui:** autoSuggest on mobile ([#310](https://github.com/startupjs/startupjs/issues/310)) ([cd0a11e](https://github.com/startupjs/startupjs/commit/cd0a11e339966e59e52acac4799d97c7d256dfea))


### Features

* **ui:** remove support for JS configuration from `startupjs.config.cjs` completely. Override only in stylus in $UI. ([0911328](https://github.com/startupjs/startupjs/commit/0911328bec8e8d2c007e765129a76e2837e27dc0))



## [0.24.4](https://github.com/startupjs/startupjs/compare/v0.24.3...v0.24.4) (2020-10-17)


### Bug Fixes

* **babel-preset-startupjs:** add a special var for snowpack -- SNOWPACK_WEB ([2023860](https://github.com/startupjs/startupjs/commit/2023860a9e80f3aa305b6c2b835155f78b3d2789))



## [0.24.3](https://github.com/startupjs/startupjs/compare/v0.24.2...v0.24.3) (2020-10-17)


### Bug Fixes

* remove react-native-web patch ([7b897f8](https://github.com/startupjs/startupjs/commit/7b897f88c0166e29e9ad0b3bbbf2930c8ef02ef3))



## [0.24.2](https://github.com/startupjs/startupjs/compare/v0.24.1...v0.24.2) (2020-10-17)


### Features

* **babel-preset-startupjs:** add support for snowpack -- pass BABEL_ENV=web_snowpack ([208ffb3](https://github.com/startupjs/startupjs/commit/208ffb35de48f5f346995f630685204a154e77a3))



## [0.24.1](https://github.com/startupjs/startupjs/compare/v0.23.53...v0.24.1) (2020-10-16)


### BREAKING CHANGES

* [See 0.24 migration guide](/docs/migration-guides/0.24.md)


### Bug Fixes

* rename table folder ([2d34b31](https://github.com/startupjs/startupjs/commit/2d34b31405050157a58db59b5a2103b1543c49e2))
* rename table folder ([2119329](https://github.com/startupjs/startupjs/commit/211932974a3827db4db3575f91ccad7723ce84e4))



## [0.23.53](https://github.com/startupjs/startupjs/compare/v0.23.52...v0.23.53) (2020-10-16)


### Bug Fixes

* add 'yarn start' on the root level, add yarn.lock ([5fd459e](https://github.com/startupjs/startupjs/commit/5fd459eee8bc8cb6bf1c68049afcd731bb1305b5))


### Features

* **ui/Div:** add prop onLongPress ([#309](https://github.com/startupjs/startupjs/issues/309)) ([bf75674](https://github.com/startupjs/startupjs/commit/bf756744bd46b1e80f27ce3ef4292814aaaa2672))



## [0.23.52](https://github.com/startupjs/startupjs/compare/v0.23.51...v0.23.52) (2020-10-15)


### Features

* **deploy:** Make _ZONE env var optional. By default 'us-east1-d' is used. ([eb43fc4](https://github.com/startupjs/startupjs/commit/eb43fc4e19491071ec0893024223e2d22651c333))



## [0.23.51](https://github.com/startupjs/startupjs/compare/v0.23.50...v0.23.51) (2020-10-14)


### Bug Fixes

* **cli:** remove extra react-native-svg dep from ui (it's already being installed by base startupjs project) ([a9d6dcd](https://github.com/startupjs/startupjs/commit/a9d6dcd91c690deedb9ee0db8fcdddcd208fcfde))
* **prop-types:** improve prop types validation in components ([#301](https://github.com/startupjs/startupjs/issues/301)) ([81d7a1d](https://github.com/startupjs/startupjs/commit/81d7a1dc06b633a4cac845984285a7d2ec3fd51e))


### Features

* **deploy:** add applyVersion function and the 'batch --version-only' mode to only update the deployment of the server container ([27a76a3](https://github.com/startupjs/startupjs/commit/27a76a37cf23f9538156cfb28b56f723e0766db9))
* Implement @startupjs/sharedb-schema ([#289](https://github.com/startupjs/startupjs/issues/289)) ([63adcb5](https://github.com/startupjs/startupjs/commit/63adcb5d7e564a6638005c8d319f811098b1b32d))



## [0.23.50](https://github.com/startupjs/startupjs/compare/v0.23.49...v0.23.50) (2020-10-12)


### Bug Fixes

* **ui:** rm mixin usage, improve usage of options prop ([#293](https://github.com/startupjs/startupjs/issues/293)) ([2b64a40](https://github.com/startupjs/startupjs/commit/2b64a40a084442a3ac426a07c71614d0a4a7c668))



## [0.23.49](https://github.com/startupjs/startupjs/compare/v0.23.48...v0.23.49) (2020-10-09)



## [0.23.48](https://github.com/startupjs/startupjs/compare/v0.23.47...v0.23.48) (2020-10-09)


### Bug Fixes

* **ui/Slicer:** search ([#281](https://github.com/startupjs/startupjs/issues/281)) ([f7bd5eb](https://github.com/startupjs/startupjs/commit/f7bd5eb2a517dd64aaa6910ca0547ccc29992c63))



## [0.23.47](https://github.com/startupjs/startupjs/compare/v0.23.46...v0.23.47) (2020-10-06)


### Bug Fixes

* **deploy:** fix node alpine image version ([6cbb1ef](https://github.com/startupjs/startupjs/commit/6cbb1eff4fb130bbb7e7e4303980fe75f094fbb9))



## [0.23.46](https://github.com/startupjs/startupjs/compare/v0.23.45...v0.23.46) (2020-10-01)



## [0.23.45](https://github.com/startupjs/startupjs/compare/v0.23.44...v0.23.45) (2020-09-29)



## [0.23.44](https://github.com/startupjs/startupjs/compare/v0.23.43...v0.23.44) (2020-09-29)


### Bug Fixes

* **app:** fix layout rerenders when location is changed ([#283](https://github.com/startupjs/startupjs/issues/283)) ([4bec95b](https://github.com/startupjs/startupjs/commit/4bec95b21857dcfd14766eb5c8ca232a3284d890))
* **routes-middleware:** remove layout styles ([#284](https://github.com/startupjs/startupjs/issues/284)) ([a4e302a](https://github.com/startupjs/startupjs/commit/a4e302aea6dc3a47868f7ab9ef92042bfa296f7e))
* **scripts/babel:** add ui/hooks to MODULE_DIRS ([#282](https://github.com/startupjs/startupjs/issues/282)) ([8f47be1](https://github.com/startupjs/startupjs/commit/8f47be1233650c3fd8d64332c18a9ef970e30547))


### Features

* **ui/ModalContent:** add ContentComponent ([#279](https://github.com/startupjs/startupjs/issues/279)) ([ab9af5e](https://github.com/startupjs/startupjs/commit/ab9af5efc9d416956b3133256e550affdfb099ed))



## [0.23.43](https://github.com/startupjs/startupjs/compare/v0.23.42...v0.23.43) (2020-09-10)


### Bug Fixes

* **babel-preset-startupjs:** Fix optional chaining in esNext preset for web ([9265105](https://github.com/startupjs/startupjs/commit/926510573514a9a09ccc76d8ad5bae2b90965717))



## [0.23.42](https://github.com/startupjs/startupjs/compare/v0.23.41...v0.23.42) (2020-09-07)


### Features

* **ui:** Slicer doc ([#273](https://github.com/startupjs/startupjs/issues/273)) ([05f2ec5](https://github.com/startupjs/startupjs/commit/05f2ec57a554133151f14ac3377cdc883e5860a5))



## [0.23.41](https://github.com/startupjs/startupjs/compare/v0.23.39...v0.23.41) (2020-09-07)


### Bug Fixes

* **ui:** AutoSuggest scroll ([#267](https://github.com/startupjs/startupjs/issues/267)) ([1b1e140](https://github.com/startupjs/startupjs/commit/1b1e1400b2547cc3dcb463a3072582ec39bb1760))
* **ui:** Popover remove viewCase ([#271](https://github.com/startupjs/startupjs/issues/271)) ([73f32d6](https://github.com/startupjs/startupjs/commit/73f32d6a55ece3f1173d9a10be3163288570117f))
* remove obsolete todo ([904c905](https://github.com/startupjs/startupjs/commit/904c9053128eaccc9bdbe3fac515cf0e46126eae))


### Features

* **ui:** add Slicer ([#266](https://github.com/startupjs/startupjs/issues/266)) ([03c5459](https://github.com/startupjs/startupjs/commit/03c545933996901e85c710f87c0b7435375fdfc7))



## [0.23.39](https://github.com/startupjs/startupjs/compare/v0.23.38...v0.23.39) (2020-09-03)


### Features

* **bundler:** Allow to :export hash from stylus directly to js. Refactor UI config ([#259](https://github.com/startupjs/startupjs/issues/259)) ([fdd41a0](https://github.com/startupjs/startupjs/commit/fdd41a05c04c83939ff597f9097c7b840c6d81bc))
* **ui/Content:** add default style(width 100%, align) ([#263](https://github.com/startupjs/startupjs/issues/263)) ([f649ab9](https://github.com/startupjs/startupjs/commit/f649ab9fa8ec606c70671283bb8017e26880f2da))



## [0.23.38](https://github.com/startupjs/startupjs/compare/v0.23.37...v0.23.38) (2020-09-03)


### Bug Fixes

* **ui/Checkbox:** props ([#258](https://github.com/startupjs/startupjs/issues/258)) ([d620dc7](https://github.com/startupjs/startupjs/commit/d620dc7c65c0b875b73ec2a6ae089cac84bb2bc8))



## [0.23.37](https://github.com/startupjs/startupjs/compare/v0.23.36...v0.23.37) (2020-08-31)


### Bug Fixes

* **babel-plugins:** replace 'files' with .npmignore ([3cafdff](https://github.com/startupjs/startupjs/commit/3cafdff0991dacb0a08d0cb6ea80d2dd1821dea4))



## [0.23.36](https://github.com/startupjs/startupjs/compare/v0.23.35...v0.23.36) (2020-08-31)


### Bug Fixes

* add missing dep ([f476b06](https://github.com/startupjs/startupjs/commit/f476b06fa4636240750a65928566ec32ddc2ce21))



## [0.23.35](https://github.com/startupjs/startupjs/compare/v0.23.34...v0.23.35) (2020-08-31)


### Bug Fixes

* **backend:** Validate schema only if not in production ([960f191](https://github.com/startupjs/startupjs/commit/960f19174b156062e8e503867c119ef7276ed9bd))
* remove prettier config. We use custom eslint config with many rules instead. ([2b78333](https://github.com/startupjs/startupjs/commit/2b78333e9e748a7c98b3b0a1ea02f7f126f36f8e))



## [0.23.34](https://github.com/startupjs/startupjs/compare/v0.23.33...v0.23.34) (2020-08-31)


### Bug Fixes

* **docker:** Fix batch in deploy script ([6161945](https://github.com/startupjs/startupjs/commit/6161945623dcffaf83d784c949b8a43463d4e986))
* **ui/styleguide:** change Components icon in docs ([837b0ff](https://github.com/startupjs/startupjs/commit/837b0ff8141a6ca102f90bc0a17f1785ad38d6ae))



## [0.23.33](https://github.com/startupjs/startupjs/compare/v0.23.32...v0.23.33) (2020-08-29)


### Features

* add support for `::part()` css selector, `part` jsx attribute, scoped styl`` and css`` functions ([#254](https://github.com/startupjs/startupjs/issues/254)) ([0a8b12d](https://github.com/startupjs/startupjs/commit/0a8b12dd79d71d1298ff0a56b5b0bbcdada20604))



## [0.23.32](https://github.com/startupjs/startupjs/compare/v0.23.31...v0.23.32) (2020-08-21)


### Features

* Upgrade racer-schema to latest, validate schema with racer-schema if the validateSchema: true is passed. ([a1da8c4](https://github.com/startupjs/startupjs/commit/a1da8c4da61ad3294b7ec9d53c6af7e848de26de))
* **data:** :sparkles: Add to backend racer-schema. ([#257](https://github.com/startupjs/startupjs/issues/257)) ([000cdbf](https://github.com/startupjs/startupjs/commit/000cdbfab1ad829f2ba60314ee2dc74c232d26fb))



## [0.23.31](https://github.com/startupjs/startupjs/compare/v0.23.30...v0.23.31) (2020-08-21)


### Bug Fixes

* **ui/Popover:** refactor ([#249](https://github.com/startupjs/startupjs/issues/249)) ([498e1f5](https://github.com/startupjs/startupjs/commit/498e1f54b2fd4c6646b837595c60b9e35377347b))


### Features

* **Menu:** add prop activeColor ([#255](https://github.com/startupjs/startupjs/issues/255)) ([e8bed5a](https://github.com/startupjs/startupjs/commit/e8bed5a1be2c3a6aeadbd782a38c74a017d3cd1d))



## [0.23.30](https://github.com/startupjs/startupjs/compare/v0.23.29...v0.23.30) (2020-08-12)


### Bug Fixes

* add protection from commiting private npm keys ([5fc42dd](https://github.com/startupjs/startupjs/commit/5fc42dd4df3682b8808c333b030e9072e64be460))



## [0.23.29](https://github.com/startupjs/startupjs/compare/v0.23.28...v0.23.29) (2020-08-07)


### Bug Fixes

* **ui/Popover:** zIndex ([be497d0](https://github.com/startupjs/startupjs/commit/be497d0cbd16ab58d20376cbbdeb93e79ba7d317))
* add missing deploy commands ([7e45fe3](https://github.com/startupjs/startupjs/commit/7e45fe3db918a6e11258084980b5f6d57ee8ae5a))
* **deploy:** version deploy docker image. Create full and batched cloudbuild examples. ([e24ef81](https://github.com/startupjs/startupjs/commit/e24ef818c5c4009c0d7e246a5011bc149f34beb4))


### Features

* **ui:** add radius(l) for 8px border-radius ([7c452e7](https://github.com/startupjs/startupjs/commit/7c452e742fa2de572c75d082affcc3047fbda393))



## [0.23.28](https://github.com/startupjs/startupjs/compare/v0.23.27...v0.23.28) (2020-08-03)


### Bug Fixes

* move deployment to a standalone docker image ([#250](https://github.com/startupjs/startupjs/issues/250)) ([9b3ba4e](https://github.com/startupjs/startupjs/commit/9b3ba4efcbd67fd23c7be29cd7a154788d9dc3c6))


### Features

* **ui/Drawer:** add shadow ([#246](https://github.com/startupjs/startupjs/issues/246)) ([9664d87](https://github.com/startupjs/startupjs/commit/9664d8751b7084362d128895bd4c8d6a5be8d7ab))



## [0.23.27](https://github.com/startupjs/startupjs/compare/v0.23.26...v0.23.27) (2020-07-31)


### Bug Fixes

* **vite-plugin-startupjs:** move stylus to peer deps ([94a9b86](https://github.com/startupjs/startupjs/commit/94a9b86ec92094b8a57abab8a71cf2efabec5c95))
* **ui/Dropdown:** refactor ([e2c1a98](https://github.com/startupjs/startupjs/commit/e2c1a98d5558e1e588c0e5d7f1bc61b939e2083a))



## [0.23.26](https://github.com/startupjs/startupjs/compare/v0.23.25...v0.23.26) (2020-07-30)



## [0.23.25](https://github.com/startupjs/startupjs/compare/v0.23.24...v0.23.25) (2020-07-23)


### Bug Fixes

* **ui/AutoSuggest:** bug `onBlur` ([0839376](https://github.com/startupjs/startupjs/commit/08393765a0e81a3b3d2e3e7e036200e45a0c49a1))



## [0.23.24](https://github.com/startupjs/startupjs/compare/v0.23.23...v0.23.24) (2020-07-22)


### Bug Fixes

* **ui:** fix passing `inputStyle` to the actual input. Add additional `wrapperStyle`. ([70bba2c](https://github.com/startupjs/startupjs/commit/70bba2c40cbd456908891b830ced72d769d1129e))



## [0.23.23](https://github.com/startupjs/startupjs/compare/v0.23.22...v0.23.23) (2020-07-22)


### Bug Fixes

* **ui/Checkbox:** add flex-shrink for label ([#231](https://github.com/startupjs/startupjs/issues/231)) ([8a1c698](https://github.com/startupjs/startupjs/commit/8a1c698d2af9ccd98af72ba5817c70a99012bcf0))
* **mdx:** handle case when there is no language ([#234](https://github.com/startupjs/startupjs/issues/234)) ([33564fa](https://github.com/startupjs/startupjs/commit/33564fa26b9a2b216df1a54c0ce6ada882096ab6))
* **ui/TextInput:** fix description props ([#232](https://github.com/startupjs/startupjs/issues/232)) ([91a6006](https://github.com/startupjs/startupjs/commit/91a6006dd92d6802e39a5d57cf26e91d543b89d5))



## [0.23.22](https://github.com/startupjs/startupjs/compare/v0.23.21...v0.23.22) (2020-07-22)


### Bug Fixes

* **ui/Link:** open external url in new tab ([#229](https://github.com/startupjs/startupjs/issues/229)) ([34de9d3](https://github.com/startupjs/startupjs/commit/34de9d3ae58d4e61db8b79bbe4649195c40b913e))



## [0.23.21](https://github.com/startupjs/startupjs/compare/v0.23.20...v0.23.21) (2020-07-21)



## [0.23.20](https://github.com/startupjs/startupjs/compare/v0.23.19...v0.23.20) (2020-07-20)



## [0.23.19](https://github.com/startupjs/startupjs/compare/v0.23.18...v0.23.19) (2020-07-20)



## [0.23.18](https://github.com/startupjs/startupjs/compare/v0.23.17...v0.23.18) (2020-07-17)



## [0.23.17](https://github.com/startupjs/startupjs/compare/v0.23.16...v0.23.17) (2020-07-14)


### Bug Fixes

* **bundler:** fix mobile builds ([#215](https://github.com/startupjs/startupjs/issues/215)) ([e6bf485](https://github.com/startupjs/startupjs/commit/e6bf485aecf883321b0628ce7d41d4cdda09a39d))
* **ui:** fix broken styles ([#216](https://github.com/startupjs/startupjs/issues/216)) ([5d98382](https://github.com/startupjs/startupjs/commit/5d98382073e409040cf85f938a2da01a96f615c5))



## [0.23.16](https://github.com/startupjs/startupjs/compare/v0.23.15...v0.23.16) (2020-07-09)


### Features

* **ui/Modal:** add `defaultProps` to modal ([#212](https://github.com/startupjs/startupjs/issues/212)) ([f50a964](https://github.com/startupjs/startupjs/commit/f50a964416b26cc45dea7089bf7e21712b7d61f3))
* **ui/TextInput:** add `iconColor` property ([#213](https://github.com/startupjs/startupjs/issues/213)) ([b02b7a0](https://github.com/startupjs/startupjs/commit/b02b7a04f4719da1f04032237712bae66eeade9c))



## [0.23.15](https://github.com/startupjs/startupjs/compare/v0.23.14...v0.23.15) (2020-07-08)


### Bug Fixes

* **ui/SmartSidebar:** add sidebar option ([#210](https://github.com/startupjs/startupjs/issues/210)) ([f5366b7](https://github.com/startupjs/startupjs/commit/f5366b7ee6b68e464b17fa40e14aea6e8525c3f7))
* **babel-preset-startupjs:** remove redundant `legacyClassnames` ([#209](https://github.com/startupjs/startupjs/issues/209)) ([6b7b027](https://github.com/startupjs/startupjs/commit/6b7b0272010ead99ec94256f55d37a2693458b13))



## [0.23.14](https://github.com/startupjs/startupjs/compare/v0.23.13...v0.23.14) (2020-07-03)


### Features

* **cli:** do async build by default ([bda8a86](https://github.com/startupjs/startupjs/commit/bda8a869ac9c28ecf527d287f8297a1661a6f4c5))



## [0.23.13](https://github.com/startupjs/startupjs/compare/v0.23.12...v0.23.13) (2020-07-03)


### Bug Fixes

* **babel-plugin-dotenv:** allow undefined vars by default ([7b75ca3](https://github.com/startupjs/startupjs/commit/7b75ca38efc5cd0b70328c35e64acd187a9cb474))



## [0.23.12](https://github.com/startupjs/startupjs/compare/v0.23.11...v0.23.12) (2020-07-03)


### Bug Fixes

* **bundler, vite:** fix hot reloading of observer(). Make same transformation as on mobile. ([6f02e21](https://github.com/startupjs/startupjs/commit/6f02e2113a3136297bc2347b3a66aee5ce7c7d28))



## [0.23.11](https://github.com/startupjs/startupjs/compare/v0.23.10...v0.23.11) (2020-07-03)


### Bug Fixes

* **server:** always initalize sharedb-hooks ([#208](https://github.com/startupjs/startupjs/issues/208)) ([50c051a](https://github.com/startupjs/startupjs/commit/50c051aed07b9271750c72ffae88fd1e9f92e784))
* **vite:** compile `eventemitter3` ([f74168a](https://github.com/startupjs/startupjs/commit/f74168a92dd32976a222ee9cffc1d7c856b499c6))



## [0.23.10](https://github.com/startupjs/startupjs/compare/v0.23.9...v0.23.10) (2020-07-03)


### Bug Fixes

* **docs:** move startupjs to peer deps ([bdf23aa](https://github.com/startupjs/startupjs/commit/bdf23aaffd963c3ead39c4425739cb2705b5631a))



## [0.23.9](https://github.com/startupjs/startupjs/compare/v0.23.8...v0.23.9) (2020-07-03)


### Bug Fixes

* **cli:** watch only server-side related folders when running pure node ([a65fbb8](https://github.com/startupjs/startupjs/commit/a65fbb8af0a90a9bb6295d4f7b091cd291a4e543))



## [0.23.8](https://github.com/startupjs/startupjs/compare/v0.23.7...v0.23.8) (2020-07-03)


### Bug Fixes

* **bundler:** don't compile `@startupjs/server` ([16a1200](https://github.com/startupjs/startupjs/commit/16a1200d5cb2add694e4153bb75bb7047ebdcb10))



## [0.23.7](https://github.com/startupjs/startupjs/compare/v0.23.6...v0.23.7) (2020-07-03)


### Bug Fixes

* **bundler:** force build extra packages on server ([4db5f32](https://github.com/startupjs/startupjs/commit/4db5f329974b6ec4075dd9dc1972098c8a30d383))



## [0.23.6](https://github.com/startupjs/startupjs/compare/v0.23.5...v0.23.6) (2020-07-03)


### Bug Fixes

* **template:** fix topbar ([470fd91](https://github.com/startupjs/startupjs/commit/470fd9104fcdaf9d8b727f366a0c4121dbc91dec))



## [0.23.5](https://github.com/startupjs/startupjs/compare/v0.23.4...v0.23.5) (2020-07-03)


### Bug Fixes

* **vite:** ignore babel config when using Vite ([6eed3df](https://github.com/startupjs/startupjs/commit/6eed3df79d0afb989fac8accee28674e46a3fe77))



## [0.23.4](https://github.com/startupjs/startupjs/compare/v0.23.3...v0.23.4) (2020-07-03)


### Bug Fixes

* **template:** don't destructure json ([a820880](https://github.com/startupjs/startupjs/commit/a820880d60390cab3982742b3ce188dd50566397))
* **template:** add index.html.
* **vite:** include `startupjs/orm` ([8bc2795](https://github.com/startupjs/startupjs/commit/8bc27950b296ef95b5d60b9b98166eb76c2fb710))
* **vite:** use `eventemitter3` instead of events and mock proper ESM usage for it ([85294df](https://github.com/startupjs/startupjs/commit/85294df810296203b93bd79625380b899c9f034d))



## [0.23.3](https://github.com/startupjs/startupjs/compare/v0.23.2...v0.23.3) (2020-07-02)


### Bug Fixes

* **template:** fix packages ([d033288](https://github.com/startupjs/startupjs/commit/d033288d2ebef1e0f7bbc10283321119a6264187))



## [0.23.2](https://github.com/startupjs/startupjs/compare/v0.23.1...v0.23.2) (2020-07-02)


### Bug Fixes

* **startupjs:** update webpack config extension ([5618a1f](https://github.com/startupjs/startupjs/commit/5618a1fbb4c3f807e6f0c482ff6d9ee58a4f3011))



## [0.23.1](https://github.com/startupjs/startupjs/compare/v0.23.0...v0.23.1) (2020-07-02)



# [0.23.0](https://github.com/startupjs/startupjs/compare/v0.22.11...v0.23.0) (2020-07-02)


### BREAKING CHANGES

* [See 0.23 migration guide](/docs/migration-guides/0.23.md)


### Bug Fixes

* **ui:** fix mobile crash ([#205](https://github.com/startupjs/startupjs/issues/205)) ([b407573](https://github.com/startupjs/startupjs/commit/b407573834b6337ca61b8628b213c1679675c307))



## [0.22.11](https://github.com/startupjs/startupjs/compare/v0.22.10...v0.22.11) (2020-06-30)


### Bug Fixes

* **bundler:** fix errors with new lines in MDX ([6fd22bd](https://github.com/startupjs/startupjs/commit/6fd22bd2724adb9d5a83c1cae02301cca579c4dd))


### Features

* **ui/ObjectInput:** refactor and add label support
* **ui/TextInput:** add `inputStyle` prop.


## [0.22.10](https://github.com/startupjs/startupjs/compare/v0.22.9...v0.22.10) (2020-06-30)


### Bug Fixes

* **ui:** popups style wrapper ([699f911](https://github.com/startupjs/startupjs/commit/699f911e621f997a8b0959d6bd535f8a9fd34027))



## [0.22.9](https://github.com/startupjs/startupjs/compare/v0.22.8...v0.22.9) (2020-06-30)


### Bug Fixes

* **ui:** popups ([#201](https://github.com/startupjs/startupjs/issues/201)) ([3614bd4](https://github.com/startupjs/startupjs/commit/3614bd4eb997b659037201a0d9726f4ebe601a01))
* **ui/Popover:** ref undefined ([af23d93](https://github.com/startupjs/startupjs/commit/af23d9373b277991d96d090f7bee972a31b652e4))


### Features

* **ui:** add `AutoSuggest` component ([#200](https://github.com/startupjs/startupjs/issues/200)) ([4b753f4](https://github.com/startupjs/startupjs/commit/4b753f4e75f59b9fec79d1847896d59a9c2838c3))
* **ui:** add `Dropdown` component ([f4efe77](https://github.com/startupjs/startupjs/commit/f4efe777506b658f01d4fab40e2ad7f2b944a820))
* **ui:** add `Popover` component ([244bb35](https://github.com/startupjs/startupjs/commit/244bb35d15fcb17dfc8fb564405baa095b642fc9))
* **ui:** extend `Drawer` component ([416b433](https://github.com/startupjs/startupjs/commit/416b4338a3a2e75cc90957ca7413905f5ac27385))
* **ui:** modal pure variant ([37cd87c](https://github.com/startupjs/startupjs/commit/37cd87cb76320657631d9940dad536deeb989cfc))



## [0.22.8](https://github.com/startupjs/startupjs/compare/v0.22.7...v0.22.8) (2020-06-26)


### Bug Fixes

* **docs:** set dismiss label of options to 'Close' ([dc48b2f](https://github.com/startupjs/startupjs/commit/dc48b2f401d4ae655d2281ba869460297311ed1b))



## [0.22.7](https://github.com/startupjs/startupjs/compare/v0.22.6...v0.22.7) (2020-06-26)


### Bug Fixes

* **docs:** more spacing on tablet+ ([21f01f4](https://github.com/startupjs/startupjs/commit/21f01f48c45fe6e4cd4c92a9870e3ac8dd9959ee))



## [0.22.6](https://github.com/startupjs/startupjs/compare/v0.22.5...v0.22.6) (2020-06-26)


### Bug Fixes

* **ui:** improve `Checkbox` and `Radio` inputs styles, remove extra spacing ([26746fa](https://github.com/startupjs/startupjs/commit/26746fab179d11288c9e2b9a0e53a94ff1b9d8d0))



## [0.22.5](https://github.com/startupjs/startupjs/compare/v0.22.4...v0.22.5) (2020-06-26)


### Bug Fixes

* **docs:** limit content width ([316bbd7](https://github.com/startupjs/startupjs/commit/316bbd759c546a143982d81dea18f6df985eb476))
* **ui/TextInput:** fix min-width on web
* **ui/Modal:** fix passing button labels ([c5ad5b8](https://github.com/startupjs/startupjs/commit/c5ad5b888d543ac42bc4d96908495baae84afe82))


### Features

* **ui/Select:** add `showEmptyValue` option


## [0.22.4](https://github.com/startupjs/startupjs/compare/v0.22.3...v0.22.4) (2020-06-25)


### Bug Fixes

* **server:** always copy `MONGO_URL` to env if it's present in nconf but not in process.env ([c0d29ea](https://github.com/startupjs/startupjs/commit/c0d29ea234e2d6bda1cb8032790254b39ff1d4b2))



## [0.22.3](https://github.com/startupjs/startupjs/compare/v0.22.2...v0.22.3) (2020-06-25)


### Bug Fixes

* **ui:** export `Select` component ([d7725f2](https://github.com/startupjs/startupjs/commit/d7725f2f6ad1f46a26d0e5512d80b9cefb23a516))



## [0.22.2](https://github.com/startupjs/startupjs/compare/v0.22.0...v0.22.2) (2020-06-25)


### Bug Fixes

* **app:** update `$render.params` if search is changed ([#191](https://github.com/startupjs/startupjs/issues/191)) ([b5c00e2](https://github.com/startupjs/startupjs/commit/b5c00e27bc037a6f9c3e899a4756bd6f224c4b6d))


### Features

* **ui:** add `Select` component and support it in Input ([a55b130](https://github.com/startupjs/startupjs/commit/a55b130b57cc4ea6af46026432faf0530fc5bf46))
