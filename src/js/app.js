'use strict';

var Home = require('./home');

class App {

    constructor() {

        var h = new Home();
        h.greet();
    }
}

new App();
