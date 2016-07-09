var assert = require('chai').assert;
var UrlHelper = require('../../../lib/util/url_helper');

describe('UrlHelper', function () {
    describe('#removeSpecialSuffixesOnUrl()', function () {
        it('should remove symbols from filenames that cause issues with reading or writing', function () {
            assert.equal(UrlHelper.removeSpecialSuffixesOnUrl("test{Unique}"), "test");
            assert.equal(UrlHelper.removeSpecialSuffixesOnUrl("test?dl=1"), "test");
        });
    });
});