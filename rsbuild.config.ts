import { defineConfig } from "@rsbuild/core";
import { PurgeCSSPlugin } from "purgecss-webpack-plugin";

const isProduction = process.env.NODE_ENV === "production";

// This is a hack to make purgecss-webpack-plugin working with rspack
(Array.prototype as unknown as Set<unknown>).has = Array.prototype.includes;

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
	tools: {
		rspack: (_, { appendPlugins, isDev }) => {
			if(isDev) return;

			// Using postcss-purgecss is an alternative,
			// but that will result in chunks being processed separately.
			appendPlugins(new PurgeCSSPlugin({
				paths: ["./src/public/index.html"],
				variables: true,
				safelist: {},
				blocklist: [],
			}));
		},
	},
});
