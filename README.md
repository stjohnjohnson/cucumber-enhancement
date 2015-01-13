# cucumberjs-enhancement

Enhances cucumber.js to make it easier to interact between steps.

### Simple usage

* Create a file `features/support/enhancement-hook.js` as follows

```
module.exports = require('cucumber-enhancement');
```

This does the following:

* Adds an additional argument to the step callback that saves the values for use in other steps:

```javascript
this.Given(/^I am on the "([^/"]*)\/([^"]*)" repository on GitHub$/, function (owner, repo, callback) {
    // This saves owner and repo for use in other steps
    callback(null, {
        owner: owner,
        repo: repo
    });
});
```

* Adds a new optional argument to `when`, `then`, and `given` to require data saved from other steps:

```javascript
this.Then(/^I should see "([^"]*)" as one of the branches$/, {
    branches: this.joi.array()
}, function (data, branch, callback) {
    // data.branches contains data saved from another step
    expect(data.branches).to.contain(branch);

    setImmediate(callback);
});
```

* Exposes [`joi`](https://www.npmjs.com/package/joi) interface for quick access during step definition (see above).

* Bakes [`request`](https://www.npmjs.com/package/request) module into the world for easy access and automatically sets the scope of the callback function:

```javascript
this.request({
    method: 'GET',
    uri: 'http://foo.yahoo.com/'
}, function (err, message, response) {
    callback(null, {
        'bar': Object.keys(response)
    });
});
```

* Allows you to default values for the request module (mostly used by cucumber @tags):

```javascript
this.Before("@github_api", function(callback) {
    this.default('headers.User-Agent', 'Cucumber Test');
    this.default('json', true);

    setImmediate(callback);
});
```
