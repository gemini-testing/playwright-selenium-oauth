# Playwright-selenium-oauth
A library for OAuth Selenium authentication in PlayWright

## How to use
1. `npm install playwright-selenium-oauth`
2. [Add global setup to your playwright configuration](https://playwright.dev/docs/test-global-setup-teardown#configure-globalsetup-and-globalteardown) and specify the token e.g.
```
import {setup} from "playwright-selenium-oauth"
async function globalSetup() {
  await setup(); // if you specify SELENIUM_OAUTH_TOKEN environment variable or
  await setup({token: <my-actual-token>}); // specifying token directly or 
  await setup({tokenFilePath: /path/to/my/token}); specyfing path to a text file with the token
}
export default globalSetup;
```

## Help
You can pass a helpful string that would be printed when there is a problem loading a token file.
```
await setup({help: "You can generate the token here: https://here/the/user/may/get/his/token"})
```
