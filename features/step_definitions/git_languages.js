'use strict';

const { defineSupportCode } = require('cucumber');
const expect = require('chai').expect;

defineSupportCode(({ When, Then }) => {
    When(/^I list the languages$/, function (callback) {
        const world = this;
        const data = world.getAttributes({
            request: world.joi.func(),
            api: world.joi.string(),
            owner: world.joi.string(),
            repo: world.joi.string()
        });

        data.request({
            method: 'GET',
            uri: `${data.api}/repos/${data.owner}/${data.repo}/languages`
        }, (err, message, response) => {
            if (err) {
                return callback(err);
            }

            world.setAttribute('languages', Object.keys(response));

            return callback();
        });
    });

    Then(/^I should see "([^"]*)" as one of the languages$/, function (language) {
        const world = this;
        const data = world.getAttributes({
            languages: world.joi.array()
        });

        expect(data.languages).to.contain(language);
    });
});
