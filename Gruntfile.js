module.exports = function(grunt) {
	grunt.initConfig({
		browserify: {
			dist: {
				options: {
					transform: [
						[
							"babelify", {
								presets: ["babel-preset-es2015"],
							}

						],
						[
							"stringify"
						],
						[
							"node-lessify", {
								includeExtensions: ['.tpl', '.html']
							},
						]
					]
				},
				files: {
					"./dist/vue-table.js": ["./vtable/index.es6"]
				}
			}
		}
	})

	grunt.loadNpmTasks("grunt-browserify");
	grunt.registerTask("build", ["browserify"]);
}