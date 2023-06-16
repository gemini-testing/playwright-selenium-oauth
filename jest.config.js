module.exports = {
    clearMocks: true,
    globals: {
        "ts-jest": {
            "tsconfig": "tsconfig.spec.json",
        },
    },
    preset: "ts-jest",
    testMatch: [
        "**/src/**/*.test.ts",
    ],
    modulePathIgnorePatterns: [
        "<rootDir>/build",
    ],
    verbose: true,
};
