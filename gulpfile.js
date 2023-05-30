const $ = require("gulp-load-plugins")();
const gulp = require("gulp");
const sass = require("sass");

const htmlSource = "src/public/index.html";

const purgeOption = {
	content: [htmlSource],
	safelist: {
		variables: [
			"--bs-primary",
			/^--bs-btn-disabled/,
			/^--bs-nav-tabs/,
		],
	},
	// for Bootstrap
	variables: true,
};

gulp.task("css", () =>
	gulp.src("src/public/style.scss")
		.pipe($.newer({
			dest: "docs/style.css",
			extra: [__filename, htmlSource]
		}))
		.pipe($.sass(sass)({
			outputStyle: "compressed",
		}))
		.pipe($.purgecss(purgeOption))
		.pipe(gulp.dest("docs"))
);

gulp.task("html", () =>
	gulp.src(htmlSource)
		.pipe($.newer({
			dest: "docs/index.html",
			extra: [__filename]
		}))
		.pipe($.htmlMinifierTerser({
			"collapseWhitespace": true,
			"removeComments": true,
			"minifyJS": {
				"ie8": true
			}
		}))
		// Avoid VS Code Linter warnings
		.pipe($.replace(/<script>(.+?)<\/script>/g, "<script>$1;</script>"))
		.pipe(gulp.dest("docs"))
);

gulp.task("fa", () =>
	gulp.src(htmlSource)
		.pipe($.fontawesome())
		.pipe(gulp.dest("docs/lib"))
);

gulp.task("default", gulp.parallel("css", "html"));
