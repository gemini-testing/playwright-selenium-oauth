import { readFile } from "fs/promises";

export async function readToken(path: string): Promise<string> {
    const token = await readFile(path, { encoding: "utf-8" });
    const trimmedToken = token.trim();
    if (!trimmedToken) {
        throw new Error(`Token found at ${path} is empty`);
    }
    return trimmedToken;
}
