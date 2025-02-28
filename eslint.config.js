import globals from "globals"
import pluginJs from "@eslint/js"
import pluginReact from "eslint-plugin-react"

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		env: {
			browser: true,
			es2021: true,
		},
		extends: [
			"eslint:recommended",
			"plugin:react/recommended",
			"plugin:prettier/recommended",
		],
		parserOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
		},
		plugins: ["react"],
		files: ["src/**/*.js"],
		ignores: ["**/*.config.js"],
		rules: {
			"react/react-in-jsx-scope": "off",
		},
	},
]
