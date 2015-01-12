module.exports = function () {

    this.Before("@github_api", function(callback) {
        this.default('headers.User-Agent', 'Cucumber Test');
        this.default('json', true);

        setImmediate(callback);
    });
    
};
