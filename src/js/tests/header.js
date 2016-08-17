var assert = require('assert');

var Header = require('./../header');

describe('Home', function() {
    describe('#greet()', function() {
        it('should return PENKIE', function() {
            var h = new Header();
            assert.equal('PENKIE', h.greet());
        });
    });
});