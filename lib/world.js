var hoek = require('hoek'),
    joi = require('joi'),
    request = require('request');

/**
 * Set a dot-deliminated value in an object
 * @internal
 * @method setValue
 * @param {Object} object Object to manipulate
 * @param {String} key    Dot-deliminated key
 * @param {Varied} value  Value to set to
 */
function setValue(object, key, value) {
    var keys = key.split('.'),
        last = keys.length - 1,
        ref = object;

    keys.forEach(function (key, index) {
        if (index === last) {
            ref[key] = value;
        } else if (!ref[key]) {
            ref[key] = {};
        } else if (typeof ref[key] !== 'object') {
            throw new Error('Unable to set a non-object ' + key + ': ' + typeof ref[key]);
        }
        ref = ref[key];
    });
}

module.exports = function () {
    this.World = function (callback) {
        callback(Object.freeze({
            /**
             * Internal values saved by the steps
             * @internal
             * @type {Object}
             */
            _values: {},

            /**
             * Default values in all requests
             * @internal
             * @type {Object}
             */
            _defaults: {},

            /**
             * Set a default key to the request object
             * @method default
             * @param {String} key    Dot-deliminated key
             * @param {Varied} value  Value to set to
             */
            default: function (key, value) {
                setValue(this._defaults, key, value);
            },

            /**
            * Store some value to be used in a later step
            * @method store
            * @param {String} key    Dot-deliminated key
            * @param {Varied} value  Value to store to
            */
            store: function (key, value) {
                if (typeof key === 'object') {
                    Object.keys(key).forEach(function (k) {
                        setValue(this._values, k, key[k]);
                    }.bind(this));
                } else {
                    setValue(this._values, key, value);
                }
            },

            /**
             * Validate and retrieve the values this step needs
             * @method retrieve
             * @param  {Object} schema Joi validation schema
             * @return {Object}        Values you were validating
             */
            retrieve: function (schema) {
                var result = joi.validate(this._values, schema, {
                    allowUnknown: true,
                    presence: 'required'
                });

                if (result.error) {
                    throw new Error(result.error.annotate());
                }

                return result.value;
            },

            /**
             * Make an API call
             * @method request
             * @param  {Object}   options  Request options
             * @param  {Function} callback Function to run when done (err, request, response)
             */
            request: function (options, callback) {
                request(hoek.applyToDefaults(this._defaults, options), callback.bind(this));
            }
        }));
    };

    /**
     * Define a step with requirements
     * @defineStepWithRequirements
     * @param {String}   regex          Regex to match
     * @param {Object}   [requirements] Joi object requirements
     * @param {Function} callback       Function to run when done ([requirements], [args..], callback)
     */
    this.defineStepWithRequirements = function (regex, requirements, callback) {
        // requirements is not required
        if (!callback) {
            callback = requirements;
            requirements = null;
        }

        this.defineStep(regex, function () {
            var args = Array.prototype.slice.call(arguments),
                next = args.pop();

            if (requirements) {
                args = [this.retrieve(requirements)].concat(args);
            }
            args.push(function (err, data) {
                this.store(data || {});
                next(err);
            }.bind(this));

            callback.apply(this, args);
        });
    };

    this.When = this.defineStepWithRequirements;
    this.Given = this.defineStepWithRequirements;
    this.Then = this.defineStepWithRequirements;
    this.joi = joi;
};
