import { join } from "path";
import { setup } from "./setup";

global.console = <Console>(<unknown>{ warn: jest.fn(), error: jest.fn(), log: jest.fn() });

describe("setup", () => {
    beforeEach(() => {
        delete process.env.SELENIUM_REMOTE_HEADERS;
    });

    it("should load token from parameter", async () => {
        await setup({ token: "mytoken" });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth mytoken"}`);
    });

    it("should load token from file", async () => {
        await setup({ tokenFilePath: join(__dirname, "./test-fixtures/testtoken") });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth mytesttoken123"}`);
    });

    it("should throw and display help when file does not exist", async () => {
        await expect(setup({ tokenFilePath: "/i/do/not/exist", help: "i don't need your help" })).rejects
            .toThrowErrorMatchingInlineSnapshot(`
            "[playwright-selenium-oauth]: Error reading token from file, path: /i/do/not/exist. 
            Help: i don't need your help
            Caused by: Error: ENOENT: no such file or directory, open '/i/do/not/exist'. "
        `);
    });

    it("should throw if no token settings have been provided", async () => {
        await expect(setup({})).rejects.toThrowErrorMatchingInlineSnapshot(
            `"[playwright-selenium-oauth]: one of: "token" or "tokenFilePath" arguments must be provided"`,
        );
    });

    it("should throw if both token and tokenFilePath specified", async () => {
        await expect(
            setup({ token: "mytoken", tokenFilePath: join(__dirname, "./test-fixtures/testtoken") }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"[playwright-selenium-oauth]: both "token" and "tokenFilePath" have been provided, please provide only one of them"`,
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
            `"[playwright-selenium-oauth]: error parsing SELENIUM_REMOTE_HEADERS. Caused by SyntaxError: Unexpected token c in JSON at position 0"`,
        );
    });

    it("should throw if token is empty", async () => {
        await expect(setup({ token: "     " })).rejects.toThrowErrorMatchingInlineSnapshot(
            `"[playwright-selenium-oauth]: Token is empty. Please set non-empty token via "token" or "tokenFilePath" arguments."`,
        );
    });

    it("should throw if token is empty - from file", async () => {
        await expect(
            setup({ tokenFilePath: join(__dirname, "./test-fixtures/testtoken-empty") }),
        ).rejects.toThrowErrorMatchingInlineSnapshot(
            `"[playwright-selenium-oauth]: Token is empty. Please set non-empty token via "token" or "tokenFilePath" arguments."`,
        );
    });
});
