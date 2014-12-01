module.exports = function(include, puremvc) {

	/**
	 * @class test.SomeOtherComponentFromOtherModule
	 * @extends puremvc.Facade
	 */
	puremvc.define({
		name: 'test.SomeOtherComponentFromOtherModule',
		constructor: function() {

		}
	}, {
		/**
		 * @method init
		 * @return {[type]} [description]
		 */
		init: function() {
			return "Some Other Result from an other npm module";
		}
	}, {

		/**
		 * @static
		 * @type {string}
		 */
		NAME: 'test.SomeOtherComponentFromOtherModule'
	})


};