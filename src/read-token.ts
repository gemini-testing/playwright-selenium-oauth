import { readFile } from "fs/promises";

async function readFromFile(path: string, help?: string) {
    try {
        return await readFile(path, { encoding: "utf-8" });
    } catch (e) {
        console.error(`playwright-selenium-oauth: error reading token from file, path: ${path}. ${help}`);
        throw e;
    }
}

export async function readToken(path: string, help?: string): Promise<string> {
    const token = await readFromFile(path, help);
    const trimmedToken = token.trim();
    if (!trimmedToken) {
        throw new Error(`playwright-selenium-oauth: token at ${path} is empty. ${help}`);
    }
    return trimmedToken;
}
