var assert = require("assert");
var should = require("should");
var debug = require('debug')('test');

var puremvc = require("../index.js");

puremvc.validateIncludePaths = true;

// test some class in some module
puremvc.include("some_npm_module/some/path/SomeOtherComponentFromOtherModule");
var someOtherComponentFromOtherModule = new test.SomeOtherComponentFromOtherModule();
someOtherComponentFromOtherModule.init().should.equal("Some Other Result from an other npm module");