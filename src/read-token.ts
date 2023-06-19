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
    console.log(`playwright-selenium-oauth: reading token at ${path}`);
    return await readFromFile(path, help);
}
