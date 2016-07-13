var expect = require('chai').expect;
var TabletopNameHelper = require('../../../lib/util/tabletop_name_helper');

describe('TabletopNameHelper', function () {
    describe('#baseFileNameForUrl()', function () {
        it('returns the name tabletop simulator would use for a url', function () {
            expect(TabletopNameHelper.baseFileNameForUrl('https://www.dropbox.com/s/mssmi4ytm578avs/Di_%e.jpg?dl=1')).to
                .equal('httpswwwdropboxcomsmssmi4ytm578avsDiejpgdl1');
        });
    });
});