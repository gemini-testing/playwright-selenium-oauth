import { join } from "path";
import { setup } from "./setup";

jest.mock("console");

describe("setup", () => {
    beforeEach(() => {
        delete process.env.SELENIUM_REMOTE_HEADERS;
    });

    it("should load token from parameter", async () => {
        await setup({ token: "mytoken" });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth mytoken"}`);
    });

    it("should load token from file", async () => {
        await setup({ tokenFilePath: join(__dirname, "./test-fixtures/setup-testtoken") });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth mytesttoken123"}`);
    });

    it("should force to provide either token or tokenFilePath", async () => {
        await expect(setup({})).toThrowErrorMatchingInlineSnapshot();
    });

    it("should log warning if both token and tokenFilePath specified", async () => {
        await setup({ token: "mytoken", tokenFilePath: join(__dirname, "./test-fixtures/setup-testtoken") });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth mytoken"}`);
        expect(console.warn).toHaveBeenCalledWith("sad"); // TODO
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
        await expect(setup({ token: "mytoken" })).toThrowErrorMatchingInlineSnapshot();
    });

    it("should throw if token is empty", async () => {
        await expect(setup({ token: "     " })).toThrowErrorMatchingInlineSnapshot();
    });

    it("should throw if token is empty - from file", async () => {
        await expect(
            setup({ tokenFilePath: join(__dirname, "./test-fixtures/setup-testtoken-empty") }),
        ).toThrowErrorMatchingInlineSnapshot();
    });
});
