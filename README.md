# A library for OAuth Selenium authentication in PlayWright

## How to use
1. `npm install playwright-oauth`
2. Add the OAuth token: `mkdir -p ~/.playwright && echo <mytoken> > ~/.playwright/oauth_token`
3. [Add global setup to your playwright configuration](https://playwright.dev/docs/test-global-setup-teardown#configure-globalsetup-and-globalteardown), e.g.
```
import {setup} from "playwright-oauth"
async function globalSetup() {
  await setup();
}
export default globalSetup;
```

## Configuration
You can pass a custom path to setup, e.g.
```
await setup({tokenFilePath: "./my-token-file"})
```
