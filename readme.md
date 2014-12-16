[![Build Status](https://travis-ci.org/rstr74/npmvc.svg?branch=master)](https://travis-ci.org/rstr74/npmvc)

#PureMVC for node.js

###Modification of the [multicore javascript](https://github.com/PureMVC/puremvc-js-multicore-framework/wiki) port for use in a node.js environment.

This is the master repository of the npm ```npmvc``` module.

The main goal of this module is to add more flexibility and modulairity within the use of the combination of Node.js and the PureMVC framework. The module enables the aggregation of PureMVC classes in a local file structure or/and in seperated modules.

It adds an ```include``` method on top of the official multicore PureMVC JavaScript library (currently version 1.0.1). This method is based on the node.js ```require``` method and is added to the puremvc namespace. (See API specs below).

You can use the ```include``` function to include dependecies that are located local or in other npm modules. Class files are wrapped the node.js module.export style (see Creating external class files).


#install

```
npm install npmvc
```

#setup a puremvc project in node.js

When installed you can use it like this
```js

var puremvc = require("npmvc");

puremvc.setSourceDir(__dirname+"/src");
puremvc.include("AppConstants");
puremvc.include("ApplicationFacade");

// make instance of ApplicationFacade and trigger start command
var app = test.ApplicationFacade.getInstance(test.ApplicationFacade.NAME);
app.start();

```

#Creating external class files
```js
module.exports = function(include,puremvc) {

// use include te aquire dependency class files
include("controller/StartCommand");

// ---> now you can use puremvc.define to define class
/**
 * @class test.ApplicationFacade
 * @extends puremvc.Facade
 */
puremvc.define(
	{
		name: 'test.ApplicationFacade',
		parent: puremvc.Facade
	},
	{
		/**
		 * @method start
		 * @return {[type]} [description]
		 */
		start: function() {

			this.registerCommand("START", test.controller.StartCommand);
			this.sendNotification("START", {});
		}
	},
	{
		/**
		 * Retrieve an instance of ApplicationFacade. 
		 * If one has not yet been
		 * instantiated, one will be created for you.
		 *
		 * @static
		 * @param {string} multitonKey
		 * @return test.ApplicationFacade
		 */
		getInstance: function(multitonKey) {
			
			var instanceMap = puremvc.Facade.instanceMap;
			instance = instanceMap[multitonKey]; // read from the instance map

			if (instance) // if there is an instance...
				return instance; // return it

			
			return instanceMap[multitonKey] = new test.ApplicationFacade(multitonKey);
		},

		/**
		 * @static
		 * @type {string}
		 */
		NAME: 'test.ApplicationFacade'
	})
};
```


#Extra methods:
This module adds some exra methods on top of the ```puremvc``` root object:

##puremvc.setSourceDir(path:string):void
**path [string]** Sets the source dir for all include's, It uses this for includes on all directory levels. So when you include a dependencie in say ```model/MyProxy``` you have to reference ```model/vo/MyVo``` by using the path up from the sourceDir, not relative to the folder the file is in: 

```
puremvc.include("model/vo/MyVo");
```

If you have to hack this, you can use **tempPath**, the second param of puremvc.include. See below.

Also not that if you do not set the sourceDir it will default to ```process.cwd()``` (the directory where you started the main node file).

----
##puremvc.include(path:String, tempPath:String, callback:function):*

Returns any value, but mainly use for return the reference to the classlets constructor from ```puremvc.define```.

**path [string]**

Path to puremvc class, relative from path set by ```puremvc.setSourceDir```

**tempPath [String]**
This overides the sourceDir. A include of ```MyVo``` in class ```model/vo/MyVo``` would look like this:

```
puremvc.include("vo/MyVo",__dirname);
```

**callback [function]**
You can use an callback, but you have to trigger it in the aquired class file.

You can **include a class in an other npm module** if the file is not equal in the context of your current sourceDir path. So when you want to load the class ```SomeClass``` in the module ```my-npm-module``` then do not use tempPath but use:

```
puremvc.include("my-npm-module/path/to/SomeClass");
```

----
##puremvc.getSourceDir():string
returns the current source directory, root of puremvc classes.
