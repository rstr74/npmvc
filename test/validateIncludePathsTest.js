var assert = require("assert");
var should = require("should");
var debug = require('debug')('test');

var puremvc = require("../index.js");

puremvc.validateIncludePaths = true;


debug("This test has to create a Cannot resolve Error:");
// This should generate an Error when puremvc.validateIncludePaths is TRUE
puremvc.include("someComponent",__dirname);

var someComponent = new test.SomeComponent();
someComponent.init().should.equal("Some Result");




