import assert from 'assert';
import Header from './../header';

describe('Home', function() {
    describe('#greet()', function() {
        it('should return PENKIE', function() {
            var h = new Header();
            assert.equal('PENKIE', h.greet());
        });
    });
});