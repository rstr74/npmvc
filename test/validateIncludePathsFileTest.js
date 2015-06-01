var assert = require("assert");
var should = require("should");
var debug = require('debug')('test');

var puremvc = require("../index.js");

puremvc.validateIncludePaths = true;

// This should generate warnings
puremvc.include("someComponent",__dirname);

var someComponent = new test.SomeComponent();
someComponent.init().should.equal("Some Result");