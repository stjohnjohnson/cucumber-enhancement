var expect = require('chai').expect;

module.exports = function () {

    this.When(/^I list the branches$/, {
        api: this.joi.string(),
        token: this.joi.string(),
        owner: this.joi.string(),
        repo: this.joi.string()
    }, function (data, callback) {
        this.request({
            method: 'GET',
            uri: [
                data.api, 'repos', data.owner, data.repo, 'branches'
            ].join('/'),
            qs: {
                access_token: data.token
            }
        }, function (err, message, response) {
            if (err) {
                throw err;
            }

            callback(null, {
                branches: response.map(function (obj) {
                    return obj.name;
                })
            });
        });
    });

    this.Then(/^I should see "([^"]*)" as one of the branches$/, {
        branches: this.joi.array()
    }, function (data, branch, callback) {
        expect(data.branches).to.contain(branch);

        setImmediate(callback);
    });

};
