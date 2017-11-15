'use strict';

const { defineSupportCode } = require('cucumber');
const request = require('request');

defineSupportCode(({ Before }) => {
    Before('@github_api', function () {
        const world = this;

        world.setAttribute('request', request.defaults({
            headers: { 'User-Agent': 'Cucumber Test' },
            json: true
        }));
    });
});
