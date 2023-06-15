import { readToken } from "./read-token";

export interface IInitOptions {
    tokenFilePath?: string;
}

export async function init(options?: IInitOptions) {
    const path = options?.tokenFilePath ?? "~/.playwright/oauth_token";
    const token = await readToken(path);
    process.env.SELENIUM_REMOTE_HEADERS = `{'Authorization':'OAuth ${token}'}`;
}
