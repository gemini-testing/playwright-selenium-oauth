import { join } from "path";
import { setup } from "./setup";

global.console = <Console>(<unknown>{ warn: jest.fn(), error: jest.fn(), log: jest.fn() });

describe("setup", () => {
    beforeEach(() => {
        delete process.env.PLAYWRIGHT_SELENIUM_OAUTH_TOKEN;
        delete process.env.SELENIUM_REMOTE_HEADERS;
        (<jest.Mock>(<unknown>global.console.warn)).mockClear();
        (<jest.Mock>(<unknown>global.console.error)).mockClear();
    });

    it("should load token from parameter", async () => {
        await setup({ token: "mytoken" });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth mytoken"}`);
    });

    it("should load token from file", async () => {
        await setup({ tokenFilePath: join(__dirname, "./test-fixtures/setup-testtoken") });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth mytesttoken123"}`);
    });

    it("should load token from environment", async () => {
        process.env.PLAYWRIGHT_SELENIUM_OAUTH_TOKEN = "myenvtoken";
        await setup();
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth myenvtoken"}`);
    });

    it("should force to provide either token or tokenFilePath", async () => {
        await expect(setup({})).rejects.toThrowErrorMatchingInlineSnapshot(
            `"playwright-selenium-oauth: "token" or "tokenFilePath" or PLAYWRIGHT_SELENIUM_OAUTH_TOKEN env var must be provided"`,
        );
    });

    it("should log warning if both token and tokenFilePath specified", async () => {
        await setup({ token: "mytoken", tokenFilePath: join(__dirname, "./test-fixtures/setup-testtoken") });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth mytoken"}`);
        expect(console.warn).toHaveBeenCalledWith(
            'playwright-selenium-oauth: both "token" and "tokenFilePath" have been provided, using "token"',
        );
    });

    it("should enrich existing SELENIUM_REMOTE_HEADERS env variable", async () => {
        process.env.SELENIUM_REMOTE_HEADERS = JSON.stringify({ myheader: "header" });
        await setup({ token: "mytoken" });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"myheader":"header","Authorization":"OAuth mytoken"}`);
    });

    it("should not override existing Authorization header - case insensitive", async () => {
        process.env.SELENIUM_REMOTE_HEADERS = JSON.stringify({ aUthOriZation: "OAuth existingtoken" });
        await setup({ token: "mytoken" });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"aUthOriZation":"OAuth existingtoken"}`);
    });

    it("should throw if existing SELENIUM_REMOTE_HEADERS is unparsable", async () => {
        process.env.SELENIUM_REMOTE_HEADERS = "cant parse me";
        await expect(setup({ token: "mytoken" })).rejects.toThrowErrorMatchingInlineSnapshot(
            `"playwright-selenium-oauth: error parsing SELENIUM_REMOTE_HEADERS. SyntaxError: Unexpected token c in JSON at position 0"`,
        );
    });

    it("should throw if token is empty", async () => {
        await expect(setup({ token: "     " })).rejects.toThrowErrorMatchingInlineSnapshot(
            `"playwright-selenium-oauth: token is empty or only contains spaces"`,
        );
    });

    it("should throw if token is empty - from file", async () => {
        await expect(
            setup({ tokenFilePath: join(__dirname, "./test-fixtures/setup-testtoken-empty") }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"playwright-selenium-oauth: token is empty or only contains spaces"`,
        );
    });
});
