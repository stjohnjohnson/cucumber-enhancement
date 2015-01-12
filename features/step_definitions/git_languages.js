var expect = require('chai').expect;

module.exports = function () {

    this.When(/^I list the languages$/, {
        api: this.joi.string(),
        token: this.joi.string(),
        owner: this.joi.string(),
        repo: this.joi.string()
    }, function (data, callback) {
        this.request({
            method: 'GET',
            uri: [
                data.api, 'repos', data.owner, data.repo, 'languages'
            ].join('/'),
            qs: {
                access_token: data.token
            }
        }, function (err, message, response) {
            if (err) {
                throw err;
            }

            callback(null, {
                'languages': Object.keys(response)
            });
        });
    });

    this.Then(/^I should see "([^"]*)" as one of the languages$/, {
        languages: this.joi.array()
    }, function (data, language, callback) {
        expect(data.languages).to.contain(language);

        setImmediate(callback);
    });

};
