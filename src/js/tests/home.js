import assert from 'assert';
import Home from './../home';

describe('Home', function() {
    describe('#greet()', function() {
        it('should return HENKIE', function() {
            var h = new Home();
            assert.equal('HENKIE', h.greet());
        });
    });
});