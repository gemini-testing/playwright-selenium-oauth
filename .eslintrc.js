module.exports = {
    extends: ["gemini-testing", "plugin:@typescript-eslint/recommended", "prettier"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    root: true,
    parserOptions: {
        ecmaVersion: 2022,
    },
};
