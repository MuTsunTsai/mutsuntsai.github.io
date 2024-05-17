import { defineConfig } from "@rsbuild/core";
import purgeCss from "@fullhuman/postcss-purgecss";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
	dev: {
		progressBar: true,
	},
	source: {
		entry: {
			index: "./src/app/index.ts",
		},
	},
	html: {
		template: "./src/public/index.html",
	},
	server: {
		port: 21000,
		publicDir: {
			name: "src/public",
			copyOnBuild: true,
		},
	},
	output: {
		cleanDistPath: isProduction,
		dataUriLimit: 100,
		legalComments: "none",
		polyfill: "off",
		minify: {
			htmlOptions: {
				removeComments: true,
			},
		},
		distPath: {
			root: "docs",
		},
	},
	tools: !isProduction ? undefined : {
		postcss: {
			postcssOptions: {
				plugins: [
					purgeCss({
						variables: true,
						content: ["./src/public/index.html"],
					}),
				],
			},
		},
	},
});
