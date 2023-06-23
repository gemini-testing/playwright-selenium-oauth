import { readTokenFromFile } from "./read-token-from-file";
import { logger } from "./logger";
import { PlaywrightSeleniumError } from "./playwright-selenium-error";
import { constants } from "./constants";

export interface SetupOptions {
    tokenFilePath?: string;
    token?: string;
    help?: string;
}

function parseHeadersEnvVariable() {
    try {
        return JSON.parse(process.env[constants.SELENIUM_REMOTE_HEADERS] ?? "{}");
    } catch (e) {
        throw new PlaywrightSeleniumError(`error parsing ${constants.SELENIUM_REMOTE_HEADERS}. Caused by ${e}`);
    }
}

function setToken(token: string) {
    const trimmedToken = token.trim();
    if (!trimmedToken) {
        throw new PlaywrightSeleniumError(
            `Token is empty. Please set non-empty token via "token" or "tokenFilePath" arguments.`,
        );
    }
    const seleniumRemoteHeaders = parseHeadersEnvVariable();
    const existingAuthHeader = Object.keys(seleniumRemoteHeaders).find(key => key.toLowerCase() === "authorization");
    if (existingAuthHeader) {
        logger(`there is already an Authorization header, do nothing.`);
        return;
    }
    seleniumRemoteHeaders["Authorization"] = `OAuth ${trimmedToken}`;
    process.env[constants.SELENIUM_REMOTE_HEADERS] = JSON.stringify(seleniumRemoteHeaders);
}

export async function setup(options?: SetupOptions) {
    if (options?.token && options.tokenFilePath) {
        throw new PlaywrightSeleniumError(
            `both "token" and "tokenFilePath" have been provided, please provide only one of them`,
        );
    }
    if (options?.token) {
        logger("Reading from token argument.");
        setToken(options.token);
        return;
    }
    if (options?.tokenFilePath) {
        logger(`Reading from token file path argument at ${options.tokenFilePath}`);
        const token = await readTokenFromFile(options.tokenFilePath, options.help);
        setToken(token);
        return;
    }
    throw new PlaywrightSeleniumError(`one of: "token" or "tokenFilePath" arguments must be provided`);
}
