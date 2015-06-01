var assert = require("assert");
var should = require("should");
var debug = require('debug')('test');

var puremvc = require("../index.js");

puremvc.validateIncludePaths = true;

// This should generate warnings
puremvc.include("some_npm_module/Some/path/SomeOtherComponentFromOtherModule");
var someOtherComponentFromOtherModule = new test.SomeOtherComponentFromOtherModule();
someOtherComponentFromOtherModule.init().should.equal("Some Other Result from an other npm module");


debug("test should produce some warnings");