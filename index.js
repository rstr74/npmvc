var fs = require("fs");
var ___path = require("path");
var exists      =  fs.exists || ___path.exists;
var format      =  require('util').format;

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
	// check if include Paths are correctly cased
	scope.validateIncludePaths = false;


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

			// If exists, the file is located in the scope.basePath,
			// or a temp path is given and it add up to an actual class file
			
			//console.log("_path:",_path);
			//console.log("basePath:",scope.basePath);
			if(scope.validateIncludePaths) scope.exists(_path);
				return require(_path)(scope.include, scope, callback);

		} else {
			// Now it can be pointing to a class file in a module in npm 'node_modules' dir:
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

				// if class_basedir_file lacks a slash between class_basedir and the variable file, it create a invalid path, which is intended.
				// This fails the exists test below and that points out it is a module, not an actual class file.
				// class_basedir_file assignment above this comment, could produce for example:
				// some_npm_module/SomeOtherComponentFromOtherModuleInRootDir.js which does not exists, so will skip
				// to the else statement below this comment.
				
				var exists = fs.existsSync(class_basedir_file);
				//console.log("exists",exists);
				if (exists) {
					// It points to an existing file in a path to a module. 
					if(scope.validateIncludePaths) scope.exists(class_basedir_file);
					return require(class_basedir_file)(scope.include, scope, callback);
				} else {
					// It does not exists, so it seem module name referece.
					// Now try to resolve this module by the package.json "main" property
					var resolvedPlugin = require.resolve(modulename);
					var exists = fs.existsSync(resolvedPlugin);
					if (exists) {
						if(scope.validateIncludePaths) scope.exists(resolvedPlugin);
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

	
	scope.exists = function(fullRequiredPath) { 

	// inspired on the exist method of npm module valiquire
	// https://github.com/thlorenz/valiquire/blob/master/validate-requires.js#L71
	// 
	// Copyright 2012 Thorsten Lorenz. 
	// All rights reserved.

	// Permission is hereby granted, free of charge, to any person
	// obtaining a copy of this software and associated documentation
	// files (the "Software"), to deal in the Software without
	// restriction, including without limitation the rights to use,
	// copy, modify, merge, publish, distribute, sublicense, and/or sell
	// copies of the Software, and to permit persons to whom the
	// Software is furnished to do so, subject to the following
	// conditions:

	// The above copyright notice and this permission notice shall be
	// included in all copies or substantial portions of the Software.

	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	// OTHER DEALINGS IN THE SOFTWARE.
	
    var warning = [];
    // Check directory
    // cwd() gives us the path in correct casing, no function of fs/path module does that 
    var dir = ___path.dirname(fullRequiredPath);
    //fullRequiredPath
    var header;
    process.chdir(dir);
    var exactPath = process.cwd();

    if (exactPath !== dir) {
    	header = format('[ PureMVC Include Path warning: Case sensitive warning in path:\n');
     	warning.push(format('%s"%s" \nDoesn\'t exactly match the actual directory path: \n"%s"]', header, dir, exactPath));
    }

    // Check filename
    var fullFileName = ___path.basename(require.resolve(fullRequiredPath));
    
    var entries = fs.readdirSync(dir);

   
      if (~entries.indexOf(fullFileName)) {
      	
      } else {

      var matchingEntry;
      
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].toLowerCase() === fullFileName.toLowerCase()) {
          matchingEntry = entries[i];
          break;
        }
      }
      	header = format('[ PureMVC Include warning: Case sensitive warning for class or file:\n');
     	warning.push(format('%s"%s" \ndoesn\'t exactly match the actual file path: \n"%s"]', header, fullRequiredPath, ___path.join(dir, matchingEntry)));
      }


    if (warning.length > 0) {
    	for(var warn in warning) {
    		console.warn(warning[warn] + '\n');
    	}
   	}
}

	return scope;

})(module.exports);