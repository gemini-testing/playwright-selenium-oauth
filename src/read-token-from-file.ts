import { readFile } from "fs/promises";
import { PlaywrightSeleniumError } from "./playwright-selenium-error";

export async function readTokenFromFile(path: string, help?: string) {
    try {
        return await readFile(path, { encoding: "utf-8" });
    } catch (e) {
        throw new PlaywrightSeleniumError(
            `error reading token from file, path: ${path}. ${help ? `help: ${help}.` : ""} Caused by: ${e}. `,
        );
    }
}
