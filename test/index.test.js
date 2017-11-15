'use strict';

const expect = require('chai').expect;
const joi = require('joi');
const World = require('../');
let instance = null;

describe('cucumber-enhancement test case', () => {
    beforeEach(() => {
        instance = new World({
            attach: () => {},
            parameters: {}
        });
    });

    it('should be able to set and get specific properties', () => {
        instance.setAttribute('foo', 'bar');
        instance.setAttribute('one.two', 'baz');
        instance.setAttribute('one.three', 'bat');
        const data = instance.getAttributes(joi.any());

        expect(data).to.have.property('foo', 'bar');
        expect(data).to.have.property('one');
        expect(data.one).to.have.property('two', 'baz');
        expect(data.one).to.have.deep.property('three', 'bat');
    });

    it('should be able to set properties by object', () => {
        instance.setAttributes({
            foo: 'bar',
            one: {
                two: 'baz'
            }
        });
        const data = instance.getAttributes({
            foo: joi.string()
        });

        expect(data).to.have.property('foo', 'bar');
        expect(data).to.have.property('one');
        expect(data.one).to.have.property('two', 'baz');
    });

    it('should fail writing to non-objects', () => {
        instance.setAttributes({
            foo: 'bar'
        });
        expect(instance.setAttribute.bind(instance, 'foo.bar', 'baz'))
            .to.throw('Unable to set a non-object foo: string');
    });

    it('should be able to getAttributes values based on validation rules', () => {
        instance.setAttribute('foo', 'bar');
        expect(instance.getAttributes.bind(instance, {
            foo: joi.number()
        })).to.throw('"foo" must be a number');
    });
});
