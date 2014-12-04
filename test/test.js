var assert = require("assert");
var should = require("should");
var debug = require('debug')('test');

var puremvc = require("../index.js");

puremvc.should.be.an.instanceOf(Object).and.have.property('include');
puremvc.should.be.an.instanceOf(Object).and.have.property('getSourceDir');
puremvc.should.be.an.instanceOf(Object).and.have.property('setSourceDir');

puremvc.setSourceDir(__dirname);
var sourceDir = puremvc.getSourceDir();

sourceDir.should.equal(__dirname);

puremvc.setSourceDir(__dirname+"/src");
puremvc.include("AppConstants");

test.AppConstants.TEST_CONSTANT.should.equal("SOME_CONSTANT");

// override default sourceDir by tempPath parameter
puremvc.include("SomeComponent",__dirname);

var someComponent = new test.SomeComponent();
someComponent.init().should.equal("Some Result");

// test some class in some module
puremvc.include("some_npm_module/some/path/SomeOtherComponentFromOtherModule");
var someOtherComponentFromOtherModule = new test.SomeOtherComponentFromOtherModule();
someOtherComponentFromOtherModule.init().should.equal("Some Other Result from an other npm module");

// test some class in some module
puremvc.include("some_npm_module/SomeOtherComponentFromOtherModuleInRootDir");
var someOtherComponentFromOtherModuleInRootDir = new test.SomeOtherComponentFromOtherModuleInRootDir();
someOtherComponentFromOtherModuleInRootDir.init().should.equal("Some Other Result from the root of another npm module");

// test some class in some module
puremvc.include("another_npm_module");
var someOtherComponentFromOtherModuleAsIndexFile = new test.SomeOtherComponentFromOtherModuleAsIndexFile();
someOtherComponentFromOtherModuleAsIndexFile.init().should.equal("Root index file");

// test callback
puremvc.include("SomeOtherComponent",null,function(result){
	result.should.equal("Result from callback");
	debug("test completed successfull");
}.bind(this));






