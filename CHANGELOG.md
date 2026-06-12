## [1.2.0](https://github.com/edp5/kompagnon/compare/v1.1.1...v1.2.0) (2026-06-12)

### 🚀 New features

* **api:** add swagger JSDoc markdown template generator for routes ([#555](https://github.com/edp5/kompagnon/issues/555)) ([a1c4005](https://github.com/edp5/kompagnon/commit/a1c4005d89846c769304a7ee43591e17f7cec350))
* **api:** route to get a journey's information ([#620](https://github.com/edp5/kompagnon/issues/620)) ([#631](https://github.com/edp5/kompagnon/issues/631)) ([4339470](https://github.com/edp5/kompagnon/commit/4339470bd342511e61d5b5b2daf22bd1ff5e8b43))
* **api:** usecase to call the matching algorithm api ([#633](https://github.com/edp5/kompagnon/issues/633)) ([#635](https://github.com/edp5/kompagnon/issues/635)) ([552fbf9](https://github.com/edp5/kompagnon/commit/552fbf9f319822af70eb8c29622144b44d789e8b))
* Create a route to update status of found journey ([#630](https://github.com/edp5/kompagnon/issues/630)) ([19d825f](https://github.com/edp5/kompagnon/commit/19d825f3203c5248f4783795fbb9f19482eefdcf))
* implement issue 632 - journey view, list, and public transit duration model ([#639](https://github.com/edp5/kompagnon/issues/639)) ([ef8ea34](https://github.com/edp5/kompagnon/commit/ef8ea34bb3724988a5e1ce46d8a6a10b9581ec32))
* Implemente route to record a new journey ([#517](https://github.com/edp5/kompagnon/issues/517)) ([0734fa1](https://github.com/edp5/kompagnon/commit/0734fa1afdfe22c2d74dedf7979cb817ff9e7f56))
* **web:** clean web application ([#576](https://github.com/edp5/kompagnon/issues/576)) ([838f0d3](https://github.com/edp5/kompagnon/commit/838f0d3548cf5b5fa8c1e72f3068611064182741))
* **web:** trip information form to start a journey search ([#619](https://github.com/edp5/kompagnon/issues/619)) ([#629](https://github.com/edp5/kompagnon/issues/629)) ([fc86823](https://github.com/edp5/kompagnon/commit/fc86823d18c895ccfd4a4413ac4079111696eec0))

### 🐛 Bug Fixes

* Update auto-merge condition for open pull requests ([#538](https://github.com/edp5/kompagnon/issues/538)) ([45f05a3](https://github.com/edp5/kompagnon/commit/45f05a30cce7234cf604d753e2df5c0de388c165))
* Use the jwt token in headers to activate an account ([#634](https://github.com/edp5/kompagnon/issues/634)) ([9006aa3](https://github.com/edp5/kompagnon/commit/9006aa3c991605f37cf30c00f61fdd29c61a5530))

### 🛠️ Technical

* Add a code owner to notify specific teams ([#577](https://github.com/edp5/kompagnon/issues/577)) ([4f94bf4](https://github.com/edp5/kompagnon/commit/4f94bf449a0df7f70f68e6ff58b95852bc80aab9))
* Add some constants and fix the databasebuilder ([#608](https://github.com/edp5/kompagnon/issues/608)) ([c40cde9](https://github.com/edp5/kompagnon/commit/c40cde9d9116ab4162a60d9ccd0323395abe8120))
* Align .editorconfig with codebase conventions ([#598](https://github.com/edp5/kompagnon/issues/598)) ([ffea1d4](https://github.com/edp5/kompagnon/commit/ffea1d4f737d5ce985e60b9c45f2e5980593fdd9))
* Check migrations when new migration is added ([#596](https://github.com/edp5/kompagnon/issues/596)) ([bbf424a](https://github.com/edp5/kompagnon/commit/bbf424aba368b0e9cfbd741ff8d854e482fd044d))
* Enforce the database builder ([#579](https://github.com/edp5/kompagnon/issues/579)) ([3bf23fb](https://github.com/edp5/kompagnon/commit/3bf23fba5c16dbdfa32a06b2d1ec42972bd62960))
* Labeled codecov upload ([#548](https://github.com/edp5/kompagnon/issues/548)) ([428906d](https://github.com/edp5/kompagnon/commit/428906daf25d4e98bcbbc9dcea8c2ea565e2a561))
* Setup error handler ([#628](https://github.com/edp5/kompagnon/issues/628)) ([5c33e39](https://github.com/edp5/kompagnon/commit/5c33e39402f65cb69910abbab5821e5acac801f7))
* Use edp5 docker action ([#597](https://github.com/edp5/kompagnon/issues/597)) ([b164afd](https://github.com/edp5/kompagnon/commit/b164afd9979533fac7ca1c2e5e587f547b9fa0e1))

### 🔖 Version Bumps

* Bump eslint ([#609](https://github.com/edp5/kompagnon/issues/609)) ([006ffaf](https://github.com/edp5/kompagnon/commit/006ffaf59a59e6b424504822f448eb57f0c6591d))
* **deps-dev:** bump @eslint/json from 1.2.0 to 2.0.0 ([#593](https://github.com/edp5/kompagnon/issues/593)) ([861c030](https://github.com/edp5/kompagnon/commit/861c0307fe5ee191e03aa66ae3551a2a76c84468))
* **deps-dev:** bump @eslint/markdown from 8.0.1 to 8.0.2 ([#570](https://github.com/edp5/kompagnon/issues/570)) ([a9812f2](https://github.com/edp5/kompagnon/commit/a9812f298266eeddc037365c6f36ac1b8bc60275))
* **deps-dev:** bump @vitejs/plugin-vue from 6.0.6 to 6.0.7 in /admin ([#563](https://github.com/edp5/kompagnon/issues/563)) ([bf71f30](https://github.com/edp5/kompagnon/commit/bf71f303ab88ef5106b39eda1487f046e8d6cddd))
* **deps-dev:** bump @vitejs/plugin-vue from 6.0.6 to 6.0.7 in /web ([#552](https://github.com/edp5/kompagnon/issues/552)) ([94671de](https://github.com/edp5/kompagnon/commit/94671de5f501100010b4a2e5dcc87c7d3f64e0db))
* **deps-dev:** bump @vitest/coverage-v8 from 4.1.4 to 4.1.6 in /web ([#554](https://github.com/edp5/kompagnon/issues/554)) ([7e62a01](https://github.com/edp5/kompagnon/commit/7e62a01bbf223d636fe8e3f3d13cb00ff2b92ec1))
* **deps-dev:** bump @vitest/coverage-v8 from 4.1.5 to 4.1.6 in /admin ([#556](https://github.com/edp5/kompagnon/issues/556)) ([fe3a96f](https://github.com/edp5/kompagnon/commit/fe3a96f2a632b857324e5373187152983c655533))
* **deps-dev:** bump @vitest/coverage-v8 from 4.1.5 to 4.1.6 in /api ([#559](https://github.com/edp5/kompagnon/issues/559)) ([722384d](https://github.com/edp5/kompagnon/commit/722384d7e283404f166db94263f125cd06b558ad))
* **deps-dev:** bump @vitest/coverage-v8 from 4.1.7 to 4.1.8 in /admin ([#611](https://github.com/edp5/kompagnon/issues/611)) ([0379bd9](https://github.com/edp5/kompagnon/commit/0379bd9ac7cdfb2eaceb6064422ae0e8101fcbe7))
* **deps-dev:** bump @vitest/coverage-v8 from 4.1.7 to 4.1.8 in /api ([#613](https://github.com/edp5/kompagnon/issues/613)) ([9223543](https://github.com/edp5/kompagnon/commit/922354342c96e838fc85a9ac5583e345c9e0ab8b))
* **deps-dev:** bump @vitest/coverage-v8 from 4.1.7 to 4.1.8 in /web ([#615](https://github.com/edp5/kompagnon/issues/615)) ([3038f08](https://github.com/edp5/kompagnon/commit/3038f08c57bebf1be9bbf5de16fee7affb360b69))
* **deps-dev:** bump @vitest/eslint-plugin from 1.6.16 to 1.6.17 in /admin ([#557](https://github.com/edp5/kompagnon/issues/557)) ([d93a432](https://github.com/edp5/kompagnon/commit/d93a432a88d95e9d173924a044b35a61844213b3))
* **deps-dev:** bump @vitest/eslint-plugin from 1.6.16 to 1.6.17 in /web ([#561](https://github.com/edp5/kompagnon/issues/561)) ([add8b8e](https://github.com/edp5/kompagnon/commit/add8b8e94ae1592eab03f06112bd156c8212b9bc))
* **deps-dev:** bump @vitest/eslint-plugin from 1.6.17 to 1.6.18 in /admin ([#584](https://github.com/edp5/kompagnon/issues/584)) ([3bb4b45](https://github.com/edp5/kompagnon/commit/3bb4b45aae9eb19c55193f54f03d2bae52d1b43c))
* **deps-dev:** bump @vitest/eslint-plugin from 1.6.17 to 1.6.18 in /web ([#587](https://github.com/edp5/kompagnon/issues/587)) ([7109a11](https://github.com/edp5/kompagnon/commit/7109a11079694bedb521ff9a2cf881e6f8a9af28))
* **deps-dev:** bump @vitest/eslint-plugin from 1.6.18 to 1.6.19 in /admin ([#602](https://github.com/edp5/kompagnon/issues/602)) ([4ad0e0d](https://github.com/edp5/kompagnon/commit/4ad0e0d12bcf34784303c02a1234de950a24ffb9))
* **deps-dev:** bump @vitest/eslint-plugin from 1.6.18 to 1.6.19 in /web ([#606](https://github.com/edp5/kompagnon/issues/606)) ([f46372e](https://github.com/edp5/kompagnon/commit/f46372ecb1350d0cfcb3255e825f3f50de71984e))
* **deps-dev:** bump @vitest/eslint-plugin from 1.6.19 to 1.6.20 in /admin ([#636](https://github.com/edp5/kompagnon/issues/636)) ([6aefd6e](https://github.com/edp5/kompagnon/commit/6aefd6e07e2a0957f088fe1dbeecb024c0a2b170))
* **deps-dev:** bump @vitest/eslint-plugin from 1.6.19 to 1.6.20 in /web ([#638](https://github.com/edp5/kompagnon/issues/638)) ([3156a27](https://github.com/edp5/kompagnon/commit/3156a27d1a2a497c919a6e6e54e77892253b1b7d))
* **deps-dev:** bump @vue/test-utils from 2.4.10 to 2.4.11 in /admin ([#622](https://github.com/edp5/kompagnon/issues/622)) ([9b20a3b](https://github.com/edp5/kompagnon/commit/9b20a3b2c584f7356452c0aba7dd3a0adda7db56))
* **deps-dev:** bump @vue/test-utils from 2.4.10 to 2.4.11 in /web ([#624](https://github.com/edp5/kompagnon/issues/624)) ([fc91710](https://github.com/edp5/kompagnon/commit/fc91710d3819000f9d5a0a42317d5fdbf624c694))
* **deps-dev:** bump eslint from 10.3.0 to 10.4.0 ([#549](https://github.com/edp5/kompagnon/issues/549)) ([6217d27](https://github.com/edp5/kompagnon/commit/6217d27bcd3b9c18a5e20df8a9ee9e06f3ff0f87))
* **deps-dev:** bump eslint from 10.4.0 to 10.4.1 ([#601](https://github.com/edp5/kompagnon/issues/601)) ([ab9c44e](https://github.com/edp5/kompagnon/commit/ab9c44e1706ac5e1669a9e47305b5c4a747f3085))
* **deps-dev:** bump eslint-plugin-jsdoc from 62.9.0 to 63.0.0 ([#571](https://github.com/edp5/kompagnon/issues/571)) ([aecfca4](https://github.com/edp5/kompagnon/commit/aecfca4a80af50cf8388771a23c333fa8f26709f))
* **deps-dev:** bump eslint-plugin-jsdoc from 62.9.0 to 63.0.0 in /api ([#574](https://github.com/edp5/kompagnon/issues/574)) ([a90fc3c](https://github.com/edp5/kompagnon/commit/a90fc3c46da05107fdb323c3592834f3bf63c967))
* **deps-dev:** bump eslint-plugin-jsdoc from 63.0.0 to 63.0.1 ([#600](https://github.com/edp5/kompagnon/issues/600)) ([b228a63](https://github.com/edp5/kompagnon/commit/b228a631c196b12f250def558362e3b3731fa411))
* **deps-dev:** bump eslint-plugin-jsdoc from 63.0.0 to 63.0.1 in /api ([#604](https://github.com/edp5/kompagnon/issues/604)) ([e54bf11](https://github.com/edp5/kompagnon/commit/e54bf115ad477d24b0c6808a2b329587726fa798))
* **deps-dev:** bump eslint-plugin-jsdoc from 63.0.0 to 63.0.1 in /api ([#618](https://github.com/edp5/kompagnon/issues/618)) ([1149676](https://github.com/edp5/kompagnon/commit/1149676da71bb88ef98bad492751dc1de00a280a))
* **deps-dev:** bump eslint-plugin-jsdoc from 63.0.1 to 63.0.2 ([#626](https://github.com/edp5/kompagnon/issues/626)) ([4ba6100](https://github.com/edp5/kompagnon/commit/4ba61008b9f489d154317dcc4eaadc87489fed4b))
* **deps-dev:** bump eslint-plugin-jsdoc from 63.0.1 to 63.0.2 in /api ([#627](https://github.com/edp5/kompagnon/issues/627)) ([fde0748](https://github.com/edp5/kompagnon/commit/fde0748b4beaa0561dbd3ee05a8e632545a206fb))
* **deps-dev:** bump eslint-plugin-vue from 10.8.0 to 10.9.1 in /admin ([#564](https://github.com/edp5/kompagnon/issues/564)) ([dca7a35](https://github.com/edp5/kompagnon/commit/dca7a352edf4c160e81cb0fd281631d0e2c0382e))
* **deps-dev:** bump eslint-plugin-vue from 10.8.0 to 10.9.1 in /web ([#553](https://github.com/edp5/kompagnon/issues/553)) ([4fba4b0](https://github.com/edp5/kompagnon/commit/4fba4b0c70e9c8bfdccb5c71eea22cfd995d622e))
* **deps-dev:** bump eslint-plugin-vue from 10.9.1 to 10.9.2 in /admin ([#612](https://github.com/edp5/kompagnon/issues/612)) ([10369c6](https://github.com/edp5/kompagnon/commit/10369c60e902e1ad12d21e564cbabc769a1b09d3))
* **deps-dev:** bump eslint-plugin-vue from 10.9.1 to 10.9.2 in /web ([#614](https://github.com/edp5/kompagnon/issues/614)) ([94f2499](https://github.com/edp5/kompagnon/commit/94f249900604c3178dbe470edcda4e434a94b3c1))
* **deps-dev:** bump jsdom from 29.1.0 to 29.1.1 in /admin ([#562](https://github.com/edp5/kompagnon/issues/562)) ([627632e](https://github.com/edp5/kompagnon/commit/627632e16c2779c9c422f4e65ff782a8f86e8f23))
* **deps-dev:** bump jsdom from 29.1.0 to 29.1.1 in /web ([#565](https://github.com/edp5/kompagnon/issues/565)) ([8faba40](https://github.com/edp5/kompagnon/commit/8faba409fc80281407cb5ab32868f6ae27b48642))
* **deps-dev:** bump vite from 8.0.13 to 8.0.14 in /admin ([#580](https://github.com/edp5/kompagnon/issues/580)) ([52cdc85](https://github.com/edp5/kompagnon/commit/52cdc8541eac954d5fe23564dc31e6c8297fd139))
* **deps-dev:** bump vite from 8.0.14 to 8.0.16 in /admin ([#610](https://github.com/edp5/kompagnon/issues/610)) ([0ecbf9f](https://github.com/edp5/kompagnon/commit/0ecbf9f3a57373fcfdd972e1237b747256a6fb3d))
* **deps-dev:** bump vite from 8.0.14 to 8.0.16 in /web ([#616](https://github.com/edp5/kompagnon/issues/616)) ([90ed09d](https://github.com/edp5/kompagnon/commit/90ed09d708556c0c6ac763c520e50c4358783267))
* **deps-dev:** bump vite from 8.0.2 to 8.0.13 in /admin ([#551](https://github.com/edp5/kompagnon/issues/551)) ([faa5cb3](https://github.com/edp5/kompagnon/commit/faa5cb33a648f44efcb1947e0ff84dc66c7aefdf))
* **deps-dev:** bump vite from 8.0.2 to 8.0.14 in /web ([#583](https://github.com/edp5/kompagnon/issues/583)) ([483412c](https://github.com/edp5/kompagnon/commit/483412c455e614d1f6bd6018c1939b42c6757970))
* **deps-dev:** bump vitest from 4.1.5 to 4.1.6 in /admin ([#558](https://github.com/edp5/kompagnon/issues/558)) ([4d8eee0](https://github.com/edp5/kompagnon/commit/4d8eee05ef938ec601abee31468978e194a4332c))
* **deps-dev:** bump vitest from 4.1.5 to 4.1.6 in /api ([#560](https://github.com/edp5/kompagnon/issues/560)) ([1661f37](https://github.com/edp5/kompagnon/commit/1661f37337f5b8e39e3fa85b73d1d8befd43c523))
* **deps-dev:** bump vitest from 4.1.6 to 4.1.7 in /admin ([#572](https://github.com/edp5/kompagnon/issues/572)) ([431cbd4](https://github.com/edp5/kompagnon/commit/431cbd4af4e17ffe2038e72188d9e77082e38f5d))
* **deps-dev:** bump vitest from 4.1.6 to 4.1.7 in /api ([#573](https://github.com/edp5/kompagnon/issues/573)) ([bd19695](https://github.com/edp5/kompagnon/commit/bd196951d8a07ca4092a72793182c2fe0345dfdc))
* **deps-dev:** bump vitest from 4.1.6 to 4.1.7 in /web ([#575](https://github.com/edp5/kompagnon/issues/575)) ([036ad11](https://github.com/edp5/kompagnon/commit/036ad1197f1d41589b601e964f5785378ab5c569))
* **deps:** bump codecov/codecov-action from 6 to 7 ([#625](https://github.com/edp5/kompagnon/issues/625)) ([c081492](https://github.com/edp5/kompagnon/commit/c0814927a40079954108eb792cd3e3c7a362a26a))
* **deps:** bump dotenv from 17.3.1 to 17.4.2 in /api ([#582](https://github.com/edp5/kompagnon/issues/582)) ([d2abeb1](https://github.com/edp5/kompagnon/commit/d2abeb1c55708e97889595c906086d58dac0a484))
* **deps:** bump edp5/edp5-actions from 1.3.0 to 1.4.0 ([#569](https://github.com/edp5/kompagnon/issues/569)) ([c7d048c](https://github.com/edp5/kompagnon/commit/c7d048c277f261be4e7c3c2f8e595223fd368564))
* **deps:** bump edp5/edp5-actions from 1.4.0 to 1.5.1 ([#599](https://github.com/edp5/kompagnon/issues/599)) ([59e73c5](https://github.com/edp5/kompagnon/commit/59e73c5a8383b13037fff121ffd0be7e5f369755))
* **deps:** bump knex from 3.1.0 to 3.2.10 in /api ([#588](https://github.com/edp5/kompagnon/issues/588)) ([5bd7ffc](https://github.com/edp5/kompagnon/commit/5bd7ffc734d241f0453ec82e73549f859c3f427d))
* **deps:** bump lodash from 4.17.23 to 4.18.1 in /api ([#568](https://github.com/edp5/kompagnon/issues/568)) ([515d186](https://github.com/edp5/kompagnon/commit/515d1862d52b6d705d37e554eff0786288cdc71f))
* **deps:** bump marked from 17.0.4 to 18.0.4 in /api ([#566](https://github.com/edp5/kompagnon/issues/566)) ([abbfd16](https://github.com/edp5/kompagnon/commit/abbfd16407a6c356dcd372de809e0b0dc33d25f4))
* **deps:** bump marked from 18.0.4 to 18.0.5 in /api ([#623](https://github.com/edp5/kompagnon/issues/623)) ([58bb040](https://github.com/edp5/kompagnon/commit/58bb040f6db6458795fc0a5cc1f8b45cd0d62243))
* **deps:** bump nodemailer from 8.0.1 to 8.0.7 in /api ([#581](https://github.com/edp5/kompagnon/issues/581)) ([bce02aa](https://github.com/edp5/kompagnon/commit/bce02aaf408f83bfa1a64937f6bb70e723927391))
* **deps:** bump nodemailer from 8.0.10 to 8.0.11 in /api ([#637](https://github.com/edp5/kompagnon/issues/637)) ([f50750d](https://github.com/edp5/kompagnon/commit/f50750de66efb56808565cd365a801fb567c923b))
* **deps:** bump nodemailer from 8.0.7 to 8.0.8 in /api ([#589](https://github.com/edp5/kompagnon/issues/589)) ([48165b7](https://github.com/edp5/kompagnon/commit/48165b774746267db97a986e0d0bb403f0de9d08))
* **deps:** bump nodemailer from 8.0.8 to 8.0.9 in /api ([#590](https://github.com/edp5/kompagnon/issues/590)) ([aa5c224](https://github.com/edp5/kompagnon/commit/aa5c224762f87729111eb57735d4b86bab7cbd90))
* **deps:** bump nodemailer from 8.0.9 to 8.0.10 in /api ([#617](https://github.com/edp5/kompagnon/issues/617)) ([af6b790](https://github.com/edp5/kompagnon/commit/af6b790ec4e5b922aba1a090af9c08f212827a90))
* **deps:** bump pg from 8.20.0 to 8.21.0 in /api ([#586](https://github.com/edp5/kompagnon/issues/586)) ([b2d2d76](https://github.com/edp5/kompagnon/commit/b2d2d76a55ffbaeb89178fe7b0595eb05b113470))
* **deps:** bump postgres from 3.4.8 to 3.4.9 in /api ([#567](https://github.com/edp5/kompagnon/issues/567)) ([f4360d5](https://github.com/edp5/kompagnon/commit/f4360d5011abedde485badf53b93ec6457979132))
* **deps:** bump swagger-jsdoc from 6.2.8 to 6.3.0 in /api ([#585](https://github.com/edp5/kompagnon/issues/585)) ([c4075e1](https://github.com/edp5/kompagnon/commit/c4075e14655a2fb0e98ea1868eb7ef9a591909c5))
* **deps:** bump vue from 3.5.34 to 3.5.35 in /admin ([#591](https://github.com/edp5/kompagnon/issues/591)) ([4aeceda](https://github.com/edp5/kompagnon/commit/4aeceda4bbf8b74eb424a320ba9e0ea30393e3d9))
* **deps:** bump vue from 3.5.34 to 3.5.35 in /web ([#592](https://github.com/edp5/kompagnon/issues/592)) ([f0dfcad](https://github.com/edp5/kompagnon/commit/f0dfcadecff8fe7d03229ab25fbbfc18f020687f))
* **deps:** bump vue from 3.5.35 to 3.5.38 in /admin ([#640](https://github.com/edp5/kompagnon/issues/640)) ([dd304d9](https://github.com/edp5/kompagnon/commit/dd304d990c84f8f15a19587d7564a9647f182933))
* **deps:** bump vue from 3.5.35 to 3.5.38 in /web ([#641](https://github.com/edp5/kompagnon/issues/641)) ([489cec3](https://github.com/edp5/kompagnon/commit/489cec398a789101028d50b442982ab1ea440627))
* **deps:** bump vue-router from 5.0.7 to 5.1.0 in /admin ([#594](https://github.com/edp5/kompagnon/issues/594)) ([74119b3](https://github.com/edp5/kompagnon/commit/74119b341d6a1934760cf6578d4404441b91d77e))
* **deps:** bump vue-router from 5.0.7 to 5.1.0 in /web ([#595](https://github.com/edp5/kompagnon/issues/595)) ([26e0144](https://github.com/edp5/kompagnon/commit/26e01447a1d14edbb35dd7f63fd2edc45a8347b9))
* Update Node.js version from 25.9.0 to 26.2.0 ([#607](https://github.com/edp5/kompagnon/issues/607)) ([f1e27f3](https://github.com/edp5/kompagnon/commit/f1e27f3f7dc51e7cef8036e289488759463784b8))

## [1.1.1](https://github.com/edp5/kompagnon/compare/v1.1.0...v1.1.1) (2026-05-15)

### 🛠️ Technical

* create journeys data ([#526](https://github.com/edp5/kompagnon/issues/526)) ([7ad132c](https://github.com/edp5/kompagnon/commit/7ad132cc13a63e8fd5fbae5be19a77da12305470))

## [1.1.0](https://github.com/edp5/kompagnon/compare/v1.0.1...v1.1.0) (2026-04-29)

### 🚀 New features

* **web:** apply consistent UI/UX design system across all views ([#512](https://github.com/edp5/kompagnon/issues/512)) ([2bf4024](https://github.com/edp5/kompagnon/commit/2bf40242c6b62e9d03396b75eaedff0296f08c49)), closes [#app](https://github.com/edp5/kompagnon/issues/app)

### 🐛 Bug Fixes

* **api:** revert the pull request 448 ([#518](https://github.com/edp5/kompagnon/issues/518)) ([c9a3b3d](https://github.com/edp5/kompagnon/commit/c9a3b3d87872e4151f7fb415109c6c4c92de69e7))
* Fix the service to send mails ([#519](https://github.com/edp5/kompagnon/issues/519)) ([c6b246f](https://github.com/edp5/kompagnon/commit/c6b246f5fc05fea03a6f39fcb7e910d2115a018a))

## [1.0.1](https://github.com/edp5/kompagnon/compare/v1.0.0...v1.0.1) (2026-04-28)

### 🐛 Bug Fixes

* Fix the empty database script and deployment script ([#516](https://github.com/edp5/kompagnon/issues/516)) ([21a60c5](https://github.com/edp5/kompagnon/commit/21a60c5d59c5ffaac013acc1b7c2a51205a20f7a))

## 1.0.0 (2026-04-28)

### 🚀 New features

* add JWT auth stores and logout logic for web and admin apps ([#482](https://github.com/edp5/kompagnon/issues/482)) ([627c3ac](https://github.com/edp5/kompagnon/commit/627c3ace99352ce00fa171946ba76edfde187a3b))
* add login page and tests ([#275](https://github.com/edp5/kompagnon/issues/275)) ([a83632c](https://github.com/edp5/kompagnon/commit/a83632c9e1263e6a65b68c93db6552d3b590c108))
* add profile section in web app ([#493](https://github.com/edp5/kompagnon/issues/493)) ([8f99d79](https://github.com/edp5/kompagnon/commit/8f99d793eb0c245150d0f8e2a412ce718eb76023))
* **api:** add a route to authenticate user ([#101](https://github.com/edp5/kompagnon/issues/101)) ([f46fe65](https://github.com/edp5/kompagnon/commit/f46fe650066d0e4bc431443bb4efa0a31ad584fe))
* **api:** Add a swagger to visualize routes ([#4](https://github.com/edp5/kompagnon/issues/4)) ([8f9e1af](https://github.com/edp5/kompagnon/commit/8f9e1af502d5aa7edef61a6e2cd85502aa6f392f))
* **api:** add user account activation route ([#100](https://github.com/edp5/kompagnon/issues/100)) ([03c0b6e](https://github.com/edp5/kompagnon/commit/03c0b6e1872c19e49c5915d514fb568c86ee610d)), closes [#95](https://github.com/edp5/kompagnon/issues/95)
* **api:** Collumn last logged at added and method to update date. ([#99](https://github.com/edp5/kompagnon/issues/99)) ([84a4a14](https://github.com/edp5/kompagnon/commit/84a4a144d79a30705410c57947fcdae15af5bc9e))
* **api:** create auth middleware to check headers params (closes [#358](https://github.com/edp5/kompagnon/issues/358)) ([#443](https://github.com/edp5/kompagnon/issues/443)) ([bba97eb](https://github.com/edp5/kompagnon/commit/bba97ebb0266cab5e47e571b382d478107cb6bbf))
* **api:** create repository methods to create and activate a user ([#70](https://github.com/edp5/kompagnon/issues/70)) ([8156513](https://github.com/edp5/kompagnon/commit/8156513baf55a674a2fd0e7c5f13441f783b3bb9)), closes [#34](https://github.com/edp5/kompagnon/issues/34) [#34](https://github.com/edp5/kompagnon/issues/34) [#34](https://github.com/edp5/kompagnon/issues/34)
* **api:** create route to register user ([#77](https://github.com/edp5/kompagnon/issues/77)) ([37fe7b9](https://github.com/edp5/kompagnon/commit/37fe7b98a970ae0bf2dd2a7c363d9e7791fa8668))
* **api:** create services to manage email ([#62](https://github.com/edp5/kompagnon/issues/62)) ([3b44b3c](https://github.com/edp5/kompagnon/commit/3b44b3c9ba4b52d8e8621786a4eafba4f1181c51))
* **api:** remove static route ([#27](https://github.com/edp5/kompagnon/issues/27)) ([b56779a](https://github.com/edp5/kompagnon/commit/b56779aaa52944cc1ef0fa971b713b93401d6c8e))
* configure the api ([#1](https://github.com/edp5/kompagnon/issues/1)) ([75cf2ec](https://github.com/edp5/kompagnon/commit/75cf2ec8f5f5d6f6de311e8ceca4e6bb6c575cd2))
* create an activation page ([#280](https://github.com/edp5/kompagnon/issues/280)) ([c5835d7](https://github.com/edp5/kompagnon/commit/c5835d7f0741279168b6e38be783404b01a7edbb))
* create journey and found_journeys tables ([#495](https://github.com/edp5/kompagnon/issues/495)) ([6eccee3](https://github.com/edp5/kompagnon/commit/6eccee38ead16ca34843c5b21cd0bdad9e6c3e71))
* setup the admin application ([#72](https://github.com/edp5/kompagnon/issues/72)) ([87bf50c](https://github.com/edp5/kompagnon/commit/87bf50c3024dae5ecb3802f9311927eec6a5261b))
* setup the web app frontend ([#38](https://github.com/edp5/kompagnon/issues/38)) ([3fcb65a](https://github.com/edp5/kompagnon/commit/3fcb65a806c0006727f2591f3867b747d3d1fb08))
* **web:** add registration page ([#222](https://github.com/edp5/kompagnon/issues/222)) ([dc2fbc4](https://github.com/edp5/kompagnon/commit/dc2fbc425f5a8a34e2ac7da0d4c731e1ce123a99))

### 🐛 Bug Fixes

* **api:** convert date to respect format ([#448](https://github.com/edp5/kompagnon/issues/448)) ([002a9ab](https://github.com/edp5/kompagnon/commit/002a9ab7b57e5faa441e2371a8c795800af661f8))
* **api:** fix the linter ([#497](https://github.com/edp5/kompagnon/issues/497)) ([74a5e24](https://github.com/edp5/kompagnon/commit/74a5e24725c1efb691abea181fa6e56b7c143310))
* **api:** fix the seeds ([#500](https://github.com/edp5/kompagnon/issues/500)) ([94d0ca0](https://github.com/edp5/kompagnon/commit/94d0ca06343be458914e0c0d0cc72c3c5ed61186))
* **api:** remove the userType param to registration route ([#277](https://github.com/edp5/kompagnon/issues/277)) ([c678c4b](https://github.com/edp5/kompagnon/commit/c678c4bd3f87c95dec77fd7433e396fa07030a17))

### 🛠️ Technical

* add a gitignore ([fbac02b](https://github.com/edp5/kompagnon/commit/fbac02b9d3deddbb27a13bf574c7f4176a9ea6e9))
* Add a workflow to merge main in production branch ([#502](https://github.com/edp5/kompagnon/issues/502)) ([c6efcfa](https://github.com/edp5/kompagnon/commit/c6efcfad9a175be0f51b483cd01c0e8272737a7b))
* add dependabot and fix pr title check ([#23](https://github.com/edp5/kompagnon/issues/23)) ([445a69c](https://github.com/edp5/kompagnon/commit/445a69cee85c610d6997f1893795bcfb8e11e287))
* add option to run checks on merge queue ([#173](https://github.com/edp5/kompagnon/issues/173)) ([11a0efa](https://github.com/edp5/kompagnon/commit/11a0efac3c5dbdbfc70bc29b12ffb95fc8cc9484))
* Add some columns to users table and complete seeds ([#496](https://github.com/edp5/kompagnon/issues/496)) ([e863d18](https://github.com/edp5/kompagnon/commit/e863d1871039e39e236c30123694b850910dcf6c))
* add the workflow to use semantic release ([#130](https://github.com/edp5/kompagnon/issues/130)) ([a762e9e](https://github.com/edp5/kompagnon/commit/a762e9ee7ffe961d016ff3a448d619c16e8291f8))
* **api:** add isChecked column to users table ([#51](https://github.com/edp5/kompagnon/issues/51)) ([fcd3878](https://github.com/edp5/kompagnon/commit/fcd38784afc850ee3d5bbea6eefe32e4fbf62183)), closes [#36](https://github.com/edp5/kompagnon/issues/36)
* **api:** Add JSDoc linter to API ([#92](https://github.com/edp5/kompagnon/issues/92)) ([895124a](https://github.com/edp5/kompagnon/commit/895124a620f07928f4832b80ccc3894ea3c63b21))
* **api:** correct JSDoc comment for DEBUG_ENABLED environment variable ([#43](https://github.com/edp5/kompagnon/issues/43)) ([c3d5419](https://github.com/edp5/kompagnon/commit/c3d54190f2be021e9be27b1626bab8f7f913502a))
* **api:** create a service to send the mail activation ([#78](https://github.com/edp5/kompagnon/issues/78)) ([264e430](https://github.com/edp5/kompagnon/commit/264e43024b3c6fffc6436f79ecf049456beb26ef))
* **api:** create account activation email template ([#76](https://github.com/edp5/kompagnon/issues/76)) ([d316978](https://github.com/edp5/kompagnon/commit/d3169789e373587db38f7f70a262636efc91718d)), closes [#69](https://github.com/edp5/kompagnon/issues/69)
* **api:** Create an helper for testing and refactor the shared folder ([#68](https://github.com/edp5/kompagnon/issues/68)) ([e7d3865](https://github.com/edp5/kompagnon/commit/e7d38651894387dff24e81be6dd45d9dada259c0))
* **api:** create column passwordhashed ([#64](https://github.com/edp5/kompagnon/issues/64)) ([9532b28](https://github.com/edp5/kompagnon/commit/9532b28c131c7bd7a50338e6e809895c10561d56))
* **api:** create database builder and first seeds ([#49](https://github.com/edp5/kompagnon/issues/49)) ([da852c3](https://github.com/edp5/kompagnon/commit/da852c351b8086ef71d5dfa4520447ad8fe8412c))
* **api:** create JWT token service ([#58](https://github.com/edp5/kompagnon/issues/58)) ([6349af8](https://github.com/edp5/kompagnon/commit/6349af84e6f29518e7f7d079b65ab3472ab86afc)), closes [#41](https://github.com/edp5/kompagnon/issues/41) [#41](https://github.com/edp5/kompagnon/issues/41)
* **api:** Create password service ([#52](https://github.com/edp5/kompagnon/issues/52)) ([ec3c367](https://github.com/edp5/kompagnon/commit/ec3c3670e88bfbf2d5065590f54a79c53a26cb96))
* **api:** remove some data of middleware ([#501](https://github.com/edp5/kompagnon/issues/501)) ([b00b658](https://github.com/edp5/kompagnon/commit/b00b6580b38824101628734115ccd134d5a42989))
* **api:** return 400 error and validation failed when element of schema is missing ([#278](https://github.com/edp5/kompagnon/issues/278)) ([ff65d26](https://github.com/edp5/kompagnon/commit/ff65d26be19d972cefd4888af7d08849f8b73021))
* **api:** update isActive column default value and add column variable ([#50](https://github.com/edp5/kompagnon/issues/50)) ([dbb6af4](https://github.com/edp5/kompagnon/commit/dbb6af45754f16d8fe36255a3969304422f0f97d)), closes [#35](https://github.com/edp5/kompagnon/issues/35)
* call workflow from edp5 actions ([#106](https://github.com/edp5/kompagnon/issues/106)) ([9971048](https://github.com/edp5/kompagnon/commit/99710484c9ee3d250c85da39067f9c047d0420e0))
* configure eslint for the root project ([#164](https://github.com/edp5/kompagnon/issues/164)) ([d7db38d](https://github.com/edp5/kompagnon/commit/d7db38d9279eeff5421b74d3dcfd01548ec1aeae))
* Fix and feat functionalities for developers ([#104](https://github.com/edp5/kompagnon/issues/104)) ([7058e3b](https://github.com/edp5/kompagnon/commit/7058e3b33d1438289cff1296fca177f87110dc1a))
* **global:** add configuration script and readme ([#2](https://github.com/edp5/kompagnon/issues/2)) ([22653a2](https://github.com/edp5/kompagnon/commit/22653a290de29a76a61b5f5d5f48f7e51d51f23c))
* Implement transparent transaction management for Knex using AsyncLocalStorage ([#279](https://github.com/edp5/kompagnon/issues/279)) ([57442fa](https://github.com/edp5/kompagnon/commit/57442fa791ac36a23dd51bd38ce7fc6068a20c20))
* Include docker packages in dependabot check ([#246](https://github.com/edp5/kompagnon/issues/246)) ([132b4de](https://github.com/edp5/kompagnon/commit/132b4deec11889934dee5bf8a4bc1be62f08758b))
* Setup pgadmin to visualize database ([#366](https://github.com/edp5/kompagnon/issues/366)) ([f5ac409](https://github.com/edp5/kompagnon/commit/f5ac409235193adca0ff419d21ae47ff7d9cded9))
* setup the project ([6accc36](https://github.com/edp5/kompagnon/commit/6accc369b13ab3c54f9f906012be5a19cd525c87))
* Setup the render configuration ([#515](https://github.com/edp5/kompagnon/issues/515)) ([681b585](https://github.com/edp5/kompagnon/commit/681b585ba520655f9dfe41e88a0a6727d338a597))
* Universalize commands for all systems ([#276](https://github.com/edp5/kompagnon/issues/276)) ([0bbaa1c](https://github.com/edp5/kompagnon/commit/0bbaa1c66bd05307b27d407d98864d9eff03bf91))
* update vitest in admin and web ([#134](https://github.com/edp5/kompagnon/issues/134)) ([bcd5f70](https://github.com/edp5/kompagnon/commit/bcd5f70e83c16ea28d529104af33bab54383ad9e))
* update vitest to vitest 4 ([#163](https://github.com/edp5/kompagnon/issues/163)) ([225ce2b](https://github.com/edp5/kompagnon/commit/225ce2b67d66bd6fe0be20d7535188c0730f87b0))
* Use api to serve front and prepare deployment ([#498](https://github.com/edp5/kompagnon/issues/498)) ([a0c7a4c](https://github.com/edp5/kompagnon/commit/a0c7a4c30bec0cb4a016368d3bcb110387f60b98))
* Use the web hash history for router of front apps ([#315](https://github.com/edp5/kompagnon/issues/315)) ([7b21ce9](https://github.com/edp5/kompagnon/commit/7b21ce90d7a64b8ccb7c8519d9482752d59fd696))
* **web&admin:** Create a Password component ([#187](https://github.com/edp5/kompagnon/issues/187)) ([7f6d705](https://github.com/edp5/kompagnon/commit/7f6d70562cf0cf9c16fdf3c54f141c93d334d210)), closes [#81](https://github.com/edp5/kompagnon/issues/81) [#81](https://github.com/edp5/kompagnon/issues/81)
* **workflow:** add the action to use node version updater ([#456](https://github.com/edp5/kompagnon/issues/456)) ([d7a17aa](https://github.com/edp5/kompagnon/commit/d7a17aaa5e5080e569c59d855ecefc93aa633d8c))
* **workflow:** use the edp5-action for auto-merge ([#40](https://github.com/edp5/kompagnon/issues/40)) ([2fa74d9](https://github.com/edp5/kompagnon/commit/2fa74d94c28208a9a99a9ed919003ab764591adc))

### ⏪ Reverts

* bump(deps-dev): bump eslint from 9.39.2 to 10.0.0 ([#379](https://github.com/edp5/kompagnon/issues/379)) ([b7df885](https://github.com/edp5/kompagnon/commit/b7df885b839a3afaf82cb1c892cc9d2345976e4b)), closes [#370](https://github.com/edp5/kompagnon/issues/370)
