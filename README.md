# A library for OAuth Selenium authentication in PlayWright

## How to use
1. `npm install playwright-selenium-oauth`
2. Specify the OAuth token in one of [the following ways](##Ways-to-specify-a-token)
4. [Add global setup to your playwright configuration](https://playwright.dev/docs/test-global-setup-teardown#configure-globalsetup-and-globalteardown), e.g.
```
import {setup} from "playwright-selenium-oauth"
async function globalSetup() {
  await setup();
}
export default globalSetup;
```

## Ways to specify a token
- `await setup({token: <my-actual-token>})`
- `await setup({tokenFilePath: /path/to/my/token})`, where `token` is a text file containing the token
- specifying via env variable: `export PLAYWRIGHT_SELENIUM_OAUTH_TOKEN=<my-token>`
## Help
You can pass a helpful string that would be printed when there is a problem loading a token file.
```
await setup({help: "You can generate the token here: https://here/the/user/may/get/his/token"})
```
