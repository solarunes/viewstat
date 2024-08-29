import rules from "eslint-config-solarunes";


const ignorePattern = [ "**/build/*", "**/dev/*.dev.js", "docs/**" ];

export default [
	{
		languageOptions: {
			sourceType: "module"
		},
		ignores: ignorePattern
	},
	{
		...rules[ 0 ],
		ignores: ignorePattern
	}
];
