import { readToken } from "./read-token";

export interface SetupOptions {
    tokenFilePath?: string;
    token?: string;
    help?: string;
}

const headersEnvVariable = "SELENIUM_REMOTE_HEADERS";

function parseHeadersEnvVariable() {
    try {
        return JSON.parse(process.env[headersEnvVariable] ?? "{}");
    } catch (e) {
        console.error(`playwright-selenium-oauth: error parsing ${headersEnvVariable}`, e);
        throw e;
    }
}

function setToken(token: string) {
    const seleniumRemoteHeaders = parseHeadersEnvVariable();
    const existingAuthHeader = Object.keys(seleniumRemoteHeaders).find(key => key.toLowerCase() === "authorization");
    if (existingAuthHeader) {
        console.warn(`playwright-selenium-oauth: there is already an Authorization header, not doing anything.`);
        return;
    }
    seleniumRemoteHeaders["Authorization"] = `"OAuth ${token}"`;
    process.env[headersEnvVariable] = JSON.stringify(seleniumRemoteHeaders);
}

export async function setup(options: SetupOptions) {
    if (options.token && options.tokenFilePath) {
        console.warn(`playwright-selenium-oauth: both "token" and "tokenFilePath" have been provided, using "token"`);
    }
    if (options.token) {
        setToken(options.token);
        return;
    }
    if (options.tokenFilePath) {
        const path = options.tokenFilePath;
        const token = await readToken(path, options.help);
        setToken(token);
        return;
    }
    throw new Error(`playwright-selenium-oauth: one of "token" or "tokenFilePath" must be provided`);
}
