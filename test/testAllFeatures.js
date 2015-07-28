var assert = require("assert");
var should = require("should");
var debug = require('debug')('test');
var os = require('os');
var puremvc = require("../index.js");


puremvc.should.be.an.instanceOf(Object).and.have.property('include');
puremvc.should.be.an.instanceOf(Object).and.have.property('getSourceDir');
puremvc.should.be.an.instanceOf(Object).and.have.property('setSourceDir');

puremvc.setSourceDir(__dirname);
var sourceDir = puremvc.getSourceDir();

sourceDir.should.equal(__dirname);
debug("ok....Default source dir is __dirname "+__dirname);

puremvc.setSourceDir(__dirname+"/resources/src");

// only test validate on a mac
if(os.platform() == 'darwin') {
	puremvc.validateIncludePaths = true;
	puremvc.throwErrors = false;

	// This should generate errors
	var e = puremvc.include("some_npm_module/Some/path/SomeOtherComponentFromOtherModule");
	e.should.be.a.Error;

	debug("ok....Case sensitive error for paths");

	// This should generate errors
	e = puremvc.include("somecomponent",__dirname+"/resources");
	e.should.be.a.Error;
	debug("ok....Case sensitive error for filenames");

	// This should generate errors
	e = puremvc.include("SomeComponent",__dirname+"/resources");
	e.should.equal("OK");
	debug("ok....Works when no Case sensitive errors occcurs");
}

puremvc.include("AppConstants");
test.AppConstants.TEST_CONSTANT.should.equal("SOME_CONSTANT");
debug("ok....includes a class and it can be instantiated");

// override default sourceDir by tempPath parameter
puremvc.include("SomeComponent",__dirname+"/resources");

var someComponent = new test.SomeComponent();
someComponent.init().should.equal("Some Result");
debug("ok....override with tempPath then includes a class and it can be instantiated");

// test some class in some module
puremvc.include("some_npm_module/some/path/SomeOtherComponentFromOtherModule");
var someOtherComponentFromOtherModule = new test.SomeOtherComponentFromOtherModule();
someOtherComponentFromOtherModule.init().should.equal("Some Other Result from an other npm module");
debug("ok....test some class in some module");

// test some class in some module
puremvc.include("some_npm_module/SomeOtherComponentFromOtherModuleInRootDir");
var someOtherComponentFromOtherModuleInRootDir = new test.SomeOtherComponentFromOtherModuleInRootDir();
someOtherComponentFromOtherModuleInRootDir.init().should.equal("Some Other Result from the root of another npm module");
debug("ok....test some class in some module");

// test some class in some module
puremvc.include("another_npm_module");
var someOtherComponentFromOtherModuleAsIndexFile = new test.SomeOtherComponentFromOtherModuleAsIndexFile();
someOtherComponentFromOtherModuleAsIndexFile.init().should.equal("Root index file");
debug("ok....test some class in some module");

// test callback
puremvc.include("SomeOtherComponent",null,function(result){
	result.should.equal("Result from callback");
	debug("ok....test callbacks");
}.bind(this));


// test registerModule
puremvc.include("npmvctestmodule");
puremvc.module("npmvctestmodule").should.be.an.instanceOf(Object).and.have.property('name');
debug("ok....npmvctestmodule config has a name propery");
puremvc.module("npmvctestmodule").name.should.equal("npmvctestmodule");
debug("ok....npmvctestmodule config has a name; npmvctestmodule");
puremvc.module("npmvctestmodule").should.be.an.instanceOf(Object).and.have.property('sourceDir');
debug("ok....npmvctestmodule config has a sourceDir property");
puremvc.module("npmvctestmodule").should.be.an.instanceOf(Object).and.have.property('sourcedir');
debug("ok....npmvctestmodule config has a sourcedir property");
puremvc.module("npmvctestmodule").should.be.an.instanceOf(Object).and.have.property('include');
debug("ok....npmvctestmodule config has a include property");
var someMediator = new com.domain.npmvctestmodule.mediator.SomeMediator();
someMediator.init().should.equal("com.domain.npmvctestmodule.mediator.SomeMediator");
debug("ok....npmvctestmodule SomeMediator.NAME equals com.domain.npmvctestmodule.mediator.SomeMediator");

debug("done..completed successfull");
process.exit(0);
