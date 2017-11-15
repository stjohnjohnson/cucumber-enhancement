# cucumber-enhancement

Enhances cucumber.js to make it easier to interact between steps.

### Simple usage

* Create a file `features/step_definitions/world-enhance.js` as follows

```
const {setWorldConstructor} = require('cucumber');

setWorldConstructor(require('cucumber-enhancement'));
```

This modifies the World object to do the following:

* Write attributes for later retrieval:

```javascript
Given(/^I am on the "([^/"]*)\/([^"]*)" repository on GitHub$/, function (owner, repo) {
    // This saves owner and repo for use in other steps
    this.setAttributes({
        owner,
        repo
    });
});
```

* Read attributes from previous steps:

```javascript
Then(/^I should see "([^"]*)" as one of the branches$/, function (branch) {
    const data = this.getAttributes({
        branches: this.joi.array()
    });

    // data.branches contains data saved from another step
    expect(data.branches).to.contain(branch);
});
```

* Exposes [`joi`](https://www.npmjs.com/package/joi) interface for quick access during step definition (see above).
