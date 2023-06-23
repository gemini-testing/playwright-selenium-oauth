export class PlaywrightSeleniumError extends Error {
    constructor(message: string) {
        super(`[playwright-selenium-oauth]: ${message}`);
    }
}
