/*global describe, it, beforeEach, afterEach */
var expect = require('chai').expect,
    mockery = require('mockery'),
    joi = require('joi'),
    sinon = require('sinon'),
    world = {},
    requestMock;

describe('world request test case', function () {
    beforeEach(function () {
        mockery.enable({
            warnOnUnregistered: false,
            useCleanCache: true
        });

        world = {};
        requestMock = sinon.stub().yieldsAsync();
        mockery.registerMock('request', requestMock);
        require('../lib/world').call(world);
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('World', function () {
        describe('store/retrieve', function () {
            it('should be able to set and get specific properties', function (next) {
                world.World(function (instance) {
                    instance.store('foo', 'bar');
                    instance.store('one.two', 'baz');
                    instance.store('one.three', 'bat');
                    var data = instance.retrieve(joi.any());
                    expect(data).to.have.property('foo', 'bar');
                    expect(data).to.have.property('one');
                    expect(data).to.have.deep.property('one.two', 'baz');
                    expect(data).to.have.deep.property('one.three', 'bat');
                    next();
                });
            });

            it('should be able to set properties by object', function (next) {
                world.World(function (instance) {
                    instance.store({
                        foo: 'bar',
                        one: {
                            two: 'baz'
                        }
                    });
                    var data = instance.retrieve({
                        foo: joi.string()
                    });
                    expect(data).to.have.property('foo', 'bar');
                    expect(data).to.have.property('one');
                    expect(data).to.have.deep.property('one.two', 'baz');
                    next();
                });
            });

            it('should be able to retreive values based on validation rules', function (next) {
                world.World(function (instance) {
                    instance.store('foo', 'bar');
                    expect(instance.retrieve.bind(instance, {
                        foo: joi.number()
                    })).to.throw('foo must be a number');
                    next();
                });
            });
        });

        describe('default/request', function () {
            it('should be able make an API call', function (next) {
                world.World(function (instance) {
                    instance.request({
                        foo: 'bar'
                    }, function () {
                        expect(this).to.equal(instance);
                        expect(requestMock.calledWith({
                            foo: 'bar'
                        })).to.be.true();
                        next();
                    });
                });
            });

            it('should be able to default API settings', function (next) {
                world.World(function (instance) {
                    instance.default('blah', 'baz');
                    instance.request({
                        foo: 'bar'
                    }, function () {
                        expect(this).to.equal(instance);
                        expect(requestMock.calledWith({
                            foo: 'bar',
                            blah: 'baz'
                        })).to.be.true();
                        next();
                    });
                });
            });
        });
    });

    // describe('defineStepWithRequirements', function () {
    //     it('should')
    // });
});
