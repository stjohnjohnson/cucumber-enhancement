'use strict';

const { setWorldConstructor } = require('cucumber');
const enhancement = require('../../');

setWorldConstructor(enhancement);
