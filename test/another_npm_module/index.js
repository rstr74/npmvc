module.exports = function(include, puremvc) {

	/**
	 * @class test.SomeOtherComponentFromOtherModuleInRootDirtest.
	 * @extends puremvc.Facade
	 */
	puremvc.define({
		name: 'test.SomeOtherComponentFromOtherModuleAsIndexFile',
		constructor: function() {

		}
	}, {
		/**
		 * @method init
		 * @return {[type]} [description]
		 */
		init: function() {
			return "Root index file";
		}
	}, {

		/**
		 * @static
		 * @type {string}
		 */
		NAME: 'test.SomeOtherComponentFromOtherModuleAsIndexFile'
	})


};