var assert = require('chai').assert;
var JsonFixer = require('../../../lib/util/json_fixer');

describe('JsonFixer', function () {
    var original = '{\n"a":{\n "b": Infinity}}';
    var fixed = '{\n"a":{\n "b": "Infinity;;BROKEN"}}';

    describe('#fixJson()', function () {
        it('removes invalid Infinity symbols', function () {
            assert.equal(JsonFixer.fixJson(original), fixed);
        });
    });

    describe('#breakJson()', function(){
       it('rewrites json with TTS-invalid syntax', function(){
           assert.equal(JsonFixer.breakJson(fixed), original);
       });
    });
});