module.exports = function () {

    this.Given(/^I am on the "([^/"]*)\/([^"]*)" repository on GitHub$/, function (owner, repo, callback) {
        callback(null, {
            owner: owner,
            repo: repo,
            api: 'https://api.github.com',
            token: process.env.ACCESS_TOKEN
        });
    });

};
