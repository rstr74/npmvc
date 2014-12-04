module.exports = function(include, puremvc) {

	/**
	 * @class test.SomeOtherComponentFromOtherModuleInRootDirtest.
	 * @extends puremvc.Facade
	 */
	puremvc.define({
		name: 'test.SomeOtherComponentFromOtherModuleInRootDir',
		constructor: function() {

		}
	}, {
		/**
		 * @method init
		 * @return {[type]} [description]
		 */
		init: function() {
			return "Some Other Result from the root of another npm module";
		}
	}, {

		/**
		 * @static
		 * @type {string}
		 */
		NAME: 'test.SomeOtherComponentFromOtherModuleInRootDir'
	})


};