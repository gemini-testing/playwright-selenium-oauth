# A library for OAuth Selenium authentication in PlayWright

## How to use
1. `npm install playwright-oauth`
2. Add the OAuth token: `mkdir -p ~/.playwright && echo <mytoken> > ~/.playwright/oauth_token`
3. [Add global setup to your playwright configuration](https://playwright.dev/docs/test-global-setup-teardown#configure-globalsetup-and-globalteardown), e.g.
```
import {init} from "playwright-oauth"
async function globalSetup(config: FullConfig) {
  await init();
}
export default globalSetup;
```

## Configuration
You can pass a custom path to init, e.g.
```
await init({tokenFilePath: "./my-token-file"})
```
