module.exports = function(include, puremvc, callback) {

	/**
	 * @class rstr74.ApplicationFacade
	 * @extends puremvc.Facade
	 */
	puremvc.define({
		name: 'test.SomeOtherComponent',
		constructor: function() {

		}
	}, {
		/**
		 * @method init
		 * @return {[type]} [description]
		 */
		init: function() {
			return "Some Other Result";
		}
	}, {

		/**
		 * @static
		 * @type {string}
		 */
		NAME: 'test.SomeOtherComponent'
	})
	
	if(callback)
		callback("Result from callback");
};