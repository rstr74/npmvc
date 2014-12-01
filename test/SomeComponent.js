module.exports = function(include, puremvc) {
	/**
	 * @class rstr74.ApplicationFacade
	 * @extends puremvc.Facade
	 */
	puremvc.define({
		name: 'test.SomeComponent',
		constructor: function() {

		}
	}, {
		/**
		 * @method init
		 * @return {[type]} [description]
		 */
		init: function() {
			return "Some Result";
		}
	}, {

		/**
		 * @static
		 * @type {string}
		 */
		NAME: 'test.SomeComponent'
	})
	
};