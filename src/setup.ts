import { readToken } from "./read-token";

export interface SetupOptions {
    tokenFilePath?: string;
    token?: string;
    help?: string;
}

const headersEnvVariable = "SELENIUM_REMOTE_HEADERS";
const tokenEnvVarialbe = "SELENIUM_OAUTH_TOKEN";
const tokenPathEnvVariable = "SELENIUM_OAUTH_TOKEN_FILE_PATH";

function parseHeadersEnvVariable() {
    try {
        return JSON.parse(process.env[headersEnvVariable] ?? "{}");
    } catch (e) {
        console.error(e);
        throw new Error(`playwright-selenium-oauth: error parsing ${headersEnvVariable}. ${e}`);
    }
}

function setToken(token: string) {
    const trimmedToken = token.trim();
    if (!trimmedToken) {
        throw new Error(`playwright-selenium-oauth: token is empty`);
    }
    const seleniumRemoteHeaders = parseHeadersEnvVariable();
    const existingAuthHeader = Object.keys(seleniumRemoteHeaders).find(key => key.toLowerCase() === "authorization");
    if (existingAuthHeader) {
        console.warn(`playwright-selenium-oauth: there is already an Authorization header, do nothing.`);
        return;
    }
    seleniumRemoteHeaders["Authorization"] = `OAuth ${trimmedToken}`;
    process.env[headersEnvVariable] = JSON.stringify(seleniumRemoteHeaders);
}

export async function setup(options?: SetupOptions) {
    if (options?.token && options.tokenFilePath) {
        throw new Error(
            `playwright-selenium-oauth: both "token" and "tokenFilePath" have been provided, please provide only one of them`,
        );
    }
    if (options?.token) {
        setToken(options.token);
        return;
    }
    if (options?.tokenFilePath) {
        const token = await readToken(options.tokenFilePath, options.help);
        setToken(token);
        return;
    }
    const tokenFromEnv = process.env[tokenEnvVarialbe];
    if (tokenFromEnv) {
        setToken(tokenFromEnv);
        return;
    }
    const filePathFromEnv = process.env[tokenPathEnvVariable];
    if (filePathFromEnv) {
        const token = await readToken(filePathFromEnv, options?.help);
        setToken(token);
        return;
    }
    throw new Error(
        `playwright-selenium-oauth: one of: "token" or "tokenFilePath" arguments or ${tokenEnvVarialbe} or ${tokenPathEnvVariable} env var must be provided`,
    );
}
