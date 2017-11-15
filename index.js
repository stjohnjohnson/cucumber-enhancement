'use strict';

const joi = require('joi');

/**
 * Set a dot-deliminated value in an object
 * @internal
 * @method setValue
 * @param {Object} object Object to manipulate
 * @param {String} search Dot-deliminated key
 * @param {Varied} value  Value to set to
 */
function setValue(object, search, value) {
    const keys = search.split('.');
    const last = keys.length - 1;
    let ref = object;

    keys.forEach((key, index) => {
        if (index === last) {
            ref[key] = value;
        } else if (!ref[key]) {
            ref[key] = {};
        } else if (typeof ref[key] !== 'object') {
            throw new Error(`Unable to set a non-object ${key}: ${typeof ref[key]}`);
        }
        ref = ref[key];
    });
}

module.exports = function ({ attach, parameters }) {
    const world = this;

    // Load defaults
    world.attach = attach;
    world.parameters = parameters;

    /**
     * Internal attributes saved by the steps
     * @internal
     * @type {Object}
     */
    world._attributes = {};

    /**
     * Store some value to be used in a later step
     * @method setAttributes
     * @param {String} key    Dot-deliminated key
     * @param {Varied} value  Value to store to
     */
    world.setAttributes = (key, value) => {
        if (typeof key === 'object') {
            Object.keys(key).forEach((k) => {
                setValue(world._attributes, k, key[k]);
            });
        } else {
            setValue(world._attributes, key, value);
        }
    };
    world.setAttribute = world.setAttributes;

    /**
     * Validate and retrieve the attributes this step needs
     * @method getAttributes
     * @param  {Object} schema Joi validation schema
     * @return {Object}        Values you were validating
     */
    world.getAttributes = (schema) => {
        const result = joi.validate(world._attributes, schema, {
            allowUnknown: true,
            presence: 'required'
        });

        if (result.error) {
            throw new Error(result.error.details.map(detail => detail.message).join('\n'));
        }

        return result.value;
    };

    world.joi = joi;
};
