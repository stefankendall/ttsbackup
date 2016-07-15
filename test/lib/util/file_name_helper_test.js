var assert = require('chai').assert;
var FileNameHelper = require('../../../lib/util/file_name_helper');

describe('FileNameHelper', function () {
    describe('#safe()', function () {
        it('should remove symbols from filenames that cause issues with reading or writing', function () {
            assert.equal(FileNameHelper.safe('a:?/\\$,[]{}()!#b.json'), 'ab.json');
        });

        it('should remove double spaces', function () {
            assert.equal(FileNameHelper.safe('a  b.json'), 'a b.json');
        });

        it('removes asterisks for windows', function () {
            assert.equal(FileNameHelper.safe('a * b.json'), 'a b.json');
        });
    });
});