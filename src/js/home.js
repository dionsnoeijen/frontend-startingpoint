'use strict';

var Header = require('./header');

module.exports = class {

    constructor() {
        this.name = 'HENKIE';
        this.header = new Header();
    }

    greet() {

        return this.name;
    }
}
