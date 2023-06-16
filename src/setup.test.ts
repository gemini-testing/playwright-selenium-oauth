import { join } from "path";
import { setup } from "./setup";

describe("setup", () => {
    it("should load token from file and into environment", async () => {
        await setup({ tokenFilePath: join(__dirname, "./testtoken") });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth mytesttoken123"}`);
    });
});
