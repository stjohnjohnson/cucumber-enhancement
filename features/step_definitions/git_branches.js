'use strict';

const { defineSupportCode } = require('cucumber');
const expect = require('chai').expect;

defineSupportCode(({ When, Then }) => {
    When(/^I list the branches$/, function (callback) {
        const world = this;
        const data = world.getAttributes({
            request: world.joi.func(),
            api: world.joi.string(),
            owner: world.joi.string(),
            repo: world.joi.string()
        });

        data.request({
            method: 'GET',
            uri: `${data.api}/repos/${data.owner}/${data.repo}/branches`
        }, (err, message, response) => {
            if (err) {
                return callback(err);
            }

            world.setAttribute('branches', response.map(obj => obj.name));

            return callback();
        });
    });

    Then(/^I should see "([^"]*)" as one of the branches$/, function (branch) {
        const world = this;
        const data = world.getAttributes({
            branches: world.joi.array()
        });

        expect(data.branches).to.contain(branch);
    });
});
