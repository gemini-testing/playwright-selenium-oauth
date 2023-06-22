# Playwright-selenium-oauth
A library for OAuth Selenium authentication in PlayWright

## How to use
1. `npm install playwright-selenium-oauth`
2. [Add global setup to your playwright configuration](https://playwright.dev/docs/test-global-setup-teardown#configure-globalsetup-and-globalteardown) and specify the token e.g.
```
import {setup} from "playwright-selenium-oauth"
async function globalSetup() {
  await setup({token: <my-actual-token>}); // specifying token directly
  await setup({tokenFilePath: "/path/to/my/token"}); // specyfing path to a text file with the token
  await setup({tokenFilePath: process.env.CI ? "/robot/token" : "/user/token"}); // example for a CI setup
  await setup({token: process.env.CI ? process.env.SELENIUM_OAUTH_CI_TOKEN : process.env.SELENIUM_OAUTH_USER_TOKEN}); // example for a CI setup
}
export default globalSetup;
```

## Help
You can pass a helpful string that would be printed when there is a problem loading a token file.
```
await setup({help: "You can generate the token here: https://here/the/user/may/get/his/token"})
```
