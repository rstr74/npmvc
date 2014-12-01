var fs = require("fs");
var ___path = require("path");

module.exports = (function(scope) {

	scope = require("./lib/puremvc-1.0.1.js").puremvc;

	/**
	 * Default directory
	 * @type {[type]}
	 */
	scope.basePath = process.cwd();

	/**
	 * Set the default source dir to the classes
	 * @param {[type]} path
	 */
	scope.setSourceDir = function(path) {
		scope.basePath = path;
	};

	scope.getSourceDir = function() {
		return scope.basePath;
	};

	/**
	 * Use this function to include, (require) puremvc class definitions
	 * @param  {[type]}   path/to/class (no .js extension)
	 * @param  {[type]}   tempPath Use this to override default path
	 * @param  {Function} callback You can use an callback, but you have to trigger it in the aquired class file.
	 * @return {[type]}
	 */
	scope.include = function(path, tempPath, callback) {
		var _path = (tempPath || scope.basePath) + "/" + path + ".js";

		var exists = fs.existsSync(_path);

		if (exists === true) {
			return require(_path)(scope.include, scope, callback);
		} else {
			try {
				var modulename = path.split("/")[0];
				//console.log("modulename",modulename);
				var moduledirname = ___path.dirname(require.resolve(modulename));
				//console.log("moduledirname",moduledirname);
				var file = ___path.basename(path);
				//console.log("file",file);
				var class_basedir = path.replace(modulename, "").replace(file, "");
				//console.log("class_basedir",class_basedir);
				var class_basedir_file = moduledirname + class_basedir + file + ".js";
				//console.log("class_basedir_file",class_basedir_file);
				var exists = fs.existsSync(class_basedir_file);
				//console.log("exists",exists);
				if (exists) {
					return require(class_basedir_file)(scope.include, scope, callback);
				} else {
					var resolvedPlugin = require.resolve(modulename);
					var exists = fs.existsSync(resolvedPlugin);
					if (exists) {
						return require(resolvedPlugin)(scope.include, scope, callback);
					} else {
						console.error("can not find " + file + " or module " + modulename);
					}
				}
			} catch (e) {
				console.error(e, ___path.dirname(_path) + " is not found");
				process.exit(e.code);
			}
		}
	}.bind(this);

	return scope;

})(module.exports);