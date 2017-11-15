'use strict';

const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given }) => {
    Given(/^I am on the "([^/"]*)\/([^"]*)" repository on GitHub$/, function (owner, repo) {
        const world = this;

        world.setAttributes({
            owner,
            repo,
            api: 'https://api.github.com'
        });
    });
});
