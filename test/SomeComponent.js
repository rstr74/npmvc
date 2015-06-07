
module.exports = function(include, puremvc) {
	if(puremvc.validateIncludePaths==true) {
		include("SomeOthercomponent");
	}
	
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