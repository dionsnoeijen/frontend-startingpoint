var assert = require('assert');

var Home = require('./../home');

describe('Home', function() {
    describe('#greet()', function() {
        it('should return HENKIE', function() {
            var h = new Home();
            assert.equal('HENKIE', h.greet());
        });
    });
});