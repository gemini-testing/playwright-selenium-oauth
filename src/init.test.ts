import { join } from "path";
import { init } from "./init";

describe("init", () => {
    it("should load token from file and into environment", async () => {
        await init({ tokenFilePath: join(__dirname, "./testtoken") });
        expect(process.env.SELENIUM_REMOTE_HEADERS).toBe(`{"Authorization":"OAuth mytesttoken123"}`);
    });
});
