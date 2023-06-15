import { homedir } from "os";
import { readToken } from "./read-token";
import { join } from "path";

export interface IInitOptions {
    tokenFilePath?: string;
}

export async function init(options?: IInitOptions) {
    const path = options?.tokenFilePath ?? join(homedir(), ".playwright/oauth_token");
    const token = await readToken(path);
    process.env.SELENIUM_REMOTE_HEADERS = `{'Authorization':'OAuth ${token}'}`;
}
