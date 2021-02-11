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
