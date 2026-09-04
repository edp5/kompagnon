## [1.5.0](https://github.com/edp5/kompagnon/compare/v1.4.0...v1.5.0) (2026-09-04)

### 🚀 New features

* define user role on account activation ([#934](https://github.com/edp5/kompagnon/issues/934)) ([#942](https://github.com/edp5/kompagnon/issues/942)) ([6670bc0](https://github.com/edp5/kompagnon/commit/6670bc040384729012e717294bcbc7610c3d500c))
* implement forgot password and reset password flow via email ([#912](https://github.com/edp5/kompagnon/issues/912)) ([#931](https://github.com/edp5/kompagnon/issues/931)) ([9ed5455](https://github.com/edp5/kompagnon/commit/9ed5455e210b5207d48c17051ae25d2b46ca9d9b))
* replace mock home quick actions with a single record-journey CTA ([#937](https://github.com/edp5/kompagnon/issues/937)) ([2e1f625](https://github.com/edp5/kompagnon/commit/2e1f6253a8692f402fcd24e74ba31047cb1ad027))
* Update the page title during navigation ([#938](https://github.com/edp5/kompagnon/issues/938)) ([a8b4fbd](https://github.com/edp5/kompagnon/commit/a8b4fbda2103491c3c922d576430919879fdf45d))

### 🐛 Bug Fixes

* **web:** show the correct role label in the desktop sidebar ([#948](https://github.com/edp5/kompagnon/issues/948)) ([35ab2c3](https://github.com/edp5/kompagnon/commit/35ab2c38f7cddee7b4d3054a01b9e96163281e84))
* **web:** show the correct role on the profile page ([#949](https://github.com/edp5/kompagnon/issues/949)) ([d5417fd](https://github.com/edp5/kompagnon/commit/d5417fd377f36104dda7c4d83a46a5467ee92ccc))

### 🛠️ Technical

* Create a local server ([#944](https://github.com/edp5/kompagnon/issues/944)) ([c9f519f](https://github.com/edp5/kompagnon/commit/c9f519f0d740f59d0addab187095b36145416990))

### 🔖 Version Bumps

* **deps-dev:** bump eslint-plugin-jsdoc from 64.2.1 to 64.3.2 ([#940](https://github.com/edp5/kompagnon/issues/940)) ([586311a](https://github.com/edp5/kompagnon/commit/586311a7d50bcb910331b794f5987d7db9a5bc03))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.2.1 to 64.3.2 in /api ([#941](https://github.com/edp5/kompagnon/issues/941)) ([0502ad9](https://github.com/edp5/kompagnon/commit/0502ad99ed42eaa35fe286b40c3c1e240989b77e))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.3.2 to 64.3.3 ([#945](https://github.com/edp5/kompagnon/issues/945)) ([da7affa](https://github.com/edp5/kompagnon/commit/da7affa1a8dfe7eed48f2161ff5bf8a9dca6c2f5))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.3.2 to 64.3.3 in /api ([#947](https://github.com/edp5/kompagnon/issues/947)) ([5c20f95](https://github.com/edp5/kompagnon/commit/5c20f9589c4a737d4bc5295aad9e613148c566d2))
* **deps:** bump edp5/edp5-actions from 1.8.1 to 1.9.0 ([#939](https://github.com/edp5/kompagnon/issues/939)) ([729bbda](https://github.com/edp5/kompagnon/commit/729bbdac0678bddfa6d13704115e9411a10f120f))
* **deps:** bump nodemailer from 9.0.6 to 9.1.0 in /api ([#946](https://github.com/edp5/kompagnon/issues/946)) ([042c3d3](https://github.com/edp5/kompagnon/commit/042c3d3b96cb24ec2353d06cd3f637b90e496e69))

## [1.4.0](https://github.com/edp5/kompagnon/compare/v1.3.0...v1.4.0) (2026-09-02)

### 🚀 New features

* Create an endpoint to notify users when journey match ([#804](https://github.com/edp5/kompagnon/issues/804)) ([d49057e](https://github.com/edp5/kompagnon/commit/d49057e15461cc03a108a1f64653c661ba8fd05e))
* Create an endpoint to recive new match n°2 ([#840](https://github.com/edp5/kompagnon/issues/840)) ([0ed0016](https://github.com/edp5/kompagnon/commit/0ed0016f07aa11e5877b7a04d40fe28a05ae2355))
* expose match coordinates on the matches endpoint ([#914](https://github.com/edp5/kompagnon/issues/914)) ([abd3c41](https://github.com/edp5/kompagnon/commit/abd3c414d9fa42790e8c4819507ce9faee5db82c))
* Include the phone number in data return by journey route ([#838](https://github.com/edp5/kompagnon/issues/838)) ([a0faa86](https://github.com/edp5/kompagnon/commit/a0faa8689061d86179dd43d3f46663e574690bbf))

### 🐛 Bug Fixes

* **api:** return 204 No Content on PUT /journeys/found/:id ([#902](https://github.com/edp5/kompagnon/issues/902)) ([4aee6a2](https://github.com/edp5/kompagnon/commit/4aee6a20edb5f4955213898fbe063e5c0f6e362c))
* **api:** send companion and passenger match notification emails with allSettled ([#926](https://github.com/edp5/kompagnon/issues/926)) ([87d4002](https://github.com/edp5/kompagnon/commit/87d40021bc1959b4f39e2dcbdb8b9969616fd608))
* Fix the data produced by match route ([#874](https://github.com/edp5/kompagnon/issues/874)) ([269bf1a](https://github.com/edp5/kompagnon/commit/269bf1acef37f68d9e029bb73367dc9d3734daaf))
* restrict CORS to allowed origins in production ([#907](https://github.com/edp5/kompagnon/issues/907)) ([345e329](https://github.com/edp5/kompagnon/commit/345e329c3b6cea04272fe87c3c2a89627ed44799))
* validate ALGORITHM_API_KEY is set when algorithm is enabled ([#901](https://github.com/edp5/kompagnon/issues/901)) ([04adf0d](https://github.com/edp5/kompagnon/commit/04adf0da93b8d5bf0e253c92922b337a2563f24b))

### 🛠️ Technical

* Fix seeds and add api informations for developers ([#859](https://github.com/edp5/kompagnon/issues/859)) ([6df527d](https://github.com/edp5/kompagnon/commit/6df527d605db7002b8ff9c9d58bc098881d91843))
* use edp5/edp5-actions checkout-node action in workflows ([#925](https://github.com/edp5/kompagnon/issues/925)) ([951dc0d](https://github.com/edp5/kompagnon/commit/951dc0d57c02d15c3b050a999c51f7b6290a0923))

### 🔖 Version Bumps

* **deps-dev:** bump @vitest/coverage-v8 from 4.1.10 to 4.1.11 in /admin ([#862](https://github.com/edp5/kompagnon/issues/862)) ([3b80b2e](https://github.com/edp5/kompagnon/commit/3b80b2e29a22f743f361b0577e6a3351cfd359fc))
* **deps-dev:** bump @vitest/coverage-v8 from 4.1.10 to 4.1.11 in /api ([#864](https://github.com/edp5/kompagnon/issues/864)) ([dfcf825](https://github.com/edp5/kompagnon/commit/dfcf8253b2f838c6d65cbc07f62058ba3bd2c281))
* **deps-dev:** bump @vitest/coverage-v8 from 4.1.10 to 4.1.11 in /web ([#865](https://github.com/edp5/kompagnon/issues/865)) ([3ec289c](https://github.com/edp5/kompagnon/commit/3ec289c379d8e0e8e9aa7a8eb8d3dc4fe603e083))
* **deps-dev:** bump @vitest/eslint-plugin from 1.6.26 to 1.6.27 in /admin ([#845](https://github.com/edp5/kompagnon/issues/845)) ([aadc044](https://github.com/edp5/kompagnon/commit/aadc044f65a76bfdb80d30be51fc038f5cd4256a))
* **deps-dev:** bump @vitest/eslint-plugin from 1.6.26 to 1.6.27 in /web ([#847](https://github.com/edp5/kompagnon/issues/847)) ([2f1c83c](https://github.com/edp5/kompagnon/commit/2f1c83c036726e0d4703b4128ed2c6ba5edd3bae))
* **deps-dev:** bump @vue/test-utils from 2.4.11 to 2.5.0 in /admin ([#919](https://github.com/edp5/kompagnon/issues/919)) ([14ecba5](https://github.com/edp5/kompagnon/commit/14ecba56d0caa020df38285b2d2805819717b48b))
* **deps-dev:** bump @vue/test-utils from 2.4.11 to 2.5.0 in /web ([#922](https://github.com/edp5/kompagnon/issues/922)) ([6c30d81](https://github.com/edp5/kompagnon/commit/6c30d81a32693c6fb5eeb27c599486e5019005b1))
* **deps-dev:** bump eslint from 10.8.1 to 10.9.0 ([#868](https://github.com/edp5/kompagnon/issues/868)) ([74a4e11](https://github.com/edp5/kompagnon/commit/74a4e1138e82c011d3add0881d7cd12ca8ac81c1))
* **deps-dev:** bump eslint from 10.8.1 to 10.9.0 in /admin ([#869](https://github.com/edp5/kompagnon/issues/869)) ([e8b84c2](https://github.com/edp5/kompagnon/commit/e8b84c2a2cd8b52e595ee83b5d8b153f1224e963))
* **deps-dev:** bump eslint from 10.8.1 to 10.9.0 in /api ([#870](https://github.com/edp5/kompagnon/issues/870)) ([81536e4](https://github.com/edp5/kompagnon/commit/81536e49a3841592795ef329ff8c9671d08dd1b8))
* **deps-dev:** bump eslint from 10.8.1 to 10.9.0 in /web ([#871](https://github.com/edp5/kompagnon/issues/871)) ([aed6c34](https://github.com/edp5/kompagnon/commit/aed6c34ff817da710e50a07b4fbd46c1b808fd50))
* **deps-dev:** bump eslint from 10.9.0 to 10.9.1 ([#896](https://github.com/edp5/kompagnon/issues/896)) ([5c01d31](https://github.com/edp5/kompagnon/commit/5c01d31b1fcdd37edceaaab3b8d2911c3c2fd1fc))
* **deps-dev:** bump eslint from 10.9.0 to 10.9.1 in /admin ([#897](https://github.com/edp5/kompagnon/issues/897)) ([318afe8](https://github.com/edp5/kompagnon/commit/318afe8207272a17ae8c3deb0979b3db09a8390c))
* **deps-dev:** bump eslint from 10.9.0 to 10.9.1 in /api ([#899](https://github.com/edp5/kompagnon/issues/899)) ([6e6ff02](https://github.com/edp5/kompagnon/commit/6e6ff021b020048fc991c8c6f901441f14f9cad3))
* **deps-dev:** bump eslint from 10.9.0 to 10.9.1 in /web ([#900](https://github.com/edp5/kompagnon/issues/900)) ([9870399](https://github.com/edp5/kompagnon/commit/9870399700162e358c8ca7d249b2da0b54e64c75))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.0.0 to 64.0.1 ([#834](https://github.com/edp5/kompagnon/issues/834)) ([40b92ba](https://github.com/edp5/kompagnon/commit/40b92badd6ee94a02fcde42aa23f490d7b17c612))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.0.0 to 64.0.1 in /api ([#837](https://github.com/edp5/kompagnon/issues/837)) ([de5d88a](https://github.com/edp5/kompagnon/commit/de5d88acf26f689edcf283d7e37126f35c85b77a))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.0.1 to 64.0.2 ([#841](https://github.com/edp5/kompagnon/issues/841)) ([fde487a](https://github.com/edp5/kompagnon/commit/fde487a4873102c214b6612aadc420677b5189b6))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.0.1 to 64.0.2 in /api ([#842](https://github.com/edp5/kompagnon/issues/842)) ([b0bfcdb](https://github.com/edp5/kompagnon/commit/b0bfcdbc1de700987d6a4285e80a98ca5543c2f6))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.0.2 to 64.1.0 ([#844](https://github.com/edp5/kompagnon/issues/844)) ([b366743](https://github.com/edp5/kompagnon/commit/b36674357f9a7974edc74d063eac0da82efef960))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.0.2 to 64.1.0 in /api ([#846](https://github.com/edp5/kompagnon/issues/846)) ([cb6e80d](https://github.com/edp5/kompagnon/commit/cb6e80d5af99196936c64d5b798b65f6975ab9ab))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.1.0 to 64.2.0 ([#854](https://github.com/edp5/kompagnon/issues/854)) ([dbde604](https://github.com/edp5/kompagnon/commit/dbde6040c70a4fe90494a847a01c4d4b855d2681))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.1.0 to 64.2.0 in /api ([#855](https://github.com/edp5/kompagnon/issues/855)) ([deb6dd9](https://github.com/edp5/kompagnon/commit/deb6dd9c389f1191ce488bb1890468c47be2d91d))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.2.0 to 64.2.1 ([#856](https://github.com/edp5/kompagnon/issues/856)) ([5aab1b8](https://github.com/edp5/kompagnon/commit/5aab1b8e66b734271d585ec24980a59934f89d09))
* **deps-dev:** bump eslint-plugin-jsdoc from 64.2.0 to 64.2.1 in /api ([#857](https://github.com/edp5/kompagnon/issues/857)) ([a1d80e8](https://github.com/edp5/kompagnon/commit/a1d80e83ab26464f936120c1af14312a25d40651))
* **deps-dev:** bump globals from 17.9.0 to 17.11.0 ([#848](https://github.com/edp5/kompagnon/issues/848)) ([ea2c725](https://github.com/edp5/kompagnon/commit/ea2c725bed2d818cc838210f0375de47cc524e67))
* **deps-dev:** bump globals from 17.9.0 to 17.11.0 in /admin ([#850](https://github.com/edp5/kompagnon/issues/850)) ([17456a2](https://github.com/edp5/kompagnon/commit/17456a26cd6a6285132d8323edce8d8ab0be8896))
* **deps-dev:** bump globals from 17.9.0 to 17.11.0 in /api ([#851](https://github.com/edp5/kompagnon/issues/851)) ([a62c092](https://github.com/edp5/kompagnon/commit/a62c09210cfc53e9b139e7915f15a806fe8e1963))
* **deps-dev:** bump globals from 17.9.0 to 17.11.0 in /web ([#853](https://github.com/edp5/kompagnon/issues/853)) ([2eebe8a](https://github.com/edp5/kompagnon/commit/2eebe8a602129be9892299a68690d7020393bfc2))
* **deps-dev:** bump vite from 8.2.1 to 8.2.2 in /admin ([#860](https://github.com/edp5/kompagnon/issues/860)) ([4cc0fcc](https://github.com/edp5/kompagnon/commit/4cc0fcc0243d13da59a2d3d029812767fdf29252))
* **deps-dev:** bump vite from 8.2.1 to 8.2.2 in /web ([#867](https://github.com/edp5/kompagnon/issues/867)) ([01bb2ac](https://github.com/edp5/kompagnon/commit/01bb2ac84dd672ebcf8b00c8ebde2c29e9dea6fd))
* **deps-dev:** bump vitest from 4.1.10 to 4.1.11 in /admin ([#861](https://github.com/edp5/kompagnon/issues/861)) ([0bc29c0](https://github.com/edp5/kompagnon/commit/0bc29c0223c99e552392c24d5b134cab00692f28))
* **deps-dev:** bump vitest from 4.1.10 to 4.1.11 in /api ([#863](https://github.com/edp5/kompagnon/issues/863)) ([47b9ea0](https://github.com/edp5/kompagnon/commit/47b9ea0f757f9b08948e721357e833efc4ef75f6))
* **deps:** bump celebrate from 15.0.3 to 16.0.0 in /api ([#929](https://github.com/edp5/kompagnon/issues/929)) ([5567bc0](https://github.com/edp5/kompagnon/commit/5567bc0a6b01e16b40c7f05aa6f67c5827c5ca62))
* **deps:** bump edp5/edp5-actions from 1.8.0 to 1.8.1 ([#916](https://github.com/edp5/kompagnon/issues/916)) ([e35d767](https://github.com/edp5/kompagnon/commit/e35d76713ea5282ae683a9ca127889b4c37953d1))
* **deps:** bump marked from 18.0.10 to 18.0.11 in /api ([#898](https://github.com/edp5/kompagnon/issues/898)) ([20e2a30](https://github.com/edp5/kompagnon/commit/20e2a3025323673cd1e11d8471c8e01e4af9b11d))
* **deps:** bump marked from 18.0.7 to 18.0.9 in /api ([#835](https://github.com/edp5/kompagnon/issues/835)) ([7b7bd48](https://github.com/edp5/kompagnon/commit/7b7bd4899d1c490897c99c7686fc8afa110c3047))
* **deps:** bump marked from 18.0.9 to 18.0.10 in /api ([#872](https://github.com/edp5/kompagnon/issues/872)) ([460fe9a](https://github.com/edp5/kompagnon/commit/460fe9a0f716382ae83410fbdd6544d060d05bd5))
* **deps:** bump nodemailer from 9.0.4 to 9.0.5 in /api ([#843](https://github.com/edp5/kompagnon/issues/843)) ([f95da97](https://github.com/edp5/kompagnon/commit/f95da977b83d8b9f90c01f62000341b645933a72))
* **deps:** bump nodemailer from 9.0.5 to 9.0.6 in /api ([#928](https://github.com/edp5/kompagnon/issues/928)) ([9abed50](https://github.com/edp5/kompagnon/commit/9abed507744c3479542fd1aa1c98f627d8520e99))
* **deps:** bump pg from 8.22.0 to 8.23.0 in /api ([#836](https://github.com/edp5/kompagnon/issues/836)) ([619b8ed](https://github.com/edp5/kompagnon/commit/619b8ed78f357bd38f47f0b385f738fce76276c8))
* **deps:** bump pinia from 4.0.2 to 4.0.3 in /admin ([#849](https://github.com/edp5/kompagnon/issues/849)) ([e4b2355](https://github.com/edp5/kompagnon/commit/e4b23551c11b8a41894fe2b7e7951fae708cb57d))
* **deps:** bump pinia from 4.0.2 to 4.0.3 in /web ([#852](https://github.com/edp5/kompagnon/issues/852)) ([eb90c1c](https://github.com/edp5/kompagnon/commit/eb90c1cbfba9bf92c4950785f9d93b91c2ff73d9))
* **deps:** bump vue from 3.5.41 to 3.5.42 in /admin ([#918](https://github.com/edp5/kompagnon/issues/918)) ([491a787](https://github.com/edp5/kompagnon/commit/491a78734a8ddd655be6ca0bbca167434becb12b))
* **deps:** bump vue from 3.5.41 to 3.5.42 in /web ([#921](https://github.com/edp5/kompagnon/issues/921)) ([59853c7](https://github.com/edp5/kompagnon/commit/59853c7698e42ad747c0549c21d41df49db9fc31))
* **deps:** bump vue-router from 5.2.0 to 5.3.0 in /admin ([#917](https://github.com/edp5/kompagnon/issues/917)) ([03426b3](https://github.com/edp5/kompagnon/commit/03426b3ec59138c49d43d85a54977f9608104790))
* **deps:** bump vue-router from 5.2.0 to 5.3.0 in /web ([#920](https://github.com/edp5/kompagnon/issues/920)) ([7a8a045](https://github.com/edp5/kompagnon/commit/7a8a0457c3b37a1158e1d1523240b17f0f9846f6))
* Update Node.js version from 26.5.1 to 26.8.1 ([#930](https://github.com/edp5/kompagnon/issues/930)) ([ab5a9a9](https://github.com/edp5/kompagnon/commit/ab5a9a9defa98bb109316244de656af5956c1e02))

### ⏪ Reverts

* feat: Create an endpoint to notify users when journey match ([#839](https://github.com/edp5/kompagnon/issues/839)) ([5f8756e](https://github.com/edp5/kompagnon/commit/5f8756e24eee797fc02dafd1a78a55d1658b144c))

## [1.3.0](https://github.com/edp5/kompagnon/compare/v1.2.0...v1.3.0) (2026-08-11)

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
