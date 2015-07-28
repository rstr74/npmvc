var fs = require("fs");
var ___path = require("path");
var exists = fs.exists || ___path.exists;
var format = require('util').format;
var os = require('os');

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

	// option for check if include Paths are correctly cased
	scope.validateIncludePaths = false;

	// option for allowing testing Errors
	scope.throwErrors = true;

	/**
	 * Use this function to include, (require) puremvc class definitions
	 * @param  {[type]}   path/to/class (no .js extension)
	 * @param  {[type]}   tempPath Use this to override default path
	 * @param  {Function} callback You can use an callback, but you have to trigger it in the aquired class file.
	 * @return {[type]}
	 */
	scope.include = function(path, tempPath, callback) {

		if (scope.validateIncludePaths == true) {
			if (scope.validateIncludePaths == true) {
				if (os.platform().toLowerCase() !== "darwin") {
					// prevent this check on linux or win32 or other platforms than macosx unix
					console.warn('puremvc.validateIncludePaths feature only works when os is "darwin".\n');
					scope.validateIncludePaths = false;
				}
			}
		}

		var _path = ___path.normalize((tempPath || scope.basePath) + "/" + path + ".js");

		var exists = fs.existsSync(_path);

		if (exists === true) {

			// If exists, the file is located in the scope.basePath,
			// or a temp path is given and it add up to an actual class file

			// console.log("_path:", _path);
			// console.log("basePath:", scope.basePath);
			if (scope.validateIncludePaths == true) {
				var e = scope.exists(_path);
				if (e === true) {
					
				} else {
					if(scope.throwErrors)
						throw e
					return e;
				}
			}
			return require(_path)(scope.include, scope, callback);

		} else {
			// Now it can be pointing to a class file in a module in npm 'node_modules' dir:
			try {
				var modulename = path.split("/")[0];
				//console.log("modulename", modulename);
				var moduledirname = ___path.dirname(require.resolve(modulename));
				//console.log("moduledirname",moduledirname);
				var file = ___path.basename(path);
				//console.log("file",file);
				var class_basedir = path.replace(modulename, "").replace(file, "");
				//console.log("class_basedir",class_basedir);
				var class_basedir_file = moduledirname + class_basedir + file + ".js";
				//console.log("class_basedir_file",class_basedir_file);

				// if class_basedir_file lacks a slash between class_basedir and the variable file, it create a invalid path, which is intended.
				// This fails the exists test below and that points out it is a module, not an actual class file.
				// class_basedir_file assignment above this comment, could produce for example:
				// some_npm_module/SomeOtherComponentFromOtherModuleInRootDir.js which does not exists, so will skip
				// to the else statement below this comment.

				var exists = fs.existsSync(class_basedir_file);
				//console.log("exists",exists);
				if (exists) {
					if (scope.validateIncludePaths == true) {
						var e = scope.exists(class_basedir_file);
						if (e === true) {
							// It points to an existing file in a path to a module. 
							
						} else {
							if(scope.throwErrors)
								throw e;
							return e;
						}
					}
					return require(class_basedir_file)(scope.include, scope, callback);
				} else {
					// It does not exists, so it seem module name referece.
					// Now try to resolve this module by the package.json "main" property
					var resolvedPlugin = require.resolve(modulename);
					var exists = fs.existsSync(resolvedPlugin);
					if (exists) {
						if (scope.validateIncludePaths == true) {
							var e = scope.exists(resolvedPlugin);
							if (e === true) {
								// It points to an existing file in a path to a module. 
								return require(resolvedPlugin)(scope.include, scope, callback);
							} else {
								if(scope.throwErrors)
									throw e;
								return e;
							}
						}
						return require(resolvedPlugin)(scope.include, scope, callback);
					} else {
						console.warn("can not find " + file + " or module " + modulename);
					}
				}
			} catch (e) {
				console.warn(e, ___path.dirname(_path) + " is not found");
				process.exit(e.code);
			}
		}
	}.bind(this);


	scope.exists = function(fullRequiredPath) {

		// inspired on the exist method of npm module valiquire
		// https://github.com/thlorenz/valiquire/blob/master/validate-requires.js#L71

		var warning = [];
		// Check directory
		// cwd() gives us the path in correct casing, no function of fs/path module does that 
		var dir = ___path.dirname(fullRequiredPath);
		//fullRequiredPath
		var header;
		process.chdir(dir);
		var exactPath = process.cwd();

		if (exactPath !== dir) {
			header = format('[ PureMVC Include Path warning: Case sensitive warning in path:');
			warning.push(format('%s\n "%s" \nDoesn\'t exactly match the actual directory path: \n"%s"]', header, dir, exactPath));
		}

		// Check filename
		var fullFileName = ___path.basename(require.resolve(fullRequiredPath));

		var entries = fs.readdirSync(dir);


		if (~entries.indexOf(fullFileName)) {
			//console.log("ok");
		} else {

			var matchingEntry;

			for (var i = 0; i < entries.length; i++) {
				//console.log(entries[i].toLowerCase(),fullFileName.toLowerCase());
				if (entries[i].toLowerCase() === fullFileName.toLowerCase()) {
					matchingEntry = entries[i];
					break;
				}
			}
			header = format('[ PureMVC Include warning: Case sensitive warning for class or file:');

			// Only check file reference from stack on unix...			
			warning.push(format('%s\n"%s" \ndoesn\'t exactly match the actual file path: \n"%s"]', header, fullRequiredPath, ___path.join(dir, matchingEntry)));
		}


		if (warning.length > 0) {
			var warnings = "";
			for (var warn in warning) {
				console.warn(warning[warn] );
			}

			var puremvcError = new Error('[PureMVC Case sensitive Error]');
			return puremvcError;
		} else {
			return true;
		}
	}

	/**
	 * contains the basic configurations for npm (puremvc) modules
	 * @type {Object}
	 */
	scope.modules = {};

	/**
	 * returns the basic configuration for a npm (puremvc) module
	 * @param  {String} module The name of the module
	 * @return {Object} A module configuration object
	 */
	scope.module = function(module) {
		if(!scope.modules[module]) {
		console.error("can not find module: "+ module);
		process.exit(1);
		} else {
			return scope.modules[module];
		}
	};

	/**
	 * Registers a new module
	 * @param  {String} dir Directory of the root of the module (best to pass __dirname in index.js)
	 * @return {boolean} returns true if succesfull registered, otherwise false
	 */
	scope.registerModule = function(dir) {
			var _config = require(dir+'/package.json');
			if(!_config.name || !_config.puremvc || !_config.puremvc.sourcedir) {
					console.error("registerModule config error: Please provide configuration in package.json");
					console.error(_config);
					return false;
			}
			_config.puremvc.name = _config.name;
			_config.puremvc.version = _config.version;
			_config.puremvc.sourcedir = _config.puremvc.sourceDir = ___path.normalize(dir+"/"+_config.puremvc.sourcedir);
			scope.modules[_config.name] = _config.puremvc;
			
			//loading local classes
			for(var file in _config.puremvc.include) {
					//console.log(_config.puremvc.include[file]);
					scope.include(_config.puremvc.include[file],  _config.puremvc.sourcedir);
            }
			return true;
	}

	return scope;

})(module.exports);