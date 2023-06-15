import { readFile } from "fs/promises";

export async function readToken(path: string): Promise<string> {
    const token = await readFile(path, { encoding: "utf-8" });
    if (!token) {
        throw new Error(`Token found at ${path} is empty`);
    }
    return token;
}
